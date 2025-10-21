// src/pages/CaballeroPage.jsx
import React, { useState, useContext } from "react";
import coliseoImg from "../assets/images/patriarca.png";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { buscarContrincantes, simularCombate } from "../services/combate";
import { notify } from "../components/Notification";
import { FRONT_URL } from "../config";

const Coliseo = () => {
  const navigate = useNavigate();
  const {caballero} = useContext(AuthContext);

  const [nombre, setNombre] = useState("");
  const [nivel, setNivel] = useState("");
  const [signo, setSigno] = useState("");
  const [deidad, setDeidad] = useState("");
  const [resultados, setResultados] = useState([]);
  const [busquedaHecha, setBusquedaHecha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [zona, setZona] = useState(caballero.zona_actual);
  const [account, setAccount] = useState(caballero.id_avatar);
  const [nivel_act, setNivelAct] = useState(caballero.nivel);
  const [idcontrincante, setIdContrincante] = useState(null);
  const [idBatalla, setIdBatalla] = useState(null);
  const [iniciandoPelea, setIniciandoPelea] = useState(false);
  const [contador, setContador] = useState(3);

  const handleBuscar = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await buscarContrincantes({nombre, nivel, signo, deidad, zona, account, nivel_act});
      setResultados(data);
      setIdContrincante(data.id);
      setBusquedaHecha(true);
    } catch (err) {
      notify("error", "Error al buscar contrincantes: "+err);      
      setResultados([]);
      setBusquedaHecha(true);
    } finally {
      setLoading(false);
    }
  };

const handlePelear = async (id_contrincante) => {
  setIniciandoPelea(true);
  setContador(3);

  // Contador descendente visual
  const countdown = setInterval(() => {
    setContador((prev) => {
      if (prev === 1) {
        clearInterval(countdown);
        iniciarCombate(id_contrincante); // Inicia la pelea real
      }
      return prev - 1;
    });
  }, 1000);
};

const iniciarCombate = async (id_contrincante) => {
  setLoading(true);
  const payload = {
    p1_id: caballero.id,
    p2_id: id_contrincante,
    tipo: "duelo",
    quest_id: 0,
  };
  try {
    console.log(payload);
    const data = await simularCombate(payload);
    setIdBatalla(data.id);

    // abrir la ventana de batalla
    window.open(FRONT_URL+`/Batalla?id=${data.id}`, "_blank");
    setNombre("");
    setNivel("");
    setSigno("");
    setDeidad("");
    setResultados([]);
    setBusquedaHecha(true);
  } catch (err) {
    notify("error", "Error al intentar pelear. No se ha procesado: " + err);
  } finally {
    setLoading(false);
    setIniciandoPelea(false);
    setNombre("");
    setNivel("");
    setSigno("");
    setDeidad("");
    setResultados([]);
    setBusquedaHecha(false);
  }
};


  const handleVolver = () => {
    setBusquedaHecha(false);
    setResultados([]);
    setNombre("");
    setNivel("");
    setSigno("");
    setDeidad("");
    setIdContrincante(null);
    setIdBatalla(null);
  };

  return (
    <motion.div
      className="row flex-lg-row-reverse align-items-center g-1 py-1 background-mobile container-base"
      style={{
        backgroundImage: `url(${coliseoImg})`,
        backgroundSize: "60%",
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.div
        className="col-lg-6"
        style={{ alignSelf: "flex-start", marginLeft: "5%", marginRight: "5%" }}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.05 },
          },
        }}
      >
        <div className="search-card col-lg-12 p-4 rounded-4 stats-div">

          {/* === INTRO COLOSSEO === */}
          <motion.div
            className="intro-coliseo text-center mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            style={{ boxShadow: "none" }}
          >
            <p
              className="text-light fw-light fst-italic"
              style={{
                fontSize: "1.3rem",
                fontFamily: "Reddit",
                fontWeight: "normal",
                lineHeight: "normal",
              }}
            >
              “El Coliseo sagrado abre sus puertas… Guerreros de todos los
              rincones del mundo se reúnen para demostrar quién porta el cosmos
              más ardiente.”
            </p>
            <motion.p
              className="text-gold fw-bold"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              Elige sabiamente a tu contrincante...
            </motion.p>
          </motion.div>

          {/* === FORMULARIO === */}
          {!busquedaHecha && !idBatalla && (
            <form className="row g-3" onSubmit={handleBuscar}>
              <div className="col-12 col-md-6">
                <label className="form-label text-gold">Nombre</label>
                <input
                  type="text"
                  className="form-control login-input"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Seiya"
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label text-gold">Nivel</label>
                <input
                  type="number"
                  className="form-control login-input"
                  min="1"
                  value={nivel}
                  onChange={(e) => setNivel(e.target.value)}
                  placeholder="Ej. 15"
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label text-gold">Signo</label>
                <select
                  className="form-select login-input"
                  value={signo}
                  onChange={(e) => setSigno(e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="Aries">Aries</option>
                  <option value="Tauro">Tauro</option>
                  <option value="Géminis">Géminis</option>
                  <option value="Cáncer">Cáncer</option>
                  <option value="Leo">Leo</option>
                  <option value="Virgo">Virgo</option>
                  <option value="Libra">Libra</option>
                  <option value="Escorpio">Escorpio</option>
                  <option value="Sagitario">Sagitario</option>
                  <option value="Capricornio">Capricornio</option>
                  <option value="Acuario">Acuario</option>
                  <option value="Piscis">Piscis</option>
                </select>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label text-gold">Deidad</label>
                <select
                  className="form-select login-input"
                  value={deidad}
                  onChange={(e) => setDeidad(e.target.value)}
                >
                  <option value="">Todas</option>
                  <option value="Athena">Athena</option>
                  <option value="Poseidon">Poseidón</option>
                  <option value="Hades">Hades</option>
                  <option value="Zeus">Zeus</option>
                </select>
              </div>

              <div className="col-12 text-center mt-3">
                <motion.button
                  type="submit"
                  className="btn btn-warning fw-bold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={loading}
                >
                  {loading ? "Buscando..." : "Buscar"}
                </motion.button>
              </div>
            </form>
          )}

          {/* === RESULTADOS === */}
          {busquedaHecha && !idBatalla && (
            <motion.div
              className="resultados mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {loading ? (
                <p className="text-center text-light">Buscando contrincantes...</p>
              ) : resultados.length > 0 ? (
                <div className="row">
                  {resultados.map((pj, i) => (
                    <motion.div
                      key={pj.id || i}
                      className="col-12 mb-3"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="card bg-dark border-gold p-3 text-center">
                        <div className="row">
                          <div className="col-lg-12">
                            <img src="/static/media/caballero_batalla.2e3f4fa5167e106ebf7e.png" alt="PJ2" className="card-img-top rounded-4 mb-3" style={{objectFit: 'cover', height: '200px', opacity: '1', transform: 'none'}}></img>
                          </div>                        
                          <div className="col-lg-12">
                            <h5 className="text-gold mb-1">{pj.nombre}</h5>
                          </div>  
                        </div>
                        <div className="row">
                          <div className="col-lg-4" style={{color:'white'}}><b>Nivel:</b> {pj.nivel}</div>
                          <div className="col-lg-4" style={{color:'white'}}><b>Signo:</b>{" "} {pj.signo_name || "?"}</div>
                          <div className="col-lg-4" style={{color:'white'}}><b>Deidad:</b>{" "} {pj.divinidad_name || "?"}</div>
                        </div>
                    
                        <motion.button
                          className="btn btn-sm btn-outline-warning mt-2"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handlePelear(pj.id)} // 👈 pasamos el ID
                        >
                          ⚔️ Desafiar
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-center" style={{fontWeight:'bold', color:'rgb(255 204 7)', fontSize:'1.3rem'}}>
                  No se encontraron contrincantes...
                </p>
              )}

              <div className="text-center mt-4">
                <motion.button
                  className="btn btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleVolver}
                >
                 Volver a buscar
                </motion.button>
              </div>
            </motion.div>
          )}
          {idBatalla && (
            <motion.div
              className="resultado-batalla text-center mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h4 className="text-gold mb-3">⚔️ ¡Batalla iniciada!</h4>
              <p className="text-light">
                Tu duelo ha comenzado en el Coliseo Sagrado.  
                Puedes verla nuevamente o regresar a tu caballero.
              </p>

              <div className="d-flex justify-content-center gap-3 mt-3">
                <motion.button
                  className="btn btn-warning fw-bold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open(`/Batalla?id=${idBatalla}`, "_blank")}
                >
                   Ver batalla
                </motion.button>

                <motion.button
                  className="btn btn-outline-light fw-bold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/Caballero")}
                >
                 Volver al Caballero
                </motion.button>
              </div>
            </motion.div>
          )}

          {iniciandoPelea && (
            <motion.div
              className="overlay-countdown d-flex justify-content-center align-items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0,0,0,0.8)",
                zIndex: 9999,
                flexDirection: "column",
              }}
            >
              <motion.h1
                key={contador}
                initial={{ scale: 0.2, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="text-gold fw-bold"
                style={{ fontSize: "8rem", textShadow: "0 0 30px gold" }}
              >
                {contador > 0 ? contador : "¡A PELEAR!"}
              </motion.h1>

              {contador <= 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-light mt-3"
                  style={{ fontSize: "1.5rem", fontStyle: "italic" }}
                >
                  Cargando arena de combate...
                </motion.p>
              )}
            </motion.div>
          )}

        </div>
      </motion.div>
    </motion.div>
  );
};

export default Coliseo;
