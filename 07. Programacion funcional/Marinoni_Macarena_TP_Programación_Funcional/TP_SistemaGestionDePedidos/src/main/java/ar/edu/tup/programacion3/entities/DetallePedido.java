package ar.edu.tup.programacion3.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetallePedido {
    private int cantidad;
    private Double subtotal;
    private Producto producto; // Relación m..1 con Producto
}
