import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/Portafolio/', // nombre EXACTO de tu repo [web:126][web:111]
});