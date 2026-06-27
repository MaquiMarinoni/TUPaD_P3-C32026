import { validarSesion } from "../../../utils/authGuard";

// Protegemos la ruta para que no entren admins ni deslogueados
validarSesion('CLIENT');

const cartItemsContainer = document.getElementById("cart-items") as HTMLElement;
const cartTotalElement = document.getElementById("cart-total") as HTMLElement;

// Función para renderizar el carrito leyendo del LocalStorage
const renderizarCarrito = () => {
    const carrito = JSON.parse(localStorage.getItem("cart") || "[]");
    
    if (carrito.length === 0) {
        cartItemsContainer.innerHTML = `<p style="text-align:center; padding: 40px; color:#666;">Tu carrito está vacío.</p>`;
        cartTotalElement.innerText = "0";
        return;
    }

    let total = 0;
    cartItemsContainer.innerHTML = "";

    carrito.forEach((item: any, index: number) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        const row = document.createElement("div");
        row.style.cssText = "display: flex; align-items: center; justify-content: space-between; padding: 15px; border-bottom: 1px solid #eee;";
        
        row.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px; flex: 2;">
                <img src="/src/data/assets/${item.imagen}" alt="${item.nombre}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;" onerror="this.src='/src/data/assets/napo.jpg'">
                <div>
                    <h4 style="margin: 0;">${item.nombre}</h4>
                    <p style="margin: 5px 0 0 0; color: #666;">$${item.precio.toLocaleString('es-AR')}</p>
                </div>
            </div>
            <div style="flex: 1; text-align: center;">
                <span style="font-weight: bold;">Cant: ${item.cantidad}</span>
            </div>
            <div style="flex: 1; text-align: right; font-weight: bold; color: var(--orange-primary);">
                $${subtotal.toLocaleString('es-AR')}
            </div>
            <button class="btn-delete" data-index="${index}" style="margin-left: 15px;">X</button>
        `;
        cartItemsContainer.appendChild(row);
    });

    cartTotalElement.innerText = total.toLocaleString('es-AR');

    // Botones para eliminar un producto del carrito
    document.querySelectorAll(".btn-delete").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = Number((e.target as HTMLElement).getAttribute("data-index"));
            carrito.splice(index, 1); // Borramos el elemento
            localStorage.setItem("cart", JSON.stringify(carrito));
            renderizarCarrito(); // Volvemos a pintar
        });
    });
};

// Cierre de sesión (igual que en el home)
document.getElementById("link-logout")?.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("user");
    window.location.href = "/src/pages/auth/login/index.html";
});

// Botón de Checkout
document.getElementById("btn-checkout")?.addEventListener("click", () => {
    const carrito = JSON.parse(localStorage.getItem("cart") || "[]");
    if (carrito.length === 0) {
        alert("Agrega productos al carrito antes de finalizar la compra.");
        return;
    }
    // ACÁ LUEGO CONECTAREMOS EL HITO F5 (Checkout Modal)
    alert("Iniciando proceso de pago... (A construir en el próximo paso)");
});

// Inicializar
renderizarCarrito();