import { test, expect } from '@playwright/test';

/**
 * FLAKY TESTS - PRACTICAL EXAMPLES
 * =================================
 * 
 * This file demonstrates:
 * 1. Common flaky test patterns (WRONG)
 * 2. How to fix them (CORRECT)
 * 3. Best practices
 * 4. Debugging techniques
 * 5. Real-world scenarios
 * 
 * Run with: npx playwright test pw_15_3_flakytests.spec.ts
 */

// ============================================================================
// EXAMPLE 1: Race Condition - Element Not Ready
// ============================================================================

test('ex1a: FLAKY - no wait for element', async ({ page }) => {
  console.log('❌ FLAKY: Element might not exist yet');
  
  await page.goto('https://example.com');
  
  // Problem: Button added to DOM asynchronously
  // This might fail if button not in DOM yet
  try {
    await page.click('button:has-text("Dynamic Button")');
    console.log('✓ Button clicked (but might fail sometimes)');
  } catch (error) {
    console.log('✗ Button not found (FLAKY!)');
    throw error;
  }
});

test('ex1b: STABLE - wait for element', async ({ page }) => {
  console.log('✅ STABLE: Wait for element before clicking');
  
  await page.goto('https://example.com');
  
  // Solution: Wait for button to appear
  const button = page.locator('button:has-text("Dynamic Button")');
  
  // Ensure button exists and is ready
  await button.waitFor({ state: 'visible', timeout: 5000 });
  console.log('  ✓ Button is visible');
  
  // Now safe to click
  await button.click();
  console.log('  ✓ Button clicked successfully');
});

// ============================================================================
// EXAMPLE 2: Network Timing - API Still Loading
// ============================================================================

test('ex2a: FLAKY - no network wait', async ({ page }) => {
  console.log('❌ FLAKY: Data might not be loaded yet');
  
  await page.goto('https://example.com/users');
  
  // Problem: API might still be loading
  // This assertion might fail randomly
  try {
    const userList = page.locator('.user-list');
    const count = await userList.locator('.user-item').count();
    console.log(`Found ${count} users`);
    expect(count).toBeGreaterThan(0);
  } catch (error) {
    console.log('✗ Users not loaded yet (FLAKY!)');
    throw error;
  }
});

test('ex2b: STABLE - wait for network', async ({ page }) => {
  console.log('✅ STABLE: Wait for network to complete');
  
  // Solution: Wait for network idle
  await page.goto('https://example.com/users', {
    waitUntil: 'networkidle',
  });
  console.log('  ✓ Page loaded and network idle');
  
  // Now data is definitely loaded
  const userList = page.locator('.user-list');
  const count = await userList.locator('.user-item').count();
  console.log(`  ✓ Found ${count} users`);
  
  expect(count).toBeGreaterThan(0);
});

// ============================================================================
// EXAMPLE 3: Stale Element - DOM Refresh
// ============================================================================

test('ex3a: FLAKY - stale element reference', async ({ page }) => {
  console.log('❌ FLAKY: Element might become stale');
  
  await page.goto('https://example.com');
  
  // Get element reference
  const items = page.locator('.item');
  const firstItem = items.first();
  
  // Problem: If DOM refreshes, element becomes stale
  await page.waitForTimeout(1000);
  
  try {
    await firstItem.click();  // Might fail - element gone!
    console.log('✓ Item clicked (but might be stale)');
  } catch (error) {
    console.log('✗ Element became stale (FLAKY!)');
    throw error;
  }
});

test('ex3b: STABLE - re-query element', async ({ page }) => {
  console.log('✅ STABLE: Always use fresh locators');
  
  await page.goto('https://example.com');
  
  // Solution: Always re-query elements
  await page.waitForTimeout(1000);
  
  // Fresh locator query
  const items = page.locator('.item');
  await items.first().click();
  console.log('  ✓ Item clicked with fresh locator');
});

// ============================================================================
// EXAMPLE 4: Incomplete DOM Rendering
// ============================================================================

test('ex4a: FLAKY - no wait for render', async ({ page }) => {
  console.log('❌ FLAKY: JavaScript component might not render');
  
  await page.goto('https://example.com/dynamic-page');
  
  // Problem: Heavy JavaScript component still rendering
  try {
    const component = page.locator('.expensive-component');
    await expect(component).toBeVisible();
    console.log('✓ Component visible');
  } catch (error) {
    console.log('✗ Component not rendered yet (FLAKY!)');
    throw error;
  }
});

test('ex4b: STABLE - wait for rendering', async ({ page }) => {
  console.log('✅ STABLE: Wait for DOM and network');
  
  await page.goto('https://example.com/dynamic-page');
  
  // Solution: Wait for multiple load states
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');
  console.log('  ✓ DOM ready');
  
  // Or wait for specific element
  await page.waitForSelector('.expensive-component', { timeout: 10000 });
  console.log('  ✓ Component rendered');
  
  const component = page.locator('.expensive-component');
  await expect(component).toBeVisible();
});

// ============================================================================
// EXAMPLE 5: Animation Timing Issues
// ============================================================================

test('ex5a: FLAKY - animation not complete', async ({ page }) => {
  console.log('❌ FLAKY: Animation might not be finished');
  
  await page.goto('https://example.com');
  
  // Problem: Clicking before animation completes
  await page.click('button[data-action="open-menu"]');
  
  try {
    // Menu still animating in...
    const item = page.locator('.menu-item').first();
    await item.click();  // MIGHT FAIL - animation not done
    console.log('✓ Menu item clicked');
  } catch (error) {
    console.log('✗ Menu item not ready (FLAKY!)');
    throw error;
  }
});

test('ex5b: STABLE - wait for stable state', async ({ page }) => {
  console.log('✅ STABLE: Wait for element to stabilize');
  
  await page.goto('https://example.com');
  
  // Open menu
  await page.click('button[data-action="open-menu"]');
  console.log('  ✓ Opened menu');
  
  // Solution: Wait for menu item to be fully visible (animation complete)
  const item = page.locator('.menu-item').first();
  await item.waitFor({ state: 'visible' });
  console.log('  ✓ Menu item visible and stable');
  
  // Now safe to click
  await item.click();
  console.log('  ✓ Menu item clicked');
});

// ============================================================================
// EXAMPLE 6: External Service Failure
// ============================================================================

test('ex6a: FLAKY - external API dependency', async ({ page }) => {
  console.log('❌ FLAKY: External API might be down');
  
  await page.goto('https://example.com');
  
  // Problem: Depends on external weather API
  // If API is down, test fails randomly
  try {
    await expect(page.locator('.weather-widget'))
      .toContainText(/sunny|rainy|cloudy/);
    console.log('✓ Weather loaded');
  } catch (error) {
    console.log('✗ External API failed (FLAKY!)');
    throw error;
  }
});

test('ex6b: STABLE - mock external service', async ({ page, context }) => {
  console.log('✅ STABLE: Mock external dependency');
  
  // Solution: Intercept and mock external API
  await context.route('https://weather-api.com/**', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ weather: 'sunny', temp: 72 }),
    });
  });
  console.log('  ✓ API mocked');
  
  await page.goto('https://example.com');
  
  // Now weather widget shows mocked data
  await expect(page.locator('.weather-widget'))
    .toContainText(/sunny/);
  console.log('  ✓ Mocked weather loaded');
});

// ============================================================================
// EXAMPLE 7: Test Isolation - Shared State
// ============================================================================

// ❌ FLAKY: Tests affect each other
let globalCounter = 0;

test('ex7a: FLAKY - test 1 modifies global', async () => {
  console.log('❌ FLAKY: Test 1 modifies shared state');
  
  globalCounter++;
  expect(globalCounter).toBe(1);
  console.log(`  Counter: ${globalCounter}`);
});

test('ex7b: FLAKY - test 2 depends on previous', async () => {
  console.log('❌ FLAKY: Test 2 depends on test 1');
  
  // This might fail depending on test order!
  expect(globalCounter).toBe(1);
  console.log(`  Counter: ${globalCounter}`);
});

// ✅ STABLE: Proper isolation
test('ex7c: STABLE - test 1 isolated', async ({ page }) => {
  console.log('✅ STABLE: Test 1 has isolated state');
  
  let localCounter = 0;  // Local, not shared
  localCounter++;
  expect(localCounter).toBe(1);
  console.log(`  Local counter: ${localCounter}`);
});

test('ex7d: STABLE - test 2 isolated', async ({ page }) => {
  console.log('✅ STABLE: Test 2 has isolated state');
  
  let localCounter = 0;  // Independent copy
  localCounter++;
  expect(localCounter).toBe(1);
  console.log(`  Local counter: ${localCounter}`);
});

// ============================================================================
// EXAMPLE 8: Brittle Selectors
// ============================================================================

test('ex8a: FLAKY - brittle selector with nth-child', async ({ page }) => {
  console.log('❌ FLAKY: Selector breaks with HTML changes');
  
  await page.goto('https://example.com');
  
  // Problem: Too specific, breaks if HTML changes
  // ❌ XPath with position: //button[3]
  // ❌ nth-child: body > div > button:nth-child(3)
  
  try {
    // This selector will fail if buttons are reordered
    await page.click('button:nth-child(3)');
    console.log('✓ Button clicked (but selector is brittle)');
  } catch (error) {
    console.log('✗ Brittle selector failed (FLAKY!)');
    throw error;
  }
});

test('ex8b: STABLE - robust semantic selector', async ({ page }) => {
  console.log('✅ STABLE: Use semantic, robust selectors');
  
  await page.goto('https://example.com');
  
  // Solution: Use text or data attributes
  // ✅ By text: button:has-text("Save")
  // ✅ By attribute: [data-testid="submit"]
  // ✅ By role: role=button[name="Submit"]
  
  const button = page.locator('button:has-text("Submit")');
  await button.click();
  console.log('  ✓ Button clicked with robust selector');
});

// ============================================================================
// EXAMPLE 9: Inconsistent Test Data
// ============================================================================

let randomTestId: number;

test('ex9a: FLAKY - random test data', async ({ page }) => {
  console.log('❌ FLAKY: Using random data');
  
  randomTestId = Math.floor(Math.random() * 1000);
  
  // Problem: Different random ID each run
  await page.goto(`https://example.com/user/${randomTestId}`);
  
  try {
    // Depends on which user exists in system
    await expect(page.locator('.user-name')).toBeVisible();
    console.log(`  ✓ User ${randomTestId} found`);
  } catch (error) {
    console.log(`  ✗ User ${randomTestId} not found (FLAKY!)`);
    throw error;
  }
});

test('ex9b: STABLE - controlled test data', async ({ page }) => {
  console.log('✅ STABLE: Using consistent test data');
  
  // Solution: Always use same test data
  const testId = 'test-user-99999';
  
  // Setup: Ensure test user exists
  console.log(`  Creating test user: ${testId}`);
  
  await page.goto(`https://example.com/user/${testId}`);
  
  // Now consistent
  await expect(page.locator('.user-name')).toBeVisible();
  console.log(`  ✓ Test user ${testId} found`);
});

// ============================================================================
// EXAMPLE 10: Insufficient Timeouts
// ============================================================================

test('ex10a: FLAKY - timeout too short', async ({ page }) => {
  console.log('❌ FLAKY: Timeout might be too short');
  
  await page.goto('https://slow-api.example.com');
  
  // Problem: Timeout too short for slow API
  try {
    await page.waitForSelector('.data', { timeout: 500 });  // Too short!
    console.log('✓ Data loaded quickly');
  } catch (error) {
    console.log('✗ Timeout too short for slow API (FLAKY!)');
    throw error;
  }
});

test('ex10b: STABLE - appropriate timeout', async ({ page }) => {
  console.log('✅ STABLE: Adequate timeout');
  
  await page.goto('https://slow-api.example.com');
  
  // Solution: Give enough time
  await page.waitForSelector('.data', { timeout: 15000 });  // 15 seconds
  console.log('  ✓ Data loaded within timeout');
  
  await expect(page.locator('.data')).toBeVisible();
});

// ============================================================================
// EXAMPLE 11: Proper BeforeEach/AfterEach Setup
// ============================================================================

test.describe('ex11: proper test isolation', () => {
  let testPage: any;
  
  test.beforeEach(async ({ page }, testInfo) => {
    console.log(`  🔄 Setup before test: ${testInfo.title}`);
    testPage = page;
    
    // Fresh state for each test
    await page.goto('https://example.com');
    await page.waitForLoadState('networkidle');
    console.log('  ✓ Fresh page loaded');
  });
  
  test.afterEach(async ({ page }, testInfo) => {
    console.log(`  🧹 Cleanup after test: ${testInfo.title}`);
    
    // Cleanup/reset state
    await page.close();
    console.log('  ✓ Page closed');
  });
  
  test('isolated test 1', async ({ page }) => {
    console.log('✅ Test 1 - guaranteed fresh state');
    expect(page).toBeDefined();
  });
  
  test('isolated test 2', async ({ page }) => {
    console.log('✅ Test 2 - guaranteed fresh state');
    expect(page).toBeDefined();
  });
});

// ============================================================================
// EXAMPLE 12: Real-World E-Commerce Checkout
// ============================================================================

test('ex12: FLAKY - checkout without proper waits', async ({ page }) => {
  console.log('❌ FLAKY: E-commerce checkout (unstable)');
  
  await page.goto('https://shop.example.com/cart');
  
  // Multiple points of failure
  await page.click('button:has-text("Checkout")');
  await page.fill('input[name="card"]', '4242 4242 4242 4242');
  await page.click('button:has-text("Place Order")');
  
  // Might fail - order page hasn't loaded
  await expect(page).toHaveURL(/.*order-confirmation/);
});

test('ex12b: STABLE - checkout with proper waits', async ({ page }) => {
  console.log('✅ STABLE: E-commerce checkout (robust)');
  
  await page.goto('https://shop.example.com/cart', {
    waitUntil: 'networkidle',
  });
  console.log('  ✓ Cart loaded');
  
  // Wait for checkout button
  const checkoutBtn = page.locator('button:has-text("Checkout")');
  await checkoutBtn.waitFor({ state: 'visible' });
  await checkoutBtn.click();
  console.log('  ✓ Clicked checkout');
  
  // Wait for payment form
  await page.waitForSelector('input[name="card"]', { timeout: 5000 });
  console.log('  ✓ Payment form loaded');
  
  // Fill payment info
  await page.fill('input[name="card"]', '4242 4242 4242 4242');
  console.log('  ✓ Filled card number');
  
  // Submit
  const submitBtn = page.locator('button:has-text("Place Order")');
  await submitBtn.click();
  console.log('  ✓ Submitted order');
  
  // Wait for confirmation
  await page.waitForURL(/.*order-confirmation/, { timeout: 10000 });
  console.log('  ✓ Order confirmed');
  
  await expect(page).toHaveURL(/.*order-confirmation/);
});

// ============================================================================
// EXAMPLE 13: Debugging Flaky Test with Logging
// ============================================================================

test('ex13: debug flaky test with detailed logging', async ({ page }, testInfo) => {
  console.log('🔍 Debugging with detailed logging');
  
  const attempt = testInfo.retry + 1;
  console.log(`  📊 Attempt: ${attempt}`);
  
  // Log navigation
  const navStart = Date.now();
  await page.goto('https://example.com');
  const navTime = Date.now() - navStart;
  console.log(`  ⏱️ Navigation: ${navTime}ms`);
  
  // Log element checks
  const element = page.locator('.test-element');
  const isVisible = await element.isVisible().catch(() => false);
  const isEnabled = await element.isEnabled().catch(() => false);
  console.log(`  🔹 Element visible: ${isVisible}`);
  console.log(`  🔹 Element enabled: ${isEnabled}`);
  
  // Interact with logging
  const clickStart = Date.now();
  await element.click();
  const clickTime = Date.now() - clickStart;
  console.log(`  ⏱️ Click: ${clickTime}ms`);
  
  console.log('  ✓ Test completed successfully');
});

// ============================================================================
// EXAMPLE 14: Using Videos and Traces for Flaky Test Debugging
// ============================================================================

test('ex14: flaky test with debugging artifacts', async ({ page, context }, testInfo) => {
  console.log('📹 Test with trace and video');
  
  // If configured, trace and video auto-record
  
  await page.goto('https://example.com');
  console.log('  ✓ Navigated');
  
  // When test fails:
  // 1. Trace file captures detailed info (test-results/*.trace)
  // 2. Video shows execution (test-results/*.webm)
  // 3. Both can be analyzed for failure root cause
  
  const element = page.locator('.element');
  await element.click();
  console.log('  ✓ Clicked element');
  
  console.log(`  📁 Trace: test-results/trace.trace`);
  console.log(`  📁 Video: test-results/video.webm`);
});

// ============================================================================
// EXAMPLE 15: Retry Strategy Configuration
// ============================================================================

test('ex15: test with retry strategy', async ({ page }, testInfo) => {
  console.log(`🔄 Attempt ${testInfo.retry + 1}`);
  
  // This test will retry on failure
  // Configure in playwright.config.ts:
  // retries: process.env.CI ? 2 : 0
  
  await page.goto('https://example.com');
  
  // If this fails, test will retry up to 2 times
  await expect(page.locator('.reliable-element')).toBeVisible();
  
  console.log('  ✓ Test passed on first attempt');
});

/**
 * RUNNING THESE EXAMPLES:
 * =======================
 * 
 * 1. Run all examples:
 *    npx playwright test pw_15_3_flakytests.spec.ts
 * 
 * 2. Run specific example (compare FLAKY vs STABLE):
 *    npx playwright test -g "ex1a: FLAKY"
 *    npx playwright test -g "ex1b: STABLE"
 * 
 * 3. Run with retries to see retry behavior:
 *    npx playwright test --retries 2
 * 
 * 4. Run with verbose logging:
 *    npx playwright test --verbose
 * 
 * 5. View traces for failure analysis:
 *    npx playwright show-trace test-results/trace.trace
 * 
 * KEY TAKEAWAYS:
 * ==============
 * 
 * ✅ ALWAYS:
 * - Use waitFor() before interactions
 * - Wait for networkidle after navigation
 * - Use semantic selectors (data-testid, text)
 * - Isolate tests (beforeEach/afterEach)
 * - Mock external services
 * - Set appropriate timeouts
 * - Enable traces/videos for debugging
 * - Retry flaky tests in CI
 * 
 * ❌ NEVER:
 * - Use arbitrary setTimeout()
 * - Use brittle selectors (nth-child, XPath)
 * - Share state between tests
 * - Depend on test execution order
 * - Ignore timeout warnings
 * - Disable error handling
 */
