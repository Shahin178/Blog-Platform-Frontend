import axios from "axios";
import { store } from "./utils/store"; // import directly from your Redux store

const api = axios.create({
  baseURL: "https://blog-platform-backend-1-dqa6.onrender.com/api"||"http://localhost:8080/api",
});

api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
