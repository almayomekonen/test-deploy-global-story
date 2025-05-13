import axios from "axios";

// Set API URL based on environment
const baseURL =
  window.location.hostname === "localhost"
    ? "/api"
    : "https://aardvark-stories-api.onrender.com/api";

console.log(`Connecting to API at: ${baseURL}`);

const api = axios.create({
  baseURL,
  timeout: 20000, // Increased timeout for mobile connections
  headers: {
    "Content-Type": "application/json",
  },
  // Retry configuration for network issues
  maxRetries: 3,
  retryDelay: 1000,
});

// Add a retry mechanism for failed requests
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Get the original request configurations
    const { config } = error;

    // Set the retry count if it doesn't exist
    config.retryCount = config.retryCount || 0;

    // Check if we need to retry (network errors or 5xx errors)
    const shouldRetry =
      config.retryCount < api.defaults.maxRetries &&
      (error.code === "ECONNABORTED" ||
        error.code === "ERR_NETWORK" ||
        (error.response && error.response.status >= 500));

    if (shouldRetry) {
      // Increase the retry count
      config.retryCount += 1;

      // Create a new promise to retry after delay
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
