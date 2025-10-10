import React, { useState } from "react";
import CombateViewer from "./CombatViewer";
import { simularCombate } from "../services/combate";

/** 
 * Props opcionales: p1Id, p2Id iniciales 
 * Si no los pasas, muestra inputs para probar.
 */
export default function SimuladorCombate({ p1Id: initialP1, p2Id: initialP2 }) {
  const [p1Id, setP1] = useState(initialP1 || "");
  const [p2Id, setP2] = useState(initialP2 || "");
  const [events, setEvents] = useState([]);
  const [finalStats, setFinal] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSimular() {
    if (!p1Id || !p2Id) return alert("Faltan IDs");
    try {
      setLoading(true);
      setEvents([]);
      const data = await simularCombate(p1Id, p2Id);
      setEvents(data.events || []);
      setFinal(data.final_stats || null);
    } catch (e) {
      console.error(e);
      alert("Error al simular");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {!initialP1 && !initialP2 && (
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input placeholder="p1_id" value={p1Id} onChange={e=>setP1(e.target.value)} />
          <input placeholder="p2_id" value={p2Id} onChange={e=>setP2(e.target.value)} />
          <button onClick={handleSimular} disabled={loading}>
            {loading ? "Simulando..." : "Simular"}
          </button>
        </div>
      )}
      {(initialP1 || initialP2) && (
        <div style={{ marginBottom: 12 }}>
          <button onClick={handleSimular} disabled={loading}>
            {loading ? "Simulando..." : "Simular"}
          </button>
        </div>
      )}

      <CombateViewer events={events} />

      {finalStats && (
        <div style={{ marginTop: 12, fontSize: ".9rem", color: "#94a3b8" }}>
          <div><b>Final:</b></div>
          <div>{finalStats.p1.nombre}: {finalStats.p1.salud_final} HP, daño {finalStats.p1["daño_total"]}</div>
          <div>{finalStats.p2.nombre}: {finalStats.p2.salud_final} HP, daño {finalStats.p2["daño_total"]}</div>
        </div>
      )}
    </div>
  );
}
