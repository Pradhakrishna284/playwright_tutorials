# Hard vs Soft Assertions in Playwright

## Overview

Assertions are used to verify that expected conditions are met during test execution. In Playwright, there are two types: **hard assertions** and **soft assertions**.

---

## Hard Assertions

### Definition
Hard assertions immediately **fail and stop** test execution when a condition is not met. The test stops at the first failing assertion.

### Characteristics
- ✗ Test stops immediately on failure
- ✗ Subsequent assertions are NOT executed
- ✗ Useful for critical validations where continuing doesn't make sense
- Uses standard `expect()` syntax

### Syntax
```typescript
await expect(locator).toHaveText('Expected Text');
```

### Example - Hard Assertion
```typescript
import { test, expect } from '@playwright/test';

test('Hard Assertion Example - Test Stops on First Failure', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Hard assertion 1: If this fails, test stops here
  await expect(page.locator('h1')).toHaveText('Welcome');
  
  // Hard assertion 2: Only executed if assertion 1 passes
  await expect(page.locator('.button')).toBeVisible();
  
  // Hard assertion 3: Only executed if assertions 1 & 2 pass
  await expect(page.locator('input')).toHaveAttribute('type', 'text');
  
  console.log('All assertions passed!');
});
```

### When to Use Hard Assertions
- Critical test flows where continuing is unnecessary if a prerequisite fails
- Early validation of page loads or navigation
- Checking permissions or access control

---

## Soft Assertions

### Definition
Soft assertions **continue** test execution even when a condition fails. All assertions are evaluated and failures are collected and reported at the end.

### Characteristics
- ✓ Test continues after assertion failure
- ✓ All assertions are executed (can find multiple failures)
- ✓ Failures are collected and reported at the end
- ✓ Useful for comprehensive validation of multiple conditions
- Uses `expect.soft()` syntax

### Syntax
```typescript
await expect.soft(locator).toHaveText('Expected Text');
```

### Example - Soft Assertion
```typescript
import { test, expect } from '@playwright/test';

test('Soft Assertion Example - Test Continues on Failure', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Soft assertion 1: Test continues even if this fails
  await expect.soft(page.locator('h1')).toHaveText('Welcome');
  
  // Soft assertion 2: Always executed
  await expect.soft(page.locator('.button')).toBeVisible();
  
  // Soft assertion 3: Always executed
  await expect.soft(page.locator('input')).toHaveAttribute('type', 'text');
  
  // Soft assertion 4: Always executed
  await expect.soft(page.locator('.error-message')).not.toBeVisible();
  
  console.log('All assertions executed. Test fails if any soft assertion failed.');
});
```

### When to Use Soft Assertions
- Form validation with multiple fields
- Checking multiple UI elements on the same page
- End-to-end tests validating complete user workflows
- API response validation with multiple properties

---

## Comparison Table

| Feature | Hard Assertion | Soft Assertion |
|---------|---|---|
| **Test Execution** | Stops on first failure | Continues after failures |
| **Failures Reported** | Single failure reported | All failures collected |
| **Use Case** | Critical checks | Comprehensive validation |
| **Performance** | Faster (stops early) | Might take longer |
| **Syntax** | `expect()` | `expect.soft()` |

---

## Practical Examples

### Example 1: Form Validation (Soft Assertions)
```typescript
test('Form Validation with Soft Assertions', async ({ page }) => {
  await page.goto('https://example.com/form');
  
  const form = page.locator('form');
  const nameInput = form.locator('input[name="name"]');
  const emailInput = form.locator('input[name="email"]');
  const submitButton = form.locator('button[type="submit"]');
  
  // Validate all form elements at once
  await expect.soft(nameInput).toBeVisible();
  await expect.soft(nameInput).toHaveAttribute('required', 'true');
  
  await expect.soft(emailInput).toBeVisible();
  await expect.soft(emailInput).toHaveAttribute('type', 'email');
  
  await expect.soft(submitButton).toBeVisible();
  await expect.soft(submitButton).toBeEnabled();
  
  // Test continues even if any assertion above failed
  console.log('Form validation complete');
});
```

### Example 2: Dashboard Elements (Soft Assertions)
```typescript
test('Dashboard Page Verification', async ({ page }) => {
  await page.goto('https://example.com/dashboard');
  
  // Check all dashboard widgets
  await expect.soft(page.locator('.widget-sales')).toBeVisible();
  await expect.soft(page.locator('.widget-sales')).toContainText('$');
  
  await expect.soft(page.locator('.widget-users')).toBeVisible();
  await expect.soft(page.locator('.widget-users')).toContainText('Users');
  
  await expect.soft(page.locator('.widget-reports')).toBeVisible();
  await expect.soft(page.locator('.widget-reports')).toBeEnabled();
  
  // All widgets are validated regardless of individual failures
});
```

### Example 3: Critical Flow with Hard Assertions
```typescript
test('Login Flow - Critical Validations', async ({ page }) => {
  await page.goto('https://example.com/login');
  
  // Hard assertion: Page must load correctly
  await expect(page.locator('form')).toBeVisible();
  
  // If form is not visible, test stops here - no point continuing
  
  // Hard assertion: Required inputs must exist
  await expect(page.locator('input[name="username"]')).toBeVisible();
  
  // Fill and submit - if inputs don't exist, we can't proceed
  await page.locator('input[name="username"]').fill('user@example.com');
  await page.locator('input[name="password"]').fill('password123');
  await page.locator('button[type="submit"]').click();
  
  // Hard assertion: Check successful login
  await expect(page).toHaveURL(/\/dashboard/);
});
```

### Example 4: Mixed Hard & Soft Assertions
```typescript
test('Mixed Assertions Strategy', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Hard assertion: Critical check - page must load
  await expect(page.locator('body')).toBeVisible();
  
  // Soft assertions: Validate page content comprehensively
  await expect.soft(page.locator('h1')).toHaveText('Welcome');
  await expect.soft(page.locator('.intro-text')).toBeVisible();
  await expect.soft(page.locator('.cta-button')).toBeEnabled();
  
  // Hard assertion: Navigation works (critical for next step)
  await page.locator('.menu').click();
  await expect(page.locator('.dropdown')).toBeVisible();
  
  // More soft assertions for dropdown items
  await expect.soft(page.locator('.dropdown-item-1')).toHaveText('Home');
  await expect.soft(page.locator('.dropdown-item-2')).toHaveText('About');
  await expect.soft(page.locator('.dropdown-item-3')).toHaveText('Contact');
});
```

---

## Best Practices

### 1. Use Hard Assertions for Prerequisites
```typescript
// ✓ Good: Critical check first
await expect(page).toHaveURL(/\/login/);  // Hard
await expect.soft(page.locator('h1')).toHaveText('Login');  // Soft
```

### 2. Group Soft Assertions by Feature
```typescript
// Validate header
await expect.soft(page.locator('header')).toBeVisible();
await expect.soft(page.locator('header nav')).toHaveCount(3);

// Validate sidebar
await expect.soft(page.locator('aside')).toBeVisible();
await expect.soft(page.locator('aside .menu-item')).toHaveCount(5);
```

### 3. Use Meaningful Assertion Messages
```typescript
await expect.soft(page.locator('.error')).not.toBeVisible();
// Better with custom message:
await expect.soft(page.locator('.error'), 'Error message should not be visible').not.toBeVisible();
```

### 4. Document Your Strategy
```typescript
test('Complete User Registration', async ({ page }) => {
  // HARD: Must navigate to form
  await expect(page.locator('form')).toBeVisible();
  
  // SOFT: Validate all form fields exist
  await expect.soft(page.locator('input[name="firstName"]')).toBeVisible();
  await expect.soft(page.locator('input[name="lastName"]')).toBeVisible();
  await expect.soft(page.locator('input[name="email"]')).toBeVisible();
  
  // HARD: Must be able to submit (if we get here)
  await page.locator('button[type="submit"]').click();
  await expect(page).toHaveURL(/\/confirmation/);
});
```

---

## Summary

- **Hard Assertions**: Use for critical prerequisites and validation gates
- **Soft Assertions**: Use for comprehensive form/page validation and checking multiple conditions
- **Mix strategically**: Combine both for robust, efficient tests
- **Test continues with soft**: Collect all failures in one test run
- **Better debugging**: Soft assertions show all failures, making it easier to fix multiple issues

