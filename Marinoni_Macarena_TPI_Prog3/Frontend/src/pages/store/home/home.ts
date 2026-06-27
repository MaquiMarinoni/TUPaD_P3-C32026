import { getProductos, getCategorias } from "../../../services/dataService";
import type { Product } from "../../../types/producto";
import { validarSesion } from "../../../utils/authGuard";

const contenedorProductos = document.getElementById("product-container");
const listaCategoriasContainer = document.getElementById("category-filter") as HTMLElement;
const tituloCategoria = document.getElementById("category-title");
const contadorProductos = document.getElementById("product-count");
const buscador = document.getElementById("search-input") as HTMLInputElement;
const sortSelect = document.getElementById("sort-select") as HTMLSelectElement;

// Rol actual
const userStr = localStorage.getItem("user");
const user = userStr ? JSON.parse(userStr) : null;
const isAdmin = user?.rol === "ADMIN";

// Variables de estado (para cruzar todos los filtros a la vez)
let currentCategoriaId = "all";
let currentSearch = "";
let currentSort = "default";

// --- CARRITO ---
const actualizarBadgeCarrito = () => {
    if (isAdmin) return;
    const badge = document.getElementById("cart-count");
    if (!badge) return;
    const carrito = JSON.parse(localStorage.getItem("cart") || "[]");
    const cantidadTotal = carrito.reduce((sum: number, item: any) => sum + (item.cantidad || 1), 0);
    badge.innerText = cantidadTotal.toString();
    badge.classList.add("bump");
    setTimeout(() => badge.classList.remove("bump"), 300);
};

(window as any).agregarAlCarrito = async (id: number) => {
    if (isAdmin) return alert("Los administradores no pueden realizar compras.");
    
    const allProducts = await getProductos();
    const producto = allProducts.find(p => p.id === id);
    if (!producto) return;

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const itemExistente = cart.find((item: any) => item.id === id);

    if (itemExistente) itemExistente.cantidad = (itemExistente.cantidad || 1) + 1;
    else cart.push({ ...producto, cantidad: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));
    actualizarBadgeCarrito();
};

// --- RENDERIZADO DE PRODUCTOS ---
const renderizarProductos = (productosParaMostrar: Product[]) => {
    if (!contenedorProductos) return;
    contenedorProductos.innerHTML = "";
    if (contadorProductos) contadorProductos.innerText = `Mostrando ${productosParaMostrar.length} productos`;

    if (productosParaMostrar.length === 0) {
        contenedorProductos.innerHTML = `<p class="no-products">No se encontraron productos con estos filtros.</p>`;
        return;
    }

    productosParaMostrar.forEach(producto => {
        const card = document.createElement("div");
        card.className = "producto-card";
        
        const botonHTML = isAdmin 
            ? `<p style="color: var(--orange-primary); font-size: 13px; font-weight: bold; text-align:center;">Vista de Administrador</p>` 
            : `<button class="btn-primary" style="width: 100%; margin-top: 10px;" onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>`;

        const badgeDisponibilidad = (producto.disponible !== false)
            ? `<span style="position:absolute; top:10px; right:10px; background: #2ecc71; color:white; padding: 4px 8px; border-radius:4px; font-size:12px; font-weight:bold;">Disponible</span>`
            : `<span style="position:absolute; top:10px; right:10px; background: #e74c3c; color:white; padding: 4px 8px; border-radius:4px; font-size:12px; font-weight:bold;">Agotado</span>`;

        // Notar cómo envolvemos la parte de arriba en un div clickable que lleva al detalle
        card.innerHTML = `
            <div onclick="window.location.href='/src/pages/store/productDetail/index.html?id=${producto.id}'" style="cursor: pointer; position: relative;">
                <img src="/src/data/assets/${producto.imagen}" alt="${producto.nombre}" style="width: 100%; height: 200px; object-fit: cover;" onerror="this.src='/src/data/assets/napo.jpg'">
                ${badgeDisponibilidad}
                <div class="card-body" style="padding: 15px; padding-bottom: 0;">
                    <div class="card-text">
                        <h4 style="margin: 0 0 5px 0;">${producto.nombre}</h4>
                        <p style="font-size: 12px; color: #666; margin: 0 0 10px 0; height: 35px; overflow: hidden;">${producto.descripcion || 'Sin descripción'}</p>
                        <p class="precio" style="font-size: 18px; color: var(--orange-primary); margin: 0; font-weight: bold;">$${producto.precio.toLocaleString('es-AR')}</p>
                    </div>
                </div>
            </div>
            <div style="padding: 15px;">
                ${botonHTML}
            </div>
        `;
        contenedorProductos.appendChild(card);
    });
};

// --- MOTOR DE FILTRADO Y ORDENAMIENTO ---
const aplicarFiltrosYOrden = async () => {
    const allProducts = await getProductos(); 
    
    // 1. Filtrar por Eliminado y Disponible (Regla F5.2)
    let filtrados = allProducts.filter(p => p.eliminado !== true && p.disponible !== false);

    // 2. Filtrar por Categoría
    if (currentCategoriaId !== "all") {
        filtrados = filtrados.filter(p => p.categoriaId === Number(currentCategoriaId));
    }

    // 3. Filtrar por Búsqueda de texto
    if (currentSearch !== "") {
        filtrados = filtrados.filter(p => p.nombre.toLowerCase().includes(currentSearch));
    }

    // 4. Aplicar Ordenamiento
    if (currentSort === "name-asc") filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
    if (currentSort === "name-desc") filtrados.sort((a, b) => b.nombre.localeCompare(a.nombre));
    if (currentSort === "price-asc") filtrados.sort((a, b) => a.precio - b.precio);
    if (currentSort === "price-desc") filtrados.sort((a, b) => b.precio - a.precio);

    renderizarProductos(filtrados);
};

// --- EVENT LISTENERS ---
buscador?.addEventListener("input", () => {
    currentSearch = buscador.value.toLowerCase().trim();
    aplicarFiltrosYOrden();
});

sortSelect?.addEventListener("change", () => {
    currentSort = sortSelect.value;
    aplicarFiltrosYOrden();
});

// --- RENDERIZAR CATEGORÍAS LATERALES ---
const renderizarCategoriasSidebar = async () => {
    const categorias = await getCategorias();
    // Filtramos las eliminadas
    const categoriasActivas = categorias.filter(c => c.eliminado !== true);

    listaCategoriasContainer.innerHTML = `
        <li><a href="#" class="enlace-categoria active" data-category="all" data-name="Todos los productos">Todos los productos</a></li>
    `;
    
    categoriasActivas.forEach(cat => {
        listaCategoriasContainer.innerHTML += `
            <li><a href="#" class="enlace-categoria" data-category="${cat.id}" data-name="${cat.nombre}">${cat.nombre}</a></li>
        `;
    });

    // Asignar listeners a los nuevos enlaces
    document.querySelectorAll(".enlace-categoria").forEach(enlace => {
        enlace.addEventListener("click", (e) => {
            e.preventDefault();
            document.querySelectorAll(".enlace-categoria").forEach(el => el.classList.remove("active"));
            enlace.classList.add("active");
            
            currentCategoriaId = enlace.getAttribute("data-category") || "all";
            if (tituloCategoria) tituloCategoria.innerText = enlace.getAttribute("data-name") || "Productos";
            
            aplicarFiltrosYOrden(); // Disparamos la actualización global
        });
    });
};

// --- INICIALIZACIÓN GENERAL ---
const init = async () => {
    await renderizarCategoriasSidebar();
    await aplicarFiltrosYOrden();
    
    if (user) {
        const btnLogout = document.getElementById("link-logout");
        if (btnLogout) {
            btnLogout.style.display = "inline-block";
            btnLogout.addEventListener("click", (e) => {
                e.preventDefault();
                localStorage.removeItem("user");
                window.location.href = "/src/pages/auth/login/index.html";
            });
        }

        if (isAdmin) {
            const adminLink = document.getElementById("link-admin");
            if (adminLink) adminLink.style.display = "inline-block";
            document.getElementById("link-mis-pedidos")!.style.display = "none";
            document.getElementById("link-carrito")!.style.display = "none";
            document.getElementById("cart-icon-container")!.style.display = "none";
        } else {
            actualizarBadgeCarrito();
        }
    }
};

init();