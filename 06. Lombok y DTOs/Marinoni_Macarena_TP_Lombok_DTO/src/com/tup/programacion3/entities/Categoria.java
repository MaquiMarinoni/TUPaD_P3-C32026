package com.tup.programacion3.entities;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Categoria {

    private Long id;

    @EqualsAndHashCode.Include // REGLA: Comparar solo por 'nombre'
    private String nombre;
}