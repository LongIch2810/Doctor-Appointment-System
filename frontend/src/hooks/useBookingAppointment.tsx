import { bookingAppointment } from "@/api/appointmentApi";
import { useMutation } from "@tanstack/react-query";

export function useBookingAppointment() {
  return useMutation({
    mutationFn: bookingAppointment,
  });
}
