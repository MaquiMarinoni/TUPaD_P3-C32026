import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173, // Definimos el puerto fijo para pruebas
    open: true, // Esto abrirá el navegador automáticamente al iniciar
  },
});