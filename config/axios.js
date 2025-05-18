import axios from "axios";

const baseURL = "/api";

const wakeupApi = axios.create({ baseURL, timeout: 30000 });

const wakeupBackend = async () => {
  try {
    console.log("Attempting to wake up backend...");
    await wakeupApi.get("/test");
    console.log("Backend is awake");
  } catch (error) {
    console.error("Backend wakeup failed:", error.message);
  }
};

wakeupBackend();

const api = axios.create({
  baseURL,
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
  maxRetries: 3,
  retryDelay: 1000,
});

api.interceptors.response.use(
  (res) => res,
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

    if (shouldRetry && config.retryCount === 0) {
      try {
        await wakeupBackend();
        await new Promise((res) => setTimeout(res, 2000));
      } catch (error) {
        console.log(error);
      }
    }

    if (shouldRetry) {
      config.retryCount += 1;
      const delay = config.retryCount * api.defaults.retryDelay;
      return new Promise((resolve) =>
        setTimeout(() => resolve(api(config)), delay)
      );
    }

    return Promise.reject(error);
  }
);

const token = localStorage.getItem("token");
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default api;
