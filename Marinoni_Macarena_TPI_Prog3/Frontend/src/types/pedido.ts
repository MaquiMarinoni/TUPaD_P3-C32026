export interface IDetallePedido {
    idProducto: number;
    cantidad: number;
    subtotal: number;
}

export interface IPedido {
    id: number;
    fecha: string;       // Formato ISO "2024-05-20T10:00:00"
    estado: string;      // Ej: "PENDIENTE", "CONFIRMADO", "TERMINADO"
    total: number;
    formaPago: string;   // Ej: "EFECTIVO", "MERCADO_PAGO"
    idUsuario: number;
    detalles: IDetallePedido[];
}