import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import Appointment from './appointment.entity';

@Entity('satisfaction_rating')
export default class SatisfactionRating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  rating_score: number;

  @Column({ nullable: false })
  feedback: string;

  @OneToOne(() => Appointment, (ap) => ap.satisfaction_rating)
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
