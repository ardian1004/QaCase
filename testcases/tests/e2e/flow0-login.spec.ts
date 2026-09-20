import { test, expect } from '@playwright/test';

test.describe('Flow 0 - Sign In & Master Data Sync Lifecycle', () => {

  test('User successfully logs in, performs tenant lookup, SSO, and downloads master data', async ({ page }) => {
    // 1. Navigate to Sign In page
    await page.goto('/login');

    // 2. Input Username & Trigger Tenant Lookup (/user/who)
    const usernameInput = page.locator('input[name="username"]');
    await expect(usernameInput).toBeVisible();
    await usernameInput.fill('operator.mining@tenant-a.com');

    // Intercept /user/who API response to verify tenant lookup
    const [whoResponse] = await Promise.all([
      page.waitForResponse((response) => response.url().includes('/user/who') && response.status() === 200),
      page.click('button[type="submit"]')
    ]);

    const whoData = await whoResponse.json();
    expect(whoData).toHaveProperty('tenant_id');

    // 3. Open Microsoft Login SSO Screen
    // Verify redirection or iframe loading for Microsoft SSO credentials
    await expect(page).toHaveURL(/.*login\.microsoftonline\.com|.*sso/);

    // Fill Microsoft SSO Dummy Credentials
    await page.fill('input[type="email"]', 'operator.mining@tenant-a.com');
    await page.click('input[type="submit"]');
    await page.fill('input[type="password"]', 'Password123!');
    await page.click('input[type="submit"]');

    // 4. Validate Fetch User Profile (/user/me) & Master Data List (/tenant/master)
    await expect(page).toHaveURL('/dashboard');

    // Verify Progress Bar while downloading master data (locations, areas, forms, etc.)
    const progressBar = page.locator('.master-data-progress-bar');
    await expect(progressBar).toBeVisible();

    // Wait until progress reaches 100% / downloads complete
    await expect(page.locator('.progress-percentage')).toHaveText('100%', { timeout: 30000 });

    // 5. Prompt user to restart after first-time master data update
    const restartPrompt = page.locator('.modal-restart-prompt');
    await expect(restartPrompt).toBeVisible();
    await expect(restartPrompt).toContainText('Please restart the application to apply initial master data');

    // Action: Click Restart Button
    await page.click('button[data-testid="restart-app-btn"]');
    
    // Verify application reloaded and user is ready for offline/online operations
    await expect(page.locator('.app-status-online')).toBeVisible();
  });

});
