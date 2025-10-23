import { CSSTransition, SwitchTransition } from "react-transition-group";
import NextIcon from "../../icons/Next";
import BackIcon from "../../icons/Back";
import {motion} from "framer-motion"

export default function StepSigno({ signos, boosts, selectedDivZo, setSelectedDivZo, descriptionRefZo, onNext, onPrev }) {
  return (
    <div className="p-4">
      <h3 className="text-center text-warning" style={{ fontSize: "5vh" }}>
        Selecciona un signo Zodiacal
      </h3>
      <p className="text-justify">
        La constelación que elijas marcará te guiara en el camino como caballero. Obtendrás un bonus único en tus habilidades, con el cual definirás tu estilo de combate, también, podrás ser protector de la casa en el Santuario, recibiendo desafíos de otros caballeros y obteniendo grandes recompensas por mantener impenetrable tu posición. Además, tu constelación te protegerá en las batallas difíciles, apareciendo para incrementar tu poder cuando mas lo necesites. 
        {" "}
        <strong className="text-gold">
          Tu elección ES DEFINITIVA: NO PODRÁS CAMBIAR DE CONSTELACIÓN MAS ADELANTE.
        </strong>{" "}
      </p>

      <motion.div className="row g-6" initial="hidden" animate="visible" variants={{hidden: {}, visible: {transition: {staggerChildren: 0.1,},},}}>
        {signos.map((img) => (
          <motion.div className="col-md-2 box" key={img.zo_key} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 },}} transition={{ duration: 0.4 }}>
            <div
              className={`card selectable card-signo ${
                selectedDivZo?.zo_key === img.zo_key ? "selected" : ""
              }`}
              onClick={() => setSelectedDivZo(img)}
              style={{ cursor: "pointer" }}
              role="button"
              aria-selected={selectedDivZo?.zo_key === img.zo_key}
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
          </motion.div>
        ))}
      </motion.div>      

      {selectedDivZo && (
        <SwitchTransition>
          <CSSTransition key={selectedDivZo?.zo_key} timeout={500} classNames="fade">
            <div
              ref={descriptionRefZo}
              className="mt-4 text-center epic-description p-3 rounded shadow-lg mx-auto"
              style={{  background: "#10121aa1", borderRadius: "30px" }}
            >
                <h4 className="text-gold" style={{fontWeight:"bold", textTransform:"uppercase"}}>{selectedDivZo.zo_name}</h4><br/>
              {selectedDivZo.zo_description}
              <div>
                {
                  //boosts.map((boost)=>(boost.bo_description))}
                  boosts
                  .filter(b => b.bo_type === 'Signo' && b.bo_origin === selectedDivZo.zo_key).
                  map((boost) =>
                  (
                    <div key={'BS'+boost.bo_origin}>
                     
                      <p style={{color:"#f4d322"}}> <label id="descriptionBD">{boost.bo_description}</label> Tu caballero obtendrá una bonificación de <label id="cantidad" className="text-alert-green">{boost.bo_quantity} {boost.bo_unit} en {boost.bo_stat}</label>.</p>
                    </div>
                ))}
                </div>
            </div>
          </CSSTransition>
        </SwitchTransition>
      )}

      <div className="text-center mt-4">
        <button type="button" className="btn btn-secondary float-start" onClick={onPrev}>
          <BackIcon/>
        </button>
        <button
            type="button"
            className={`btn btn-warning float-end ${selectedDivZo ? "btn-animated" : ""}`}          onClick={onNext}
            disabled={!selectedDivZo}
        >
          <NextIcon/>
        </button>
      </div>
    </div>
  );
}
