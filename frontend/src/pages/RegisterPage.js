import React from "react";
import registroimg from '../assets/images/register.png';
import { register, checkPassword} from "../services/register";
import { notify } from "../components/Notification";

async function handleRegister(e){
  e.preventDefault();
  const userData = {
    username: e.target.name.value,
    email: e.target.email.value,
    password: e.target.newpassword.value,
    confirm_password: e.target.confirm_password.value,
    birthday: e.target.birthday.value,
    question: e.target.question.value,
    answer: e.target.answer.value
  }
  try{
    //await register(userData);
    
    
    if (await checkPassword(userData.password, userData.confirm_password))
    {
        await register(userData);
        notify("success", "Registro exitoso! Iniciando Sesión...");
    }
    
  } 
  catch (error) {
    notify("error", "Ha ocurrido un error durante el registro: " + error);
  }

}
function RegisterPage() {


  return (
        <div className="container" style={{paddingTop: "1%"}}>
            <div className="row flex-lg-row-reverse align-items-center g-5 py-5 background-mobile container-base" style={{ backgroundImage: `url(${registroimg})`, backgroundSize: "50%" }}>
                <div className="col-lg-6" style={{alignSelf: "flex-start"}}>
                    <div className="row">
                        <div className="col-md-12 stats-div">
                            <h1 className="display-2 text-warning" style={{fontFamily: "Saintfont", letterSpacing: "2px", textAlign: "justify"}}>Valiente Guerrero!!...</h1>                
                            <p className="lead" style={{textAlign: "justify"}}>El camino de los Caballeros del Zodiaco te llama. En tus manos está el poder de forjar tu destino, enfrentando desafíos que te harán crecer y fortalecerte. Con cada batalla, con cada entrenamiento, descubrirás el potencial que reside en tu corazón. Únete a nosotros, eleva tu espíritu y haz historia en el universo. <strong style={{fontStyle: "italic"}}>¡El cosmos aguarda a aquellos que osan soñar y luchar por un ideal superior!"</strong></p><br></br>
                            <form className="cmxform" id="signupForm" name="signupForm" encType="multipart/form-data" onSubmit={handleRegister}>
                                <fieldset>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="form-group">                                                                                        
                                                    <label className="login-label" htmlFor="name">Nombre de Usuario</label>
                                                    <input id="name" className="form-control  login-input" name="name" type="text" autoComplete="off"/>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label className="login-label" htmlFor="email">Email</label>
                                                <input id="email" className="form-control  login-input" name="email" type="email" autoComplete="off"/>
                                            </div>
                                        </div>        
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label className="login-label" htmlFor="password">Password</label>
                                                <input id="newpassword" className="form-control  login-input" name="newpassword" type="password" autoComplete="off"/>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label className="login-label" htmlFor="confirm_password">Confirm password</label>
                                                <input id="confirm_password" className="form-control  login-input" name="confirm_password" type="password" autoComplete="off"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label className="login-label" htmlFor="birthday">Nacimiento</label>
                                                <input id="birthday" name="birthday" type="date" className="form-control login-input" autoComplete="off"/>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label className="login-label" htmlFor="question">Pregunta de Seguridad</label>
                                                <select className="form-control login-input" name="question" id="question">
                                                    <option value="">Selecciona una pregunta</option>
                                                    <option value="¿Cuál es el Caballero del zodiaco Preferido?">Caballero del zodiaco Preferido</option>
                                                    <option value="¿Cuál es la Armadura del zodiaco que mas te gusta?">¿Cuál es la Armadura del zodiaco que mas te gusta?</option>
                                                    <option value="¿Cual es la constelación que te rige?">¿Cuál es la constelación que te rige?</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="form-group">
                                                <label className="login-label" htmlFor="answer">Respuesta</label>
                                                <input type="text"  id="answer" name="answer" className="form-control login-input"/>

                                            </div>
                                        </div>
                                    </div>
                                   <br></br>
                                    <center><input name="createAccountBtn" id="createAccountBtn" className="btn btn-warning me-2" type="submit" value="Comenzar"/></center><br></br>
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
