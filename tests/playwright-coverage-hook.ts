import fs from "fs";
import path from "path";
import { Page, test } from "@playwright/test";

// Ensure browser coverage starts
// This makes sure stopJSCoverage in afterAll actually has data
test.beforeAll(async ({ page }: { page: Page }) => {
  if ((page as any).coverage && (page as any).coverage.startJSCoverage) {
    await (page as any).coverage.startJSCoverage();
    console.log("✅ Playwright browser coverage started");
  } else {
    console.log("⚠️ Browser coverage API not available on page");
  }
});

// Fallback hook to dump browser coverage if available
test.afterAll(async ({ page }: { page: Page }) => {
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