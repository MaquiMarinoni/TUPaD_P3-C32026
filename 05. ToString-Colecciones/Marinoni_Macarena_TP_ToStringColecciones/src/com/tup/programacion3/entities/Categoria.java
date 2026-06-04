package com.tup.programacion3.entities;

import java.util.Objects;

public class Categoria extends Base {
    private String nombre;

    // Constructor completo
    public Categoria(Long id, String nombre) {
        super(id); // manda el id hacia arriba, a la clase padre Base
        this.nombre = nombre;
    }

    // Getter y Setter
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    // =========================================================================
    // Métodos de Identidad (Alt + Insert)
    // =========================================================================

    @Override
    public boolean equals(Object o) {
        if (this == o) return true; // Si apuntan al mismo lugar de memoria, son iguales
        if (o == null || getClass() != o.getClass()) return false; // Si es nulo o de otra clase, no
        Categoria categoria = (Categoria) o;
        return Objects.equals(nombre, categoria.nombre); // categorias iguales si se llaman igual
    }

    @Override
    public int hashCode() {
        return Objects.hash(nombre); // El casillero del mapa depende de su nombre
    }

    @Override
    public String toString() {
        // uso getId() de la clase Base para armar un log legible
        return "Categoria{" +
                "id=" + getId() +
                ", nombre='" + nombre + '\'' +
                '}';
    }
}