import { getMessagesByChannelId } from "@/api/messageApi";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useGetMessagesInfinite(channelId: number) {
  return useInfiniteQuery({
    queryKey: ["messages", channelId],
    queryFn: ({ pageParam }) => getMessagesByChannelId(channelId, pageParam),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data;
      if (page < totalPages) {
        return page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!channelId,
  });
}
