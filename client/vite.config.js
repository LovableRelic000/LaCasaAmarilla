// client/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Cada vez que React haga un fetch a '/api/...', Vite lo desviará a Node.js
      '/api': {
        target: 'http://localhost:5000', // El puerto donde corre tu Node.js local
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});