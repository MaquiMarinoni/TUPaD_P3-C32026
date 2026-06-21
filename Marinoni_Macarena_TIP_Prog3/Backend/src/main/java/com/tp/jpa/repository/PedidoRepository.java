package com.tp.jpa.repository;

import com.tp.jpa.model.Pedido;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import java.util.List;

public class PedidoRepository extends BaseRepository<Pedido> {

    public PedidoRepository() {
        super(Pedido.class);
    }

    /**
     * Retorna todos los pedidos activos de un usuario determinado.
     */
    public List<Pedido> buscarPorUsuario(Long usuarioId) {
        EntityManager em = emf.createEntityManager();
        try {
            // Navegamos: Pedido -> Usuario -> ID
            String jpql = "SELECT p FROM Pedido p WHERE p.usuario.id = :uId AND p.eliminado = false";

            TypedQuery<Pedido> query = em.createQuery(jpql, Pedido.class);
            query.setParameter("uId", usuarioId);

            return query.getResultList();
        } finally {
            em.close();
        }
    }
}