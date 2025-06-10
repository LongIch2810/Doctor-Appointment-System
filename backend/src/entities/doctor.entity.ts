import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import Specialty from './specialty.entity';
import User from './user.entity';
import Appointment from './appointment.entity';
import DoctorSchedule from './doctorSchedule.entity';

@Entity('doctors')
export default class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  experience: number;

  @Column({ nullable: false })
  about_me: string;

  @Column({ nullable: false })
  workplace: string;

  @ManyToOne(() => Specialty, (s) => s.doctors)
  @JoinColumn({ name: 'specialty_id' })
  specialty: Specialty;

  @OneToOne(() => User, (u) => u.doctor)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Appointment, (ap) => ap.doctor)
  appointments: Appointment[];

  @OneToMany(() => DoctorSchedule, (ds) => ds.doctor)
  doctor_schedules: DoctorSchedule[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
