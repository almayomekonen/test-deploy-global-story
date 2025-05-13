import axios from "axios";

const baseURL =
  window.location.hostname === "localhost"
    ? "/api"
    : "https://api-backend-vercel.vercel.app/api";

console.log(`Connecting to API at: ${baseURL}`);

const wakeupApi = axios.create({
  baseURL: "https://api-backend-vercel.vercel.app/api",
  timeout: 30000,
});

const wakeupBackend = async () => {
  try {
    console.log("Attempting to wake up backend server...");
    await wakeupApi.get("/test");
    console.log("Backend server is awake!");
    return true;
  } catch (error) {
    console.log(
      "Backend wakeup ping failed or server is already awake",
      error.message
    );
    return false;
  }
};

wakeupBackend();

const api = axios.create({
  baseURL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },

  maxRetries: 3,
  retryDelay: 1000,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { config } = error;

    if (!config) return Promise.reject(error);

    config.retryCount = config.retryCount || 0;

    const shouldRetry =
      config.retryCount < api.defaults.maxRetries &&
      (error.code === "ECONNABORTED" ||
        error.code === "ERR_NETWORK" ||
        (error.response &&
          (error.response.status >= 500 || error.response.status === 404)));

    if (
      shouldRetry &&
      config.retryCount === 0 &&
      (error.code === "ERR_NETWORK" ||
        (error.response && error.response.status === 404))
    ) {
      try {
        console.log("Trying to wake up backend before retry...");
        await wakeupBackend();

        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (wakeupError) {
        console.log("Backend wakeup failed:", wakeupError);
      }
    }

    if (shouldRetry) {
      config.retryCount += 1;

      const delay = config.retryCount * api.defaults.retryDelay;
      console.log(
        `Retrying request (${config.retryCount}/${api.defaults.maxRetries}) after ${delay}ms`
      );

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(api(config));
        }, delay);
      });
    }

    // Detailed error logging
    if (error.message !== "canceled") {
      console.error("API Error:", error.message);

      if (error.code === "ERR_NETWORK") {
        console.error("Network Error: Check your connection");
      }

      if (error.code === "ECONNABORTED") {
        console.error("Request timeout: Server took too long to respond");
      }

      // Log detailed error information
      if (error.config) {
        console.error("Request URL:", error.config.url);
        console.error("Request Method:", error.config.method);
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
