// services/axiosPublic.js
import axios from "axios";

const publicAxios = axios.create({
  baseURL: "https://nexa-backend-xyul.onrender.com",

});

export default publicAxios;