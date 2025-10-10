// FormStats.jsx
import React, { useState, useContext, useEffect } from "react";
import { Table, Button, OverlayTrigger, Tooltip, Modal, Form } from "react-bootstrap";
import { AuthContext, setCaballero } from "../context/AuthContext"; 
import { onSubirStatAPI } from "../services/caballero";
import caballerostats from "../assets/images/entrenar.png";
import { createCaballero } from "../services/caballero";
import { notify } from "./Notification";
import { getBoostForStat } from "../services/boost";
import { boStatMap } from "../services/habilidades";


const FormularioHabilidades = ({
  habilidadesData,
  puntosIniciales = 0,
  oroInicial = 0,
  boosts = [],
  selectedDiv,
  selectedDivZo
  
}) => {
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { caballero, setCaballero, user, token, username} = useContext(AuthContext);

  const [puntos, setPuntos] = useState(puntosIniciales);
  const [oro, setOro] = useState(oroInicial);

  // const [stats, setStats] = useState(
  //   habilidadesData.reduce((acc, h) => ({ ...acc, [h.key]: [h.nivel] }), {})
  // );
  const [stats, setStats] = useState({});
  const [confirmar, setConfirmar] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [pendingStat, setPendingStat] = useState(null);
  const [boost, setBoost] = useState(false);

  useEffect(() => {
    if (!habilidadesData || habilidadesData.length === 0) return;

    const initStats = habilidadesData.reduce((acc, h) => ({ ...acc, [h.key]: Number(h.nivel) }), {});

    setStats(initStats);
  }, [habilidadesData]); 

  // Incremento local (no caballero)
  const handleIncrementLocal = (habilidad) => {
    if (oro < habilidad.costo || puntos <= 0) return;
    if (habilidad.max && stats[habilidad.key] >= habilidad.max) return;

    if (confirmar) {
      setPendingStat({ habilidad, mode: "local" });
      setShowModal(true);
    } else {
      applyIncrementLocal(habilidad);
    }
  };

  const applyIncrementLocal = (habilidad) => {
    setStats({...stats,[habilidad.key]: Number(stats[habilidad.key] ?? 0) + 1});
    setOro(oro - habilidad.costo);
    setPuntos(puntos - 1);
    setShowModal(false);
  };

  // Decremento local (solo si no existe caballero)
  const handleDecrementLocal = (habilidad) => {
    if (stats[habilidad.key] <= 1) return;
    setStats({ ...stats, [habilidad.key]: stats[habilidad.key] - 1 });
    setPuntos(puntos + 1);
    setBoost(false);
    setBoost(true);
  };

  // Incremento API (caballero existente)
  const handleIncrementAPI = (habilidad) => {
    if (oro < habilidad.costo || puntos <= 0) 
    {
      if(oro < habilidad.costo) notify("error", "No cuentas con oro suficiente para entrenar la habilidad")
      if(puntos <= 0) notify("error", "No cuentas con puntos de habilidad para entrenar.")
  
      return
    };
    if (habilidad.max && stats[habilidad.key] >= habilidad.max)  {notify("error", "Se ha llegado al límite máximo para esta habilidad");return;}

    if (confirmar) {
      setPendingStat({ habilidad, mode: "api" });
      setShowModal(true);
    } else {
      applyIncrementAPI(habilidad);
    }
  };

  const applyIncrementAPI = async (habilidad) => {
    try {
      setLoadingBtn(true);
      const payload = {
        id: caballero.id,
        stat: habilidad.key
      }


      const caballeroData = await onSubirStatAPI(payload,  token);

      setCaballero(caballeroData);
      setPuntos(caballeroData.habilidad);
      setOro(caballeroData.oro);
      const statName = Object.fromEntries(Object.entries(boStatMap).map(([k, v]) => [v, k]))[habilidad.key] || habilidad.key;
      notify("success", "Haz aumentado tu "+statName+"!");                
      setShowModal(false);
    } catch (err) {
      notify("error", "Error subiendo stat: "+ err);
    }
    finally{
      setLoadingBtn(false);
    }

  };

const handleCreateCaballero = async () => {
  if (puntos > 0) {
    alert("Debes gastar todos los puntos antes de crear tu caballero");
    return;
  }
  console.log(stats);
  const payload = {
    nombre: username, // si tienes un input para el nombre
    id_avatar: user,
    id_divinidad: selectedDiv?.di_key,
    id_zodiaco: selectedDivZo?.zo_key,
    velocidad: stats.velocidad,
    poder: stats.fuerza,
    conocimiento: stats.sabiduria,
    precision: stats.presicion,
    agilidad: stats.reflejos,
    resistencia: stats.resistencia,
    resistencia_mental: stats.resistenciap,
    persistencia: stats.persistencia,
    cosmo: stats.cosmo,
    septimo_sentido: stats.septimo
  };
  const nuevoCaballero = await createCaballero(payload, token);

  if (nuevoCaballero) {
    notify("success", "Caballero creado correctamente!");
    setCaballero(nuevoCaballero);
  }
};


  return (
    <div className="container" style={{ paddingTop: "1%" }}>


      <div
        className={`row flex-lg-row align-items-center py-5 background-mobile container-base justify-content-center ${
          boost ? "background-boost" : ""
        }`}
        style={{
          backgroundImage: `url(${caballerostats})`,
          backgroundSize: "33%",
          backgroundPosition: "left center",
        }}
      >
        <div className="col-lg-4"></div>
        <div className="col-lg-6" style={{ alignSelf: "flex-start" }}>
          <div className="row">
            <Table responsive className="shadow-sm">
              <thead className="table-dark">
                <tr>
                  <th colSpan={5}>      
                    <p style={{ textAlign: "justify" }}>
                      Las estadísticas que definas no podrán revertirse, por lo que debes ser cuidadoso al
                      seleccionar la habilidad a entrenar. Cada habilidad define el resultado de la batalla.
                    </p>
                  </th>
                </tr>
                <tr>
                  <th colSpan={3} style={{textAlign: "left", fontSize: "3vh" }}>
                    <label className="text-gold">Habilidades:</label>
                  </th>
                  <th colSpan={2} style={{ fontSize: "3vh", textAlign: "right" }}>
                    <label>{puntos}</label>
                  </th>
                </tr>
                <tr>
                  <th colSpan={3} style={{ textAlign: "left", fontSize: "3vh" }}>
                    <label className="text-gold">Oro:</label>
                  </th>
                  <th colSpan={2} style={{ fontSize: "3vh", textAlign: "right" }}>
                    <label>{oro}</label>
                  </th>
                </tr>
                <tr>
                  <th>Habilidad</th>
                  <th>Valor</th>
                  <th>Boost</th>
                  <th>Costo</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {habilidadesData.map((h) => {
                  const boostValue = getBoostForStat(h.key, boosts, selectedDiv, selectedDivZo, stats);
                  const totalValue = Math.floor(Number(stats[h.key] ?? 0));

                  return (
                    <tr key={h.key} className="align-middle">
                      <td>
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip className="tooltip-placa" id={`tip-${h.key}`}>{h.desc}</Tooltip>
                          }
                        >
                          <span style={{ cursor: "help", fontWeight: "bold" }}>
                            {h.nombre}
                          </span>
                        </OverlayTrigger>
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          value={totalValue}
                          readOnly
                          min="1"
                          className="text-center input-seiya"
                        />
                      </td>
                      <td>
                        {boostValue > 0 && (
                          <small className="text-alert-green">
                            (+{boostValue.toFixed(2)})
                          </small>
                        )}
                      </td>
                      <td className="text-gold">{h.costo} oro</td>
                      <td className="text-center">
                        {!caballero && stats[h.key] > 1 && (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDecrementLocal(h)}
                            className="me-1"
                          >
                            -
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() =>
                            caballero
                              ? handleIncrementAPI(h)
                              : handleIncrementLocal(h)
                          }
                          style={{display: h.costo > oro || puntos <= 0  || (totalValue >= h.max) ? "none":"inline-block"}}
                        >
                          +
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <th colSpan={5} style={{ textAlign: "justify" }}>
                    <Form.Check
                      type="checkbox"
                      id="checkConfirm"
                      label="Confirmar antes de entrenar"
                      checked={confirmar}
                      onChange={(e) => setConfirmar(e.target.checked)}
                    />
                  </th>
                </tr>
              </tbody>
              <tfoot>                
              </tfoot>
            </Table>
          </div>
        </div>

        {/* Panel de boosts */}
        <div className="col-lg-2">
          <h3>Boosts</h3>
          <div>
            {boosts
              .filter((b) => b.bo_type === "Deidad" && b.bo_origin === selectedDiv.di_key)
              .map((boost, i) => (
                <p key={`div-${i}`} style={{ color: "#f4d322" }}>
                  {boost.bo_description} →{" "}
                  <span className="text-alert-green">
                    {boost.bo_quantity} {boost.bo_unit} en {boost.bo_stat}
                  </span>
                </p>
              ))}
          </div>
          <div>
            {boosts
              .filter((b) => b.bo_type === "Signo" && b.bo_origin === selectedDivZo.zo_key)
              .map((boost, i) => (
                <p key={`zo-${i}`} style={{ color: "#f4d322" }}>
                  {boost.bo_description} →{" "}
                  <span className="text-alert-green">
                    {boost.bo_quantity} {boost.bo_unit} en {boost.bo_stat}
                  </span>
                </p>
              ))}
          </div>
        </div>

        {/* Solo aparece si NO existe caballero */}
        {!caballero && (
        <div className="col-lg-12">
          <center>
            <Button
              variant="warning"
              style={{ float: "middle" }}
              disabled={puntos > 0} // solo habilitado cuando se gasten todos los puntos
              onClick={handleCreateCaballero} // función async que llama al API
            >
              Crear Caballero
            </Button>
          </center>
        </div>

        )}
        
      </div>

      {/* Modal confirmación */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Entrenamiento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Deseas incrementar <b>{pendingStat?.habilidad.nombre}</b>? Esto costará{" "}
          <b>{pendingStat?.habilidad.costo}</b> oro.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="warning"
            disabled={loadingBtn} // deshabilitado mientras carga
            onClick={() =>
              pendingStat?.mode === "api"
                ? applyIncrementAPI(pendingStat.habilidad)
                : applyIncrementLocal(pendingStat.habilidad)
            }
          >
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FormularioHabilidades;
