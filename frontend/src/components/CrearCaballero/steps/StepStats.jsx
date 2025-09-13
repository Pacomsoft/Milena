import React from "react";
import FinishIcon from "../../icons/Finish"
import BackIcon from "../../icons/Back";

export default function StepOtrosDatos({ otrosDatos, setOtrosDatos, onPrev }) {
  return (
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
        <button type="button" className="btn btn-secondary float-start" onClick={onPrev}>
          <BackIcon/>
        </button>
        <button type="submit" className={`btn btn-warning float-end btn-animated"}`}>
          <FinishIcon/>
        </button>
      </div>
    </div>
  );
}
