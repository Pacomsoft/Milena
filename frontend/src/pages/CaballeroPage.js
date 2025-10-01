// src/pages/CaballeroPage.jsx
import React, { useContext, useEffect, useState } from "react";
import micaballero from '../assets/images/micaballero.png';
import { AuthContext } from "../context/AuthContext";

const CaballeroPage = () => {
  const {caballero } = useContext(AuthContext);
  // Ejemplo: cargar stats desde el backend

  if (!caballero) return <div>Cargando...</div>;

  return (
    <div
      className="row flex-lg-row-reverse align-items-center g-5 py-5 background-mobile container-base"
      style={{
        backgroundImage: `url(${micaballero})`,
        backgroundSize: "60%",
      }}
    >
      <div className="col-lg-6" style={{ alignSelf: "flex-start" }}>
        <h3 className="text-gold">Datos Generales</h3>
        <div className="stats-div">
          {[
            ["Nombre", caballero.nombre],
            ["Signo", caballero.id_zona],
            ["Nivel", caballero.nivel],
            ["Estado", caballero.estado],
            ["Vida", `${caballero.salud_actual}/${caballero.salud}`],
            ["Experiencia", `${caballero.experiencia}/${caballero.experiencia}`],
            ["Oro", caballero.oro],
            ["Habilidad", caballero.habilidad],
            ["Victorias", caballero.victorias],
            ["Derrotas", caballero.derrotas],
          ].map(([label, value], i) => (
            <div className="row" key={i}>
              <div className="col-6">
                <label className="stats-text">{label}:</label>
              </div>
              <div className="col-6 col-text-right">
                <span className="stats-text-value">{value}</span>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-gold">Estadísticas</h3>
        <div className="stats-div">
          {[
            ["Fuerza", caballero.poder],
            ["Resistencia", caballero.resistencia],
            ["Resistencia Psíquica", caballero.resistencia_mental],
            ["Velocidad", caballero.velocidad],
            ["Precisión", caballero.precision],
            ["Reflejos", caballero.agilidad],
            ["Sabiduría", caballero.conocimiento],
            ["Persistencia", caballero.persistencia],
            ["Cosmo", caballero.cosmo],
            ["Séptimo sentido", caballero.septimo_sentido],
            ["Honor", caballero.honor],
          ].map(([label, value], i) => (
            <div className="row" key={i}>
              <div className="col-6">
                <label className="stats-text">{label}:</label>
              </div>
              <div className="col-6 col-text-right">
                <span className="stats-text-value">{value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CaballeroPage;
