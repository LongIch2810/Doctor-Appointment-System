import { Processor, WorkerHost } from '@nestjs/bullmq';
import { forwardRef, Inject } from '@nestjs/common';
import { AppointmentsService } from 'src/modules/appointments/appointments.service';
import { WebsocketGateway } from 'src/websockets/websocket.gateway';

@Processor('appointment-queue', {
  concurrency: 1,
})
export class AppointmentProcessor extends WorkerHost {
  constructor(
    @Inject(forwardRef(() => AppointmentsService))
    private readonly appointmentsService: AppointmentsService,
    private readonly gateway: WebsocketGateway,
  ) {
    super();
  }

  async process(job: any, token?: string): Promise<any> {
    const { data } = job.data;
    try {
      const appointment = await this.appointmentsService.create(
        data.userId,
        data.body,
      );
      console.log('appointment', appointment);
      this.gateway.notifyBookAppointmentSuccess(data.userId, appointment);
    } catch (error) {
      this.gateway.notifyBookAppointmentFail(
        data.userId,
        error.message || 'Đặt lịch thất bại!',
      );
      throw error;
    }
  }
}
