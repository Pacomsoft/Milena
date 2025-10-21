import { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { notify } from "../components/Notification";

export default function Logout() {
  const { logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Lógica directa, sin botones ni clicks
    logoutUser();
    notify("info", "Te esperamos de vuelta Caballero, ¡Hasta pronto!");
    navigate("/", { replace: true });
  }, [logoutUser, navigate]);

  return null; // No necesitas renderizar nada, o podrías poner un spinner si quieres
}
