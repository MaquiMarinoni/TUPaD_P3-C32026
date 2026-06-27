import { getProductos, getCategorias, getPedidos } from "../../../services/dataService";
import { validarSesion, cerrarSesion } from "../../../utils/authGuard";

// --- F4.2: VALIDACIÓN DE ROL ---
// Protege la ruta: Solo ADMIN puede entrar. Si no cumple, es redirigido.
const usuarioLogueado = validarSesion('ADMIN');

// --- SELECTORES DEL DOM ---
const contentArea = document.getElementById("admin-content") as HTMLElement;
const titleHeader = document.getElementById("view-title") as HTMLElement;
const navButtons = document.querySelectorAll(".nav-btn");
const modal = document.getElementById("admin-modal") as HTMLElement;
const adminForm = document.getElementById("admin-form") as HTMLFormElement;

/** * Función auxiliar para normalizar las listas. 
 * Previene errores si el backend o los JSON envuelven los arrays dentro de un objeto.
 */
const normalizarLista = (lista: any): any[] => {
    if (Array.isArray(lista)) return lista;
    if (lista && typeof lista === 'object') {
        if (Array.isArray(lista.data)) return lista.data;
        if (Array.isArray(lista.categorias)) return lista.categorias;
        if (Array.isArray(lista.content)) return lista.content; // Compatibilidad para paginación futura
        const arrayEncontrado = Object.values(lista).find(val => Array.isArray(val));
        if (arrayEncontrado) return arrayEncontrado as any[];
    }
    return [];
};

// --- RENDERIZADO DINÁMICO DE VISTAS (SPA) ---
const cargarVista = async (view: string) => {
    // Ajustar encabezados y clases activas en la navegación lateral
    titleHeader.innerText = view === 'dashboard' ? 'Home Admin' : `Gestión de ${view.charAt(0).toUpperCase() + view.slice(1)}`;
    navButtons.forEach(btn => btn.classList.remove("active"));
    document.querySelector(`[data-view="${view}"]`)?.classList.add("active");

    contentArea.innerHTML = "<p>Cargando datos...</p>";

    try {
        if (view === 'dashboard') {
            contentArea.innerHTML = `
                <div class="dashboard-grid">
                    <div class="dash-card bg-purple">
                        <h3>Categorías</h3><p>📊</p><button data-view="categorias" class="nav-btn-dash">Gestionar</button>
                    </div>
                    <div class="dash-card bg-pink">
                        <h3>Productos</h3><p>🍔</p><button data-view="productos" class="nav-btn-dash">Gestionar</button>
                    </div>
                    <div class="dash-card bg-cyan">
                        <h3>Pedidos</h3><p>🛍️</p><button data-view="pedidos" class="nav-btn-dash">Gestionar</button>
                    </div>
                    <div class="dash-card bg-green">
                        <h3>Disponibles</h3><p>✅</p><p style="font-size: 12px; margin-top:5px; font-weight:normal;">Productos activos</p>
                    </div>
                </div>
            `;
            // Listener para los accesos rápidos de las tarjetas del dashboard
            document.querySelectorAll(".nav-btn-dash").forEach(btn => {
                btn.addEventListener("click", () => cargarVista(btn.getAttribute("data-view")!));
            });
        }
        else if (view === 'productos') {
            const res = await getProductos();
            const prods = normalizarLista(res);

            contentArea.innerHTML = `
                <div class="view-header">
                    <h2>Gestión de Productos</h2>
                    <button class="btn-success" data-action="new" data-tipo="producto">+ Nuevo Producto</button>
                </div>
                <div class="admin-table-container">
                    <table class="admin-table">
                        <thead><tr><th>ID</th><th>Imagen</th><th>Nombre</th><th>Descripción</th><th>Precio</th><th>Acciones</th></tr></thead>
                        <tbody>${prods.map((p: any) => `<tr>
                            <td>${p.id}</td>
                            <td><img src="/src/data/assets/${p.imagen || 'default.png'}" class="table-img" alt="${p.nombre}"></td>
                            <td><strong>${p.nombre}</strong></td>
                            <td><small>${p.descripcion || ''}</small></td>
                            <td>$${p.precio?.toLocaleString('es-AR') || p.precio}</td>
                            <td class="table-actions">
                                <button class="btn-edit" data-action="edit" data-id="${p.id}" data-tipo="producto">Editar</button>
                                <button class="btn-delete" data-action="delete" data-id="${p.id}" data-tipo="producto">Eliminar</button>
                            </td>
                        </tr>`).join('')}</tbody>
                    </table>
                </div>`;
        } 
        else if (view === 'categorias') {
            const res = await getCategorias();
            const cats = normalizarLista(res);

            contentArea.innerHTML = `
                <div class="view-header">
                    <h2>Gestión de Categorías</h2>
                    <button class="btn-success" data-action="new" data-tipo="categoria">+ Nueva Categoría</button>
                </div>
                <div class="admin-table-container">
                    <table class="admin-table">
                        <thead><tr><th>ID</th><th>Imagen</th><th>Nombre</th><th>Descripción</th><th>Acciones</th></tr></thead>
                        <tbody>${cats.map((c: any) => `<tr>
                            <td>${c.id}</td>
                            <td><img src="/src/data/assets/default-category.png" class="table-img" alt="Categoría por defecto"></td>
                            <td><strong>${c.nombre}</strong></td>
                            <td>${c.descripcion || 'Sin descripción'}</td>
                            <td class="table-actions">
                                <button class="btn-edit" data-action="edit" data-id="${c.id}" data-tipo="categoria">Editar</button>
                                <button class="btn-delete" data-action="delete" data-id="${c.id}" data-tipo="categoria">Eliminar</button>
                            </td>
                        </tr>`).join('')}</tbody>
                    </table>
                </div>`;
        } 
        else if (view === 'pedidos') {
            const res = await getPedidos();
            const peds = normalizarLista(res);

            contentArea.innerHTML = `
                <div class="view-header">
                    <h2>Gestión de Pedidos</h2>
                </div>
                <div class="pedidos-list">
                    ${peds.map((p: any) => `
                        <div class="pedido-card" style="cursor: pointer;" data-action="view-pedido" data-id="${p.id}">
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
        }
    } catch (error: any) {
        console.error("Error crítico en la vista de administración:", error);
        contentArea.innerHTML = `
            <div style="padding: 20px; background: white; border-radius: 8px; border-left: 5px solid red;">
                <h3 style="color: red; margin-top:0;">⚠️ Error al cargar los datos</h3>
                <p>Detalle técnico del error:</p>
                <code style="background: #f8f9fa; padding: 10px; display: block; border-radius: 4px; color: #d63031; word-break: break-all;">
                    ${error.message || error}
                </code>
                <p style="font-size: 13px; margin-top: 15px; color: #666;">Verifica que el método en tu dataService esté bien escrito y que el archivo JSON exista en la raíz correcta.</p>
            </div>`;
    }
};

// --- GESTIÓN DE FORMULARIOS MODALES (CRUD - CREATE / UPDATE / DETAIL) ---
const abrirModal = async (tipo: string, id: number | null, accion: string) => {
    const modalTitle = document.getElementById("modal-title") as HTMLElement;
    const fields = document.getElementById("modal-fields") as HTMLElement;
    const btnSubmit = document.querySelector("#admin-form button[type='submit']") as HTMLButtonElement;
    
    fields.innerHTML = "<p>Cargando formulario...</p>";
    btnSubmit.style.display = "block";
    btnSubmit.className = "btn-primary-orange";
    btnSubmit.innerText = "Guardar";
    modal.style.display = "flex";

    try {
        if (tipo === 'producto') {
            modalTitle.innerText = id ? `Editar Producto #${id}` : `Nuevo Producto`;
            fields.innerHTML = `
                <div class="form-group"><label>Nombre</label><input type="text" name="nombre" required></div>
                <div class="form-group"><label>Descripción</label><textarea name="descripcion" rows="3"></textarea></div>
                <div class="form-group"><label>Precio</label><input type="number" name="precio" required></div>
                <div class="form-group"><label>Stock</label><input type="number" name="stock"></div>
                <div class="form-group"><label>URL de Imagen</label><input type="text" name="imagen" placeholder="ejemplo.jpg"></div>
            `;
        } 
        else if (tipo === 'categoria') {
            modalTitle.innerText = id ? `Editar Categoría #${id}` : `Nueva Categoría`;
            fields.innerHTML = `
                <div class="form-group"><label>Nombre de Categoría</label><input type="text" name="nombre" required></div>
                <div class="form-group"><label>Descripción</label><textarea name="descripcion" rows="3"></textarea></div>
            `;
        } 
        else if (tipo === 'pedido' && accion === 'view-pedido') {
            const resPedidos = await getPedidos();
            const peds = normalizarLista(resPedidos);
            const pedido = peds.find((p: any) => p.id === id);
            
            const resProds = await getProductos();
            const todosLosProductos = normalizarLista(resProds);

            if (!pedido) {
                fields.innerHTML = "<p>Error: No se encontró el pedido solicitado.</p>";
                return;
            }

            modalTitle.innerText = `Detalle del Pedido #ORD-${pedido.id}`;
            btnSubmit.innerText = "Actualizar Estado";
            btnSubmit.className = "btn-success";

            // Se arma el desglose cruzando el idProducto del detalle con la lista global de productos
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
        }
    } catch (err: any) {
        fields.innerHTML = `<p style="color:red;">Error al cargar formulario: ${err.message || err}</p>`;
    }

    adminForm.dataset.tipo = tipo;
    adminForm.dataset.id = id ? id.toString() : '';
};

// --- LISTENERS GLOBALES ---

// Delegación de eventos en el área central (tablas y tarjetas de pedidos)
contentArea.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const btn = target.closest("button");
    const card = target.closest(".pedido-card");
    
    // Si hacen clic en una tarjeta de pedido, abre su respectivo detalle
    if (card) {
        abrirModal('pedido', Number(card.getAttribute("data-id")), 'view-pedido');
        return;
    }

    if (!btn) return;

    const action = btn.getAttribute("data-action");
    const idAttr = btn.getAttribute("data-id");
    const id = idAttr ? Number(idAttr) : null;
    const tipo = btn.getAttribute("data-tipo") || '';

    if (action === "new") abrirModal(tipo, null, action);
    if (action === "edit") abrirModal(tipo, id, action);
    if (action === "delete") {
        if(confirm(`¿Estás seguro de que deseas eliminar este ${tipo}?`)) {
            console.log(`Borrado solicitado para ${tipo} ID: ${id}`);
            // Aquí conectarás tu servicio delete: await deleteData(tipo, id);
        }
    }
});

// Listeners para la barra lateral de navegación
document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const view = btn.getAttribute("data-view");
        if (view) cargarVista(view);
    });
});

// Cerrar Modal
document.getElementById("close-modal")?.addEventListener("click", () => {
    modal.style.display = "none";
});

// Guardado de formularios (Submit)
adminForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(adminForm));
    console.log(`Guardando cambios de ${adminForm.dataset.tipo} (ID: ${adminForm.dataset.id || 'NUEVO'})`, data);
    
    // Aquí conectarás tu servicio persist: await saveForm(adminForm.dataset.tipo, data);
    modal.style.display = "none";
});

// F4.1: Listener para cerrar sesión
document.getElementById("btn-logout")?.addEventListener("click", () => {
    cerrarSesion();
});

// Inicialización de la SPA mostrando el Dashboard por defecto
if (usuarioLogueado) {
    cargarVista("dashboard");
}