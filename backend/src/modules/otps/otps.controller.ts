import { Body, Controller, Post } from '@nestjs/common';
import { OtpsService } from './otps.service';

@Controller('otps')
export class OtpsController {
  constructor(private otpsService: OtpsService) {}

  @Post('send-otp')
  async sendOtp(@Body('email') email: string) {
    const { message } = await this.otpsService.sendOtpToEmail(email);
    return message;
  }

  @Post('verify-otp')
  async verifyOtp(
    @Body('otpCode') otpCode: string,
    @Body('email') email: string,
  ) {
    const { message } = await this.otpsService.verifyOtp(otpCode, email);
    return message;
  }
}
