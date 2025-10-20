import { useBookingAppointmentStore } from "@/store/bookingAppointmentStore";
import { formatDate, getWeekday, toDate } from "@/utils/formatDate";
import { disconnectSocket, registerHandler } from "@/utils/socket";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "react-toastify";
import type { Socket } from "socket.io-client";

export function useNotifyAppointmentSocket(
  socket: Socket | null,
  doctorId: number,
  setIsPending: (data: boolean) => void
) {
  const queryClient = useQueryClient();
  const { setDoctorScheduleId, setTempTime, setDoctorId } =
    useBookingAppointmentStore();
  useEffect(() => {
    if (!socket || !doctorId) return;

    const handleAppointmentSuccess = (data: any) => {
      console.log(">>> data : ", data);
      setIsPending(false);
      toast.success(
        `Đặt lịch khám thành công vào lúc ${`
                ${data.doctor_schedule.start_time}
               : ${data.doctor_schedule.end_time}`} ${formatDate(
          new Date(toDate(data.appointment_date)),
          "vi-VN"
        )} với BS.${data.doctor.user.fullname}`
      );
      setDoctorScheduleId(0);
      setTempTime({ start_time: "", end_time: "" });
      setDoctorId(0);
    };

    const handleAppointmentFail = (message: string) => {
      console.log("❌ Appointment fail:", message);
      setIsPending(false);
      toast.error(message);
    };

    const handleAppointmentSlotBooked = (slot: any) => {
      queryClient.setQueryData(
        ["doctor-schedules", Number(doctorId)],
        (oldData: any) => {
          if (!oldData) return oldData;
          const weekday = getWeekday(toDate(slot.appointment_date));
          return {
            ...oldData,
            data: {
              ...oldData.data,
              [weekday]: oldData.data[weekday].map((s: any) =>
                s.id === slot.doctor_schedule_id
                  ? { ...s, appointments: [...s.appointments, slot] }
                  : s
              ),
            },
          };
        }
      );
    };

    registerHandler("appointment:success", handleAppointmentSuccess);

    registerHandler("appointment:fail", handleAppointmentFail);

    registerHandler("appointment:slotBooked", handleAppointmentSlotBooked);

    return () => {
      // disconnectSocket();
      socket?.off("appointment:success", handleAppointmentSuccess);

      socket?.off("appointment:fail", handleAppointmentFail);

      socket?.off("appointment:slotBooked", handleAppointmentSlotBooked);
    };
  }, [doctorId, socket]);
}
