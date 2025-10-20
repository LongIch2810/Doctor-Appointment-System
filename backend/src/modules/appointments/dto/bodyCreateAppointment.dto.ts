import {
  IsDateString,
  IsEnum,
  IsMilitaryTime,
  IsNotEmpty,
  IsNumber,
  IsString,
  Validate,
  ValidateIf,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BookingMode } from 'src/shared/enums/bookingMode';
import { toMinutes } from '../../../utils/toMinutes';

@ValidatorConstraint({ name: 'DoctorOrSpecialty', async: false })
export class DoctorOrSpecialtyRequired implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const dto = args.object as BodyCreateAppointmentDto;

    if (dto.booking_mode === BookingMode.AI_SELECT) {
      return !!dto.doctor_name || !!dto.specialty_name;
    }
    return true;
  }

  defaultMessage() {
    return 'AI_SELECT yêu cầu cung cấp ít nhất doctor_name hoặc specialty_name.';
  }
}
@ValidatorConstraint({ name: 'StartTimeAndEndtime', async: false })
export class StartTimeAndEndtimeRequired
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    const dto = args.object as BodyCreateAppointmentDto;

    if (dto.booking_mode === BookingMode.AI_SELECT) {
      return toMinutes(dto.start_time) < toMinutes(dto.end_time);
    }
    return true;
  }

  defaultMessage() {
    return 'AI_SELECT yêu cầu cung cấp start_time phải nhỏ hơn end_time.';
  }
}

export class BodyCreateAppointmentDto {
  @IsDateString()
  appointment_date: string;

  @IsMilitaryTime()
  @ValidateIf((o) => o.booking_mode === BookingMode.AI_SELECT)
  start_time: string;

  @IsMilitaryTime()
  @ValidateIf((o) => o.booking_mode === BookingMode.AI_SELECT)
  end_time: string;

  @IsNumber()
  @ValidateIf((o) => o.booking_mode === BookingMode.USER_SELECT)
  doctor_id: number;

  @IsNumber()
  @ValidateIf((o) => o.booking_mode === BookingMode.USER_SELECT)
  doctor_schedule_id: number;

  @IsNumber()
  @IsNotEmpty()
  relative_id: number;

  @IsString()
  @ValidateIf((o) => o.booking_mode === BookingMode.AI_SELECT)
  doctor_name: string;

  @IsEnum(BookingMode)
  booking_mode: BookingMode;

  @IsString()
  @ValidateIf((o) => o.booking_mode === BookingMode.AI_SELECT)
  specialty_name: string;

  @Validate(StartTimeAndEndtimeRequired)
  _startTimeEndTimeCheck: string;

  @Validate(DoctorOrSpecialtyRequired)
  _doctorOrSpecialtyCheck: string;
}
