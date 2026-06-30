import { Product } from "./types/producto";
import { ICategory } from "./types/categoria";
import { getLoggedUser, clearLoggedUser, addToCart, getCart } from "./utils/localStorage";
import { getProductos, getCategorias } from "./services/dataService"; // Importamos los servicios

/**
 * LÓGICA DE LA LANDING PAGE PÚBLICA
 */

// Apenas carga la página pública, verificamos si el usuario ya tenía una sesión iniciada
const userStr = localStorage.getItem('user');

if (userStr) {
    // Si ya está logueado, le ahorramos ver la portada y lo mandamos directo a su sector
    const user = JSON.parse(userStr);
    
    if (user.rol === 'ADMIN') {
        window.location.href = '/src/pages/admin/adminHome/index.html';
    } else {
        window.location.href = '/src/pages/store/home/index.html';
    }
}

// Si no está logueado, simplemente no hace nada y se queda viendo la Landing Page hermosa.

// --- 1. FUNCIÓN GLOBAL DE RENDERIZADO ---
const renderizarProductos = (lista: Product[]) => {
    const contenedorProductos = document.getElementById("contenedor-productos");
    if (!contenedorProductos) return;

    contenedorProductos.innerHTML = "";
    
    lista.forEach((p: Product) => {
        const div = document.createElement("div");
        div.className = "producto-card";
        div.innerHTML = `
            <div class="card-image-container">
                <img src="/src/data/assets/${p.imagen}" alt="${p.nombre}">
            </div>
            <div class="card-body">
                <span class="card-category">${p.categorias.map(c => c.nombre).join(", ")}</span>
                <h3 class="card-title">${p.nombre}</h3>
                <p class="card-description">${p.descripcion}</p>
            </div>
            <div class="card-footer">
                <span class="card-price">$${p.precio.toLocaleString()}</span>
                <button class="btn-agregar">Agregar</button>
            </div>
        `;

        const btn = div.querySelector(".btn-agregar");
        btn?.addEventListener("click", () => {
            addToCart(p);
            updateCartBadge();
        });

        contenedorProductos.appendChild(div);
    });
};

const updateCartBadge = () => {
    const badge = document.getElementById("cart-count");
    if (!badge) return;
    const cart = getCart();
    const totalItems = cart.reduce((sum: number, item: any) => sum + item.cantidad, 0);
    badge.textContent = totalItems.toString();
};

// --- 2. LÓGICA DE PROTECCIÓN (Check Auth) ---
export const checkAuth = () => {
    const user = getLoggedUser();
    const currentPath = window.location.pathname;

    if (currentPath.includes("/admin/") && (!user || user.role !== "admin")) {
        alert("No tienes permisos.");
        window.location.href = "/src/pages/auth/login/index.html";
    }

    if (currentPath.includes("/client/") && !user) {
        window.location.href = "/src/pages/auth/login/index.html";
    }
};
checkAuth();

// --- 4. LÓGICA DE LA TIENDA (Asíncrona) ---
const initApp = async () => {
    const allProducts = await getProductos();
    const allCategories = await getCategorias();

    const contenedorProductos = document.getElementById("contenedor-productos");
    if (contenedorProductos) {
        renderizarProductos(allProducts);
        updateCartBadge();
    }

    // Búsqueda
    const searchForm = document.getElementById("formulario-busqueda") as HTMLFormElement | null;
    const searchInput = document.getElementById("buscarProducto") as HTMLInputElement | null;
    
    searchForm?.addEventListener("submit", (e) => {
        e.preventDefault();
        const query = searchInput?.value.toLowerCase() || "";
        const filtrados = allProducts.filter(p => 
            p.nombre.toLowerCase().includes(query) || p.descripcion.toLowerCase().includes(query)
        );
        renderizarProductos(filtrados);
    });

    // Categorías
    const contenedorCategorias = document.getElementById("lista-categorias");
    if (contenedorCategorias) {
        // Categoría "Todos"
        const liTodos = document.createElement("li");
        liTodos.innerHTML = `<a href="#" class="enlace-categoria active">Todos los productos</a>`;
        liTodos.addEventListener("click", (e) => {
            e.preventDefault();
            renderizarProductos(allProducts);
        });
        contenedorCategorias.appendChild(liTodos);

        // Categorías reales
        allCategories.forEach((categoria: ICategory) => {
            const li = document.createElement("li");
            li.innerHTML = `<a href="#" class="enlace-categoria">${categoria.nombre}</a>`;
            li.addEventListener("click", (e) => {
                e.preventDefault();
                const filtrados = allProducts.filter(p => p.categorias.some(c => c.nombre === categoria.nombre));
                renderizarProductos(filtrados);
            });
            contenedorCategorias.appendChild(li);
        });
    }
};

initApp();