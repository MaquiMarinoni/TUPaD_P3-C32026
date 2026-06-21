package com.tp.jpa.repository;

import com.tp.jpa.model.Categoria;
import jakarta.persistence.EntityManager;
import java.util.Optional;

public class CategoriaRepository extends BaseRepository<Categoria> {

    public CategoriaRepository() {
        super(Categoria.class);
    }
}