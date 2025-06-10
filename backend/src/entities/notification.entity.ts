import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import User from './user.entity';
import UserNotification from './userNotification.entity';
import { ManyToOne } from 'typeorm';

@Entity('notifications')
export default class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  content: string;

  @Column({ nullable: false })
  title: string;

  @ManyToOne(() => User, (u) => u.sentNotifications)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @OneToMany(() => UserNotification, (un) => un.notification)
  users: UserNotification[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
