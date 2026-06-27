import { getProductos } from "../../../services/dataService";
import type { Product } from "../../../types/producto";

// 1. Seleccionamos los elementos del DOM
const contenedorProductos = document.getElementById("product-container");
const listaCategorias = document.querySelectorAll(".enlace-categoria");
const tituloCategoria = document.getElementById("category-title");
const contadorProductos = document.getElementById("product-count");
const buscador = document.getElementById("search-input") as HTMLInputElement;

/** Función para actualizar el número en el icono del carrito (Badge) */
const actualizarBadgeCarrito = () => {
    const badge = document.getElementById("cart-count");
    if (!badge) return;

    const carrito = JSON.parse(localStorage.getItem("cart") || "[]");
    // Usamos reduce para sumar las cantidades reales, no solo la longitud del array
    const cantidadTotal = carrito.reduce((sum: number, item: any) => sum + (item.cantidad || 1), 0);
    
    badge.innerText = cantidadTotal.toString();

    badge.classList.add("bump");
    setTimeout(() => badge.classList.remove("bump"), 300);
};

/** Función global para agregar productos al carrito */
(window as any).agregarAlCarrito = async (id: number) => {
    // Obtenemos data fresca
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

/* Función para renderizar las cards de los productos */
const renderizarProductos = (productosParaMostrar: Product[]) => {
    if (!contenedorProductos) return;
    
    contenedorProductos.innerHTML = "";

    if (contadorProductos) {
        contadorProductos.innerText = `Mostrando ${productosParaMostrar.length} productos`;
    }

    if (productosParaMostrar.length === 0) {
        contenedorProductos.innerHTML = `<p class="no-products">No se encontraron productos.</p>`;
        return;
    }

    productosParaMostrar.forEach(producto => {
        const card = document.createElement("div");
        card.className = "producto-card";
        card.innerHTML = `
            <img src="/src/data/assets/${producto.imagen}" alt="${producto.nombre}">
            <div class="card-body">
                <div class="card-text">
                    <h4>${producto.nombre}</h4>
                    <p class="precio">$${producto.precio.toLocaleString('es-AR')}</p>
                </div>
                <button class="btn-primary" onclick="agregarAlCarrito(${producto.id})">
                    Agregar al carrito
                </button>
            </div>
        `;
        contenedorProductos.appendChild(card);
    });
};

/** Lógica de Filtrado por Categoría */
listaCategorias.forEach(enlace => {
    enlace.addEventListener("click", async (e) => {
        e.preventDefault();
        const allProducts = await getProductos(); // Obtenemos data fresca al filtrar

        listaCategorias.forEach(el => el.classList.remove("active"));
        enlace.classList.add("active");

        const categoriaId = enlace.getAttribute("data-category");
        const nombreCat = enlace.textContent;

        if (tituloCategoria) tituloCategoria.innerText = nombreCat || "Productos";

        if (categoriaId === "all") {
            renderizarProductos(allProducts);
        } else {
            const filtrados = allProducts.filter(p => 
                p.categorias.some(c => c.id === Number(categoriaId))
            );
            renderizarProductos(filtrados);
        }
    });
});

/** Lógica del Buscador */
buscador?.addEventListener("input", async () => {
    const allProducts = await getProductos(); // Obtenemos data fresca al buscar
    const query = buscador.value.toLowerCase();
    const filtrados = allProducts.filter(p => 
        p.nombre.toLowerCase().includes(query)
    );
    renderizarProductos(filtrados);
});

// --- INICIALIZACIÓN ---
const init = async () => {
    const productos = await getProductos();
    renderizarProductos(productos);
    actualizarBadgeCarrito();
};

init();