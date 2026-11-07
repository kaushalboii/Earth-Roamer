import { defineConfig } from 'vite';
import cesium from 'vite-plugin-cesium';

export default defineConfig({
  base: './',
  plugins: [cesium()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    chunkSizeWarningLimit: 5000
  }
});

