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
import { PaymentStatus } from 'src/shared/enums/paymentStatus';

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
    default: PaymentStatus.UNPAID,
    enumName: 'payment_status',
    enum: PaymentStatus,
  })
  payment_status: PaymentStatus;

  @Column({ nullable: false })
  fee: number;

  @Column({ nullable: false })
  deposit_amount: number;

  @Column({ nullable: false })
  remaining_amount: number;

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
