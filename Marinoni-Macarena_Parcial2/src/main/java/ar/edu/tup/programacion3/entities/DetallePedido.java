package ar.edu.tup.programacion3.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetallePedido extends Base {

    private int cantidad;
    private Double subtotal;

    @ManyToOne
    @JoinColumn(name = "producto_id")
    private Producto producto;
}