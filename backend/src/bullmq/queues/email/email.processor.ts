import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailService } from 'src/mail/mail.service';
import { jobEmailName } from 'src/shared/enums/jobEmailName';

@Processor('email-queue', {
  concurrency: 10,
})
export class EmailProcessor extends WorkerHost {
  constructor(private readonly mailService: MailService) {
    super();
  }

  async process(job: Job, token?: string): Promise<any> {
    if (job.name === jobEmailName.OTP) {
      const { email, otp, username } = job.data;

      console.log(`Gửi OTP đến ${email} - Lần thử: ${job.attemptsMade + 1}`);

      await this.mailService.sendOtpEmail(email, otp, username);
    } else if (job.name === jobEmailName.WELCOME) {
      const { email, username } = job.data;

      console.log(
        `Gửi lời chào đến ${email} - Lần thử: ${job.attemptsMade + 1}`,
      );

      await this.mailService.sendWelcomeEmail(email, username);
    }
  }
}
