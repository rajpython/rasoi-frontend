// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import { getProfile, logoutUser, refreshAccessToken } from "../api/authApi";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // profile object, or null

  // Load tokens/profile from localStorage on mount
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (accessToken && refreshToken) {
      // Optionally, you can re-fetch user profile here for extra safety
      getProfile()
        .then((profile) => setUser(profile))
        .catch(() => setUser(null));
    }
  }, []);

  // Login: store tokens and user profile
  const login = async ({ access, refresh }) => {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    try {
      const profile = await getProfile();
      setUser(profile);
    } catch (err) {
      setUser(null);
      throw err;
    }
  };

  // Logout: clear everything
  const logout = () => {
    logoutUser(); // just clears tokens from localStorage
    setUser(null);
  };

  // Optionally, add a method to refresh access token and update state
  const refreshToken = async () => {
    try {
      await refreshAccessToken();
      // Optionally, re-fetch profile if you wish
    } catch (err) {
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
}
