import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { DoctorSchedulesService } from './doctor-schedules.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';

@Controller('doctor-schedules')
@UseGuards(JwtAuthGuard)
export class DoctorSchedulesController {
  constructor(private doctorSchedulesService: DoctorSchedulesService) {}

  @Get(':doctorId')
  async getDoctorSchedules(@Param('doctorId', ParseIntPipe) doctorId: number) {
    return this.doctorSchedulesService.getSchedulesByDoctorId(doctorId);
  }
}
