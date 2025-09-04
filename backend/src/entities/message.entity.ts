import { CallStatus } from 'src/shared/enums/callStatus';
import { MessageType } from 'src/shared/enums/messageType';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import User from './user.entity';
import Channel from './channel.entity';

@Entity('messages')
export default class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    nullable: false,
    enumName: 'message_type',
    enum: MessageType,
  })
  message_type: MessageType;

  @Column({ nullable: true })
  content: string;

  @Column({ nullable: true })
  img_url: string;

  @Column({ nullable: true })
  img_public_id: string;

  @Column({ nullable: true })
  file_url: string;

  @Column({ nullable: true })
  file_name: string;

  @Column({ nullable: true })
  file_mime: string;

  @Column({ type: 'bigint', nullable: true })
  file_size: number;

  @Column({
    type: 'enum',
    nullable: true,
    enumName: 'message_type',
    enum: CallStatus,
  })
  call_status: CallStatus;

  @Column({ nullable: true })
  call_duration: number;

  @ManyToOne(() => User, (u) => u.chat_messages)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @ManyToOne(() => Channel, (c) => c.chat_messages)
  @JoinColumn({ name: 'channel_id' })
  channel: Channel;

  @Column({ default: false })
  is_read: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
