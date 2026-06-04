package com.tup.programacion3.entities;

import java.util.Objects;

public class DetallePedido extends Base {
    private int cantidad;
    private Double subtotal;
    private Producto producto; // Relación con Producto

    // Constructor completo
    public DetallePedido(Long id, int cantidad, Producto producto) {
        super(id);
        this.cantidad = cantidad;
        this.producto = producto;
        this.subtotal = calcularSubtotal(); // Se calcula automáticamente al crearse
    }

    // Método interno para calcular el subtotal sin errores manuales
    public Double calcularSubtotal() {
        if (producto != null && producto.getPrecio() != null) {
            return this.cantidad * producto.getPrecio();
        }
        return 0.0;
    }

    // Getters y Setters
    public int getCantidad() { return cantidad; }
    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
        this.subtotal = calcularSubtotal(); // Si cambia la cantidad, se recalcula el subtotal
    }

    public Double getSubtotal() { return subtotal; }

    public Producto getProducto() { return producto; }
    public void setProducto(Producto producto) {
        this.producto = producto;
        this.subtotal = calcularSubtotal(); // Si cambia el producto, cambia el subtotal
    }

    // =========================================================================
    // Métodos de Identidad (Consideramos detalles iguales si apuntan al mismo producto)
    // =========================================================================
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DetallePedido queDetalle = (DetallePedido) o;
        return Objects.equals(producto, queDetalle.producto);
    }

    @Override
    public int hashCode() {
        return Objects.hash(producto);
    }

    // =========================================================================
    // toString()
    // =========================================================================
    @Override
    public String toString() {
        return "DetallePedido{" +
                "id=" + getId() +
                ", producto=" + (producto != null ? producto.getNombre() : "Null") +
                ", cantidad=" + cantidad +
                ", subtotal=$" + subtotal +
                '}';
    }
}