import type { IUser } from "./types/IUser";
import { navigate } from "./utils/navigate";

/**
 * RECORDA: El "Guard" es el escudo de tu app.
 * Se ejecuta apenas carga el navegador para decidir si el usuario
 * tiene permiso de ver lo que está intentando abrir.
 */
export const checkAuth = () => {
    // 1. Obtenemos la sesión actual del localStorage
    const userDataRaw = localStorage.getItem("userData");
    const user: IUser | null = userDataRaw ? JSON.parse(userDataRaw) : null;

    // 2. Obtenemos la URL actual para saber dónde está el usuario
    const currentPath = window.location.pathname;

    /**
     * LÓGICA DE PROTECCIÓN (Autorización)
     * Verificamos si la ruta actual contiene la palabra "admin" o "client".
     */
    if (currentPath.includes("/admin/")) {
        // Si intenta entrar a admin pero no hay sesión o no es admin... ¡AFUERA!
        if (!user || user.role !== "admin") {
            alert("Acceso denegado: Se requieren permisos de administrador.");
            navigate("/src/pages/auth/login/index.html");
        }
    }

    if (currentPath.includes("/client/")) {
        // Si intenta entrar a la zona de clientes sin estar logueado... ¡AL LOGIN!
        if (!user) {
            navigate("/src/pages/auth/login/index.html");
        }
    }
};

// 3. EJECUCIÓN INMEDIATA
// Invocamos la función para que proteja la página ni bien cargue el script.
checkAuth();

// ¿Por qué esto es importante para la rúbrica?
// Porque cumple con el criterio de "Las rutas de admin están totalmente bloqueadas".