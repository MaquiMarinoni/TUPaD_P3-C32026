package ar.edu.tup.programacion3;

import ar.edu.tup.programacion3.entities.*;
import ar.edu.tup.programacion3.enums.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        // --- CONFIGURACIÓN DE DATOS DE PRUEBA (MOCK DATA) ---
        Categoria comida = new Categoria("Comida", "Platos rápidos");
        Categoria bebida = new Categoria("Bebida", "Gaseosas y aguas");

        List<Producto> stockProductos = new ArrayList<>();
        stockProductos.add(new Producto("Pancho", 1500.0, "Pancho con aderezos", 15, "pancho.png", true, comida));
        stockProductos.add(new Producto("Hamburguesa", 3500.0, "Hamburguesa simple", 3, "burger.png", true, comida)); // Poco stock
        stockProductos.add(new Producto("Papas Fritas", 1200.0, "Porción de papas", 20, "papas.png", false, comida)); // No disponible
        stockProductos.add(new Producto("Gaseosa Cola", 1000.0, "Gaseosa 500ml", 4, "cola.png", true, bebida)); // Poco stock
        stockProductos.add(new Producto("Agua Mineral", 800.0, "Agua sin gas 500ml", 50, "agua.png", true, bebida));

        // Asignamos IDs ficticios para simular base de datos
        long idContador = 1;
        for (Producto p : stockProductos) {
            p.setId(idContador++);
            p.setCreatedAt(LocalDateTime.now());
            p.setEliminado(false);
        }

        // Armamos un pedido de ejemplo
        Pedido miPedido = new Pedido();
        miPedido.setId(101L);
        miPedido.setFecha(LocalDate.now());
        miPedido.setEstado(Estado.PENDIENTE);
        miPedido.setFormaPago(FormaPago.EFECTIVO);

        // Agregamos ítems (Ejemplo del enunciado: 2 panchos y 2 bebidas) [cite: 64, 65]
        miPedido.addDetallePedido(2, stockProductos.get(0)); // 2 Panchos
        miPedido.addDetallePedido(2, stockProductos.get(3)); // 2 Gaseosas


        // --- RESOLUCIÓN DE LOS PUNTOS DEL TRABAJO PRÁCTICO ---

        System.out.println("==========================================================");
        System.out.println("    RESULTADOS DEL TP - PROGRAMACIÓN FUNCIONAL");
        System.out.println("==========================================================\n");

        // 1) Verificación del Punto 1 (Total calculado internamente en el pedido)
        System.out.println(">>> PUNTO 1: Total del pedido calculado");
        System.out.println("Total del pedido #" + miPedido.getId() + ": $" + miPedido.getTotal());
        System.out.println("----------------------------------------------------------\n");


        // 2) Mostrar por consola productos disponibles [cite: 63]
        System.out.println(">>> PUNTO 2: Productos Disponibles");
        stockProductos.stream()
                .filter(Producto::getDisponible) // Filtra donde disponible == true
                .forEach(p -> System.out.println("- " + p.getNombre() + " ($" + p.getPrecio() + ")")); // Operación terminal [cite: 9]
        System.out.println("----------------------------------------------------------\n");


        // 3) Mostrar por consola la cantidad de ítems que tiene un pedido [cite: 64]
        // (Ejemplo: 2 panchos, 2 bebidas, deberá de decir que hay 4 items) [cite: 64, 65]
        System.out.println(">>> PUNTO 3: Cantidad Total de Ítems en el Pedido");
        int totalItems = miPedido.getDetalles().stream()
                .mapToInt(DetallePedido::getCantidad) // Extrae la cantidad entera de cada línea de detalle
                .sum(); // Suma las cantidades mapeadas
        System.out.println("El pedido tiene un total de: " + totalItems + " ítems.");
        System.out.println("----------------------------------------------------------\n");


        // 4) Detectar productos que tengan menos de 5 como valor en stock [cite: 66]
        System.out.println(">>> PUNTO 4: Alerta de Stock Crítico (Menos de 5 unidades)");
        stockProductos.stream()
                .filter(p -> p.getStock() < 5) // Filtra la condición de stock bajo [cite: 66]
                .forEach(p -> System.out.println("¡ALERTA! -> Producto: " + p.getNombre() + " | Stock actual: " + p.getStock()));
        System.out.println("==========================================================");
    }
}