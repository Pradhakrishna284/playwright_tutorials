//https://www.youtube.com/watch?v=drW3w7ESaJo&list=PLUDwpEzHYYLtvMVjc-Va3RXLKtdB-ofc2&index=14
//https://playwright.dev/docs/actionability

//Assertions:- default time is 5 seconds
//Actions:- default time is 30 seconds
//Overall test timeout:- default time is 30 seconds
//Autowait:- Playwright will wait for the element to be ready before performing actions or assertions

import { test, expect } from '@playwright/test';

test.describe('Autowait in Playwright', () => {
  
  test('should wait for the element to be ready before clicking', async ({ page }) => {
    await page.goto('https://example.com/dynamic-button');  
    // Click the button that appears after some delay
    await page.click('#delayed-button');
    // Assert that the button was clicked successfully
    await expect(page.locator('#result')).toHaveText('Button Clicked!');
  });

  test('force action without waiting', async ({ page }) => {
    await page.goto('https://example.com/dynamic-button');
    // Force click the button without waiting for it to be ready
    //Actionability checks are not performed like visibility, enabled state, etc.
    await page.click('#delayed-button', { force: true }); // Bypass all checks and click immediately
    // Assert that the button was clicked successfully
    await expect(page.locator('#result')).toHaveText('Button Clicked!');
  });

    test('should wait for the element to be visible before asserting', async ({ page }) => {    
    await page.goto('https://example.com/dynamic-content');
    // Assert that the dynamic content appears after some delay
    await expect(page.locator('#dynamic-content')).toHaveText('Content Loaded!');
  });

  test('should handle element becoming enabled before interaction', async ({ page }) => {
    await page.goto('https://example.com/enable-button');
    // Click the button that becomes enabled after some delay
    await page.click('#enable-button');
    // Assert that the button was clicked successfully
    await expect(page.locator('#status')).toHaveText('Button Enabled and Clicked!');
  });   
});

