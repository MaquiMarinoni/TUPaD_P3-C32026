// src/types/product.ts
import type { ICategory } from "./categoria"; // Al estar en la misma carpeta, usamos ./

export interface Product {
  id: number;
  eliminado: boolean;
  createdAt: string;
  nombre: string;
  precio: number;
  descripcion: string;
  stock: number;
  imagen: string;
  disponible: boolean;
  categorias: ICategory[];
}