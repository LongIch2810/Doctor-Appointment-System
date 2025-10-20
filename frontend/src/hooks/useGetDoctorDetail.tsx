import { fetchDoctorDetail } from "@/api/doctorApi";
import { useQuery } from "@tanstack/react-query";

export function useGetDoctorDetail(doctorId: number) {
  return useQuery({
    queryKey: ["doctor-detail", doctorId],
    queryFn: () => fetchDoctorDetail(doctorId),
    staleTime: 1000 * 60 * 5,
  });
}
