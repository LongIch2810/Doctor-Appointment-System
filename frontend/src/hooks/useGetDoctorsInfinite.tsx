import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchDoctors } from "../api/doctorApi";
import type { filterDoctorsOptional } from "@/types/interface/filterDoctors";

export function useGetDoctorsInfinite(filters?: filterDoctorsOptional) {
  return useInfiniteQuery({
    queryKey: ["doctors", filters],
    queryFn: ({ pageParam }) =>
      fetchDoctors({ page: pageParam as number, limit: 20, ...filters }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data;
      return page < totalPages ? page + 1 : undefined;
    },
    // staleTime: 1000 * 60 * 5,
  });
}
