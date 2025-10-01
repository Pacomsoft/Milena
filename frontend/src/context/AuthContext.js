import React, { createContext, useState, useEffect } from "react";
import { getProfile } from "../services/auth";
import { getCaballero } from "../services/caballero";
import { getBoost } from "../services/boost";
import { getDivinidad } from "../services/divinidad";
import { getSigno } from "../services/zodiaco";

import { jwtDecode } from "jwt-decode";

// usarlo así:

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [caballero, setCaballero] = useState(undefined);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [menuVisible, setMenuVisible] = useState(null);
  const [boosts, setBoosts] = useState([]);
  const [signo, setSigno] = useState([]);
  const [deidad, setDeidad] = useState([]);
  const [puntos, setPuntos] = useState(null);
  const [oro, setOro] = useState(null);

  // --- Función para checar expiración del token
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
          const { exp } = jwtDecode(token);
      return Date.now() >= exp * 1000;
    } catch {
      return true; // token inválido
    }
  };

  useEffect(() => {
    async function fetchUser() {
      if (!token || isTokenExpired(token)) {
        logoutUser();
        setLoading(false);
        return;
      }

      try {
        const data = await getProfile();
        setUser(data.cuenta);
        setUsername(data.user);

        try {
          const caballeroData = await getCaballero(data.cuenta, data.token);
          const boostsData = await getBoost(caballeroData.id, token);
          
          const signoData = await getSigno(caballeroData.id_signo);
          const deidadData = await getDivinidad(caballeroData.id_divinidad);

      
          setCaballero(caballeroData);
          setBoosts(boostsData);
          setSigno(signoData);
          setDeidad(deidadData);
          setOro(caballeroData.oro);
          console.log(caballeroData);
          setPuntos(caballeroData.habilidad);

        } catch {
          setCaballero(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [token]);

  const loginUser = (userData, tokenValue, userName, caballeroData) => {
    setCaballero(caballeroData);
    setUser(userData);
    setToken(tokenValue);
    setUsername(userName);
    localStorage.setItem("token", tokenValue);
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    setUsername(null);
    setCaballero(null);
  };

  // --- Hook opcional: verifica cada minuto si el token expiró
  useEffect(() => {
    const interval = setInterval(() => {
      if (token && isTokenExpired(token)) {
        logoutUser();
      }
    }, 60 * 1000); // cada minuto
    return () => clearInterval(interval);
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        loginUser,
        logoutUser,
        caballero,
        setCaballero,
        username,
        setMenuVisible,
        menuVisible,
        boosts,
        signo,
        deidad,
        oro,
        puntos
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
