
import { IUser } from "../types/IUser";
import { CartItem } from "../types/cartItem";
import { Product } from "../types/producto";

// Función para obtener usuarios (para el registro/login)
export const getUsers = (): IUser[] => {
    const usersRaw = localStorage.getItem("users");
    return usersRaw ? JSON.parse(usersRaw) : [];
};

// Función para guardar usuarios
export const saveUsers = (users: IUser[]): void => {
    localStorage.setItem("users", JSON.stringify(users));
};

// Función para obtener el usuario logueado
export const getLoggedUser = (): IUser | null => {
    const userRaw = localStorage.getItem("userData");
    return userRaw ? JSON.parse(userRaw) : null;
};

// Función para guardar el usuario logueado
export const saveLoggedUser = (user: IUser): void => {
    localStorage.setItem("userData", JSON.stringify(user));
};

// Función para cerrar sesión
export const clearLoggedUser = (): void => {
    localStorage.removeItem("userData");
};



// --- NUEVAS FUNCIONES PARA EL CARRITO ---

export const getCart = (): CartItem[] => {
    const cartRaw = localStorage.getItem("cart");
    return cartRaw ? JSON.parse(cartRaw) : [];
};

export const saveCart = (cart: CartItem[]): void => {
    localStorage.setItem("cart", JSON.stringify(cart));
};

export const addToCart = (product: Product): void => {
    const cart = getCart();
    // Buscamos si ya existe el producto
    const existingIndex = cart.findIndex((item) => item.id === product.id);

    if (existingIndex >= 0) {
        cart[existingIndex].cantidad += 1;
    } else {
        cart.push({ ...product, cantidad: 1 });
    }
    
    saveCart(cart);
    alert(`${product.nombre} agregado al carrito!`);
};