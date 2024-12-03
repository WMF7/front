import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: 'https://github.com/moatazeldebsy/test-shop',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});