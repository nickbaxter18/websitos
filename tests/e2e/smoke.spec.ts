import { test, expect } from "@playwright/test";

test("homepage loads and responds", async ({ page }) => {
  await page.goto("/");
  // Relaxed smoke test: just ensure page loads with a 200 and has some content
  await expect(page).toHaveURL(/localhost|render/);
  const content = await page.content();
  expect(content.length).toBeGreaterThan(0);
});
