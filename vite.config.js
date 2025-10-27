import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config dengan proxy untuk backend API agar menghindari CORS di development
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        // opsional: rewrite path jika diperlukan
        // rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
      '/uploads': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
});
