import React, { useEffect, useMemo, useRef, useState } from "react";
import { UniquePicker, MensajeCombate, RondaHeader } from "./Narrador";
//import mensajes from "../assets/mensajes_combate_dialogados.react.json";
import mensajes from "../assets/catalogo_mensajes.json";
import derrota from "../assets/images/batalla/caballero_batalla.png";
import victoria from "../assets/images/batalla/caballero_batalla.png";
import inicio from "../assets/images/batalla/caballero_batalla.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";

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
<motion.div
  className="row text-center align-items-center mb-4"
  initial={{ opacity: 0, y: -40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7, ease: "easeOut" }}
>
  {/* === PJ 1 === */}
  <motion.div
    className="col-12 col-md-4 mb-3 mb-md-0"
    initial={{ opacity: 0, x: -80, scale: 0.8 }}
    animate={{ opacity: 1, x: 0, scale: 1 }}
    transition={{ duration: 0.7, delay: 0.1 }}
  >
    <div className="card bg-dark border-0 shadow-lg p-3">
      <motion.img
        src={inicio}
        alt="PJ1"
        className="card-img-top rounded-4 mb-3"
        style={{ objectFit: "cover", height: "200px" }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      />

      <motion.h5
        className="text-warning fw-bold mb-2 pj-text pj1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {p1.ca_name}
      </motion.h5>

      {/* ... resto del bloque igual ... */}
    </div>
  </motion.div>

  {/* === VS === */}
  <motion.div
    className="col-12 col-md-4 mb-3 mb-md-0"
    initial={{ scale: 0.5, opacity: 0, rotate: 10 }}
    animate={{ scale: 1, opacity: 1, rotate: 0 }}
    transition={{
      delay: 0.5,
      type: "spring",
      stiffness: 120,
      damping: 10,
    }}
  >
    <motion.h1
      className="fw-bold text-warning"
      style={{
        fontSize: "6rem",
        textShadow: "0 0 20px #ffcc00, 0 0 40px #ffcc00",
      }}
      animate={{
        textShadow: [
          "0 0 20px #ffcc00",
          "0 0 30px #ffcc00",
          "0 0 20px #ffcc00",
        ],
      }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
    >
      VS
    </motion.h1>
  </motion.div>

  {/* === PJ 2 === */}
  <motion.div
    className="col-12 col-md-4 mb-3 mb-md-0"
    initial={{ opacity: 0, x: 80, scale: 0.8 }}
    animate={{ opacity: 1, x: 0, scale: 1 }}
    transition={{ duration: 0.7, delay: 0.2 }}
  >
    <div className="card bg-dark border-0 shadow-lg p-3">
      <motion.img
        src={inicio}
        alt="PJ2"
        className="card-img-top rounded-4 mb-3"
        style={{ objectFit: "cover", height: "200px" }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      />

      <motion.h5
        className="text-info fw-bold mb-2 pj-text pj2"
        style={{ color: "#618acb" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {p2.ca_name}
      </motion.h5>

      {/* ... resto del bloque igual ... */}
    </div>
  </motion.div>
</motion.div>



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
    const cosmoPct1 = Math.max(0, Math.min(100, (cosmoActP1 / (p1.ca_cosmo || 1)) * 100));
    const cosmoPct2 = Math.max(0, Math.min(100, (cosmoActP2 / (p2.ca_cosmo || 1)) * 100));

    const hpColor1 =
      hpPct1 > 70 ? "#198754" : hpPct1 > 30 ? "#ffc107" : "#dc3545";
    const hpColor2 =
      hpPct2 > 70 ? "#198754" : hpPct2 > 30 ? "#ffc107" : "#dc3545";

    // --- Render fijo (p1 izquierda / p2 derecha) ---
    return (
<motion.div
  key={idx}
  className="d-flex align-items-center mb-3 flex-row"
  initial={{ opacity: 0, y: -60, scale: 0.95 }}
  whileInView={{ opacity: 1, y: 0, scale: 1 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{
    duration: 0.5,
    ease: "easeOut",
  }}
>
  {/* === IZQUIERDA (p1) === */}
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
        stroke={hpColor1}
        strokeWidth="8"
        fill="none"
        strokeDasharray="339.29"
        strokeDashoffset={339.29 * (1 - hpPct1 / 100)}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>

    <motion.img
      src={inicio}
      alt="pj1"
      className="rounded-circle shadow position-relative"
      style={{
        width: "75px",
        height: "75px",
        objectFit: "cover",
        border: "2px solid rgb(8, 169, 185)",
        zIndex: 2,
      }}
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    />
  </div>

  {/* === TEXTO EVENTO === */}
  <motion.div
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
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
  >
    <MensajeCombate
      tipo={ev.type}
      vars={ev.vars || {}}
      templateIndex={ev.template_index}
      picker={picker}
    />
  </motion.div>

  {/* === DERECHA (p2) === */}
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

    <motion.img
      src={inicio}
      alt="pj2"
      className="rounded-circle shadow position-relative"
      style={{
        width: "75px",
        height: "75px",
        objectFit: "cover",
        border: "2px solid rgb(191 190 191)",
        zIndex: 2,
      }}
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    />
  </div>
</motion.div>
    );
  })}
</div>





{/* ===== RESULTADOS ===== */}
<motion.div
  className="text-light mt-5 py-4 px-3 rounded-4 shadow-lg"
  style={{
    width: "100%",
    background:
      "linear-gradient(90deg, rgba(10,10,15,0.8), rgba(20,20,40,0.8))",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 0 25px rgba(0,200,255,0.25)",
    backdropFilter: "blur(4px)",
    position: "relative",
    overflow: "hidden",
  }}
  initial={{ opacity: 0, scale: 0.9, y: 80, filter: "blur(6px)" }}
  whileInView={{
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
  }}
  viewport={{ once: true }}
  transition={{
    duration: 0.8,
    ease: "easeOut",
  }}
>
  {/* ===== CABECERA DEL RESULTADO ===== */}
  <motion.h3
    className="fw-bold mb-4 text-center"
    style={{
      color: "rgb(229 189 48)",
      textShadow:
        "rgb(41 41 41) 0px 0px 20px, rgb(0 0 0) 0px 0px 40px",
      letterSpacing: "2px",
    }}



  >
    RESULTADOS DEL COMBATE
  </motion.h3>

  {/* ===== DATOS DE CADA PARTICIPANTE ===== */}
  <div className="row align-items-start px-md-5">
    {/* IZQUIERDA (p1) */}
    <motion.div
      className="col-12 col-md-6 text-start mb-4 mb-md-0 border-end border-secondary"
      initial={{ opacity: 0, x: -100 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <h5
        className="fw-bold mb-2 text-warning pj1"
        style={{ fontSize: "2rem" }}
      >
        {p1.ca_name}
      </h5>
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
    </motion.div>

    {/* DERECHA (p2) */}
    <motion.div
      className="col-12 col-md-6 text-end"
      initial={{ opacity: 0, x: 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <h5
        className="fw-bold mb-2 text-info pj2"
        style={{ fontSize: "2rem" }}
      >
        {p2.ca_name}
      </h5>
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
    </motion.div>
  </div>

  {/* ===== GANADOR ===== */}
  <motion.div
    className="mt-5 text-center position-relative"
    initial={{ opacity: 0, scale: 0.7, y: 50 }}
    whileInView={{ opacity: 1, scale: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{
      delay: 0.6,
      duration: 0.8,
      ease: "easeOut",
      type: "spring",
      stiffness: 120,
    }}
  >
    {/* 🌌 AURA CÓSMICA DETRÁS DEL GANADOR */}
    <motion.div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: "180px",
        height: "180px",
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(0,191,255,0.45) 0%, rgba(0,191,255,0) 70%)",
        transform: "translate(-50%, -50%)",
        zIndex: 0,
        filter: "blur(20px)",
      }}
      animate={{
        scale: [0.8, 1.2, 0.8],
        opacity: [0.6, 1, 0.6],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    ></motion.div>

    {/* 🏆 TEXTO GANADOR */}
    <motion.h2
      className="fw-bold mb-1 position-relative"
      style={{
        color: "#00bfff",
        textShadow: "0 0 25px #00bfff, 0 0 50px #0088ff",
        letterSpacing: "3px",
        zIndex: 1,
      }}
      animate={{
        textShadow: [
          "0 0 20px #00bfff",
          "0 0 40px #00bfff",
          "0 0 20px #00bfff",
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
        type: "tween",
      }}
    >
      {payload?.ganador
        ? `¡${payload.ganador.toUpperCase()} SE ALZA VICTORIOSO!`
        : "EMPATE CÓSMICO"}
    </motion.h2>

    {/* MOTIVO DEL COMBATE */}
    {payload?.motivo && (
      <motion.p
        className="fst-italic mt-2"
        style={{
          fontSize: "1rem",
          letterSpacing: "1px",
          fontWeight: "bold",
          color: "#b11c00",
          textShadow: "0 0 10px rgba(177,28,0,0.5)",
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.9, duration: 0.6 }}
      >
        ({payload.motivo})
      </motion.p>
    )}
  </motion.div>
</motion.div>


        {/* ===== FINAL ===== */}
{/* ===== FINAL ===== */}
<motion.div
  className="row mt-5 g-4 justify-content-center"
  style={{
    width: "100%",
    margin: "0 auto",
  }}
  initial={{ opacity: 0, y: 100, scale: 0.95 }}
  whileInView={{ opacity: 1, y: 0, scale: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8, ease: "easeOut" }}
>

  {/* DERROTA */}
  <motion.div
    className="col-12 col-md-6"
    initial={{ opacity: 0, x: -120, rotate: -5 }}
    whileInView={{ opacity: 1, x: 0, rotate: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
  >
    <motion.div
      className="card bg-dark text-center shadow-lg p-3 h-100 position-relative overflow-hidden"
      style={{
        border: "1px solid rgba(255,0,0,0.3)",
        boxShadow: "0 0 20px rgba(255,0,0,0.25)",
        background:
          "linear-gradient(180deg, rgba(30,0,0,0.85) 0%, rgba(10,0,0,0.9) 100%)",
      }}
      whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(255,0,0,0.3)" }}
      transition={{ duration: 0.4 }}
    >
      {/* Aura roja pulsante */}
      <motion.div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,0,0,0.3) 0%, rgba(255,0,0,0) 70%)",
          transform: "translate(-50%, -50%)",
          filter: "blur(20px)",
          zIndex: 0,
        }}
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      ></motion.div>

      <motion.img
        src={derrota}
        className="card-img-top rounded-4 mb-3 position-relative"
        style={{
          height: "200px",
          objectFit: "cover",
          border: "1px solid rgba(255,255,255,0.08)",
          zIndex: 1,
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      />

      <motion.p
        className="fw-bold text-danger mb-0 position-relative"
        style={{
          fontSize: "1.1rem",
          textShadow: "#550000 0px 0px 10px",
          letterSpacing: "1px",
          zIndex: 2,
        }}
        animate={{
          textShadow: [
            "0 0 15px #ff0000",
            "0 0 35px #ff0000",
            "0 0 15px #ff0000",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          type: "tween",
        }}
      >
        Azteca ha sido derrotado...
      </motion.p>
    </motion.div>
  </motion.div>

  {/* VICTORIA */}
  <motion.div
    className="col-12 col-md-6"
    initial={{ opacity: 0, x: 120, rotate: 5 }}
    whileInView={{ opacity: 1, x: 0, rotate: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
  >
    <motion.div
      className="card bg-dark text-center shadow-lg p-3 h-100 position-relative overflow-hidden"
      style={{
        border: "1px solid rgb(255 212 0 / 30%)",
        boxShadow: "0 0 25px rgba(255,200,0,0.25)",
        background:
          "linear-gradient(rgb(95 83 1 / 80%) 0%, rgb(41 33 0 / 90%) 100%)",
      }}
      whileHover={{ scale: 1.03, boxShadow: "0 0 35px rgba(255,215,0,0.3)" }}
      transition={{ duration: 0.4 }}
    >
      {/* Aura dorada pulsante */}
      <motion.div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,215,0,0.3) 0%, rgba(255,215,0,0) 70%)",
          transform: "translate(-50%, -50%)",
          filter: "blur(20px)",
          zIndex: 0,
        }}
        animate={{
          scale: [0.8, 1.3, 0.8],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      ></motion.div>

      <motion.img
        src={victoria}
        className="card-img-top rounded-4 mb-3 position-relative"
        style={{
          height: "200px",
          objectFit: "cover",
          border: "1px solid rgba(255,255,255,0.08)",
          zIndex: 1,
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      />

      <motion.p
        className="fw-bold mb-0 position-relative"
        style={{
          fontSize: "1.1rem",
          color: "#fbbc06",
          textShadow: "0 0 10px #fbbc06",
          letterSpacing: "1px",
          zIndex: 2,
        }}
        animate={{
          textShadow: [
            "0 0 20px #ffd700",
            "0 0 40px #ffd700",
            "0 0 20px #ffd700",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          type: "tween",
        }}
      >
        ¡Mileena ha ganado la batalla!
      </motion.p>
    </motion.div>
  </motion.div>
</motion.div>


      </div>
    </div>
  );
}
