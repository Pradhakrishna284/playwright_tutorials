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
