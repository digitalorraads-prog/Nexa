import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://nexa-backend-xyul.onrender.com",
  withCredentials: true, // Required to send/receive session cookies across different domains
});

export default axiosInstance;