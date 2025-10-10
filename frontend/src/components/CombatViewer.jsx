import React, { useEffect, useMemo, useRef, useState } from "react";
import { UniquePicker, MensajeCombate, RondaHeader } from "./Narrador";
//import mensajes from "../assets/mensajes_combate_dialogados.react.json";
import mensajes from "../assets/catalogo_mensajes.json";
import derrota from "../assets/images/batalla/caballero_batalla.png";
import victoria from "../assets/images/batalla/caballero_batalla.png";
import inicio from "../assets/images/batalla/caballero_batalla.png";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CombateViewer({ events = [], payload = {} }) {
  const picker = useMemo(() => new UniquePicker(mensajes), []);
  const logRef = useRef(null);
  const [rendered, setRendered] = useState([]);

  const p1 = payload?.participants?.p1 || {};
  const p2 = payload?.participants?.p2 || {};
  const maxHP1 = p1.ca_health || 100;
  const maxHP2 = p2.ca_health || 100;

  const [hp1, setHp1] = useState(maxHP1);
  const [hp2, setHp2] = useState(maxHP2);
  const [cosmo1, setCosmo1] = useState((p1.ca_cosmo || 1) * 25);
  const [cosmo2, setCosmo2] = useState((p2.ca_cosmo || 1) * 25);

  // Revelado progresivo + actualización de stats
  useEffect(() => {
    if (!events.length) return;
    let i = 0;
    setRendered([]);
    setHp1(maxHP1);
    setHp2(maxHP2);

    const delay = 400;
    const t = setInterval(() => {
      const ev = events[i];
      if (!ev) return;

      if (ev.type === "ataque_hit") {
        const { dmg, atacante, defensor } = ev.vars;
        if (defensor === p1.ca_name) {
          setHp1((prev) => Math.max(0, prev - dmg / 100));
          setCosmo1((c) => Math.max(0, c - 3));
        } else {
          setHp2((prev) => Math.max(0, prev - dmg / 100));
          setCosmo2((c) => Math.max(0, c - 3));
        }
      } else if (ev.type === "persistencia" || ev.type === "esquiva") {
        setCosmo1((c) => Math.min(100, c + 2));
        setCosmo2((c) => Math.min(100, c + 2));
      }

      setRendered((prev) => [...prev, ev]);
      i++;
      if (i >= events.length) clearInterval(t);
    }, delay);

    return () => clearInterval(t);
  }, [events]);

  // autoscroll
  useEffect(() => {
    if (logRef.current)
      logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [rendered]);

  // helper colores
  const getColor = (pct) => {
    if (pct > 70) return "bg-success";
    if (pct > 30) return "bg-warning";
    return "bg-danger";
  };

  const hpPct1 = Math.round((hp1 / maxHP1) * 100);
  const hpPct2 = Math.round((hp2 / maxHP2) * 100);

  return (
    <div className="d-flex justify-content-center py-4 text-light">
      <div
        ref={logRef}
        className="container rounded-4 p-4 shadow-lg"
        style={{
          maxWidth: "960px",
          background: "rgba(10,10,15,0.6)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(5px)",
        }}
      >
        {/* ===== CABECERA ===== */}
        <div className="row text-center align-items-center mb-4">
          {/* === PJ 1 === */}
          <div className="col-12 col-md-4 mb-3 mb-md-0">
            <div className="card bg-dark border-0 shadow-lg p-3">
              <img
                src={inicio}
                alt="PJ1"
                className="card-img-top rounded-4 mb-3"
                style={{ objectFit: "cover", height: "200px" }}
              />

              <h5 className="text-warning fw-bold mb-2 pj-text pj1">{p1.ca_name}</h5>

              {/* Etiquetas de 0 / X */}
              <div className="text-center small text-light mb-1">
                HP{" "}
                <span className="text-warning fw-bold">{Math.round(p1.ca_health_act)}</span> /{" "}
                {p1.ca_health} | Cosmo{" "}
                <span className="text-info fw-bold">{Math.round(p1.ca_cosmo_act)}</span> /{" "}
                {p1.ca_cosmo}
              </div>

              {/* Barra de vida con color por porcentaje */}
              {(() => {
                const hpPct = (p1.ca_health_act / p1.ca_health) * 100;
                let hpClass = "bg-success";
                if (hpPct <= 70 && hpPct > 30) hpClass = "bg-warning";
                if (hpPct <= 30) hpClass = "bg-danger";
                return (
                  <div className="progress bg-secondary mb-1" style={{ height: "10px" }}>
                    <div
                      className={`progress-bar ${hpClass}`}
                      style={{ width: `${hpPct}%` }}
                    ></div>
                  </div>
                );
              })()}

              {/* Barra de cosmo: azul → gris según carga */}
              {(() => {
                const cosmoPct = (p1.ca_cosmo_act * 100) / p1.ca_cosmo;
                // usamos un gradiente que pasa de azul brillante a gris
                const colorCosmo =
                  cosmoPct > 60
                    ? "#0dcaf0"
                    : cosmoPct > 30
                    ? "#69b4d6"
                    : "#6c757d";
                return (
                  <div className="progress bg-secondary" style={{ height: "8px" }}>
                    <div
                      className="progress-bar"
                      style={{
                        width: `${cosmoPct}%`,
                        backgroundColor: colorCosmo,
                        transition: "background-color 0.5s",
                      }}
                    ></div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* === VS === */}
          <div className="col-12 col-md-4 mb-3 mb-md-0">
            <h1
              className="fw-bold text-warning"
              style={{ fontSize: "6rem", textShadow: "0 0 20px #ffcc00" }}
            >
              VS
            </h1>
          </div>

          {/* === PJ 2 === */}
          <div className="col-12 col-md-4 mb-3 mb-md-0">
            <div className="card bg-dark border-0 shadow-lg p-3">
              <img
                src={inicio}
                alt="PJ2"
                className="card-img-top rounded-4 mb-3"
                style={{ objectFit: "cover", height: "200px" }}
              />

              <h5 className="text-info fw-bold mb-2 pj-text pj2" style={{color:'#618acb'}}>{p2.ca_name}</h5>

              <div className="text-center small text-light mb-1">
                HP{" "}
                <span className="text-warning fw-bold">{Math.round(p2.ca_health_act)}</span> /{" "}
                {p2.ca_health} | Cosmo{" "}
                <span className="text-info fw-bold">{Math.round(p2.ca_cosmo_act)}</span> /{" "}
                {p2.ca_cosmo}
              </div>

              {(() => {
                const hpPct = (p2.ca_health_act / p2.ca_health) * 100;
                let hpClass = "bg-success";
                if (hpPct <= 70 && hpPct > 30) hpClass = "bg-warning";
                if (hpPct <= 30) hpClass = "bg-danger";
                return (
                  <div className="progress bg-secondary mb-1" style={{ height: "10px" }}>
                    <div
                      className={`progress-bar ${hpClass}`}
                      style={{ width: `${hpPct}%` }}
                    ></div>
                  </div>
                );
              })()}

              {(() => {
                const cosmoPct = (p2.ca_cosmo_act * 100) / p2.ca_cosmo;
                const colorCosmo =
                  cosmoPct > 60
                    ? "#0d6efd"
                    : cosmoPct > 30
                    ? "#69b4d6"
                    : "#6c757d";
                return (
                  <div className="progress bg-secondary" style={{ height: "8px" }}>
                    <div
                      className="progress-bar"
                      style={{
                        width: `${cosmoPct}%`,
                        backgroundColor: colorCosmo,
                        transition: "background-color 0.5s",
                      }}
                    ></div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>



{/* ===== EVENTOS ===== */}
<div className="timeline">
  {rendered.map((ev, idx) => {
    // Mostrar encabezado de ronda
    if (ev.type === "round_start") {
      return (
        <div key={idx} className="text-center my-4">
          <div
            className="d-inline-block px-4 py-2 rounded-3"
            style={{
              background: "linear-gradient(90deg,#ffd90040,#00c8ff40)",
              border: "1px solid rgba(255,255,255,0.2)",
              width: "100%",
            }}
          >
            <RondaHeader ronda={ev.ronda} />
          </div>
        </div>
      );
    }

    const dmg = ev.vars?.dmg || 0;
    const crit = dmg >= 8000;

    // --- HP y Cosmo de backend ---
    const hpActP1 =
      ev.vars?.hp_act_p1 ??
      (ev.vars?.defensor === p1.ca_name ? ev.vars?.hp_act_defensor : ev.vars?.hp_act_atacante) ??
      p1.ca_health_act ??
      p1.ca_health;

    const hpActP2 =
      ev.vars?.hp_act_p2 ??
      (ev.vars?.defensor === p2.ca_name ? ev.vars?.hp_act_defensor : ev.vars?.hp_act_atacante) ??
      p2.ca_health_act ??
      p2.ca_health;

    const cosmoActP1 =
      ev.vars?.cosmo_act_p1 ??
      (ev.vars?.defensor === p1.ca_name ? ev.vars?.cosmo_act_defensor : ev.vars?.cosmo_act_atacante) ??
      p1.ca_cosmo_act ??
      p1.ca_cosmo ??
      0;

    const cosmoActP2 =
      ev.vars?.cosmo_act_p2 ??
      (ev.vars?.defensor === p2.ca_name ? ev.vars?.cosmo_act_defensor : ev.vars?.cosmo_act_atacante) ??
      p2.ca_cosmo_act ??
      p2.ca_cosmo ??
      0;

    // Totales y porcentajes
    const hpPct1 = Math.max(0, Math.min(100, (hpActP1 / (p1.ca_health || 1)) * 100));
    const hpPct2 = Math.max(0, Math.min(100, (hpActP2 / (p2.ca_health || 1)) * 100));
    const cosmoPct1 = Math.max(0, Math.min(100, cosmoActP1));
    const cosmoPct2 = Math.max(0, Math.min(100, cosmoActP2));

    const hpColor1 =
      hpPct1 > 70 ? "#198754" : hpPct1 > 30 ? "#ffc107" : "#dc3545";
    const hpColor2 =
      hpPct2 > 70 ? "#198754" : hpPct2 > 30 ? "#ffc107" : "#dc3545";

    // --- Render fijo (p1 izquierda / p2 derecha) ---
    return (
      <div
        key={idx}
        className="d-flex align-items-center mb-3 flex-row" // <- fija siempre el orden
      >
        {/* IZQUIERDA (p1) */}
        <div className="position-relative d-inline-block">
          {/* HP circular */}
          <svg
            className="position-absolute top-50 start-50 translate-middle"
            width="90"
            height="90"
            viewBox="0 0 120 120"
            style={{ transform: "rotate(-90deg)" }}
          >
            <circle cx="60" cy="60" r="54" stroke="#333" strokeWidth="8" fill="none" />
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke={hpColor1}
              strokeWidth="8"
              fill="none"
              strokeDasharray="339.29"
              strokeDashoffset={339.29 * (1 - hpPct1 / 100)}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.6s ease" }}
            />
          </svg>

          {/* Imagen */}
          <img
            src={inicio}
            alt="pj1"
            className="rounded-circle shadow position-relative"
            style={{
              width: "60px",
              height: "60px",
              objectFit: "cover",
              border: "2px solid rgb(8, 169, 185)",
              zIndex: 2,
            }}
          />
        </div>

        {/* === TEXTO EVENTO === */}
        <div
          className="flex-fill mx-3 p-3 rounded-4"
          style={{
            background: "rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.05)",
            boxShadow:
              ev.vars?.atacante === p1.ca_name
                ? "0 0 15px #ffcc0055"
                : ev.vars?.atacante === p2.ca_name
                ? "0 0 15px #00bfff55"
                : "0 0 10px #ffffff22",
            textAlign: "center",
          }}
        >
          <MensajeCombate
            tipo={ev.type}
            vars={ev.vars || {}}
            templateIndex={ev.template_index}
            picker={picker}
          />
        </div>

        {/* DERECHA (p2) */}
        <div className="position-relative d-inline-block">
          <svg
            className="position-absolute top-50 start-50 translate-middle"
            width="90"
            height="90"
            viewBox="0 0 120 120"
            style={{ transform: "rotate(-90deg)" }}
          >
            <circle cx="60" cy="60" r="54" stroke="#333" strokeWidth="8" fill="none" />
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke={hpColor2}
              strokeWidth="8"
              fill="none"
              strokeDasharray="339.29"
              strokeDashoffset={339.29 * (1 - hpPct2 / 100)}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.6s ease" }}
            />
          </svg>
          <img
            src={inicio}
            alt="pj2"
            className="rounded-circle shadow position-relative"
            style={{
              width: "60px",
              height: "60px",
              objectFit: "cover",
              border: "2px solid rgb(191 190 191)",
              zIndex: 2,
            }}
          />
        </div>
      </div>
    );
  })}
</div>





{/* ===== RESULTADOS ===== */}
<div
  className="text-light mt-5 py-4 px-3 rounded-4 shadow-lg"
  style={{
    width: "100%",
    background: "linear-gradient(90deg, rgba(10,10,15,0.8), rgba(20,20,40,0.8))",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 0 25px rgba(0,200,255,0.25)",
    backdropFilter: "blur(4px)",
  }}
>
  {/* ===== CABECERA DEL RESULTADO ===== */}
  <h3
    className="fw-bold mb-4 text-center"
    style={{
      color: "rgb(229 189 48)",
    textShadow: "rgb(41 41 41) 0px 0px 20px, rgb(0 0 0) 0px 0px 40px",
    letterSpacing: "2px"
    }}
  >
    RESULTADOS DEL COMBATE
  </h3>

  {/* ===== DATOS DE CADA PARTICIPANTE ===== */}
  <div className="row align-items-start px-md-5">
    {/* IZQUIERDA (p1) */}
    <div className="col-12 col-md-6 text-start mb-4 mb-md-0 border-end border-secondary">
      <h5 className="fw-bold mb-2 text-warning pj1">{p1.ca_name}</h5>
      <p className="mb-1">
        Daño infligido:{" "}
        <span className="text-danger fw-bold">
          {payload?.final_stats?.p1?.daño_total ?? 0}
        </span>
      </p>
      <p className="mb-1">
        Vida restante:{" "}
        <span className="text-info fw-bold">
          {payload?.final_stats?.p1?.salud_final ?? 0}
        </span>
      </p>
    </div>

    {/* DERECHA (p2) */}
    <div className="col-12 col-md-6 text-end">
      <h5 className="fw-bold mb-2 text-info pj2">{p2.ca_name}</h5>
      <p className="mb-1">
        Daño infligido:{" "}
        <span className="text-danger fw-bold">
          {payload?.final_stats?.p2?.daño_total ?? 0}
        </span>
      </p>
      <p className="mb-1">
        Vida restante:{" "}
        <span className="text-info fw-bold">
          {payload?.final_stats?.p2?.salud_final ?? 0}
        </span>
      </p>
    </div>
  </div>

  {/* ===== GANADOR ===== */}
  <div className="mt-5 text-center">
    <h2
      className="fw-bold mb-1"
      style={{
        color: "#00bfff",
        textShadow: "0 0 25px #00bfff, 0 0 50px #0088ff",
        letterSpacing: "3px",
      }}
    >
      {payload?.ganador
        ? `¡${payload.ganador.toUpperCase()} SE ALZA VICTORIOSO!`
        : "EMPATE CÓSMICO"}
    </h2>
    {payload?.motivo && (
      <p
        className="fst-italic text-muted mt-1"
        style={{ fontSize: "0.95rem", letterSpacing: "1px", fontWeight:"bold", color:"#b11c00" }}
      >
        ({payload.motivo})
      </p>
    )}
  </div>
</div>


        {/* ===== FINAL ===== */}
{/* ===== FINAL ===== */}
<div
  className="row mt-5 g-4 justify-content-center"
  style={{
    width: "100%",
    margin: "0 auto",
  }}
>
  {/* DERROTA */}
  <div className="col-12 col-md-6">
    <div
      className="card bg-dark text-center shadow-lg p-3 h-100"
      style={{
        border: "1px solid rgba(255,0,0,0.3)",
        boxShadow: "0 0 20px rgba(255,0,0,0.15)",
        background:
          "linear-gradient(180deg, rgba(30,0,0,0.8) 0%, rgba(10,0,0,0.9) 100%)",
      }}
    >
      <img
        src={derrota}
        className="card-img-top rounded-4 mb-3"
        style={{
          height: "200px",
          objectFit: "cover",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
        alt="Derrota"
      />
      <p
        className="fw-bold text-danger mb-0"
        style={{
          fontSize: "1.1rem",
          textShadow: "#373737 0px 0px 10px",
          letterSpacing: "1px",
          color:"red!important"
        }}
      >
        Azteca ha sido derrotado...
      </p>
    </div>
  </div>

  {/* VICTORIA */}
  <div className="col-12 col-md-6">
    <div
      className="card bg-dark text-center shadow-lg p-3 h-100"
      style={{
        border: "1px solid rgb(255 212 0 / 30%)",
        boxShadow: "0 0 20px rgba(0,200,255,0.15)",
        background:
          "linear-gradient(rgb(95 83 1 / 80%) 0%, rgb(41 33 0 / 90%) 100%)",
      }}
    >
      <img
        src={victoria}
        className="card-img-top rounded-4 mb-3"
        style={{
          height: "200px",
          objectFit: "cover",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
        alt="Victoria"
      />
      <p
        className="fw-bold text-success mb-0"
        style={{
          fontSize: "1.1rem",
          textShadow: "#7987a1 0px 0px 10px",
          color:"#fbbc06 !important",
          letterSpacing: "1px",
        }}
      >
        ¡Mileena ha ganado la batalla!
      </p>
    </div>
  </div>
</div>

      </div>
    </div>
  );
}
