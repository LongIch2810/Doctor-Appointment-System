import { getMessagesChatbot } from "@/api/conversationApi";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useGetMessagesChatbotInfinite(userId: number) {
  return useInfiniteQuery({
    queryKey: ["messages-chatbot", userId],
    queryFn: ({ pageParam }) => getMessagesChatbot(userId, pageParam),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data;
      if (page < totalPages) {
        return page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!userId,
  });
}
