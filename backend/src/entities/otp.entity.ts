import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  Column,
} from 'typeorm';
import User from './user.entity';

@Entity('otps')
export default class Otp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  otpCode: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ default: false })
  verified: boolean;

  @ManyToOne(() => User, (u) => u.otps)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
