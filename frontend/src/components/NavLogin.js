import React, {useContext}  from "react";
import { AuthContext } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import logo from "../assets/images/logo-ssrpg.png"
import { login, getProfile } from "../services/auth";
import { notify } from "../components/Notification";
import { getCaballero } from "../services/caballero";


function NavLogin() {
    
    const { loginUser } = useContext(AuthContext);    
    const { register, handleSubmit, formState: { errors } } = useForm();

    async function handleLogin(data) 
    {
        const username = data.username;
        const password = data.password;

        try 
        {            
            await login(username, password); // retorna token y user
            let profile = await getProfile(); // { user: { username: ... } }
            let caballeroData = await getCaballero(profile.cuenta, profile.token);            
            
            loginUser(profile.cuenta, profile.token, profile.user, caballeroData); // guardar en contexto
            
            notify("success", "Bienvenido de vuelta Caballero " + profile.user);
        } 
        catch (err) 
        {        
            notify("error", "Error al iniciar sesión: " + err.message);
        }
    }

    return(
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
                onSubmit={handleSubmit(handleLogin)}
              >
                <div className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3 login-label">
                Usuario:<br />
                <input
                  type="text"
                  className="form-control form-control-dark text-bg-dark"
                  placeholder="Nombre de usuario"
                  id="username"
                  autoComplete="off"
                  {...register("username", { required: "Ingresa tu nombre de usuario." })                
                }
                />
                {errors.username && <p className="p-required">{errors.username.message}</p>}
              </div>
              <div className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3 login-label">
                Contraseña:<br />
                <input
                  type="password"
                  className="form-control form-control-dark text-bg-dark"
                  placeholder="Contraseña"
                  id="password"
                  autoComplete="off"
                  {...register("password", { required: "Ingresa tu contraseña." })} 
                />
                {errors.password && <p className="p-required">{errors.password.message}</p>}
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
    );
}

export default NavLogin;
