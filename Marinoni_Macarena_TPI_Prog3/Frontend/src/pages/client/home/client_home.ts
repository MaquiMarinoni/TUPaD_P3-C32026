import { getPedidos } from "../../../services/dataService";
import { getLoggedUser } from "../../../utils/localStorage";

const contenedorPedidos = document.getElementById("lista-pedidos");
const btnLogout = document.getElementById("btn-logout");

const init = async () => {
    // 1. Verificación de seguridad
    const user = getLoggedUser();
//    // Opción: Redirigir según el rol o simplemente enviar al dashboard
//    if (user?.role === 'admin') {
//        window.location.href = "/src/pages/admin/home/index.html";
//    } else {
//        // En lugar de ir al inicio, lo enviamos directo a Mis Pedidos
//        window.location.href = "/src/pages/client/home/index.html";
//}
    if (!user || !user.id) {
        window.location.href = "/src/pages/auth/login/index.html";
        return;
    }

    // 2. Cargar datos
    const pedidos = await getPedidos();
    
    // 3. Filtrar los pedidos que corresponden a este usuario
    const misPedidos = pedidos.filter(p => p.idUsuario === user.id);
    
    renderizarPedidos(misPedidos);
};

const renderizarPedidos = (pedidos: any[]) => {
    if (!contenedorPedidos) return;

    if (pedidos.length === 0) {
        contenedorPedidos.innerHTML = "<p>No tienes pedidos realizados aún.</p>";
        return;
    }

    // 4. Construcción del HTML de cada pedido
    contenedorPedidos.innerHTML = pedidos.map(p => `
        <div class="card order-card">
            <h3>Pedido #${p.id}</h3>
            <p>Fecha: ${p.fecha}</p>
            <p>Estado: <strong>${p.estado}</strong></p>
            <p>Total: $${p.total.toLocaleString('es-AR', {minimumFractionDigits: 2})}</p>
            <div class="detalles-pedido">
                <small>Detalles: ${p.detalles.length} producto(s)</small>
            </div>
        </div>
    `).join('');
};

// Lógica básica de Logout
btnLogout?.addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href = "/";
});

init();