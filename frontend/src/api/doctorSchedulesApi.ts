import axiosInstance from "@/configs/axios";

export const fetchDoctorSchedules = async (doctorId: number) => {
  const res = await axiosInstance.get(`/doctor-schedules/${doctorId}`);
  return res.data;
};
