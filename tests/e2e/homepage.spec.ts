import { test, expect, Page } from "@playwright/test";

test("homepage loads", async ({ page }: { page: Page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/U-DIG IT/);
});
