import { API_URL } from "../config";
import { notify } from "../components/Notification";

export async function getDivinidades() 
{
  try {
    const url = `${API_URL}/divinidades/GET_Divinidades`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) return null; // si no hay Divinidades devuelve NULL

    const data = await res.json();
    return data || null; // si el backend devuelve vacío, también null
  } catch (error) {
    notify("error", "Error fetching Divinidades: "+error);
    return null;
  }
}
