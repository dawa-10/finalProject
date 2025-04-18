import { test, expect } from '@playwright/test';

test('User can follow and remove a tournament', async ({ page }) => {
  test.setTimeout(5 * 60 * 1000); //  extend timeout

  console.log("🔐 Logging in...");
  await page.goto('http://localhost:5173/login', { timeout: 60000 });
  await page.fill('#username', 'testuser123');
  await page.fill('#password', 'Test@123');
  await Promise.all([
    page.waitForNavigation({ timeout: 30000 }),
    page.click('button[type="submit"]')
  ]);

  console.log(" Navigating to recent tournaments...");
  await page.goto('http://localhost:5173/recent-tournaments', { timeout: 60000 });

  console.log(" Waiting for Follow button...");
  await page.waitForSelector('[data-testid^="follow-btn-"]', { timeout: 60000 });

  const followButton = page.locator('[data-testid^="follow-btn-"]').first();
  if (await followButton.isVisible()) {
    console.log("Clicking Follow button...");
    await followButton.click();
  } else {
    console.warn("Follow button not visible – maybe already followed?");
  }

  console.log(" Navigating to user profile...");
  await page.goto('http://localhost:5173/user', { timeout: 60000 });

  console.log("Checking for followed tournament...");
  const cards = page.locator('.tournament-card');
  await expect(cards).toHaveCount(1, { timeout: 30000 });

  const removeButton = page.locator('[data-testid^="remove-btn-"]').first();
  console.log(" Removing followed tournament...");
  await removeButton.click();

  console.log("Verifying removal...");
  await expect(cards).toHaveCount(0, { timeout: 30000 });
});

