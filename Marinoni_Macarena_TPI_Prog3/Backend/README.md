#  Food Store - Backend JPA & Consola

Este proyecto corresponde a la **Parte 2 (Backend)** del Trabajo Práctico Integrador de Programación III.
Es una aplicación Java de consola que implementa la capa de persistencia y lógica de negocio del sistema utilizando JPA, Hibernate y una base de datos embebida H2.

## Alumno
* **Nombre y Apellido:** Macarena Marinoni
* **DNI:** 38374424
* **Comisión:** C15-2026

## Stack Tecnológico
* **Lenguaje:** Java 17 (o superior)
* **Gestor de Dependencias:** Gradle
* **ORM:** JPA / Hibernate 6.x
* **Base de Datos:** H2 Database (Modo archivo: `./data/jpa_db`)
* **Librerías Extra:** Lombok

## Características Implementadas
* **Modelado de Entidades:** Relaciones de base de datos (`@OneToMany`, `@ManyToOne`) para `Usuario`, `Pedido`, `DetallePedido`, `Producto` y `Categoria`.
* **Bajas Lógicas (Soft Delete):** Implementación de borrado lógico en todas las entidades del sistema en lugar de borrado físico.
* **Consultas JPQL:** Repositorios fuertemente tipados con métodos personalizados para filtrar datos.
* **Transacciones Atómicas:** El alta de pedidos se ejecuta bajo una única transacción de `EntityManager`. Si falla la validación de stock o la persistencia, se aplica un *Rollback* automático.
* **Menú Interactivo:** Interfaz de consola completa para la gestión de ABM y Reportes analíticos.

##  Instrucciones de Ejecución
Para probar la aplicación:

1. Abrir la carpeta del backend en **IntelliJ IDEA** (con Gradle).
2. Esperar a que Gradle sincronice y descargue las dependencias (Hibernate, H2, Lombok).
3. Dirígirse a la ruta `src/main/java/com/tp/jpa/Main.java`.
4. Ejecutar el método `main`.
5. Interactuar con el sistema utilizando las opciones numéricas que aparecerán en la consola inferior.

---
**Nota:** El sistema generará automáticamente la base de datos en la carpeta `/data` utilizando la configuración `hibernate.hbm2ddl.auto = update`.