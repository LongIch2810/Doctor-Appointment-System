import { fetchUserInfo } from "@/api/userApi";
import { useQuery } from "@tanstack/react-query";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: fetchUserInfo,
    staleTime: 1000 * 60 * 10,
  });
}
