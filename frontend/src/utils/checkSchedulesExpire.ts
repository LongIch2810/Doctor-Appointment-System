import type { DoctorSchedule } from "@/types/interface/doctorSchedule.interface";
import {
  checkExpireTime,
  checkTimeBooked,
  formatTime,
  toHHMM,
} from "./formatTime";

export const checkSchedulesExpireOrBooked = (
  schedules: DoctorSchedule[],
  selectedDate: Date
) => {
  if (!schedules || !schedules.length) return true;
  return (
    schedules.every((schedule) =>
      checkExpireTime(
        selectedDate,
        toHHMM(schedule.start_time),
        toHHMM(schedule.end_time),
        formatTime(new Date())
      )
    ) ||
    schedules.every((schedules) =>
      checkTimeBooked(selectedDate, schedules.appointments)
    )
  );
};
