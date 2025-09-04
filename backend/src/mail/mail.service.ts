import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import User from 'src/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendOtpEmail(
    to: string,
    otpCode: string,
    username: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Your OTP Code',
        template: 'otp', // tương ứng với otp.hbs
        context: {
          code: otpCode,
          year: new Date().getFullYear(),
          name: username,
        },
      });
    } catch (error) {
      console.error('❌ Lỗi gửi mail:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(to: string, username: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Your OTP Code',
        template: 'welcome', // tương ứng với welcome.hbs
        context: {
          name: username,
          year: new Date().getFullYear(),
        },
      });
    } catch (error) {
      console.error('❌ Lỗi gửi mail:', error);
      throw error;
    }
  }
}
