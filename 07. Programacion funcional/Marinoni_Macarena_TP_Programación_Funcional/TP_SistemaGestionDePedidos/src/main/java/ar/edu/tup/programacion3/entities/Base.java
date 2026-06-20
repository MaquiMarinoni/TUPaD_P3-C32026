package ar.edu.tup.programacion3.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class Base {
    private Long id;
    private boolean eliminado;
    private LocalDateTime createdAt;
}