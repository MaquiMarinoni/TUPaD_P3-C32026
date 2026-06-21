package com.tp.jpa.repository;

import com.tp.jpa.model.Producto;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import java.util.List;

public class ProductoRepository extends BaseRepository<Producto> {

    public ProductoRepository() {
        super(Producto.class);
    }

    /**
     * Retorna la lista de productos activos que pertenecen a la categoría indicada.
     */
    public List<Producto> buscarPorCategoria(Long categoriaId) {
        EntityManager em = emf.createEntityManager();
        try {
            // JPQL: Buscamos productos donde la categoría coincida con el ID
            // y el producto no esté eliminado.
            String jpql = "SELECT p FROM Producto p WHERE p.categoria.id = :catId AND p.eliminado = false";

            TypedQuery<Producto> query = em.createQuery(jpql, Producto.class);
            query.setParameter("catId", categoriaId);

            return query.getResultList();
        } finally {
            em.close();
        }
    }
}