import { useBookingAppointmentStore } from "@/store/bookingAppointmentStore";
import Legend from "../legend/Legend";
import { Calendar } from "../ui/calendar";
import { vi } from "date-fns/locale";

const CalendarComponent = () => {
  const { selectedDate, setSelectedDate } = useBookingAppointmentStore();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  return (
    <div className="flex flex-col gap-4 w-full">
      <Calendar
        mode="single"
        defaultMonth={startOfToday}
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="rounded-md border shadow w-full max-w-full md:max-w-md mx-auto"
        disabled={(date) => date < startOfToday}
        locale={vi}
        required={true}
      />

      {/* Legend responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3 text-sm">
        <Legend color="bg-gray-300" label="Đã hết hiệu lực" />
        <Legend color="bg-white border" label="Có hiệu lực" />
      </div>
    </div>
  );
};

export default CalendarComponent;
