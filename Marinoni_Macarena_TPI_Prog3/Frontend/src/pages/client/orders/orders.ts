import { validarSesion } from "../../../utils/authGuard";
import { getPedidos, getProductos } from "../../../services/dataService";

const usuarioLogueado = validarSesion('CLIENT');

const ordersContainer = document.getElementById("my-orders-list") as HTMLElement;
const modal = document.getElementById("order-modal") as HTMLElement;
const modalBody = document.getElementById("modal-body") as HTMLElement;
const modalTitle = document.getElementById("modal-title") as HTMLElement;

// Función auxiliar para colorear los badges según el estado
const getColorPorEstado = (estado: string) => {
    switch(estado) {
        case 'PENDIENTE': return '#f39c12'; // Naranja
        case 'EN_PREPARACION': return '#3498db'; // Azul
        case 'ENVIADO': return '#9b59b6'; // Morado
        case 'ENTREGADO': return '#2ecc71'; // Verde
        default: return '#95a5a6'; // Gris
    }
};

const renderizarMisPedidos = async () => {
    if (!usuarioLogueado) return;

    try {
        const todosLosPedidos = await getPedidos();
        const todosLosProductos = await getProductos();
        
        // Filtramos solo los del cliente logueado
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

        ordersContainer.innerHTML = misPedidos.map((p: any) => {
            // F5.3: Resumen de los primeros 3 productos
            const detalles = p.detalles || [];
            const primerosTres = detalles.slice(0, 3).map((det: any) => {
                const prod = todosLosProductos.find(pr => pr.id === det.idProducto);
                return prod ? `${det.cantidad}x ${prod.nombre}` : `Producto #${det.idProducto}`;
            }).join(', ');
            
            const textoExtra = detalles.length > 3 ? ` ...y ${detalles.length - 3} más.` : '.';
            const resumenFinal = primerosTres ? (primerosTres + textoExtra) : 'Sin productos detallados';
            const badgeColor = getColorPorEstado(p.estado);

            return `
            <div class="pedido-card" data-id="${p.id}" style="background: white; border: 1px solid #eee; border-radius: 8px; padding: 20px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: transform 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <div style="flex: 2;">
                    <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 8px;">
                        <h4 style="margin: 0;">Pedido #ORD-${p.id}</h4>
                        <span style="background: ${badgeColor}; color: white; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;">
                            ${p.estado}
                        </span>
                    </div>
                    <p style="margin: 0; font-size: 12px; color: #888;">📅 ${p.fecha || 'N/A'}</p>
                    <p style="margin: 8px 0 0 0; font-size: 13px; color: #555;">🛒 <strong>Resumen:</strong> ${resumenFinal}</p>
                </div>
                <div style="flex: 1; text-align: right;">
                    <p style="margin: 0; font-size: 20px; font-weight: bold; color: var(--orange-primary);">
                        $${p.total?.toLocaleString('es-AR') || p.total}
                    </p>
                    <p style="margin: 5px 0 0 0; font-size: 12px; color: var(--orange-primary); font-weight: 500;">
                        Ver Detalle &rarr;
                    </p>
                </div>
            </div>
            `;
        }).join('');

        // F5.3: Listener para abrir el modal al hacer click en la tarjeta
        document.querySelectorAll(".pedido-card").forEach(card => {
            card.addEventListener("click", () => {
                const id = Number(card.getAttribute("data-id"));
                abrirModalPedido(id, todosLosPedidos, todosLosProductos);
            });
        });

    } catch (error) {
        ordersContainer.innerHTML = `<p style="color:red;">Error al cargar tus pedidos.</p>`;
    }
};

const abrirModalPedido = (idPedido: number, todosLosPedidos: any[], todosLosProductos: any[]) => {
    const pedido = todosLosPedidos.find((p: any) => p.id === idPedido);
    if (!pedido) return;

    modalTitle.innerText = `Detalle del Pedido #ORD-${pedido.id}`;
    
    const badgeColor = getColorPorEstado(pedido.estado);
    const envioConstante = 2500; // Constante declarada para esta iteración
    const subtotal = pedido.total - envioConstante; 

    // Lista de productos cruzada con la base de datos
    const listaProductosHTML = (pedido.detalles || []).map((det: any) => {
        const prod = todosLosProductos.find(pr => pr.id === det.idProducto);
        const nombre = prod ? prod.nombre : `Producto Desconocido (#${det.idProducto})`;
        const imagen = prod ? `<img src="/src/data/assets/${prod.imagen}" style="width: 40px; height: 40px; border-radius: 4px; object-fit: cover;" onerror="this.src='/src/data/assets/napo.jpg'">` : '';
        
        return `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding: 10px 0;">
            <div style="display: flex; align-items: center; gap: 15px;">
                ${imagen}
                <div>
                    <p style="margin:0; font-weight:bold;">${nombre}</p>
                    <p style="margin:0; font-size:12px; color:#666;">Cant: ${det.cantidad}</p>
                </div>
            </div>
            <strong style="color: #444;">$${det.subtotal?.toLocaleString('es-AR') || det.subtotal}</strong>
        </div>`;
    }).join('');

    modalBody.innerHTML = `
        <div style="display: flex; gap: 20px; margin-bottom: 20px;">
            <div style="flex: 1; background: #f8f9fa; padding: 15px; border-radius: 8px; font-size: 13px;">
                <p style="margin: 0 0 5px 0; color: #888;">Estado Actual</p>
                <span style="background: ${badgeColor}; color: white; padding: 5px 10px; border-radius: 12px; font-weight: bold;">
                    ${pedido.estado}
                </span>
            </div>
            <div style="flex: 1; background: #f8f9fa; padding: 15px; border-radius: 8px; font-size: 13px;">
                <p style="margin: 0 0 5px 0; color: #888;">Información de Entrega</p>
                <p style="margin: 0; font-weight: bold;">Pago: ${pedido.formaPago}</p>
                <p style="margin: 5px 0 0 0; color: #555;">Fecha: ${pedido.fecha}</p>
            </div>
        </div>

        <h4 style="margin: 0 0 10px 0; border-bottom: 2px solid var(--orange-primary); padding-bottom: 5px; display: inline-block;">Productos</h4>
        <div style="max-height: 250px; overflow-y: auto; padding-right: 10px;">
            ${listaProductosHTML}
        </div>

        <div style="margin-top: 20px; padding-top: 15px; border-top: 2px dashed #ddd; text-align: right;">
            <p style="margin: 5px 0; color: #666;">Subtotal: $${subtotal.toLocaleString('es-AR')}</p>
            <p style="margin: 5px 0; color: #666;">Envío: $${envioConstante.toLocaleString('es-AR')}</p>
            <h3 style="margin: 10px 0 0 0; color: var(--orange-primary);">Total: $${pedido.total?.toLocaleString('es-AR') || pedido.total}</h3>
        </div>
    `;

    modal.style.display = "flex";
};

// Listeners para cerrar modal
const cerrarModal = () => modal.style.display = "none";
document.getElementById("close-modal")?.addEventListener("click", cerrarModal);
document.getElementById("close-modal-top")?.addEventListener("click", cerrarModal);

// Cierre de sesión
document.getElementById("link-logout")?.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("user");
    window.location.href = "/src/pages/auth/login/index.html";
});

// Inicializar
renderizarMisPedidos();