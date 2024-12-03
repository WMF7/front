import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/test-shop',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});