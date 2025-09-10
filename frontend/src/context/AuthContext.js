// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { getProfile } from "../services/auth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ⬅️ nuevo estado

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getProfile();
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false); // ⬅️ se termina el "parpadeo"
      }
    }
    fetchUser();
  }, []);

  const loginUser = (userData) => setUser(userData);
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("token");
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}
