import type { IUser } from "../../../types/IUser";
import type { Rol } from "../../../types/Rol";
import { navigate } from "../../../utils/navigate";

/**
 * SELECCIÓN DE ELEMENTOS
 * Usamos 'as' (Type Assertion) para decirle a TS exactamente qué tipo de elemento es.
 */
const form = document.getElementById("form") as HTMLFormElement;
const inputEmail = document.getElementById("email") as HTMLInputElement;
const inputPassword = document.getElementById("password") as HTMLInputElement;
const selectRol = document.getElementById("rol") as HTMLSelectElement; // Nuevo select para el rol

/**
 * LÓGICA DE LOGIN ADAPTADA
 */
form.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault();

    const valueEmail = inputEmail.value;
    const valuePassword = inputPassword.value;
    const valueRol = selectRol.value as Rol;
    // 1. Buscamos en nuestra "Base de Datos" (LocalStorage)
    const dataLow = localStorage.getItem('users');
    const usuarios: any[] = dataLow ? JSON.parse(dataLow) : [];

    // 2. Verificamos credenciales reales
    const usuarioValidado = usuarios.find(u => u.email === valueEmail && u.password === valuePassword && u.rol === valueRol);

    if (usuarioValidado) {
        // 3. Si existe, creamos el objeto de sesión siguiendo la interfaz de la cátedra
        const user: IUser = {
            email: valueEmail,
            role: usuarioValidado.rol as Rol, // Usamos el rol que viene de la base de datos
            loggedIn: true,
        };

        // 4. Guardamos la sesión en LocalStorage
        localStorage.setItem("userData", JSON.stringify(user));

        // 5. Redirección usando la función 'navigate' de la cátedra
        if (user.role === "admin") {
            navigate("/src/pages/admin/home/home.html");
        } else {
            navigate("/src/pages/client/home/home.html");
        }
    } else {
        alert("Usuario o contraseña incorrectos. ¿Ya te registraste?");
    }
});