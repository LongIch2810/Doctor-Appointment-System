import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Role from 'src/entities/role.entity';
import User from 'src/entities/user.entity';
import UserRole from 'src/entities/userRole.entity';
import { RoleCode } from 'src/shared/enums/roleCode';
import { role_name } from 'src/utils/constants';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepo: Repository<UserRole>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  async findByUsernameOrEmail(usernameOrEmail: string): Promise<User | null> {
    const user = await this.userRepo.findOne({
      where: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
      relations: ['roles', 'roles.role'],
    });

    return user;
  }

  async findByUserId(userId: number): Promise<User | null> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    return user;
  }

  async createUser(
    username: string,
    email: string,
    fullname: string,
    password: string | null,
  ) {
    const createdData = password
      ? {
          username,
          email,
          fullname,
          password,
        }
      : { username, email, fullname };
    const createdUser = this.userRepo.create(createdData);
    const newUser = await this.userRepo.save(createdUser);
    const role = await this.roleRepo.findOne({
      where: { role_name: role_name.PATIENT },
    });
    if (!role) {
      throw new NotFoundException('Mặc đinh role Patient không tồn tại !');
    }
    this.userRoleRepo.save({
      user: newUser,
      role,
    });
    return newUser;
  }

  async updateUserField(
    userId: number,
    updateFieldName: string,
    updateFieldValue: any,
  ) {
    return this.userRepo.update(userId, {
      [updateFieldName]: updateFieldValue,
    });
  }

  async updateUserFields(userId: number, updateFields: Partial<User>) {
    return this.userRepo.update(userId, updateFields);
  }
}
