import React, {useContext, useState, useEffect} from "react";
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
		localStorage.setItem("menuVisible", menuVisible);
	}, [menuVisible]);

    const handleLogout = () => {
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
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* NAV SUPERIOR */}
      <nav className="navbar top-navbar">
        <div className="container">
          <div className="navbar-content">
            {/* LOGO */}
            <motion.a
              href="/"
              className="d-flex align-items-center mb-2 mb-lg-0 text-gold text-decoration-none"
              style={{ width: "20%" }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.img
                src={logo}
                alt="Logo"
                style={{ maxWidth: "50%" }}
                animate={{
                  filter: [
                    "drop-shadow(0 0 0px #ffd700)",
                    "drop-shadow(0 0 6px #ffd700)",
                    "drop-shadow(0 0 0px #ffd700)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.a>

            {/* ESTADO CABALLERO */}
            <ul className="navbar-nav">
  {/* ===== ESTADO DEL CABALLERO ===== */}
  <li className="nav-item dropdown">
    {caballero && caballero.estado && (
      caballero.estado !== 'Ready' ? (
        <>
          <motion.span
            className="barra-status"
            animate={{
              color: ["#ff5555", "#ffcc00", "#ff5555"],
              textShadow: [
                "0 0 6px #ff4444",
                "0 0 16px #ffcc00",
                "0 0 6px #ff4444",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {caballero.estado}:
          </motion.span>
          <motion.span
            className="barra-status value"
            id="timerest"
            name="timerest"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          >
            10
          </motion.span>
        </>
      ) : (
        <motion.span
          className="barra-status"
          animate={{
            color: ["#00ff88", "#ffffff", "#00ff88"],
            textShadow: [
              "0 0 8px #00ff88",
              "0 0 18px #00ffaa",
              "0 0 8px #00ff88",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          ¡Listo!
        </motion.span>
      )
    )}
  </li>

  {/* ===== MENSAJES ===== */}
  <motion.li
    className="nav-item dropdown nav-messages"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
  >
    <a
      className="nav-link dropdown-toggle"
      href="#"
      id="messageDropdown"
      role="button"
      data-toggle="dropdown"
      aria-haspopup="true"
      aria-expanded="false"
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className="feather feather-mail"
        animate={{
          filter: [
            "drop-shadow(0 0 0px #00c8ff)",
            "drop-shadow(0 0 8px #00c8ff)",
            "drop-shadow(0 0 0px #00c8ff)",
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
      </motion.svg>
    </a>
    <div className="dropdown-menu" aria-labelledby="messageDropdown">
      <div className="dropdown-header d-flex align-items-center justify-content-between">
        <p className="mb-0 font-weight-medium">9 New Messages</p>
        <a href="" className="text-muted">Clear all</a>
      </div>
      <div className="dropdown-body">
        {/* Tus items originales */}
        <a href="" className="dropdown-item">
          <div className="figure">
            <img src="" alt="userr" />
          </div>
          <div className="content">
            <div className="d-flex justify-content-between align-items-center">
              <p>Leonardo Payne</p>
              <p className="sub-text text-muted">2 min ago</p>
            </div>
            <p className="sub-text text-muted">Project status</p>
          </div>
        </a>
        {/* ... y los demás como los tenías */}
      </div>
      <div className="dropdown-footer d-flex align-items-center justify-content-center">
        <a href="">View all</a>
      </div>
    </div>
  </motion.li>

  {/* ===== NOTIFICACIONES ===== */}
  <motion.li
    className="nav-item dropdown nav-notifications"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
  >
    <a
      className="nav-link dropdown-toggle"
      href="#"
      id="notificationDropdown"
      role="button"
      data-toggle="dropdown"
      aria-haspopup="true"
      aria-expanded="false"
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className="feather feather-bell"
        animate={{
          filter: [
            "drop-shadow(0 0 0px #ffd700)",
            "drop-shadow(0 0 8px #ffd700)",
            "drop-shadow(0 0 0px #ffd700)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </motion.svg>
      <div className="indicator">
        <motion.div
          className="circle"
          animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </a>

    {/* === MENÚ DESPLEGABLE NOTIFICACIONES === */}
    <div className="dropdown-menu" aria-labelledby="notificationDropdown">
      <div className="dropdown-header d-flex align-items-center justify-content-between">
        <p className="mb-0 font-weight-medium">6 New Notifications</p>
        <a href="" className="text-muted">Clear all</a>
      </div>
      <div className="dropdown-body">
        {/* Tus notificaciones originales */}
      </div>
      <div className="dropdown-footer d-flex align-items-center justify-content-center">
        <a href="">View all</a>
      </div>
    </div>
  </motion.li>

  {/* ===== PERFIL ===== */}
  <motion.li
    className="nav-item dropdown nav-profile"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <a
      className="nav-link dropdown-toggle"
      href="#"
      id="profileDropdown"
      role="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <motion.img
        src="images/avatars/admin.png"
        alt="profile"
        animate={{
          boxShadow: [
            "0 0 0px #00c8ff",
            "0 0 15px #00c8ff",
            "0 0 0px #00c8ff",
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </a>

    {/* === MENÚ PERFIL === */}
    <ul className="dropdown-menu" aria-labelledby="profileDropdown">
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
            <a href="pages/general/profile.html" className="nav-link">
              <span>Cuenta</span>
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              onClick={handleLogout}
              style={{ cursor: "pointer" }}
            >
              <span>Cerrar Sesión</span>
            </a>
          </li>
        </ul>
      </li>
    </ul>
  </motion.li>
</ul>

            {/* BOTÓN MENÚ */}
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