import { fetchOutstandingDoctors } from "@/api/doctorApi";
import { useQuery } from "@tanstack/react-query";

export function useOutstandingDoctors() {
  return useQuery({
    queryKey: ["outstanding-doctors"],
    queryFn: fetchOutstandingDoctors,
    staleTime: 1000 * 60 * 10,
  });
}
