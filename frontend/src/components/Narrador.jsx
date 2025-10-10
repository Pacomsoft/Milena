import React from "react";
//import mensajes from "../assets/mensajes_combate_dialogados.react.json";
import mensajes from "../assets/catalogo_mensajes.json";
import "../assets/mensajes_combate.css";

/** Evitar repetir plantillas por tipo dentro del mismo combate */
export class UniquePicker {
  constructor(mens) {
    this.mensajes = mens;
    this.pools = {};
  }
  pick(tipo, templateIndex) {
    const arr = this.mensajes[tipo] || [];
    if (!arr.length) return "";
    if (Number.isInteger(templateIndex) && templateIndex >= 0 && templateIndex < arr.length) {
      return arr[templateIndex];
    }
    if (!this.pools[tipo] || this.pools[tipo].length === 0) {
      this.pools[tipo] = [...Array(arr.length).keys()];
      for (let i = this.pools[tipo].length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.pools[tipo][i], this.pools[tipo][j]] = [this.pools[tipo][j], this.pools[tipo][i]];
      }
    }
    const idx = this.pools[tipo].pop();
    return arr[idx];
  }
}

/** Escapar mínimamente variables para evitar inyección */
export function escapeVar(v) {
  return String(v)
    .replaceAll("&","&amp;").replaceAll("<","&lt;")
    .replaceAll(">","&gt;").replaceAll('"',"&quot;")
    .replaceAll("'","&#39;");
}

/** Relleno {placeholder} → valor escapado */
export function fillPlaceholders(tpl, vars = {}) {
  let out = tpl;
  for (const [k, v] of Object.entries(vars)) {
    const re = new RegExp(`\\{${k}\\}`, "g");
    out = out.replace(re, escapeVar(v));
  }
  return out;
}

/** Renderiza 1 línea con la plantilla ya rellena */
export function MensajeCombate({ tipo, vars, templateIndex, picker }) {
  const tpl = picker.pick(tipo, templateIndex);
  const html = fillPlaceholders(tpl, vars);
  return <div className="msg-line" dangerouslySetInnerHTML={{ __html: html }} />;
}

export function RondaHeader({ ronda }) {
  return (
    <div className="row">
      <div className="col-lg-12 round-header">— Ronda {ronda} —</div>
    </div>    
  );
}

export const MENSAJES = mensajes; // por si lo quieres consumir afuera
