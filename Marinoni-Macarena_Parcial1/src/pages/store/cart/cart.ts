// src/pages/store/cart/cart.ts
import { getCart, removeFromCart, clearCart } from "../../../utils/localStorage";

const cartItemsList = document.getElementById("cart-items") as HTMLUListElement;
const totalPriceElement = document.getElementById("total-price") as HTMLSpanElement;
const emptyMsg = document.getElementById("empty-cart-msg") as HTMLParagraphElement;

// Seleccionamos el botón de vaciar (asegúrate de tener un botón con este ID en tu HTML)
const btnClearCart = document.getElementById("btn-clear-cart");

const renderCart = () => {
    const cart = getCart();

    if (cart.length === 0) {
        if (emptyMsg) emptyMsg.style.display = "block";
        if (cartItemsList) cartItemsList.innerHTML = "";
        if (totalPriceElement) totalPriceElement.textContent = "0";
        return;
    }

    if (emptyMsg) emptyMsg.style.display = "none";
    cartItemsList.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const li = document.createElement("li");
        li.className = "cart-item";
        li.innerHTML = `
            <span><strong>${item.nombre}</strong></span>
            <span>x${item.cantidad}</span>
            <span>$${(item.precio * item.cantidad).toLocaleString()}</span>
            <button class="btn-delete" data-id="${item.id}">Eliminar</button>
        `;
        
        // Evento para eliminar un solo producto
        li.querySelector(".btn-delete")?.addEventListener("click", () => {
            removeFromCart(item.id);
            renderCart(); // Re-renderizamos para ver el cambio al instante
        });

        cartItemsList.appendChild(li);
        total += item.precio * item.cantidad;
    });

    totalPriceElement.textContent = total.toLocaleString();
};

// Evento para vaciar todo
btnClearCart?.addEventListener("click", () => {
    if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
        clearCart();
        renderCart();
    }
});

renderCart();