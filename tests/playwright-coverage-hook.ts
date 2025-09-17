import fs from "fs";
import path from "path";
import { afterAll } from "@playwright/test";

// Fallback hook to dump browser coverage if available
afterAll(async ({ page }) => {
  if ((page as any).coverage && (page as any).coverage.stopJSCoverage) {
    const jsCoverage = await (page as any).coverage.stopJSCoverage();
    fs.mkdirSync(".nyc_output", { recursive: true });
    fs.writeFileSync(
      path.join(".nyc_output", `playwright-coverage-${Date.now()}.json`),
      JSON.stringify(jsCoverage)
    );
    console.log("✅ Playwright browser coverage dumped to .nyc_output");
  } else {
    console.log("⚠️ No browser coverage API available on page");
  }
});