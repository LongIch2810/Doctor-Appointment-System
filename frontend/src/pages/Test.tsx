import Legend from "@/components/legend/Legend";
import { Calendar } from "@/components/ui/calendar";
import { formatDate } from "@/utils/formatDate";
import { useState } from "react";

const Test = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  console.log(formatDate(selectedDate));
  console.log(new Date());

  return (
    <div className="p-4 flex flex-col gap-3">
      <Calendar
        mode="single"
        defaultMonth={startOfToday}
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="rounded-md border shadow"
        disabled={(date) => date < startOfToday}
      />
      <div className="flex gap-4 text-sm">
        <Legend color="bg-gray-300" label="Đã hết hiệu lực" />
        <Legend color="bg-white border" label="Còn trống" />
      </div>
    </div>
  );
};

export default Test;
