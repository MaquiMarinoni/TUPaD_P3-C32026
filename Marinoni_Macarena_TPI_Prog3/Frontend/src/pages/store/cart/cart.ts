import { getCart, saveCart, clearCart, removeFromCart } from "../../../utils/localStorage";
import type { CartItem } from "../../../types/cartItem";
import { validarSesion } from "../../../utils/authGuard";

// --- F4.2: VALIDACIÓN DE ROL ---
// Solo los clientes (USUARIO) tienen acceso al carrito de compras.
const usuarioLogueado = validarSesion('USUARIO');

const btnVaciar = document.getElementById("btn-vaciar");

// (Asumimos que aquí tienes tu función renderCart que dibuja el HTML)
// const renderCart = () => { ... }

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
            // renderCart();   // Refrescamos la vista (Descomenta cuando tengas la función en este archivo)
        });
    });

    // Enlaces de "Eliminar"
    document.querySelectorAll(".btn-delete-text").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const target = e.target as HTMLButtonElement;
            const index = Number(target.dataset.index);
            
            // Usamos tu función existente de utils pasándole el ID
            const itemAEliminar = cart[index];
            if (itemAEliminar && itemAEliminar.id) {
                removeFromCart(itemAEliminar.id); 
            }
            
            // renderCart(); // Refrescamos la vista
        });
    });
};

// Botón Vaciar Carrito completo
btnVaciar?.addEventListener("click", () => {
    if (confirm("¿Estás seguro de que deseas vaciar todo el carrito?")) {
        clearCart();
        // renderCart(); // Refrescamos la vista
    }
});

// Inicialización al cargar la página (solo si pasó la validación)
if (usuarioLogueado) {
    // renderCart(); 
    // Si tu renderCart no llama a asignarEventos internamente, llámalo aquí:
    asignarEventos();
}