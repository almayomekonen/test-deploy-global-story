import { createContext } from "react";

const AuthContext = createContext({
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  register: async () => {},
  login: async () => {},
  logout: () => {},
  setError: () => {},
});

export default AuthContext;
