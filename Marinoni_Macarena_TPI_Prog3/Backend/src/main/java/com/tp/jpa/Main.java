package com.tp.jpa;

import com.tp.jpa.model.*;
import com.tp.jpa.model.enums.EstadoPedido;
import com.tp.jpa.model.enums.FormaPago;
import com.tp.jpa.model.enums.Rol;
import com.tp.jpa.repository.*;
import com.tp.jpa.util.JPAUtil;

import java.time.LocalDate;
import java.util.*;
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
    // MÓDULO CATEGORÍAS
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
                System.out.println("Valores actuales -> Nombre: " + cat.getNombre() + " | Desc: " + cat.getDescripcion());
                System.out.println("(Deje en blanco y presione Enter para conservar el valor)");

                System.out.print("Nuevo Nombre: ");
                String nombre = sc.nextLine().trim();
                if (!nombre.isEmpty()) cat.setNombre(nombre);

                System.out.print("Nueva Descripción: ");
                String desc = sc.nextLine().trim();
                if (!desc.isEmpty()) cat.setDescripcion(desc);

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
        System.out.print("ID a dar de baja: ");
        try {
            Long id = Long.parseLong(sc.nextLine().trim());
            Optional<Categoria> catOpt = categoriaRepo.buscarPorId(id);
            if (catOpt.isPresent() && !catOpt.get().isEliminado()) {
                if (categoriaRepo.eliminarLogico(id)) {
                    System.out.println("Categoría '" + catOpt.get().getNombre() + "' dada de baja.");
                } else {
                    System.out.println("Error al dar de baja.");
                }
            } else {
                System.out.println("Error: Categoría no encontrada.");
            }
        } catch (NumberFormatException e) {
            System.out.println("ID inválido.");
        }
    }

    private static void listarCategorias() {
        System.out.println("\n--- Categorías Activas ---");
        var lista = categoriaRepo.listarActivos();
        if (lista.isEmpty()) System.out.println("No hay categorías activas.");
        else lista.forEach(c -> System.out.println("ID: " + c.getId() + " | " + c.getNombre() + " | " + c.getDescripcion()));
    }

    // ==========================================
    // MÓDULO PRODUCTOS
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
        var categorias = categoriaRepo.listarActivos();
        if (categorias.isEmpty()) {
            System.out.println("Error: Debe crear una categoría primero.");
            return;
        }

        listarCategorias();
        System.out.print("ID de categoría a asociar: ");
        try {
            Long catId = Long.parseLong(sc.nextLine().trim());
            Optional<Categoria> catOpt = categoriaRepo.buscarPorId(catId);
            if (catOpt.isEmpty() || catOpt.get().isEliminado()) {
                System.out.println("Categoría no válida."); return;
            }

            System.out.print("Nombre (obligatorio): ");
            String nombre = sc.nextLine().trim();
            if (nombre.isEmpty()) { System.out.println("El nombre no puede estar vacío."); return; }

            System.out.print("Descripción: ");
            String descripcion = sc.nextLine().trim();

            System.out.print("Precio (>0): ");
            double precio = Double.parseDouble(sc.nextLine().trim());
            if (precio <= 0) { System.out.println("Precio inválido."); return; }

            System.out.print("Stock (>=0): ");
            int stock = Integer.parseInt(sc.nextLine().trim());
            if (stock < 0) { System.out.println("Stock inválido."); return; }

            System.out.print("URL de Imagen (opcional): ");
            String imagen = sc.nextLine().trim();

            System.out.print("¿Está disponible? (S/N, Enter=S): ");
            boolean disponible = !sc.nextLine().trim().equalsIgnoreCase("N");

            Producto nuevo = Producto.builder().nombre(nombre).descripcion(descripcion).precio(precio)
                    .stock(stock).imagen(imagen).disponible(disponible).categoria(catOpt.get()).build();
            productoRepo.guardar(nuevo);
            System.out.println("¡Producto guardado exitosamente!");
        } catch (Exception e) {
            System.out.println("Error en los datos ingresados.");
        }
    }

    private static void modificarProducto() {
        listarProductos();
        System.out.print("ID del producto a modificar: ");
        try {
            Long id = Long.parseLong(sc.nextLine().trim());
            Optional<Producto> prodOpt = productoRepo.buscarPorId(id);
            if (prodOpt.isPresent() && !prodOpt.get().isEliminado()) {
                Producto p = prodOpt.get();
                System.out.println("Actuales -> Nombre: " + p.getNombre() + " | Precio: $" + p.getPrecio() + " | Stock: " + p.getStock());

                System.out.print("Nuevo Nombre: ");
                String nom = sc.nextLine().trim();
                if (!nom.isEmpty()) p.setNombre(nom);

                System.out.print("Nuevo Precio: ");
                String precStr = sc.nextLine().trim();
                if (!precStr.isEmpty()) {
                    double prec = Double.parseDouble(precStr);
                    if (prec > 0) p.setPrecio(prec); else System.out.println("Precio ignorado (debe ser >0).");
                }

                System.out.print("Nuevo Stock: ");
                String stockStr = sc.nextLine().trim();
                if (!stockStr.isEmpty()) {
                    int st = Integer.parseInt(stockStr);
                    if (st >= 0) p.setStock(st); else System.out.println("Stock ignorado (debe ser >=0).");
                }

                productoRepo.guardar(p);
                System.out.println("¡Producto actualizado!");
            } else {
                System.out.println("Producto no válido.");
            }
        } catch (Exception e) {
            System.out.println("Datos inválidos.");
        }
    }

    private static void bajaProducto() {
        System.out.print("ID a dar de baja: ");
        try {
            Long id = Long.parseLong(sc.nextLine().trim());
            Optional<Producto> pOpt = productoRepo.buscarPorId(id);
            if (pOpt.isPresent() && !pOpt.get().isEliminado()) {
                if (productoRepo.eliminarLogico(id)) {
                    System.out.println("Producto '" + pOpt.get().getNombre() + "' dado de baja.");
                }
            } else { System.out.println("Producto no encontrado."); }
        } catch (Exception e) { System.out.println("ID inválido."); }
    }

    private static void listarProductos() {
        System.out.println("\n--- Productos Activos ---");
        var lista = productoRepo.listarActivos();
        if (lista.isEmpty()) System.out.println("No hay productos.");
        else lista.forEach(p -> System.out.println("ID: " + p.getId() + " | " + p.getNombre() + " | $" + p.getPrecio() +
                " | Stock: " + p.getStock() + " | Disp: " + p.getDisponible() + " | Cat: " + p.getCategoria().getNombre()));
    }

    // ==========================================
    // MÓDULO USUARIOS
    // ==========================================
    private static void menuUsuarios() {
        boolean volver = false;
        while (!volver) {
            System.out.println("\n===== GESTIÓN DE USUARIOS =====");
            System.out.println("1. Alta de usuario");
            System.out.println("2. Modificar usuario");
            System.out.println("3. Baja lógica de usuario");
            System.out.println("4. Listar usuarios");
            System.out.println("5. Buscar por mail");
            System.out.println("0. Volver");
            System.out.print("Opción: ");
            String op = sc.nextLine().trim();

            switch (op) {
                case "1" -> altaUsuario();
                case "2" -> modificarUsuario();
                case "3" -> bajaUsuario();
                case "4" -> listarUsuarios();
                case "5" -> buscarUsuarioPorMail();
                case "0" -> volver = true;
                default -> System.out.println("Opción inválida.");
            }
        }
    }

    private static void altaUsuario() {
        System.out.println("\n--- Nuevo Usuario ---");
        System.out.print("Mail: ");
        String mail = sc.nextLine().trim();

        if (usuarioRepo.buscarPorMail(mail).isPresent()) {
            System.out.println("Error: Ya existe un usuario activo con ese mail.");
            return;
        }

        System.out.print("Nombre: "); String nombre = sc.nextLine().trim();
        System.out.print("Apellido: "); String apellido = sc.nextLine().trim();
        System.out.print("Celular (opcional): "); String celular = sc.nextLine().trim();
        System.out.print("Contraseña: "); String password = sc.nextLine().trim();

        System.out.print("Rol (1 = ADMIN, 2 = USUARIO, Enter = USUARIO): ");
        String rolStr = sc.nextLine().trim();
        Rol rol = rolStr.equals("1") ? Rol.ADMIN : Rol.USUARIO;

        Usuario u = Usuario.builder().nombre(nombre).apellido(apellido).mail(mail).celular(celular).contraseña(password).rol(rol).build();
        Usuario guardado = usuarioRepo.guardar(u);
        System.out.println("¡Usuario guardado con éxito! ID: " + guardado.getId());
    }

    private static void modificarUsuario() {
        listarUsuarios();
        System.out.print("ID del usuario a modificar: ");
        try {
            Long id = Long.parseLong(sc.nextLine().trim());
            Optional<Usuario> uOpt = usuarioRepo.buscarPorId(id);
            if (uOpt.isPresent() && !uOpt.get().isEliminado()) {
                Usuario u = uOpt.get();
                System.out.println("Actuales -> Nombre: " + u.getNombre() + " | Apellido: " + u.getApellido() + " | Cel: " + u.getCelular());

                System.out.print("Nuevo Nombre: "); String nom = sc.nextLine().trim();
                if (!nom.isEmpty()) u.setNombre(nom);

                System.out.print("Nuevo Apellido: "); String ape = sc.nextLine().trim();
                if (!ape.isEmpty()) u.setApellido(ape);

                System.out.print("Nuevo Celular: "); String cel = sc.nextLine().trim();
                if (!cel.isEmpty()) u.setCelular(cel);

                System.out.print("Nuevo Mail: "); String mail = sc.nextLine().trim();
                if (!mail.isEmpty() && !mail.equals(u.getMail())) {
                    if (usuarioRepo.buscarPorMail(mail).isPresent()) {
                        System.out.println("Error: El mail ya está en uso. Se conserva el anterior.");
                    } else {
                        u.setMail(mail);
                    }
                }

                usuarioRepo.guardar(u);
                System.out.println("¡Usuario actualizado!");
            } else { System.out.println("Usuario no válido."); }
        } catch (Exception e) { System.out.println("Dato inválido."); }
    }

    private static void bajaUsuario() {
        System.out.print("ID a dar de baja: ");
        try {
            Long id = Long.parseLong(sc.nextLine().trim());
            Optional<Usuario> uOpt = usuarioRepo.buscarPorId(id);
            if (uOpt.isPresent() && !uOpt.get().isEliminado()) {
                if (usuarioRepo.eliminarLogico(id)) {
                    System.out.println("Usuario '" + uOpt.get().getNombre() + " " + uOpt.get().getApellido() + "' dado de baja.");
                }
            } else { System.out.println("Usuario no encontrado."); }
        } catch (Exception e) { System.out.println("ID inválido."); }
    }

    private static void listarUsuarios() {
        System.out.println("\n--- Usuarios Activos ---");
        var lista = usuarioRepo.listarActivos();
        if (lista.isEmpty()) System.out.println("No hay usuarios.");
        else lista.forEach(u -> System.out.println("ID: " + u.getId() + " | " + u.getNombre() + " " + u.getApellido() + " | Mail: " + u.getMail() + " | Rol: " + u.getRol()));
    }

    private static void buscarUsuarioPorMail() {
        System.out.print("Ingrese el mail a buscar: ");
        String mail = sc.nextLine().trim();
        Optional<Usuario> u = usuarioRepo.buscarPorMail(mail);
        if (u.isPresent()) {
            System.out.println("Encontrado: " + u.get().getNombre() + " " + u.get().getApellido() + " | Cel: " + u.get().getCelular() + " | Rol: " + u.get().getRol());
        } else {
            System.out.println("No se encontró usuario activo con ese mail.");
        }
    }

    // ==========================================
    // MÓDULO PEDIDOS (LA MEGA TRANSACCIÓN)
    // ==========================================
    private static void menuPedidos() {
        boolean volver = false;
        while (!volver) {
            System.out.println("\n===== GESTIÓN DE PEDIDOS =====");
            System.out.println("1. Alta de pedido");
            System.out.println("2. Cambiar estado de pedido");
            System.out.println("3. Baja lógica de pedido");
            System.out.println("4. Listar todos los pedidos");
            System.out.println("5. Pedidos por usuario");
            System.out.println("6. Pedidos por estado");
            System.out.println("0. Volver");
            System.out.print("Opción: ");
            String op = sc.nextLine().trim();

            switch (op) {
                case "1" -> altaPedido();
                case "2" -> cambiarEstadoPedido();
                case "3" -> bajaPedido();
                case "4" -> listarPedidos();
                case "5" -> pedidosPorUsuario();
                case "6" -> pedidosPorEstado();
                case "0" -> volver = true;
                default -> System.out.println("Opción inválida.");
            }
        }
    }

    // Clase auxiliar para guardar temporalmente en memoria los productos a comprar
    static class ItemTemp {
        Long idProd; int cantidad;
        ItemTemp(Long idProd, int cantidad) { this.idProd = idProd; this.cantidad = cantidad; }
    }

    private static void altaPedido() {
        System.out.println("\n--- Alta de Pedido (Transaccional) ---");
        var usuarios = usuarioRepo.listarActivos();
        if (usuarios.isEmpty()) { System.out.println("Error: No hay usuarios. Cree uno primero."); return; }

        listarUsuarios();
        System.out.print("Seleccione ID del usuario: ");
        Long userId;
        try { userId = Long.parseLong(sc.nextLine().trim()); } catch(Exception e){ System.out.println("Inválido."); return; }

        if (usuarioRepo.buscarPorId(userId).isEmpty() || usuarioRepo.buscarPorId(userId).get().isEliminado()) {
            System.out.println("Usuario inválido."); return;
        }

        System.out.println("Forma de pago (1=TARJETA, 2=TRANSFERENCIA, 3=EFECTIVO): ");
        String fpStr = sc.nextLine().trim();
        FormaPago fp = fpStr.equals("1") ? FormaPago.TARJETA : (fpStr.equals("2") ? FormaPago.TRANSFERENCIA : FormaPago.EFECTIVO);

        List<ItemTemp> carritoTemporal = new ArrayList<>();
        boolean seguir = true;

        while (seguir) {
            listarProductos();
            System.out.print("ID del producto a agregar: ");
            try {
                Long prodId = Long.parseLong(sc.nextLine().trim());
                Optional<Producto> pOpt = productoRepo.buscarPorId(prodId);

                if (pOpt.isPresent() && !pOpt.get().isEliminado()) {
                    Producto p = pOpt.get();
                    if (!p.getDisponible()) {
                        System.out.println("Error: El producto no está disponible.");
                    } else {
                        System.out.print("Cantidad (Stock actual: " + p.getStock() + "): ");
                        int cant = Integer.parseInt(sc.nextLine().trim());

                        if (cant > 0 && cant <= p.getStock()) {
                            carritoTemporal.add(new ItemTemp(p.getId(), cant));
                            System.out.println("¡Añadido temporalmente al carrito!");
                        } else {
                            System.out.println("Error: Cantidad inválida o stock insuficiente.");
                        }
                    }
                } else { System.out.println("Producto no encontrado."); }
            } catch (Exception e) { System.out.println("Entrada inválida."); }

            System.out.print("¿Desea agregar otro producto? (S/N): ");
            seguir = sc.nextLine().trim().equalsIgnoreCase("S");
        }

        if (carritoTemporal.isEmpty()) {
            System.out.println("El pedido no tiene detalles. Operación cancelada.");
            return;
        }

        // ===============================================
        // INICIO DE LA TRANSACCIÓN ATÓMICA CON ENTITYMANAGER
        // ===============================================
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        try {
            em.getTransaction().begin(); // Iniciamos Transacción

            // Traemos al usuario gestionado por este EntityManager
            Usuario usuarioDB = em.find(Usuario.class, userId);

            Pedido nuevoPedido = Pedido.builder()
                    .usuario(usuarioDB)
                    .formaPago(fp)
                    .estado(EstadoPedido.PENDIENTE)
                    .fecha(LocalDate.now())
                    .build();

            System.out.println("\n--- Procesando Orden ---");
            for (ItemTemp item : carritoTemporal) {
                // Traemos el producto gestionado para descontarle el stock
                Producto prodDB = em.find(Producto.class, item.idProd);

                nuevoPedido.addDetallePedido(item.cantidad, prodDB);
                System.out.println("-> " + item.cantidad + "x " + prodDB.getNombre() + " = $" + (prodDB.getPrecio() * item.cantidad));

                // Descuento de stock real
                prodDB.setStock(prodDB.getStock() - item.cantidad);
            }

            nuevoPedido.calcularTotal();
            em.persist(nuevoPedido); // Guardamos el pedido (y por CascadeType.ALL, sus detalles)

            em.getTransaction().commit(); // ¡Impactamos la base de datos!

            System.out.println("=========================================");
            System.out.println("¡PEDIDO CONFIRMADO CON ÉXITO! ID: " + nuevoPedido.getId());
            System.out.println("Total a pagar: $" + nuevoPedido.getTotal());
            System.out.println("=========================================");

        } catch (Exception e) {
            em.getTransaction().rollback(); // Si explota por cualquier motivo, deshace los cambios (el stock vuelve a como estaba)
            System.out.println("Error gravísimo. Se hizo ROLLBACK de la transacción. Detalles: " + e.getMessage());
        } finally {
            em.close(); // Cerramos SIEMPRE el EntityManager
        }
    }

    private static void cambiarEstadoPedido() {
        listarPedidos();
        System.out.print("ID del pedido: ");
        try {
            Long id = Long.parseLong(sc.nextLine().trim());
            Optional<Pedido> pOpt = pedidoRepo.buscarPorId(id);
            if (pOpt.isPresent() && !pOpt.get().isEliminado()) {
                Pedido p = pOpt.get();
                System.out.println("Estado actual: " + p.getEstado());
                System.out.println("Nuevos estados: 1=PENDIENTE, 2=CONFIRMADO, 3=TERMINADO, 4=CANCELADO");
                System.out.print("Seleccione: ");
                String op = sc.nextLine().trim();
                switch (op) {
                    case "1" -> p.setEstado(EstadoPedido.PENDIENTE);
                    case "2" -> p.setEstado(EstadoPedido.CONFIRMADO);
                    case "3" -> p.setEstado(EstadoPedido.TERMINADO);
                    case "4" -> p.setEstado(EstadoPedido.CANCELADO);
                    default -> { System.out.println("Ignorado."); return; }
                }
                pedidoRepo.guardar(p);
                System.out.println("¡Estado actualizado a " + p.getEstado() + "!");
            } else { System.out.println("Pedido no encontrado."); }
        } catch (Exception e) { System.out.println("ID inválido."); }
    }

    private static void bajaPedido() {
        System.out.print("ID del pedido a dar de baja: ");
        try {
            Long id = Long.parseLong(sc.nextLine().trim());
            Optional<Pedido> pOpt = pedidoRepo.buscarPorId(id);
            if (pOpt.isPresent() && !pOpt.get().isEliminado()) {
                Double total = pOpt.get().getTotal();
                if (pedidoRepo.eliminarLogico(id)) {
                    System.out.println("Pedido ID " + id + " (Total: $" + total + ") dado de baja exitosamente.");
                    System.out.println("Nota: El stock de los productos no fue restaurado según regla de negocio.");
                }
            } else { System.out.println("Pedido no encontrado."); }
        } catch (Exception e) { System.out.println("ID inválido."); }
    }

    private static void listarPedidos() {
        System.out.println("\n--- Lista de Todos los Pedidos ---");
        var lista = pedidoRepo.listarActivos();
        if (lista.isEmpty()) System.out.println("No hay pedidos.");
        else lista.forEach(p -> System.out.println("ID: " + p.getId() + " | Fecha: " + p.getFecha() + " | Estado: " + p.getEstado() + " | Pago: " + p.getFormaPago() + " | Usuario: " + p.getUsuario().getNombre() + " | Total: $" + p.getTotal()));
    }

    private static void pedidosPorUsuario() {
        listarUsuarios();
        System.out.print("Seleccione ID del usuario: ");
        try {
            Long uid = Long.parseLong(sc.nextLine().trim());
            var lista = usuarioRepo.buscarPedidosPorUsuario(uid);
            if (lista.isEmpty()) System.out.println("Este usuario no tiene pedidos activos.");
            else lista.forEach(p -> System.out.println("ID: " + p.getId() + " | " + p.getFecha() + " | Estado: " + p.getEstado() + " | Total: $" + p.getTotal()));
        } catch(Exception e) { System.out.println("ID inválido."); }
    }

    private static void pedidosPorEstado() {
        System.out.println("Estados: 1=PENDIENTE, 2=CONFIRMADO, 3=TERMINADO, 4=CANCELADO");
        System.out.print("Seleccione: ");
        String op = sc.nextLine().trim();
        EstadoPedido est = switch(op) {
            case "1" -> EstadoPedido.PENDIENTE;
            case "2" -> EstadoPedido.CONFIRMADO;
            case "3" -> EstadoPedido.TERMINADO;
            case "4" -> EstadoPedido.CANCELADO;
            default -> null;
        };

        if (est == null) { System.out.println("Inválido."); return; }

        var lista = pedidoRepo.buscarPorEstado(est);
        if (lista.isEmpty()) System.out.println("No hay pedidos en estado " + est);
        else lista.forEach(p -> System.out.println("ID: " + p.getId() + " | Fecha: " + p.getFecha() + " | Usuario: " + p.getUsuario().getNombre() + " | Total: $" + p.getTotal()));
    }

    // ==========================================
    // MÓDULO REPORTES (PDF Seccion 5.5)
    // ==========================================
    private static void menuReportes() {
        boolean volver = false;
        while (!volver) {
            System.out.println("\n===== REPORTES =====");
            System.out.println("1. Productos por categoría");
            System.out.println("2. Pedidos por usuario");
            System.out.println("3. Pedidos por estado");
            System.out.println("4. Total facturado (solo TERMINADOS)");
            System.out.println("0. Volver");
            System.out.print("Opción: ");
            String op = sc.nextLine().trim();

            switch (op) {
                case "1" -> productosPorCategoria();
                case "2" -> pedidosPorUsuario();
                case "3" -> pedidosPorEstado();
                case "4" -> totalFacturado();
                case "0" -> volver = true;
                default -> System.out.println("Opción inválida.");
            }
        }
    }

    private static void productosPorCategoria() {
        listarCategorias();
        System.out.print("Seleccione ID de categoría: ");
        try {
            Long cid = Long.parseLong(sc.nextLine().trim());
            var lista = categoriaRepo.buscarProductosPorCategoria(cid);
            if (lista.isEmpty()) System.out.println("No hay productos activos en esta categoría.");
            else lista.forEach(p -> System.out.println("ID: " + p.getId() + " | " + p.getNombre() + " | $" + p.getPrecio() + " | Stock: " + p.getStock()));
        } catch(Exception e) { System.out.println("ID inválido."); }
    }

    private static void totalFacturado() {
        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        try {
            String jpql = "SELECT SUM(p.total) FROM Pedido p WHERE p.estado = :estado AND p.eliminado = false";
            TypedQuery<Double> query = em.createQuery(jpql, Double.class);
            query.setParameter("estado", EstadoPedido.TERMINADO);
            Double total = query.getSingleResult();

            double sumatoriaFinal = total != null ? total : 0.0;
            // Formato exacto a dos decimales que exige el PDF (ej: $12500.00)
            System.out.println(String.format(Locale.US, "\n--- TOTAL FACTURADO: $%.2f ---", sumatoriaFinal));

        } catch (Exception e) {
            System.out.println("Error al calcular el total: " + e.getMessage());
        } finally {
            em.close();
        }
    }
}