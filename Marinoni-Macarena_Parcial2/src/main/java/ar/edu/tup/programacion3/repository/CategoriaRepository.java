package ar.edu.tup.programacion3.repository;

import ar.edu.tup.programacion3.entities.Categoria;
import ar.edu.tup.programacion3.entities.Producto;
import ar.edu.tup.programacion3.util.JPAUtil;
import jakarta.persistence.EntityManager;

public class CategoriaRepository extends BaseRepository<Categoria> {

    public CategoriaRepository() {
        super(Categoria.class);
    }

    // NUEVO METODO PARA EVITAR EL ERROR AL GUARDAR EL PRODUCTO
    public void agregarProducto(Long categoriaId, Producto producto) {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        try {
            em.getTransaction().begin();

            // Buscamos la categoria con la conexion abierta
            Categoria cat = em.find(Categoria.class, categoriaId);
            if (cat != null) {
                // Agregamos el producto y guardamos
                cat.getProductos().add(producto);
                em.merge(cat);
            }

            em.getTransaction().commit();
        } catch (Exception e) {
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }
            throw e;
        } finally {
            em.close();
        }
    }
}