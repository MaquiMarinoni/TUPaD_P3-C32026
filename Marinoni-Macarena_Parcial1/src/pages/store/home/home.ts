import { PRODUCTS } from "../../../data/data";
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

    // Obtenemos los productos actuales del localStorage
    const carrito = JSON.parse(localStorage.getItem("cart") || "[]");
    const cantidadTotal = carrito.length;
    
    badge.innerText = cantidadTotal.toString();

    // Efecto visual de rebote (bump)
    badge.classList.add("bump");
    setTimeout(() => badge.classList.remove("bump"), 300);
};

/** Función global para agregar productos al carrito. La exponemos a window para que funcione con el atributo onclick del HTML inyectado */
(window as any).agregarAlCarrito = (id: number) => {
    // 1. Buscamos el producto en la data (usando tus constantes)
    const producto = PRODUCTS.find(p => p.id === id);
    if (!producto) return;

    // 2. Traemos lo que ya existe en el carrito del localStorage (usando tu clave "cart")
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    // 3. Lógica de Cantidades: Buscamos si el producto ya está en el carrito
    const itemExistente = cart.find((item: any) => item.id === id);

    if (itemExistente) {
        // Si ya existe, aumentamos la propiedad cantidad
        // (Asegurate que en tu interfaz CartItem exista 'cantidad')
        itemExistente.cantidad = (itemExistente.cantidad || 1) + 1;
    } else {
        // Si no existe, lo agregamos con cantidad inicial 1
        // Usamos el spread operator (...) para no modificar el objeto original de PRODUCTS
        cart.push({ ...producto, cantidad: 1 });
    }

    // 4. Guardamos de nuevo en localStorage (usando tu clave "cart")
    localStorage.setItem("cart", JSON.stringify(cart));

    // 5. Actualizamos el icono del carrito inmediatamente (tu función existente)
    actualizarBadgeCarrito();

    console.log(`Producto ${producto.nombre} actualizado. Cantidad total: ${itemExistente ? itemExistente.cantidad : 1}`);
};
/* Función para renderizar las cards de los productos */
const renderizarProductos = (productosParaMostrar: Product[]) => {
    if (!contenedorProductos) return;
    
    contenedorProductos.innerHTML = "";

    if (contadorProductos) {
        contadorProductos.innerText = `Mostrando ${productosParaMostrar.length} productos`;
    }

    if (productosParaMostrar.length === 0) {
        contenedorProductos.innerHTML = `<p class="no-products">No se encontraron productos en esta categoría.</p>`;
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

/**
 * Lógica de Filtrado por Categoría
 */
listaCategorias.forEach(enlace => {
    enlace.addEventListener("click", (e) => {
        e.preventDefault();

        listaCategorias.forEach(el => el.classList.remove("active"));
        enlace.classList.add("active");

        const categoriaId = enlace.getAttribute("data-category");
        const nombreCat = enlace.textContent;

        if (tituloCategoria) tituloCategoria.innerText = nombreCat || "Productos";

        if (categoriaId === "all") {
            renderizarProductos(PRODUCTS);
        } else {
            const filtrados = PRODUCTS.filter(p => 
                p.categorias.some(c => c.id === Number(categoriaId))
            );
            renderizarProductos(filtrados);
        }
    });
});

/**
 * Lógica del Buscador
 */
buscador?.addEventListener("input", () => {
    const query = buscador.value.toLowerCase();
    const filtrados = PRODUCTS.filter(p => 
        p.nombre.toLowerCase().includes(query)
    );
    renderizarProductos(filtrados);
});

// --- INICIALIZACIÓN ---
// 1. Mostramos todos los productos al cargar
renderizarProductos(PRODUCTS);
// 2. Sincronizamos el numerito del carrito al cargar por si ya había items
actualizarBadgeCarrito();