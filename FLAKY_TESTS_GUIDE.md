# Flaky Tests - Complete Guide & Solutions

## Table of Contents
1. [What Are Flaky Tests?](#what-are-flaky-tests)
2. [Why Tests Become Flaky](#why-tests-become-flaky)
3. [Common Causes](#common-causes)
4. [Detection Strategies](#detection-strategies)
5. [Solutions & Fixes](#solutions--fixes)
6. [Prevention Best Practices](#prevention-best-practices)
7. [Real-World Examples](#real-world-examples)
8. [Debugging Flaky Tests](#debugging-flaky-tests)
9. [CI/CD Strategies](#cicd-strategies)

---

## What Are Flaky Tests?

**Flaky tests** are tests that:
- ✅ Pass sometimes
- ❌ Fail sometimes
- 🔄 Without code changes
- 🤷 For non-deterministic reasons

### The Frustration

```
Run 1: ✅ PASS
Run 2: ❌ FAIL
Run 3: ✅ PASS
Run 4: ❌ FAIL
Run 5: ✅ PASS

Same test code... inconsistent results!
```

### Why This Is a Problem

1. **Unreliable Results**: Can't trust test suite
2. **Wasted Time**: Debugging "phantom failures"
3. **Low Confidence**: Don't know if it's a real bug
4. **CI/CD Frustration**: Blocks deployment
5. **Team Morale**: "The tests are broken again"

---

## Why Tests Become Flaky

### Root Causes Hierarchy

```
Flaky Tests
├── Timing Issues (40% of cases)
│   ├── Async operations
│   ├── Network delays
│   └── DOM rendering
│
├── Environmental Issues (30% of cases)
│   ├── Browser state
│   ├── System resources
│   └── Test isolation
│
├── Test Design Issues (20% of cases)
│   ├── Race conditions
│   ├── Brittle selectors
│   └── Order dependencies
│
└── External Factors (10% of cases)
    ├── API unavailability
    ├── Third-party services
    └── Random data
```

---

## Common Causes

### 1. **Race Conditions - Timing Mismatches**

```typescript
// ❌ FLAKY: Element might not be ready yet
test('flaky - no wait', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Problem: Item added to DOM asynchronously
  const item = page.locator('.new-item');
  await item.click();  // MIGHT NOT EXIST YET!
});

// ✅ FIXED: Wait for element first
test('fixed - with wait', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Ensure element exists before interaction
  await page.waitForSelector('.new-item');
  const item = page.locator('.new-item');
  await item.click();
});
```

### 2. **Network Timing Issues**

```typescript
// ❌ FLAKY: No guarantee data loaded
test('flaky - assumes data loaded', async ({ page }) => {
  await page.goto('https://api.example.com/users');
  
  // API might still be loading...
  const users = page.locator('.user-list');
  await expect(users).toContainText('John');  // MIGHT FAIL!
});

// ✅ FIXED: Wait for network
test('fixed - waits for network', async ({ page }) => {
  await page.goto('https://api.example.com/users', {
    waitUntil: 'networkidle',  // All network done
  });
  
  const users = page.locator('.user-list');
  await expect(users).toContainText('John');
});
```

### 3. **Stale Element References**

```typescript
// ❌ FLAKY: Element might re-render
test('flaky - stale element', async ({ page }) => {
  const items = page.locator('.item');
  
  // If DOM refreshes, item might become stale
  const firstItem = items.first();
  await page.waitForTimeout(1000);  // Random wait
  await firstItem.click();  // MIGHT FAIL - element gone!
});

// ✅ FIXED: Re-query after changes
test('fixed - fresh element', async ({ page }) => {
  const items = page.locator('.item');
  
  // Always use fresh locators
  await page.locator('.item').first().click();
  
  // Or wait and re-query
  await page.waitForTimeout(1000);
  await page.locator('.item').first().click();
});
```

### 4. **Incomplete DOM Rendering**

```typescript
// ❌ FLAKY: Rendering not complete
test('flaky - incomplete render', async ({ page }) => {
  await page.goto('https://example.com/dynamic-page');
  
  // JavaScript-heavy page might not render yet
  await expect(page.locator('.expensive-component')).toBeVisible();
});

// ✅ FIXED: Wait for component
test('fixed - wait for render', async ({ page }) => {
  await page.goto('https://example.com/dynamic-page');
  
  // Wait for JavaScript to render component
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');
  
  // Or wait for specific element
  await page.waitForSelector('.expensive-component', { timeout: 5000 });
  
  await expect(page.locator('.expensive-component')).toBeVisible();
});
```

### 5. **Animation/Transition Timing**

```typescript
// ❌ FLAKY: Animation not complete
test('flaky - animation timing', async ({ page }) => {
  await page.click('button[data-action="open-menu"]');
  
  // Menu animating in...
  const item = page.locator('.menu-item');
  await item.click();  // MIGHT FAIL - animation not done
});

// ✅ FIXED: Wait for stable state
test('fixed - wait for stable state', async ({ page }) => {
  await page.click('button[data-action="open-menu"]');
  
  // Wait for element to be visible AND stable
  const item = page.locator('.menu-item');
  await item.waitFor({ state: 'visible' });
  await item.click();
});
```

### 6. **External Service Failures**

```typescript
// ❌ FLAKY: Depends on external API
test('flaky - external dependency', async ({ page }) => {
  await page.goto('https://example.com');
  
  // What if external API is down?
  await expect(page.locator('.weather-widget')).toContainText('sunny');
});

// ✅ FIXED: Mock external service
test('fixed - with mock', async ({ page, context }) => {
  // Intercept and mock external API
  await context.route('https://weather-api.com/**', route => {
    route.abort();  // Or route.continue() with mock data
  });
  
  await page.goto('https://example.com');
  
  // Now test is resilient to API failures
  await expect(page.locator('.weather-widget')).toContainText('default-weather');
});
```

### 7. **Test Isolation Issues**

```typescript
// ❌ FLAKY: Tests affect each other
let counter = 0;  // Shared state!

test('test 1 - increments counter', async () => {
  counter++;
  expect(counter).toBe(1);  // MIGHT FAIL if run second!
});

test('test 2 - uses counter', async () => {
  expect(counter).toBe(1);  // Depends on test order!
});

// ✅ FIXED: Proper isolation
test('test 1 - isolated', async ({ page }, testInfo) => {
  const localCounter = 0;  // Local, not shared
  expect(localCounter).toBe(0);
});

test('test 2 - isolated', async ({ page }, testInfo) => {
  const localCounter = 0;  // Independent copy
  expect(localCounter).toBe(0);
});
```

### 8. **Brittle Selectors**

```typescript
// ❌ FLAKY: Selector might break with DOM changes
test('flaky - brittle selector', async ({ page }) => {
  await page.goto('https://example.com');
  
  // What if HTML structure changes?
  const button = page.locator('body > div > div > button:nth-child(3)');
  await button.click();  // MIGHT FAIL - selector too specific
});

// ✅ FIXED: Robust selector
test('fixed - robust selector', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Use semantic selectors
  const button = page.locator('button:has-text("Submit")');
  await button.click();
});
```

### 9. **Inconsistent Test Data**

```typescript
// ❌ FLAKY: Random test data
test('flaky - random data', async ({ page }) => {
  const randomId = Math.random();  // Different each run!
  
  await page.goto(`https://example.com/user/${randomId}`);
  
  // Depends on what data exists in system
  await expect(page.locator('.user-name')).toBeVisible();
});

// ✅ FIXED: Consistent test data
test('fixed - controlled data', async ({ page }, testInfo) => {
  const testId = 'test-user-12345';  // Always same
  
  // Setup: Create user if needed
  await setupTestUser(testId);
  
  await page.goto(`https://example.com/user/${testId}`);
  
  await expect(page.locator('.user-name')).toBeVisible();
  
  // Cleanup: Remove test data
  await cleanupTestUser(testId);
});
```

### 10. **Insufficient Timeouts**

```typescript
// ❌ FLAKY: Timeout too short
test('flaky - short timeout', async ({ page }) => {
  await page.goto('https://slow-api.example.com');
  
  await page.waitForSelector('.data', { timeout: 1000 });  // Might be too short!
});

// ✅ FIXED: Appropriate timeout
test('fixed - adequate timeout', async ({ page }) => {
  await page.goto('https://slow-api.example.com');
  
  // Give enough time for slow operations
  await page.waitForSelector('.data', { timeout: 10000 });
  
  await expect(page.locator('.data')).toBeVisible();
});
```

---

## Detection Strategies

### 1. **Run Tests Multiple Times**

```bash
# Run same test 10 times
for i in {1..10}; do
  npx playwright test -g "my-test"
  if [ $? -ne 0 ]; then
    echo "FAILED on iteration $i"
  fi
done
```

### 2. **Identify Failure Pattern**

```typescript
// Look for:
- Same test fails only sometimes
- Different tests fail in different runs
- Failures happen under load
- Failures specific to CI/CD
```

### 3. **Enable Verbose Logging**

```bash
npx playwright test --verbose pw_15_3_flakytests.spec.ts
```

### 4. **Use Traces & Videos**

```typescript
// playwright.config.ts
use: {
  trace: 'on-first-retry',  // Capture trace on failure
  video: 'retain-on-failure', // Record video
  screenshot: 'only-on-failure', // Screenshot
}
```

---

## Solutions & Fixes

### Fix 1: **Use Proper Waits**

```typescript
// ✅ AUTO WAIT (Playwright does this automatically)
await page.click('.button');  // Waits for element to be actionable

// ✅ EXPLICIT WAIT for visibility
await page.locator('.data').waitFor({ state: 'visible' });

// ✅ WAIT for network
await page.waitForLoadState('networkidle');

// ✅ WAIT for specific element
await page.waitForSelector('.loaded-content', { timeout: 5000 });

// ✅ WAIT for function
await page.waitForFunction(() => {
  return document.querySelectorAll('.item').length > 0;
});
```

### Fix 2: **Proper Load State Handling**

```typescript
// Navigation load states
await page.goto('https://example.com', {
  waitUntil: 'load',           // Page load event fires
  // OR
  waitUntil: 'domcontentloaded', // DOM ready
  // OR
  waitUntil: 'networkidle',    // No network activity
});

// After navigation
await page.waitForLoadState('networkidle');
```

### Fix 3: **Stabilize Elements Before Interaction**

```typescript
// ✅ Element becomes actionable (visible, enabled, no animation)
const button = page.locator('button');
await button.isVisible();  // Check visibility
await button.isEnabled();  // Check enabled state
await button.click();      // Safe to click
```

### Fix 4: **Mock External Dependencies**

```typescript
test('with mocked API', async ({ page, context }) => {
  // Mock external service
  await context.route('https://api.external.com/**', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({ data: 'mocked' }),
    });
  });

  await page.goto('https://example.com');
  // Now independent of external API
});
```

### Fix 5: **Set Correct Timeouts**

```typescript
test('with appropriate timeout', async ({ page }) => {
  page.setDefaultTimeout(10000);  // 10 seconds
  page.setDefaultNavigationTimeout(30000);  // 30 seconds
  
  await page.goto('https://slow-site.example.com');
  await page.click('button');
});
```

### Fix 6: **Ensure Test Isolation**

```typescript
test.beforeEach(async ({ page }, testInfo) => {
  // Fresh state before each test
  await page.goto('https://example.com');
  console.log(`Starting: ${testInfo.title}`);
});

test.afterEach(async ({ page }, testInfo) => {
  // Cleanup after each test
  console.log(`Finished: ${testInfo.title}`);
});

test('isolated test 1', async ({ page }) => {
  // Guaranteed fresh state
});

test('isolated test 2', async ({ page }) => {
  // Guaranteed fresh state
});
```

### Fix 7: **Use Data Attributes for Selectors**

```typescript
// ✅ GOOD: Semantic selectors
await page.click('button:has-text("Submit")');
await page.locator('[data-testid="user-email"]').fill('test@example.com');

// ✅ ROBUST: Role-based selectors
await page.click('role=button[name="Submit"]');
await page.fill('role=textbox[name="Email"]', 'test@example.com');

// ❌ FLAKY: XPath and nth-child
await page.click('//button[3]');
await page.click('body > div > button:nth-child(3)');
```

### Fix 8: **Handle Animations Properly**

```typescript
// ✅ Disable animations in tests
await page.addStyleTag({
  content: `
    * {
      animation: none !important;
      transition: none !important;
    }
  `,
});

// OR configure in browser
export default defineConfig({
  use: {
    // Playwright handles this
    launchArgs: ['--disable-animations'],
  },
});
```

### Fix 9: **Retry Configuration**

```typescript
// playwright.config.ts
export default defineConfig({
  // Retry only in CI
  retries: process.env.CI ? 2 : 0,
  
  // Or retry specific tests
  projects: [
    {
      name: 'chromium',
      use: devices['Desktop Chrome'],
      retries: 2,  // Retry on failure
    },
  ],
});
```

### Fix 10: **Use Soft Assertions for Non-Critical Checks**

```typescript
// ✅ Soft assertions - continue even if fail
test('with soft assertions', async ({ page }) => {
  await page.goto('https://example.com');
  
  // These don't stop the test if they fail
  await expect.soft(page.locator('.element1')).toBeVisible();
  await expect.soft(page.locator('.element2')).toBeVisible();
  await expect.soft(page.locator('.element3')).toBeVisible();
  
  // All checked, all results collected
});
```

---

## Prevention Best Practices

### ✅ DO:

1. **Always wait for elements before interaction**
   ```typescript
   await page.waitForSelector('.element');
   await page.click('.element');
   ```

2. **Use semantic selectors**
   ```typescript
   await page.click('button:has-text("Save")');
   ```

3. **Test with retries in CI**
   ```typescript
   retries: process.env.CI ? 2 : 0
   ```

4. **Mock external services**
   ```typescript
   await context.route('https://external-api.com/**', route => {
     route.fulfill({ /* mock response */ });
   });
   ```

5. **Isolate test data**
   ```typescript
   test.beforeEach(async ({ page }) => {
     await setupFreshData();
   });
   ```

6. **Use appropriate timeouts**
   ```typescript
   await page.waitForSelector('.data', { timeout: 10000 });
   ```

7. **Wait for network idle after navigation**
   ```typescript
   await page.goto(url, { waitUntil: 'networkidle' });
   ```

8. **Use traces & videos to debug failures**
   ```typescript
   use: {
     trace: 'on-first-retry',
     video: 'retain-on-failure',
   }
   ```

### ❌ DON'T:

1. **Use arbitrary timeouts**
   ```typescript
   // ❌ FLAKY
   await page.waitForTimeout(2000);
   ```

2. **Rely on brittle selectors**
   ```typescript
   // ❌ FLAKY
   await page.click('body > div:nth-child(3) > button');
   ```

3. **Share state between tests**
   ```typescript
   // ❌ FLAKY
   let sharedData = [];
   ```

4. **Skip error handling**
   ```typescript
   // ❌ FLAKY - catches all errors silently
   try { /* code */ } catch { }
   ```

5. **Ignore test order dependencies**
   ```typescript
   // ❌ FLAKY - tests depend on each other
   test('test1', () => { setupData(); });
   test('test2', () => { useData(); });  // Depends on test1!
   ```

---

## Real-World Examples

### Example 1: E-commerce Checkout (Common Flakiness)

```typescript
// ❌ FLAKY VERSION
test('flaky checkout', async ({ page }) => {
  await page.goto('https://shop.example.com/cart');
  
  // Problems:
  // 1. Cart might still be loading
  // 2. Item quantity updates async
  // 3. Checkout button might be disabled
  // 4. Payment form might not be injected yet
  
  await page.click('button:has-text("Checkout")');
  await page.fill('input[name="card"]', '4242 4242 4242 4242');
  await page.click('button:has-text("Place Order")');
  
  // Assertion might fail before order loads
  await expect(page).toHaveURL(/.*order-confirmation/);
});

// ✅ FIXED VERSION
test('stable checkout', async ({ page }) => {
  await page.goto('https://shop.example.com/cart', {
    waitUntil: 'networkidle',
  });
  
  // Wait for cart to load
  await page.waitForSelector('.cart-item');
  
  // Wait for checkout button to be actionable
  const checkoutBtn = page.locator('button:has-text("Checkout")');
  await checkoutBtn.waitFor({ state: 'visible' });
  await checkoutBtn.click();
  
  // Wait for payment form to load
  await page.waitForSelector('input[name="card"]');
  
  // Fill with waits
  await page.fill('input[name="card"]', '4242 4242 4242 4242');
  
  // Wait for submit button
  const submitBtn = page.locator('button:has-text("Place Order")');
  await submitBtn.click();
  
  // Wait for confirmation page
  await page.waitForURL(/.*order-confirmation/, { timeout: 10000 });
  
  await expect(page).toHaveURL(/.*order-confirmation/);
});
```

### Example 2: Dynamic Table with Lazy Loading

```typescript
// ❌ FLAKY: Rows loaded asynchronously
test('flaky table test', async ({ page }) => {
  await page.goto('https://example.com/users');
  
  const rows = page.locator('table tbody tr');
  
  // Table might still be loading!
  const count = await rows.count();
  expect(count).toBeGreaterThan(0);
});

// ✅ FIXED: Wait for table to load
test('stable table test', async ({ page }) => {
  await page.goto('https://example.com/users', {
    waitUntil: 'networkidle',
  });
  
  // Wait for at least one row to load
  await page.waitForSelector('table tbody tr', { timeout: 5000 });
  
  const rows = page.locator('table tbody tr');
  const count = await rows.count();
  
  expect(count).toBeGreaterThan(0);
});
```

### Example 3: Modal Dialog (Appears After User Action)

```typescript
// ❌ FLAKY: Dialog might not exist yet
test('flaky modal', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Click to open modal
  await page.click('button:has-text("Open")');
  
  // Dialog might still be rendering!
  await page.fill('input[name="email"]', 'test@example.com');
});

// ✅ FIXED: Wait for modal before interaction
test('stable modal', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Click to open modal
  await page.click('button:has-text("Open")');
  
  // Wait for modal to appear
  const modal = page.locator('[role="dialog"]');
  await modal.waitFor({ state: 'visible' });
  
  // Now safe to interact
  await page.fill('input[name="email"]', 'test@example.com');
  await page.click('button:has-text("Submit")');
  
  // Wait for modal to close
  await modal.waitFor({ state: 'hidden' });
});
```

---

## Debugging Flaky Tests

### Step 1: Reproduce the Flakiness

```bash
# Run test multiple times
for i in {1..20}; do
  echo "Run $i..."
  npx playwright test -g "flaky-test" --reporter=dot
done
```

### Step 2: Enable Debugging

```bash
# Run with trace and video
PWDEBUG=1 npx playwright test -g "flaky-test"
```

### Step 3: Analyze Trace

```bash
# View trace to see exact failure point
npx playwright show-trace test-results/trace.trace
```

### Step 4: Add Logging

```typescript
test('debug flaky test', async ({ page }, testInfo) => {
  console.log(`Test run: ${testInfo.retry + 1}`);
  
  await page.goto('https://example.com');
  console.log('Page loaded');
  
  const element = page.locator('.element');
  console.log(`Element visible: ${await element.isVisible()}`);
  console.log(`Element enabled: ${await element.isEnabled()}`);
  
  await element.click();
  console.log('Clicked element');
});
```

### Step 5: Examine Console & Network

```typescript
// Capture all browser logs
page.on('console', msg => console.log(`[${msg.type()}] ${msg.text()}`));

// Log all network requests
page.on('request', req => console.log(`Request: ${req.url()}`));
page.on('response', res => console.log(`Response: ${res.status()} ${res.url()}`));
```

---

## CI/CD Strategies

### GitHub Actions Example

```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x]
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install
      
      - name: Run tests (with retries)
        run: npx playwright test
        env:
          CI: true
      
      # Upload artifacts on failure
      - name: Upload test artifacts
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-artifacts
          path: test-results/
          retention-days: 30
```

### Configuration for CI

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests',
  
  // Retries only in CI
  retries: process.env.CI ? 2 : 0,
  
  use: {
    // Tracing for debugging
    trace: process.env.CI ? 'on-first-retry' : 'retain-on-failure',
    
    // Video on failure
    video: process.env.CI ? 'on-first-retry' : 'retain-on-failure',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Timeouts
    navigationTimeout: 30000,
    actionTimeout: 10000,
  },

  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## Flaky Test Checklist

Before committing a test, verify:

- [ ] Test doesn't use arbitrary `waitForTimeout()`
- [ ] Test uses proper selectors (data-testid or semantic)
- [ ] Test waits for elements before interaction
- [ ] Test handles network with `waitUntil` or `waitForLoadState()`
- [ ] Test is isolated (beforeEach/afterEach cleanup)
- [ ] External dependencies are mocked
- [ ] Timeouts are appropriate (not too short)
- [ ] Test passes locally multiple times
- [ ] Test passes in CI/CD pipeline
- [ ] Animations/transitions are handled
- [ ] Test doesn't depend on other tests
- [ ] Error messages are descriptive

---

## Summary

| Problem | Solution |
|---------|----------|
| Element not found | Use `waitFor()` or `waitForSelector()` |
| Element not ready | Check `.isVisible()` and `.isEnabled()` |
| Network not done | Use `waitUntil: 'networkidle'` |
| Animation timing | Wait for stable state before action |
| External API fails | Mock the API response |
| Brittle selectors | Use data-testid or semantic selectors |
| Test isolation | Use beforeEach/afterEach |
| Flaky in CI only | Check timeouts and retries |
| Hard to debug | Enable traces, videos, logging |
| Race conditions | Synchronize with proper waits |

Flaky tests are solvable! Use proper waits, isolate tests, and mock dependencies.
