import { test, expect } from '@playwright/test';

test('Non-authenticated users are redirected to login', async ({ page }) => {
  await page.goto('http://localhost:5173/recent-tournaments');

  await expect(page).toHaveURL(/.*login/);
});