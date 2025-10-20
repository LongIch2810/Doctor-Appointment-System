import axiosInstance from "@/configs/axios";

export const fetchSpecialties = async (data: {
  page: number;
  limit: number;
}) => {
  const res = await axiosInstance.post("/specialties", data);
  return res.data;
};
