import { API_URL } from "../config";



export async function getCaballero(cuenta) {
  try {
    const url = `${API_URL}/caballeros/mis_caballeros/${cuenta}`;
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) return null; // si no hay caballero, devuelve null

    const data = await res.json();
    return data || null; // si el backend devuelve vacío, también null
  } catch (error) {
    console.error("Error fetching caballero:", error);
    return null;
  }
}
