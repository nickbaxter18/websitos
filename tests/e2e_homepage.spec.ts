import { test, expect } from "@playwright/test";

test("Landing page loads correctly", async ({ page }) => {
  // Go to the deployed frontend
  await page.goto("http://localhost:10000/websitos/");

  // Check that the H1 headline appears
  const title = page.locator("h1");
  await expect(title).toHaveText(/U-DIG IT Rentals/);

  // Optional: check the CTA button is present
  const cta = page.locator("text=Browse Rentals");
  await expect(cta).toBeVisible();
});