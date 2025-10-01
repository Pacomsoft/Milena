import React from "react";
import caballeroprincipal from "../assets/images/aldebaran.png"

function BackendDownPage() {
  return (
    <div className="container" style={{ paddingTop: "1%" }}>
      <div
        className="row flex-lg-row-reverse align-items-center g-5 py-5 background-mobile container-base"
        style={{
          backgroundImage: `url(${caballeroprincipal})`,
          backgroundSize: "50%"
        }}
      >
        <div className="col-lg-6" style={{ alignSelf: "flex-start" }}>
          <div className="row">
            <div className="col-md-12 stats-div justify-text">
              <h1 className="display-2 text-warning" style={{ fontFamily: "Saintfont", letterSpacing: "4px" }}>NO PUEDES PASAR CABALLERO!</h1>
              <p className="lead">
                ¡El servidor se encuentra en mantenimiento!, toda la fuerza del cosmos se encuentra trabajando para volver lo mas pronto posible, te pido pasiencia, pronto volverás a la batalla. Por lo pronto, sigue planteando tu estrategia para <strong>¡Convertirte en el caballero mas fuerte!</strong>
              </p>
              <p className="lead justify-text">
                
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BackendDownPage;
