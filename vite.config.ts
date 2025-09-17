import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import istanbul from "vite-plugin-istanbul";
import path from "path";

const enableCoverage = process.env.VITE_COVERAGE === "true";

if (enableCoverage) {
  console.log("✅ Istanbul instrumentation ENABLED for coverage builds");
}

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    react(),
    ...(enableCoverage
      ? [
          istanbul({
            include: "src/**/*",
            exclude: ["node_modules", "tests/"],
            extension: [".js", ".ts", ".jsx", ".tsx"],
            requireEnv: false,
          }),
        ]
      : []),
  ],
});
