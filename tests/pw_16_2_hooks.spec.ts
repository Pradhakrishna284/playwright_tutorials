import { test, expect, beforeAll, afterAll, beforeEach, afterEach } from '@playwright/test';

// ============================================
// EXAMPLE 1: Basic beforeEach & afterEach
// ============================================

test.describe('Example 1: Login Tests - Basic Hooks', () => {
  let username: string;
  let password: string;

  // Runs BEFORE each test
  beforeEach(async ({ page }) => {
    console.log('beforeEach: Navigating to login page...');
    username = 'student@example.com';
    password = 'password123';

    await page.goto('https://testautomationpractice.blogspot.com/');
    console.log('beforeEach: Navigation complete');
  });

  // Runs AFTER each test
  afterEach(async ({ page }) => {
    console.log('afterEach: Cleaning up...');
    // Clear cookies
    await page.context().clearCookies();
    // Clear local storage
    await page.evaluate(() => localStorage.clear());
    console.log('afterEach: Cleanup complete');
  });

  test('Test 1: Verify page title', async ({ page }) => {
    console.log('TEST 1: Checking page title');
    const title = await page.title();
    expect(title).toBeTruthy();
    console.log(`Page title: ${title}`);
  });

  test('Test 2: Verify page URL', async ({ page }) => {
    console.log('TEST 2: Checking page URL');
    const url = page.url();
    expect(url).toContain('testautomationpractice');
    console.log(`Page URL: ${url}`);
  });
});

// ============================================
// EXAMPLE 2: beforeAll & afterAll
// ============================================

test.describe('Example 2: Database Setup - beforeAll & afterAll', () => {
  let testUserId: string;
  let testEmail: string;

  // Runs ONCE before ALL tests
  beforeAll(async () => {
    console.log('beforeAll: Setting up test database...');
    // Simulate creating a test user
    testUserId = 'USER-' + Date.now();
    testEmail = `testuser-${Date.now()}@example.com`;
    console.log(`beforeAll: Created test user - ID: ${testUserId}, Email: ${testEmail}`);
    // In real scenario: await db.users.create({ id: testUserId, email: testEmail });
  });

  // Runs ONCE after ALL tests
  afterAll(async () => {
    console.log('afterAll: Cleaning up test database...');
    // Simulate deleting test user
    console.log(`afterAll: Deleted test user - ID: ${testUserId}`);
    // In real scenario: await db.users.delete(testUserId);
  });

  test('Test 1: User profile is created', async ({ page }) => {
    console.log(`TEST 1: Using user ID: ${testUserId}`);
    // Navigate to a page and verify user data
    await page.goto('https://testautomationpractice.blogspot.com/');
    expect(testUserId).toBeTruthy();
    console.log('User profile verified');
  });

  test('Test 2: User email is stored', async ({ page }) => {
    console.log(`TEST 2: Using email: ${testEmail}`);
    // Verify email is correct
    expect(testEmail).toContain('@example.com');
    console.log('User email verified');
  });

  test('Test 3: User can login', async ({ page }) => {
    console.log(`TEST 3: Testing login for user: ${testUserId}`);
    // Simulate login test
    expect(testUserId).toEqual(expect.stringContaining('USER-'));
    console.log('Login test passed');
  });
});

// ============================================
// EXAMPLE 3: Multiple beforeEach Hooks
// ============================================

test.describe('Example 3: E-Commerce - Multiple beforeEach Hooks', () => {
  let page_var: any;

  // First beforeEach - Navigate to home
  beforeEach(async ({ page }) => {
    console.log('beforeEach HOOK 1: Navigating to home page');
    await page.goto('https://testautomationpractice.blogspot.com/');
    page_var = page;
  });

  // Second beforeEach - Search for product
  beforeEach(async ({ page }) => {
    console.log('beforeEach HOOK 2: Searching for products');
    // In real scenario: await page.fill('[name="search"]', 'laptop');
    console.log('beforeEach HOOK 2: Search initialized');
  });

  // Third beforeEach - Add to cart preparation
  beforeEach(async ({ page }) => {
    console.log('beforeEach HOOK 3: Preparing cart');
    // In real scenario: await page.click('[data-add-to-cart]');
    console.log('beforeEach HOOK 3: Cart ready');
  });

  afterEach(async ({ page }) => {
    console.log('afterEach: Removing product from cart');
    // In real scenario: await page.click('[data-clear-cart]');
  });

  test('Test 1: Product is visible', async ({ page }) => {
    console.log('TEST 1: Checking if product is visible');
    // Verify page loaded
    const title = await page.title();
    expect(title).toBeTruthy();
    console.log('Product visibility verified');
  });

  test('Test 2: Cart count is updated', async ({ page }) => {
    console.log('TEST 2: Checking cart count');
    // Simulate cart count check
    const url = page.url();
    expect(url).toContain('blogspot');
    console.log('Cart count verified');
  });
});

// ============================================
// EXAMPLE 4: Nested Describe with Different Hooks
// ============================================

test.describe('Example 4: Shopping Flow - Nested Describe Blocks', () => {
  let sessionId: string;

  // This beforeAll runs for the entire describe block
  beforeAll(async () => {
    console.log('beforeAll: Creating session for all tests');
    sessionId = 'SESSION-' + Date.now();
    console.log(`beforeAll: Session created - ${sessionId}`);
  });

  // ===== PRODUCT CATALOG SUITE =====
  test.describe('Product Catalog', () => {
    beforeEach(async ({ page }) => {
      console.log(`[Catalog] beforeEach: Navigating to catalog (Session: ${sessionId})`);
      await page.goto('https://testautomationpractice.blogspot.com/');
    });

    afterEach(async ({ page }) => {
      console.log('[Catalog] afterEach: Closing catalog');
      // Any catalog-specific cleanup
    });

    test('Catalog Test 1: View products', async ({ page }) => {
      console.log(`[Catalog] TEST 1: Viewing products`);
      const url = page.url();
      expect(url).toBeTruthy();
    });

    test('Catalog Test 2: Filter products', async ({ page }) => {
      console.log(`[Catalog] TEST 2: Filtering products`);
      const title = await page.title();
      expect(title).toBeTruthy();
    });
  });

  // ===== SHOPPING CART SUITE =====
  test.describe('Shopping Cart', () => {
    beforeEach(async ({ page }) => {
      console.log(`[Cart] beforeEach: Initializing cart (Session: ${sessionId})`);
      await page.goto('https://testautomationpractice.blogspot.com/');
    });

    afterEach(async ({ page }) => {
      console.log('[Cart] afterEach: Clearing cart');
      // Cart-specific cleanup
    });

    test('Cart Test 1: Add to cart', async ({ page }) => {
      console.log(`[Cart] TEST 1: Adding item to cart`);
      const url = page.url();
      expect(url).toBeTruthy();
    });

    test('Cart Test 2: View cart', async ({ page }) => {
      console.log(`[Cart] TEST 2: Viewing cart`);
      // Simulate cart view
      expect(sessionId).toContain('SESSION-');
    });
  });

  afterAll(async () => {
    console.log('afterAll: Destroying session');
    console.log(`afterAll: Session deleted - ${sessionId}`);
  });
});

// ============================================
// EXAMPLE 5: Conditional Hooks Based on Browser
// ============================================

test.describe('Example 5: Browser-Specific Hooks', () => {
  beforeEach(async ({ page, browserName }) => {
    console.log(`beforeEach: Running on browser: ${browserName}`);

    await page.goto('https://testautomationpractice.blogspot.com/');

    // Different actions based on browser
    if (browserName === 'chromium') {
      console.log('beforeEach: Chromium-specific setup');
      // Chromium-specific setup
    } else if (browserName === 'firefox') {
      console.log('beforeEach: Firefox-specific setup');
      // Firefox-specific setup
    } else if (browserName === 'webkit') {
      console.log('beforeEach: WebKit-specific setup');
      // WebKit-specific setup
    }
  });

  test('Test on all browsers', async ({ page, browserName }) => {
    console.log(`TEST: Running on ${browserName}`);
    const title = await page.title();
    expect(title).toBeTruthy();
  });
});

// ============================================
// EXAMPLE 6: Error Handling in Hooks
// ============================================

test.describe('Example 6: Hooks with Error Handling', () => {
  beforeEach(async ({ page }) => {
    try {
      console.log('beforeEach: Starting navigation');
      await page.goto('https://testautomationpractice.blogspot.com/', {
        waitUntil: 'networkidle'
      });
      console.log('beforeEach: Navigation successful');
    } catch (error) {
      console.error('beforeEach: Navigation failed', error);
      throw error; // Re-throw to fail the test
    }
  });

  afterEach(async ({ page }) => {
    try {
      console.log('afterEach: Closing resources');
      await page.context().clearCookies();
      console.log('afterEach: Resources closed successfully');
    } catch (error) {
      console.error('afterEach: Cleanup failed', error);
      // Don't re-throw in afterEach to avoid masking test failures
    }
  });

  test('Test with error handling', async ({ page }) => {
    console.log('TEST: Running test');
    expect(page).toBeTruthy();
  });
});

// ============================================
// EXAMPLE 7: Hook Execution Order Demonstration
// ============================================

test.describe('Example 7: Hook Execution Order', () => {
  beforeAll(async () => {
    console.log('>>> 1. beforeAll - Runs ONCE at the start');
  });

  beforeEach(async ({ page }) => {
    console.log('  >>> 2a. beforeEach - Before Test 1');
    await page.goto('https://testautomationpractice.blogspot.com/');
  });

  afterEach(async ({ page }) => {
    console.log('  >>> 4a. afterEach - After Test 1');
  });

  test('Test 1: First test', async ({ page }) => {
    console.log('    >>> 3a. TEST 1 - Running Test 1');
    expect(page.url()).toBeTruthy();
  });

  beforeEach(async ({ page }) => {
    console.log('  >>> 2b. beforeEach - Before Test 2');
    await page.goto('https://testautomationpractice.blogspot.com/');
  });

  afterEach(async ({ page }) => {
    console.log('  >>> 4b. afterEach - After Test 2');
  });

  test('Test 2: Second test', async ({ page }) => {
    console.log('    >>> 3b. TEST 2 - Running Test 2');
    expect(page.url()).toBeTruthy();
  });

  afterAll(async () => {
    console.log('>>> 5. afterAll - Runs ONCE at the end');
  });
});

/*
EXECUTION OUTPUT ORDER:
>>> 1. beforeAll - Runs ONCE at the start
  >>> 2a. beforeEach - Before Test 1
    >>> 3a. TEST 1 - Running Test 1
  >>> 4a. afterEach - After Test 1
  >>> 2b. beforeEach - Before Test 2
    >>> 3b. TEST 2 - Running Test 2
  >>> 4b. afterEach - After Test 2
>>> 5. afterAll - Runs ONCE at the end
*/
