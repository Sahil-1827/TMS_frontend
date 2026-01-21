import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        toast.error(data.message || "Unauthorized. Please log in again.");
      } else if (status === 403) {
        toast.error(data.message || "You don't have permission to perform this action.");
      } else if (status === 404) {
        toast.warn(data.message || "The requested resource was not found.");
      } else if (status >= 500) {
        toast.error(data.message || "An unexpected server error occurred. Please try again later.");
      } else {
        toast.error(data.message || "An error occurred. Please try again.");
      }
    } else if (error.request) {
      toast.error("No response from server. Please check your network connection.");
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
    return Promise.reject(error);
  }
);

export default api;
  