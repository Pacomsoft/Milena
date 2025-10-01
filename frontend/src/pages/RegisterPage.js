import React, {useState, useContext} from "react";
import registroimg from '../assets/images/register.png';
import { RegistrarUsuario, checkPassword} from "../services/register";
import { notify } from "../components/Notification";
import { useForm, SubmitHandler } from "react-hook-form";
import { login, getProfile } from "../services/auth";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


function RegisterPage() {
const navigate = useNavigate();

const { user, loginUser } = useContext(AuthContext);    
const { register, handleSubmit, formState: { errors } } = useForm();

const [loading, setLoading] = useState(false);

async function handleRegister(data){
  
  setLoading(true);
  const userData = {
    username: data.name,
    email: data.email,
    password: data.newpassword,
    confirm_password: data.confirm_password,
    birthday: data.birthday,
    question: data.question,
    answer: data.answer
  }
    try {
    setLoading(true);

    // 1️⃣ Registrar usuario
    await RegistrarUsuario(userData);
    notify("success", "Registro exitoso! Ahora puedes iniciar con tus credenciales...");
    navigate("/"); // redirige a la ruta "/"

    } catch (error) {
    notify("error", "Error durante registro: " + error.message);
    } finally {
    setLoading(false);
    }

}

  return (
        <div className="container" style={{paddingTop: "1%"}}>
            <div className="row flex-lg-row-reverse align-items-center g-5 py-5 background-mobile container-base" style={{ backgroundImage: `url(${registroimg})`, backgroundSize: "50%" }}>
                <div className="col-lg-6" style={{alignSelf: "flex-start"}}>
                    <div className="row">
                        <div className="col-md-12 stats-div">
                            <h1 className="display-2 text-warning" style={{fontFamily: "Saintfont", letterSpacing: "2px", textAlign: "justify"}}>Valiente Guerrero!!...</h1>                
                            <p className="lead" style={{textAlign: "justify"}}>El camino de los Caballeros del Zodiaco te llama. En tus manos está el poder de forjar tu destino, enfrentando desafíos que te harán crecer y fortalecerte. Con cada batalla, con cada entrenamiento, descubrirás el potencial que reside en tu corazón. Únete a nosotros, eleva tu espíritu y haz historia en el universo. <strong style={{fontStyle: "italic"}}>¡El cosmos aguarda a aquellos que osan soñar y luchar por un ideal superior!"</strong></p><br></br>
                            <form className="cmxform" id="signupForm" name="signupForm" encType="multipart/form-data" onSubmit={handleSubmit(handleRegister)}>
                                <fieldset>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="form-group">                                                                                        
                                                    <label className="login-label" htmlFor="name">Nombre de Usuario</label>
                                                    <input className={`form-control  login-input ${errors.name ? "input-required" : ""}`} name="name" type="text" autoComplete="off"  {...register("name", { required: "El nombre de usuario es obligatorio." })}/>
                                                     {errors.name && <p className="p-required">{errors.name.message}</p>}
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label className="login-label" htmlFor="email">Email</label>
                                                <input className={`form-control  login-input ${errors.email ? "input-required" : ""}`} name="email" type="email" autoComplete="off" {...register("email", { required: "El email es obligatorio." })}/>
                                                {errors.email && <p className="p-required">{errors.email.message}</p>}
                                            </div>
                                        </div>        
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label className="login-label" htmlFor="password">Password</label>
                                                <input id="newpassword" className={`form-control  login-input ${errors.newpassword ? "input-required" : ""}`} type="password" autoComplete="off" {...register("newpassword", { required: "La contraseña es obligatoria." })}/>
                                                {errors.newpassword && <p className="p-required">{errors.newpassword.message}</p>}
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label className="login-label" htmlFor="confirm_password">Confirm password</label>
                                                <input id="confirm_password" className={`form-control  login-input ${errors.confirm_password ? "input-required" : ""}`} type="password" autoComplete="off" {...register("confirm_password", { required: "La confirmación de la contraseña es obligatoria." })}/>
                                                {errors.confirm_password && <p className="p-required">{errors.confirm_password.message}</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label className="login-label" htmlFor="birthday">Nacimiento</label>
                                                <input id="birthday" type="date" className={`form-control login-input ${errors.birthday ? "input-required" : ""}`} autoComplete="off" {...register("birthday", { required: "La fecha de nacimiento es obligatoria." })}/>
                                                {errors.birthday && <p className="p-required">{errors.birthday.message}</p>}
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label className="login-label" htmlFor="question">Pregunta de Seguridad</label>
                                                <select className={`form-control login-input ${errors.question ? "select-required" : ""}`} id="question" {...register("question", { required: "Debes elegir una pregunta de seguridad." })}>
                                                    <option value="">Selecciona una pregunta</option>
                                                    <option value="¿Cuál es el Caballero del zodiaco Preferido?">Caballero del zodiaco Preferido</option>
                                                    <option value="¿Cuál es la Armadura del zodiaco que mas te gusta?">¿Cuál es la Armadura del zodiaco que mas te gusta?</option>
                                                    <option value="¿Cual es la constelación que te rige?">¿Cuál es la constelación que te rige?</option>
                                                </select>
                                                {errors.question && <p className="p-required">{errors.question.message}</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="form-group">
                                                <label className="login-label" htmlFor="answer">Respuesta</label>
                                                <input type="text"  id="answer" className={`form-control login-input ${errors.answer ? "input-required" : ""}`} {...register("answer", { required: "La respuesta es obligatoria." })}/>
                                                {errors.answer && <p className="p-required">{errors.answer.message}</p>}
                                            </div>
                                        </div>
                                    </div>
                                   <br></br>
                                    <center><input name="createAccountBtn" id="createAccountBtn" className="btn btn-warning me-2" type="submit" value="Registrar" disabled={loading}/></center><br></br>
                                </fieldset>
                            </form>
                        </div>
                    </div><br></br>
                </div>
            </div>
        </div>
  );
}

export default RegisterPage;
