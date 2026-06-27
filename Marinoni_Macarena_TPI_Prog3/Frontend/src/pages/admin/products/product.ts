import { getProductos, getCategorias, saveProducto, deleteProducto } from "../../../services/dataService";
import { validarSesion, cerrarSesion } from "../../../utils/authGuard";

validarSesion('ADMIN');

const contentArea = document.getElementById("admin-content") as HTMLElement;
const modal = document.getElementById("admin-modal") as HTMLElement;
const adminForm = document.getElementById("admin-form") as HTMLFormElement;
const modalTitle = document.getElementById("modal-title") as HTMLElement;
const fields = document.getElementById("modal-fields") as HTMLElement;

const renderizarProductos = async () => {
    contentArea.innerHTML = "<p>Cargando productos...</p>";
    try {
        const prods = await getProductos();
        const cats = await getCategorias();
        
        contentArea.innerHTML = `
            <div class="view-header">
                <h2>Lista de Productos</h2>
                <button class="btn-success" id="btn-new-prod">+ Nuevo Producto</button>
            </div>
            <div class="admin-table-container" style="overflow-x: auto;">
                <table class="admin-table" style="min-width: 900px;">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Precio</th>
                            <th>Categoría</th>
                            <th>Stock</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>${prods.map((p: any) => {
                        const categoriaReal = cats.find(c => c.id === Number(p.categoriaId));
                        const nombreCat = categoriaReal ? categoriaReal.nombre : 'Sin Categoría';
                        const estadoHtml = p.disponible !== false 
                            ? `<span style="background: #2ecc71; color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;">Activo</span>`
                            : `<span style="background: #e74c3c; color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;">Inactivo</span>`;

                        return `<tr>
                            <td>${p.id}</td>
                            <td><img src="/src/data/assets/${p.imagen || 'default.png'}" class="table-img" alt="${p.nombre}" onerror="this.src='/src/data/assets/napo.jpg'"></td>
                            <td><strong>${p.nombre}</strong></td>
                            <td><small>${p.descripcion || ''}</small></td>
                            <td>$${p.precio?.toLocaleString('es-AR') || p.precio}</td>
                            <td><span style="background: #f8f9fa; padding: 3px 6px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px;">${nombreCat}</span></td>
                            <td><strong>${p.stock || 0}</strong></td>
                            <td>${estadoHtml}</td>
                            <td class="table-actions">
                                <button class="btn-edit" data-id="${p.id}">Editar</button>
                                <button class="btn-delete" data-id="${p.id}">Eliminar</button>
                            </td>
                        </tr>`;
                    }).join('')}</tbody>
                </table>
            </div>`;

        document.getElementById("btn-new-prod")?.addEventListener("click", () => abrirModal(null, prods, cats));
        
        document.querySelectorAll(".btn-edit").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = Number((e.target as HTMLElement).getAttribute("data-id"));
                abrirModal(id, prods, cats);
            });
        });

        // F6.2: Acción real de eliminar
        document.querySelectorAll(".btn-delete").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                const id = Number((e.target as HTMLElement).getAttribute("data-id"));
                if(confirm(`¿Estás seguro de que deseas eliminar el producto #${id}?`)) {
                    deleteProducto(id); // Borrado lógico en memoria
                    await renderizarProductos(); // Recarga la tabla
                }
            });
        });

    } catch (error: any) {
        contentArea.innerHTML = `<p style="color:red;">Error al cargar datos.</p>`;
    }
};

const abrirModal = (id: number | null, prods: any[], cats: any[]) => {
    const productoActual = id ? prods.find(p => p.id === id) : null;
    
    const opcionesCategorias = cats.map(c => 
        `<option value="${c.id}" ${productoActual && productoActual.categoriaId === c.id ? 'selected' : ''}>${c.nombre}</option>`
    ).join('');

    modalTitle.innerText = id ? `Editar Producto #${id}` : `Nuevo Producto`;
    
    fields.innerHTML = `
        <div style="display: flex; gap: 15px;">
            <div class="form-group" style="flex: 2;"><label>Nombre</label><input type="text" name="nombre" value="${productoActual?.nombre || ''}" required></div>
            <div class="form-group" style="flex: 1;"><label>Precio ($)</label><input type="number" name="precio" value="${productoActual?.precio || ''}" required></div>
        </div>
        <div class="form-group"><label>Descripción</label><textarea name="descripcion" rows="2">${productoActual?.descripcion || ''}</textarea></div>
        <div style="display: flex; gap: 15px;">
            <div class="form-group" style="flex: 2;">
                <label>Categoría</label>
                <select name="categoriaId" required style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ccc;">
                    ${opcionesCategorias}
                </select>
            </div>
            <div class="form-group" style="flex: 1;"><label>Stock</label><input type="number" name="stock" value="${productoActual?.stock || 0}"></div>
        </div>
        <div style="display: flex; gap: 15px; align-items: center; margin-top: 10px;">
            <div class="form-group" style="flex: 2;"><label>Imagen (Archivo)</label><input type="text" name="imagen" value="${productoActual?.imagen || ''}" placeholder="ejemplo.jpg"></div>
            <div class="form-group" style="flex: 1; flex-direction: row; gap: 10px;">
                <input type="checkbox" name="disponible" id="check-disp" ${!productoActual || productoActual.disponible !== false ? 'checked' : ''}>
                <label for="check-disp" style="margin: 0; cursor: pointer;">¿Está Activo?</label>
            </div>
        </div>
    `;
    adminForm.dataset.id = id ? id.toString() : '';
    modal.style.display = "flex";
};

document.getElementById("close-modal")?.addEventListener("click", () => modal.style.display = "none");
document.getElementById("btn-logout")?.addEventListener("click", () => cerrarSesion());

// F6.2: Acción real de guardar
adminForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(adminForm));
    
    const productoLimpio = {
        ...data,
        id: adminForm.dataset.id ? Number(adminForm.dataset.id) : Math.floor(Math.random() * 90000) + 10000,
        precio: Number(data.precio),
        stock: Number(data.stock),
        categoriaId: Number(data.categoriaId),
        disponible: data.disponible === 'on',
        eliminado: false
    };

    saveProducto(productoLimpio); // Guardado en memoria local
    modal.style.display = "none";
    await renderizarProductos(); // Recarga la tabla
});

renderizarProductos();