import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import UserRole from './userRole.entity';
import { RoleCode } from 'src/shared/enums/roleCode';
import { RoleName } from 'src/shared/enums/roleName';
import RolePermission from './rolePermission.entity';

@Entity('roles')
export default class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    unique: true,
    nullable: false,
    enumName: 'role_name',
    enum: RoleName,
  })
  name: RoleName;

  @Column({ nullable: false })
  description: string;

  @Column({
    type: 'enum',
    unique: true,
    default: RoleCode.PATIENT,
    enumName: 'role_code',
    enum: RoleCode,
  })
  code: RoleCode;

  @OneToMany(() => UserRole, (ur) => ur.role)
  users: UserRole[];

  @OneToMany(() => RolePermission, (rp) => rp)
  permissions: RolePermission[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
