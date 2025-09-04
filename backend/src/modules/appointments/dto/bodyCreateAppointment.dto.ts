import {
  IsDateString,
  IsMilitaryTime,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class BodyCreateAppointmentDto {
  @IsDateString()
  appointment_date: string;

  @IsMilitaryTime()
  start_time: string;

  @IsMilitaryTime()
  end_time: string;

  @IsOptional()
  @IsNumber()
  doctor_id?: number;

  @IsOptional()
  @IsString()
  doctor_name?: string;

  @IsOptional()
  @IsString()
  specialty_name?: string;
}
