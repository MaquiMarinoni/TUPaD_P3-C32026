package ar.edu.tup.programacion3.util;

import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

public class JPAUtil {
    private static final EntityManagerFactory emf = buildEntityManagerFactory();

    private static EntityManagerFactory buildEntityManagerFactory() {
        try {
            // "miUnidad" es el nombre que está tu persistence.xml
            return Persistence.createEntityManagerFactory("miUnidad");
        } catch (Throwable ex) {
            System.err.println("Fallo la creacion del EntityManagerFactory inicial." + ex);
            throw new ExceptionInInitializerError(ex);
        }
    }

    public static EntityManagerFactory getEntityManagerFactory() {
        return emf;
    }
}