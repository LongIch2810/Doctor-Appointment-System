import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Relation,
} from 'typeorm';

import UserRole from './userRole.entity';
import Notification from './notification.entity';
import Article from './article.entity';
import HealthProfile from './healthProfile.entity';
import Doctor from './doctor.entity';
import Appointment from './appointment.entity';
import Conversation from './conversation.entity';
import Otp from './otp.entity';
import Message from './message.entity';
import ChannelMembers from './channelMembers.entity';
import Complaint from './complaint.entity';
import Relative from './relative.entity';

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: true })
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
  roles: Relation<UserRole[]>;

  @OneToMany(() => Notification, (n) => n.sender)
  sentNotifications: Relation<Notification[]>;

  @OneToMany(() => Article, (a) => a.author)
  articles: Relation<Article[]>;

  @OneToOne(() => HealthProfile, (hp) => hp.patient)
  health_profile: Relation<HealthProfile>;

  @OneToOne(() => Doctor, (d) => d.user)
  doctor: Relation<Doctor>;

  @OneToMany(() => Appointment, (a) => a.patient)
  appointments: Relation<Appointment[]>;

  @OneToMany(() => Conversation, (c) => c.user)
  messages: Relation<Conversation[]>;

  @OneToMany(() => Otp, (o) => o.user)
  otps: Relation<Otp[]>;

  @OneToMany(() => Message, (m) => m.sender)
  chat_messages: Relation<Message[]>;

  @OneToMany(() => ChannelMembers, (cm) => cm.user)
  channels: Relation<ChannelMembers[]>;

  @OneToMany(() => Complaint, (c) => c.user)
  complaints: Relation<Complaint[]>;

  @OneToMany(() => Relative, (r) => r.user)
  relatives: Relation<Relative[]>;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
