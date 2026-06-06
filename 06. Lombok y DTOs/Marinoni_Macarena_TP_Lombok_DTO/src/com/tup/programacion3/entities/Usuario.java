package com.tup.programacion3.entities;

import com.tup.programacion3.enums.Rol;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Usuario {

    private Long id;
    private String nombre;
    private String apellido;

    @EqualsAndHashCode.Include // regla de comparar solo por mail
    private String mail;

    private String celular;
    private String contraseña;
    private Rol rol;
}