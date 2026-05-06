// src/pages/store/cart/cart.ts
import { getCart, removeFromCart, clearCart } from "../../../utils/localStorage";

const emptyView = document.getElementById("empty-cart-view") as HTMLElement;
const fullView = document.getElementById("full-cart-view") as HTMLElement;
const cartItemsList = document.getElementById("cart-items") as HTMLElement;
const totalPriceElement = document.getElementById("total-price") as HTMLElement;
const btnClearCart = document.getElementById("btn-clear-cart");

const renderCart = () => {
    const cart = getCart();

    // LÓGICA DE VISIBILIDAD
    if (cart.length === 0) {
        emptyView.style.display = "flex"; // Mostramos el vacío
        fullView.style.display = "none";  // Ocultamos el lleno
        return;
    }

    emptyView.style.display = "none";
    fullView.style.display = "block";
    
    cartItemsList.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <div>
                <strong>${item.nombre}</strong><br>
                <small>$${item.precio} x ${item.cantidad}</small>
            </div>
            <div>
                <strong>$${(item.precio * item.cantidad).toLocaleString()}</strong>
                <button class="btn-delete" data-id="${item.id}">Eliminar</button>
            </div>
        `;
        
        div.querySelector(".btn-delete")?.addEventListener("click", () => {
            removeFromCart(item.id);
            renderCart();
        });

        cartItemsList.appendChild(div);
        total += item.precio * item.cantidad;
    });

    totalPriceElement.textContent = total.toLocaleString();
};

btnClearCart?.addEventListener("click", () => {
    if (confirm("¿Vaciar todo el carrito?")) {
        clearCart();
        renderCart();
    }
});

renderCart();