import DoctorSchedule from 'src/entities/doctorSchedule.entity';
import { DayOfWeek } from 'src/shared/enums/dayOfWeek';

export const groupSchedulesByDay = (schedules: DoctorSchedule[]) => {
  return schedules.reduce(
    (acc, schedule): any => {
      const day = schedule.day_of_week;
      if (!acc[day]) {
        acc[day] = [];
      }

      acc[day].push({
        id: schedule.id,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
        is_active: schedule.is_active,
      });

      return acc;
    },
    {} as Record<
      DayOfWeek,
      { id: number; start_time: string; end_time: string; is_active: boolean }[]
    >,
  );
};
