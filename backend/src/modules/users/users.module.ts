import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/entities/user.entity';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';
import { CloudinaryModule } from 'src/uploads/cloudinary.module';
import Role from 'src/entities/role.entity';
import UserRole from 'src/entities/userRole.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRole, Role]),
    RedisCacheModule,
    CloudinaryModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
