import { test, expect } from '@playwright/test';

test('User can view recent tournaments and standings', async ({ page }) => {
  console.log(" Logging in...");
  await page.goto('http://localhost:5173/login', { timeout: 30000 });

  await page.fill('#username', 'suraj1');
  await page.fill('#password', '123');

  await Promise.all([
    page.waitForNavigation({ timeout: 15000 }),
    page.click('button[type="submit"]')
  ]);

  console.log(" Navigating to recent tournaments...");
  await page.goto('http://localhost:5173/recent-tournaments', { timeout: 60000 });

  
  console.log(" Waiting for tournament rows to load (up to 5 mins)...");
  let found = false;
  for (let attempt = 1; attempt <= 25; attempt++) {
    const rows = await page.locator('table.tournaments-table tbody tr').count();
    console.log(` Attempt ${attempt}: Found ${rows} rows`);
    if (rows > 0) {
      found = true;
      break;
    }
    await page.waitForTimeout(10000);
  }

  if (!found) throw new Error("No tournaments loaded after 5 mins");

  
  await expect(page.locator('h1')).toHaveText('Recent Tournaments', { timeout: 10000 });

 
  const standingsLink = page.locator('text=View Standings').first();
  await standingsLink.click();

  await expect(page.locator('h1')).toContainText('Standings', { timeout: 10000 });
});
