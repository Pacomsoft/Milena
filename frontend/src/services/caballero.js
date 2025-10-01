import { API_URL } from "../config";
import { notify } from "../components/Notification";



export async function getCaballero(cuenta, token) {
  try {
    const url = `${API_URL}/caballeros/mis_caballeros/${cuenta}`;
    const res = await fetch(url, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    if (!res.ok) return null; // si no hay caballero, devuelve null

    const data = await res.json();
    return data || null; // si el backend devuelve vacío, también null
  } catch (error) {
    notify("error", "Error fetching caballero: "+error);
    return null;
  }
}

export async function onSubirStatAPI(payload, token)
{
  try
  {
    const url = `${API_URL}/caballeros/addStat`;
    const res = await fetch(url, {
      method:"POST",
      headers:{
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if(!res.ok)
    {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Error al subir el stat")
    }

    const data = await res.json();
    return data;
  }
  catch(error)
  {
    notify("error", "Error subiendo el stat: "+error.message)
  }
}

export async function createCaballero(payload, token) {
  try {
    const url = `${API_URL}/caballeros/newplayer`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // token de seguridad
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Error al crear el caballero");
    }

    const data = await res.json();
    return data; // retorna el caballero creado
  } catch (error) {
    notify("error", "Error creando caballero: " + error.message);
    return null;
  }
}

