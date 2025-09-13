import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  webServer: {
    command: "npm run dev",
    port: 5173, // ✅ match Vite dev server
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: "http://localhost:5173", // ✅ match Vite dev server
    headless: true,
  },
});