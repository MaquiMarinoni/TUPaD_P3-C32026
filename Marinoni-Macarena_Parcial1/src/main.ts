// --- IMPORTACIONES ---
import { PRODUCTS, categorias } from "./data";
import { Product } from "./types/producto";
import { ICategory } from "./types/categoria";
import { getLoggedUser, clearLoggedUser, addToCart, getCart } from "./utils/localStorage";

// --- 1. FUNCIÓN GLOBAL DE RENDERIZADO ---
// Definida al principio para que sea accesible por cualquier listener
const renderizarProductos = (lista: Product[]) => {
    const contenedorProductos = document.getElementById("contenedor-productos");
    if (!contenedorProductos) return; // Guard clause: si no estamos en la home, no hace nada

    contenedorProductos.innerHTML = "";
    
    lista.forEach((p: Product) => {
        const div = document.createElement("div");
        div.className = "producto-card";
        div.innerHTML = `
            <div class="card-image-container">
                <img src="${p.imagen}" alt="${p.nombre}">
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

// --- FUNCIÓN PARA ACTUALIZAR EL BADGE DEL CARRITO ---
const updateCartBadge = () => {
    const badge = document.getElementById("cart-count");
    if (!badge) return; // Si no existe el badge en esta página, no hacemos nada

    const cart = getCart(); // Traemos el carrito actualizado
    
    // Sumamos la cantidad de todos los productos usando reduce
    const totalItems = cart.reduce((sum, item) => sum + item.cantidad, 0);
    
    // Actualizamos el texto
    badge.textContent = totalItems.toString();
};

// --- 2. LÓGICA DE PROTECCIÓN (Check Auth) ---
export const checkAuth = () => {
    const user = getLoggedUser(); 
    const currentPath = window.location.pathname;

    if (currentPath.includes("/admin/")) {
        if (!user || user.role !== "admin") {
            alert("No tienes permisos.");
            window.location.href = "/src/pages/auth/login/index.html";
        }
    }

    if (currentPath.includes("/client/")) {
        if (!user) {
            window.location.href = "/src/pages/auth/login/index.html";
        }
    }
};

checkAuth();

// --- 3. LÓGICA DE LOGOUT ---
const btnLogout = document.getElementById("btn-logout");
if (btnLogout) {
    if (getLoggedUser()) {
        btnLogout.style.display = "block";
        btnLogout.addEventListener("click", () => {
            clearLoggedUser();
            window.location.href = "/src/pages/auth/login/index.html";
        });
    }
}

// --- 4. LÓGICA DE LA TIENDA (Inicio, Filtros y Categorías) ---

// Renderizado inicial
const contenedorProductos = document.getElementById("contenedor-productos");
if (contenedorProductos) {
    renderizarProductos(PRODUCTS);
    updateCartBadge();
}

// Búsqueda
const searchForm = document.getElementById("formulario-busqueda") as HTMLFormElement | null;
const searchInput = document.getElementById("buscarProducto") as HTMLInputElement | null;
const btnVerTodos = document.getElementById("btn-ver-todos") as HTMLButtonElement | null;

if (searchForm && searchInput) {
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const query = searchInput.value.toLowerCase();
        const filtrados = PRODUCTS.filter(p => 
            p.nombre.toLowerCase().includes(query) || 
            p.descripcion.toLowerCase().includes(query)
        );
        renderizarProductos(filtrados);
    });
}

btnVerTodos?.addEventListener("click", () => {
    if (searchInput) searchInput.value = "";
    renderizarProductos(PRODUCTS);
});

// Categorías
const contenedorCategorias = document.getElementById("lista-categorias");

if (contenedorCategorias) {
    // Primero, creamos una categoría especial para "Todos los productos"
    const liTodos = document.createElement("li");
    liTodos.className = "category-item";
    liTodos.innerHTML = `<a href="#" class="enlace-categoria active" id="cat-todos">Todos los productos</a>`;
    
    liTodos.addEventListener("click", (e) => {
        e.preventDefault();
        // Quitar 'active' de todos y ponerlo aquí
        document.querySelectorAll(".enlace-categoria").forEach(el => el.classList.remove("active"));
        liTodos.querySelector("a")?.classList.add("active");
        
        renderizarProductos(PRODUCTS);
    });
    contenedorCategorias.appendChild(liTodos);

    // Luego, renderizamos las categorías reales de data.ts
    categorias.forEach((categoria: ICategory) => {
        const li = document.createElement("li");
        li.className = "category-item";
        li.innerHTML = `<a href="#" class="enlace-categoria">${categoria.nombre}</a>`;
        
        li.addEventListener("click", (e) => {
            e.preventDefault();
            // Quitar 'active' de todos y ponerlo en este enlace
            document.querySelectorAll(".enlace-categoria").forEach(el => el.classList.remove("active"));
            li.querySelector("a")?.classList.add("active");
            
            // Filtramos productos
            const filtrados = PRODUCTS.filter(p => p.categorias.some(c => c.nombre === categoria.nombre));
            renderizarProductos(filtrados);
        });
        
        contenedorCategorias.appendChild(li);
    });
}

