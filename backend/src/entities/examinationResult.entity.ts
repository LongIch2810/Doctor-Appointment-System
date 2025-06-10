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

@Entity('examination_result')
export default class ExaminationResult {
  @PrimaryGeneratedColumn()
  id: number;

  //chuẩn đoán
  @Column({ nullable: false })
  diagnosis: string;

  //Hướng dẫn điều trị
  @Column({ nullable: false })
  treatment: string;

  //đơn thuốc
  @Column({ nullable: false })
  prescription: string;

  @OneToOne(() => Appointment, (ap) => ap.examination_result)
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
