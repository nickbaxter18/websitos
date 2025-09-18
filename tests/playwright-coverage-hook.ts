import fs from "fs";
import path from "path";
import { Page, test } from "@playwright/test";

test.beforeAll(async ({ page }: { page: Page }) => {
  const coverageApi = (page as unknown as { coverage?: { startJSCoverage?: () => Promise<void> } })
    .coverage;
  if (coverageApi && coverageApi.startJSCoverage) {
    await coverageApi.startJSCoverage();
    console.log("✅ Playwright browser coverage started");
  } else {
    console.log("⚠️ Browser coverage API not available on page");
  }
});

test.afterAll(async ({ page }: { page: Page }) => {
  const coverageApi = (
    page as unknown as { coverage?: { stopJSCoverage?: () => Promise<unknown> } }
  ).coverage;
  if (coverageApi && coverageApi.stopJSCoverage) {
    const jsCoverage = await coverageApi.stopJSCoverage();
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
