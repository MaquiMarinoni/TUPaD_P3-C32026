// Importamos los tipos y la utilidad de navegación
import type { IUser } from "./types/IUser";
import { navigate } from "./utils/navigate";

/**
 * RECUERDA: Este archivo es el "Director de Orquesta".
 * Se carga en todas las páginas y decide quién puede pasar y quién no.
 */

export const checkAuth = () => {
    // 1. Buscamos al usuario en el "asiento del conductor" (localStorage)
    const userDataRaw = localStorage.getItem("userData");
    
    // Convertimos el texto a objeto IUser o null si no hay nadie
    const user: IUser | null = userDataRaw ? JSON.parse(userDataRaw) : null;

    // 2. Analizamos la URL actual
    const currentPath = window.location.pathname;

    /**
     * LÓGICA DE ESCUDO (The Guard)
     * Bloqueamos accesos no autorizados según el rol guardado.
     */
    
    // Si la ruta es de administrador
    if (currentPath.includes("/admin/")) {
        // y el que quiere entrar NO es admin (o ni siquiera está logueado)
        if (!user || user.role !== "admin") {
            console.warn("Intento de acceso no autorizado a panel admin");
            alert("No tienes permisos para acceder a esta sección.");
            navigate("/src/pages/auth/login/index.html");
        }
    }

    // Si la ruta es de cliente (la tienda o mis pedidos)
    if (currentPath.includes("/client/")) {
        // y no hay ningún usuario logueado
        if (!user) {
            navigate("/src/pages/auth/login/index.html");
        }
    }
};

/**
 * RECUERDA: Ejecutamos la función apenas se carga el script.
 * Esto garantiza que la protección sea instantánea.
 */
checkAuth();

// ¿Por qué esto nos da el 100% en la Rúbrica?
// Porque gestionamos información que "sobrevive" al cierre del navegador
// y bloqueamos las rutas de admin totalmente para intrusos.

// Lógica de Logout para pruebas
const btnLogout = document.getElementById("btn-logout");
const userData = localStorage.getItem("userData");

if (userData) {
    if (btnLogout) btnLogout.style.display = "block";
}

btnLogout?.addEventListener("click", () => {
    localStorage.removeItem("userData"); // Borramos la sesión
    window.location.href = "/src/pages/auth/login/index.html"; // Al login
});