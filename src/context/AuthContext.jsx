import React from "react";
import axios from "axios";

const AuthContext = React.createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = React.useState(() => {
    try {
      const raw = localStorage.getItem("fa_user");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = React.useState(() => {
    try {
      return localStorage.getItem("fa_token");
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
    } catch (e) { }
  }, [user, token]);

  async function login(credentials) {
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", credentials);
      setUser(res.data);
      setToken(res.data.token);
      return res.data;
    } catch (err) {
      console.error("Login failed", err);
      throw err.response?.data?.message || "Login failed";
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
  }

  async function signup(details) {
    try {
      const res = await axios.post("http://localhost:5000/api/users/register", details);
      setUser(res.data);
      setToken(res.data.token);
      return res.data;
    } catch (err) {
      console.error("Signup failed", err);
      throw err.response?.data?.message || "Signup failed";
    }
  }

  const isAdmin = () => user?.role === "admin";
  const isOwner = () => user?.role === "restaurant_owner" || !!user?.managedRestaurantId;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, signup, isAdmin, isOwner }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
