package ar.edu.tup.programacion3.repository;

import ar.edu.tup.programacion3.entities.Base;
import ar.edu.tup.programacion3.util.JPAUtil; // Importamos la clase utilitaria
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import java.util.List;
import java.util.Optional;

public abstract class BaseRepository<T extends Base> {

    private final Class<T> entityClass;

    // Obtenemos el EntityManagerFactory desde JPAUtil
    private static final EntityManagerFactory emf = JPAUtil.getEntityManagerFactory();

    public BaseRepository(Class<T> entityClass) {
        this.entityClass = entityClass;
    }

    // 1. Guardar o Actualizar
    public T guardar(T entity) {
        EntityManager em = emf.createEntityManager();
        try {
            em.getTransaction().begin();
            T savedEntity = em.merge(entity);
            em.getTransaction().commit();
            return savedEntity;
        } catch (Exception e) {
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }
            throw e;
        } finally {
            em.close();
        }
    }

    // 2. Buscar por ID usando Optional
    public Optional<T> buscarPorId(Long id) {
        EntityManager em = emf.createEntityManager();
        try {
            T entity = em.find(entityClass, id);
            return Optional.ofNullable(entity);
        } finally {
            em.close();
        }
    }

    // 3. Listar solo los activos (eliminado = false)
    public List<T> listarActivos() {
        EntityManager em = emf.createEntityManager();
        try {
            String jpql = "SELECT e FROM " + entityClass.getSimpleName() + " e WHERE e.eliminado = false";
            return em.createQuery(jpql, entityClass).getResultList();
        } finally {
            em.close();
        }
    }

    // 4. Eliminación Lógica (Soft Delete)
    public boolean eliminarLogico(Long id) {
        EntityManager em = emf.createEntityManager();
        try {
            em.getTransaction().begin();
            T entity = em.find(entityClass, id);
            if (entity != null && !entity.isEliminado()) {
                entity.setEliminado(true);
                em.merge(entity);
                em.getTransaction().commit();
                return true;
            }
            em.getTransaction().rollback();
            return false;
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