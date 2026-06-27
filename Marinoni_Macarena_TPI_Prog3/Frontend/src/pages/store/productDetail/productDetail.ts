import { getProductos } from "../../../services/dataService";
import { validarSesion } from "../../../utils/authGuard";

// Puede entrar ADMIN o CLIENT, pero trataremos el botón según rol
const userStr = localStorage.getItem("user");
const isAdmin = userStr ? JSON.parse(userStr).rol === "ADMIN" : false;

const container = document.getElementById("product-detail-container") as HTMLElement;

const actualizarBadgeCarrito = () => {
    if (isAdmin) {
        document.getElementById("cart-icon-container")!.style.display = "none";
        return;
    }
    const badge = document.getElementById("cart-count");
    if (!badge) return;
    const carrito = JSON.parse(localStorage.getItem("cart") || "[]");
    const cantidadTotal = carrito.reduce((sum: number, item: any) => sum + (item.cantidad || 1), 0);
    badge.innerText = cantidadTotal.toString();
};

const renderizarDetalle = async () => {
    // Obtenemos el ID de la URL (?id=X)
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');

    if (!idParam) {
        container.innerHTML = `<p style="color:red;">Error: No se especificó un producto.</p>`;
        return;
    }

    const productos = await getProductos();
    const producto = productos.find(p => p.id === Number(idParam));

    if (!producto) {
        container.innerHTML = `<div style="text-align:center; width:100%;">
            <h2>Producto no encontrado</h2>
            <a href="/src/pages/store/home/index.html" class="btn-primary">Volver al catálogo</a>
        </div>`;
        return;
    }

    const estaDisponible = producto.disponible !== false && producto.stock > 0;
    const estadoTexto = estaDisponible 
        ? `<span class="badge-success" style="background:#2ecc71; color:white; padding:5px 10px; border-radius:4px;">Disponible (${producto.stock} en stock)</span>` 
        : `<span class="badge-danger" style="background:#e74c3c; color:white; padding:5px 10px; border-radius:4px;">Agotado / No disponible</span>`;

    // Lógica del bloque de compra (solo para clientes y si hay stock)
    let bloqueCompra = "";
    if (isAdmin) {
        bloqueCompra = `<p style="color: var(--orange-primary); font-weight: bold;">[Modo Administrador - Compras Deshabilitadas]</p>`;
    } else if (estaDisponible) {
        bloqueCompra = `
            <div style="display: flex; align-items: center; gap: 15px; margin-top: 20px;">
                <label style="font-weight:bold;">Cantidad:</label>
                <input type="number" id="input-qty" value="1" min="1" max="${producto.stock}" style="width: 70px; padding: 10px; font-size: 16px; border: 1px solid #ccc; border-radius: 5px;">
                <button id="btn-add-cart" class="btn-primary" style="padding: 12px 25px; font-size: 16px;">
                    🛒 Agregar al Carrito
                </button>
            </div>
            <p id="msg-confirm" style="color: #2ecc71; font-weight: bold; margin-top: 10px; display: none;">¡Producto agregado exitosamente!</p>
        `;
    } else {
        bloqueCompra = `<button class="btn-primary" disabled style="background:#ccc; cursor:not-allowed; margin-top:20px;">Sin Stock</button>`;
    }

    container.innerHTML = `
        <div style="flex: 1;">
            <img src="/src/data/assets/${producto.imagen}" alt="${producto.nombre}" style="width: 100%; border-radius: 12px; object-fit: cover;" onerror="this.src='/src/data/assets/napo.jpg'">
        </div>
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
            <h1 style="margin-top: 0;">${producto.nombre}</h1>
            <div style="margin-bottom: 20px;">${estadoTexto}</div>
            <p style="font-size: 18px; color: #555; line-height: 1.6;">${producto.descripcion || 'Este producto no cuenta con descripción detallada en este momento.'}</p>
            <h2 style="color: var(--orange-primary); font-size: 32px; margin: 20px 0;">$${producto.precio.toLocaleString('es-AR')}</h2>
            
            ${bloqueCompra}

            <div style="margin-top: 40px;">
                <a href="/src/pages/store/home/index.html" style="color: #666; text-decoration: none; font-weight: bold;">
                    <i class="fas fa-arrow-left"></i> Volver al Catálogo
                </a>
            </div>
        </div>
    `;

    // Funcionalidad de agregar al carrito (con validación de stock final)
    if (!isAdmin && estaDisponible) {
        document.getElementById("btn-add-cart")?.addEventListener("click", () => {
            const qtyInput = document.getElementById("input-qty") as HTMLInputElement;
            let qty = parseInt(qtyInput.value);
            
            // Validación: No superar stock
            if (qty > producto.stock) {
                alert(`No puedes agregar más de ${producto.stock} unidades.`);
                qtyInput.value = producto.stock.toString();
                return;
            }
            if (qty < 1) qty = 1;

            const cart = JSON.parse(localStorage.getItem("cart") || "[]");
            const itemExistente = cart.find((item: any) => item.id === producto.id);

            if (itemExistente) {
                if ((itemExistente.cantidad + qty) > producto.stock) {
                    alert(`Solo quedan ${producto.stock} unidades en stock. Ya tienes ${itemExistente.cantidad} en tu carrito.`);
                    return;
                }
                itemExistente.cantidad += qty;
            } else {
                cart.push({ ...producto, cantidad: qty });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            actualizarBadgeCarrito();

            // Mensaje de confirmación temporal
            const msgConfirm = document.getElementById("msg-confirm") as HTMLElement;
            msgConfirm.style.display = "block";
            setTimeout(() => msgConfirm.style.display = "none", 3000);
        });
    }
};

document.getElementById("link-logout")?.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("user");
    window.location.href = "/src/pages/auth/login/index.html";
});

actualizarBadgeCarrito();
renderizarDetalle();