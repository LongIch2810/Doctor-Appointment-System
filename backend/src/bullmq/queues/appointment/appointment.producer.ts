import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { BodyCreateAppointmentDto } from '../../../modules/appointments/dto/bodyCreateAppointment.dto';

@Injectable()
export class AppointmentProducer {
  constructor(
    @InjectQueue('appointment-queue') private readonly queue: Queue,
  ) {}

  async createAppointment(data: {
    userId: number;
    body: BodyCreateAppointmentDto;
  }) {
    return await this.queue.add(
      'create-appointment',
      { data },
      {
        attempts: 1,
        removeOnFail: false,
      },
    );
  }
}
