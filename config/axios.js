import axios from "axios";

const baseURL = "/api";
console.log(`Connecting to API at: ${baseURL}`);

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
