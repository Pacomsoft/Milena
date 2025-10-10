import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CombateViewer from "../components/CombatViewer";
import { getBatalla } from "../services/combate";
import backgroundBatalla from "../assets/images/background.jpg";
import backgroundColiseo from "../assets/images/background_coliseo2.jpg";
import bgColiseo from "../assets/images/background_coliseo2.jpg";
import bgMision from "../assets/images/background.jpg";
import bgDivino from "../assets/images/background.jpg";
import bgDefault from "../assets/images/background.jpg";


const fondos = {
  duelo: bgColiseo,
  mision: bgMision,
  divino: bgDivino,
  default: bgDefault,
};


export default function BatallaPublic() {
  const [searchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [data, setData] = useState([]);
  const [finalStats, setFinal] = useState(null);
  const [loading, setLoading] = useState(false);
  const tipo = "default"
  const id = searchParams.get("id");

useEffect(() => {
  const prevBg = document.body.style.backgroundImage;
  const prevSize = document.body.style.backgroundSize;
  const prevAttach = document.body.style.backgroundAttachment;
  const prevPosition = document.body.style.backgroundPosition;

  async function fetchBatalla() {
    try {
      if (!id) return; // evita fetch si no hay id
      setLoading(true);
      setEvents([]);

      const data = await getBatalla(id);
      setData(data || {});
      setEvents(data.events || []);
      setFinal(data.final_stats || null);
      console.log("Datos de la batalla:", data);
      // aplica el nuevo fondo DESPUÉS de tener los datos
      const tipo = data?.battle_type || "default";
      console.log("Tipo de batalla:", data.battle_type);
      document.body.style.transition = "background-image 1s ease-in-out";
      document.body.style.backgroundImage = `url(${fondos[tipo] || fondos.default})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundAttachment = "fixed";
      document.body.style.backgroundPosition = "center center";
    } catch (error) {
      console.error("Error fetching batalla:", error);
    } finally {
      setLoading(false);
    }
  }

  fetchBatalla();

  // limpieza al desmontar
  return () => {
    document.body.style.backgroundImage = prevBg;
    document.body.style.backgroundSize = prevSize;
    document.body.style.backgroundAttachment = prevAttach;
    document.body.style.backgroundPosition = prevPosition;
  };
}, [id]);

  return (
    <div style={{ padding: 16, backgroundColor: "transparent", minHeight: "100vh" }} className="pantalla-especial">
      {loading && <p>Cargando batalla...</p>}

      {!loading && <CombateViewer events={events} payload={data} />}

    </div>
  );
}
