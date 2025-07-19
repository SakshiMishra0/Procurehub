// src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Replace with your Render URL for production
  withCredentials: true,
});

// Attach token from localStorage
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
