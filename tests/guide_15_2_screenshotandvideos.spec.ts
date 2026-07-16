//https://www.youtube.com/watch?v=HF3Og7o_xSA&list=PLUDwpEzHYYLtvMVjc-Va3RXLKtdB-ofc2&index=15

import {test, expect} from '@playwright/test';

test.describe('Screenshot and Video Capture', () => {

    //Test to capture screenshots of web pages, elements, and sections
    //We cannot capture video in a single test, video is captured for the entire test run as per the settings in playwright.config.ts
    //We cannot add the screenshot or video capture code inside a test, it has to be done via the config file
    //We cannot add screenshot to the html report, but we can attach screenshots to the allure report
    //So, if we want to capture screenshots or videos, we have to set it in the config file
    test('Capture Screenshot of a Web Page', async ({page}) => {
        // Navigate to the desired web page
        await page.goto('https://demowebshop.tricentis.com/');

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

        // Capture screenshot - current viewport
        //await page.screenshot({path: `screenshots/demowebshop_viewport_${timestamp}.png`});
        // Capture screenshot - full page
        //await page.screenshot({path: `screenshots/demowebshop_homepage_${timestamp}.png`, fullPage: true});

        // Capture screenshot - specific element
        //const logo = page.locator('img[alt="Tricentis Demo Web Shop"]');
        //await logo.screenshot({path: `screenshots/demowebshop_logo_${timestamp}.png`});

        // Capture screenshot - specific section
        const featuredProducts = page.locator('.product-grid');
        await featuredProducts.screenshot({path: `screenshots/demowebshop_featured_${timestamp}.png`});
    });

    //By default, screenshots and videos are saved only for failed tests as per playwright.config.ts settings
    //By default, videos are saved in the test-results folder
    //We can change the location of the videos folder in the config file
    //This test is designed to fail to demonstrate screenshot capture on failure
    //We can verify the screenshot in the test-results folder
    test('Capture screenshot on Test Failure - playwright.config.ts', async ({page}) => {
        // Navigate to a web page
        await page.goto('https://demowebshop.tricentis.com/');
        // Intentionally fail the test
        await expect(page.locator('text=Non-Existent Text')).toBeVisible();        
    });
})