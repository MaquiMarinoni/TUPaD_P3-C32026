# Food Store - Primer Parcial Programación III

## Descripción del Proyecto
Este proyecto es una evolución de la aplicación "Food Store", desarrollada para consolidar conocimientos en HTML, CSS, JavaScript y TypeScript. Se implementó un catálogo dinámico de productos con funcionalidades de búsqueda y filtrado por categorías, junto con un sistema de carrito de compras que utiliza persistencia de datos mediante LocalStorage.

## Funcionalidades Implementadas
- **Autenticación:** Sistema de Login y Registro de usuarios con validación de roles (Client/Admin).
- **Catálogo Dinámico:** Renderizado de productos desde una base de datos local (`data.ts`).
- **Búsqueda en tiempo real:** Filtrado de productos por nombre mediante una barra de búsqueda.
- **Filtrado por categorías:** Menú lateral funcional para navegar entre los distintos tipos de comida.
- **Carrito de compras:** - Adición de productos con actualización de cantidades.
  - Visualización detallada de ítems, subtotales y total general.
  - Persistencia de datos mediante LocalStorage.
  - Vaciado completo del carrito.
- **Interfaz Responsiva:** Diseño adaptado para diferentes tamaños de pantalla utilizando CSS3.

## Instrucciones para ejecutar el proyecto
1. **Requisitos previos:** Asegúrese de tener instalado [Node.js](https://nodejs.org/) y un gestor de paquetes (npm o pnpm).
2. **Instalación de dependencias:** Ejecute el comando `npm install` o `pnpm install` en la terminal parada en la raíz del proyecto.
3. **Levantar el servidor de desarrollo:**
   Ejecute `npm run dev` o `pnpm dev`.
4. **Acceso a la app:**
   Abra su navegador en la dirección `http://localhost:5173` (o la que indique su terminal).

---
**Desarrollado por:** Macarena Marinoni  
**Materia:** Programación III - Tecnicatura Universitaria en Programación (UTN)
**LINK video**: https://www.youtube.com/watch?v=TF4HSBjuQXk