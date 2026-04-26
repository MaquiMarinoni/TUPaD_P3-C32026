/**
 * RECORDA: Esta función centraliza la navegación.
 * Al usar una función, si mañana cambia la estructura de carpetas,
 * solo corregimos acá y no en 20 archivos distintos.
 */
export const navigate = (path: string) => {
    window.location.href = path;
};