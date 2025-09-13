import React, { useEffect, useState, useRef } from "react";
import { getDivinidades } from "../../services/divinidad";
import { getSignos } from "../../services/zodiaco";
import { notify } from "../../components/Notification";
import useStepper from "../../hooks/useStepper";

import StepDeidad from "./steps/StepDeidad";
import StepSigno from "./steps/StepSigno";
import StepOtrosDatos from "./steps/StepStats";

export default function ImageSelectorForm() {
  const [divinidades, setDivinidades] = useState([]);
  const [signos, setSignos] = useState([]);

  const [selectedDiv, setSelectedDiv] = useState(null);
  const [selectedDivZo, setSelectedDivZo] = useState(null);
  const [otrosDatos, setOtrosDatos] = useState({ nombre: "", edad: "" });

  const descriptionRef = useRef(null);
  const descriptionRefZo = useRef(null);

  const [loading, setLoading] = useState(true);
  const { step, next, prev } = useStepper(1);

  useEffect(() => {
    async function fetchCrear() {
      try {
        const [divs, sigs] = await Promise.all([getDivinidades(), getSignos()]);
        setDivinidades(divs);
        setSignos(sigs);
      } catch (error) {
        notify("error", "Error al obtener divinidades y signos: " + error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCrear();
  }, []);

    useEffect(() => {
      if (selectedDiv && descriptionRef.current) {
        descriptionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, [selectedDiv]);
  
    useEffect(() => {
      if (selectedDivZo && descriptionRefZo.current) {
        descriptionRefZo.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, [selectedDivZo]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDiv) return notify("error", "Por favor selecciona una Deidad");
    if (!selectedDivZo) return notify("error", "Por favor selecciona un Signo");
    if (!otrosDatos.nombre) return notify("error", "Ingresa un nombre");
    if (!otrosDatos.edad || otrosDatos.edad <= 0) return notify("error", "Edad inválida");

    const payload = {
      deidad: selectedDiv,
      signo: selectedDivZo,
      otros: otrosDatos,
    };

    console.log("Datos enviados:", payload);
    notify("success", "Datos enviados correctamente");

    // fetch("/api/guardar", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // })
  };

  if (loading) return <p className="text-center">Cargando...</p>;

  return (
    <form onSubmit={handleSubmit} className="container py-4" style={{ background: "#17162b96" }}>
      {step === 1 && (
        <StepDeidad
          divinidades={divinidades}
          selectedDiv={selectedDiv}
          setSelectedDiv={setSelectedDiv}
          descriptionRef={descriptionRef}
          onNext={next}
        />
      )}

      {step === 2 && (
        <StepSigno
          signos={signos}
          selectedDivZo={selectedDivZo}
          setSelectedDivZo={setSelectedDivZo}
          descriptionRefZo={descriptionRefZo}
          onNext={next}
          onPrev={prev}
        />
      )}

      {step === 3 && (
        <StepOtrosDatos otrosDatos={otrosDatos} setOtrosDatos={setOtrosDatos} onPrev={prev} />
      )}

      {/* Inputs ocultos para el POST tradicional */}
      <input type="hidden" name="deidad" value={selectedDiv?.di_key || ""} />
      <input type="hidden" name="signo" value={selectedDivZo?.zo_key || ""} />
      <input type="hidden" name="nombre" value={otrosDatos.nombre} />
      <input type="hidden" name="edad" value={otrosDatos.edad} />
    </form>
  );
}
