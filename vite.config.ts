import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths for assets
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // Improve how assets are handled
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        // Create proper chunk naming
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  }
});