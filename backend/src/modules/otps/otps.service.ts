import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import Otp from 'src/entities/otp.entity';
import { LessThan, Repository } from 'typeorm';

@Injectable()
export class OtpsService {
  constructor(@InjectRepository(Otp) private otpRepo: Repository<Otp>) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async deleteExpireOtps() {
    const now = new Date();
    const result = await this.otpRepo.delete({
      expiresAt: LessThan(now),
    });
    console.log(`Deleted ${result.affected ?? 0} expired Otps`);
  }
}
