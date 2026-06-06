package com.tup.programacion3.entities;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Producto {

    private Long id;

    @EqualsAndHashCode.Include // REGLA: Comparar solo por 'nombre'
    private String nombre;

    private Double precio;
    private String descripcion;
    private int stock;
    private String imagen;
    private Boolean disponible;
    private Categoria categoria;
}