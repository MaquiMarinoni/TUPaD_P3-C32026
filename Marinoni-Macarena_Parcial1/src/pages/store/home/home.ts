import { PRODUCTS } from "../../../data";
import type { Product } from "../../../types/producto";

// 1. Seleccionamos los elementos del DOM
const contenedorProductos = document.getElementById("product-container");
const listaCategorias = document.querySelectorAll(".enlace-categoria");
const tituloCategoria = document.getElementById("category-title");
const contadorProductos = document.getElementById("product-count");
const buscador = document.getElementById("search-input") as HTMLInputElement;

/**
 * Función para renderizar las cards de los productos
 */
const renderizarProductos = (productosParaMostrar: Product[]) => {
    if (!contenedorProductos) return;
    
    // Limpiamos el contenedor
    contenedorProductos.innerHTML = "";

    // Actualizamos el contador
    if (contadorProductos) {
        contadorProductos.innerText = `Mostrando ${productosParaMostrar.length} productos`;
    }

    // Si no hay productos, mostramos un mensaje
    if (productosParaMostrar.length === 0) {
        contenedorProductos.innerHTML = `<p class="no-products">No se encontraron productos en esta categoría.</p>`;
        return;
    }

    // Creamos las cards
    productosParaMostrar.forEach(producto => {
        const card = document.createElement("div");
        card.className = "producto-card";
        card.innerHTML = `
            <img src="../../../assets/pizza.jpg" alt="${producto.nombre}">
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

        // 1. Manejo de clases active
        listaCategorias.forEach(el => el.classList.remove("active"));
        enlace.classList.add("active");

        const categoriaId = enlace.getAttribute("data-category");
        const nombreCat = enlace.textContent;

        // 2. Actualizamos el título de la sección
        if (tituloCategoria) tituloCategoria.innerText = nombreCat || "Productos";

        // 3. Filtramos el array de data.ts
        if (categoriaId === "all") {
            renderizarProductos(PRODUCTS);
        } else {
            // Filtramos comparando el ID de categoría (data.ts usa un array de categorías en cada producto)
            const filtrados = PRODUCTS.filter(p => 
                p.categorias.some(c => c.id === Number(categoriaId))
            );
            renderizarProductos(filtrados);
        }
    });
});

/**
 * Lógica del Buscador (Extra para que sea pro)
 */
buscador?.addEventListener("input", () => {
    const query = buscador.value.toLowerCase();
    const filtrados = PRODUCTS.filter(p => 
        p.nombre.toLowerCase().includes(query)
    );
    renderizarProductos(filtrados);
});

// Inicializamos la página mostrando todos los productos
renderizarProductos(PRODUCTS);