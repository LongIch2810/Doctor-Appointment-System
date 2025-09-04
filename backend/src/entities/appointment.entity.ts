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
} from 'typeorm';
import Doctor from './doctor.entity';
import User from './user.entity';
import ExaminationResult from './examinationResult.entity';
import SatisfactionRating from './satisfactionRating.entity';
import { AppointmentStatus } from 'src/shared/enums/appointmentStatus';
import DoctorSchedule from './doctorSchedule.entity';

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

  @ManyToOne(() => DoctorSchedule, (ds) => ds.appointments, { nullable: false })
  @JoinColumn({ name: 'doctor_schedule_id' })
  doctor_schedule: DoctorSchedule;

  @ManyToOne(() => Doctor, (d) => d.appointments)
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @ManyToOne(() => User, (u) => u.appointments)
  @JoinColumn({ name: 'patient_id' })
  patient: User;

  @OneToOne(() => ExaminationResult, (ex) => ex.appointment)
  examination_result: ExaminationResult;

  @OneToOne(() => SatisfactionRating, (s) => s.appointment)
  satisfaction_rating: SatisfactionRating;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
