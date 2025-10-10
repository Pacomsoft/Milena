// src/pages/CaballeroPage.jsx
import React, { useContext } from "react";
import SimuladorCombate from "../../components/Pelear";
import { AuthContext } from "../../context/AuthContext";

export default function Batallas() {
  const { caballero } = useContext(AuthContext);
  // suponiendo que tienes el id del rival de algún modo (placeholder):
  const enemigoId = "RIVAL_KEY"; 

  return (
    <div className="container" style={{ paddingTop: 16 }}>
      <h2>Mi Caballero</h2>
      {/* ... resto de tu UI ... */}

      <hr/>
      <h3>Simulador</h3>
      <SimuladorCombate p1Id={8} p2Id={9} />
    </div>
  );
}
