import React, {useContext, useState, useEffect} from "react";
import { Link } from "react-router-dom";
import logo from '../assets/images/logo-ssrpg.png';
import { AuthContext } from "../context/AuthContext";
import { useNavigate} from "react-router-dom";
import { notify } from "../components/Notification";
import icon_cosmo from '../assets/images/icons/cosmo.png';
import icon_caballero from '../assets/images/icons/caballero2.png';
import icon_armadura from '../assets/images/icons/armadura.png';
import icon_enemigo from '../assets/images/icons/enemigo.png';
import icon_coliseo from '../assets/images/icons/coliseo.png';
import icon_inventario from '../assets/images/icons/inventario.png';
import icon_explorar from '../assets/images/icons/explorar.png';
import icon_viajar from '../assets/images/icons/viajar.png';
import icon_misiones from '../assets/images/icons/misiones.png';
import icon_entrenar from '../assets/images/icons/entrenar.png';
import { motion } from "framer-motion";


    

  

function Menu(){
    const { user, loginUser, logoutUser , caballero, username} = useContext(AuthContext);
    const navigate = useNavigate();

    const [profileOpen, setProfileOpen] = useState(false);

useEffect(() => {
  const close = () => setProfileOpen(false);
  document.addEventListener("click", close);
  return () => document.removeEventListener("click", close);
}, []);


 	const navItems = [
    { label: "Caballero", href: "/Caballero", icon: icon_caballero },
    { label: "Inventario", href: "/Inventario", icon: icon_inventario },
    { label: "Armadura", href: "/Armadura", icon: icon_armadura },
    { label: "Enemigo", href: "/Enemigo", icon: icon_enemigo },
    { label: "Coliseo", href: "/Coliseo", icon: icon_coliseo },
    { label: "Explorar", href: "/Explorar", icon: icon_explorar },
    { label: "Viajar", href: "/Viajar", icon: icon_viajar },
    { label: "Cosmo", href: "/Cosmo", icon: icon_cosmo },
    { label: "Misiones", href: "/Misiones", icon: icon_misiones },
    { label: "Entrenar", href: "/Entrenar", icon: icon_entrenar }
  ];
	  // Inicializa el estado leyendo de localStorage
	const [menuVisible, setMenuVisible] = useState(() => {
		const saved = localStorage.getItem("menuVisible");
		return saved === "true"; // devuelve true o false
	});

	// Guarda el estado en localStorage cada vez que cambie
	useEffect(() => {
		localStorage.setItem("menuVisible", false);
	}, [menuVisible]);

    const handleLogout = () => {
      alert('saliendo');
      logoutUser();
      notify("info", "Te esperamos de vuelta Caballero, ¡Hasta pronto!");
      navigate("/");
    }
	if (!user) {
    // si no hay usuario logueado, no renderiza nada
    	return null;
  	}
	
	 return (
    <motion.div
      className="horizontal-menu"
      style={{ position: "fixed", zIndex: 2000, width: "100%" }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
    {/* NAV SUPERIOR */}
    <nav className="navbar top-navbar">
      <div className="container">
        <div className="navbar-content d-flex justify-content-between align-items-center">

          {/* LOGO */}
          <a
            href="/"
            className="d-flex align-items-center mb-2 mb-lg-0 text-gold text-decoration-none"
            style={{ width: "20%" }}
          >
            <img src={logo} alt="Logo" style={{ maxWidth: "50%" }} />
          </a>

          {/* === TÍTULO CENTRAL === */}
          <div className="navbar-title flex-grow-1 text-center">
            <h5 className="text-gold text-uppercase mb-0">
              {(() => {
                const path = window.location.pathname.toLowerCase();
                if (path.includes("/caballero")) return "Caballero";
                if (path.includes("/armadura")) return "Armadura";
                if (path.includes("/inventario")) return "Inventario";
                if (path.includes("/acciones")) return "Acciones";
                if (path.includes("/mensajes")) return "Mensajes";
                if (path.includes("/opciones")) return "Opciones";
                if (path.includes("/premium")) return "Premium";
                if (path.includes("/coliseo")) return "Coliseo";
                if (path.includes("/explorar")) return "Explorar";
                if (path.includes("/entrenar")) return "Entrenar";
                return "SSRPG";
              })()}
            </h5>
          </div>

          {/* ===== ICONOS DERECHA ===== */}
          <ul className="navbar-nav d-flex align-items-center mb-0">
            {/* ===== ESTADO CABALLERO ===== */}
            <li className="nav-item dropdown me-3">
              {caballero && caballero.estado && (
                caballero.estado !== 'Ready' ? (
                  <>
                    <span className="barra-status">{caballero.estado}:</span>
                    <span
                      className="barra-status value"
                      id="timerest"
                      name="timerest"
                    >
                      10
                    </span>
                  </>
                ) : (
                  <span className="barra-status">¡Listo!</span>
                )
              )}
            </li>

            {/* ===== MENSAJES ===== */}
            <li className="nav-item dropdown nav-messages me-3">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="messageDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="feather feather-mail"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </a>
            </li>

            {/* ===== NOTIFICACIONES ===== */}
            <li className="nav-item dropdown nav-notifications me-3">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="notificationDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="feather feather-bell"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <div className="indicator">
                  <div className="circle"></div>
                </div>
              </a>
            </li>

            {/* ===== PERFIL ===== */}
            <li className="nav-item dropdown nav-profile">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setProfileOpen(o => !o);
                }}
                aria-expanded={profileOpen}
                id="profileDropdown"
              >
                <img src="images/avatars/admin.png" alt="profile" />
              </a>
              <ul
                className={`dropdown-menu${profileOpen ? " show" : ""}`}
                aria-labelledby="profileDropdown"
                onClick={(e) => e.stopPropagation()}
                style={{ display: profileOpen ? "block" : "none" }}
              >
                <li>
                  <div className="dropdown-header d-flex flex-column align-items-center">
                    <div className="figure mb-3">
                      <img src="images/avatars/admin.png" alt="" />
                    </div>
                    <div className="info text-center">
                      <p className="name font-weight-bold mb-0">{username}</p>
                    </div>
                  </div>
                </li>
                <li>
                  <ul className="profile-nav p-0 pt-3">
                    <li className="nav-item">
                      <Link to="/logout" className="nav-link" onClick={(e) => e.stopPropagation()}>
                        <span>Cerrar Sesión</span>
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>

          {/* BOTÓN MENÚ (opcional) */}
          <button
            className="navbar-toggler navbar-toggler-right align-self-center"
            type="button"
            onClick={() => setMenuVisible(!menuVisible)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

        </div>
      </div>
    </nav>


      {/* NAV INFERIOR */}
      {caballero && (
        <motion.nav
          id="bottomNavbar"
          className={`bottom-navbar collapse ${menuVisible ? "show" : ""}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: menuVisible ? 1 : 0, y: menuVisible ? 0 : -20 }}
          transition={{ duration: 0.4 }}
        >
          <div className="container">
            <motion.ul
              className="nav page-navigation d-flex justify-content-center flex-wrap"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.05 } }
              }}
            >
              {navItems.map(({ label, href, icon }, i) => (
                <motion.li
                  key={i}
                  className="nav-item mx-1"
                  whileHover={{ scale: 1.1 }}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <a
                    href={href}
                    className="btn btn-menu align-items-center gap-2"
                    style={{
                      fontSize: "0.8rem",
                      color: "#fff",
                      textShadow: "0 0 6px #00c8ff"
                    }}
                  >
                    <motion.img
                      src={icon}
                      alt={label}
                      style={{
                        width: "30px",
                        height: "30px",
                        marginRight: "5px"
                      }}
                      animate={{
                        filter: [
                          "drop-shadow(0 0 0px #00c8ff)",
                          "drop-shadow(0 0 6px #00c8ff)",
                          "drop-shadow(0 0 0px #00c8ff)"
                        ]
                      }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                    {label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </motion.nav>
      )}
    </motion.div>
  );

}

export default Menu;