/**
 * F4.1 y F4.2: Valida la sesión y los permisos de rol.
 * @param rolRequerido 'ADMIN' o 'USUARIO'. Si no se pasa, solo verifica que esté logueado.
 */
export const validarSesion = (rolRequerido?: string) => {
    const userStr = localStorage.getItem('user');

    // 1. Si no hay sesión, patada al login
    if (!userStr) {
        window.location.href = '/src/pages/auth/login/index.html';
        return null;
    }

    const usuario = JSON.parse(userStr);

    // 2. Si se requiere un rol específico y no coincide, redirigir
    if (rolRequerido && usuario.rol !== rolRequerido) {
        alert("No tienes permisos para acceder a esta área.");
        
        // Redirección inteligente según su rol real
        if (usuario.rol === 'ADMIN') {
            window.location.href = '/src/pages/admin/home/index.html';
        } else {
            window.location.href = '/src/pages/store/home/index.html';
        }
        return null;
    }

    return usuario; // Retorna el usuario si todo está bien
};

export const cerrarSesion = () => {
    localStorage.removeItem('user');
    window.location.href = '/src/pages/auth/login/index.html';
};