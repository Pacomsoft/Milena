import { notify } from "../components/Notification";
import { API_URL } from "../config";

/** Llama al endpoint que ya tienes */
export async function simularCombate(payload) {
  const res = await fetch(`${API_URL}/combate/simular_combate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  // Esperamos `data.events` como arreglo; si no viene, devolvemos vacío
  return Array.isArray(data.events) ? data : { ...data, events: [] };
}

export async function getBatalla(id) {
  const res = await fetch(`${API_URL}/combate/combates/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  // Esperamos `data.events` como arreglo; si no viene, devolvemos vacío
  return Array.isArray(data.events) ? data : { ...data, events: [] };
}

export async function buscarContrincantes({ nombre, nivel, signo, deidad, zona, account, nivel_act }) {
  const payload = { nombre, nivel, signo, deidad, zona, account, nivel_act };

  // 🔥 Limpia campos vacíos o strings vacíos
  Object.keys(payload).forEach((key) => {
    if (payload[key] === "" || payload[key] === undefined) {
      payload[key] = null;
    }
  });

  const res = await fetch(`${API_URL}/caballeros/buscar_contrincante`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    notify("error", `Error al buscar contrincantes: HTTP ${res.status}`);
    return null;
  }

const data = await res.json();
return data ?? null;
}

