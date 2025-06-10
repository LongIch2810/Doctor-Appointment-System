import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import User from './user.entity';
import Notification from './notification.entity';

@Entity('user_notification')
export default class UserNotification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Notification, (n) => n.users)
  @JoinColumn({ name: 'notification_id' })
  notification: Notification;

  @ManyToOne(() => User, (u) => u.notifications)
  @JoinColumn({ name: 'receiver_id' })
  receiver: User;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
