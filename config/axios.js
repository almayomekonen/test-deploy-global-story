import axios from "axios";

// Set API URL based on environment
const baseURL =
  window.location.hostname === "localhost"
    ? "/api"
    : "https://aardvark-stories-api.onrender.com/api";

console.log(`Connecting to API at: ${baseURL}`);

const api = axios.create({
  baseURL,
  timeout: 10000, // Increased timeout for slower connections
  headers: {
    "Content-Type": "application/json",
  },
});

// Add detailed error logging
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.message !== "canceled") {
      console.error("API Error:", error.message);

      // Log detailed error information
      if (error.config) {
        console.error("Request URL:", error.config.url);
        console.error("Request Method:", error.config.method);
        console.error("Request Headers:", error.config.headers);
      }

      if (error.response) {
        console.error("Response Status:", error.response.status);
        console.error("Response Data:", error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

// Add auth token if available
const token = localStorage.getItem("token");
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default api;
