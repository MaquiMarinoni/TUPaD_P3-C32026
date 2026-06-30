import { getProductos, getCategorias } from "../../../services/dataService";

// 1. Variables globales y validación de usuario actual
const detalleContainer = document.getElementById("detalle-container") as HTMLElement;
const userStr = localStorage.getItem("user");
const user = userStr ? JSON.parse(userStr) : null;
const isAdmin = user?.rol === "ADMIN";

// 2. Manejo del ícono del carrito en la barra superior
const actualizarBadgeCarrito = () => {
    if (isAdmin) return; // El admin no usa carrito
    const badge = document.getElementById("cart-count");
    if (!badge) return;
    const carrito = JSON.parse(localStorage.getItem("cart") || "[]");
    const cantidadTotal = carrito.reduce((sum: number, item: any) => sum + (item.cantidad || 1), 0);
    badge.innerText = cantidadTotal.toString();
};

// 3. Renderizar la tarjeta del producto
const renderizarDetalle = async () => {
    // Obtenemos el ID de la URL (ej: localhost:5173/.../index.html?id=5)
    const params = new URLSearchParams(window.location.search);
    const productoId = Number(params.get("id"));

    if (!productoId) {
        detalleContainer.innerHTML = `<h2 style="text-align:center; color:#e74c3c;">Error: No se seleccionó ningún producto.</h2>`;
        return;
    }

    const productos = await getProductos();
    const categorias = await getCategorias();

    // Buscamos el producto asegurándonos de que no esté eliminado lógicamente
    const producto = productos.find(p => p.id === productoId && p.eliminado !== true);

    if (!producto) {
        detalleContainer.innerHTML = `<div style="text-align:center; padding: 50px;">
            <h2>El producto no existe o fue eliminado.</h2>
            <a href="/src/pages/store/home/index.html" style="color: var(--orange-primary);">Volver al catálogo</a>
        </div>`;
        return;
    }

    // Buscamos su categoría para mostrar la etiqueta
    const categoria = categorias.find(c => c.id === Number(producto.categoriaId));
    const nombreCat = categoria ? categoria.nombre : "General";
    
    const stockReal = producto.stock || 0;
    const tieneStock = stockReal > 0 && producto.disponible !== false;

    // LÓGICA DE BOTONES: ¿Qué mostramos según quién mira la pantalla?
    let botonHTML = "";
    if (isAdmin) {
        botonHTML = `<p style="background: #fff3cd; color: #856404; padding: 15px; border-radius: 8px; text-align: center; font-weight: bold; margin: 0;">Modo Administrador: No puedes comprar.</p>`;
    } else if (!user) {
        botonHTML = `<a href="/src/pages/auth/login/index.html" class="btn-agregar">Iniciá sesión para comprar</a>`;
    } else if (!tieneStock) {
        botonHTML = `<button class="btn-agregar" disabled>Agotado / Sin Stock</button>`;
    } else {
        botonHTML = `<button id="btn-add-cart" class="btn-agregar">Agregar al Carrito</button>`;
    }

    // Inyectamos el diseño en el HTML
    detalleContainer.innerHTML = `
        <div class="detail-card">
            <div class="detail-img-wrapper">
                <img src="/src/data/assets/${producto.imagen}" alt="${producto.nombre}" onerror="this.src='/src/data/assets/napo.jpg'">
            </div>
            <div class="detail-info">
                <span class="badge-cat">${nombreCat}</span>
                <h1 class="detail-title">${producto.nombre}</h1>
                <p class="detail-desc">${producto.descripcion || 'Sin descripción detallada.'}</p>
                <p class="detail-price">$${producto.precio.toLocaleString('es-AR')}</p>
                <p class="detail-stock">${tieneStock ? `Stock disponible: ${stockReal} unidades` : '<span style="color:#e74c3c; font-weight:bold;">Sin unidades disponibles</span>'}</p>
                ${botonHTML}
            </div>
        </div>
    `;

    // 4. Asignar el evento de "Agregar al carrito" si corresponde
    if (user && !isAdmin && tieneStock) {
        document.getElementById("btn-add-cart")?.addEventListener("click", () => {
            const cart = JSON.parse(localStorage.getItem("cart") || "[]");
            const itemExistente = cart.find((item: any) => item.id === producto.id);

            // Verificamos no pasarnos del stock
            if (itemExistente) {
                if (itemExistente.cantidad < stockReal) {
                    itemExistente.cantidad++;
                } else {
                    alert(`¡Stock máximo alcanzado! Solo quedan ${stockReal} unidades.`);
                    return;
                }
            } else {
                cart.push({ ...producto, cantidad: 1 });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            actualizarBadgeCarrito();
            alert(`¡Agregaste "${producto.nombre}" a tu carrito! 🛒`);
        });
    }
};

// --- INICIALIZACIÓN ---
const init = () => {
    // Configuramos la barra superior según el usuario
    if (user) {
        if (isAdmin) {
            document.getElementById("link-carrito")!.style.display = "none";
        } else {
            document.getElementById("link-mis-pedidos")!.style.display = "inline-block";
            actualizarBadgeCarrito();
        }
    }
    renderizarDetalle();
};

init();