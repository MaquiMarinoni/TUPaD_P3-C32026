import { defineConfig } from 'vite';

/**
 * RECUERDA: Este archivo configura cómo Vite procesa tu proyecto.
 * Exportamos un objeto de configuración para que el servidor sepa
 * dónde están los archivos y cómo manejarlos.
 */
export default defineConfig({
  server: {
    port: 5173, // Definimos el puerto fijo para tus pruebas
    open: true, // Esto abrirá el navegador automáticamente al iniciar
  },
});