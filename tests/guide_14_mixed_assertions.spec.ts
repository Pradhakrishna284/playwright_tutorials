import { test, expect } from '@playwright/test';

test.describe('Mixed Hard & Soft Assertions - Strategic Combinations', () => {
  
  test('Smart combination: Hard for prerequisites, Soft for validation', async ({ page }) => {
    // HARD assertions ensure we can proceed
    // SOFT assertions validate everything comprehensively
    
    await page.goto('https://example.com/checkout');
    
    // HARD: Must reach checkout page
    await expect(page).toHaveURL(/\/checkout/);
    
    // HARD: Cart must have items (critical for checkout)
    await expect(page.locator('.cart-items')).toHaveCount(0); // If fails, no point continuing
    
    // Now that we know page loaded and cart has items, 
    // use SOFT to check all items thoroughly
    const items = page.locator('.cart-item');
    const itemCount = await items.count();
    
    // SOFT: Check each item's properties
    for (let i = 0; i < itemCount; i++) {
      const item = items.nth(i);
      await expect.soft(item.locator('.item-name')).toBeVisible();
      await expect.soft(item.locator('.item-price')).toMatch(/\$\d+\.\d{2}/);
      await expect.soft(item.locator('.item-quantity')).toHaveValue(/\d+/);
    }
    
    // HARD: Must have checkout form before proceeding
    await expect(page.locator('form.checkout')).toBeVisible();
    
    // SOFT: Validate all form fields
    await expect.soft(page.locator('input[name="fullName"]')).toBeEnabled();
    await expect.soft(page.locator('input[name="address"]')).toBeEnabled();
    await expect.soft(page.locator('input[name="cardNumber"]')).toBeEnabled();
    await expect.soft(page.locator('button[type="submit"]')).toBeEnabled();
    
    console.log('Checkout page validation complete');
  });

  test('Mixed assertions: Navigation flow with validation', async ({ page }) => {
    await page.goto('https://example.com/dashboard');
    
    // HARD: Dashboard must load
    await expect(page.locator('[data-page="dashboard"]')).toBeVisible();
    
    // SOFT: Validate dashboard widgets
    await expect.soft(page.locator('.widget-summary')).toBeVisible();
    await expect.soft(page.locator('.widget-chart')).toBeVisible();
    await expect.soft(page.locator('.widget-stats')).toBeVisible();
    
    // HARD: Navigation menu must exist
    await expect(page.locator('.sidebar')).toBeVisible();
    
    // Click on reports (if menu doesn't exist, previous hard assertion caught it)
    await page.locator('.sidebar .menu-item-reports').click();
    
    // HARD: Reports page must load
    await expect(page).toHaveURL(/\/reports/);
    
    // SOFT: Validate reports page elements
    await expect.soft(page.locator('.report-filters')).toBeVisible();
    await expect.soft(page.locator('.report-table')).toBeVisible();
    await expect.soft(page.locator('button.export-pdf')).toBeEnabled();
  });

  test('Error recovery: Use hard assertions to detect and handle issues', async ({ page }) => {
    await page.goto('https://example.com/data-entry');
    
    // HARD: Form must be present
    await expect(page.locator('form')).toBeVisible();
    
    // Fill form fields
    await page.locator('input[name="productName"]').fill('Widget A');
    await page.locator('input[name="price"]').fill('99.99');
    await page.locator('input[name="quantity"]').fill('100');
    
    // HARD: Submit button must be available
    await expect(page.locator('button[type="submit"]')).toBeEnabled();
    
    // Submit
    await page.locator('button[type="submit"]').click();
    
    // HARD: Must navigate to confirmation or show validation errors
    const isConfirmationPage = await page.locator('[data-page="confirmation"]').isVisible();
    
    if (isConfirmationPage) {
      // SOFT: Validate confirmation details
      await expect.soft(page.locator('.confirmation-number')).toMatch(/^CN\d{6}$/);
      await expect.soft(page.locator('.order-total')).toMatch(/\$\d+\.\d{2}/);
      await expect.soft(page.locator('.estimated-delivery')).toMatch(/\d{4}-\d{2}-\d{2}/);
    } else {
      // Handle validation errors
      const errors = page.locator('.field-error');
      const errorCount = await errors.count();
      
      // SOFT: Check what went wrong
      for (let i = 0; i < errorCount; i++) {
        await expect.soft(errors.nth(i)).toBeVisible();
      }
    }
  });

  test('Performance validation: Hard checks for setup, Soft for measurements', async ({ page }) => {
    await page.goto('https://example.com/performance-test');
    
    // HARD: Test page must load
    await expect(page.locator('[data-test-ready]')).toHaveAttribute('data-test-ready', 'true');
    
    // HARD: Results container must be present
    await expect(page.locator('.results-container')).toBeVisible();
    
    // SOFT: Validate all performance metrics
    const metrics = page.locator('[data-metric]');
    const metricCount = await metrics.count();
    
    for (let i = 0; i < metricCount; i++) {
      const metric = metrics.nth(i);
      await expect.soft(metric.locator('.metric-name')).toBeVisible();
      await expect.soft(metric.locator('.metric-value')).toMatch(/\d+(\.\d+)?(ms|%|sec)?/);
      await expect.soft(metric.locator('.metric-status')).toHaveClass(/status-(pass|warning|fail)/);
    }
  });

  test('User workflow: Guard with hard, validate with soft', async ({ page }) => {
    // HARD: Navigate to login
    await page.goto('https://example.com/login');
    await expect(page.locator('form')).toBeVisible();
    
    // Log in
    await page.locator('input[name="username"]').fill('testuser@example.com');
    await page.locator('input[name="password"]').fill('password123');
    await page.locator('button[type="submit"]').click();
    
    // HARD: Must reach dashboard after login
    await expect(page).toHaveURL(/\/dashboard/);
    
    // SOFT: Validate user info display
    await expect.soft(page.locator('.user-name')).toHaveText('Test User');
    await expect.soft(page.locator('.user-email')).toHaveText('testuser@example.com');
    await expect.soft(page.locator('.user-avatar')).toBeVisible();
    
    // HARD: Menu must be available for navigation
    await expect(page.locator('.main-menu')).toBeVisible();
    
    // Click on profile
    await page.locator('.main-menu .menu-profile').click();
    
    // HARD: Profile page must load
    await expect(page).toHaveURL(/\/profile/);
    
    // SOFT: Validate profile sections
    await expect.soft(page.locator('.profile-header')).toBeVisible();
    await expect.soft(page.locator('.profile-form input[name="firstName"]')).toHaveValue(/[A-Za-z]/);
    await expect.soft(page.locator('.profile-form input[name="lastName"]')).toHaveValue(/[A-Za-z]/);
    await expect.soft(page.locator('button.save-profile')).toBeEnabled();
  });

  test('Quality assurance check: Safety gates with comprehensive validation', async ({ page }) => {
    await page.goto('https://example.com/quality-check');
    
    // HARD: QA interface must load
    await expect(page.locator('[data-qa-interface]')).toBeVisible();
    
    // HARD: Test data must be available
    await expect(page.locator('[data-test-data]')).not.toBeEmpty();
    
    // Now use SOFT assertions for comprehensive checks
    const testItems = page.locator('[data-test-item]');
    const itemCount = await testItems.count();
    
    // SOFT: Validate all test items
    for (let i = 0; i < itemCount; i++) {
      const item = testItems.nth(i);
      await expect.soft(item.locator('[data-item-id]')).toMatch(/^ID\d+$/);
      await expect.soft(item.locator('[data-item-status]')).toHaveClass(/status-(ready|pending|completed)/);
      await expect.soft(item.locator('[data-item-result]')).toMatch(/^(PASS|FAIL|SKIP)$/);
    }
    
    // HARD: Report section must exist before exporting
    await expect(page.locator('.qa-report')).toBeVisible();
    
    // SOFT: Validate report contents
    await expect.soft(page.locator('.report-summary')).toBeVisible();
    await expect.soft(page.locator('.report-timestamp')).toMatch(/\d{4}-\d{2}-\d{2}/);
    await expect.soft(page.locator('button.export-report')).toBeEnabled();
  });
});

test.describe('Decision Tree: When to Use Hard vs Soft', () => {
  
  test('Decision: Prerequisites (Hard) vs Validation (Soft)', async ({ page }) => {
    /*
    USE HARD ASSERTIONS FOR:
    - Page load verification (use expect(page).toHaveURL())
    - Navigation success (verify you're on the right page)
    - Critical element existence before interaction
    - API response status (e.g., 200 OK)
    - Prerequisites that block further testing
    
    USE SOFT ASSERTIONS FOR:
    - Form field validation (check all at once)
    - Content verification (multiple text checks)
    - Element properties (class, attributes, values)
    - Visual state checks (visibility, enabled state)
    - Data validation (checking table rows, lists)
    - Business logic verification (multiple conditions)
    */
    
    await page.goto('https://example.com/test');
    
    // HARD: Page loaded correctly
    await expect(page).toHaveURL(/\/test/);
    
    // HARD: Critical element exists (needed for next step)
    const testContainer = page.locator('[data-test-container]');
    await expect(testContainer).toBeVisible();
    
    // SOFT: Now validate everything inside that container
    await expect.soft(testContainer.locator('h1')).toHaveText(/Test Page/);
    await expect.soft(testContainer.locator('.description')).toBeVisible();
    await expect.soft(testContainer.locator('button')).toHaveCount(3);
    
    // Results: If hard assertions fail, test stops
    // If soft assertions fail, you see all failures at once
  });
});
