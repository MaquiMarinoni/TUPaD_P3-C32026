package com.tup.programacion3.entities;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class DetallePedido {

    private Long id;
    private int cantidad;
    private Double subtotal;

    @EqualsAndHashCode.Include // REGLA: Comparar solo por 'producto'
    private Producto producto;

    // =========================================================================
    // Mantengo lógica de negocio intacta
    // =========================================================================
    public Double calcularSubtotal() {
        if (producto != null && producto.getPrecio() != null) {
            return this.cantidad * producto.getPrecio();
        }
        return 0.0;
    }

    // Dejo estos setters personalizados para que calculen el subtotal automáticamente.
    // Lombok generará los setters de 'id' y 'subtotal', pero respetará estos dos.
    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
        this.subtotal = calcularSubtotal();
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
        this.subtotal = calcularSubtotal();
    }
}