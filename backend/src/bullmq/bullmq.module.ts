import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailProducer } from './queues/email/email.producer';
import { EmailProcessor } from './queues/email/email.processor';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD'),
          db: 1,
        },
      }),
    }),
    BullModule.registerQueue({ name: 'email-queue' }),
  ],
  providers: [EmailProducer, EmailProcessor],
  exports: [EmailProducer],
})
export class BullmqModule {}
