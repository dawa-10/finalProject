import { test, expect } from '@playwright/test';

test('User can login successfully', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await page.fill('#username', 'testuser123');
  await page.fill('#password', 'Test@123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/.*homepage/);
});

test('Invalid login shows error', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await page.fill('#username', 'wronguser');
  await page.fill('#password', 'wrongpass');
  await page.click('button[type="submit"]');
  await expect(page.locator('text=Error logging in')).toBeVisible();
});