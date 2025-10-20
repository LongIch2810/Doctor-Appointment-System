import { Clock } from "lucide-react";
import { useNow } from "@/hooks/useNow";
import type { DoctorScheduleCardProps } from "@/types/global";
import {
  checkExpireTime,
  checkTimeBooked,
  formatTime,
  toHHMM,
} from "@/utils/formatTime";
import type { DoctorSchedule } from "@/types/interface/doctorSchedule.interface";
import { useBookingAppointmentStore } from "@/store/bookingAppointmentStore";

const DoctorScheduleCard = ({
  item,
  selectedDate,
}: DoctorScheduleCardProps) => {
  const { id, start_time, end_time, is_active, appointments } = item;
  const now = useNow();
  const timeNow = formatTime(now);
  const { doctor_schedule_id, setDoctorScheduleId, setTempTime } =
    useBookingAppointmentStore();

  const isExpired = checkExpireTime(
    selectedDate,
    toHHMM(start_time),
    toHHMM(end_time),
    timeNow
  );

  const isBooked =
    appointments &&
    appointments.length > 0 &&
    checkTimeBooked(selectedDate, appointments);

  const handleClick = (item: DoctorSchedule) => {
    if (isExpired || isBooked) return;
    setDoctorScheduleId(item.id);
    setTempTime({ start_time: item.start_time, end_time: item.end_time });
  };

  return (
    <div
      key={id}
      onClick={() => handleClick(item)}
      className={`w-full
        rounded-xl border cursor-pointer text-sm sm:text-base
        transition-all duration-200 ease-in-out p-3
        flex items-center justify-between
        ${
          isExpired || !is_active
            ? "bg-gray-100 text-gray-500 cursor-not-allowed"
            : isBooked
            ? "bg-red-400 text-white"
            : doctor_schedule_id === id
            ? "bg-sky-500 text-white"
            : "hover:shadow-md hover:scale-[1.02] bg-white"
        }`}
    >
      {/* Thời gian */}
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 flex-shrink-0" />
        <span className="font-medium">
          {toHHMM(start_time)} - {toHHMM(end_time)}
        </span>
      </div>
    </div>
  );
};

export default DoctorScheduleCard;
