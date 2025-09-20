import { test as base } from "@playwright/test";
import fs from "fs";

// Extend Playwright's test object to collect browser coverage
export const test = base.extend({
  page: async ({ page }, use) => {
    await use(page);

    // After tests, check for window.__coverage__
    const coverage = await page.evaluate(() => (window as any).__coverage__);
    if (coverage) {
      fs.mkdirSync("coverage/e2e", { recursive: true });
      fs.writeFileSync("coverage/e2e/coverage-final.json", JSON.stringify(coverage));
    }
  },
});

export const expect = test.expect;
