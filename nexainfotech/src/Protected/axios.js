import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://nexa-backend-xyul.onrender.com",
  timeout: 30000, // 30 second timeout
  withCredentials: true,
});

export default axiosInstance;