package ar.edu.tup.programacion3.entities;

import ar.edu.tup.programacion3.enums.Rol;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario extends Base {

    private String nombre;
    private String apellido;
    private String mail;
    private String celular;
    private String contraseña;

    @Enumerated(EnumType.STRING)
    private Rol rol;

    // Relación: Un Usuario tiene muchos Pedidos
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "usuario_id")
    @Builder.Default
    private List<Pedido> pedidos = new ArrayList<>();
}