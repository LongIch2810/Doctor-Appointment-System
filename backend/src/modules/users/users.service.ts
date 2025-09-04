import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  async findByUsernameOrEmail(usernameOrEmail: string): Promise<User | null> {
    const user = await this.userRepo.findOne({
      where: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    });

    return user;
  }

  async findByUserId(userId: number): Promise<User | null> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    return user;
  }

  async createUser(username: string, email: string, password: string | null) {
    const createdUser = password
      ? this.userRepo.create({
          username,
          email,
          password,
        })
      : this.userRepo.create({
          username,
          email,
        });
    return await this.userRepo.save(createdUser);
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
