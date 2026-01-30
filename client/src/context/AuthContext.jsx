import React from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = React.createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = React.useState(() => {
    try {
      const stored = localStorage.getItem("fa_user");
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = React.useState(() => {
    try {
      return localStorage.getItem("fa_token") || null;
    } catch (e) {
      return null;
    }
  });

  React.useEffect(() => {
    try {
      if (user) {
        localStorage.setItem("fa_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("fa_user");
      }

      if (token) {
        localStorage.setItem("fa_token", token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        localStorage.removeItem("fa_token");
        delete axios.defaults.headers.common['Authorization'];
      }
    } catch (e) {
      console.log(e)
    }
  }, [user, token]);

  async function login(credentials) {
    try {
      const res = await axios.post("http://localhost:3000/api/users/login", credentials);
      const decoded = jwtDecode(res.data.token);

      setUser(decoded);
      setToken(res.data.token);
      return res.data;
    } catch (err) {
      console.error("Login failed", err);
      throw err.response?.data?.message || "Login failed";
    }
  }

  async function ownerLogin(credentials) {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/owners/login",
        credentials
      );
      const decoded = jwtDecode(res.data.token);
      setUser(decoded);
      setToken(res.data.token);

      // optional: mark role
      localStorage.setItem("role", "owner");

      return res.data;
    } catch (err) {
      console.error("Owner login failed", err);
      throw err.response?.data?.message || "Owner login failed";
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
  }

  const isAdmin = () => user?.role === "admin";
  const isOwner = () => user?.role === "restaurant_owner" || !!user?.managedRestaurantId;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, /*signup,*/ isAdmin, isOwner, ownerLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
