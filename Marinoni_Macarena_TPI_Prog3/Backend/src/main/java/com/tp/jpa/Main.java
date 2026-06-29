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
                case "1" -> menuCategorias();
                case "2" -> menuProductos();
                case "3" -> menuUsuarios();
                case "4" -> menuPedidos();
                case "5" -> menuReportes();
                case "0" -> salir = true;
                default -> System.out.println("Opción inválida.");
            }
        }
        JPAUtil.close();
        System.out.println("Aplicación finalizada.");
    }

    // ==========================================
    // MÓDULO CATEGORÍAS (COMPLETADO SEGÚN RÚBRICA)
    // ==========================================
    private static void menuCategorias() {
        boolean volver = false;
        while (!volver) {
            System.out.println("\n===== GESTIÓN DE CATEGORÍAS =====");
            System.out.println("1. Alta de categoría");
            System.out.println("2. Modificar categoría");
            System.out.println("3. Baja lógica de categoría");
            System.out.println("4. Listar categorías");
            System.out.println("0. Volver");
            System.out.print("Opción: ");
            String op = sc.nextLine().trim();

            switch (op) {
                case "1" -> altaCategoria();
                case "2" -> modificarCategoria();
                case "3" -> bajaCategoria();
                case "4" -> listarCategorias();
                case "0" -> volver = true;
                default -> System.out.println("Opción inválida.");
            }
        }
    }

    private static void altaCategoria() {
        System.out.println("\n--- Nueva Categoría ---");
        String nombre;
        while (true) {
            System.out.print("Nombre (obligatorio): ");
            nombre = sc.nextLine().trim();
            if (!nombre.isEmpty()) break;
            System.out.println("Error: El nombre no puede estar vacío.");
        }
        System.out.print("Descripción (opcional): ");
        String descripcion = sc.nextLine().trim();

        Categoria nuevaCat = Categoria.builder()
                .nombre(nombre)
                .descripcion(descripcion)
                .build();

        try {
            Categoria guardada = categoriaRepo.guardar(nuevaCat);
            System.out.println("¡Categoría guardada con éxito! ID generado: " + guardada.getId());
        } catch (Exception e) {
            System.out.println("Error al guardar categoría: " + e.getMessage());
        }
    }

    private static void modificarCategoria() {
        System.out.println("\n--- Modificar Categoría ---");
        listarCategorias();
        System.out.print("Ingrese el ID de la categoría a modificar: ");
        try {
            Long id = Long.parseLong(sc.nextLine().trim());
            Optional<Categoria> catOpt = categoriaRepo.buscarPorId(id);

            if (catOpt.isPresent() && !catOpt.get().isEliminado()) {
                Categoria cat = catOpt.get();
                System.out.println("Valores actuales:");
                System.out.println("Nombre: " + cat.getNombre());
                System.out.println("Descripción: " + cat.getDescripcion());
                System.out.println("(Deje el campo en blanco y presione Enter para conservar el valor anterior)");

                System.out.print("Nuevo Nombre: ");
                String nombre = sc.nextLine().trim();
                if (!nombre.isEmpty()) {
                    cat.setNombre(nombre);
                }

                System.out.print("Nueva Descripción: ");
                String desc = sc.nextLine().trim();
                if (!desc.isEmpty()) {
                    cat.setDescripcion(desc);
                }

                categoriaRepo.guardar(cat);
                System.out.println("¡Categoría modificada con éxito!");
            } else {
                System.out.println("Error: No se encontró una categoría activa con ese ID.");
            }
        } catch (NumberFormatException e) {
            System.out.println("ID inválido.");
        }
    }

    private static void bajaCategoria() {
        System.out.println("\n--- Baja Lógica de Categoría ---");
        System.out.print("Ingrese el ID de la categoría a dar de baja: ");
        try {
            Long id = Long.parseLong(sc.nextLine().trim());
            Optional<Categoria> catOpt = categoriaRepo.buscarPorId(id);
            if (catOpt.isPresent() && !catOpt.get().isEliminado()) {
                String nombre = catOpt.get().getNombre();
                boolean exito = categoriaRepo.eliminarLogico(id);
                if (exito) {
                    System.out.println("Categoría '" + nombre + "' dada de baja exitosamente.");
                } else {
                    System.out.println("Error al dar de baja.");
                }
            } else {
                System.out.println("Error: No se encontró una categoría activa con ese ID.");
            }
        } catch (NumberFormatException e) {
            System.out.println("ID inválido.");
        }
    }

    private static void listarCategorias() {
        System.out.println("\n--- Categorías Activas ---");
        var lista = categoriaRepo.listarActivos();
        if (lista.isEmpty()) {
            System.out.println("No hay categorías activas.");
        } else {
            lista.forEach(c -> System.out.println("ID: " + c.getId() + " | Nombre: " + c.getNombre() + " | Desc: " + c.getDescripcion()));
        }
    }

    // ==========================================
    // MÓDULO PRODUCTOS (COMPLETADO SEGÚN RÚBRICA)
    // ==========================================
    private static void menuProductos() {
        boolean volver = false;
        while (!volver) {
            System.out.println("\n===== GESTIÓN DE PRODUCTOS =====");
            System.out.println("1. Alta de producto");
            System.out.println("2. Modificar producto");
            System.out.println("3. Baja lógica de producto");
            System.out.println("4. Listar productos");
            System.out.println("0. Volver");
            System.out.print("Opción: ");
            String op = sc.nextLine().trim();

            switch (op) {
                case "1" -> altaProducto();
                case "2" -> modificarProducto();
                case "3" -> bajaProducto();
                case "4" -> listarProductos();
                case "0" -> volver = true;
                default -> System.out.println("Opción inválida.");
            }
        }
    }

    private static void altaProducto() {
        System.out.println("\n--- Nuevo Producto ---");
        var categorias = categoriaRepo.listarActivos();
        if (categorias.isEmpty()) {
            System.out.println("Error: No hay categorías activas. Debe crear una categoría primero.");
            return;
        }

        listarCategorias();
        System.out.print("ID de la categoría a asociar: ");
        Long catId;
        try {
            catId = Long.parseLong(sc.nextLine().trim());
        } catch (Exception e) {
            System.out.println("ID inválido."); return;
        }

        var categoriaOpt = categoriaRepo.buscarPorId(catId);
        if (categoriaOpt.isEmpty() || categoriaOpt.get().isEliminado()) {
            System.out.println("Error: Categoría no encontrada o inactiva.");
            return;
        }

        String nombre;
        while (true) {
            System.out.print("Nombre (obligatorio): ");
            nombre = sc.nextLine().trim();
            if (!nombre.isEmpty()) break;
            System.out.println("El nombre no puede estar vacío.");
        }

        System.out.print("Descripción: ");
        String descripcion = sc.nextLine().trim();

        double precio;
        while (true) {
            System.out.print("Precio (mayor a 0): ");
            try {
                precio = Double.parseDouble(sc.nextLine().trim());
                if (precio > 0) break;
                System.out.println("El precio debe ser mayor a 0.");
            } catch (Exception e) {
                System.out.println("Valor inválido.");
            }
        }

        int stock;
        while (true) {
            System.out.print("Stock (mayor o igual a 0): ");
            try {
                stock = Integer.parseInt(sc.nextLine().trim());
                if (stock >= 0) break;
                System.out.println("El stock no puede ser negativo.");
            } catch (Exception e) {
                System.out.println("Valor inválido.");
            }
        }

        System.out.print("URL de Imagen (opcional): ");
        String imagen = sc.nextLine().trim();

        System.out.print("¿Está disponible? (S/N, Enter = Si): ");
        String dispInput = sc.nextLine().trim().toUpperCase();
        boolean disponible = !dispInput.equals("N");

        Producto nuevoProd = Producto.builder()
                .nombre(nombre)
                .descripcion(descripcion)
                .precio(precio)
                .stock(stock)
                .imagen(imagen)
                .disponible(disponible)
                .categoria(categoriaOpt.get())
                .build();

        try {
            Producto guardado = productoRepo.guardar(nuevoProd);
            System.out.println("¡Producto guardado con éxito! ID: " + guardado.getId() + " | Categoría: " + categoriaOpt.get().getNombre());
        } catch (Exception e) {
            System.out.println("Error al guardar el producto: " + e.getMessage());
        }
    }

    private static void modificarProducto() {
        System.out.println("\n--- Modificar Producto ---");
        listarProductos();
        System.out.print("Ingrese el ID del producto a modificar: ");
        try {
            Long id = Long.parseLong(sc.nextLine().trim());
            Optional<Producto> prodOpt = productoRepo.buscarPorId(id);

            if (prodOpt.isPresent() && !prodOpt.get().isEliminado()) {
                Producto prod = prodOpt.get();
                System.out.println("Valores actuales:");
                System.out.println("Nombre: " + prod.getNombre());
                System.out.println("Precio: " + prod.getPrecio());
                System.out.println("Stock: " + prod.getStock());
                System.out.println("(Deje el campo en blanco y presione Enter para conservar el valor anterior)");

                System.out.print("Nuevo Nombre: ");
                String nombre = sc.nextLine().trim();
                if (!nombre.isEmpty()) prod.setNombre(nombre);

                System.out.print("Nuevo Precio (>0): ");
                String precioStr = sc.nextLine().trim();
                if (!precioStr.isEmpty()) {
                    double precio = Double.parseDouble(precioStr);
                    if (precio > 0) prod.setPrecio(precio);
                    else System.out.println("Precio inválido, se conserva el anterior.");
                }

                System.out.print("Nuevo Stock (>=0): ");
                String stockStr = sc.nextLine().trim();
                if (!stockStr.isEmpty()) {
                    int stock = Integer.parseInt(stockStr);
                    if (stock >= 0) prod.setStock(stock);
                    else System.out.println("Stock inválido, se conserva el anterior.");
                }

                productoRepo.guardar(prod);
                System.out.println("¡Producto modificado con éxito!");
            } else {
                System.out.println("Error: No se encontró un producto activo con ese ID.");
            }
        } catch (NumberFormatException e) {
            System.out.println("Valor inválido.");
        }
    }

    private static void bajaProducto() {
        System.out.println("\n--- Baja Lógica de Producto ---");
        System.out.print("Ingrese el ID del producto a dar de baja: ");
        try {
            Long id = Long.parseLong(sc.nextLine().trim());
            Optional<Producto> prodOpt = productoRepo.buscarPorId(id);
            if (prodOpt.isPresent() && !prodOpt.get().isEliminado()) {
                String nombre = prodOpt.get().getNombre();
                boolean exito = productoRepo.eliminarLogico(id);
                if (exito) {
                    System.out.println("Producto '" + nombre + "' dado de baja exitosamente.");
                } else {
                    System.out.println("Error al dar de baja.");
                }
            } else {
                System.out.println("Error: No se encontró un producto activo con ese ID.");
            }
        } catch (NumberFormatException e) {
            System.out.println("ID inválido.");
        }
    }

    private static void listarProductos() {
        System.out.println("\n--- Productos Activos ---");
        var lista = productoRepo.listarActivos();
        if (lista.isEmpty()) {
            System.out.println("No hay productos activos.");
        } else {
            lista.forEach(p -> {
                String estado = p.getDisponible() ? "Disponible" : "Agotado";
                System.out.println("ID: " + p.getId() + " | " + p.getNombre() + " | $" + p.getPrecio() +
                        " | Stock: " + p.getStock() + " | Estado: " + estado + " | Cat: " + p.getCategoria().getNombre());
            });
        }
    }

    // ==========================================
    // MÓDULOS USUARIOS Y PEDIDOS (VIEJOS, SE COMPLETARÁN DESPUÉS)
    // ==========================================
    private static void menuUsuarios() {
        boolean volver = false;
        while (!volver) {
            System.out.println("\n===== GESTIÓN DE USUARIOS =====");
            System.out.println("1. Alta de usuario");
            System.out.println("2. Listar usuarios");
            System.out.println("5. Buscar por mail");
            System.out.println("0. Volver");
            System.out.print("Opción: ");
            String op = sc.nextLine().trim();

            switch (op) {
                case "1" -> altaUsuario();
                case "2" -> listarUsuarios();
                case "5" -> buscarUsuarioPorMail();
                case "0" -> volver = true;
                default -> System.out.println("Opción inválida.");
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
            System.out.println("¡Usuario guardado con éxito!");
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
                case "1" -> altaPedido();
                case "2" -> listarPedidos();
                case "0" -> volver = true;
                default -> System.out.println("Opción inválida.");
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
            case "1" -> {
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
            }
            case "2" -> {
                System.out.println("\n--- Productos por Categoría ---");
                categoriaRepo.listarActivos().forEach(c -> {
                    int count = categoriaRepo.buscarProductosPorCategoria(c.getId()).size();
                    System.out.println("Categoría: " + c.getNombre() + " | Productos: " + count);
                });
            }
            case "0" -> {}
            default -> System.out.println("Opción inválida.");
        }
    }
}