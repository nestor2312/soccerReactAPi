import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Esto puede ayudar a que Vercel encuentre las rutas correctamente
});
