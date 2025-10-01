// src/services/habilidades.js
import { API_URL } from "../config";

export async function getCostoHabilidad(nivel) {
  try {
    const url = `${API_URL}/habilidades/GET_Costo`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "nivel_stat": nivel }),
    });

    if (!res.ok) {
      console.error("Error HTTP:", res.status);
      return 999999999; 
    }

    const data = await res.json();
    // asegurarnos que viene la propiedad costo
    return data?.costo ?? 999999999;
  } catch (error) {
    console.error("Error obteniendo costo de habilidad:", error);
    if (typeof notify === "function") {
      notify("error", "Error obteniendo costo de habilidad " + error);
    }
    return 999999999;
  }
}
