import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import User from './user.entity';
import Channel from './channel.entity';

@Entity('channel_members')
export default class ChannelMembers {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (u) => u.channels)
  @JoinColumn({ name: 'participant_id' })
  user: Relation<User>;

  @ManyToOne(() => Channel, (c) => c.participants)
  @JoinColumn({ name: 'channel_id' })
  channel: Relation<Channel>;
}
