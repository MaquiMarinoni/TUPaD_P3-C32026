package ar.edu.tup.programacion3.entities;

import ar.edu.tup.programacion3.enums.Estado;
import ar.edu.tup.programacion3.enums.FormaPago;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pedido extends Base implements Calculable {

    private LocalDate fecha;

    @Enumerated(EnumType.STRING)
    private Estado estado;

    private Double total;

    @Enumerated(EnumType.STRING)
    private FormaPago formaPago;

    // Relación: Un Pedido tiene muchos Detalles
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "pedido_id")
    @Builder.Default
    private List<DetallePedido> detalles = new ArrayList<>();

    // Métodos del UML
    public void addDetallePedido(int cantidad, Producto producto) {
        DetallePedido detalle = DetallePedido.builder()
                .cantidad(cantidad)
                .subtotal(producto.getPrecio() * cantidad)
                .producto(producto)
                .build();
        this.detalles.add(detalle);
        calcularTotal();
    }

    public DetallePedido findDetallePedidoByProducto(Producto producto) {
        for (DetallePedido detalle : detalles) {
            if (detalle.getProducto().getId().equals(producto.getId())) {
                return detalle;
            }
        }
        return null;
    }

    public void deleteDetallePedidoByProducto(Producto producto) {
        detalles.removeIf(detalle -> detalle.getProducto().getId().equals(producto.getId()));
        calcularTotal();
    }

    @Override
    public void calcularTotal() {
        this.total = 0.0;
        for (DetallePedido detalle : detalles) {
            this.total += detalle.getSubtotal();
        }
    }
}