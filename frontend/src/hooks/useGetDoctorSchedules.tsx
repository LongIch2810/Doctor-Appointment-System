import { fetchDoctorSchedules } from "@/api/doctorSchedulesApi";
import { useQuery } from "@tanstack/react-query";

export function useGetDoctorSchedules(doctorId: number) {
  return useQuery({
    queryKey: ["doctor-schedules", doctorId],
    queryFn: () => fetchDoctorSchedules(doctorId),
  });
}
