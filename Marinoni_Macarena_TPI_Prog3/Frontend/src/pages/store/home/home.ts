import { getProductos } from "../../../services/dataService";
import type { Product } from "../../../types/producto";
import { validarSesion } from "../../../utils/authGuard";

const contenedorProductos = document.getElementById("product-container");
const listaCategorias = document.querySelectorAll(".enlace-categoria");
const tituloCategoria = document.getElementById("category-title");
const contadorProductos = document.getElementById("product-count");
const buscador = document.getElementById("search-input") as HTMLInputElement;

// Averiguamos el rol del usuario logueado ANTES de renderizar
const userStr = localStorage.getItem("user");
const user = userStr ? JSON.parse(userStr) : null;
const isAdmin = user?.rol === "ADMIN";

const actualizarBadgeCarrito = () => {
    if (isAdmin) return; // El admin no tiene changuito
    const badge = document.getElementById("cart-count");
    if (!badge) return;
    const carrito = JSON.parse(localStorage.getItem("cart") || "[]");
    const cantidadTotal = carrito.reduce((sum: number, item: any) => sum + (item.cantidad || 1), 0);
    badge.innerText = cantidadTotal.toString();
    badge.classList.add("bump");
    setTimeout(() => badge.classList.remove("bump"), 300);
};

(window as any).agregarAlCarrito = async (id: number) => {
    if (isAdmin) {
        alert("Los administradores no pueden realizar compras.");
        return;
    }
    const allProducts = await getProductos();
    const producto = allProducts.find(p => p.id === id);
    if (!producto) return;

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const itemExistente = cart.find((item: any) => item.id === id);

    if (itemExistente) {
        itemExistente.cantidad = (itemExistente.cantidad || 1) + 1;
    } else {
        cart.push({ ...producto, cantidad: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    actualizarBadgeCarrito();
};

const renderizarProductos = (productosParaMostrar: Product[]) => {
    if (!contenedorProductos) return;
    contenedorProductos.innerHTML = "";
    if (contadorProductos) contadorProductos.innerText = `Mostrando ${productosParaMostrar.length} productos`;

    if (productosParaMostrar.length === 0) {
        contenedorProductos.innerHTML = `<p class="no-products">No se encontraron productos.</p>`;
        return;
    }

    productosParaMostrar.forEach(producto => {
        const card = document.createElement("div");
        card.className = "producto-card";
        
        // F4.2: Si es Admin, no mostramos el botón de comprar
        const botonHTML = isAdmin 
            ? `<p style="color: var(--orange-primary); font-size: 13px; font-weight: bold; margin-top: 10px;">Vista de Administrador</p>` 
            : `<button class="btn-primary" onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>`;

        card.innerHTML = `
            <img src="/src/data/assets/${producto.imagen}" alt="${producto.nombre}" onerror="this.src='/src/data/assets/napo.jpg'">
            <div class="card-body">
                <div class="card-text">
                    <h4>${producto.nombre}</h4>
                    <p class="precio">$${producto.precio.toLocaleString('es-AR')}</p>
                </div>
                ${botonHTML}
            </div>
        `;
        contenedorProductos.appendChild(card);
    });
};

// Filtros y Búsqueda (Sin cambios)
listaCategorias.forEach(enlace => {
    enlace.addEventListener("click", async (e) => {
        e.preventDefault();
        const allProducts = await getProductos(); 
        listaCategorias.forEach(el => el.classList.remove("active"));
        enlace.classList.add("active");
        const categoriaId = enlace.getAttribute("data-category");
        if (tituloCategoria) tituloCategoria.innerText = enlace.textContent || "Productos";
        const filtrados = categoriaId === "all" ? allProducts : allProducts.filter(p => p.categoriaId === Number(categoriaId));
        renderizarProductos(filtrados);
    });
});

buscador?.addEventListener("input", async () => {
    const allProducts = await getProductos(); 
    const query = buscador.value.toLowerCase();
    const filtrados = allProducts.filter(p => p.nombre.toLowerCase().includes(query));
    renderizarProductos(filtrados);
});

// --- INICIALIZACIÓN Y RESTRICCIONES F4.2 ---
const init = async () => {
    const productos = await getProductos();
    renderizarProductos(productos);
    
    if (user) {
        // Mostrar botón de Salir a todos los logueados
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
            // REGLA ADMIN: Mostrar Panel, Ocultar "Mis Pedidos" y "Carrito"
            const adminLink = document.getElementById("link-admin");
            if (adminLink) adminLink.style.display = "inline-block";
            
            document.getElementById("link-mis-pedidos")!.style.display = "none";
            document.getElementById("link-carrito")!.style.display = "none";
            document.getElementById("cart-icon-container")!.style.display = "none";
        } else {
            // REGLA CLIENTE: Actualizar el badge del carrito
            actualizarBadgeCarrito();
        }
    }
};

init();