//https://www.youtube.com/watch?v=drW3w7ESaJo&list=PLUDwpEzHYYLtvMVjc-Va3RXLKtdB-ofc2&index=14
//Assertions in Playwright Testing
//https://playwright.dev/docs/test-assertions
//https://playwright.dev/docs/api/class-testexpect
//Assertions are used to verify that the state of your application is as expected during test execution.
//Playwright provides a rich set of built-in assertions that can be used to validate various conditions in your tests.
//Auto-retry  and non auto-retry assertions
//Playwright's assertions automatically wait for the expected condition to be met before proceeding, making your tests more reliable and reducing the need for explicit waits.
//Custom error messages
//You can provide custom error messages for assertions to make it easier to understand test failures.
//
import { test, expect } from '@playwright/test';
test.describe('Guide 14 - Assertions in Playwright Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://playwright.dev/docs/test-assertions');
  });
    test('2.2 - Element enabled/disabled', async ({ page }) => {    
        // Locate the button
    const button = page.locator('button');
    
    // Check if enabled
    await expect(button).toBeEnabled();
    // Check if disabled
    await expect(button).toBeDisabled();
  });
    test('2.3 - Element in viewport', async ({ page }) => {     
    // Locate the element
    const element = page.locator('text=Assertions are used to verify that the state of your application');
    // Check if the element is in the viewport
    await expect(element).toBeInViewport();
  });

  test('Auto retry assertions', async ({ page }) => {
    // Locate the button
    const button = page.locator('button#delayed-button');
    // Click the button to trigger a delayed action
    await button.click();
    // Assert that a new element appears after a delay
    const newElement = page.locator('text=New Element');
    await expect(newElement).toBeVisible({ timeout: 5000 }); // Auto-retry for up to 5 seconds
  });

  test('Custom error messages', async ({ page }) => {
    // Locate the button
    const button = page.locator('button#non-existent-button');
    // Assert with a custom error message
    await expect(button, 'The expected button is not visible on the page.').toBeVisible();
  });

  test('Non auto-retry assertion', async ({ page }) => {
    // Locate the button
    const button = page.locator('button#immediate-button');
    const getText = await page.locator('h1').textContent();
    // Non auto-retry assertion
    expect(getText).toBe('Playwright Testing'); // This will not retry
  });

  test('Negating matcher', async ({ page }) => {
    // Locate the button
    const button = page.locator('button#submit-button');
    // Negating matcher for auto-retry to check that the button is not disabled
    await expect(button).not.toBeDisabled();
    await expect(button).not.toHaveText('Cancel');
    // Negating matcher for text content
    const heading = page.locator('h1');
    await expect(heading).not.toHaveText('Wrong Heading');    

    // Negating matcher for non auto-retry
    const getText = await heading.textContent();
    expect(getText).not.toBe('Another Wrong Heading');
  });
});