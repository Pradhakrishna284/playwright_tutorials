//https://www.youtube.com/watch?v=HF3Og7o_xSA&list=PLUDwpEzHYYLtvMVjc-Va3RXLKtdB-ofc2&index=15

// Approach 1 - playwright.config.ts file changes
// In the 'use' section of the config file, we can set trace to 'on-first-retry'
// This will enable trace collection only when a test fails and is retried for the first time
//trace.zip file will be generated in the test-results folder for the failed test
// We can then open the trace in the Trace Viewer for analysis
// To open the trace viewer, we can use the command:
// npx playwright show-trace <path-to-trace.zip>
// Example: npx playwright show-trace test-results\trace-12345\trace.zip

// Approach 2 - test file changes
// In the test file, we can enable trace collection programmatically using test.step
// This approach gives more control as we can enable trace collection for specific tests only
// We can start trace collection at the beginning of the test and stop it at the end of the test
// The trace will be saved in the test-results folder similar to approach 1
// We can open the trace in the Trace Viewer using the same command as above
// npx playwright show-trace <path-to-trace.zip>

import {test, expect} from '@playwright/test';

test.describe('Traceing using Approach 1 - playwright.config.ts', () => {

    test('Capture Screenshot of a Web Page', async ({page}) => {
        // Navigate to the desired web page
        await page.goto('https://demowebshop.tricentis.com/');

        await expect(page).toHaveTitle(/Demo Web Shop/);
        //Click on a link to navigate to another page
        await page.click('text=Books');
        await expect(page).toHaveTitle(/Demo Web Shop. Books/);
    });
    
    //Approach 2 - programmatically in the test file
    //npx playwright test tests/guide_15_1_traceviewer.spec.ts --headed --trace on
    //This will enable trace for all tests in this file
    test.only('Traceing using Approach 2 - test file changes', async ({page}) => {
          // Navigate to the desired web page
        await page.goto('https://demowebshop.tricentis.com/');

        await expect(page).toHaveTitle(/Demo Web Shop/);
        //Click on a link to navigate to another page
        await page.click('text=Books');
        await expect(page).toHaveTitle(/Demo Web Shop. Books/);
    });

    //To view the trace file (3 ways):
    //1. npx playwright show-trace <path-to-trace.zip>
    //2. From the HTML report, click on the trace link for the failed test
    //3. utility: https://trace.playwright.dev/ - Upload the trace.zip file to view the trace
    // It is for developer convenience, not for production use.
});