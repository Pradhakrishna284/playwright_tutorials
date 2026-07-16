/**
 * PARALLELISM & PARALLEL TESTING IN PLAYWRIGHT
 * 
 * This guide demonstrates:
 * 1. Basic parallel test execution
 * 2. Test isolation techniques
 * 3. Handling shared resources
 * 4. Performance optimization
 * 5. Common pitfalls and solutions
 */

import { test, expect, devices } from '@playwright/test';
import { Page, BrowserContext } from '@playwright/test';

// ============================================================================
// EXAMPLE 1: BASIC PARALLEL TESTS - INDEPENDENT TESTS
// ============================================================================

test.describe('Basic Parallel Tests', () => {
  
  test('test 1: verify page title', async ({ page }) => {
    // Each test runs in its own context
    await page.goto('https://example.com');
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test('test 2: verify page heading', async ({ page }) => {
    // This can run at the same time as test 1
    await page.goto('https://example.com');
    const heading = await page.locator('h1').first();
    expect(heading).toBeDefined();
  });

  test('test 3: verify links exist', async ({ page }) => {
    // This can run in parallel with tests 1 and 2
    await page.goto('https://example.com');
    const links = await page.locator('a');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });
});

// ============================================================================
// EXAMPLE 2: TEST ISOLATION USING UNIQUE DATA
// ============================================================================

test.describe('Test Isolation with Unique Data', () => {
  
  // ✅ GOOD: Each test uses unique identifiers
  test('create user with unique email', async ({ page }) => {
    const uniqueEmail = `user-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`;
    
    // Navigate to signup
    await page.goto('https://example.com/signup');
    
    // Fill form with unique data
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Verify unique user was created
    expect(page.url()).toContain('success');
  });

  test('create another user with unique email', async ({ page }) => {
    // Each test gets its own unique identifier
    const uniqueEmail = `user-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`;
    
    await page.goto('https://example.com/signup');
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    expect(page.url()).toContain('success');
  });
});

// ============================================================================
// EXAMPLE 3: ANTI-PATTERNS - WHAT NOT TO DO
// ============================================================================

test.describe('Anti-patterns to AVOID', () => {
  
  // ❌ BAD: Global counter - shared state causes race conditions
  let globalCounter = 0;
  
  test.skip('BAD: using global state', async ({ page }) => {
    // This causes race conditions in parallel execution
    globalCounter++;
    // Multiple tests might increment at the same time
    // Result is unpredictable
  });

  // ❌ BAD: Hard-coded usernames that might conflict
  test.skip('BAD: hard-coded data in parallel tests', async ({ page }) => {
    const username = 'testuser';  // Multiple tests use same username
    // Conflicts when tests run in parallel
  });

  // ❌ BAD: Using system time without uniqueness
  test.skip('BAD: insufficient uniqueness', async ({ page }) => {
    const timestamp = new Date().toISOString().split('T')[0];
    // Multiple tests running simultaneously might get same timestamp
  });
});

// ============================================================================
// EXAMPLE 4: USING FIXTURES FOR ISOLATION
// ============================================================================

// Create a custom fixture for authenticated page
const test_authenticated = test.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ page }, use) => {
    // Setup: Run before the test
    console.log(`Setting up authenticated page for test`);
    await page.goto('https://example.com/login');
    
    // Use unique credentials per test
    const uniqueUserId = `${Date.now()}-${Math.random()}`;
    await page.fill('input[name="username"]', `user-${uniqueUserId}`);
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    
    // Wait for authentication to complete
    await page.waitForURL('**/dashboard');
    
    // Use the fixture in the test
    await use(page);
    
    // Cleanup: Run after the test
    console.log(`Cleaning up authenticated page`);
    await page.goto('https://example.com/logout');
  },
});

test_authenticated.describe('Using Custom Fixtures', () => {
  
  test_authenticated('authenticated test 1', async ({ authenticatedPage }) => {
    // Page is already authenticated, unique per test
    expect(authenticatedPage.url()).toContain('dashboard');
  });

  test_authenticated('authenticated test 2', async ({ authenticatedPage }) => {
    // Each test gets its own authenticated page
    expect(authenticatedPage.url()).toContain('dashboard');
  });
});

// ============================================================================
// EXAMPLE 5: HANDLING SHARED RESOURCES
// ============================================================================

test.describe('Handling Shared Resources', () => {
  
  // Pattern 1: Use database transactions that rollback
  test('transaction rollback - test 1', async ({ page, request }) => {
    // Simulate database operation in transaction
    const testId = Date.now();
    
    // In real scenario: BEGIN TRANSACTION
    const response = await request.get(`https://api.example.com/insert?id=${testId}&name=Test1`);
    
    // Perform assertion
    expect(response.status()).toBe(200);
    
    // In real scenario: ROLLBACK TRANSACTION
  });

  test('transaction rollback - test 2', async ({ page, request }) => {
    // Each test gets its own transaction
    const testId = Date.now();
    const response = await request.get(`https://api.example.com/insert?id=${testId}&name=Test2`);
    expect(response.status()).toBe(200);
  });

  // Pattern 2: Use separate test data per worker
  test('worker-specific data', async ({ page }, testInfo) => {
    // testInfo contains worker information
    const workerId = testInfo.workerIndex;
    const testDataDb = `test_db_worker_${workerId}`;
    
    console.log(`Test running on worker ${workerId}`);
    console.log(`Using database: ${testDataDb}`);
    
    // Use worker-specific resources
    expect(workerId).toBeGreaterThanOrEqual(0);
  });

  // Pattern 3: Port allocation for servers
  test('dynamic port allocation', async ({ page }, testInfo) => {
    // Avoid hardcoded ports
    const basePort = 3000;
    const workerId = testInfo.workerIndex;
    const testPort = basePort + (workerId * 1000);
    
    console.log(`Test using port: ${testPort}`);
    
    // Start server on unique port
    expect(testPort).toBeGreaterThan(basePort);
  });
});

// ============================================================================
// EXAMPLE 6: SETUP AND TEARDOWN FOR PARALLEL TESTS
// ============================================================================

test.describe('Setup and Teardown Pattern', () => {
  
  test.beforeEach(async ({ page }, testInfo) => {
    // This runs BEFORE each test
    console.log(`[Worker ${testInfo.workerIndex}] Setting up for test: ${testInfo.title}`);
    
    // Create unique test context
    const uniqueTestId = `test-${Date.now()}-${testInfo.testId}`;
    
    // Store in page context for use in test
    (page as any).testId = uniqueTestId;
  });

  test.afterEach(async ({ page }, testInfo) => {
    // This runs AFTER each test (cleanup)
    console.log(`[Worker ${testInfo.workerIndex}] Cleaning up after test: ${testInfo.title}`);
    
    // Clear test data
    const testId = (page as any).testId;
    console.log(`Cleaning up test: ${testId}`);
  });

  test('test with setup/teardown 1', async ({ page }) => {
    const testId = (page as any).testId;
    console.log(`Test 1 using: ${testId}`);
    expect(testId).toBeDefined();
  });

  test('test with setup/teardown 2', async ({ page }) => {
    const testId = (page as any).testId;
    console.log(`Test 2 using: ${testId}`);
    expect(testId).toBeDefined();
  });
});

// ============================================================================
// EXAMPLE 7: SEQUENTIAL TESTS (WHEN NEEDED)
// ============================================================================

// Tag tests that must run serially
test.describe('Sequential Tests - Using Tags', () => {
  
  test('sequential test 1 @serial', async ({ page }) => {
    // Tests tagged with @serial should run with --workers=1
    await page.goto('https://example.com');
    expect(page.url()).toContain('example.com');
  });

  test('sequential test 2 @serial', async ({ page }) => {
    // This test will wait for the previous one to complete
    await page.goto('https://example.com');
    expect(page.url()).toContain('example.com');
  });
  
  // Usage: npx playwright test --grep @serial --workers=1
});

// ============================================================================
// EXAMPLE 8: CROSS-BROWSER PARALLEL TESTING
// ============================================================================

// This would be in playwright.config.ts, but shown here for reference
/*
projects: [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] },
  },
  {
    name: 'webkit',
    use: { ...devices['Desktop Safari'] },
  },
],
*/

test.describe('Cross-Browser Tests (runs in parallel across browsers)', () => {
  
  test('homepage loads in all browsers', async ({ page, browserName }) => {
    // This test runs on all configured browsers in parallel
    console.log(`Testing on: ${browserName}`);
    
    await page.goto('https://example.com');
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test('form submission in all browsers', async ({ page, browserName }) => {
    // Also runs on all configured browsers
    console.log(`Testing form on: ${browserName}`);
    
    await page.goto('https://example.com');
    const form = await page.locator('form');
    expect(form).toBeDefined();
  });
});

// ============================================================================
// EXAMPLE 9: MONITORING PARALLEL EXECUTION
// ============================================================================

test.describe('Monitoring Parallel Execution', () => {
  
  test('log worker information', async ({ page }, testInfo) => {
    // Access information about test execution
    console.log(`
      Worker Index: ${testInfo.workerIndex}
      Test Title: ${testInfo.title}
      Test File: ${testInfo.file}
      Test ID: ${testInfo.testId}
      Repeat Index: ${testInfo.repeatEachIndex}
      Project: ${testInfo.project.name}
    `);
    
    expect(testInfo.workerIndex).toBeGreaterThanOrEqual(0);
  });

  test('measure test execution time', async ({ page }, testInfo) => {
    const startTime = Date.now();
    
    await page.goto('https://example.com');
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`Test executed in ${duration}ms on worker ${testInfo.workerIndex}`);
    expect(duration).toBeGreaterThan(0);
  });
});

// ============================================================================
// EXAMPLE 10: AVOIDING RACE CONDITIONS
// ============================================================================

test.describe('Avoiding Race Conditions', () => {
  
  // ✅ GOOD: Wait for specific condition
  test('wait for element before interaction', async ({ page }) => {
    await page.goto('https://example.com');
    
    // Wait for button to be visible
    await page.waitForSelector('button.submit');
    
    // Then interact
    await page.click('button.submit');
  });

  // ✅ GOOD: Use unique selectors
  test('use unique data attributes', async ({ page }) => {
    const uniqueId = `test-${Date.now()}`;
    
    await page.goto('https://example.com');
    
    // Use data attribute with unique ID
    await page.fill(`input[data-testid="${uniqueId}"]`, 'value');
  });

  // ✅ GOOD: Use explicit waits
  test('explicit wait for navigation', async ({ page }) => {
    await page.goto('https://example.com/form');
    
    const responsePromise = page.waitForResponse(
      response => response.url().includes('/submit') && response.status() === 200
    );
    
    await page.click('button[type="submit"]');
    
    const response = await responsePromise;
    expect(response.status()).toBe(200);
  });

  // ✅ GOOD: Unique identifiers for assertions
  test('verify unique data was created', async ({ page }) => {
    const uniqueName = `item-${Date.now()}`;
    
    await page.goto('https://example.com/create');
    await page.fill('input[name="itemName"]', uniqueName);
    await page.click('button[type="submit"]');
    
    // Navigate to list and verify unique item
    await page.goto('https://example.com/items');
    await page.waitForSelector(`text=${uniqueName}`);
    expect(page.locator(`text=${uniqueName}`)).toBeDefined();
  });
});

// ============================================================================
// EXAMPLE 11: PERFORMANCE OPTIMIZATION
// ============================================================================

test.describe('Performance Optimization in Parallel', () => {
  
  // Pattern 1: Reuse connections
  test('connection pooling', async ({ page, request }) => {
    // Don't create new connections for each test
    const uniqueId = Date.now();
    
    // Use persistent connection
    const response = await request.get(`https://example.com/api/user/${uniqueId}`);
    
    expect(response.status()).toBe(200);
  });

  // Pattern 2: Parallel API calls
  test('parallel API requests', async ({ page, request }) => {
    const userId = Date.now();
    
    // Make multiple requests in parallel
    const requests = [
      request.get('https://api.example.com/user/1'),
      request.get('https://api.example.com/user/2'),
      request.get('https://api.example.com/user/3'),
    ];
    
    const responses = await Promise.all(requests);
    
    responses.forEach(response => {
      expect(response.status()).toBeLessThanOrEqual(404); // Some may not exist
    });
  });

  // Pattern 3: Minimize setup overhead
  test('minimal setup for speed', async ({ page }) => {
    // Only setup what's needed for this test
    await page.goto('https://example.com');
    
    // Avoid unnecessary waits
    const element = await page.locator('body').first();
    expect(element).toBeDefined();
  });
});

// ============================================================================
// EXAMPLE 12: REAL-WORLD PARALLEL TEST SCENARIO
// ============================================================================

test.describe('Real-World Scenario: E-Commerce Testing', () => {
  
  const createUniqueCart = () => ({
    cartId: `cart-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    userId: `user-${Date.now()}-${Math.random().toString(36).substring(7)}`,
  });

  test('user 1 adds item to cart', async ({ page }) => {
    const cart = createUniqueCart();
    
    await page.goto('https://shop.example.com');
    await page.fill('input[name="userId"]', cart.userId);
    await page.fill('input[name="cartId"]', cart.cartId);
    await page.click('button:has-text("Add to Cart")');
    
    // Verify item added to unique cart
    expect(page.url()).toContain(cart.cartId);
  });

  test('user 2 adds different item to cart', async ({ page }) => {
    // Completely different user and cart
    const cart = createUniqueCart();
    
    await page.goto('https://shop.example.com');
    await page.fill('input[name="userId"]', cart.userId);
    await page.fill('input[name="cartId"]', cart.cartId);
    await page.click('button:has-text("Add to Cart")');
    
    expect(page.url()).toContain(cart.cartId);
  });

  test('user 3 completes checkout', async ({ page }) => {
    const cart = createUniqueCart();
    
    await page.goto('https://shop.example.com');
    await page.fill('input[name="userId"]', cart.userId);
    await page.fill('input[name="cartId"]', cart.cartId);
    await page.click('button:has-text("Add to Cart")');
    await page.click('button:has-text("Checkout")');
    await page.fill('input[name="email"]', `user-${Date.now()}@example.com`);
    await page.click('button:has-text("Complete Purchase")');
    
    // Verify successful checkout
    expect(page.url()).toContain('success');
  });
  
  // Run with: npx playwright test --workers=4
  // All three tests run in parallel with different carts and users
});

// ============================================================================
// SUMMARY OF KEY CONCEPTS
// ============================================================================

/*
KEY POINTS ABOUT PARALLELISM:

1. DEFAULT BEHAVIOR:
   - Tests in same file run sequentially by default
   - Different files run in parallel across workers
   - Use fullyParallel: true for all tests to run in parallel

2. WORKER MANAGEMENT:
   - Each worker is an independent process
   - Default = number of CPU cores
   - Can configure in playwright.config.ts

3. ISOLATION:
   - Each test should use unique identifiers
   - Use timestamps + random numbers
   - Create fixtures for shared setup

4. BEST PRACTICES:
   ✅ Use unique data per test (Date.now(), Math.random())
   ✅ Create fixtures for authentication/setup
   ✅ Use beforeEach/afterEach for cleanup
   ✅ Wait for specific conditions (waitForSelector, waitForResponse)
   ✅ Use testInfo for worker information

5. ANTI-PATTERNS (DON'T DO):
   ❌ Use global state/counters
   ❌ Hardcode usernames or emails
   ❌ Rely on specific test execution order
   ❌ Share database records between tests
   ❌ Use same port numbers for all tests

6. PERFORMANCE:
   - Parallel tests 75-90% faster than serial
   - Each worker uses ~50-100MB memory
   - Optimal workers = CPU cores × 2 for I/O-heavy tests
   - Monitor actual vs expected test duration

7. CROSS-BROWSER:
   - Tests run on all configured browsers in parallel
   - Projects defined in playwright.config.ts
   - Same test code, different browser instances

8. TROUBLESHOOTING:
   - Check for race conditions with unique data
   - Monitor memory usage
   - Use --workers=1 for serial execution
   - Check test timing with testInfo

COMMAND EXAMPLES:
npx playwright test                    // Run with default workers
npx playwright test --workers=8        // Run with 8 workers
npx playwright test --workers=1        // Run serially
npx playwright test --debug            // Debug mode (single worker)
npx playwright test --grep @serial --workers=1  // Run tagged tests serially
npx playwright test --headed           // Run in headed mode
npx playwright test tests/login.spec.ts // Run specific file
*/
