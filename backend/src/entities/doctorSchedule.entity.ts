import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import Doctor from './doctor.entity';
import { DayOfWeek } from 'src/shared/enums/dayOfWeek';
import Appointment from './appointment.entity';

@Entity('doctor_schedules')
export default class DoctorSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    nullable: false,
    enumName: 'day_of_week',
    enum: DayOfWeek,
  })
  day_of_week: DayOfWeek;

  @Column({ type: 'time', nullable: false })
  start_time: string;

  @Column({ type: 'time', nullable: false })
  end_time: string;

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => Appointment, (a) => a.doctor_schedule)
  appointments: Appointment[];

  @ManyToOne(() => Doctor, (d) => d.doctor_schedules)
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;
}
