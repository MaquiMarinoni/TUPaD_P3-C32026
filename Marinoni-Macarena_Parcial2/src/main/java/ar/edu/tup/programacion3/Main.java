package ar.edu.tup.programacion3;

import ar.edu.tup.programacion3.entities.Categoria;
import ar.edu.tup.programacion3.entities.Producto;
import ar.edu.tup.programacion3.repository.CategoriaRepository;
import ar.edu.tup.programacion3.repository.ProductoRepository;

import java.util.List;
import java.util.Optional;
import java.util.Scanner;
import java.util.logging.Level;
import java.util.logging.Logger;

public class Main {

    // Bloque estático: Se ejecuta antes que nada para silenciar a Hibernate y H2 en la consola
    static {
        Logger.getLogger("org.hibernate").setLevel(Level.SEVERE);
        Logger.getLogger("org.h2").setLevel(Level.SEVERE);
    }

    private static final CategoriaRepository categoriaRepo = new CategoriaRepository();
    private static final ProductoRepository productoRepo = new ProductoRepository();
    private static final Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {

        try {
            Thread.sleep(500); // Pequeña pausa para que el sistema levante la base de datos en paz
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        int opcion = -1;

        while (opcion != 0) {
            System.out.println("\n--- SISTEMA DE GESTION - PARCIAL 2 ---");
            System.out.println("1. Gestion de Categorias");
            System.out.println("2. Gestion de Productos");
            System.out.println("3. Reportes");
            System.out.println("0. Salir");
            System.out.print("Ingrese una opcion: ");

            try {
                opcion = Integer.parseInt(scanner.nextLine());

                switch (opcion) {
                    case 1:
                        menuCategorias();
                        break;
                    case 2:
                        menuProductos();
                        break;
                    case 3:
                        menuReportes();
                        break;
                    case 0:
                        System.out.println("Saliendo del sistema...");
                        break;
                    default:
                        System.out.println("Opcion incorrecta. Intente nuevamente.");
                }
            } catch (NumberFormatException e) {
                System.out.println("Por favor, ingrese un numero valido.");
            }
        }
    }

    // ==========================================================
    // SUBMENU CATEGORIAS
    // ==========================================================
    private static void menuCategorias() {
        int opcion = -1;
        while (opcion != 0) {
            System.out.println("\n--- SUBMENU CATEGORIAS ---");
            System.out.println("1. Alta de Categoria");
            System.out.println("2. Baja de Categoria");
            System.out.println("3. Modificacion de Categoria");
            System.out.println("4. Listado de Categorias");
            System.out.println("0. Volver al Menu Principal");
            System.out.print("Ingrese una opcion: ");

            try {
                opcion = Integer.parseInt(scanner.nextLine());

                switch (opcion) {
                    case 1:
                        System.out.print("Ingrese nombre de la categoria: ");
                        String nombre = scanner.nextLine();
                        if (nombre.trim().isEmpty()) {
                            System.out.println("Error: El nombre no puede estar vacio.");
                            break;
                        }
                        System.out.print("Ingrese descripcion: ");
                        String desc = scanner.nextLine();

                        Categoria nuevaCat = Categoria.builder()
                                .nombre(nombre)
                                .descripcion(desc)
                                .build();

                        Categoria catGuardada = categoriaRepo.guardar(nuevaCat);
                        System.out.println("Categoria guardada con exito. ID generado: " + catGuardada.getId());
                        break;

                    case 2:
                        System.out.print("Ingrese el ID de la categoria a eliminar: ");
                        Long idBaja = Long.parseLong(scanner.nextLine());

                        Optional<Categoria> catParaBaja = categoriaRepo.buscarPorId(idBaja);
                        if (catParaBaja.isPresent() && !catParaBaja.get().isEliminado()) {
                            categoriaRepo.eliminarLogico(idBaja);
                            System.out.println("Se ha dado de baja la categoria: " + catParaBaja.get().getNombre());
                        } else {
                            System.out.println("Error: El ID no existe o ya esta dado de baja.");
                        }
                        break;

                    case 3:
                        listarCategorias();
                        System.out.print("\nIngrese el ID de la categoria a modificar: ");
                        Long idMod = Long.parseLong(scanner.nextLine());

                        Optional<Categoria> catOp = categoriaRepo.buscarPorId(idMod);
                        if (catOp.isEmpty() || catOp.get().isEliminado()) {
                            System.out.println("Error: ID invalido o categoria inactiva.");
                            break;
                        }

                        Categoria catAModificar = catOp.get();
                        System.out.println("Valores actuales -> Nombre: " + catAModificar.getNombre() + " | Descripcion: " + catAModificar.getDescripcion());

                        System.out.print("Nuevo nombre (deje en blanco para mantener actual): ");
                        String nuevoNombre = scanner.nextLine();
                        if (!nuevoNombre.trim().isEmpty()) {
                            catAModificar.setNombre(nuevoNombre);
                        }

                        System.out.print("Nueva descripcion (deje en blanco para mantener actual): ");
                        String nuevaDesc = scanner.nextLine();
                        if (!nuevaDesc.trim().isEmpty()) {
                            catAModificar.setDescripcion(nuevaDesc);
                        }

                        categoriaRepo.guardar(catAModificar);
                        System.out.println("Categoria actualizada con exito.");
                        break;

                    case 4:
                        listarCategorias();
                        break;
                    case 0:
                        break;
                    default:
                        System.out.println("Opcion incorrecta.");
                }
            } catch (NumberFormatException e) {
                System.out.println("Error: Ingrese un numero valido.");
            }
        }
    }

    private static void listarCategorias() {
        System.out.println("\n--- CATEGORIAS ACTIVAS ---");
        List<Categoria> activas = categoriaRepo.listarActivos();
        if (activas.isEmpty()) {
            System.out.println("No hay categorias activas.");
        } else {
            for (Categoria c : activas) {
                System.out.println("ID: " + c.getId() + " | Nombre: " + c.getNombre() + " | Desc: " + c.getDescripcion());
            }
        }
    }

    // ==========================================================
    // SUBMENU PRODUCTOS
    // ==========================================================
    private static void menuProductos() {
        int opcion = -1;
        while (opcion != 0) {
            System.out.println("\n--- SUBMENU PRODUCTOS ---");
            System.out.println("1. Alta de Producto");
            System.out.println("2. Baja de Producto");
            System.out.println("3. Modificacion de Producto");
            System.out.println("4. Listado de Productos");
            System.out.println("0. Volver al Menu Principal");
            System.out.print("Ingrese una opcion: ");

            try {
                opcion = Integer.parseInt(scanner.nextLine());

                switch (opcion) {
                    case 1:
                        System.out.println("\n--- Seleccione una Categoria ---");
                        List<Categoria> categoriasActivas = categoriaRepo.listarActivos();
                        if (categoriasActivas.isEmpty()) {
                            System.out.println("Error: No hay categorias activas. Debe crear una primero.");
                            break;
                        }
                        for (Categoria c : categoriasActivas) {
                            System.out.println("ID: " + c.getId() + " | Nombre: " + c.getNombre());
                        }
                        System.out.print("Ingrese el ID de la categoria: ");
                        Long idCat = Long.parseLong(scanner.nextLine());
                        Optional<Categoria> catOp = categoriaRepo.buscarPorId(idCat);
                        if (catOp.isEmpty() || catOp.get().isEliminado()) {
                            System.out.println("Error: Categoria invalida.");
                            break;
                        }

                        System.out.print("Ingrese nombre del producto: ");
                        String nombre = scanner.nextLine();
                        System.out.print("Ingrese descripcion: ");
                        String desc = scanner.nextLine();

                        System.out.print("Ingrese precio (mayor a 0): ");
                        double precio = Double.parseDouble(scanner.nextLine());
                        if (precio <= 0) {
                            System.out.println("Error: El precio debe ser mayor a 0.");
                            break;
                        }

                        System.out.print("Ingrese stock (mayor o igual a 0): ");
                        int stock = Integer.parseInt(scanner.nextLine());
                        if (stock < 0) {
                            System.out.println("Error: El stock no puede ser negativo.");
                            break;
                        }

                        // Creamos el producto limpio
                        Producto nuevoProd = Producto.builder()
                                .nombre(nombre)
                                .descripcion(desc)
                                .precio(precio)
                                .stock(stock)
                                .disponible(true)
                                .build();

                        // USAMOS EL METODO SEGURO QUE MANTIENE LA TRANSACCION ABIERTA
                        categoriaRepo.agregarProducto(catOp.get().getId(), nuevoProd);

                        System.out.println("Producto guardado con exito en categoria: " + catOp.get().getNombre());
                        break;

                    case 2:
                        System.out.print("Ingrese el ID del producto a eliminar: ");
                        Long idBaja = Long.parseLong(scanner.nextLine());

                        Optional<Producto> prodParaBaja = productoRepo.buscarPorId(idBaja);
                        if (prodParaBaja.isPresent() && !prodParaBaja.get().isEliminado()) {
                            productoRepo.eliminarLogico(idBaja);
                            System.out.println("Se ha dado de baja el producto: " + prodParaBaja.get().getNombre());
                        } else {
                            System.out.println("Error: El ID no existe o ya esta dado de baja.");
                        }
                        break;

                    case 3:
                        listarProductos();
                        System.out.print("\nIngrese el ID del producto a modificar: ");
                        Long idMod = Long.parseLong(scanner.nextLine());

                        Optional<Producto> pOp = productoRepo.buscarPorId(idMod);
                        if (pOp.isEmpty() || pOp.get().isEliminado()) {
                            System.out.println("Error: ID invalido o producto inactivo.");
                            break;
                        }

                        Producto pMod = pOp.get();
                        System.out.println("Valores actuales -> Nombre: " + pMod.getNombre() + " | Precio: " + pMod.getPrecio() + " | Stock: " + pMod.getStock());

                        System.out.print("Nuevo nombre (deje en blanco para mantener actual): ");
                        String nuevoNombre = scanner.nextLine();
                        if (!nuevoNombre.trim().isEmpty()) {
                            pMod.setNombre(nuevoNombre);
                        }

                        System.out.print("Nuevo precio (deje en blanco para mantener actual): ");
                        String nuevoPrecioStr = scanner.nextLine();
                        if (!nuevoPrecioStr.trim().isEmpty()) {
                            double nuevoPrecio = Double.parseDouble(nuevoPrecioStr);
                            if (nuevoPrecio <= 0) {
                                System.out.println("Error: El precio debe ser mayor a 0.");
                                break;
                            }
                            pMod.setPrecio(nuevoPrecio);
                        }

                        System.out.print("Nuevo stock (deje en blanco para mantener actual): ");
                        String nuevoStockStr = scanner.nextLine();
                        if (!nuevoStockStr.trim().isEmpty()) {
                            int nuevoStock = Integer.parseInt(nuevoStockStr);
                            if (nuevoStock < 0) {
                                System.out.println("Error: El stock no puede ser negativo.");
                                break;
                            }
                            pMod.setStock(nuevoStock);
                        }

                        productoRepo.guardar(pMod);
                        System.out.println("Producto actualizado con exito.");
                        break;

                    case 4:
                        listarProductos();
                        break;
                    case 0:
                        break;
                    default:
                        System.out.println("Opcion incorrecta.");
                }
            } catch (NumberFormatException e) {
                System.out.println("Error: Formato de numero invalido.");
            }
        }
    }

    private static void listarProductos() {
        System.out.println("\n--- PRODUCTOS ACTIVOS ---");
        List<Producto> activos = productoRepo.listarActivos();
        if (activos.isEmpty()) {
            System.out.println("No hay productos activos.");
        } else {
            for (Producto p : activos) {
                // Solo mostramos los datos propios del producto (evitando el error Lazy de las categorias)
                System.out.println("ID: " + p.getId() + " | Nombre: " + p.getNombre() + " | Precio: $" + p.getPrecio() + " | Stock: " + p.getStock());
            }
        }
    }

    // ==========================================================
    // SUBMENU REPORTES
    // ==========================================================
    private static void menuReportes() {
        System.out.println("\n--- REPORTE: PRODUCTOS POR CATEGORIA ---");
        List<Categoria> categoriasActivas = categoriaRepo.listarActivos();
        if (categoriasActivas.isEmpty()) {
            System.out.println("No hay categorias activas para filtrar.");
            return;
        }

        System.out.println("Seleccione una categoria:");
        for (Categoria c : categoriasActivas) {
            System.out.println("ID: " + c.getId() + " | Nombre: " + c.getNombre());
        }

        System.out.print("Ingrese el ID de la categoria: ");
        try {
            Long idCat = Long.parseLong(scanner.nextLine());

            Optional<Categoria> catOp = categoriaRepo.buscarPorId(idCat);
            if (catOp.isEmpty() || catOp.get().isEliminado()) {
                System.out.println("Error: Categoria invalida.");
                return;
            }

            List<Producto> productosFiltrados = productoRepo.buscarPorCategoria(idCat);

            if (productosFiltrados.isEmpty()) {
                System.out.println("No hay productos activos en la categoria seleccionada.");
            } else {
                System.out.println("\n--- RESULTADOS DE LA BUSQUEDA ---");
                for (Producto p : productosFiltrados) {
                    System.out.println("ID: " + p.getId() + " | Nombre: " + p.getNombre() + " | Precio: $" + p.getPrecio() + " | Stock: " + p.getStock());
                }
            }
        } catch (NumberFormatException e) {
            System.out.println("Error: Ingrese un ID numerico valido.");
        }
    }
}