import axios from "axios";

// Change this in your axios.js file
const baseURL =
  window.location.hostname === "localhost"
    ? "/api" // For development on your computer
    : "https://aardvark-stories-api.onrender.com/api"; // For the internet version

const api = axios.create({
  baseURL,
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.defaults.headers.common["Cache-Control"] = "no-cache";
api.defaults.headers.common["Pragma"] = "no-cache";

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.message !== "canceled" &&
      (!error.response || error.response.status >= 500)
    ) {
      console.error("API Error:", error.message);
    }
    return Promise.reject(error);
  }
);

const token = localStorage.getItem("token");
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default api;
