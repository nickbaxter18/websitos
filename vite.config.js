import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Production-ready Vite config
export default defineConfig({
  plugins: [react()],
  base: "/", // ✅ ensure assets load from root
  build: {
    outDir: "dist",
    sourcemap: false, // smaller + faster build
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  css: {
    postcss: "./postcss.config.js",
  },
});
