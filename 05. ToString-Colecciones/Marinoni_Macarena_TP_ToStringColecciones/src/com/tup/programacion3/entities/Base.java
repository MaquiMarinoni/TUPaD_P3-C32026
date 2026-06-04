package com.tup.programacion3.entities;

import java.time.LocalDateTime;

public abstract class Base {
    private Long id;
    private boolean eliminado;
    private LocalDateTime createdAt;

    // Constructor por defecto: inicializa el tiempo de creacion automaticamente
    public Base() {
        this.createdAt = LocalDateTime.now();
        this.eliminado = false; // Al nacer, el objeto no está eliminado
    }

    // Constructor secundario por si hay que pasar un ID ya existente
    public Base(Long id) {
        this();
        this.id = id;
    }

    // Getters y Setters necesarios para que las clases hijas expongan estos datos
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public boolean isEliminado() { return eliminado; }
    public void setEliminado(boolean eliminado) { this.eliminado = eliminado; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
