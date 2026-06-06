package com.tup.programacion3;

import com.tup.programacion3.entities.*;
import com.tup.programacion3.enums.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class Main {
    public static void main(String[] args) {
        System.out.println("=========================================================");
        System.out.println("EJECUTANDO TRABAJO PRÁCTICO 6: LOMBOK Y DTO");
        System.out.println("=========================================================\n");

        // ---------------------------------------------------------------------
        // 1. INSTANCIAR 2 USUARIOS (Punto 3.a) usando el Patrón BUILDER
        // ---------------------------------------------------------------------
        Usuario u1 = Usuario.builder()
                .id(1L)
                .nombre("Juan")
                .apellido("Perez")
                .mail("juan@mail.com")
                .celular("261555555")
                .contraseña("clave123")
                .rol(Rol.CLIENTE)
                .build();

        Usuario u2 = Usuario.builder()
                .id(2L)
                .nombre("Ana")
                .apellido("Gomez")
                .mail("ana@mail.com")
                .celular("261666666")
                .contraseña("admin456")
                .rol(Rol.ADMINISTRADOR)
                .build();

        // ---------------------------------------------------------------------
        // 2. INSTANCIAR 3 CATEGORÍAS (Punto 3.c) usando BUILDER
        // ---------------------------------------------------------------------
        Categoria catElectro = Categoria.builder().id(1L).nombre("Electrónica").build();
        Categoria catIndumentaria = Categoria.builder().id(2L).nombre("Indumentaria").build();
        Categoria catHogar = Categoria.builder().id(3L).nombre("Hogar").build();

        // ---------------------------------------------------------------------
        // 3. INSTANCIAR 10 PRODUCTOS (Punto 3.d) usando BUILDER
        // ---------------------------------------------------------------------
        List<Producto> catalogoProductos = new ArrayList<>();

        catalogoProductos.add(Producto.builder().id(1L).nombre("Televisor 4K").precio(450000.0).descripcion("Smart TV").stock(10).categoria(catElectro).build());
        catalogoProductos.add(Producto.builder().id(2L).nombre("Celular").precio(320000.0).descripcion("6GB RAM").stock(15).categoria(catElectro).build());
        catalogoProductos.add(Producto.builder().id(3L).nombre("Auriculares Bluetooth").precio(45000.0).stock(30).categoria(catElectro).build());

        catalogoProductos.add(Producto.builder().id(4L).nombre("Remera Algodón").precio(15000.0).stock(50).categoria(catIndumentaria).build());
        catalogoProductos.add(Producto.builder().id(5L).nombre("Pantalón Jean").precio(35000.0).stock(25).categoria(catIndumentaria).build());
        catalogoProductos.add(Producto.builder().id(6L).nombre("Campera de Abrigo").precio(85000.0).stock(8).categoria(catIndumentaria).build());

        catalogoProductos.add(Producto.builder().id(7L).nombre("Cafetera Express").precio(120000.0).stock(5).categoria(catHogar).build());
        catalogoProductos.add(Producto.builder().id(8L).nombre("Juego de Sábanas").precio(28000.0).stock(12).categoria(catHogar).build());
        catalogoProductos.add(Producto.builder().id(9L).nombre("Lámpara LED").precio(8500.0).stock(40).categoria(catHogar).build());
        catalogoProductos.add(Producto.builder().id(10L).nombre("Sillón Gamer").precio(210000.0).stock(4).categoria(catHogar).build());

        // ---------------------------------------------------------------------
        // 4. INSTANCIAR 3 PEDIDOS (Punto 3.b) usando BUILDER
        // ---------------------------------------------------------------------
        Pedido p1 = Pedido.builder().id(101L).formaPago(FormaPago.TARJETA).usuario(u1).build();
        p1.addDetallePedido(1, catalogoProductos.get(0)); // 1 Televisor
        p1.addDetallePedido(2, catalogoProductos.get(2)); // 2 Auriculares

        Pedido p2 = Pedido.builder().id(102L).formaPago(FormaPago.TRANSFERENCIA).usuario(u1).build();
        p2.addDetallePedido(3, catalogoProductos.get(3)); // 3 Remeras
        p2.addDetallePedido(1, catalogoProductos.get(4)); // 1 Jean

        Pedido p3 = Pedido.builder().id(103L).formaPago(FormaPago.EFECTIVO).usuario(u2).build();
        p3.addDetallePedido(1, catalogoProductos.get(6)); // 1 Cafetera
        p3.addDetallePedido(5, catalogoProductos.get(8)); // 5 Lámparas

        List<Pedido> todosLosPedidos = new ArrayList<>();
        todosLosPedidos.add(p1);
        todosLosPedidos.add(p2);
        todosLosPedidos.add(p3);

        // ---------------------------------------------------------------------
        // PUNTO 4: Mostrar por consola usando toString()
        // ---------------------------------------------------------------------
        System.out.println("[PUNTO 4.a] - Mostrar un producto utilizando toString():");
        System.out.println(catalogoProductos.get(0));
        System.out.println();

        System.out.println("[PUNTO 4.b] - Listado Completo de Productos Cargados:");
        for (Producto prod : catalogoProductos) {
            System.out.println(" -> " + prod);
        }
        System.out.println();

        System.out.println("[PUNTO 4.c] - Pedidos del usuario con más pedidos (Juan Perez):");
        for (Pedido ped : todosLosPedidos) {
            if (ped.getUsuario().getMail().equals("juan@mail.com")) {
                System.out.println(ped);
                System.out.println("Detalles de esta orden:");
                for (DetallePedido dp : ped.getDetalles()) {
                    System.out.println("      * " + dp);
                }
            }
        }
        System.out.println();

        // ---------------------------------------------------------------------
        // PUNTO 5: Prueba de Identidad Lógica y Unicidad
        // ---------------------------------------------------------------------
        System.out.println("[PUNTO 5] - Prueba de Identidad Lógica y Unicidad con SET:");

        // Creamos un producto con el mismo nombre pero distinto ID y atributos
        Producto productoClonado = Producto.builder()
                .id(999L)
                .nombre("Televisor 4K")
                .precio(999999.9)
                .descripcion("Copia de prueba")
                .stock(1)
                .categoria(catElectro)
                .build();

        // 1. Cargamos nuestro catálogo en un Set (correcion TP5)
        Set<Producto> pruebaUnicidadSet = new HashSet<>(catalogoProductos);
        int tamañoAntes = pruebaUnicidadSet.size();

        // 2. Intentamos agregarlo. El método .add() de los Sets devuelve 'false' si detecta un duplicado
        boolean sePudoAgregar = pruebaUnicidadSet.add(productoClonado);
        int tamañoDespues = pruebaUnicidadSet.size();

        System.out.println("Objeto original en el Set: ID=" + catalogoProductos.get(0).getId() + ", Nombre='" + catalogoProductos.get(0).getNombre() + "'");
        System.out.println("Objeto nuevo a evaluar: ID=" + productoClonado.getId() + ", Nombre='" + productoClonado.getNombre() + "'\n");

        System.out.println("¿El Set permitió agregar el producto clonado? " +
                (sePudoAgregar ? "SÍ (Fallo en la lógica)" : "NO, LO RECHAZÓ POR DUPLICADO (¡Éxito!)"));
        System.out.println("Tamaño del Set antes: " + tamañoAntes + " | Tamaño después: " + tamañoDespues);
        System.out.println("=========================================================");

        // ---------------------------------------------------------------------
        // PUNTO 6: Prueba de DTO (Ocultando información sensible)
        // ---------------------------------------------------------------------
        System.out.println("\n[PUNTO 6] - Prueba de DTO (Record):");

        // Transformamos el Usuario 1 (u1) en un DTO pasándole solo los datos permitidos
        com.tup.programacion3.DTOs.UsuarioDTO dtoJuan = new com.tup.programacion3.DTOs.UsuarioDTO(
                u1.getId(),
                u1.getNombre(),
                u1.getApellido(),
                u1.getMail(),
                u1.getCelular()
        );

        System.out.println("Usuario Completo (con info sensible): " + u1);
        System.out.println("Usuario DTO (seguro para enviar): " + dtoJuan);
        System.out.println("=========================================================");
    }
}

