import { validarSesion } from "../../../utils/authGuard";
import { getCategorias, getProductos, getPedidos } from "../../../services/dataService";

validarSesion('ADMIN');

const renderizarDashboard = async () => {
    const contentArea = document.getElementById("admin-content");
    if (!contentArea) return;

    try {
        // 1. Fetch a todos los JSON (Cumpliendo regla F5.4)
        const categorias = await getCategorias();
        const productos = await getProductos();
        const pedidos = await getPedidos();

        // 2. Cálculos Client-Side
        const totalCategorias = categorias.filter(c => !c.eliminado).length;
        const totalProductos = productos.filter(p => !p.eliminado).length;
        const prodsDisponibles = productos.filter(p => !p.eliminado && p.disponible !== false).length;
        const prodsInactivos = totalProductos - prodsDisponibles;
        const totalPedidos = pedidos.length;

        // Agrupamos los pedidos por estado
        const pedidosPorEstado = pedidos.reduce((acc: any, p: any) => {
            acc[p.estado] = (acc[p.estado] || 0) + 1;
            return acc;
        }, {});

        // 3. Renderizamos las 4 Tarjetas y el Panel de Resumen
        contentArea.innerHTML = `
            <div class="dashboard-grid">
                <div class="dash-card bg-purple">
                    <h3>Categorías</h3>
                    <p style="font-size: 32px; font-weight: bold; margin: 10px 0;">${totalCategorias}</p>
                    <button onclick="window.location.href='/src/pages/admin/categories/index.html'" class="nav-btn-dash">Gestionar</button>
                </div>
                <div class="dash-card bg-pink">
                    <h3>Productos</h3>
                    <p style="font-size: 32px; font-weight: bold; margin: 10px 0;">${totalProductos}</p>
                    <button onclick="window.location.href='/src/pages/admin/products/index.html'" class="nav-btn-dash">Gestionar</button>
                </div>
                <div class="dash-card bg-cyan">
                    <h3>Pedidos</h3>
                    <p style="font-size: 32px; font-weight: bold; margin: 10px 0;">${totalPedidos}</p>
                    <button onclick="window.location.href='/src/pages/admin/orders/index.html'" class="nav-btn-dash">Gestionar</button>
                </div>
                <div class="dash-card bg-green">
                    <h3>Disponibles</h3>
                    <p style="font-size: 32px; font-weight: bold; margin: 10px 0;">${prodsDisponibles}</p>
                    <p style="font-size: 13px; margin-top:5px; font-weight:normal;">Productos listos para venta</p>
                </div>
            </div>

            <h3 style="margin-top: 40px; border-bottom: 2px solid #eee; padding-bottom: 10px;">📊 Panel de Resumen</h3>
            
            <div style="display: flex; gap: 20px; margin-top: 20px; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 250px; background: white; padding: 20px; border-radius: 8px; border: 1px solid #eee; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                    <h4 style="margin-top: 0; color: #666; font-size: 18px;">Inventario</h4>
                    <p style="margin: 10px 0; font-size: 15px;"><strong>Categorías Activas:</strong> <span style="float:right;">${totalCategorias}</span></p>
                    <p style="margin: 10px 0; font-size: 15px;"><strong>Productos Activos:</strong> <span style="float:right; color: #2ecc71; font-weight: bold;">${prodsDisponibles}</span></p>
                    <p style="margin: 10px 0; font-size: 15px;"><strong>Productos Inactivos:</strong> <span style="float:right; color: #e74c3c; font-weight: bold;">${prodsInactivos}</span></p>
                </div>
                
                <div style="flex: 1; min-width: 250px; background: white; padding: 20px; border-radius: 8px; border: 1px solid #eee; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                    <h4 style="margin-top: 0; color: #666; font-size: 18px;">Pedidos por Estado</h4>
                    <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 15px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="background: #f39c12; color: white; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">PENDIENTES</span>
                            <strong>${pedidosPorEstado['PENDIENTE'] || 0}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="background: #3498db; color: white; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">EN PREPARACIÓN</span>
                            <strong>${pedidosPorEstado['EN_PREPARACION'] || 0}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="background: #9b59b6; color: white; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">ENVIADOS</span>
                            <strong>${pedidosPorEstado['ENVIADO'] || 0}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="background: #2ecc71; color: white; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">ENTREGADOS</span>
                            <strong>${pedidosPorEstado['ENTREGADO'] || 0}</strong>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        contentArea.innerHTML = `<p style="color:red;">Error al cargar el dashboard.</p>`;
    }
};

document.getElementById("btn-logout")?.addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href = "/src/pages/auth/login/index.html";
});

renderizarDashboard();