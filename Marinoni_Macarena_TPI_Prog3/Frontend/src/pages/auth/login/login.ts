import type { IUser } from "../../../types/IUser";
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

    const usuarioValidado = await autenticarUsuario(valueEmail, valuePassword);

    if (usuarioValidado) {
        const user: IUser = {
            id: usuarioValidado.id!,
            nombre: usuarioValidado.nombre || "",
            apellido: usuarioValidado.apellido || "",
            mail: usuarioValidado.mail || valueEmail,
            celular: usuarioValidado.celular || "",
            rol: usuarioValidado.rol || "CLIENT"
        };

        // LA SOLUCIÓN AL REBOTE: Guardamos estrictamente con la clave 'user'
        localStorage.setItem('user', JSON.stringify(user));

        alert(`¡Bienvenido/a ${user.nombre}!`);

        if (user.rol === "ADMIN") {
            window.location.href = "/src/pages/admin/adminHome/index.html";
        } else {
            window.location.href = "/src/pages/store/home/index.html";
        }
    } else {
        alert("Usuario o contraseña incorrectos.");
    }
});