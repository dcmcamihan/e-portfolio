import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves the site from /e-portfolio/.
export default defineConfig({
  base: '/e-portfolio/',
  plugins: [react()],
  build: { target: 'es2020', assetsInlineLimit: 0 },
});
