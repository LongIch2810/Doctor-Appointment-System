import { fetchSpecialties } from "@/api/specialtyApi";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useGetSpecialtiesInfinite(filters?: Record<string, any>) {
  return useInfiniteQuery({
    queryKey: ["specialties", filters],
    queryFn: ({ pageParam }) =>
      fetchSpecialties({ page: pageParam as number, limit: 10, ...filters }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5,
  });
}
