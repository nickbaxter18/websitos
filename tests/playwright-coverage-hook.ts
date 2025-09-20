import fs from "fs";
import path from "path";
import { Page, test } from "@playwright/test";

test.beforeAll(async ({ page }: { page: Page }) => {
  const coverageApi = (page as unknown as { coverage?: { startJSCoverage?: () => Promise<void> } })
    .coverage;
  if (coverageApi && coverageApi.startJSCoverage) {
    console.log("✅ Starting JS coverage in Playwright...");
    await coverageApi.startJSCoverage();
  } else {
    console.log("⚠️ Browser coverage API not available on page");
  }
});

test.afterAll(async ({ page }: { page: Page }) => {
  const coverageApi = (
    page as unknown as { coverage?: { stopJSCoverage?: () => Promise<unknown> } }
  ).coverage;
  if (coverageApi && coverageApi.stopJSCoverage) {
    console.log("✅ Stopping JS coverage in Playwright, writing to .nyc_output...");
    const jsCoverage = await coverageApi.stopJSCoverage();
    fs.mkdirSync(".nyc_output", { recursive: true });
    const filePath = path.join(".nyc_output", `playwright-coverage-${Date.now()}.json`);
    fs.writeFileSync(filePath, JSON.stringify(jsCoverage, null, 2));
    console.log(`✅ Coverage data written to ${filePath}`);
  } else {
    console.log("⚠️ No browser coverage API available on page");
  }
});
