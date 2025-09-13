import { CSSTransition, SwitchTransition } from "react-transition-group";
import NextIcon from "../../icons/Next"

export default function StepDeidad({ divinidades, selectedDiv, setSelectedDiv, descriptionRef, onNext }) {
  return (
    <div className="p-4">
      <h3 className="text-center text-gold" style={{ fontSize: "5vh" }}>
        Selecciona una Deidad
      </h3>
      <p>
        La deidad que elijas marcará tu destino como caballero. Al jurar lealtad a un Dios,
        obtendrás un bonus único en tus habilidades, el derecho de portar con orgullo el Título
        de algún Caballero de esa deidad en el Ranking, y acceso a técnicas especiales vinculadas
        a su poder divino.{" "}
        <strong className="text-gold">
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
