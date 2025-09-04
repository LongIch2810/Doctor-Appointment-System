import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BodyFilterDoctorsDto } from './dto/bodyFilterDoctors.dto';
import { DoctorsService } from './doctors.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';

@Controller('doctors')
export class DoctorsController {
  constructor(private doctorsService: DoctorsService) {}
  @Post()
  async getFilterDoctors(@Body() bodyFilterDoctor: BodyFilterDoctorsDto) {
    const { page, limit, ...objectFilter } = bodyFilterDoctor;
    return this.doctorsService.filterAndPagination(page, limit, objectFilter);
  }

  @Get(':doctorId')
  @UseGuards(JwtAuthGuard)
  async getDoctorDetail(@Param('doctorId', ParseIntPipe) doctorId: number) {
    const doctorDetail = await this.doctorsService.getDoctor(doctorId);
    return doctorDetail;
  }
}
