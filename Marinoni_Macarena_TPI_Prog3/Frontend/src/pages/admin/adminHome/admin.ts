import { validarSesion, cerrarSesion } from "../../../utils/authGuard";
import { getPedidos, getUsuarios } from "../../../services/dataService";

// Validamos que solo entren ADMINS
validarSesion('ADMIN');

const btnLogout = document.getElementById("btn-logout");
if (btnLogout) {
    btnLogout.addEventListener("click", cerrarSesion);
}

const cargarDashboard = async () => {
    try {
        const pedidos = await getPedidos();
        const usuarios = await getUsuarios();

        // 1. Cálculos para las Tarjetas Superiores
        let ventasTotales = 0;
        let pedidosCompletados = 0;
        let pedidosPendientes = 0;

        pedidos.forEach(p => {
            if (p.estado === 'ENTREGADO' || p.estado === 'CONFIRMADO' || p.estado === 'TERMINADO') {
                ventasTotales += (p.total || 0);
                pedidosCompletados++;
            }
            if (p.estado === 'PENDIENTE' || p.estado === 'EN_PREPARACION') {
                pedidosPendientes++;
            }
        });

        // Contamos los usuarios que son clientes
        const clientesTotales = usuarios.filter(u => u.rol !== 'ADMIN').length;

        // Inyectamos los números en el HTML
        document.getElementById("total-ventas")!.innerText = `$${ventasTotales.toLocaleString('es-AR')}`;
        document.getElementById("total-pedidos")!.innerText = pedidosCompletados.toString();
        document.getElementById("total-pendientes")!.innerText = pedidosPendientes.toString();
        document.getElementById("total-clientes")!.innerText = clientesTotales.toString();

        // 2. Tabla de Pedidos Recientes (Los últimos 5)
        const recentBody = document.getElementById("recent-orders-body");
        
        // Ordenamos por fecha (más nuevos primero)
        const pedidosOrdenados = [...pedidos].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        const ultimos5 = pedidosOrdenados.slice(0, 5);

        if (ultimos5.length === 0) {
            recentBody!.innerHTML = `<tr><td colspan="5" style="text-align: center;">No hay pedidos registrados.</td></tr>`;
            return;
        }

        recentBody!.innerHTML = ultimos5.map(p => {
            // Buscamos el nombre del cliente
            const cliente = usuarios.find(u => Number(u.id) === Number(p.idUsuario));
            const nombreCliente = cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Desconocido';
            
            // Asignamos la clase del badge según el estado
            let badgeClass = 'badge-pendiente';
            if (p.estado === 'ENTREGADO' || p.estado === 'TERMINADO') badgeClass = 'badge-entregado';
            else if (p.estado === 'ENVIADO') badgeClass = 'badge-enviado';
            else if (p.estado === 'EN_PREPARACION') badgeClass = 'badge-preparacion';

            return `
                <tr>
                    <td><strong>#ORD-${p.id}</strong></td>
                    <td>${nombreCliente}</td>
                    <td>${p.fecha || 'N/A'}</td>
                    <td><strong>$${p.total?.toLocaleString('es-AR')}</strong></td>
                    <td><span class="badge ${badgeClass}">${p.estado}</span></td>
                </tr>
            `;
        }).join('');

    } catch (error) {
        console.error("Error al cargar el dashboard:", error);
    }
};

cargarDashboard();