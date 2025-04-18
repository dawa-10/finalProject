import { test, expect } from '@playwright/test';

test('Notification is displayed when tournament updates', async ({ page }) => {
  test.setTimeout(5 * 60 * 1000); 

  console.log(" Logging in...");
  await page.goto('http://localhost:5173/login', { timeout: 30000 });

  await page.fill('#username', 'testuser123');
  await page.fill('#password', 'Test@123');

  await Promise.all([
    page.waitForNavigation({ timeout: 15000 }),
    page.click('button[type="submit"]')
  ]);

  console.log(" Navigating to ongoing tournaments page...");
  await page.goto('http://localhost:5173/ongoing-tournaments', { timeout: 60000 });

  console.log(" Waiting for notification...");

  let found = false;
  for (let attempt = 1; attempt <= 30; attempt++) {
    const visible = await page.locator('text=New ongoing tournaments available!').isVisible();
    console.log(` Attempt ${attempt}: Notification visible? ${visible}`);
    if (visible) {
      found = true;
      break;
    }
    await page.waitForTimeout(10000); // wait 10s between tries
  }

  if (!found) {
    throw new Error(" Notification not found after 5 minutes.");
  }

  console.log("Notification appeared!");
});
