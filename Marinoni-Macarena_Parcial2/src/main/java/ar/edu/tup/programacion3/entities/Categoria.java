package ar.edu.tup.programacion3.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Categoria extends Base {

    private String nombre;
    private String descripcion;

    // Relación: Una Categoría tiene muchos Productos
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "categoria_id")
    @Builder.Default
    private List<Producto> productos = new ArrayList<>();
}