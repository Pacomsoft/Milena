import { API_URL } from "../config";
import { notify } from "../components/Notification";

export async function RegistrarUsuario(userData){
    const res = await fetch(`${API_URL}/accounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            'correo': userData.email,
            'username': userData.username,
            'nacimiento': userData.birthday,
            'comentarios': "",
            'pregunta': userData.question,
            'respuesta': userData.answer,
            'contrasena': userData.password
        })
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Registration failed");
        

    }

    return res.json();
}

export async function checkPassword(newpassword, confirm_password){
    if (newpassword !== confirm_password) {
        notify("error", "Las contraseñas no coinciden");
        return false;
    }
    return true;
}

