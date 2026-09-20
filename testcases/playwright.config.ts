import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI if needed, or set worker count */
  workers: process.env.CI ? 2 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list']
  ],
  
  /* Shared settings for all the projects below. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.API_BASE_URL || 'https://staging.wemine.dev',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    /* Set default timeout for actions like click, fill, etc. */
    actionTimeout: 15000,
  },

  /* Configure projects for major browsers & mobile viewports */
  projects: [
    // Web Office Application Testing
    {
      name: 'wemine-web-office',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },

    // Mobile App (WeMine) Emulation Testing
    {
      name: 'wemine-mobile-app',
      use: { 
        ...devices['Pixel 5'],
        // Custom context options for offline-first validation
        offline: false, // Default state; can be dynamically toggled to `true` inside tests
      },
    },

    // Mobile Emulation for Offline Sync Testing
    {
      name: 'wemine-mobile-offline-simulation',
      use: {
        ...devices['Pixel 5'],
        offline: true, // Forces offline mode from the start of the session
      },
    },
  ],
});
