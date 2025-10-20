import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Relation,
} from 'typeorm';
import User from './user.entity';
import { ComplaintStatus } from 'src/shared/enums/complaintStatus';

@Entity('complaints')
export default class Complaint {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (u) => u.complaints)
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  description: string;

  @Column({
    type: 'enum',
    nullable: false,
    enumName: 'complaint_status',
    enum: ComplaintStatus,
  })
  complaint_status: ComplaintStatus;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
