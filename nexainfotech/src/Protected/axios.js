import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://nexa-backend-xyul.onrender.com",
  withCredentials: true, // 🔥 very important for session
});

export default axiosInstance;