import { test, expect } from '@playwright/test';

test.describe('Soft Assertions - Test Continues on Failure', () => {
  
  test('Soft assertions - form validation example', async ({ page }) => {
    // Scenario: Validating all form fields at once
    // If one field is invalid, we still check all others
    await page.goto('https://example.com/signup');
    
    const form = page.locator('form');
    
    // Soft assertions: All checks happen regardless of individual failures
    // The test continues and collects ALL failures
    
    await expect.soft(form.locator('input[name="firstName"]')).toBeVisible();
    await expect.soft(form.locator('input[name="firstName"]')).toHaveAttribute('required', 'true');
    
    await expect.soft(form.locator('input[name="lastName"]')).toBeVisible();
    await expect.soft(form.locator('input[name="lastName"]')).toHaveAttribute('required', 'true');
    
    await expect.soft(form.locator('input[name="email"]')).toBeVisible();
    await expect.soft(form.locator('input[name="email"]')).toHaveAttribute('type', 'email');
    
    await expect.soft(form.locator('input[name="password"]')).toBeVisible();
    await expect.soft(form.locator('input[name="password"]')).toHaveAttribute('type', 'password');
    
    await expect.soft(form.locator('input[name="confirmPassword"]')).toBeVisible();
    await expect.soft(form.locator('button[type="submit"]')).toBeEnabled();
    
    // Even if 3 assertions failed above, all 10 were executed
    console.log('Form validation complete - all checks performed');
  });

  test('Soft assertions - dashboard widget validation', async ({ page }) => {
    // Scenario: Checking multiple dashboard widgets
    // Find all issues with one test run
    await page.goto('https://example.com/dashboard');
    
    // Widget 1: Sales
    await expect.soft(page.locator('.widget-sales')).toBeVisible();
    await expect.soft(page.locator('.widget-sales .title')).toHaveText('Total Sales');
    await expect.soft(page.locator('.widget-sales .value')).toMatch(/\$\d+/);
    await expect.soft(page.locator('.widget-sales .trend')).toContainText('↑');
    
    // Widget 2: Users
    await expect.soft(page.locator('.widget-users')).toBeVisible();
    await expect.soft(page.locator('.widget-users .title')).toHaveText('Active Users');
    await expect.soft(page.locator('.widget-users .value')).toMatch(/\d+/);
    await expect.soft(page.locator('.widget-users .status')).toHaveClass('positive');
    
    // Widget 3: Reports
    await expect.soft(page.locator('.widget-reports')).toBeVisible();
    await expect.soft(page.locator('.widget-reports .title')).toHaveText('Reports');
    await expect.soft(page.locator('.widget-reports button')).toBeEnabled();
    
    // Test reports all issues found instead of stopping at first failure
    console.log('Dashboard validation complete');
  });

  test('Soft assertions - table data validation', async ({ page }) => {
    // Scenario: Validating table contents
    await page.goto('https://example.com/users-table');
    
    // Check table headers
    await expect.soft(page.locator('table th').nth(0)).toHaveText('Name');
    await expect.soft(page.locator('table th').nth(1)).toHaveText('Email');
    await expect.soft(page.locator('table th').nth(2)).toHaveText('Status');
    await expect.soft(page.locator('table th').nth(3)).toHaveText('Actions');
    
    // Check first row data
    await expect.soft(page.locator('table td').nth(0)).toHaveText('John Doe');
    await expect.soft(page.locator('table td').nth(1)).toHaveText('john@example.com');
    await expect.soft(page.locator('table td').nth(2)).toHaveClass('status-active');
    
    // Check second row data
    await expect.soft(page.locator('table tbody tr').nth(1).locator('td').nth(0)).toHaveText('Jane Smith');
    await expect.soft(page.locator('table tbody tr').nth(1).locator('td').nth(1)).toHaveText('jane@example.com');
    
    // All table validations are performed
    console.log('Table validation complete');
  });

  test('Soft assertions - API response validation', async ({ page }) => {
    // Scenario: Validating API response properties
    await page.goto('https://example.com/api-response');
    
    const responseSection = page.locator('[data-response]');
    
    // Soft assertions check all response properties
    await expect.soft(responseSection.locator('[data-status-code]')).toHaveText('200');
    await expect.soft(responseSection.locator('[data-response-time]')).toMatch(/\d+ms/);
    await expect.soft(responseSection.locator('[data-content-type]')).toHaveText('application/json');
    await expect.soft(responseSection.locator('[data-headers-count]')).toMatch(/\d+/);
    
    // Soft assertions for response body
    await expect.soft(responseSection.locator('[data-user-id]')).toMatch(/\d+/);
    await expect.soft(responseSection.locator('[data-user-name]')).toHaveText(/^[A-Za-z\s]+$/);
    await expect.soft(responseSection.locator('[data-user-email]')).toMatch(/.+@.+\..+/);
    
    console.log('API response validation complete - all properties checked');
  });
});

test.describe('Soft Assertions vs Hard Assertions - Comparison', () => {
  
  test('Soft assertion shows all errors at once', async ({ page }) => {
    // This test demonstrates the advantage of soft assertions
    // You see ALL failures, not just the first one
    await page.goto('https://example.com/form');
    
    await expect.soft(page.locator('input[name="name"]')).toHaveValue('John');     // Might fail
    await expect.soft(page.locator('input[name="email"]')).toHaveValue('john@example.com');  // Might fail
    await expect.soft(page.locator('input[name="age"]')).toHaveValue('30');        // Might fail
    
    // If all three fail, you see all three failures in the report
    // With hard assertions, you'd only see the first failure
  });

  test('Soft assertions for comprehensive testing', async ({ page }) => {
    // Collect all issues in one test run
    await page.goto('https://example.com/settings');
    
    // Validate settings form comprehensively
    const form = page.locator('form');
    
    // Account settings
    await expect.soft(form.locator('input[name="username"]')).toHaveValue('current_user');
    await expect.soft(form.locator('input[name="email"]')).toHaveValue('user@example.com');
    await expect.soft(form.locator('input[name="language"]')).toHaveValue('en');
    
    // Notification settings
    await expect.soft(form.locator('input[name="email-notifications"]')).toBeChecked();
    await expect.soft(form.locator('input[name="sms-notifications"]')).not.toBeChecked();
    await expect.soft(form.locator('input[name="push-notifications"]')).toBeChecked();
    
    // Privacy settings
    await expect.soft(form.locator('input[name="profile-public"]')).toBeChecked();
    await expect.soft(form.locator('input[name="show-email"]')).not.toBeChecked();
    
    // All settings are validated, showing complete picture of what's wrong
  });

  test('Soft assertion - negative expectations', async ({ page }) => {
    // Soft assertions work great for checking what should NOT be present
    await page.goto('https://example.com');
    
    // Page should NOT show error messages
    await expect.soft(page.locator('.error-message')).not.toBeVisible();
    await expect.soft(page.locator('.alert-danger')).not.toBeVisible();
    await expect.soft(page.locator('[role="alert"]')).not.toBeVisible();
    
    // Page should NOT have console errors (if checking via logs)
    await expect.soft(page.locator('.loading-spinner')).not.toBeVisible();
    
    // Check all negative conditions at once
    console.log('No errors found');
  });
});


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
