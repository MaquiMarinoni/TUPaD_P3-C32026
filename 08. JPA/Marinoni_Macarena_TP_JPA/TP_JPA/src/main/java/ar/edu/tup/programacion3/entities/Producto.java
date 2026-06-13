package ar.edu.tup.programacion3.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Producto extends Base {

    private String nombre;
    private Double precio;
    private String descripcion;
    private int stock;
    private String imagen;
    private Boolean disponible;
}