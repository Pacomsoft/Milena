import { CSSTransition, SwitchTransition } from "react-transition-group";
import NextIcon from "../../icons/Next";
import BackIcon from "../../icons/Back";

export default function StepSigno({ signos, selectedDivZo, setSelectedDivZo, descriptionRefZo, onNext, onPrev }) {
  return (
    <div className="p-4">
      <h3 className="text-center text-gold" style={{ fontSize: "5vh" }}>
        Selecciona un signo Zodiacal
      </h3>

      <div className="row g-6">
        {signos.map((img) => (
          <div className="col-md-2" key={img.zo_key}>
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
                <h4 className="text-gold" style={{fontWeight:"bold", textTransform:"uppercase"}}>{selectedDivZo.zo_name}</h4>
              {selectedDivZo.zo_description}
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
