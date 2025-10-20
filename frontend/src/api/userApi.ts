import axiosInstance from "@/configs/axios";

export const fetchUserInfo = async () => {
  const res = await axiosInstance.get("/users/info");
  return res.data;
};
