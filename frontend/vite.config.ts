import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/health-pulse/', // <-- Must match your repository name on GitHub
});