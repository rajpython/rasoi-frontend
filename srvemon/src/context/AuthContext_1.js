
// File: src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing stored user:", e);
        setUser(null);
      }
    }
  }, []);

  const login = (userData, token) => {
    const userWithToken = { ...userData, token };
    localStorage.setItem("authToken", token);
    localStorage.setItem("authUser", JSON.stringify(userWithToken));
    setUser(userWithToken);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token: user?.token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
