import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendOtpEmail(to: string, otpCode: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Your OTP Code',
        template: 'otp', // tương ứng với otp.hbs
        context: {
          code: otpCode,
          year: new Date().getFullYear(),
        },
      });
    } catch (error) {
      console.error('❌ Lỗi gửi mail:', error);
      throw error;
    }
  }
}
