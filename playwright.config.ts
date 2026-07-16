import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  /* Test directory */
  testDir: './tests',
  /* Ignore test files */
  testIgnore: '**/example.spec.ts',
  /* Run tests in files in parallel */

  //grep: /@smoke/, // done by Radha, Run only tests with @smoke tag
  //Timeouts - we can set default timeouts here
  // timeout: 60 * 1000, // 60 seconds max per test (Default is 30 seconds)
  // expect: { 
  //   timeout: 10 * 1000, // 10 seconds max wait for each expect() call (Default is 5 seconds)
  // },

  fullyParallel: true,
  //fullyParallel: false, //done by Radha to run tests in sequence
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  //retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */

  //Retries locally
  retries: 0, // done by Radha for flaky tests
  //workers: process.env.CI ? 1 : undefined,
  workers: 1, // done by Radha to set number of workers
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  //reporter: 'html',
  reporter: [['html', {open: 'always', outputFolder: 'my-custom-report-folder'}],
              ['list'],
              ['line'],
              ['dot'],
              ['json', { outputFile: 'test-results.json' }],
              ['junit', { outputFile: 'test-results.xml' }],
              ['allure-playwright']
            ] , //done by Radha
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',
    //baseURL: 'https://demo.nopcommerce.com',
    baseURL: 'https://testautomationpractice.blogspot.com/', //For Actions

    //done by Radha
    screenshot: 'only-on-failure', // Capture screenshot only on test failure
    video: 'retain-on-failure', // Record video only on test failure

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    //trace: 'on-first-retry',
    trace: 'retain-on-failure', //done by Radha
  },

  /* Configure projects for major browsers */
  projects: [
    // {
    //   name: 'chromium',
    //   use: { ...devices['Desktop Chrome'] },
    // },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
      //fullyParallel: true, // Ensure tests run in parallel in this project, done by Radha
    },

    /*{
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },*/

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
