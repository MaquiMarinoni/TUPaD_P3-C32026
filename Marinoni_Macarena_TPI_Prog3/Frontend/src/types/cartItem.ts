// Necesitamos que el sistema sepa qué es un "producto en el carrito". Un producto en el carrito es igual a un Product, pero con una propiedad extra: la cantidad. En lugar de copiar todas las propiedades de nuevo, usamos la herencia de interfaces
import { Product } from "./producto";

export interface CartItem extends Product {
    cantidad: number;
}