import { validarSesion } from "../../../utils/authGuard";
import { getPedidos } from "../../../services/dataService";

// Obtenemos el usuario logueado de forma segura
const usuarioLogueado = validarSesion('CLIENT');

const ordersContainer = document.getElementById("my-orders-list") as HTMLElement;

const renderizarMisPedidos = async () => {
    if (!usuarioLogueado) return;

    ordersContainer.innerHTML = "<p>Buscando tus pedidos...</p>";

    try {
        const todosLosPedidos = await getPedidos();
        
        // EL FILTRO MÁGICO: Solo dejamos los pedidos que coincidan con mi ID
        const misPedidos = todosLosPedidos.filter((p: any) => Number(p.idUsuario) === Number(usuarioLogueado.id));

        if (misPedidos.length === 0) {
            ordersContainer.innerHTML = `
                <div style="text-align:center; padding: 40px; background:#f8f9fa; border-radius:8px;">
                    <p style="color:#666; margin-bottom:15px;">Aún no tienes pedidos registrados.</p>
                    <a href="/src/pages/store/home/index.html" class="btn-primary" style="text-decoration:none;">Ir a comprar</a>
                </div>
            `;
            return;
        }

        ordersContainer.innerHTML = misPedidos.map((p: any) => `
            <div style="background: white; border: 1px solid #eee; border-radius: 8px; padding: 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <div>
                    <h4 style="margin: 0 0 5px 0;">Pedido #ORD-${p.id}</h4>
                    <p style="margin: 0; font-size: 13px; color: #666;">Fecha: ${p.fecha || 'N/A'} | Pago: ${p.formaPago}</p>
                    <p style="margin: 5px 0 0 0; color: var(--orange-primary); font-weight: bold;">
                        ${p.detalles ? p.detalles.length : 0} producto(s)
                    </p>
                </div>
                <div style="text-align: right;">
                    <span class="badge-warning" style="display:inline-block; margin-bottom: 5px;">${p.estado}</span>
                    <p style="margin: 0; font-size: 18px; font-weight: bold;">$${p.total?.toLocaleString('es-AR') || p.total}</p>
                </div>
            </div>
        `).join('');

    } catch (error) {
        ordersContainer.innerHTML = `<p style="color:red;">Error al cargar tus pedidos.</p>`;
    }
};

// Cierre de sesión
document.getElementById("link-logout")?.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("user");
    window.location.href = "/src/pages/auth/login/index.html";
});

// Inicializar
renderizarMisPedidos();