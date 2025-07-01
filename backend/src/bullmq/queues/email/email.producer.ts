import { Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { jobEmailName } from 'src/shared/enums/jobEmailName';

@Injectable()
export class EmailProducer {
  constructor(@InjectQueue('email-queue') private readonly queue: Queue) {}

  async send(name: jobEmailName, email: string) {
    await this.queue.add(
      name,
      { email },
      {
        attempts: 3, //Thử lại 3 lần,
        backoff: { type: 'exponential', delay: 2000 },
        delay: 5000,
        removeOnFail: false,
      },
    );
  }
}
