import { defineConfig } from 'vite';
import { resolve } from 'node:path';
export default defineConfig({
  base: '/web-projects/',
  build: { rollupOptions: { input: {
    home: resolve(import.meta.dirname, 'index.html'),
    table: resolve(import.meta.dirname, 'table/index.html'),
    objects: resolve(import.meta.dirname, 'objects/index.html'),
    sessions: resolve(import.meta.dirname, 'sessions/index.html')
  } } }
});
