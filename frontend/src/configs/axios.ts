import { useUserStore } from "@/store/useUserStore";
import axios from "axios";
const axiosInstance = axios.create({
  baseURL: `${
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"
  }/api/v1`,
  withCredentials: true,
});

const refreshInstance = axios.create({
  baseURL: `${
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"
  }/api/v1`,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: any[] = [];

function processorQueue(error: any = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: () => resolve(axiosInstance(originalRequest)),
          reject: () => reject(error),
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await refreshInstance.post("/auth/refresh");
      processorQueue();
      return axiosInstance(originalRequest);
    } catch (refreshErr) {
      processorQueue(refreshErr);
      await refreshInstance.post("/auth/logout");
      useUserStore.getState().resetState();
      window.location.href = "/sign-in";
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
