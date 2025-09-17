import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import istanbul from 'vite-plugin-istanbul';

export default defineConfig({
  plugins: [
    react(),
    istanbul({
      include: 'src/*',
      exclude: ['node_modules', 'tests', 'coverage'],
      extension: ['.js', '.ts', '.tsx'],
      requireEnv: true
    })
  ]
});