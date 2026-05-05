// src/pages/store/home/home.ts

import { PRODUCTS } from "../../data/data"; 
import type { Product } from "../../types/producto"; 

const app = document.getElementById("app")!;

// --- LÓGICA DEL CARRITO ---
function addToCart(product: Product) {
  // 1. Obtenemos el carrito del localStorage, o array vacío si no existe
  const cartString = localStorage.getItem("cart");
  const cart = cartString ? JSON.parse(cartString) : [];

  // 2. Buscamos si el producto ya existe
  const existingProductIndex = cart.findIndex((item: any) => item.id === product.id);

  if (existingProductIndex !== -1) {
    // Si existe, aumentamos cantidad
    cart[existingProductIndex].quantity += 1;
  } else {
    // Si es nuevo, lo agregamos con cantidad 1
    cart.push({ ...product, quantity: 1 });
  }

  // 3. Guardamos de nuevo en localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${product.nombre} agregado al carrito`);
}

// --- LÓGICA DE RENDERIZADO ---
function renderProducts() {
  app.innerHTML = ""; // Limpiamos el contenedor antes de dibujar

  const container = document.createElement("div");
  container.className = "catalog-container";

  PRODUCTS.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    
    // Aquí definimos el diseño de la tarjeta
    card.innerHTML = `
      <h3>${product.nombre}</h3>
      <p>Precio: $${product.precio}</p>
      <button class="add-btn" data-id="${product.id}">Agregar al carrito</button>
    `;
    container.appendChild(card);
  });

  app.appendChild(container);
}

// --- DELEGACIÓN DE EVENTOS (El "clic") ---
app.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;

  // Si hacemos clic en un botón con la clase "add-btn"
  if (target.classList.contains("add-btn")) {
    const productId = Number(target.getAttribute("data-id"));
    const product = PRODUCTS.find((p) => p.id === productId);
    
    if (product) {
      addToCart(product);
    }
  }
});

// Inicializamos la página
renderProducts();