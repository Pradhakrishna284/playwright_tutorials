import { test, expect } from '@playwright/test';

test.describe('Hard Assertions - Test Stops on First Failure', () => {
  
  test('Hard assertion - critical prerequisite check', async ({ page }) => {
    // Scenario: Testing a login flow where each step depends on the previous one
    await page.goto('https://example.com/login');
    
    // Hard assertion: Form must exist (critical)
    // If this fails, test STOPS here - no point continuing
    await expect(page.locator('form')).toBeVisible();
    
    // Hard assertion: Username input must exist
    // Only runs if previous assertion passed
    await expect(page.locator('input[name="username"]')).toBeVisible();
    
    // Hard assertion: Password input must exist
    await expect(page.locator('input[name="password"]')).toBeVisible();
    
    // Hard assertion: Submit button must be enabled
    await expect(page.locator('button[type="submit"]')).toBeEnabled();
    
    console.log('All prerequisites met - form is ready for input');
  });

  test('Hard assertion - stops on failure example', async ({ page }) => {
    // This test demonstrates how hard assertions stop execution
    await page.goto('https://example.com');
    
    // Hard assertion 1
    await expect(page.locator('h1')).toHaveText('Welcome');
    
    // If h1 text doesn't match, test STOPS HERE
    // The following assertions are NEVER executed:
    
    await expect(page.locator('.button')).toBeVisible();
    // ^ This won't run if h1 assertion fails
    
    await expect(page.locator('input')).toHaveAttribute('type', 'text');
    // ^ This won't run either
  });

  test('Hard assertion in navigation flow', async ({ page }) => {
    await page.goto('https://example.com');
    
    // Hard: Page must load
    await expect(page.locator('body')).toBeVisible();
    
    // Hard: Menu must exist (critical for navigation)
    await expect(page.locator('.navbar')).toBeVisible();
    
    // Hard: Menu items must be present
    await expect(page.locator('.navbar .menu-item')).toHaveCount(4);
    
    // If any hard assertion fails, we stop - no point clicking non-existent menu
    await page.locator('.navbar .menu-item').first().click();
    
    // Verify navigation worked
    await expect(page).toHaveURL(/\/home/);
  });
});

test.describe('Hard Assertions with Error Handling', () => {
  
  test('Hard assertion catches breaking changes', async ({ page }) => {
    // Hard assertions are excellent for catching breaking changes early
    await page.goto('https://example.com/api-test');
    
    // Critical: API endpoint must respond
    await expect(page.locator('[data-api-status]')).toHaveAttribute('data-api-status', 'connected');
    
    // Only continue if API is connected
    const responseData = await page.locator('[data-response-code]').textContent();
    
    // Verify response code
    await expect(page.locator('[data-response-code]')).toHaveText('200');
  });
});
