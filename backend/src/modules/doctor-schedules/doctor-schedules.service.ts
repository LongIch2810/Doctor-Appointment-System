import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import DoctorSchedule from 'src/entities/doctorSchedule.entity';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';
import { Repository } from 'typeorm';
import { BodyCreateScheduleDto } from './dto/bodyCreateSchedule.dto';
import Doctor from 'src/entities/doctor.entity';
import { toMinutes } from 'src/utils/toMinutes';
import { groupSchedulesByDay } from 'src/utils/groupSchedulesByDay';

@Injectable()
export class DoctorSchedulesService {
  constructor(
    @InjectRepository(DoctorSchedule)
    private doctorScheduleRepo: Repository<DoctorSchedule>,
    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>,
    private redisCacheService: RedisCacheService,
  ) {}

  async createSchedule(
    userId: number,
    bodyCreateSchedule: BodyCreateScheduleDto,
  ) {
    const doctor = await this.doctorRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!doctor) {
      throw new NotFoundException('Bác sĩ không tồn tại trong hệ thống.');
    }

    const startMinutes = toMinutes(bodyCreateSchedule.start_time);
    const endMinutes = toMinutes(bodyCreateSchedule.end_time);

    if (startMinutes >= endMinutes) {
      throw new BadRequestException(
        'Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc.',
      );
    }

    const schedulesExists = await this.doctorScheduleRepo.find({
      where: {
        doctor: { id: doctor.id },
        day_of_week: bodyCreateSchedule.day_of_week,
        start_time: bodyCreateSchedule.start_time,
        end_time: bodyCreateSchedule.end_time,
      },
    });

    const isOverlap = schedulesExists.some((s) => {
      const sStart = toMinutes(s.start_time);
      const sEnd = toMinutes(s.end_time);

      return endMinutes > sStart && startMinutes < sEnd;
    });

    if (isOverlap) {
      throw new ConflictException(
        'Khoảng thời gian này bị trùng với ca khám đã có.',
      );
    }

    await this.doctorScheduleRepo.save({
      ...bodyCreateSchedule,
      is_active: true,
      doctor,
    });

    return { message: 'Thêm ca khám thành công .' };
  }

  async updateActive(doctorScheduleId: number, isActive: boolean) {
    const schedule = await this.doctorScheduleRepo.findOne({
      where: { id: doctorScheduleId },
    });

    if (!schedule) {
      throw new NotFoundException('Ca khám không tồn tại.');
    }

    if (schedule.is_active === isActive) {
      return { message: 'Trạng thái ca khám không thay đổi.' };
    }

    await this.doctorScheduleRepo.update(doctorScheduleId, {
      is_active: isActive,
    });

    return {
      message: isActive
        ? 'Kích hoạt ca khám thành công.'
        : 'Ngừng kích hoạt ca khám thành công.',
    };
  }

  async getSchedulesByDoctorId(doctorId: number) {
    const doctor = await this.doctorRepo.findOne({ where: { id: doctorId } });
    if (!doctor) {
      throw new NotFoundException('Bác sĩ không tồn tại trong hệ thống.');
    }

    const schedules = await this.doctorScheduleRepo
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.appointments', 'appointment')
      .where('schedule.doctor_id = :doctorId', { doctorId })
      .select([
        'schedule.id',
        'schedule.day_of_week',
        'schedule.start_time',
        'schedule.end_time',
        'schedule.is_active',
        'appointment',
      ])
      .orderBy('schedule.day_of_week', 'ASC')
      .addOrderBy('schedule.start_time', 'ASC')
      .getMany();

    const schedulesGroup = groupSchedulesByDay(schedules);

    return schedulesGroup;
  }
}
