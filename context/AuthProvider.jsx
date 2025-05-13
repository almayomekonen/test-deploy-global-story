import { useCallback, useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import api from "../config/axios";
import { jwtDecode } from "jwt-decode";

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  const setAuthToken = useCallback((token) => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete api.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, []);

  const checkTokenExpiration = useCallback(() => {
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      const expiresIn = decoded.exp - currentTime;
      console.log(
        `Token expires in ${Math.floor(
          expiresIn / 60
        )} minutes and ${Math.floor(expiresIn % 60)} seconds`
      );

      if (decoded.exp < currentTime + 60) {
        console.log("Token expired or expiring soon, logging out");
        setToken(null);
        setCurrentUser(null);
        setIsAuthenticated(false);
        setAuthToken(null);
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Token validation error:", error);

      if (
        error.message &&
        (error.message.includes("Invalid token") ||
          error.message.includes("JWT"))
      ) {
        setToken(null);
        setCurrentUser(null);
        setIsAuthenticated(false);
        setAuthToken(null);
        localStorage.removeItem("token");
      }
    }
  }, [token, setAuthToken]);

  useEffect(() => {
    const tokenCheckInterval = setInterval(() => {
      if (token) {
        checkTokenExpiration();
      }
    }, 60000);

    return () => clearInterval(tokenCheckInterval);
  }, [token, checkTokenExpiration]);

  const loadUser = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      setAuthToken(token);
      const response = await api.get("/auth/me");

      if (response.data && response.data.success && response.data.user) {
        setCurrentUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        throw new Error("Invalid user data received");
      }
    } catch (error) {
      console.error("Error loading user:", error.message || error);
      setCurrentUser(null);
      setToken(null);
      setIsAuthenticated(false);
      setAuthToken(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, [setAuthToken, token]);

  async function register(formData) {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/auth/register", formData);
      setToken(response.data.token);
      setAuthToken(response.data.token);
      await loadUser();
      return true;
    } catch (error) {
      console.error("Error registering new user:", error);
      setError(error);
      if (error.response?.status === 404) {
        console.error(
          "API endpoint not found - check network connectivity or API URL"
        );
      }
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/auth/login", { email, password });
      setToken(response.data.token);
      setAuthToken(response.data.token);
      await loadUser();
      return true;
    } catch (error) {
      console.error("Error logging in:", error);
      setError(error);
      if (error.response?.status === 404) {
        console.error(
          "API endpoint not found - check network connectivity or API URL"
        );
      }
      return false;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setToken(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
    setAuthToken(null);
  }

  useEffect(() => {
    if (token) {
      checkTokenExpiration();
      loadUser();
    } else {
      setLoading(false);
    }
  }, [checkTokenExpiration, loadUser, token]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
