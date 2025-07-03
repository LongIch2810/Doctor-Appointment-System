import { Module } from '@nestjs/common';
import { OtpsService } from './otps.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Otp from 'src/entities/otp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Otp])],
  providers: [OtpsService],
  exports: [OtpsService],
})
export class OtpsModule {}
