import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Production-ready Vite config aligned with Render deployment
export default defineConfig({
  plugins: [react()],
  base: "/websitos/", // must match FastAPI static mount
  build: {
    outDir: "dist",
    assetsDir: "assets", // ✅ lock assets folder
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
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});
