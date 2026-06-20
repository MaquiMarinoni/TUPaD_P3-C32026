package ar.edu.tup.programacion3.repository;

import ar.edu.tup.programacion3.entities.Producto;
import ar.edu.tup.programacion3.util.JPAUtil;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

import java.util.List;

public class ProductoRepository extends BaseRepository<Producto> {

    public ProductoRepository() {
        super(Producto.class);
    }

    public List<Producto> buscarPorCategoria(Long categoriaId) {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        try {
            // Como la relacion es unidireccional desde Categoria, esta consulta JPQL selecciona
            // los productos (p) haciendo un JOIN desde la entidad Categoria (c).
            // Filtra para que el ID de la categoria coincida con el parametro nombrado :categoriaId
            // y que los productos devueltos no esten eliminados.
            String jpql = "SELECT p FROM Categoria c JOIN c.productos p WHERE c.id = :categoriaId AND p.eliminado = false";

            TypedQuery<Producto> query = em.createQuery(jpql, Producto.class);
            query.setParameter("categoriaId", categoriaId);

            return query.getResultList();
        } finally {
            em.close();
        }
    }
}