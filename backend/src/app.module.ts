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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
