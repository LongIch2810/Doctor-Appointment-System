import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Appointment from 'src/entities/appointment.entity';
import Doctor from 'src/entities/doctor.entity';
import User from 'src/entities/user.entity';
import { In, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { BodyCreateAppointmentDto } from './dto/bodyCreateAppointment.dto';
import DoctorSchedule from 'src/entities/doctorSchedule.entity';
import { dayNumberToEnum, DayOfWeek } from '../../shared/enums/dayOfWeek';
import { getDay } from 'date-fns';
import { BodyCancelAppointmentDto } from './dto/bodyCancelAppointment.dto';
import { AppointmentStatus } from 'src/shared/enums/appointmentStatus';
import { BodyPersonalAppointmentsDto } from './dto/bodyPersonalAppointments.dto';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';
import { BookingMode } from 'src/shared/enums/bookingMode';
import { formatDate } from '../../utils/formatDate';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(DoctorSchedule)
    private doctorScheduleRepo: Repository<DoctorSchedule>,
    private redisCacheService: RedisCacheService,
  ) {}

  async create(userId: number, body: BodyCreateAppointmentDto) {
    const queryRunner =
      this.appointmentRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const {
        appointment_date,
        end_time,
        start_time,
        doctor_id,
        doctor_name,
        specialty_name,
        booking_mode,
        doctor_schedule_id,
      } = body;

      const appointmentDate = new Date(appointment_date);
      const now = new Date();
      const appointmentDay = new Date(
        appointmentDate.getFullYear(),
        appointmentDate.getMonth(),
        appointmentDate.getDate(),
      );
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (appointmentDay < today) {
        throw new BadRequestException(
          'Ngày đặt lịch không được là ngày trong quá khứ.',
        );
      }

      const patient = await queryRunner.manager.findOne(User, {
        where: { id: userId },
      });
      if (!patient) throw new NotFoundException('Không tìm thấy bệnh nhân.');

      const dayNumber = getDay(new Date(appointment_date));
      const dayOfWeek = dayNumberToEnum[dayNumber];

      let doctor: Doctor | null = null;
      let chosenSchedule: DoctorSchedule | null = null;

      switch (booking_mode) {
        case BookingMode.USER_SELECT:
          doctor = await queryRunner.manager.findOne(Doctor, {
            where: { id: doctor_id },
          });
          if (!doctor) throw new NotFoundException('Không tìm thấy bác sĩ.');

          chosenSchedule = await queryRunner.manager.findOne(DoctorSchedule, {
            where: {
              id: doctor_schedule_id,
              doctor: { id: doctor.id },
              day_of_week: dayOfWeek,
              is_active: true,
            },
          });

          if (!chosenSchedule) {
            throw new BadRequestException(
              'Ca làm việc không hợp lệ hoặc không thuộc bác sĩ/ngày này.',
            );
          }
          const taken = await queryRunner.manager.findOne(Appointment, {
            where: {
              appointment_date: appointmentDate,
              doctor_schedule: { id: chosenSchedule.id },
            },
          });

          if (taken) throw new ConflictException('Ca này đã có lịch hẹn !');
          break;

        case BookingMode.AI_SELECT:
          const qb = queryRunner.manager
            .createQueryBuilder(User, 'user')
            .leftJoinAndSelect('user.doctor', 'doctor')
            .leftJoinAndSelect('doctor.specialty', 'specialty')
            .where('doctor.id IS NOT NULL');

          if (doctor_name) {
            qb.andWhere('LOWER(user.fullname) LIKE LOWER(:doctorName)', {
              doctorName: `%${doctor_name}%`,
            });
          }
          if (specialty_name) {
            qb.andWhere('LOWER(specialty.name) LIKE LOWER(:specialtyName)', {
              specialtyName: `%${specialty_name}%`,
            });
          }

          const userWithDoctor = await qb.getOne();
          if (!userWithDoctor?.doctor) {
            throw new NotFoundException('Không tìm thấy bác sĩ phù hợp.');
          }
          doctor = userWithDoctor.doctor;

          const candidateSchedules = await queryRunner.manager.find(
            DoctorSchedule,
            {
              where: {
                doctor: { id: doctor.id },
                day_of_week: dayOfWeek,
                start_time: MoreThanOrEqual(start_time),
                end_time: LessThanOrEqual(end_time),
                is_active: true,
              },
              order: { start_time: 'ASC' },
            },
          );

          console.log('candidateSchedules', candidateSchedules);

          if (!candidateSchedules.length) {
            throw new BadRequestException(
              'Bác sĩ này không làm việc trong khung giờ bạn rảnh.',
            );
          }

          // Loại ca đã có appointment trong ngày
          const candidateIds = candidateSchedules.map((s) => s.id);
          const takenAppointments = await queryRunner.manager.find(
            Appointment,
            {
              where: {
                appointment_date: appointmentDate,
                doctor_schedule: { id: In(candidateIds) },
              },
              relations: ['doctor_schedule'],
            },
          );
          const takenSet = new Set(
            takenAppointments.map((a) => a.doctor_schedule.id),
          );
          const freeSchedules = candidateSchedules.filter(
            (s) => !takenSet.has(s.id),
          );
          if (!freeSchedules.length)
            throw new ConflictException('Các ca phù hợp đã bị đặt hết.');

          chosenSchedule = freeSchedules[0];
          break;
        default:
          throw new BadRequestException('Chế độ đặt lịch không hợp lệ');
      }

      const appointment = queryRunner.manager.create(Appointment, {
        appointment_date: appointmentDate,
        doctor_schedule: chosenSchedule,
        doctor: doctor,
        patient,
        booking_mode,
      });

      const saved = await queryRunner.manager.save(appointment);
      await queryRunner.commitTransaction();

      const appointmentDetail = await this.appointmentRepo
        .createQueryBuilder('appointment')
        .leftJoinAndSelect('appointment.doctor', 'doctor')
        .leftJoinAndSelect('doctor.user', 'doctorUser')
        .leftJoinAndSelect('appointment.doctor_schedule', 'doctorSchedule')
        .leftJoinAndSelect('doctor.specialty', 'specialty')
        .leftJoinAndSelect('appointment.patient', 'patient')
        .where('appointment.id = :id', { id: saved.id })
        .select([
          'appointment.id',
          'appointment.appointment_date',
          'appointment.status',
          'appointment.booking_mode',
          'appointment.created_at',
          'appointment.updated_at',
          'appointment.deleted_at',
          'doctorSchedule.id',
          'doctorSchedule.day_of_week',
          'doctorSchedule.start_time',
          'doctorSchedule.end_time',
          'doctor.id',
          'doctorUser.fullname',
          'doctorUser.address',
          'doctorUser.email',
          'doctorUser.phone',
          'specialty.name',
        ])
        .getOne();

      return formatDate(appointmentDetail);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async cancel(userId: number, body: BodyCancelAppointmentDto) {
    const {
      appointment_date,
      start_time,
      end_time,
      appointment_id,
      doctor_name,
      specialty_name,
    } = body;

    const isQueryById = Boolean(appointment_id);
    const isQueryByDetails =
      appointment_date ||
      start_time ||
      end_time ||
      doctor_name ||
      specialty_name;

    if (!isQueryById && !isQueryByDetails) {
      throw new BadRequestException(
        'Bạn phải cung cấp appointment_id, hoặc thông tin lịch hẹn để hủy.',
      );
    }

    let appointments: Appointment[] = [];

    if (isQueryById) {
      const appointment = await this.appointmentRepo.findOne({
        where: {
          id: appointment_id,
          patient: { id: userId },
          status: AppointmentStatus.PENDING,
        },
      });

      if (!appointment) {
        throw new NotFoundException('Không tìm thấy lịch hẹn.');
      }

      appointments = [appointment];
    } else if (isQueryByDetails) {
      const query = this.appointmentRepo
        .createQueryBuilder('appointment')
        .leftJoinAndSelect('appointment.doctor', 'doctor')
        .leftJoinAndSelect('appointment.doctor_schedule', 'doctorSchedule')
        .leftJoinAndSelect('doctor.user', 'doctorUser')
        .leftJoinAndSelect('doctor.specialty', 'specialty')
        .where('patient.id = :userId', { userId })
        .andWhere('appointment.status = :status', {
          status: AppointmentStatus.PENDING,
        });

      if (appointment_date) {
        const appointmentDate = new Date(appointment_date);
        const now = new Date();
        const appointmentDay = new Date(
          appointmentDate.getFullYear(),
          appointmentDate.getMonth(),
          appointmentDate.getDate(),
        );
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
        );
        if (appointmentDay < today) {
          throw new BadRequestException('Không thể hủy lịch hẹn đã qua.');
        }
        query.andWhere(
          'DATE(appointment.appointment_date) = :appointmentDate',
          {
            appointmentDate: new Date(appointment_date),
          },
        );
      }

      if (start_time) {
        query.andWhere('doctorSchedule.start_time = :startTime', {
          startTime: start_time,
        });
      }

      if (end_time) {
        query.andWhere('doctorSchedule.end_time = :endTime', {
          endTime: end_time,
        });
      }

      if (doctor_name) {
        query.andWhere('LOWER(doctorUser.fullname) LIKE LOWER(:doctorName)', {
          doctorName: `%${doctor_name}%`,
        });
      }

      if (specialty_name) {
        query.andWhere('LOWER(specialty.name) LIKE LOWER(:specialtyName)', {
          specialtyName: `%${specialty_name}%`,
        });
      }

      appointments = await query.getMany();
    }

    if (!appointments || appointments.length === 0) {
      throw new NotFoundException(
        'Không tìm thấy lịch hẹn phù hợp hoặc đã bị hủy.',
      );
    }

    const ids = appointments.map((appointment) => appointment.id);
    await this.appointmentRepo.update(ids, {
      status: AppointmentStatus.CANCELED,
    });

    const cancelAppointments = await this.appointmentRepo.find({
      where: {
        id: In(ids),
        patient: { id: userId },
        status: AppointmentStatus.CANCELED,
      },
    });
    return cancelAppointments;
  }

  async restore(userId: number, body: BodyCancelAppointmentDto) {
    const {
      appointment_date,
      start_time,
      end_time,
      appointment_id,
      doctor_name,
      specialty_name,
    } = body;

    const isQueryById = Boolean(appointment_id);
    const isQueryByDetails =
      appointment_date ||
      start_time ||
      end_time ||
      doctor_name ||
      specialty_name;

    if (!isQueryById && !isQueryByDetails) {
      throw new BadRequestException(
        'Bạn phải cung cấp appointment_id, hoặc thông tin lịch hẹn để hủy.',
      );
    }

    let appointments: Appointment[] = [];

    if (isQueryById) {
      const appointment = await this.appointmentRepo.findOne({
        where: {
          id: appointment_id,
          patient: { id: userId },
          status: AppointmentStatus.CANCELED,
        },
      });

      if (!appointment) {
        throw new NotFoundException('Không tìm thấy lịch hẹn này.');
      }

      appointments = [appointment];
    } else if (isQueryByDetails) {
      const query = this.appointmentRepo
        .createQueryBuilder('appointment')
        .leftJoinAndSelect('appointment.doctor', 'doctor')
        .leftJoinAndSelect('appointment.doctor_schedule', 'doctorSchedule')
        .leftJoinAndSelect('doctor.user', 'doctorUser')
        .leftJoinAndSelect('doctor.specialty', 'specialty')
        .where('appointment.patient.id = :userId', { userId })
        .andWhere('appointment.status = :status', {
          status: AppointmentStatus.CANCELED,
        });

      if (appointment_date) {
        const appointmentDate = new Date(appointment_date);
        const now = new Date();
        const appointmentDay = new Date(
          appointmentDate.getFullYear(),
          appointmentDate.getMonth(),
          appointmentDate.getDate(),
        );
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
        );
        if (appointmentDay < today) {
          throw new BadRequestException('Không thể hủy lịch hẹn đã qua.');
        }
        query.andWhere(
          'DATE(appointment.appointment_date) = :appointmentDate',
          {
            appointmentDate: new Date(appointment_date),
          },
        );
      }

      if (start_time) {
        query.andWhere('doctorSchedule.start_time = :startTime', {
          startTime: start_time,
        });
      }

      if (end_time) {
        query.andWhere('doctorSchedule.end_time = :endTime', {
          endTime: end_time,
        });
      }

      if (doctor_name) {
        query.andWhere('LOWER(doctorUser.fullname) LIKE LOWER(:doctorName)', {
          doctorName: `%${doctor_name}%`,
        });
      }

      if (specialty_name) {
        query.andWhere('LOWER(specialty.name) LIKE LOWER(:specialtyName)', {
          specialtyName: `%${specialty_name}%`,
        });
      }

      appointments = await query.getMany();
    }

    if (!appointments || appointments.length === 0) {
      throw new NotFoundException(
        'Không tìm thấy lịch hẹn phù hoặc đã được khôi phục.',
      );
    }

    const ids = appointments.map((appointment) => appointment.id);

    await this.appointmentRepo.update(ids, {
      status: AppointmentStatus.PENDING,
    });

    const restoredAppointments = await this.appointmentRepo.find({
      where: {
        id: In(ids),
        patient: { id: userId },
        status: AppointmentStatus.PENDING,
      },
    });

    return restoredAppointments;
  }

  async findPersonalAppointments(
    page: number,
    limit: number,
    userId: number,
    objectFilter: Partial<BodyPersonalAppointmentsDto>,
  ) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng.');
    }
    page = Math.max(1, page);
    limit = Math.max(1, limit);
    const skip = (page - 1) * limit;

    const cacheKey = `appointments:${userId}:page=${page}:limit=${limit}:filters=${JSON.stringify(objectFilter || {})}`;
    const cachedData = await this.redisCacheService.getData(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    const query = this.appointmentRepo
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.doctor', 'doctor')
      .leftJoinAndSelect('appointment.doctor_schedule', 'doctorSchedule')
      .leftJoinAndSelect('doctor.user', 'doctorUser')
      .leftJoinAndSelect('doctor.specialty', 'specialty')
      .where('appointment.patient.id = :userId', { userId })
      .select([
        'appointment.id',
        'appointment.appointment_date',
        'doctorSchedule.day_of_week',
        'doctorSchedule.start_time',
        'doctorSchedule.end_time',
        'appointment.status',
        'doctor.id',
        'doctorUser.fullname',
        'doctorUser.picture',
        'specialty.id',
        'specialty.name',
      ])
      .orderBy('appointment.appointment_date', 'DESC')
      .take(limit)
      .skip(skip);

    if (objectFilter?.appointmentStatus) {
      query.andWhere('appointment.status = :status', {
        status: objectFilter.appointmentStatus,
      });
    }

    const [appointments, total] = await query.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    const result = {
      appointments,
      total,
      totalPages,
      page,
      limit,
    };

    await this.redisCacheService.setData(cacheKey, result, 3600);

    return result;
  }

  async getAppointment(userId: number, appointmentId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại.');
    }

    const cacheKey = `${userId}:appointment:${appointmentId}`;
    const cachedData = await this.redisCacheService.getData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const appointment = this.appointmentRepo
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.doctor', 'doctor')
      .leftJoinAndSelect('appointment.doctor_schedule', 'doctorSchedule')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('doctor.user', 'doctorUser')
      .leftJoinAndSelect('doctor.specialty', 'specialty')
      .where('appointment.id = :appointmentId', { appointmentId })
      .andWhere('patient.id = :userId', { userId })
      .select([
        'appointment.id',
        'appointment.appointment_date',
        'doctorSchedule.day_of_week',
        'doctorSchedule.start_time',
        'doctorSchedule.end_time',
        'appointment.status',
        'doctor.id',
        'doctorUser.fullname',
        'doctorUser.address',
        'doctorUser.email',
        'doctorUser.phone',
        'doctorUser.picture',
        'specialty.id',
        'specialty.name',
        'patient.id',
        'patient.fullname',
        'patient.username',
      ])
      .getOne();

    if (!appointment) {
      throw new NotFoundException('Lịch hẹn không tồn tại.');
    }

    await this.redisCacheService.setData(cacheKey, appointment, 3600);

    return appointment;
  }
}
