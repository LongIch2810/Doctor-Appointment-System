import axiosInstance from "@/configs/axios";
import type { filterDoctors } from "@/types/interface/filterDoctors";

export const fetchOutstandingDoctors = async () => {
  const res = await axiosInstance.get("/doctors/outstanding-doctors");
  return res.data;
};

export const fetchDoctors = async (data: filterDoctors) => {
  const res = await axiosInstance.post("/doctors", data);
  return res.data;
};

export const fetchDoctorDetail = async (doctorId: number) => {
  const res = await axiosInstance.get(`/doctors/${doctorId}`);
  return res.data;
};
