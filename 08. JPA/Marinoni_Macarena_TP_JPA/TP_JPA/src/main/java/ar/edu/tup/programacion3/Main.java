package ar.edu.tup.programacion3;

import ar.edu.tup.programacion3.entities.*;
import ar.edu.tup.programacion3.enums.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

import java.time.LocalDate;

public class Main {
    public static void main(String[] args) {

        // 1. ARRANCAR JPA: Creamos la "fábrica" conectada a nuestro persistence.xml
        EntityManagerFactory emf = Persistence.createEntityManagerFactory("miUnidad");
        EntityManager em = emf.createEntityManager();

        try {
            // Abrimos la transacción (todo lo que pase acá adentro se guardará en la base de datos)
            em.getTransaction().begin();

            System.out.println("--- INICIANDO CARGA DE DATOS ---");

            // ========================================================
            // PUNTO 4.d: Instanciar 10 productos
            // ========================================================
            Producto p1 = Producto.builder().nombre("Martillo").precio(1500.0).stock(10).disponible(true).build();
            Producto p2 = Producto.builder().nombre("Clavos").precio(500.0).stock(100).disponible(true).build();
            Producto p3 = Producto.builder().nombre("Taladro").precio(15000.0).stock(5).disponible(true).build();
            Producto p4 = Producto.builder().nombre("Sierra").precio(3500.0).stock(8).disponible(true).build();
            Producto p5 = Producto.builder().nombre("Destornillador").precio(800.0).stock(20).disponible(true).build();
            Producto p6 = Producto.builder().nombre("Pinza").precio(1200.0).stock(15).disponible(true).build();
            Producto p7 = Producto.builder().nombre("Cinta Métrica").precio(600.0).stock(30).disponible(true).build();
            Producto p8 = Producto.builder().nombre("Nivel").precio(2000.0).stock(12).disponible(true).build();
            Producto p9 = Producto.builder().nombre("Lija").precio(100.0).stock(200).disponible(true).build();
            Producto p10 = Producto.builder().nombre("Pegamento").precio(900.0).stock(50).disponible(true).build();

            // Los persistimos (guardamos) primero para que tengan su ID generado
            em.persist(p1); em.persist(p2); em.persist(p3); em.persist(p4); em.persist(p5);
            em.persist(p6); em.persist(p7); em.persist(p8); em.persist(p9); em.persist(p10);

            // ========================================================
            // PUNTO 4.c: Instanciar 3 Categorías
            // ========================================================
            Categoria cat1 = Categoria.builder().nombre("Herramientas Manuales").build();
            cat1.getProductos().add(p1);
            cat1.getProductos().add(p4);

            Categoria cat2 = Categoria.builder().nombre("Herramientas Eléctricas").build();
            cat2.getProductos().add(p3);

            Categoria cat3 = Categoria.builder().nombre("Insumos").build();
            cat3.getProductos().add(p2);
            cat3.getProductos().add(p10);

            em.persist(cat1); em.persist(cat2); em.persist(cat3);

            // ========================================================
            // PUNTO 4.a: Instanciar 2 Usuarios
            // ========================================================
            Usuario usu1 = Usuario.builder().nombre("Carlos").apellido("Perez")
                    .mail("carlos@utn.com").celular("123456").contraseña("1234").rol(Rol.USUARIO).build();

            Usuario usu2 = Usuario.builder().nombre("Maria").apellido("Gomez")
                    .mail("maria@utn.com").celular("654321").contraseña("admin").rol(Rol.ADMIN).build();

            // ========================================================
            // PUNTO 4.b: Instanciar 3 Pedidos (al menos 2 detalles por pedido)
            // ========================================================
            // Pedido 1 (Para el usuario 1)
            Pedido ped1 = Pedido.builder().fecha(LocalDate.now()).estado(Estado.CONFIRMADO).formaPago(FormaPago.TARJETA).build();
            ped1.addDetallePedido(1, p3); // 1 Taladro
            ped1.addDetallePedido(2, p1); // 2 Martillos
            usu1.getPedidos().add(ped1); // Lo vinculamos al usuario

            // Pedido 2 (Para el usuario 1)
            Pedido ped2 = Pedido.builder().fecha(LocalDate.now()).estado(Estado.PENDIENTE).formaPago(FormaPago.TRANSFERENCIA).build();
            ped2.addDetallePedido(5, p9); // 5 Lijas
            ped2.addDetallePedido(1, p4); // 1 Sierra
            usu1.getPedidos().add(ped2);

            // Pedido 3 (Para el usuario 2)
            Pedido ped3 = Pedido.builder().fecha(LocalDate.now()).estado(Estado.TERMINADO).formaPago(FormaPago.EFECTIVO).build();
            ped3.addDetallePedido(1, p8); // 1 Nivel
            ped3.addDetallePedido(3, p10); // 3 Pegamentos
            usu2.getPedidos().add(ped3);

            // Persistimos los usuarios (Como pusimos CascadeType.ALL, esto guarda los pedidos y detalles automáticamente)
            em.persist(usu1);
            em.persist(usu2);

            // "Commiteamos" para que se guarde todo este bloque inicial
            em.getTransaction().commit();
            System.out.println("--- DATOS GUARDADOS CON ÉXITO ---");


            // ========================================================
            // PUNTO 5: Actualizar al menos 2 productos
            // ========================================================
            em.getTransaction().begin(); // Abrimos de nuevo para hacer las modificaciones

            // Le subimos el precio al Martillo (p1) y le bajamos el stock a los Clavos (p2)
            p1.setPrecio(2000.0);
            p2.setStock(50);

            // Con merge le avisamos a la base de datos que actualice estos registros
            em.merge(p1);
            em.merge(p2);

            System.out.println("--- PUNTO 5: Productos actualizados ---");

            // ========================================================
            // PUNTO 6: Buscar Usuario por ID
            // ========================================================
            // El ID 1L corresponde al primer usuario que guardamos (Carlos)
            Usuario usuarioEncontrado = em.find(Usuario.class, 1L);
            System.out.println("--- PUNTO 6 --- Usuario buscado por ID (1): " + usuarioEncontrado.getNombre());

            // ========================================================
            // PUNTO 7: Buscar Usuario por mail
            // ========================================================
            // Usamos JPQL para consultar por atributos
            Usuario usuarioPorMail = em.createQuery("SELECT u FROM Usuario u WHERE u.mail = :correo", Usuario.class)
                    .setParameter("correo", "maria@utn.com")
                    .getSingleResult();
            System.out.println("--- PUNTO 7 --- Usuario buscado por Mail: " + usuarioPorMail.getNombre() + " " + usuarioPorMail.getApellido());

            // ========================================================
            // PUNTO 8: Borrar 1 producto
            // ========================================================
            // Vamos a borrar el Producto 7 (Cinta Métrica) porque sabemos que no lo pusimos en ningún pedido
            // ni en ninguna categoría, así evitamos problemas de claves foráneas.
            Producto productoABorrar = em.find(Producto.class, p7.getId());
            if (productoABorrar != null) {
                em.remove(productoABorrar);
                System.out.println("--- PUNTO 8: Producto " + productoABorrar.getNombre() + " eliminado con éxito ---");
            }

            // Guardamos todos los cambios finales (Updates y Deletes)
            em.getTransaction().commit();

        } catch (Exception e) {
            // Si algo falla, deshacemos todo para no romper la base de datos
            em.getTransaction().rollback();
            e.printStackTrace();
        } finally {
            // Siempre cerramos la conexión al terminar
            em.close();
            emf.close();
        }
    }
}