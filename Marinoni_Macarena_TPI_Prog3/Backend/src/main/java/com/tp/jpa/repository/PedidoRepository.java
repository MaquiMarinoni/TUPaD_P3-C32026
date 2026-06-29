package com.tp.jpa.repository;

import com.tp.jpa.model.Pedido;
import com.tp.jpa.model.enums.EstadoPedido;
import jakarta.persistence.EntityManager;
import java.util.List;

public class PedidoRepository extends BaseRepository<Pedido> {

    public PedidoRepository() {
        super(Pedido.class);
    }

    public List<Pedido> buscarPorEstado(EstadoPedido estado) {
        EntityManager em = emf.createEntityManager();
        try {
            // Consulta JPQL: retorna todos los pedidos activos con un estado específico
            // Útil para filtrar PENDIENTE, CONFIRMADO, TERMINADO o CANCELADO
            String jpql = "SELECT p FROM Pedido p WHERE p.estado = :estado AND p.eliminado = false";
            return em.createQuery(jpql, Pedido.class)
                    .setParameter("estado", estado)
                    .getResultList();
        } finally {
            em.close();
        }
    }
}