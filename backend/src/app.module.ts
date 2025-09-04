import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { RedisCacheModule } from './redis-cache/redis-cache.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { BullmqModule } from './bullmq/bullmq.module';
import { MailModule } from './mail/mail.module';
import { OtpsModule } from './modules/otps/otps.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ChatHistoryModule } from './modules/chat-history/chat-history.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { DoctorsModule } from './modules/doctors/doctors.module';
import { HealthProfileModule } from './modules/health-profile/health-profile.module';
import { ArticlesModule } from './modules/articles/articles.module';
import { DoctorSchedulesModule } from './modules/doctor-schedules/doctor-schedules.module';
import { TopicsModule } from './modules/topics/topics.module';
import { SpecialtiesModule } from './modules/specialties/specialties.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    RedisCacheModule,
    AuthModule,
    DatabaseModule,
    UsersModule,
    BullmqModule,
    MailModule,
    OtpsModule,
    ChatHistoryModule,
    AppointmentsModule,
    DoctorsModule,
    HealthProfileModule,
    ArticlesModule,
    DoctorSchedulesModule,
    TopicsModule,
    SpecialtiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
