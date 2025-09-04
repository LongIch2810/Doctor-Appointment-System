import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Doctor from 'src/entities/doctor.entity';
import { Repository } from 'typeorm';
import { BodyFilterDoctorsDto } from './dto/bodyFilterDoctors.dto';
import { groupSchedulesByDay } from 'src/utils/groupSchedulesByDay';
import { filter } from 'rxjs';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor) private doctorRepo: Repository<Doctor>,
    private redisCacheService: RedisCacheService,
  ) {}

  async findByDoctorId(doctorId: number): Promise<Doctor | null> {
    const doctor = await this.doctorRepo.findOne({
      where: { id: doctorId },
    });

    return doctor;
  }

  async filterAndPagination(
    page: number,
    limit: number,
    objectFilter: Partial<BodyFilterDoctorsDto>,
  ) {
    page = Math.max(1, page);
    limit = Math.max(1, limit);
    const skip = (page - 1) * limit;

    const cacheKey = `doctors:page=${page}:limit=${limit}:filters=${JSON.stringify(objectFilter || {})}`;
    const cachedData = await this.redisCacheService.getData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const query = this.doctorRepo
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.user', 'doctorUser')
      .leftJoinAndSelect('doctor.specialty', 'specialty')
      .select([
        'doctor.id',
        'doctor.experience',
        'doctor.workplace',
        'specialty.name',
        'doctorUser.fullname',
        'doctorUser.address',
      ])
      .where('doctor.deletedAt IS NULL')
      .orderBy('doctorUser.fullname', 'ASC')
      .take(limit)
      .skip(skip);

    const filters = [
      {
        condition: 'specialty.id = :specialty_id',
        value: objectFilter.specialty_id,
        key: 'specialty_id',
      },
      {
        condition: 'doctor.experience = :experience',
        value: objectFilter.experience,
        key: 'experience',
      },
      {
        condition: 'LOWER(doctor.workspace) LIKE LOWER(:workspace)',
        value: objectFilter.workspace ? `%${objectFilter.workspace}%` : null,
        key: 'workspace',
      },
      {
        condition: 'LOWER(doctor.address) LIKE LOWER(:area)',
        value: objectFilter.area ? `%${objectFilter.area}%` : null,
        key: 'area',
      },
      {
        condition: 'LOWER(doctorUser.fullname) LIKE LOWER(:search)',
        value: objectFilter.search ? `%${objectFilter.search}%` : null,
        key: 'search',
      },
    ];

    filters.forEach(({ condition, value, key }) => {
      if (value !== undefined && value != null) {
        query.andWhere(condition, { [key]: value });
      }
    });

    const [doctors, total] = await query.getManyAndCount();
    const totalPages = Math.ceil(total / limit);
    const result = {
      total,
      doctors,
      page,
      limit,
      totalPages,
    };

    await this.redisCacheService.setData(cacheKey, result);

    return result;
  }

  async getDoctor(doctorId: number) {
    const doctor = await this.doctorRepo
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.user', 'doctorUser')
      .leftJoinAndSelect('doctor.specialty', 'specialty')
      .leftJoinAndSelect('doctor.doctor_schedules', 'schedules')
      .where('doctor.id = :doctorId', { doctorId })
      .select([
        'doctor.id',
        'doctor.experience',
        'doctor.about_me',
        'doctor.workplace',
        'specialty.name',
        'doctorUser.id',
        'doctorUser.fullname',
        'doctorUser.address',
        'doctorUser.phone',
        'schedules.id',
        'schedules.day_of_week',
        'schedules.start_time',
        'schedules.end_time',
        'schedules.is_active',
      ])
      .getOne();

    if (!doctor) {
      throw new NotFoundException('Bác sĩ không tồn tại.');
    }

    const doctor_schedules = groupSchedulesByDay(doctor.doctor_schedules);

    return {
      ...doctor,
      doctor_schedules,
    };
  }
}
