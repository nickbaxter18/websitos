import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Production-ready Vite config aligned with Render deployment
export default defineConfig({
  plugins: [react()],
  base: "/websitos/", // 👈 MUST match FastAPI static mount path
  build: {
    outDir: "dist",
    sourcemap: false,
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
