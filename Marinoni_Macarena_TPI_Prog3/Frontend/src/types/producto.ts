export interface Product {
    id: number;
    nombre: string;
    precio: number;
    descripcion: string;
    stock: number;
    imagen: string;
    disponible: boolean;
    eliminado: boolean;
    categoriaId: number; // <- Identificador plano, como exige el F2
}