import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { EmailProducer } from './bullmq/queues/email/email.producer';
import { jobEmailName } from './shared/enums/jobEmailName';

@Controller('mail')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly emailProducer: EmailProducer,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('send')
  async send(@Body('email') email: string) {
    await this.emailProducer.send(jobEmailName.WELCOME, email);
    return { message: 'Job added' };
  }
}
