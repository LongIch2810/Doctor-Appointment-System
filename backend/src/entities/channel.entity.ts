import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import Message from './message.entity';
import Participants from './participants.entity';

@Entity('channels')
export default class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Message, (m) => m.channel)
  chat_messages: Message[];

  @OneToMany(() => Participants, (p) => p.channel)
  users: Participants[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
