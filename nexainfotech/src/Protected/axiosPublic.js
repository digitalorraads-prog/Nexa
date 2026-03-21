// services/axiosPublic.js
import axios from "axios";

const publicAxios = axios.create({
  baseURL: "https://nexa-backend-xyul.onrender.com",
  timeout: 30000, 
});

export default publicAxios;