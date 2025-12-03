import React from "react";

const AuthContext = React.createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);

  function login(credentials) {
    // mock login: accept any credential
    const mockUser = { id: "u1", name: credentials.name ?? "User", email: credentials.email ?? credentials.email ?? "user@example.com" };
    setUser(mockUser);
    return mockUser;
  }

  function logout() {
    setUser(null);
  }

  function signup(details) {
    const mockUser = { id: "u2", name: details.name, email: details.email };
    setUser(mockUser);
    return mockUser;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
