package com.tup.programacion3.entities;

import com.tup.programacion3.enums.Estado;
import com.tup.programacion3.enums.FormaPago;
import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

interface Calculable {
    void calcularTotal();
}

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString(exclude = "detalles") // Excluimos 'detalles' para no saturar la consola
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Pedido implements Calculable {

    @EqualsAndHashCode.Include // REGLA: Comparar solo por ID
    private Long id;

    @Builder.Default // Le avisamos al Builder que use este valor por defecto
    private LocalDate fecha = LocalDate.now();

    @Builder.Default
    private Estado estado = Estado.PENDIENTE;

    @Builder.Default
    private Double total = 0.0;

    private FormaPago formaPago;
    private Usuario usuario;

    @Builder.Default
    private Set<DetallePedido> detalles = new HashSet<>();

    // =========================================================================
    // Mantenemos TODA la lógica de negocio requerida por el diagrama UML
    // =========================================================================
    public void addDetallePedido(int cantidad, Producto producto) {
        // Aprovechamos el Builder que creamos en el paso anterior para instanciar:
        DetallePedido nuevoDetalle = DetallePedido.builder()
                .cantidad(cantidad)
                .producto(producto)
                .build();

        nuevoDetalle.setSubtotal(nuevoDetalle.calcularSubtotal());

        if (detalles.contains(nuevoDetalle)) {
            DetallePedido existente = findDetallePedidoByProducto(producto);
            if (existente != null) {
                existente.setCantidad(existente.getCantidad() + cantidad);
            }
        } else {
            detalles.add(nuevoDetalle);
        }
        calcularTotal();
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
            calcularTotal();
        }
    }

    @Override
    public void calcularTotal() {
        Double suma = 0.0;
        for (DetallePedido dp : detalles) {
            suma += dp.getSubtotal();
        }
        this.total = suma;
    }
}