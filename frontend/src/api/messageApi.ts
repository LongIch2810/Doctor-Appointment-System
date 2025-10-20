import axiosInstance from "@/configs/axios";

export const getMessagesByChannelId = async (
  channelId: number,
  page: number = 1
) => {
  const res = await axiosInstance.get(`/messages/${channelId}?page=${page}`);
  return res.data;
};
