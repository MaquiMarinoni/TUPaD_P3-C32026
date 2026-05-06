import type { IUser } from "../../../types/IUser";
import type { Rol } from "../../../types/Rol";
import { navigate } from "../../../utils/navigate";
// IMPORTAMOS EL SERVICIO
import { getUsers, saveLoggedUser } from "../../../utils/localStorage";

const form = document.getElementById("form") as HTMLFormElement;
const inputEmail = document.getElementById("email") as HTMLInputElement;
const inputPassword = document.getElementById("password") as HTMLInputElement;

form.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault();

    const valueEmail = inputEmail.value;
    const valuePassword = inputPassword.value;

    // USAMOS EL SERVICIO
    const usuarios = getUsers(); 

    // Verificamos credenciales
    const usuarioValidado = usuarios.find(u => u.email === valueEmail && u.password === valuePassword);

    if (usuarioValidado) {
        const user: IUser = {
            email: valueEmail,
            role: usuarioValidado.role as Rol, // Asegúrate de que en 'users' se guarde como 'role'
            loggedIn: true,
        };

        // USAMOS EL SERVICIO
        saveLoggedUser(user);

        if (user.role === "admin") {
            navigate("/src/pages/admin/home/index.html");
        } else {
            navigate("/src/pages/client/home/index.html");
        }
    } else {
        alert("Usuario o contraseña incorrectos.");
    }
});