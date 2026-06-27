import { getProductos } from "../../../services/dataService";
import { validarSesion, cerrarSesion } from "../../../utils/authGuard";

// Protegemos la ruta
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
        
        contentArea.innerHTML = `
            <div class="view-header">
                <h2>Lista de Productos</h2>
                <button class="btn-success" id="btn-new-prod">+ Nuevo Producto</button>
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
                            <button class="btn-edit" data-id="${p.id}">Editar</button>
                            <button class="btn-delete" data-id="${p.id}">Eliminar</button>
                        </td>
                    </tr>`).join('')}</tbody>
                </table>
            </div>`;

        // Listeners para los botones
        document.getElementById("btn-new-prod")?.addEventListener("click", () => abrirModal(null));
        
        document.querySelectorAll(".btn-edit").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = (e.target as HTMLElement).getAttribute("data-id");
                abrirModal(Number(id));
            });
        });

        document.querySelectorAll(".btn-delete").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = (e.target as HTMLElement).getAttribute("data-id");
                if(confirm(`¿Estás seguro de que deseas eliminar el producto #${id}?`)) {
                    console.log(`Borrado solicitado para producto ID: ${id}`);
                    // A futuro, aquí se conectará con el backend
                }
            });
        });

    } catch (error: any) {
        contentArea.innerHTML = `<p style="color:red;">Error al cargar datos: ${error.message}</p>`;
    }
};

const abrirModal = (id: number | null) => {
    modalTitle.innerText = id ? `Editar Producto #${id}` : `Nuevo Producto`;
    fields.innerHTML = `
        <div class="form-group"><label>Nombre</label><input type="text" name="nombre" required></div>
        <div class="form-group"><label>Descripción</label><textarea name="descripcion" rows="3"></textarea></div>
        <div class="form-group"><label>Precio</label><input type="number" name="precio" required></div>
        <div class="form-group"><label>Stock</label><input type="number" name="stock"></div>
        <div class="form-group"><label>URL de Imagen</label><input type="text" name="imagen" placeholder="ejemplo.jpg"></div>
    `;
    adminForm.dataset.id = id ? id.toString() : '';
    modal.style.display = "flex";
};

// Listeners Generales
document.getElementById("close-modal")?.addEventListener("click", () => modal.style.display = "none");
document.getElementById("btn-logout")?.addEventListener("click", () => cerrarSesion());

adminForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(adminForm));
    console.log(`Guardando producto (ID: ${adminForm.dataset.id || 'NUEVO'})`, data);
    modal.style.display = "none";
});

// Inicializar la vista
renderizarProductos();