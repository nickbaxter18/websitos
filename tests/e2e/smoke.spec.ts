import { test, expect } from "@playwright/test";

test("homepage loads and responds", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Websitos/i);
});
