package com.tup.programacion3.entities;

import java.util.Objects;

public class Categoria extends Base {
    private String nombre;

    // Constructor
    public Categoria(Long id, String nombre) {
        super(id); // ID a la clase padre Base
        this.nombre = nombre;
    }

    // Getter y Setter
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    // =========================================================================
    // Metodos
    // =========================================================================
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Categoria categoria = (Categoria) o;
        return Objects.equals(nombre, categoria.nombre); // Dos categorias son iguales si se llaman igual
    }

    @Override
    public int hashCode() {
        return Objects.hash(nombre);
    }

    @Override
    public String toString() {
        return "Categoria{" +
                "id=" + getId() +
                ", nombre='" + nombre + '\'' +
                '}';
    }
}