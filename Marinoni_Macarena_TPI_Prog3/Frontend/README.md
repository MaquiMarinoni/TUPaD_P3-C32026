# Food Store - Frontend Web

Este proyecto corresponde a la **Parte 1 (Frontend)** del Trabajo Práctico Integrador de Programación III. 
Consiste en una aplicación web tipo E-commerce para la gestión y realización de pedidos de comida, construida con Vanilla TypeScript y Vite.

## Alumno
* **Nombre y Apellido:** Macarena Marinoni
* **DNI:** 38374424
* **Comisión:** C15-2026

## Tecnologías Utilizadas
* **Lenguaje:** TypeScript / HTML5 / CSS3
* **Bundler:** Vite
* **Almacenamiento:** LocalStorage (Simulación de persistencia)
* **Datos:** Fetch a archivos `.json` locales (simulando una API REST)

## Características y Funcionalidades
* **Autenticación (AuthGuard):** Login y Registro con validación de roles (`ADMIN` y `CLIENT`).
* **Landing Page Pública:** Vidriera de acceso al sitio.
* **Flujo de Cliente:** Catálogo de productos con filtros combinados (categoría, búsqueda de texto y ordenamiento), carrito de compras reactivo y checkout. Historial de "Mis Pedidos".
* **Flujo de Administrador:** Dashboard analítico, y simulación de CRUD en memoria para Categorías, Productos y cambio de estado en los Pedidos.

## Instrucciones de Ejecución
Para correr este proyecto en un entorno local:

1. Tener **Node.js** instalado.
2. Abrir una terminal en la carpeta raíz del frontend.
3. Instalar las dependencias:
   npm install
4. Iniciar el servidor de desarrollo:
   npm run dev
5. Abrir enlace proporcionado en la consola (usualmente http://localhost:5173/).