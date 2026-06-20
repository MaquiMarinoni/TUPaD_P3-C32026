# Parcial 2 - Programación III: Sistema de Gestión (JPA)

**Alumna:** Macarena Marinoni  
**Materia:** Programación III - UTN (Tecnicatura Universitaria en Programación a Distancia)

## Descripción del Proyecto
Este proyecto es una aplicación de consola desarrollada en Java que implementa una capa de persistencia de datos utilizando **JPA (Java Persistence API)**, **Hibernate** y una base de datos en memoria **H2**.

El sistema cuenta con una arquitectura basada en Repositorios genéricos y específicos (`BaseRepository`, `CategoriaRepository`, `ProductoRepository`) y permite realizar operaciones de tipo ABM (Alta, Baja lógica y Modificación) para gestionar entidades de Categorías y Productos. Además, incluye consultas personalizadas tipadas utilizando **JPQL**.

## Instrucciones para ejecutarlo
Para correr el proyecto localmente, sigue estos pasos:

1. **Abrir el proyecto:** Abre la carpeta del proyecto en tu entorno de desarrollo (se recomienda IntelliJ IDEA).
2. **Sincronizar Gradle:** Asegúrate de que Gradle haya descargado todas las dependencias necesarias (`hibernate-core`, `h2`, `lombok`, etc.).
3. **Ejecutar la aplicación:** Navega hasta el archivo principal ubicado en la ruta `src/main/java/ar/edu/tup/programacion3/Main.java`.
4. Haz clic derecho sobre el archivo y selecciona **Run 'Main.main()'** (o utiliza el botón de Play en la barra superior).
5. **Interactuar:** Una vez que la base de datos se inicialice, el menú interactivo aparecerá en la consola del IDE, donde podrás ingresar los números correspondientes a cada opción para probar el ABM y los reportes.

---
*Nota: La base de datos está configurada con la estrategia `create-drop`, por lo que se generará una estructura limpia en cada ejecución.*
*Nota 2: link video explicativo: https://youtu.be/5oHgEXgwmWY *