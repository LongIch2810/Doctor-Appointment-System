import axiosInstance from "@/configs/axios";

export const uploadFilesMessage = async (data: any) => {
  const res = await axiosInstance.post("/uploads/messages/files", data);
  return res.data;
};
