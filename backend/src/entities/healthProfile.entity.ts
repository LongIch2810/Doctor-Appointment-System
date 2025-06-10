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

  @Column({ nullable: false })
  weight: number;

  @Column({ nullable: false })
  height: number;

  //Nhóm máu
  @Column({ nullable: false })
  blood_type: string;

  //Bệnh nền
  @Column({ nullable: false })
  medical_history: string;

  //Dị ứng
  @Column({ nullable: false })
  allergies: string;

  //Nhịp tim
  @Column({ nullable: false })
  heart_rate: number;

  //Huyết áp
  @Column({ nullable: false })
  blood_pressure: string;

  //Lượng đường huyết (mg/dL)
  @Column({ nullable: false })
  glucose_level: number;

  //Mức cholesterol (mg/dL)
  @Column({ nullable: false })
  cholesterol_level: number;

  //Thuốc đang sử dụng
  @Column({ nullable: false })
  medications: string;

  //Các mũi vac xin đã tiêm
  @Column({ nullable: false })
  vaccinations: string;

  //Có hút thuốc không ?
  @Column({ nullable: false })
  smoking: boolean;

  //Có uống rượu hoặc bia không
  @Column({ nullable: false })
  alcohol_consumption: boolean;

  //Tần suất vận động
  @Column({ nullable: false })
  exercise_frequency: string;

  //Ngày khám gần nhất
  @Column({ nullable: false })
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
