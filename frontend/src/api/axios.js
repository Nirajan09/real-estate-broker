import axios from "axios";

// Use environment variable for baseURL
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach token automatically to every request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;