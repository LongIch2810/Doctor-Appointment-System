import { fetchProvinces } from "@/api/provinceApi";
import { useQuery } from "@tanstack/react-query";

export function useProvinces() {
  return useQuery({
    queryKey: ["provinces"],
    queryFn: fetchProvinces,
    staleTime: 1000 * 60 * 10,
  });
}
