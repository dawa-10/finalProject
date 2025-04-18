import { test, expect } from '@playwright/test';

test('User can register', async ({ page }) => {
  await page.goto('http://localhost:5173/create-user');
  await page.fill('#username', 'testuser123');
  await page.fill('#password', 'Test@123');
  await page.click('button[type="submit"]');
  await expect(page.locator('text=User Created')).toBeVisible();
});