package ar.edu.tup.programacion3.entities;

import ar.edu.tup.programacion3.enums.Estado;
import ar.edu.tup.programacion3.enums.FormaPago;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class Pedido extends Base implements Calculable {
    private LocalDate fecha;
    private Estado estado;
    private Double total = 0.0;
    private FormaPago formaPago;
    private List<DetallePedido> detalles = new ArrayList<>();

    // 1) Desarrolle un método en clase Pedido que se encargue de calcular el total.
    @Override
    public void calcularTotal() {
        this.total = detalles.stream()
                .mapToDouble(detalle -> {
                    // Calculamos el subtotal de cada línea (cantidad * precio del producto)
                    double subtotal = detalle.getCantidad() * detalle.getProducto().getPrecio();
                    detalle.setSubtotal(subtotal); // Seteamos el subtotal en el detalle
                    return subtotal;
                })
                .sum(); // Operación terminal que suma todos los subtotales [cite: 9]
    }

    // Método complementario para agregar detalles de forma limpia
    public void addDetallePedido(int cantidad, Producto producto) {
        DetallePedido nuevoDetalle = new DetallePedido(cantidad, 0.0, producto);
        this.detalles.add(nuevoDetalle);
        calcularTotal(); // Recalculamos automáticamente al añadir
    }

    // Buscar un detalle específico usando Streams (UML: findeDetallePedidoByProducto) [cite: 28]
    public DetallePedido findDetallePedidoByProducto(Producto producto) {
        return detalles.stream()
                .filter(d -> d.getProducto().getId().equals(producto.getId())) // Operación intermedia
                .findFirst() // Operación terminal que devuelve un Optional
                .orElse(null); // Si no lo encuentra, devuelve null de forma segura
    }

    // Eliminar un detalle usando lógica funcional (UML: deleteDetallePedidoByProducto) [cite: 29]
    public void deleteDetallePedidoByProducto(Producto producto) {
        // removeIf utiliza un predicado funcional bajo el capó para limpiar la lista
        detalles.removeIf(d -> d.getProducto().getId().equals(producto.getId()));
        calcularTotal(); // Recalculamos el total tras la eliminación
    }
}