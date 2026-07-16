# Playwright Test Annotations Guide

## Overview
Annotations in Playwright allow you to add metadata to tests, mark them as skipped, focused, or add custom properties. This helps organize, filter, and manage your test suite effectively.

## Table of Contents
1. [Basic Annotations](#basic-annotations)
2. [Common Use Cases](#common-use-cases)
3. [Advanced Examples](#advanced-examples)
4. [Conditional Annotations](#conditional-annotations)
5. [Best Practices](#best-practices)

---

## Basic Annotations

### `@skip` - Skip Tests
Skip specific tests from running:

```typescript
import { test } from '@playwright/test';

test.skip('Skipped test - database is down', async ({ page }) => {
  // This test will not run
  await page.goto('https://example.com');
});

test('Regular test', async ({ page }) => {
  // This test will run normally
  await page.goto('https://example.com');
});
```

### `@only` - Run Only Specific Tests
Run only the annotated test and skip all others:

```typescript
test.only('Only this test runs', async ({ page }) => {
  // Only this test will execute
  await page.goto('https://example.com');
});

test('This test is skipped', async ({ page }) => {
  // This test will NOT run
  await page.goto('https://example.com');
});
```

### `@fixme` - Tests Known to Fail
Mark tests that are expected to fail (they still run but failures are ignored):

```typescript
test.fixme('Known bug - checkout fails on mobile', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'Webkit issue');
  // Test runs but failures are ignored
});
```

### `@fail` - Tests Expected to Fail
Mark tests as expected to fail (if they pass, it's reported as unexpected):

```typescript
test.fail('Payment processing fails on Safari', async ({ page, browserName }) => {
  test.skip(browserName !== 'webkit', 'Safari-specific bug');
  // Test is EXPECTED to fail
  // If it passes unexpectedly, test reports: "unexpected pass"
});

// Conditional fail
test('API feature', async ({ page }, testInfo) => {
  if (testInfo.project.name === 'webkit') {
    test.fail(true, 'Safari bug pending vendor fix');
  }
  // Runs normally on other browsers, fails as expected on Safari
});
```

### `@slow` - Mark Tests as Slow
Increase timeout for slow tests (multiplies timeout by 3):

```typescript
test.slow('Loading large dataset', async ({ page }) => {
  // This test gets 3x the normal timeout
  // Default: 30s → becomes 90s
  await page.goto('https://example.com/large-data');
});
```

---

## SKIP vs FAIL vs FIXME - When to Use Each?

### Quick Comparison Table

| Feature | `skip()` | `fail()` | `fixme()` |
|---------|----------|----------|-----------|
| Test Runs? | ❌ No | ✅ Yes | ✅ Yes |
| Pass → Result | ⊘ Skipped | 🔔 Unexpected! | ✅ Passes |
| Fail → Result | ⊘ Skipped | ✅ Expected | ✅ Ignored |
| Best For | Not ready yet | Known bugs | Work in progress |
| Report Impact | No impact | Alerts on unexpected pass | No impact |

### Decision Guide

```
Feature ready?
├─ NO → use test.skip()
│       "Feature not implemented yet"
│
└─ YES → Does test pass consistently?
         ├─ YES → No annotation needed ✅
         │
         └─ NO → Known bug with timeline?
                 ├─ YES → use test.fail()
                 │        "Tracking this bug, alert if it passes"
                 │
                 └─ UNSURE/TEMP → use test.fixme()
                                  "Ignoring while we figure it out"
```

### Example: Feature Development Timeline

```typescript
// WEEK 1: Feature not ready
test.skip('Two-factor authentication', async ({ page }) => {
  // Backend team still building API
});

// WEEK 2: Feature developing, unclear status
test.fixme('Two-factor authentication', async ({ page }) => {
  // Might pass or fail - don't know yet
  // Unstable, don't want it blocking CI
});

// WEEK 3: Feature mostly works, but has a bug
test.fail('2FA fails with security keys - JIRA-445', async ({ page }) => {
  // Bug reported, backend team fixing
  // Monitoring for when it unexpectedly passes
});

// WEEK 4: Bug fixed! ✅
test('Two-factor authentication', async ({ page }) => {
  // Remove annotation - it works now!
});
```

### Real-World Scenarios

#### Scenario 1: `test.skip()` - Feature Not Ready
```typescript
test.skip('OAuth login - arriving in v3.0', async ({ page }) => {
  // Completely missing - don't test yet
  // API doesn't exist
  // Frontend not built
});

test('Google Analytics', async ({ page }) => {
  test.skip(!process.env.ANALYTICS_API_KEY, 'No analytics key configured');
  // Skipped in local dev, runs in CI
});
```

#### Scenario 2: `test.fail()` - Known Bug Being Tracked
```typescript
test.fail('Payment fails on Safari - WebKit issue #67890', async ({ page, browserName }) => {
  test.skip(browserName !== 'webkit', 'Safari only');
  // This test SHOULD fail right now
  // If it passes unexpectedly → "Bug might be fixed!"
  // Team will investigate the unexpected pass
  // Very useful for monitoring when external issues get resolved
});

test('Email validation', async ({ page }) => {
  test.fail(true, 'Gmail block pattern - contacting Google support');
  // Actively monitoring
  // When Google fixes their policy, this will unexpectedly pass
});
```

**Report shows:**
```
✓ 45 passed
✗ 1 failed (expected)    ← Good! Failed as expected
🔔 Unexpected pass in "Payment fails on Safari"  ← Bug fixed!
```

#### Scenario 3: `test.fixme()` - Investigating Issues
```typescript
test.fixme('WebSocket reconnection - investigating flakiness', async ({ page }) => {
  // Sometimes passes, sometimes fails
  // Unclear if: app is broken, test is wrong, or network issue
  // Suppress failures while investigating
  // Plan to either fix or delete this test
});

test.fixme('AI recommendations - new unstable feature', async ({ page }) => {
  // Feature in heavy development
  // Could pass or fail at any moment
  // Don't want this blocking CI while team works on it
});
```

**Report shows:**
```
✓ 45 passed
⊠ 2 fixed (passed despite fixme)
⊠ 1 fixed (failed despite fixme)
```

---

## Common Use Cases

### 1. Skip Tests Based on Browser
```typescript
test('Cross-browser compatible test', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'Not supported on Safari');
  
  await page.goto('https://example.com');
});
```

### 2. Skip Tests Based on OS
```typescript
test('Windows-specific test', async ({ page }, testInfo) => {
  test.skip(process.platform !== 'win32', 'Only runs on Windows');
  
  // Windows-specific code
});
```

### 3. Skip Tests for CI/Local Environment
```typescript
test('Local development only', async ({ page }) => {
  test.skip(process.env.CI === 'true', 'Skipped in CI environment');
  
  await page.goto('http://localhost:3000');
});
```

### 4. Add Tags for Test Organization
```typescript
test('E2E: Complete purchase flow @e2e @critical', async ({ page }) => {
  await page.goto('https://example.com');
  // Purchase flow steps
});

test('Unit: Login validation @unit @quick', async ({ page }) => {
  // Quick unit test
});
```

---

## Advanced Examples

### Multiple Conditions with Skip
```typescript
import { test, expect } from '@playwright/test';

test('Complex conditional test', async ({ page, browserName }, testInfo) => {
  // Skip if multiple conditions are true
  test.skip(
    browserName === 'webkit' && process.platform === 'win32',
    'Safari on Windows has issues'
  );
  
  // Skip if environment variable is set
  test.skip(
    process.env.SKIP_SLOW_TESTS === 'true',
    'Slow tests disabled'
  );
  
  await page.goto('https://example.com');
});
```

### FIXME vs FAIL - Key Differences
```typescript
test.fixme('FIXME: Logout fails intermittently', async ({ page }) => {
  // FIXME = "I don't care if this passes or fails - just run it"
  // Failures are suppressed
  // Good for: work-in-progress, unclear issues
});

test.fail('FAIL: Logout fails due to race condition', async ({ page }) => {
  // FAIL = "This SHOULD fail - if it passes, something improved!"
  // Reports unexpected passes
  // Better for: documented bugs with timelines, known issues
});
```

### Using Annotations with Test Groups
```typescript
import { test } from '@playwright/test';

test.describe('Authentication Suite', () => {
  test('Login with email', async ({ page }) => {
    // Normal test
  });
  
  test.skip('Login with SSO', async ({ page }) => {
    // Skipped - SSO not implemented yet
  });
  
  test.fixme('Login with biometric', async ({ page }) => {
    // Known to fail - waiting for backend support
  });
});
```

### Conditional Slow Marking
```typescript
test('API response handling', async ({ page, browserName }, testInfo) => {
  // Mark as slow only for specific browsers
  if (browserName === 'webkit') {
    test.slow();
  }
  
  await page.goto('https://api.example.com/slow-endpoint');
});
```

### Adding Custom Metadata
```typescript
test('Payment processing @payment @critical', async ({ page }, testInfo) => {
  // testInfo provides access to test metadata
  console.log(`Running: ${testInfo.title}`);
  console.log(`Browser: ${testInfo.project.name}`);
  console.log(`Test file: ${testInfo.file}`);
  
  await page.goto('https://example.com/checkout');
});
```

---

## Conditional Annotations

### Skip Based on Test Configuration
```typescript
import { test } from '@playwright/test';

test('Mobile-specific test', async ({ page }, testInfo) => {
  // Skip if not running on mobile
  test.skip(
    testInfo.project.name !== 'Mobile Chrome',
    'Only runs on mobile browsers'
  );
  
  await page.setViewportSize({ width: 375, height: 667 });
});
```

### Environment-Based Skipping
```typescript
test('Production testing', async ({ page }) => {
  const environment = process.env.TEST_ENV || 'staging';
  
  test.skip(
    environment === 'development',
    'Requires staging/production environment'
  );
  
  await page.goto(`https://${environment}.example.com`);
});
```

### API Availability Check
```typescript
test('Feature flag dependent test', async ({ page }) => {
  const featureEnabled = process.env.FEATURE_NEW_CHECKOUT === 'true';
  
  test.skip(!featureEnabled, 'New checkout feature not enabled');
  
  await page.goto('https://example.com/checkout');
});
```

---

## Best Practices

### ✅ DO

1. **Use Clear Skip Messages**
   ```typescript
   test.skip('Feature not yet implemented', async ({ page }) => {
     // Clear reason for skipping
   });
   ```

2. **Document Why Tests Are Skipped**
   ```typescript
   test('Third-party API test', async ({ page }) => {
     test.skip(
       !process.env.THIRD_PARTY_API_KEY,
       'Requires API key - set THIRD_PARTY_API_KEY env var'
     );
   });
   ```

3. **Use Slow Wisely**
   ```typescript
   test.slow('Large file upload', async ({ page }) => {
     // Tests that legitimately need more time
     await page.goto('https://example.com/upload');
   });
   ```

4. **Combine Tags with Annotations**
   ```typescript
   test('End-to-end purchase @e2e @critical @smoke', async ({ page }) => {
     // Easy to filter with: npx playwright test --grep @critical
   });
   ```

### ❌ DON'T

1. **Don't Over-Skip Tests**
   - Fix failing tests instead of skipping them permanently
   - Use `test.fixme()` only for known issues with timelines

2. **Don't Use Confusing Messages**
   ```typescript
   // Bad
   test.skip('temp', async () => {});
   
   // Good
   test.skip('Waiting for backend API deployment (JIRA-123)', async () => {});
   ```

3. **Don't Rely Only on Annotations**
   - Use with proper test data and environment setup
   - Don't use as a substitute for proper error handling

---

## Running Tests with Annotations

```bash
# Run all tests except skipped ones
npx playwright test

# Run only specific browser
npx playwright test --project chromium

# Run tests matching a pattern
npx playwright test --grep '@critical'

# Run tests excluding a pattern
npx playwright test --grep-invert '@slow'

# Run only one test file
npx playwright test tests/pw_16_3_annotations.spec.ts

# Show skipped tests
npx playwright test --reporter=list

# Verbose output
npx playwright test --reporter=verbose
```

---

## Summary Table

| Annotation | Purpose | Passes | Fails | Use Case |
|-----------|---------|--------|-------|----------|
| `test()` | Normal test | ✅ Passes | ❌ Fails | Regular tests |
| `test.skip()` | Skip execution | ⊘ Skipped | ⊘ Skipped | Unsupported features |
| `test.only()` | Run only this | ✅ Passes | ❌ Fails | Debugging |
| `test.fixme()` | Suppress failures | ✅ Passes | ✅ Ignored | Work in progress |
| `test.fail()` | Expected failure | 🔔 Unexpected | ✅ Expected | Known issues |
| `test.slow()` | 3x timeout | ✅ Passes | ❌ Fails | Slow operations |

