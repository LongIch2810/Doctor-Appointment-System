import { IsMilitaryTime, IsNotEmpty, IsString, Matches } from 'class-validator';
import { DayOfWeek } from 'src/shared/enums/dayOfWeek';

export class BodyCreateScheduleDto {
  @IsString()
  @IsNotEmpty()
  day_of_week: DayOfWeek;

  @IsMilitaryTime()
  start_time: string;

  @IsMilitaryTime()
  end_time: string;
}
