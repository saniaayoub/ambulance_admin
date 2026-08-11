import axios from "axios";
import { useAuthStore } from "../stores/authStore";
console.log("VITE_BASE_URL:", import.meta.env.VITE_BASE_URL);

const api = axios.create({
  //   baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  baseURL: "http://192.168.1.6:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(response, "response");

    return response;
  },
  (error) => {
    console.log(error, "error");
    if (error.response?.status === 401) {
      // Handle unauthorized, clear token
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

export default api;
