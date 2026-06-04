package com.tup.programacion3.entities;

import java.time.LocalDateTime;

public abstract class Base {
    private Long id;
    private boolean eliminado;
    private LocalDateTime createdAt;

    // Constructor por defecto: inicializa el tiempo de creacion
    public Base() {
        this.createdAt = LocalDateTime.now();
        this.eliminado = false; // Por defecto arranca activo
    }

    // Constructor secundario por si se necesita setear el ID al instanciar
    public Base(Long id) {
        this();
        this.id = id;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public boolean isEliminado() { return eliminado; }
    public void setEliminado(boolean eliminado) { this.eliminado = eliminado; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}