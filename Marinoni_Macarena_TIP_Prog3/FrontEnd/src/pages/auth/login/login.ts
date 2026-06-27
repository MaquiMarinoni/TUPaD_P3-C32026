import type { IUser } from "../../../types/IUser";
import type { Rol } from "../../../types/Rol";
import { navigate } from "../../../utils/navigate";
import { saveLoggedUser } from "../../../utils/localStorage";
// IMPORTAMOS EL SERVICIO DE DATOS ACTUALIZADO
import { autenticarUsuario } from "../../../services/dataService";

const form = document.getElementById("login-form") as HTMLFormElement;
const inputEmail = document.getElementById("email") as HTMLInputElement;
const inputPassword = document.getElementById("password") as HTMLInputElement;

form?.addEventListener("submit", async (e: SubmitEvent) => {
    e.preventDefault();

    const valueEmail = inputEmail.value.trim();
    const valuePassword = inputPassword.value.trim();

    if (!valueEmail || !valuePassword) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // F4.1: Autenticamos consultando la lista real de usuarios obtenida por fetch
    const usuarioValidado = await autenticarUsuario(valueEmail, valuePassword);

    if (usuarioValidado) {
        // Creamos el objeto del usuario logueado mapeándolo a tu interfaz IUser
        // F4.1: Se guarda SIN la contraseña ("password" se pasa como un string vacío o se omite)
        const user: IUser = {
            id: usuarioValidado.id,
            nombre: usuarioValidado.nombre || usuarioValidado.mail.split('@')[0], // Fallback por si no viene el campo nombre
            email: valueEmail,
            role: (usuarioValidado.rol || usuarioValidado.role) as Rol, // Soporte si tu JSON usa 'rol' o 'role'
            password: "", // REGLA F4.1: No persistir contraseña en localStorage
            loggedIn: true
        };

        // Guardamos el usuario utilizando tu función utilitaria actual
        saveLoggedUser(user);

        alert(`¡Bienvenido/a ${user.nombre}!`);

        // F4.1 y F4.2: Redirección estricta según el ROL validado
        if (user.role.toLowerCase() === "admin") {
            navigate("/src/pages/admin/home/index.html");
        } else {
            navigate("/"); // Redirige a la tienda / Home público
        }
    } else {
        // Alerta de credenciales inválidas tal cual lo tenías implementado
        alert("Usuario o contraseña incorrectos.");
    }
});