import { Injectable, UnauthorizedException } from '@nestjs/common';
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

  async createUser(username: string, email: string, password: string) {
    const newUser = this.userRepo.create({ username, email, password });
    return await this.userRepo.save(newUser);
  }
}
