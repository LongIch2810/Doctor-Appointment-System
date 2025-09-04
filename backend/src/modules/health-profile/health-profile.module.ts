import { Module } from '@nestjs/common';
import { HealthProfileController } from './health-profile.controller';
import { HealthProfileService } from './health-profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import HealthProfile from 'src/entities/healthProfile.entity';
import User from 'src/entities/user.entity';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([HealthProfile, User]), RedisCacheModule],
  controllers: [HealthProfileController],
  providers: [HealthProfileService],
  exports: [HealthProfileService],
})
export class HealthProfileModule {}
