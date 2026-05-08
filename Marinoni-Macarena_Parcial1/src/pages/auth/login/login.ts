import type { IUser } from "../../../types/IUser";
import type { Rol } from "../../../types/Rol";
import { navigate } from "../../../utils/navigate";
// IMPORTAMOS EL SERVICIO
import { getUsers, saveLoggedUser } from "../../../utils/localStorage";

const form = document.getElementById("login-form") as HTMLFormElement;
const inputEmail = document.getElementById("email") as HTMLInputElement;
const inputPassword = document.getElementById("password") as HTMLInputElement;

form?.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault();

    const valueEmail = inputEmail.value;
    const valuePassword = inputPassword.value;

    // USAMOS EL SERVICIO para traer la lista de usuarios registrados
    const usuarios = getUsers(); 

    // Verificamos credenciales en el array de usuarios del LocalStorage
    const usuarioValidado = usuarios.find(u => u.email === valueEmail && u.password === valuePassword);

    if (usuarioValidado) {
        // Creamos el objeto del usuario que acaba de loguearse
        const user: IUser = {
            nombre: usuarioValidado.nombre, // Mantenemos el nombre si existe
            email: valueEmail,
            role: usuarioValidado.role as Rol, 
            password: valuePassword, // Mantenemos la estructura de tu interfaz
            loggedIn: true
        };

        // Guardamos el usuario en 'loggedUser' para que la app sepa quién entró
        saveLoggedUser(user);

        alert(`¡Bienvenido/a ${usuarioValidado.nombre || ''}!`);

        // Redirección según el ROL
        if (user.role === "admin") {
            navigate("/src/pages/admin/home/index.html");
        } else {
            navigate("/");
        }
    } else {
        alert("Usuario o contraseña incorrectos.");
    }
});