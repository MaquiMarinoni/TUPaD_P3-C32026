package com.tup.programacion3;

import com.tup.programacion3.entities.*;
import com.tup.programacion3.enums.*;

import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        System.out.println("=========================================================");
        System.out.println("EJECUTANDO TRABAJO PRÁCTICO: TOSTRING Y COLECCIONES");
        System.out.println("=========================================================\n");

        // ---------------------------------------------------------------------
        // 1. INSTANCIAR 2 USUARIOS (Punto 3.a)
        // ---------------------------------------------------------------------
        Usuario u1 = new Usuario(1L, "Juan", "Perez", "juan@mail.com", "261555555", "clave123", Rol.CLIENTE);
        Usuario u2 = new Usuario(2L, "Ana", "Gomez", "ana@mail.com", "261666666", "admin456", Rol.ADMINISTRADOR);

        // ---------------------------------------------------------------------
        // 2. INSTANCIAR 3 CATEGORÍAS (Punto 3.c)
        // ---------------------------------------------------------------------
        Categoria catElectro = new Categoria(1L, "Electrónica");
        Categoria catIndumentaria = new Categoria(2L, "Indumentaria");
        Categoria catHogar = new Categoria(3L, "Hogar");

        // ---------------------------------------------------------------------
        // 3. INSTANCIAR 10 PRODUCTOS (Punto 3.d)
        // Usamos una Lista (ArrayList) para representar el catálogo general
        // ---------------------------------------------------------------------
        List<Producto> catalogoProductos = new ArrayList<>();

        catalogoProductos.add(new Producto(1L, "Televisor 4K", 450000.0, "Smart TV 50 pulgadas", 10, "tv.png", true, catElectro));
        catalogoProductos.add(new Producto(2L, "Celular", 320000.0, "6GB RAM, 128GB", 15, "cel.png", true, catElectro));
        catalogoProductos.add(new Producto(3L, "Auriculares Bluetooth", 45000.0, "Cancelación de ruido", 30, "auris.png", true, catElectro));

        catalogoProductos.add(new Producto(4L, "Remera Algodón", 15000.0, "Color negro talle L", 50, "remera.png", true, catIndumentaria));
        catalogoProductos.add(new Producto(5L, "Pantalón Jean", 35000.0, "Clásico azul", 25, "jean.png", true, catIndumentaria));
        catalogoProductos.add(new Producto(6L, "Campera de Abrigo", 85000.0, "Impermeable", 8, "campera.png", true, catIndumentaria));

        catalogoProductos.add(new Producto(7L, "Cafetera Express", 120000.0, "Presión 15 bares", 5, "cafetera.png", true, catHogar));
        catalogoProductos.add(new Producto(8L, "Juego de Sábanas", 28000.0, "2 plazas y media", 12, "sabanas.png", true, catHogar));
        catalogoProductos.add(new Producto(9L, "Lámpara LED", 8500.0, "Luz cálida de escritorio", 40, "lampara.png", true, catHogar));
        catalogoProductos.add(new Producto(10L, "Sillón Gamer", 210000.0, "Ergonómico reclinable", 4, "sillon.png", true, catHogar));

        // ---------------------------------------------------------------------
        // 4. INSTANCIAR 3 PEDIDOS (Punto 3.b - Al menos 2 detalles por cada uno)
        // Le asignamos 2 pedidos a Juan (u1) y 1 pedido a Ana (u2)
        // ---------------------------------------------------------------------
        // Pedido 1 (Asignado a Juan)
        Pedido p1 = new Pedido(101L, FormaPago.TARJETA, u1);
        p1.addDetallePedido(1, catalogoProductos.get(0)); // 1 Televisor
        p1.addDetallePedido(2, catalogoProductos.get(2)); // 2 Auriculares

        // Pedido 2 (Asignado a Juan)
        Pedido p2 = new Pedido(102L, FormaPago.TRANSFERENCIA, u1);
        p2.addDetallePedido(3, catalogoProductos.get(3)); // 3 Remeras
        p2.addDetallePedido(1, catalogoProductos.get(4)); // 1 Jean

        // Pedido 3 (Asignado a Ana)
        Pedido p3 = new Pedido(103L, FormaPago.EFECTIVO, u2);
        p3.addDetallePedido(1, catalogoProductos.get(6)); // 1 Cafetera
        p3.addDetallePedido(5, catalogoProductos.get(8)); // 5 Lámparas

        // Agrupamos todos los pedidos en una lista para poder procesarlos en el punto 4
        List<Pedido> todosLosPedidos = new ArrayList<>();
        todosLosPedidos.add(p1);
        todosLosPedidos.add(p2);
        todosLosPedidos.add(p3);

        // ---------------------------------------------------------------------
        // PUNTO 4: Mostrar por consola usando toString()
        // ---------------------------------------------------------------------

        // a) Mostrar un producto individual
        System.out.println("[PUNTO 4.a] - Mostrar un producto utilizando toString():");
        System.out.println(catalogoProductos.get(0));
        System.out.println();

        // b) Mostrar el listado de productos cargados
        System.out.println("[PUNTO 4.b] - Listado Completo de Productos Cargados:");
        for (Producto prod : catalogoProductos) {
            System.out.println(" -> " + prod);
        }
        System.out.println();

        // c) Mostrar los pedidos del usuario que más pedidos posea (Juan tiene 2, Ana tiene 1)
        System.out.println("[PUNTO 4.c] - Pedidos del usuario con más pedidos (Juan Perez):");
        for (Pedido ped : todosLosPedidos) {
            if (ped.getUsuario().getMail().equals("juan@mail.com")) {
                System.out.println(ped);
                // Imprimimos sus detalles asociados para demostrar que calcula el total correctamente
                System.out.println("Detalles de esta orden:");
                for (DetallePedido dp : ped.getDetalles()) {
                    System.out.println("      * " + dp);
                }
            }
        }
        System.out.println();

        // ---------------------------------------------------------------------
        // PUNTO 5: Prueba de Identidad Lógica (Equals)
        // ---------------------------------------------------------------------
        System.out.println("[PUNTO 5] - Prueba de Identidad Lógica (Equals vs Colección):");

        // Creamos una nueva instancia de Producto con el MISMO NOMBRE de un producto existente
        // pero con diferente ID, descripción, precio, etc., para forzar la igualdad lógica
        Producto productoClonado = new Producto(999L, "Televisor 4K", 9999999.9, "Copia de prueba", 1, "test.png", true, catElectro);

        System.out.println("Objeto en catálogo: ID=" + catalogoProductos.get(0).getId() + ", Nombre='" + catalogoProductos.get(0).getNombre() + "'");
        System.out.println("Objeto nuevo a evaluar: ID=" + productoClonado.getId() + ", Nombre='" + productoClonado.getNombre() + "'");

        // Evaluamos si la colección lo detecta como existente mediante el metodo .contains()
        boolean yaExiste = catalogoProductos.contains(productoClonado);

        System.out.println("\n¿El nuevo producto ya existe en el catálogo según la regla del equals? " +
                (yaExiste ? "SÍ, FUE DETECTADO COMO DUPLICADO" : "NO, ES UN OBJETO NUEVO"));
        System.out.println("=========================================================");
    }
}