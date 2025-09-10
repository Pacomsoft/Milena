// src/components/Navbar.jsx
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { login, getProfile } from "../services/auth";
import logo from '../assets/images/logo-ssrpg.png';
import { notify } from "../components/Notification";


function Navbar() {
  let { user, loginUser, logoutUser } = useContext(AuthContext);

  async function handleLogin(e) {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      const data = await login(username, password); // retorna token y user
      let profile = await getProfile(); // { user: { username: ... } }
      loginUser(profile.user); // guardar en contexto
      
      notify("success", "Bienvenido de vuelta Caballero " + profile.user.username);
    } catch (err) {
      
      notify("error", "Error al iniciar sesión: " + err.message);
    }
  }



  return (
    <header className="text-white">
      <div className="container">
          {user ? (
            // Si está logueado → mostrar stats
          <div className="flex-wrap align-items-center justify-content-between background-mobile"  style={{display:'block'}}>                    
              <div className="row text-center">
                <div className="col-lg-2 col-md-2 col-sm-4 mb-4 info-base">
                  <center>
                    <div className="square bg-danger border border-3 border-warning p-3">
                      <h3 className="text-gold">1</h3>
                    </div>
                  </center>
                  <div className="label-info mt-2 text-silver">Nivel</div>
                </div>
                <div className="col-lg-2 col-md-3 col-sm-4 mb-4 info-base">
                  <center>
                    <div className="square bg-danger border border-3 border-warning p-3">
                      <h3 className="text-gold">100</h3>
                    </div>
                  </center>
                  <div className="label-info mt-2 text-silver">Armadura</div>
                </div>
                <div className="col-lg-2 col-md-3 col-sm-4 mb-4 info-base">
                  <center>
                    <div className="square bg-danger border border-3 border-warning p-3">
                      <h3 className="text-gold">250</h3>
                    </div>
                  </center>
                  <div className="label-info mt-2 text-silver">Vida</div>
                </div>
                <div className="col-lg-2 col-md-3 col-sm-4 mb-4 info-base">
                  <center>
                    <div className="square bg-danger border border-3 border-warning p-3">
                      <h3 className="text-gold">100</h3>
                    </div>
                  </center>
                  <div className="label-info mt-2 text-silver">Cosmo</div>
                </div>
                <div className="col-lg-2 col-md-3 col-sm-4 mb-4 info-base">
                  <center>
                    <div className="square bg-danger border border-3 border-warning p-3">
                      <h3 className="text-gold">25</h3>
                    </div>
                  </center>
                  <div className="label-info mt-2 text-silver">Oro</div>
                </div>
                <div className="col-lg-2 col-md-3 col-sm-4 mb-4 info-base">
                  <center>
                    <div className="square bg-danger border border-3 border-warning p-3">
                      <h3 className="text-gold">500</h3>
                    </div>
                  </center>
                  <div className="label-info mt-2 text-silver">Habilidad</div>
                </div>
              </div>              
          </div>
          ) : (
            // Si no está logueado → mostrar formulario
            <div className="flex-wrap align-items-center justify-content-between background-mobile"  style={{display:'inline-flex'}}>                    

              <a
                href="/"
                className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none"
                style={{ width: "20%" }}
              >
                <img
                  src={logo}
                  alt="Logo"
                  style={{ maxWidth: "100%" }}
                />
              </a>
              <form
                id="login-form"
                className="d-flex flex-wrap align-items-center"
                onSubmit={handleLogin}
              >
                <div className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3 login-label">
                Usuario:<br />
                <input
                  type="text"
                  className="form-control form-control-dark text-bg-dark"
                  placeholder="Nombre de usuario"
                  id="username"
                  name="username"
                  required
                  autoComplete="off"
                />
              </div>
              <div className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3 login-label">
                Contraseña:<br />
                <input
                  type="password"
                  className="form-control form-control-dark text-bg-dark"
                  placeholder="Contraseña"
                  id="password"
                  name="password"
                  required
                  autoComplete="off"
                />
              </div>
              <center>
                <button type="submit" className="btn btn-warning me-2">
                  Acceder
                </button>
                <a type="button" href="/Registrar" className="btn btn-primary">
                  Registrarme
                </a>
              </center>
              
            </form>
            </div>

          )}
        
      </div>
    </header>
  );
}

export default Navbar;
