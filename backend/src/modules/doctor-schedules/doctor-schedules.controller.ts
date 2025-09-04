import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { DoctorSchedulesService } from './doctor-schedules.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { BodyCreateScheduleDto } from './dto/bodyCreateSchedule.dto';

@Controller('doctor-schedules')
@UseGuards(JwtAuthGuard)
export class DoctorSchedulesController {
  constructor(private doctorSchedulesService: DoctorSchedulesService) {}

  @Post('create-schedule')
  async createSchedule(
    @Request() req,
    @Body() bodyCreateSchedule: BodyCreateScheduleDto,
  ) {}
}
