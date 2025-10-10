import { API_URL } from "../config";

/** Llama al endpoint que ya tienes */
export async function simularCombate(p1_id, p2_id) {
  const res = await fetch(`${API_URL}/combate/simular_combate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ p1_id, p2_id })
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
