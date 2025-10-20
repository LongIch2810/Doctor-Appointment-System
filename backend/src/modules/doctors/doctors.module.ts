import { Module } from '@nestjs/common';
import { DoctorsController } from './doctors.controller';
import { DoctorsService } from './doctors.service';
import { Type } from 'class-transformer';
import Doctor from 'src/entities/doctor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';
import Appointment from 'src/entities/appointment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor,Appointment]), RedisCacheModule],
  controllers: [DoctorsController],
  providers: [DoctorsService],
  exports: [DoctorsService],
})
export class DoctorsModule {}
