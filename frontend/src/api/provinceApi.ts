import axios from "axios";

export const fetchProvinces = async () => {
  const res = await axios.get(import.meta.env.VITE_PROVINCES_API_URL);
  return res.data;
};
