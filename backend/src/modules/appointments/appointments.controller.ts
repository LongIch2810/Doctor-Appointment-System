import {
  Body,
  Controller,
  forwardRef,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { BodyCreateAppointmentDto } from './dto/bodyCreateAppointment.dto';
import { BodyCancelAppointmentDto } from './dto/bodyCancelAppointment.dto';
import { BodyPersonalAppointmentsDto } from './dto/bodyPersonalAppointments.dto';
import { AppointmentProducer } from 'src/bullmq/queues/appointment/appointment.producer';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(
    private readonly appointmentsService: AppointmentsService,
    @Inject(forwardRef(() => AppointmentProducer))
    private readonly appointmentProducer: AppointmentProducer,
  ) {}

  @Post('booking-appointment')
  async createAppointment(
    @Body() bodyCreateAppointment: BodyCreateAppointmentDto,
    @Request() req,
  ) {
    const { userId } = req.user;
    const job = await this.appointmentProducer.createAppointment({
      userId,
      body: bodyCreateAppointment,
    });

    return { jobId: job.id };
  }

  @Post('cancel-appointment')
  async cancelAppointment(
    @Body() bodyCancelAppointment: BodyCancelAppointmentDto,
    @Request() req,
  ) {
    const { userId } = req.user;
    const cancelAppointments = await this.appointmentsService.cancel(
      userId,
      bodyCancelAppointment,
    );
    return cancelAppointments;
  }

  @Post('restore-appointment')
  async restoreAppointment(
    @Body() bodyRestoreAppointment: BodyCancelAppointmentDto,
    @Request() req,
  ) {
    const { userId } = req.user;
    const restoreAppointments = await this.appointmentsService.restore(
      userId,
      bodyRestoreAppointment,
    );
    return restoreAppointments;
  }

  @Post('personal-appointments')
  async getPersonalAppointments(
    @Request() req,
    @Body() bodyPersonalAppointments: BodyPersonalAppointmentsDto,
  ) {
    const { userId } = req.user;
    const { page, limit, ...objectFilter } = bodyPersonalAppointments;
    const personalAppointments =
      await this.appointmentsService.findPersonalAppointments(
        page,
        limit,
        userId,
        objectFilter,
      );
    return personalAppointments;
  }

  @Get(':appointmentId')
  async getAppointmentDetail(
    @Param('appointmentId', ParseIntPipe) appointmentId: number,
    @Request() req,
  ) {
    const { userId } = req.user;
    const appointment = await this.appointmentsService.getAppointment(
      userId,
      appointmentId,
    );
    return appointment;
  }
}
