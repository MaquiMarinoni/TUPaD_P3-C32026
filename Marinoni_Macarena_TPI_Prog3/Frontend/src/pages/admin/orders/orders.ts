import { validarSesion } from "../../../utils/authGuard";
import { getPedidos, getUsuarios, getProductos, updateEstadoPedido } from "../../../services/dataService";

validarSesion('ADMIN');

const ordersContainer = document.getElementById("admin-orders-list") as HTMLElement;
const filterSelect = document.getElementById("status-filter") as HTMLSelectElement;
const modal = document.getElementById("order-modal") as HTMLElement;
const modalBody = document.getElementById("modal-body") as HTMLElement;
const modalTitle = document.getElementById("modal-title") as HTMLElement;

let todosLosPedidos: any[] = [];
let todosLosUsuarios: any[] = [];
let todosLosProductos: any[] = [];

const getColorPorEstado = (estado: string) => {
    switch(estado) {
        case 'PENDIENTE': return '#f39c12'; 
        case 'EN_PREPARACION': return '#3498db';
        case 'ENVIADO': return '#9b59b6';
        case 'ENTREGADO': return '#2ecc71';
        default: return '#95a5a6';
    }
};

const cargarDatos = async () => {
    ordersContainer.innerHTML = "<p>Cargando datos del sistema...</p>";
    try {
        todosLosPedidos = await getPedidos();
        todosLosUsuarios = await getUsuarios();
        todosLosProductos = await getProductos();

        todosLosPedidos.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        
        // Volvemos a aplicar el filtro actual
        renderizarPedidos(filterSelect.value);
    } catch (error) {
        ordersContainer.innerHTML = `<p style="color:red;">Error al cargar los pedidos.</p>`;
    }
};

const renderizarPedidos = (filtroEstado: string) => {
    const pedidosFiltrados = filtroEstado === "ALL" 
        ? todosLosPedidos 
        : todosLosPedidos.filter(p => p.estado === filtroEstado);

    if (pedidosFiltrados.length === 0) {
        ordersContainer.innerHTML = `<div style="text-align:center; padding: 40px; background:white; border-radius:8px; border: 1px solid #eee;">
            <p style="color:#666; margin:0;">No hay pedidos que coincidan con este estado.</p>
        </div>`;
        return;
    }

    ordersContainer.innerHTML = pedidosFiltrados.map(p => {
        const cliente = todosLosUsuarios.find(u => Number(u.id) === Number(p.idUsuario));
        const nombreCliente = cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Cliente Desconocido';
        const badgeColor = getColorPorEstado(p.estado);
        const cantidadProductos = (p.detalles || []).reduce((sum: number, det: any) => sum + det.cantidad, 0);

        return `
        <div class="admin-pedido-card" data-id="${p.id}" style="background: white; border: 1px solid #eee; border-radius: 8px; padding: 20px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: transform 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
            <div style="flex: 2; display: grid; grid-template-columns: 1fr 2fr 1fr; gap: 15px; align-items: center;">
                <div>
                    <h4 style="margin: 0; color: var(--orange-primary);">#ORD-${p.id}</h4>
                    <span style="background: ${badgeColor}; color: white; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; display: inline-block; margin-top: 5px;">
                        ${p.estado}
                    </span>
                </div>
                <div>
                    <p style="margin: 0; font-weight: bold; font-size: 15px;">👤 ${nombreCliente}</p>
                    <p style="margin: 5px 0 0 0; font-size: 12px; color: #888;">📅 ${p.fecha || 'N/A'}</p>
                </div>
                <div>
                    <p style="margin: 0; font-size: 13px; color: #555;">📦 ${cantidadProductos} producto(s)</p>
                </div>
            </div>
            <div style="flex: 1; text-align: right; border-left: 1px solid #eee; padding-left: 15px;">
                <p style="margin: 0; font-size: 12px; color: #888;">Total Pedido</p>
                <p style="margin: 0; font-size: 20px; font-weight: bold; color: #333;">
                    $${p.total?.toLocaleString('es-AR') || p.total}
                </p>
            </div>
        </div>
        `;
    }).join('');

    document.querySelectorAll(".admin-pedido-card").forEach(card => {
        card.addEventListener("click", () => {
            const id = Number(card.getAttribute("data-id"));
            abrirModal(id);
        });
    });
};

const abrirModal = (idPedido: number) => {
    const pedido = todosLosPedidos.find(p => p.id === idPedido);
    if (!pedido) return;

    const cliente = todosLosUsuarios.find(u => Number(u.id) === Number(pedido.idUsuario));
    const nombreCliente = cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Cliente Desconocido';
    const emailCliente = cliente ? cliente.mail || (cliente as any).email : 'Sin email';
    
    modalTitle.innerText = `Detalle del Pedido #ORD-${pedido.id}`;
    
    const badgeColor = getColorPorEstado(pedido.estado);
    const envioConstante = 2500;
    const subtotal = pedido.total - envioConstante;

    const listaProductosHTML = (pedido.detalles || []).map((det: any) => {
        const prod = todosLosProductos.find(pr => pr.id === det.idProducto);
        const nombre = prod ? prod.nombre : `Producto #${det.idProducto}`;
        return `
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #eee;">
            <span style="font-size: 14px;">${det.cantidad}x ${nombre}</span>
            <strong style="color: #444; font-size: 14px;">$${det.subtotal?.toLocaleString('es-AR') || det.subtotal}</strong>
        </div>`;
    }).join('');

    // F6.3: Agregamos el selector de estado dinámico
    modalBody.innerHTML = `
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <p style="margin: 0;"><strong>Cliente:</strong> ${nombreCliente}</p>
                
                <div style="display: flex; align-items: center; gap: 10px;">
                    <label style="font-size: 12px; font-weight: bold;">Estado:</label>
                    <select id="modal-status-select" style="background: ${badgeColor}; color: white; padding: 5px; border-radius: 4px; border: none; font-weight: bold; outline: none; cursor: pointer;">
                        <option value="PENDIENTE" ${pedido.estado === 'PENDIENTE' ? 'selected' : ''} style="background: white; color: black;">PENDIENTE</option>
                        <option value="EN_PREPARACION" ${pedido.estado === 'EN_PREPARACION' ? 'selected' : ''} style="background: white; color: black;">EN PREPARACIÓN</option>
                        <option value="ENVIADO" ${pedido.estado === 'ENVIADO' ? 'selected' : ''} style="background: white; color: black;">ENVIADO</option>
                        <option value="ENTREGADO" ${pedido.estado === 'ENTREGADO' ? 'selected' : ''} style="background: white; color: black;">ENTREGADO</option>
                    </select>
                </div>

            </div>
            <p style="margin: 0; font-size: 13px; color: #666;"><strong>Email:</strong> ${emailCliente} | <strong>Pago:</strong> ${pedido.formaPago}</p>
            <p style="margin: 5px 0 0 0; font-size: 13px; color: #666;"><strong>Fecha:</strong> ${pedido.fecha}</p>
        </div>

        <h4 style="margin: 0 0 10px 0;">Artículos</h4>
        <div style="max-height: 200px; overflow-y: auto; background: white; border: 1px solid #eee; padding: 10px; border-radius: 6px;">
            ${listaProductosHTML}
        </div>

        <div style="margin-top: 15px; text-align: right;">
            <p style="margin: 5px 0; color: #666; font-size: 14px;">Subtotal: $${subtotal.toLocaleString('es-AR')}</p>
            <p style="margin: 5px 0; color: #666; font-size: 14px;">Envío: $${envioConstante.toLocaleString('es-AR')}</p>
            <h3 style="margin: 10px 0 0 0; color: var(--orange-primary);">Total Final: $${pedido.total?.toLocaleString('es-AR') || pedido.total}</h3>
        </div>
        
        <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee; display: flex; justify-content: flex-end;">
            <button type="button" id="btn-save-status" class="btn-success" style="padding: 8px 20px;">💾 Guardar Estado</button>
        </div>
    `;

    modal.style.display = "flex";

    // F6.3: Guardar estado
    document.getElementById("btn-save-status")?.addEventListener("click", async () => {
        const selectElement = document.getElementById("modal-status-select") as HTMLSelectElement;
        const nuevoEstado = selectElement.value;
        
        if (nuevoEstado !== pedido.estado) {
            await updateEstadoPedido(pedido.id, nuevoEstado);
            cerrarModal();
            await cargarDatos(); // Recarga la vista con el estado actualizado
        } else {
            cerrarModal(); // Si no cambió nada, solo cerramos
        }
    });

    // Cambiar color del select al cambiar de opción
    document.getElementById("modal-status-select")?.addEventListener("change", (e) => {
        const selectElement = e.target as HTMLSelectElement;
        selectElement.style.background = getColorPorEstado(selectElement.value);
    });
};

filterSelect.addEventListener("change", (e) => {
    const estado = (e.target as HTMLSelectElement).value;
    renderizarPedidos(estado);
});

const cerrarModal = () => modal.style.display = "none";
document.getElementById("close-modal")?.addEventListener("click", cerrarModal);
document.getElementById("close-modal-top")?.addEventListener("click", cerrarModal);

document.getElementById("btn-logout")?.addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href = "/src/pages/auth/login/index.html";
});

cargarDatos();