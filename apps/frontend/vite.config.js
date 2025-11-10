import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración básica de Vite + React
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // puerto donde corre el frontend
    proxy: {
      '/api': 'http://localhost:4000' // proxy hacia tu backend Node
    }
  }
});
