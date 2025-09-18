import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

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
      "@": path.resolve(__dirname, "src"),
      v2: path.resolve(__dirname, "v2"),
    },
  },
  css: {
    postcss: "./postcss.config.cjs",
  },
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});
