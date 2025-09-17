import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import istanbul from "vite-plugin-istanbul";

// ✅ Always log when instrumentation is enabled
console.log("✅ Vite Istanbul coverage plugin enabled for instrumentation");

export default defineConfig({
  plugins: [
    react(),
    istanbul({
      include: "src/*",
      exclude: ["node_modules", "tests/"],
      extension: [".js", ".ts", ".jsx", ".tsx"],
      cypress: true,
      requireEnv: false, // always instrument, regardless of env vars
    }),
  ],
});
