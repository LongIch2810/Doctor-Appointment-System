import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import User from './user.entity';

@Entity('health_profile')
export default class HealthProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  weight: number;

  @Column({ nullable: true })
  height: number;

  //Nhóm máu
  @Column({ nullable: true })
  blood_type: string;

  //Bệnh nền
  @Column({ nullable: true })
  medical_history: string;

  //Dị ứng
  @Column({ nullable: true })
  allergies: string;

  //Nhịp tim
  @Column({ nullable: true })
  heart_rate: number;

  //Huyết áp
  @Column({ nullable: true })
  blood_pressure: string;

  //Lượng đường huyết (mg/dL)
  @Column({ nullable: true })
  glucose_level: number;

  //Mức cholesterol (mg/dL)
  @Column({ nullable: true })
  cholesterol_level: number;

  //Thuốc đang sử dụng
  @Column({ nullable: true })
  medications: string;

  //Các mũi vac xin đã tiêm
  @Column({ nullable: true })
  vaccinations: string;

  //Có hút thuốc không ?
  @Column({ nullable: true })
  smoking: boolean;

  //Có uống rượu hoặc bia không
  @Column({ nullable: true })
  alcohol_consumption: boolean;

  //Tần suất vận động
  @Column({ nullable: true })
  exercise_frequency: string;

  //Ngày khám gần nhất
  @Column({ nullable: true })
  last_checkup_date: Date;

  @OneToOne(() => User, (u) => u.health_profile)
  @JoinColumn({ name: 'patient_id' })
  patient: User;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
