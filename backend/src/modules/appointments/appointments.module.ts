import { Module, forwardRef } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Appointment from 'src/entities/appointment.entity';
import User from 'src/entities/user.entity';
import Doctor from 'src/entities/doctor.entity';
import DoctorSchedule from 'src/entities/doctorSchedule.entity';
import { RedisCacheModule } from 'src/redis-cache/redis-cache.module';
import { BullmqModule } from 'src/bullmq/bullmq.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, User, Doctor, DoctorSchedule]),
    RedisCacheModule,
    forwardRef(() => BullmqModule),
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
