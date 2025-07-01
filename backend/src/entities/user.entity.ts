import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import UserRole from './userRole.entity';
import UserNotification from './userNotification.entity';
import Notification from './notification.entity';
import Article from './article.entity';
import HealthProfile from './healthProfile.entity';
import Doctor from './doctor.entity';
import Appointment from './appointment.entity';
import Conversation from './conversation.entity';

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column({ nullable: true })
  fullname: string;

  @Column({ default: true })
  gender: boolean;

  @Column({ nullable: true })
  date_of_birth: Date;

  @Column({ nullable: true })
  picture: string;

  @Column({ nullable: true })
  address: string;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToMany(() => UserRole, (ur) => ur.user)
  roles: UserRole[];

  @OneToMany(() => Notification, (n) => n.sender)
  sentNotifications: Notification[];

  @OneToMany(() => UserNotification, (un) => un.notification)
  notifications: UserNotification[];

  @OneToMany(() => Article, (a) => a.author)
  articles: Article[];

  @OneToOne(() => HealthProfile, (hp) => hp.patient)
  health_profile: HealthProfile;

  @OneToOne(() => Doctor, (d) => d.user)
  doctor: Doctor;

  @OneToMany(() => Appointment, (ap) => ap.patient)
  appointments: Appointment[];

  @OneToMany(() => Conversation, (c) => c.user)
  messages: Conversation[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
