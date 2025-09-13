// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { getProfile } from "../services/auth";
import { getCaballero } from "../services/caballero";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ⬅️ nuevo estado
  const [caballero, setCaballero] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getProfile();
        const caballero = await getCaballero(data.cuenta);

      
        setCaballero(caballero)
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
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser, caballero }}>
      {children}
    </AuthContext.Provider>
  );
}
