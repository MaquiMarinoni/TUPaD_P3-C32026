import { getCategorias } from "../../../services/dataService";
import { validarSesion, cerrarSesion } from "../../../utils/authGuard";

// Protegemos la ruta
validarSesion('ADMIN');

const contentArea = document.getElementById("admin-content") as HTMLElement;
const modal = document.getElementById("admin-modal") as HTMLElement;
const adminForm = document.getElementById("admin-form") as HTMLFormElement;
const modalTitle = document.getElementById("modal-title") as HTMLElement;
const fields = document.getElementById("modal-fields") as HTMLElement;

const renderizarCategorias = async () => {
    contentArea.innerHTML = "<p>Cargando categorías...</p>";
    try {
        const cats = await getCategorias();
        
        contentArea.innerHTML = `
            <div class="view-header">
                <h2>Lista de Categorías</h2>
                <button class="btn-success" id="btn-new-cat">+ Nueva Categoría</button>
            </div>
            <div class="admin-table-container">
                <table class="admin-table">
                    <thead><tr><th>ID</th><th>Imagen</th><th>Nombre</th><th>Descripción</th><th>Acciones</th></tr></thead>
                    <tbody>${cats.map((c: any) => `<tr>
                        <td>${c.id}</td>
                        <td><img src="/src/data/assets/${c.imagen || 'default-category.png'}" class="table-img" alt="${c.nombre}"></td>
                        <td><strong>${c.nombre}</strong></td>
                        <td>${c.descripcion || 'Sin descripción'}</td>
                        <td class="table-actions">
                            <button class="btn-edit" data-id="${c.id}">Editar</button>
                            <button class="btn-delete" data-id="${c.id}">Eliminar</button>
                        </td>
                    </tr>`).join('')}</tbody>
                </table>
            </div>`;

        // Asignar eventos a los botones recién creados
        document.getElementById("btn-new-cat")?.addEventListener("click", () => abrirModal(null));
        
        document.querySelectorAll(".btn-edit").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = (e.target as HTMLElement).getAttribute("data-id");
                abrirModal(Number(id));
            });
        });

        document.querySelectorAll(".btn-delete").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = (e.target as HTMLElement).getAttribute("data-id");
                if(confirm(`¿Estás seguro de que deseas eliminar la categoría #${id}?`)) {
                    console.log(`Borrado solicitado para categoría ID: ${id}`);
                    // Aquí irá el fetch DELETE al backend luego
                }
            });
        });

    } catch (error: any) {
        contentArea.innerHTML = `<p style="color:red;">Error al cargar datos: ${error.message}</p>`;
    }
};

const abrirModal = (id: number | null) => {
    modalTitle.innerText = id ? `Editar Categoría #${id}` : `Nueva Categoría`;
    fields.innerHTML = `
        <div class="form-group"><label>Nombre de Categoría</label><input type="text" name="nombre" required></div>
        <div class="form-group"><label>Descripción</label><textarea name="descripcion" rows="3"></textarea></div>
        <div class="form-group"><label>URL de Imagen</label><input type="text" name="imagen"></div>
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
    console.log(`Guardando categoría (ID: ${adminForm.dataset.id || 'NUEVA'})`, data);
    modal.style.display = "none";
});

// Inicializar la vista
renderizarCategorias();