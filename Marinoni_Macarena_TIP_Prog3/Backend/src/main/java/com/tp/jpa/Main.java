package com.tp.jpa;

import com.tp.jpa.model.*;
import com.tp.jpa.model.enums.FormaPago;
import com.tp.jpa.repository.*;
import com.tp.jpa.util.JPAUtil;
import java.util.Optional;
import java.util.Scanner;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

public class Main {

    private static final Scanner sc = new Scanner(System.in);
    private static final CategoriaRepository categoriaRepo = new CategoriaRepository();
    private static final ProductoRepository productoRepo = new ProductoRepository();
    private static final UsuarioRepository usuarioRepo = new UsuarioRepository();
    private static final PedidoRepository pedidoRepo = new PedidoRepository();

    public static void main(String[] args) {
        // Configuración para asegurar UTF-8 en consola
        System.setProperty("file.encoding", "UTF-8");

        boolean salir = false;
        while (!salir) {
            System.out.println("\n===== FOOD STORE - MENÚ PRINCIPAL =====");
            System.out.println("1. Gestionar Categorías");
            System.out.println("2. Gestionar Productos");
            System.out.println("3. Gestionar Usuarios");
            System.out.println("4. Gestionar Pedidos");
            System.out.println("5. Reportes");
            System.out.println("0. Salir");
            System.out.print("Opción: ");
            String op = sc.nextLine().trim();
            switch (op) {
                case "1":
                    menuCategorías();
                    break;
                case "2":
                    menuProductos();
                    break;
                case "3":
                    menuUsuarios();
                    break;
                case "4":
                    menuPedidos();
                    break;
                case "5":
                    menuReportes();
                    break;
                case "0":
                    salir = true;
                    break;
                default:
                    System.out.println("Opción inválida.");
            }
        }
        JPAUtil.close();
        System.out.println("Aplicación finalizada.");
    }

    private static void menuUsuarios() {
        boolean volver = false;
        while (!volver) {
            System.out.println("\n===== GESTIÓN DE USUARIOS =====");
            System.out.println("1. Alta de usuario");
            System.out.println("2. Listar usuarios"); // <-- NUEVA OPCIÓN
            System.out.println("5. Buscar por mail (Prueba JPA)");
            System.out.println("0. Volver");
            System.out.print("Opción: ");
            String op = sc.nextLine().trim();

            switch (op) {
                case "1":
                    altaUsuario();
                    break;
                case "2":
                    listarUsuarios();
                    break; // <-- ACTIVACIÓN
                case "5":
                    buscarUsuarioPorMail();
                    break;
                case "0":
                    volver = true;
                    break;
                default:
                    System.out.println("Opción inválida.");
            }
        }
    }

    private static void altaUsuario() {
        System.out.println("\n--- Nuevo Usuario ---");
        System.out.print("Nombre: ");
        String nombre = sc.nextLine();
        System.out.print("Apellido: ");
        String apellido = sc.nextLine();
        System.out.print("Mail: ");
        String mail = sc.nextLine();
        System.out.print("Contraseña: ");
        String password = sc.nextLine();

        Usuario nuevoUsuario = Usuario.builder()
                .nombre(nombre)
                .apellido(apellido)
                .mail(mail)
                .contraseña(password)
                .build();

        try {
            usuarioRepo.guardar(nuevoUsuario);
            System.out.println("¡Usuario guardado con éxito en la base de datos!");
        } catch (Exception e) {
            System.out.println("Error al guardar el usuario: " + e.getMessage());
        }
    }

    private static void listarUsuarios() {
        var lista = usuarioRepo.listarActivos();
        if (lista.isEmpty()) {
            System.out.println("No hay usuarios registrados.");
        } else {
            lista.forEach(u -> System.out.println("ID: " + u.getId() + " | Nombre: " + u.getNombre() + " " + u.getApellido()));
        }
    }

    private static void buscarUsuarioPorMail() {
        System.out.print("Ingrese el mail a buscar: ");
        String mail = sc.nextLine().trim();
        Optional<Usuario> usuario = usuarioRepo.buscarPorMail(mail);

        if (usuario.isPresent()) {
            System.out.println("Usuario encontrado: " + usuario.get().getNombre() + " " + usuario.get().getApellido());
        } else {
            System.out.println("No se encontró ningún usuario activo con ese mail.");
        }
    }

    private static void menuCategorías() {
        boolean volver = false;
        while (!volver) {
            System.out.println("\n===== GESTIÓN DE CATEGORÍAS =====");
            System.out.println("1. Alta de categoría");
            System.out.println("2. Listar categorías");
            System.out.println("0. Volver");
            System.out.print("Opción: ");
            String op = sc.nextLine().trim();

            switch (op) {
                case "1":
                    altaCategoría();
                    break;
                case "2":
                    listarCategorías();
                    break;
                case "0":
                    volver = true;
                    break;
                default:
                    System.out.println("Opción inválida.");
            }
        }
    }

    private static void altaCategoría() {
        System.out.print("\nNombre de la nueva categoría: ");
        String nombre = sc.nextLine();

        Categoria nuevaCat = Categoria.builder()
                .nombre(nombre)
                .build();

        try {
            categoriaRepo.guardar(nuevaCat);
            System.out.println("¡Categoría guardada con éxito!");
        } catch (Exception e) {
            System.out.println("Error al guardar categoría: " + e.getMessage());
        }
    }

    private static void listarCategorías() {
        System.out.println("\n--- Categorías Activas ---");
        var lista = categoriaRepo.listarActivos();
        if (lista.isEmpty()) {
            System.out.println("No hay categorías registradas.");
        } else {
            lista.forEach(c -> System.out.println("ID: " + c.getId() + " | Nombre: " + c.getNombre()));
        }
    }

    private static void menuProductos() {
        boolean volver = false;
        while (!volver) {
            System.out.println("\n===== GESTIÓN DE PRODUCTOS =====");
            System.out.println("1. Alta de producto");
            System.out.println("2. Listar productos");
            System.out.println("0. Volver");
            System.out.print("Opción: ");
            String op = sc.nextLine().trim();

            switch (op) {
                case "1":
                    altaProducto();
                    break;
                case "2":
                    listarProductos();
                    break;
                case "0":
                    volver = true;
                    break;
            }
        }
    }

    private static void altaProducto() {
        System.out.print("Nombre del producto: ");
        String nombre = sc.nextLine();
        System.out.print("Precio: ");
        double precio = Double.parseDouble(sc.nextLine());
        System.out.print("Stock: "); // <- ¡Agregamos esto!
        int stock = Integer.parseInt(sc.nextLine());
        System.out.print("ID de la categoría: ");
        Long catId = Long.parseLong(sc.nextLine());

        var categoriaOpt = categoriaRepo.buscarPorId(catId);

        if (categoriaOpt.isPresent()) {
            Producto nuevoProd = Producto.builder()
                    .nombre(nombre)
                    .precio(precio)
                    .stock(stock) // <- ¡Seteamos el stock!
                    .build();

            nuevoProd.setCategoria(categoriaOpt.get());
            productoRepo.guardar(nuevoProd);
            System.out.println("Producto guardado con éxito.");
        } else {
            System.out.println("Error: Categoría no encontrada.");
        }
    }

    private static void listarProductos() {
        productoRepo.listarActivos().forEach(p ->
                System.out.println("ID: " + p.getId() + " | " + p.getNombre() + " | $" + p.getPrecio() + " | Cat: " + p.getCategoria().getNombre()));
    }

    private static void menuPedidos() {
        boolean volver = false;
        while (!volver) {
            System.out.println("\n===== GESTIÓN DE PEDIDOS =====");
            System.out.println("1. Alta de pedido");
            System.out.println("2. Listar pedidos");
            System.out.println("0. Volver");
            System.out.print("Opción: ");
            String op = sc.nextLine().trim();

            switch (op) {
                case "1":
                    altaPedido();
                    break;
                case "2":
                    listarPedidos();
                    break;
                case "0":
                    volver = true;
                    break;
                default:
                    System.out.println("Opción inválida.");
            }
        }
    }

    private static void altaPedido() {
        System.out.print("ID del Usuario: ");
        Long userId = Long.parseLong(sc.nextLine());

        var usuarioOpt = usuarioRepo.buscarPorId(userId);
        if (usuarioOpt.isEmpty()) {
            System.out.println("Error: Usuario no encontrado.");
            return;
        }

        Pedido nuevoPedido = Pedido.builder()
                .usuario(usuarioOpt.get())
                .formaPago(FormaPago.EFECTIVO)
                .build();

        System.out.print("ID del Producto: ");
        Long prodId = Long.parseLong(sc.nextLine());
        System.out.print("Cantidad: ");
        int cantidad = Integer.parseInt(sc.nextLine());

        var productoOpt = productoRepo.buscarPorId(prodId);
        if (productoOpt.isPresent()) {
            nuevoPedido.addDetallePedido(cantidad, productoOpt.get());
            nuevoPedido.calcularTotal();

            pedidoRepo.guardar(nuevoPedido);
            System.out.println("¡Pedido registrado con éxito! Total: $" + nuevoPedido.getTotal());
        } else {
            System.out.println("Error: Producto no encontrado.");
        }
    }

    private static void listarPedidos() {
        System.out.println("\n--- Lista de Pedidos ---");
        var lista = pedidoRepo.listarActivos();
        if (lista.isEmpty()) {
            System.out.println("No hay pedidos registrados.");
        } else {
            lista.forEach(p -> System.out.println("ID: " + p.getId() + " | Usuario: " + p.getUsuario().getNombre() + " | Total: $" + p.getTotal()));
        }
    }

    private static void menuReportes() {
        System.out.println("\n===== REPORTES =====");
        System.out.println("1. Total facturado (sumatoria de todos los pedidos)");
        System.out.println("2. Cantidad de productos por categoría");
        System.out.println("0. Volver");
        System.out.print("Opción: ");
        String op = sc.nextLine().trim();

        switch (op) {
            case "1":
                EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
                try {
                    String jpql = "SELECT SUM(p.total) FROM Pedido p WHERE p.eliminado = false";
                    TypedQuery<Double> query = em.createQuery(jpql, Double.class);
                    Double total = query.getSingleResult();
                    System.out.println("--- TOTAL FACTURADO: $" + (total != null ? total : 0.0) + " ---");
                } catch (Exception e) {
                    System.out.println("Error al calcular el total: " + e.getMessage());
                } finally {
                    em.close();
                }
                break;

            case "2":
                System.out.println("\n--- Productos por Categoría ---");
                categoriaRepo.listarActivos().forEach(c -> {
                    int count = productoRepo.buscarPorCategoria(c.getId()).size();
                    System.out.println("Categoría: " + c.getNombre() + " | Productos: " + count);
                });
                break;

            case "0":
                break;

            default:
                System.out.println("Opción inválida.");
        }
    }
}