import React, {useEffect, useState, useRef} from "react";
import { getDivinidades } from "../services/divinidad";
import { getSignos } from "../services/zodiaco";
import { notify } from "../components/Notification";
import { CSSTransition, SwitchTransition } from "react-transition-group";

export default function ImageSelectorForm() {
  const [divinidades, setDivinidades] = useState([]);
  const [zodiaco, setSignos] = useState([]);

  const [selectedDiv, setSelectedDiv] = useState(null);
  const [selectedDivZo, setSelectedDivZo] = useState(null);
  const [otrosDatos, setOtrosDatos] = useState({ nombre: "", edad: "" });

  const descriptionRef = useRef(null);
  const descriptionRefZo = useRef(null);

  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);

  useEffect(() => {
    async function fetchCrear() {
      try {
        const data = await getDivinidades();
        const signos = await getSignos();
        setDivinidades(data);
        setSignos(signos);
      } catch (error) {
        notify("error", "Error al obtener divinidades y signos: " + error);
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

  const avanzar = () => setStep((prev) => prev + 1);
  const retroceder = () => setStep((prev) => prev - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDiv) {
      return notify("error", "Por favor selecciona una Deidad");
    }
    if (!selectedDivZo) {
      return notify("error", "Por favor selecciona un Signo");
    }

    // Enviar todo junto
    const payload = {
      deidad: selectedDiv,
      signo: selectedDivZo,
      otros: otrosDatos,
    };
    console.log("Datos enviados:", payload);
    notify("success", "Datos enviados correctamente");

    // Aquí podrías hacer el POST real:
    // fetch("/api/guardar", { method: "POST", body: JSON.stringify(payload) })
  };

  if (loading) return <p className="text-center">Cargando...</p>;

  return (
    <form onSubmit={handleSubmit} className="container py-4" style={{ background: "#17162b96" }}>
      {/* Paso 1: Deidad */}
      {step === 1 && (
        <div className="p-4">
          <h3 className="text-center text-gold" style={{ fontSize: "5vh" }}>
            Selecciona una Deidad
          </h3>
          <p>
            La deidad que elijas marcará tu destino como caballero. Al jurar lealtad a un Dios,
            obtendrás un bonus único en tus habilidades, el derecho de portar con orgullo el Título
            de algún Caballero de esa deidad en el Ranking, y acceso a técnicas especiales vinculadas
            a su poder divino.{" "}
            <strong style={{ color: "#f4d322", fontWeight: "bold" }}>
              Tu elección no es definitiva:
            </strong>{" "}
            podrás cambiar de deidad más adelante.
          </p>
          <div className="row g-4">
            {divinidades.map((img) => (
              <div className="col-md-3" key={img.di_key}>
                <div
                  className={`card selectable card-deidad ${
                    selectedDiv?.di_key === img.di_key ? "selected" : ""
                  }`}
                  onClick={() => setSelectedDiv(img)}
                  style={{ cursor: "pointer" }}
                >
                  <input
                    type="radio"
                    name="deidad"
                    value={img.di_key}
                    checked={selectedDiv?.di_key === img.di_key}
                    readOnly
                    className="d-none"
                  />
                  <img
                    src={`images/deidades/${img.di_icon}`}
                    alt={img.di_name}
                    className="card-img-top"
                  />
                  <div className="card-body text-center card-deidad-body">
                    <p className="card-text">{img.di_name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {selectedDiv && (
            <SwitchTransition>
              <CSSTransition key={selectedDiv?.di_key} timeout={500} classNames="fade">
                <div
                  ref={descriptionRef}
                  className="mt-4 text-center epic-description p-3 rounded shadow-lg mx-auto"
                  style={{ color: "#ffc107", background: "#10121aa1", borderRadius: "30px" }}
                >
                  {selectedDiv.di_description}
                </div>
              </CSSTransition>
            </SwitchTransition>
          )}
          <div className="text-center mt-4">
            <button type="button" style={{float:"right"}} className="btn btn-warning" onClick={avanzar} disabled={!selectedDiv}>
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Paso 2: Signo */}
      {step === 2 && (
        <div className="p-4">
          <h3 className="text-center text-gold" style={{ fontSize: "5vh" }}>
            Selecciona un signo Zodiacal
          </h3>
          <div className="row g-6">
            {zodiaco.map((img) => (
              <div className="col-md-2" key={img.zo_key}>
                <div
                  className={`card selectable card-signo ${
                    selectedDivZo?.zo_key === img.zo_key ? "selected" : ""
                  }`}
                  onClick={() => setSelectedDivZo(img)}
                  style={{ cursor: "pointer" }}
                >
                  <input
                    type="radio"
                    name="signo"
                    value={img.zo_key}
                    checked={selectedDivZo?.zo_key === img.zo_key}
                    readOnly
                    className="d-none"
                  />
                  <img
                    src={`images/signos/${img.zo_image}`}
                    alt={img.zo_name}
                    className="card-img-top"
                  />
                  <div className="card-body text-center card-deidad-body">
                    <p className="card-text">{img.zo_name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {selectedDivZo && (
            <SwitchTransition>
              <CSSTransition key={selectedDivZo?.zo_key} timeout={500} classNames="fade">
                <div
                  ref={descriptionRefZo}
                  className="mt-4 text-center epic-description p-3 rounded shadow-lg mx-auto"
                  style={{ color: "#ffc107", background: "#10121aa1", borderRadius: "30px" }}
                >
                  {selectedDivZo.zo_description}
                </div>
              </CSSTransition>
            </SwitchTransition>
          )}
          <div className="text-center mt-4">
            <button type="button" className="btn btn-secondary me-2" onClick={retroceder} style={{float:"left"}}>
              Atrás
            </button>
            <button type="button" className="btn btn-warning" onClick={avanzar} style={{float:"right"}} disabled={!selectedDivZo}>
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Paso 3: Otros datos */}
      {step === 3 && (
        <div className="p-4">
          <h3 className="text-center text-gold">Datos adicionales</h3>
          <div className="mb-3">
            <label className="form-label">Nombre del Caballero</label>
            <input
              type="text"
              className="form-control"
              value={otrosDatos.nombre}
              onChange={(e) => setOtrosDatos({ ...otrosDatos, nombre: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Edad</label>
            <input
              type="number"
              className="form-control"
              value={otrosDatos.edad}
              onChange={(e) => setOtrosDatos({ ...otrosDatos, edad: e.target.value })}
            />
          </div>
          <div className="text-center mt-4">
            <button type="button" className="btn btn-secondary me-2" style={{float:"left"}} onClick={retroceder}>
              Atrás
            </button>
            <button type="submit" className="btn btn-warning" style={{float:"right"}}>
              Finalizar
            </button>
          </div>
        </div>
      )}

      {/* Inputs ocultos */}
      <input type="hidden" name="deidad" value={selectedDiv?.di_key || ""} />
      <input type="hidden" name="signo" value={selectedDivZo?.zo_key || ""} />
      <input type="hidden" name="nombre" value={otrosDatos.nombre} />
      <input type="hidden" name="edad" value={otrosDatos.edad} />
    </form>
  );
}
