import { getPedidos, getProductos } from "../../../services/dataService";
import { validarSesion, cerrarSesion } from "../../../utils/authGuard";

// Protegemos la ruta
validarSesion('ADMIN');

const contentArea = document.getElementById("admin-content") as HTMLElement;
const modal = document.getElementById("admin-modal") as HTMLElement;
const adminForm = document.getElementById("admin-form") as HTMLFormElement;
const modalTitle = document.getElementById("modal-title") as HTMLElement;
const fields = document.getElementById("modal-fields") as HTMLElement;

// Función auxiliar para normalizar arrays (la misma de tu código original)
const normalizarLista = (lista: any): any[] => {
    if (Array.isArray(lista)) return lista;
    if (lista && typeof lista === 'object') {
        if (Array.isArray(lista.data)) return lista.data;
        if (Array.isArray(lista.categorias)) return lista.categorias;
        if (Array.isArray(lista.content)) return lista.content;
        const arrayEncontrado = Object.values(lista).find(val => Array.isArray(val));
        if (arrayEncontrado) return arrayEncontrado as any[];
    }
    return [];
};

const renderizarPedidos = async () => {
    contentArea.innerHTML = "<p>Cargando pedidos...</p>";
    try {
        const res = await getPedidos();
        const peds = normalizarLista(res);

        contentArea.innerHTML = `
            <div class="view-header">
                <h2>Lista de Pedidos</h2>
            </div>
            <div class="pedidos-list">
                ${peds.map((p: any) => `
                    <div class="pedido-card" style="cursor: pointer;" data-id="${p.id}">
                        <div class="pedido-info">
                            <h4>Pedido #ORD-${p.id}</h4>
                            <p><strong>Usuario ID:</strong> ${p.idUsuario}</p>
                            <p style="font-size: 12px; margin-top: 5px;">Fecha: ${p.fecha || 'No registrada'}</p>
                            <p style="margin-top: 10px; color: #ff5722; font-weight: 500;">
                                ${p.detalles ? p.detalles.length : 0} producto(s)
                            </p>
                        </div>
                        <div style="display: flex; align-items: center;">
                            <span class="pedido-price">$${p.total?.toLocaleString('es-AR') || p.total}</span>
                            <span class="badge-warning">${p.estado}</span>
                        </div>
                    </div>
                `).join('')}
            </div>`;

        // Agregar listeners a las tarjetas para abrir el detalle
        document.querySelectorAll(".pedido-card").forEach(card => {
            card.addEventListener("click", () => {
                const id = Number(card.getAttribute("data-id"));
                abrirModalPedido(id);
            });
        });

    } catch (error: any) {
        contentArea.innerHTML = `<p style="color:red;">Error al cargar datos: ${error.message}</p>`;
    }
};

const abrirModalPedido = async (id: number) => {
    fields.innerHTML = "<p>Cargando detalles...</p>";
    modal.style.display = "flex";

    try {
        const resPedidos = await getPedidos();
        const peds = normalizarLista(resPedidos);
        const pedido = peds.find((p: any) => p.id === id);
        
        const resProds = await getProductos();
        const todosLosProductos = normalizarLista(resProds);

        if (!pedido) {
            fields.innerHTML = "<p>Error: No se encontró el pedido.</p>";
            return;
        }

        modalTitle.innerText = `Detalle del Pedido #ORD-${pedido.id}`;

        const listaProductosHTML = pedido.detalles ? pedido.detalles.map((det: any) => {
            const prodReal = todosLosProductos.find((pr: any) => pr.id === det.idProducto);
            const nombreProducto = prodReal ? prodReal.nombre : `Producto #${det.idProducto}`;
            return `
            <div style="display: flex; justify-content: space-between; font-size: 13px; padding-bottom: 5px;">
                <div><p style="margin:0; font-weight:bold;">${nombreProducto}</p><p style="margin:0; color:#666;">Cantidad: ${det.cantidad}</p></div>
                <strong style="color: var(--orange-primary);">$${det.subtotal?.toLocaleString('es-AR') || det.subtotal}</strong>
            </div>`;
        }).join('') : '<p>Sin detalles de productos.</p>';

        fields.innerHTML = `
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 13px;">
                <p><strong>Usuario ID:</strong> ${pedido.idUsuario}</p>
                <p><strong>Fecha de Compra:</strong> ${pedido.fecha || 'N/A'}</p>
                <p><strong>Forma de Pago:</strong> ${pedido.formaPago || 'N/A'}</p>
            </div>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                ${listaProductosHTML}
                <hr style="border: 0; border-top: 1px solid #ddd; margin: 15px 0;">
                <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; color: var(--orange-primary);"><span>Total:</span><span>$${pedido.total?.toLocaleString('es-AR') || pedido.total}</span></div>
            </div>
            <div class="form-group" style="flex-direction: row; align-items: center; gap: 10px;">
                <label style="margin:0;">Cambiar Estado:</label>
                <select name="estado" style="flex: 1;">
                    <option value="PENDIENTE" ${pedido.estado === 'PENDIENTE' ? 'selected' : ''}>PENDIENTE</option>
                    <option value="EN_PREPARACION" ${pedido.estado === 'EN_PREPARACION' ? 'selected' : ''}>EN PREPARACION</option>
                    <option value="ENVIADO" ${pedido.estado === 'ENVIADO' ? 'selected' : ''}>ENVIADO</option>
                    <option value="ENTREGADO" ${pedido.estado === 'ENTREGADO' ? 'selected' : ''}>ENTREGADO</option>
                </select>
            </div>
        `;
        adminForm.dataset.id = id.toString();
    } catch (err: any) {
        fields.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
    }
};

// Listeners Generales
document.getElementById("close-modal")?.addEventListener("click", () => modal.style.display = "none");
document.getElementById("btn-logout")?.addEventListener("click", () => cerrarSesion());

adminForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(adminForm));
    console.log(`Actualizando pedido ID: ${adminForm.dataset.id} al estado: ${data.estado}`);
    // A futuro: fetch() con PUT para actualizar en el backend real
    modal.style.display = "none";
    alert("Estado del pedido actualizado (Simulado)");
});

// Inicializar la vista
renderizarPedidos();