import axios from "axios";
const BASE_URL = import.meta.env.VITE_API;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const accessToken = JSON.parse(localStorage.getItem("accToken"));
      console.log(accessToken);
      
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
