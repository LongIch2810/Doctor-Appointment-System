import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Relation,
} from 'typeorm';
import Doctor from './doctor.entity';
import User from './user.entity';
import ExaminationResult from './examinationResult.entity';
import SatisfactionRating from './satisfactionRating.entity';
import { AppointmentStatus } from 'src/shared/enums/appointmentStatus';
import DoctorSchedule from './doctorSchedule.entity';
import { BookingMode } from 'src/shared/enums/bookingMode';

@Entity('appointments')
export default class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  appointment_date: Date;

  @Column({
    type: 'enum',
    default: AppointmentStatus.PENDING,
    enumName: 'appointment_status',
    enum: AppointmentStatus,
  })
  status: AppointmentStatus;

  @Column({
    type: 'enum',
    default: BookingMode.USER_SELECT,
    enumName: 'booking_mode',
    enum: BookingMode,
  })
  booking_mode: BookingMode;

  @ManyToOne(() => DoctorSchedule, (ds) => ds.appointments, { nullable: false })
  @JoinColumn({ name: 'doctor_schedule_id' })
  doctor_schedule: Relation<DoctorSchedule>;

  @ManyToOne(() => Doctor, (d) => d.appointments, { nullable: false })
  @JoinColumn({ name: 'doctor_id' })
  doctor: Relation<Doctor>;

  @ManyToOne(() => User, (u) => u.appointments, { nullable: false })
  @JoinColumn({ name: 'patient_id' })
  patient: Relation<User>;

  @OneToOne(() => ExaminationResult, (er) => er.appointment, {
    nullable: false,
  })
  examination_result: Relation<ExaminationResult>;

  @OneToOne(() => SatisfactionRating, (sr) => sr.appointment, {
    nullable: false,
  })
  satisfaction_rating: Relation<SatisfactionRating>;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
