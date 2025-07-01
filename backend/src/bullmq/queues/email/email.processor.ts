import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('email-queue', {
  concurrency: 20,
})
export class EmailProcessor extends WorkerHost {
  async process(job: Job, token?: string): Promise<any> {
    console.log(`🌀 Attempt ${job.attemptsMade + 1}`);

    if (job.attemptsMade < 2) {
      throw new Error('❌ Lỗi thử nghiệm');
    }

    console.log(`✅ Thành công ở lần thử thứ ${job.attemptsMade + 1}`);
  }
}
