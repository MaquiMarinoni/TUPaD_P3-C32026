package com.tup.programacion3.entities;

import com.tup.programacion3.enums.Estado;
import com.tup.programacion3.enums.FormaPago;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

// Interfaz requerida por el diagrama UML
interface Calculable {
    void calcularTotal();
}

public class Pedido implements Calculable {
    private Long id;
    private LocalDate fecha;
    private Estado estado;
    private Double total;
    private FormaPago formaPago;
    private Usuario usuario;
    private Set<DetallePedido> detalles; // Colección de tipo Set

    // Constructor completo
    public Pedido(Long id, FormaPago formaPago, Usuario usuario) {
        this.id = id;
        this.fecha = LocalDate.now(); // Se genera automáticamente con la fecha de hoy
        this.estado = Estado.PENDIENTE;
        this.formaPago = formaPago;
        this.usuario = usuario;
        this.detalles = new HashSet<>(); // Inicializamos el Set vacío
        this.total = 0.0;
    }

    // =========================================================================
    // Métodos de lógica de negocio requeridos por el diagrama UML
    // =========================================================================

    public void addDetallePedido(int cantidad, Producto producto) {
        DetallePedido nuevoDetalle = new DetallePedido(null, cantidad, producto);

        // Si el Set ya tiene este producto, buscamos el detalle existente y le sumamos la cantidad
        if (detalles.contains(nuevoDetalle)) {
            DetallePedido existente = findDetallePedidoByProducto(producto);
            if (existente != null) {
                existente.setCantidad(existente.getCantidad() + cantidad);
            }
        } else {
            detalles.add(nuevoDetalle);
        }
        calcularTotal(); // Recalculamos el total automáticamente al mutar el Set
    }

    public DetallePedido findDetallePedidoByProducto(Producto producto) {
        for (DetallePedido dp : detalles) {
            if (dp.getProducto().equals(producto)) {
                return dp;
            }
        }
        return null;
    }

    public void deleteDetallePedidoByProducto(Producto producto) {
        DetallePedido encontrado = findDetallePedidoByProducto(producto);
        if (encontrado != null) {
            detalles.remove(encontrado);
            calcularTotal(); // Recalculamos el total tras eliminar
        }
    }

    // Implementación del metodo de la interfaz Calculable
    @Override
    public void calcularTotal() {
        Double suma = 0.0;
        for (DetallePedido dp : detalles) {
            suma += dp.getSubtotal();
        }
        this.total = suma;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }

    public Estado getEstado() { return estado; }
    public void setEstado(Estado estado) { this.estado = estado; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }

    public FormaPago getFormaPago() { return formaPago; }
    public void setFormaPago(FormaPago formaPago) { this.formaPago = formaPago; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public Set<DetallePedido> getDetalles() { return detalles; }
    public void setDetalles(Set<DetallePedido> detalles) { this.detalles = detalles; }

    // =========================================================================
    // Identidad y control de recursión cíclica en toString()
    // =========================================================================
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Pedido pedido = (Pedido) o;
        return Objects.equals(id, pedido.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        // MUY IMPORTANTE: Para evitar el error infinito de StackOverflow (recursión cíclica),
        // en el toString de Pedido NO imprimimos el objeto 'usuario' entero, sino solo su mail.
        return "Pedido{" +
                "id=" + id +
                ", fecha=" + fecha +
                ", estado=" + estado +
                ", total=$" + total +
                ", formaPago=" + formaPago +
                ", usuarioMail=" + (usuario != null ? usuario.getMail() : "null") +
                ", cantidadItems=" + detalles.size() +
                '}';
    }
}