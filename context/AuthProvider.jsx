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

  // token provider
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
    if (token) {
      setLoading(true);
      try {
        const decode = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decode.exp < currentTime) {
          setToken(null);
          setCurrentUser(null);
          setIsAuthenticated(false);
          setAuthToken(null);
        }
      } catch (error) {
        console.error("Token decode Error", error);
        setToken(null);
        setCurrentUser(null);
        setIsAuthenticated(false);
        setAuthToken(null);
      } finally {
        setLoading(false);
      }
    }
  }, [setAuthToken, token]);

  const loadUser = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      setAuthToken(token);
      const response = await api.get("/auth/me");
      setCurrentUser(response.data.user);

      setIsAuthenticated(true);
    } catch (error) {
      console.log(error);
      setCurrentUser(null);
      setToken(null);
      setIsAuthenticated(false);
      setAuthToken(null);
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
      // users
      return true;
    } catch (error) {
      console.log(error, "Error registering new user");
      setError(error, "Error registering new user");
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

      // users
      return true;
    } catch (error) {
      console.log(error, "Error logging in new user");
      setError(error, "Error login new user");
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
