import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures relative paths for assets, crucial for GitHub Pages or IPFS
  server: {
    host: true, // Listen on all addresses
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
});