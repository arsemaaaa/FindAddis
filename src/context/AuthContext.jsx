import React from "react";

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

  React.useEffect(() => {
    try {
      if (user) localStorage.setItem("fa_user", JSON.stringify(user));
      else localStorage.removeItem("fa_user");
    } catch (e) {}
  }, [user]);

  function login(credentials) {
    const mockUser = { id: "u1", name: credentials.name ?? "User", email: credentials.email ?? "user@example.com", role: credentials.role || "user" };
    setUser(mockUser);
    return mockUser;
  }

  function logout() {
    setUser(null);
  }

  function signup(details) {
    const mockUser = { id: "u2", name: details.name, email: details.email, role: details.role || "user" };
    setUser(mockUser);
    return mockUser;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, isAdmin: () => user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
