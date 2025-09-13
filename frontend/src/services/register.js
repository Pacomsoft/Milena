import { API_URL } from "../config";
import { notify } from "../components/Notification";

export async function RegistrarUsuario(userData){
    const res = await fetch(`${API_URL}/accounts/accounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ac_email: userData.email,
            ac_username: userData.username,
            ac_birthday: userData.birthday,
            ac_comments: "",
            ac_question_security: userData.question,
            ac_answer_sec: userData.answer,
            ac_password: userData.password
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

