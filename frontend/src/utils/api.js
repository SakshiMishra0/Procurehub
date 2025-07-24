// src/services/api.js

import axios from "axios";

// ✅ Create Axios instance with default configuration
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api", // 💡 Use environment variable for flexibility
  withCredentials: true, // 🔐 Allows sending cookies (for sessions or auth)
});

// 🔐 Request Interceptor: Add token to Authorization header if present
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ⚠️ Optional: You can also add a response interceptor for error handling
// API.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Example: Redirect to login on 401 Unauthorized
//     if (error.response?.status === 401) {
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

export default API;
