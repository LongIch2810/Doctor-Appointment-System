import axiosInstance from "@/configs/axios";

export const findChannelByParticipants = async (data: {
  senderId: number;
  receiverId: number;
}) => {
  const res = await axiosInstance.post("/channels/find-by-participants", data);
  return res.data;
};
