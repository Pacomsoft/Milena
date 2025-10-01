import { API_URL } from "../config";
import { notify } from "../components/Notification";

export async function getSignos() 
{
  try {
    const url = `${API_URL}/zodiaco/GET_Signos`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) return null; // si no hay Signos Zodiacales devuelve NULL

    const data = await res.json();
    return data || null; // si el backend devuelve vacío, también null
  } catch (error) {
    notify("error", "Error fetching Signos: "+error);
    return null;
  }
}

export async function getSigno(id) 
{
  try {
    const url = `${API_URL}/zodiaco/GET_Signo/`+id;
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) return null; // si no hay Divinidades devuelve NULL

    const data = await res.json();
    return data || null; // si el backend devuelve vacío, también null
  } catch (error) {
    notify("error", "Error fetching signo: "+error);
    return null;
  }
}
