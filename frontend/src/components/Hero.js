import React from "react";
import caballeroprincipal from '../assets/images/index-shun.png';
function Hero() {
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
              <h1 className="display-2 text-warning" style={{ fontFamily: "Saintfont", letterSpacing: "4px" }}>BIENVENIDO!!</h1>
              <p className="lead">
                Prepárate para embarcarte en una épica aventura donde tus habilidades serán puestas a prueba...
              </p>
              <p className="lead justify-text">
                Este sitio web es un juego RPG inspirado en Saint Seiya... Aqui podrás crear tu propio personaje, elegir tu camino como Caballero y enfrentarte a desafíos emocionantes en compañía de otros jugadores. ¡Únete a nosotros y vive la experiencia de ser un verdadero Caballero del Zodiaco!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
