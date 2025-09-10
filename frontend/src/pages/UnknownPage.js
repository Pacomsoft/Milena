import React, { useEffect, useState } from "react";
import lost from "../assets/images/lost.jpg";
import denegado from "../assets/images/denegado.png";

function UnknownPage() {
  const [contador, setContador] = useState(3);

  useEffect(() => {
    if (contador <= 0) {
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
      return;
    }
    const intervalo = setInterval(() => {
      setContador(prev => prev - 1);
    }, 1000);
    return () => clearInterval(intervalo);
  }, [contador]);

  return (
    <>
      <div
        className="row flex-lg-row-reverse align-items-center g-5 py-5 background-mobile container-base"
        style={{
          backgroundImage: `url(${lost})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "none",
        }}
      >
        <center>
          <h1 className="text-gold" style={{textTransform: "uppercase", textShadow: "3px 3px 3px #000000", fontSize:"5vh"}}>
            No deberías estar aquí, ¡Ahora márchate y sigue entrenando Caballero!
          </h1>
        </center>
      </div>
      <div className="container" style={{paddingTop: "1%"}}>
        <div className="row flex-lg-row-reverse align-items-center g-5 py-5 background-mobile container-base" style={{ backgroundImage: `url(${denegado})`, backgroundSize: "75%" }}>
          <div className="col-lg-6" style={{alignSelf: "flex-start", height: "100%"}}>
            <div className="row">
              <div className="col-md-12 stats-div" style={{backgroundColor: "#00000069", borderRadius: "10px"}}>
                <h1 className="display-2 text-warning" style={{fontFamily: "Saintfont", letterSpacing: "2px", textAlign: "justify"}}>
                  No deberías estar aquí Caballero!
                </h1>
                <p className="lead" style={{textAlign: "justify", fontWeight: "bold"}}>
                  Regresa por donde llegaste, no podrás pasar sin la autorización del Patriarca <strong style={{fontStyle: "italic"}}></strong>
                </p>
                <h1 className="display-2 text-warning" style={{fontFamily: "Saintfont", letterSpacing: "2px", textAlign: "center"}}>
                  {contador > 0 ? <label>{contador}</label> : <label>Muro de Cristal!!!!</label>}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UnknownPage;