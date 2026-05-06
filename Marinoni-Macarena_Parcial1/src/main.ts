import type { IUser } from "../types/IUser";
import { productos, categorias } from "./data.ts";
import { Product, ICategory } from "./types/producto.ts";

// IMPORTAMOS EL SERVICIO
import { getLoggedUser, clearLoggedUser } from "./utils/localStorage.ts";

export const checkAuth = () => {
    const user = getLoggedUser(); // USAMOS EL SERVICIO
    const currentPath = window.location.pathname;

    if (currentPath.includes("/admin/")) {
        if (!user || user.role !== "admin") {
            alert("No tienes permisos.");
            window.location.href = "/src/pages/auth/login/index.html";
        }
    }

    if (currentPath.includes("/client/")) {
        if (!user) {
            window.location.href = "/src/pages/auth/login/index.html";
        }
    }
};

checkAuth();

// Lógica de Logout
const btnLogout = document.getElementById("btn-logout");
if (getLoggedUser()) { // USAMOS EL SERVICIO
    if (btnLogout) btnLogout.style.display = "block";
}

btnLogout?.addEventListener("click", () => {
    clearLoggedUser(); // USAMOS EL SERVICIO
    window.location.href = "/src/pages/auth/login/index.html";
});

// --- AL FINAL DEL ARCHIVO (Lógica de la tienda) ---


/**
 * RECUERDA: Solo ejecutamos la carga de productos si estamos en la Home.
 * Usamos el tipado de TS para los elementos del DOM.
 */

const contenedorProductos = document.getElementById("contenedor-productos");
if (contenedorProductos) {
    // Función para mostrar productos
    const renderizarProductos = (lista: Product[]) => {
        contenedorProductos.innerHTML = "";
        lista.forEach((p: Product) => {
            contenedorProductos.innerHTML += `
                <div class="producto-card">
                    <img src="${p.imagen}" alt="${p.nombre}">
                    <h3>${p.nombre}</h3>
                    <p>${p.descripcion}</p>
                    <span>$${p.precio}</span>
                    <button>Agregar</button>
                </div>
            `;
        });
    };

    // Renderizamos todos al cargar
    renderizarProductos(productos);
}

// ¿Por qué unificar?
// Porque Vite compila un solo punto de entrada. Al tener seguridad y
// vista en el mismo lugar, garantizamos que no se carguen productos
// si el usuario no pasó el filtro de checkAuth().

const contenedorCategorias = document.getElementById("lista-categorias");
if (contenedorCategorias) {
    // Usamos 'categorias' que viene de data.ts, ¡así ya no dará error!
    categorias.forEach((categoria: ICategory) => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="#" class="enlace-categoria">${categoria.nombre}</a>`;
        contenedorCategorias.appendChild(li);
    });
}