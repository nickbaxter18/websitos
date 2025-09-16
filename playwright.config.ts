import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  webServer: {
    command: "npm run dev",
    port: 5173, // ✅ match Vite dev server
    reuseExistingServer: !process.env.CI,
  },
  reporter: [["list"], ["json", { outputFile: "coverage/e2e/playwright-report.json" }]],
  use: {
    baseURL: "http://localhost:5173", // ✅ match Vite dev server
    headless: true,
    trace: "on-first-retry",
  },
});
