// IMPORTACIONES
// import { IUser } from "./types/IUser";
import { PRODUCTS } from "./data";
import { categorias } from "./data";

import { Product } from "./types/producto";
import { ICategory } from "./types/categoria";

// import { navigate } from "./utils/navigate.ts";

// IMPORTAMOS EL SERVICIO
import { getLoggedUser, clearLoggedUser, addToCart } from "./utils/localStorage.ts";

// --- LÓGICA DE PROTECCIÓN (Check Auth) ---
export const checkAuth = () => {
    const user = getLoggedUser(); 
    const currentPath = window.location.pathname;

    // Protegemos rutas admin
    if (currentPath.includes("/admin/")) {
        if (!user || user.role !== "admin") {
            alert("No tienes permisos.");
            window.location.href = "/src/pages/auth/login/index.html";
        }
    }

    // Protegemos rutas de cliente
    if (currentPath.includes("/client/")) {
        if (!user) {
            window.location.href = "/src/pages/auth/login/index.html";
        }
    }
};

checkAuth();

// --- LÓGICA DE LOGOUT (Segura) ---
const btnLogout = document.getElementById("btn-logout");
if (btnLogout) {
    if (getLoggedUser()) {
        btnLogout.style.display = "block";
        btnLogout.addEventListener("click", () => {
            clearLoggedUser();
            window.location.href = "/src/pages/auth/login/index.html";
        });
    }
}

// --- LÓGICA DE LA TIENDA (Renderizado Seguro) ---

// 1. Renderizado de Productos
const contenedorProductos = document.getElementById("contenedor-productos");

if (contenedorProductos) {
    const renderizarProductos = (lista: Product[]) => {
        contenedorProductos.innerHTML = "";
        lista.forEach((p: Product) => {
            const div = document.createElement("div");
            div.className = "producto-card";
            div.innerHTML = `
                <img src="${p.imagen}" alt="${p.nombre}">
                <h3>${p.nombre}</h3>
                <p>${p.descripcion}</p>
                <span>$${p.precio}</span>
                <button class="btn-agregar">Agregar</button>
            `;

            const btn = div.querySelector(".btn-agregar");
            btn?.addEventListener("click", () => {
                addToCart(p);
            });

            contenedorProductos.appendChild(div);
        });
    };

    renderizarProductos(PRODUCTS);
}

// 2. Renderizado de Categorías
const contenedorCategorias = document.getElementById("lista-categorias");

if (contenedorCategorias) {
    categorias.forEach((categoria: ICategory) => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="#" class="enlace-categoria">${categoria.nombre}</a>`;
        contenedorCategorias.appendChild(li);
    });
}