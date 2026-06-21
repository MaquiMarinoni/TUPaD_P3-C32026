import { Product } from "../types/producto";
import { ICategory } from "../types/categoria";

export const getProductos = async (): Promise<Product[]> => {
    const res = await fetch('/data/productos.json');
    if (!res.ok) throw new Error("No se pudieron cargar los productos");
    return await res.json();
};

export const getCategorias = async (): Promise<ICategory[]> => {
    const res = await fetch('/data/categorias.json');
    if (!res.ok) throw new Error("No se pudieron cargar las categorías");
    return await res.json();
};