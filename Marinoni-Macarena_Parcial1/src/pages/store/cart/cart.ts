import { getCart } from "../../../utils/localStorage";

const cartItemsList = document.getElementById("cart-items") as HTMLUListElement;
const totalPriceElement = document.getElementById("total-price") as HTMLSpanElement;
const emptyMsg = document.getElementById("empty-cart-msg") as HTMLParagraphElement;

const renderCart = () => {
    const cart = getCart();

    // Estado vacío
    if (cart.length === 0) {
        emptyMsg.style.display = "block";
        return;
    }

    emptyMsg.style.display = "none";
    cartItemsList.innerHTML = "";

    let total = 0;

    cart.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${item.nombre}</span>
            <span>x${item.cantidad}</span>
            <span>$${item.precio * item.cantidad}</span>
        `;
        cartItemsList.appendChild(li);
        
        // Sumamos al total (HU-P1-05)
        total += item.precio * item.cantidad;
    });

    totalPriceElement.textContent = total.toFixed(2);
};

// Ejecutamos al cargar la página
renderCart();