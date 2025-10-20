import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Relation,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import User from './user.entity';
import HealthProfile from './healthProfile.entity';
import Relationship from './relationship.entity';

@Entity('relatives')
export default class Relative {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.relatives)
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @Column({ nullable: true })
  fullname: string;

  @ManyToOne(() => Relationship, (rel) => rel.relatives)
  @JoinColumn({
    name: 'relationship_code',
    referencedColumnName: 'relationship_code',
  })
  relationship: Relation<Relationship>;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  dob: Date;

  @Column({ default: true })
  gender: boolean;

  @OneToOne(() => HealthProfile, (hp) => hp.patient)
  health_profile: Relation<HealthProfile>;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
