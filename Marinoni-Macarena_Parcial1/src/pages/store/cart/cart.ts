import { getCart, removeFromCart, clearCart, saveCart } from "../../../utils/localStorage";
import type { Product } from "../../../types/producto";

// Definimos una interfaz local para manejar la cantidad dentro del carrito
interface CartItem extends Product {
    cantidad: number;
}

// 1. Seleccionamos los elementos del DOM basándonos en tu nuevo HTML
const cartItemsContainer = document.getElementById("cart-items-container");
const subtotalElement = document.getElementById("cart-subtotal");
const totalElement = document.getElementById("cart-total-final");
const badgeElement = document.getElementById("cart-count");
const btnVaciar = document.getElementById("btn-vaciar-carrito");

/**
 * Actualiza el número en el icono del carrito del Header
 */
const actualizarBadge = () => {
    const cart = getCart() as CartItem[];
    if (badgeElement) {
        const totalItems = cart.reduce((acc, item) => acc + (item.cantidad || 1), 0);
        badgeElement.innerText = totalItems.toString();
    }
};

/**
 * Función principal para dibujar el carrito
 */
const renderCart = () => {
    if (!cartItemsContainer) return;
    
    const cart = getCart() as CartItem[];

    // Si el carrito está vacío
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-message">
                <p>Tu carrito está vacío.</p>
                <a href="../home/index.html" class="btn-primary">Ir a la tienda</a>
            </div>
        `;
        if (subtotalElement) subtotalElement.innerText = "$0";
        if (totalElement) totalElement.innerText = "$0";
        actualizarBadge();
        return;
    }

    cartItemsContainer.innerHTML = ""; // Limpiamos la lista
    let totalGeneral = 0;

    cart.forEach((item, index) => {
        // Aseguramos que tenga cantidad mínima de 1
        const cantidad = item.cantidad || 1;
        const subtotalProducto = item.precio * cantidad;
        totalGeneral += subtotalProducto;

        const itemCard = document.createElement("div");
        itemCard.className = "cart-item-card";
        itemCard.innerHTML = `
            <img src="../../../data/assets/${item.imagen}" alt="${item.nombre}" class="item-img-mini">
            <div class="item-info-main">
                <h4>${item.nombre}</h4>
                <p class="item-cat-tag">Producto</p>
                <p class="item-subtotal-text">Subtotal: <strong>$${subtotalProducto.toLocaleString('es-AR')}</strong></p>
            </div>
            <div class="item-controls-wrapper">
                <div class="qty-selector">
                    <button class="btn-qty" data-index="${index}" data-action="minus">-</button>
                    <span class="qty-num">${cantidad}</span>
                    <button class="btn-qty" data-index="${index}" data-action="plus">+</button>
                </div>
                <button class="btn-delete-text" data-index="${index}">Eliminar</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemCard);
    });

    // Actualizamos los montos en el resumen lateral
    if (subtotalElement) subtotalElement.innerText = `$${totalGeneral.toLocaleString('es-AR')}`;
    if (totalElement) totalElement.innerText = `$${totalGeneral.toLocaleString('es-AR')}`;
    
    actualizarBadge();
    asignarEventos();
};

/**
 * Asigna los eventos a los botones generados dinámicamente
 */
const asignarEventos = () => {
    const cart = getCart() as CartItem[];

    // Botones de cantidad (+ y -)
    document.querySelectorAll(".btn-qty").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const target = e.target as HTMLButtonElement;
            const index = Number(target.dataset.index);
            const action = target.dataset.action;

            if (action === "plus") {
                cart[index].cantidad = (cart[index].cantidad || 1) + 1;
            } else if (action === "minus" && cart[index].cantidad > 1) {
                cart[index].cantidad -= 1;
            }

            saveCart(cart); // Guardamos el array actualizado en localStorage
            renderCart();   // Refrescamos la vista
        });
    });

    // Enlaces de "Eliminar"
    document.querySelectorAll(".btn-delete-text").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const target = e.target as HTMLButtonElement;
            const index = Number(target.dataset.index);
            
            // Usamos tu función existente de utils pero pasándole el ID
            const itemAEliminar = cart[index];
            removeFromCart(itemAEliminar.id); 
            
            renderCart();
        });
    });
};

// Botón Vaciar Carrito completo
btnVaciar?.addEventListener("click", () => {
    if (confirm("¿Estás seguro de que deseas vaciar todo el carrito?")) {
        clearCart();
        renderCart();
    }
});

// Inicialización al cargar la página
renderCart();