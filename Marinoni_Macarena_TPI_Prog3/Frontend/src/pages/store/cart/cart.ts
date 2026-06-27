import { validarSesion } from "../../../utils/authGuard";
import { getProductos } from "../../../services/dataService";

const usuarioLogueado = validarSesion('CLIENT');

const COSTO_ENVIO_FIJO = 2500;

const cartItemsContainer = document.getElementById("cart-items") as HTMLElement;
const subtotalElement = document.getElementById("cart-subtotal") as HTMLElement;
const shippingElement = document.getElementById("cart-shipping") as HTMLElement;
const totalElement = document.getElementById("cart-total") as HTMLElement;

// Elementos del Checkout
const checkoutModal = document.getElementById("checkout-modal") as HTMLElement;
const checkoutForm = document.getElementById("checkout-form") as HTMLFormElement;
let totalFinalPedido = 0; // Guardamos el total para usarlo al crear la orden

const renderizarCarrito = async () => {
    const carrito = JSON.parse(localStorage.getItem("cart") || "[]");
    
    if (carrito.length === 0) {
        cartItemsContainer.innerHTML = `
            <div style="text-align:center; padding: 60px 20px; background:#f8f9fa; border-radius:8px;">
                <h3 style="color:#666; margin-bottom: 20px;">🛒 Tu carrito está vacío.</h3>
                <a href="/src/pages/store/home/index.html" class="btn-primary" style="text-decoration:none; display:inline-block;">Ir al Catálogo</a>
            </div>`;
        subtotalElement.innerText = "0";
        shippingElement.innerText = "0";
        totalElement.innerText = "0";
        document.getElementById("btn-checkout")?.setAttribute("disabled", "true");
        return;
    }

    document.getElementById("btn-checkout")?.removeAttribute("disabled");
    const productosReales = await getProductos();

    let subtotal = 0;
    cartItemsContainer.innerHTML = "";

    carrito.forEach((item: any, index: number) => {
        const prodDB = productosReales.find(p => p.id === item.id);
        const stockReal = prodDB ? prodDB.stock : 0;
        
        const subtotalItem = item.precio * item.cantidad;
        subtotal += subtotalItem;

        const row = document.createElement("div");
        row.style.cssText = "display: flex; align-items: center; justify-content: space-between; padding: 15px; border-bottom: 1px solid #eee;";
        
        row.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px; flex: 2;">
                <img src="/src/data/assets/${item.imagen}" alt="${item.nombre}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;" onerror="this.src='/src/data/assets/napo.jpg'">
                <div>
                    <h4 style="margin: 0;">${item.nombre}</h4>
                    <p style="margin: 5px 0 0 0; color: #666;">$${item.precio.toLocaleString('es-AR')}</p>
                    <small style="color:#888;">Stock disp: ${stockReal}</small>
                </div>
            </div>
            
            <div style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <button class="btn-restar" data-index="${index}" style="width: 30px; height: 30px; border-radius: 50%; border:1px solid #ccc; background:#fff; cursor:pointer;">-</button>
                <span style="font-weight: bold; font-size:16px; width:20px; text-align:center;">${item.cantidad}</span>
                <button class="btn-sumar" data-index="${index}" data-stock="${stockReal}" style="width: 30px; height: 30px; border-radius: 50%; border:1px solid #ccc; background:#fff; cursor:pointer;">+</button>
            </div>

            <div style="flex: 1; text-align: right; font-weight: bold; color: var(--orange-primary);">
                $${subtotalItem.toLocaleString('es-AR')}
            </div>
            
            <button class="btn-delete" data-index="${index}" style="margin-left: 20px; color:#e74c3c; border:none; background:none; cursor:pointer; font-size:18px;">🗑️</button>
        `;
        cartItemsContainer.appendChild(row);
    });

    totalFinalPedido = subtotal + COSTO_ENVIO_FIJO;

    subtotalElement.innerText = subtotal.toLocaleString('es-AR');
    shippingElement.innerText = COSTO_ENVIO_FIJO.toLocaleString('es-AR');
    totalElement.innerText = totalFinalPedido.toLocaleString('es-AR');

    asignarEventosCarrito(carrito);
};

const asignarEventosCarrito = (carrito: any[]) => {
    document.querySelectorAll(".btn-delete").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = Number((e.currentTarget as HTMLElement).getAttribute("data-index"));
            carrito.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(carrito));
            renderizarCarrito();
        });
    });

    document.querySelectorAll(".btn-sumar").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const target = e.currentTarget as HTMLElement;
            const index = Number(target.getAttribute("data-index"));
            const stockReal = Number(target.getAttribute("data-stock"));
            
            if (carrito[index].cantidad < stockReal) {
                carrito[index].cantidad++;
                localStorage.setItem("cart", JSON.stringify(carrito));
                renderizarCarrito();
            } else {
                alert(`No puedes agregar más. El stock máximo es ${stockReal}.`);
            }
        });
    });

    document.querySelectorAll(".btn-restar").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = Number((e.currentTarget as HTMLElement).getAttribute("data-index"));
            if (carrito[index].cantidad > 1) {
                carrito[index].cantidad--;
                localStorage.setItem("cart", JSON.stringify(carrito));
                renderizarCarrito();
            }
        });
    });
};

document.getElementById("btn-clear-cart")?.addEventListener("click", () => {
    if(confirm("¿Estás seguro de que deseas vaciar tu carrito?")) {
        localStorage.removeItem("cart");
        renderizarCarrito();
    }
});

// --- LÓGICA DE CHECKOUT (F6.1) ---

document.getElementById("btn-checkout")?.addEventListener("click", () => {
    const carrito = JSON.parse(localStorage.getItem("cart") || "[]");
    if (carrito.length === 0) return;
    checkoutModal.style.display = "flex"; // Abrimos el modal
});

document.getElementById("close-checkout")?.addEventListener("click", () => {
    checkoutModal.style.display = "none";
});

checkoutForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!usuarioLogueado) return;

    const formData = new FormData(checkoutForm);
    const carrito = JSON.parse(localStorage.getItem("cart") || "[]");

    // 1. Armamos el objeto de la orden tal cual está en pedidos.json
    const nuevaOrden = {
        id: Math.floor(Math.random() * 90000) + 10000, // Genera ID aleatorio de 5 dígitos
        fecha: new Date().toISOString().replace('T', ' ').slice(0, 19), // Ej: "2024-05-20 10:00:00"
        estado: "PENDIENTE",
        total: totalFinalPedido,
        formaPago: formData.get("formaPago"),
        idUsuario: usuarioLogueado.id,
        detalles: carrito.map((item: any) => ({
            idProducto: item.id,
            cantidad: item.cantidad,
            subtotal: item.precio * item.cantidad
        }))
    };

    // 2. Guardamos la orden en el localStorage de "crud_pedidos" (Nuestro dataService lo lee de ahí)
    const pedidosLocales = JSON.parse(localStorage.getItem("crud_pedidos") || "[]");
    pedidosLocales.push(nuevaOrden);
    localStorage.setItem("crud_pedidos", JSON.stringify(pedidosLocales));

    // 3. Vaciamos el carrito de compras
    localStorage.removeItem("cart");

    // 4. Mensaje de éxito
    alert(`¡Pedido #${nuevaOrden.id} confirmado con éxito! Redirigiendo a tus pedidos...`);

    // 5. Redirección a "Mis Pedidos"
    window.location.href = "/src/pages/client/orders/index.html";
});

document.getElementById("link-logout")?.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("user");
    window.location.href = "/src/pages/auth/login/index.html";
});

renderizarCarrito();