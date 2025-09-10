// src/pages/CaballeroPage.jsx
import React, { useEffect, useState } from "react";
import micaballero from '../assets/images/micaballero.png';

const CaballeroPage = () => {
  const [stats, setStats] = useState(null);

  // Ejemplo: cargar stats desde el backend
  useEffect(() => {
    fetch("/api/caballero") // tu endpoint que devuelve los stats
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));
  }, []);

  if (!stats) return <div>Cargando...</div>;

  return (
    <div
      className="row flex-lg-row-reverse align-items-center g-5 py-5 background-mobile container-base"
      style={{
        backgroundImage: `url(${micaballero})`,
        backgroundSize: "60%",
      }}
    >
      <div className="col-lg-6" style={{ alignSelf: "flex-start" }}>
        <h3>Datos Generales</h3>
        <div className="stats-div">
          {[
            ["Nombre", stats.alias],
            ["Signo", stats.sig],
            ["Nivel", stats.lvl],
            ["Estado", stats.status],
            ["Vida", `${stats.activelife}/${stats.lif}`],
            ["Experiencia", `${stats.exp}/${stats.exp_max}`],
            ["Oro", stats.oro],
            ["Habilidad", stats.hab],
            ["Victorias", 0],
            ["Derrotas", 0],
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

        <h3>Estadísticas</h3>
        <div className="stats-div">
          {[
            ["Fuerza", stats.str],
            ["Resistencia", stats.res],
            ["Resistencia Psíquica", stats.resp],
            ["Velocidad", stats.vel],
            ["Precisión", stats.pre],
            ["Reflejos", stats.ref],
            ["Sabiduría", stats.sab],
            ["Persistencia", stats.per],
            ["Cosmo", stats.cos],
            ["Séptimo sentido", stats.sep],
            ["Honor", stats.hon],
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
