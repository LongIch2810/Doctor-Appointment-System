import { create } from "zustand";

type bookingAppointmentStore = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  doctor_id: number;
  setDoctorId: (data: number) => void;
  doctor_schedule_id: number;
  setDoctorScheduleId: (data: number) => void;
  tempTime: { start_time: string; end_time: string };
  setTempTime: (data: { start_time: string; end_time: string }) => void;
  reset: () => void;
};

export const useBookingAppointmentStore = create<bookingAppointmentStore>()(
  (set) => ({
    selectedDate: new Date(),
    doctor_id: 0,
    doctor_schedule_id: 0,
    tempTime: { start_time: "", end_time: "" },
    setDoctorId: (data: number) => set({ doctor_id: data }),
    setDoctorScheduleId: (data: number) => set({ doctor_schedule_id: data }),
    setSelectedDate: (date: Date) => set({ selectedDate: date }),
    setTempTime: (data: { start_time: string; end_time: string }) =>
      set({ tempTime: data }),
    reset: () =>
      set({
        selectedDate: new Date(),
        doctor_id: 0,
        doctor_schedule_id: 0,
        tempTime: { start_time: "", end_time: "" },
      }),
  })
);
