import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Serve built assets with relative paths so the app works when deployed
  // from a sub-path or when files are served statically (e.g. GitHub Pages).
  base: './',
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
        // Keep chunking conservative to avoid circular-import initialization
        // issues between shared helper code and markdown plugins. Only
        // separate the large React runtime; leave other node_modules in
        // a single vendor chunk so interdependent libs initialize safely.
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('react-router-dom')) {
              return 'router-vendor';
            }
            return 'vendor';
          }
        }
      }
    }
  }
});
