import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Optional: you can define path aliases here
    },
  },
  assetsInclude: ['**/*.png'], // This allows importing PNG files as URLs
});
