package com.tup.programacion3.entities;

import java.util.Objects;

public class DetallePedido {
    private Long id; // Agregado explícitamente
    private int cantidad;
    private Double subtotal;
    private Producto producto;

    // Constructor completo
    public DetallePedido(Long id, int cantidad, Producto producto) {
        this.id = id;
        this.cantidad = cantidad;
        this.producto = producto;
        this.subtotal = calcularSubtotal();
    }

    public Double calcularSubtotal() {
        if (producto != null && producto.getPrecio() != null) {
            return this.cantidad * producto.getPrecio();
        }
        return 0.0;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public int getCantidad() { return cantidad; }
    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
        this.subtotal = calcularSubtotal();
    }

    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }

    public Producto getProducto() { return producto; }
    public void setProducto(Producto producto) {
        this.producto = producto;
        this.subtotal = calcularSubtotal();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DetallePedido that = (DetallePedido) o;
        return Objects.equals(producto, that.producto);
    }

    @Override
    public int hashCode() {
        return Objects.hash(producto);
    }

    @Override
    public String toString() {
        return "DetallePedido{" +
                "id=" + id +
                ", cantidad=" + cantidad +
                ", subtotal=" + subtotal +
                ", producto=" + (producto != null ? producto.getNombre() : "null") +
                '}';
    }
}