import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/", // ✅ ensure assets load from root, not /websitos/
  server: {
    port: 5173, // try 5173 first
    strictPort: false, // ✅ fallback to next available if 5173 is taken
    open: true, // auto-open browser
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  css: {
    postcss: "./postcss.config.js", // ✅ ensures Tailwind+PostCSS load
  },
});
