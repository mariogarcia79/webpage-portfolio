import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:4000'
    }
  }
  ,
  build: {
    // Increase warning threshold slightly to avoid noisy warnings while
    // keeping an eye on very large chunks in production.
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // Manual chunking to separate react and markdown-related libs
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('react-router-dom')) {
              return 'router-vendor';
            }
            if (id.includes('react-markdown') || id.includes('rehype') || id.includes('prism')) {
              return 'markdown-vendor';
            }
            return 'vendor';
          }
        }
      }
    }
  }
});
