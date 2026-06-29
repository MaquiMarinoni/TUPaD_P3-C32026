package com.tp.jpa.repository;

import com.tp.jpa.model.Categoria;
import com.tp.jpa.model.Producto;
import jakarta.persistence.EntityManager;
import java.util.List;

public class CategoriaRepository extends BaseRepository<Categoria> {

    public CategoriaRepository() {
        super(Categoria.class);
    }

    public List<Producto> buscarProductosPorCategoria(Long categoriaId) {
        EntityManager em = emf.createEntityManager();
        try {
            // Consulta JPQL: retorna los productos activos de una categoría.
            // Como la relación es unidireccional y Categoria es la dueña, se
            // navega desde Categoria hacia su colección c.productos mediante JOIN.
            // Se filtra por el id de la categoría (parámetro nombrado :catId) y
            // por p.eliminado = false para excluir las bajas lógicas.
            String jpql = "SELECT p FROM Categoria c JOIN c.productos p WHERE c.id = :catId AND p.eliminado = false";

            return em.createQuery(jpql, Producto.class)
                    .setParameter("catId", categoriaId)
                    .getResultList();
        } finally {
            em.close();
        }
    }
}