import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from './user.entity';
import Channel from './channel.entity';

@Entity('participants')
export default class Participants {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.channels)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Channel, (channel) => channel.users)
  @JoinColumn({ name: 'channel_id' })
  channel: Channel;
}
