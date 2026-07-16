import { test, expect } from '@playwright/test';

/**
 * TRACE VIEWER EXAMPLES
 * =====================
 * This file demonstrates various ways to use Playwright's Trace Viewer
 * for debugging, analysis, and test documentation.
 * 
 * Run with: npx playwright test pw_15_1_traceviewer.spec.ts
 * View traces with: npx playwright show-trace ./test-results
 */

// ============================================================================
// EXAMPLE 1: Basic Tracing - Start and Stop
// ============================================================================
test('ex1: basic trace - google search', async ({ page, context }, testInfo) => {
  // Start recording trace with all features enabled
  await context.tracing.start({
    screenshots: true,      // Capture visual state
    snapshots: true,        // Capture DOM state
    sources: true,          // Include test source code
  });

  try {
    // Navigate to Google
    await page.goto('https://www.google.com');
    
    // Wait for page to load
    await expect(page).toHaveTitle(/Google/);
    
    // Fill search box
    await page.fill('textarea[name="q"]', 'Playwright testing');
    
    // Press Enter or click search
    await page.press('textarea[name="q"]', 'Enter');
    
    // Wait for results
    await page.waitForSelector('div#search', { timeout: 5000 });
    
    // Verify results loaded
    const results = page.locator('h3');
    await expect(results.first()).toBeVisible();
    
    console.log('✓ Search completed successfully');
    
  } finally {
    // Always stop trace (success or failure)
    await context.tracing.stop({
      path: `test-results/trace-${testInfo.title}.trace`,
    });
  }
});

// ============================================================================
// EXAMPLE 2: Conditional Tracing - Only When Needed
// ============================================================================
test('ex2: conditional trace - only on retry', async ({ page, context }, testInfo) => {
  const shouldTrace = testInfo.retry > 0;  // Only trace on retries
  
  if (shouldTrace) {
    await context.tracing.start({
      screenshots: true,
      snapshots: true,
    });
  }

  try {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example/);
    
  } finally {
    if (shouldTrace) {
      await context.tracing.stop({
        path: `test-results/trace-retry-${testInfo.retry}.trace`,
      });
    }
  }
});

// ============================================================================
// EXAMPLE 3: Named Traces with Timestamps
// ============================================================================
test('ex3: timestamped trace file', async ({ page, context }, testInfo) => {
  const timestamp = new Date().toISOString()
    .replace(/[:.]/g, '-')
    .replace('Z', '');
  
  await context.tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true,
  });

  try {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example/);
    
  } finally {
    const tracePath = `test-results/trace-${testInfo.title}-${timestamp}.trace`;
    await context.tracing.stop({ path: tracePath });
    console.log(`📊 Trace saved: ${tracePath}`);
  }
});

// ============================================================================
// EXAMPLE 4: Multi-Step Workflow with Tracing
// ============================================================================
test('ex4: e-commerce workflow trace', async ({ page, context }, testInfo) => {
  await context.tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true,
  });

  try {
    // Step 1: Navigate to store
    console.log('Step 1: Navigate to store...');
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example/);
    
    // Step 2: View product (simulate)
    console.log('Step 2: Viewing product...');
    await page.evaluate(() => {
      // Simulate clicking a product
      console.log('Product clicked');
    });
    
    // Step 3: Add to cart (simulate)
    console.log('Step 3: Adding to cart...');
    await page.evaluate(() => {
      console.log('Item added to cart');
    });
    
    // Step 4: View cart (simulate)
    console.log('Step 4: Viewing cart...');
    await page.evaluate(() => {
      console.log('Cart contents: 1 item');
    });
    
    // Step 5: Checkout (simulate)
    console.log('Step 5: Proceeding to checkout...');
    await page.evaluate(() => {
      console.log('Checkout initiated');
    });
    
    console.log('✓ Workflow completed');
    
  } finally {
    await context.tracing.stop({
      path: `test-results/trace-${testInfo.title}.trace`,
    });
  }
});

// ============================================================================
// EXAMPLE 5: Tracing with Error Handling
// ============================================================================
test('ex5: trace with error handling', async ({ page, context }, testInfo) => {
  await context.tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true,
  });

  try {
    await page.goto('https://example.com');
    
    // This will succeed
    await expect(page).toHaveTitle(/Example/);
    
    console.log('✓ Test passed');
    
  } catch (error) {
    // Trace still captures the failure state
    console.error('✗ Test failed:', error.message);
    throw error;
    
  } finally {
    // Trace saved regardless of pass/fail
    await context.tracing.stop({
      path: `test-results/trace-${testInfo.title}.trace`,
    });
  }
});

// ============================================================================
// EXAMPLE 6: Multiple Test Group with Shared Tracing
// ============================================================================
test.describe('ex6: shared tracing setup', () => {
  test.beforeEach(async ({ page, context }, testInfo) => {
    // Start trace before each test
    await context.tracing.start({
      screenshots: true,
      snapshots: true,
      sources: true,
    });
    console.log(`🔴 Tracing started for: ${testInfo.title}`);
  });

  test.afterEach(async ({ context }, testInfo) => {
    // Stop trace after each test
    await context.tracing.stop({
      path: `test-results/trace-${testInfo.title}.trace`,
    });
    console.log(`🟢 Trace saved for: ${testInfo.title}`);
  });

  // Both of these tests will be automatically traced
  test('sub-test 1: page navigation', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example/);
  });

  test('sub-test 2: page title', async ({ page }) => {
    await page.goto('https://example.com');
    const title = await page.title();
    expect(title).toContain('Example');
  });
});

// ============================================================================
// EXAMPLE 7: Selective Tracing - Different Options per Feature
// ============================================================================
test('ex7: selective trace - screenshots only', async ({ page, context }, testInfo) => {
  // Light tracing: screenshots only (smaller file)
  await context.tracing.start({
    screenshots: true,
    snapshots: false,  // Skip DOM snapshots
    sources: false,    // Skip source code
  });

  try {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example/);
    
  } finally {
    await context.tracing.stop({
      path: `test-results/trace-${testInfo.title}-light.trace`,
    });
  }
});

test('ex8: selective trace - full debug info', async ({ page, context }, testInfo) => {
  // Heavy tracing: everything for detailed debugging
  await context.tracing.start({
    screenshots: true,
    snapshots: true,   // Include DOM
    sources: true,     // Include source code
  });

  try {
    await page.goto('https://example.com');
    
    // Log some information
    const pageTitle = await page.title();
    console.log('Page title:', pageTitle);
    
    await expect(page).toHaveTitle(/Example/);
    
  } finally {
    await context.tracing.stop({
      path: `test-results/trace-${testInfo.title}-full.trace`,
    });
  }
});

// ============================================================================
// EXAMPLE 9: Trace with Network Inspection
// ============================================================================
test('ex9: trace with network logging', async ({ page, context }, testInfo) => {
  await context.tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true,
  });

  // Log network requests
  page.on('request', request => {
    console.log(`📤 Request: ${request.method()} ${request.url()}`);
  });

  page.on('response', response => {
    console.log(`📥 Response: ${response.status()} ${response.url()}`);
  });

  try {
    await page.goto('https://example.com');
    
    // All network activity will be logged AND captured in trace
    await expect(page).toHaveTitle(/Example/);
    
  } finally {
    await context.tracing.stop({
      path: `test-results/trace-${testInfo.title}.trace`,
    });
  }
});

// ============================================================================
// EXAMPLE 10: Trace Duration and Performance
// ============================================================================
test('ex10: measure and trace performance', async ({ page, context }, testInfo) => {
  const startTime = Date.now();
  
  await context.tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true,
  });

  try {
    // Measure navigation time
    const navStart = Date.now();
    await page.goto('https://example.com');
    const navDuration = Date.now() - navStart;
    console.log(`⏱️ Navigation took: ${navDuration}ms`);
    
    // Measure load time
    const loadStart = Date.now();
    await page.waitForLoadState('networkidle');
    const loadDuration = Date.now() - loadStart;
    console.log(`⏱️ Page load took: ${loadDuration}ms`);
    
    await expect(page).toHaveTitle(/Example/);
    
    const totalDuration = Date.now() - startTime;
    console.log(`⏱️ Total test time: ${totalDuration}ms`);
    
  } finally {
    await context.tracing.stop({
      path: `test-results/trace-${testInfo.title}.trace`,
    });
  }
});

// ============================================================================
// EXAMPLE 11: Trace with Console Message Capture
// ============================================================================
test('ex11: trace console messages', async ({ page, context }, testInfo) => {
  const consoleLogs: string[] = [];
  
  // Capture all console messages
  page.on('console', msg => {
    consoleLogs.push(`[${msg.type().toUpperCase()}] ${msg.text()}`);
    console.log(`🔹 Console: ${msg.text()}`);
  });

  await context.tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true,
  });

  try {
    await page.goto('https://example.com');
    
    // Trigger some console output
    await page.evaluate(() => {
      console.log('Test message from page');
      console.warn('Test warning from page');
    });
    
    console.log('Captured console logs:', consoleLogs);
    
  } finally {
    await context.tracing.stop({
      path: `test-results/trace-${testInfo.title}.trace`,
    });
  }
});

// ============================================================================
// EXAMPLE 12: Retry with Separate Traces
// ============================================================================
test('ex12: flaky test with per-retry traces', async ({ page, context }, testInfo) => {
  // This test might fail sometimes - each retry gets its own trace
  
  await context.tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true,
  });

  try {
    await page.goto('https://example.com');
    
    // Simulate potential flakiness
    const randomFail = Math.random() < 0.1; // 10% chance of failure
    
    if (randomFail && testInfo.retry < 2) {
      throw new Error('Simulated flaky failure');
    }
    
    await expect(page).toHaveTitle(/Example/);
    console.log(`✓ Passed on attempt ${testInfo.retry + 1}`);
    
  } finally {
    const traceFile = `test-results/trace-${testInfo.title}-retry${testInfo.retry}.trace`;
    await context.tracing.stop({ path: traceFile });
    console.log(`Trace saved: ${traceFile}`);
  }
});

/**
 * COMMANDS TO RUN THESE EXAMPLES:
 * ================================
 * 
 * 1. Run all examples:
 *    npx playwright test pw_15_1_traceviewer.spec.ts
 * 
 * 2. Run specific example:
 *    npx playwright test -g "ex1: basic trace"
 * 
 * 3. View generated traces:
 *    npx playwright show-trace ./test-results
 * 
 * 4. Run with verbose output:
 *    npx playwright test pw_15_1_traceviewer.spec.ts --verbose
 * 
 * 5. Run and view HTML report:
 *    npx playwright test pw_15_1_traceviewer.spec.ts
 *    npx playwright show-report
 * 
 * TRACE FILE LOCATIONS:
 * =====================
 * After running tests, check:
 * - test-results/ folder for .trace files
 * - Each file corresponds to a test
 * - File size depends on recording features
 * 
 * VIEWING TRACES:
 * ===============
 * npx playwright show-trace test-results/trace-*.trace
 * 
 * This opens an interactive UI where you can:
 * ✓ Scrub through test execution timeline
 * ✓ View screenshots at each step
 * ✓ Inspect DOM state (HTML snapshots)
 * ✓ See all network requests/responses
 * ✓ Review console logs and errors
 * ✓ Analyze performance metrics
 */
