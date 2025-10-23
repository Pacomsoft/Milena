import React, {useEffect, useState} from "react"
import { CSSTransition, SwitchTransition } from "react-transition-group";
import NextIcon from "../../icons/Next"
import {motion} from "framer-motion"
export default function StepDeidad({ divinidades, boosts,selectedDiv, setSelectedDiv, descriptionRef, onNext }) {

  return (
    <div className="p-4">
      <h3 className="text-center text-gold" style={{ fontSize: "5vh" }}>
        Selecciona una Deidad
      </h3>
      <p className="text-justify">
        La deidad que elijas marcará tu destino como caballero. Al jurar lealtad a un Dios,
        obtendrás un bonus único en tus habilidades, el derecho de portar con orgullo el Título
        de algún Caballero de esa deidad en el Ranking, y acceso a técnicas especiales vinculadas
        a su poder divino.{" "}
        <strong className="text-gold">
          Tu elección no es definitiva:
        </strong>{" "}
        podrás cambiar de deidad más adelante.
      </p>

      <motion.div className="row g-4" initial="hidden" animate="visible" variants={{hidden: {}, visible: {transition: {staggerChildren: 0.2,},},}}>
        {divinidades.map((img) => (
          <motion.div className="col-md-3 box" key={img.di_key} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 },}} transition={{ duration: 0.4 }}>
            <div
                  className={`card selectable card-deidad ${
                    selectedDiv?.di_key === img.di_key ? "selected" : ""
                  }`}
                  onClick={() => setSelectedDiv(img)}
                  style={{ cursor: "pointer" }}
                  role="button"
                  aria-selected={selectedDiv?.di_key === img.di_key}
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
          </motion.div>          
        ))}
      </motion.div>

      {selectedDiv && (
        <SwitchTransition>
          <CSSTransition key={selectedDiv?.di_key} timeout={500} classNames="fade">
            <div
              ref={descriptionRef}
              className="mt-4 text-center epic-description p-3 rounded shadow-lg mx-auto"
              style={{ color: "#ffffff", background: "#10121aa1", borderRadius: "30px" }}
            >
              <h4 className="text-gold" style={{fontWeight:"bold", textTransform:"uppercase"}}>{selectedDiv.di_name}</h4><br/>
              {selectedDiv.di_description}<br/>
              <div>
                {
                  //boosts.map((boost)=>(boost.bo_description))}
                  boosts
                  .filter(b => b.bo_type === 'Deidad' && b.bo_origin === selectedDiv.di_key).
                  map((boost) =>
                  (
                    <div key="BD+${b.bo_origin}">
                     
                      <p style={{color:"#f4d322"}}> <label id="descriptionBD">{boost.bo_description}</label> Tu caballero obtendrá una bonificación de <label id="cantidad" className="text-alert-green">{boost.bo_quantity} {boost.bo_unit} en {boost.bo_stat}</label>.</p>
                    </div>
                ))}
                </div>
            </div>    
          </CSSTransition>
        </SwitchTransition>
      )}

      <div className="text-center mt-4">
        <button
          type="button"
          className={`btn btn-warning float-end ${selectedDiv ? "btn-animated" : ""}`}
          onClick={onNext}
          disabled={!selectedDiv}
        >
          <NextIcon/>
        </button>
      </div>
    </div>
  );
}
