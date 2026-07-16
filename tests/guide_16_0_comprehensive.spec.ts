import { test, expect } from '@playwright/test';

/**
 * COMPREHENSIVE GUIDE: Grouping, Hooks, Annotations, and Tagging
 * This spec file demonstrates all four concepts using the tag property
 */

// ============================================================================
// GROUPING & HOOKS - Basic Structure with beforeAll, afterAll, beforeEach, afterEach
// ============================================================================

test.describe('User Registration - Comprehensive Test Suite', () => {
  let baseURL: string;

  // Global setup before all tests in this describe block
  test.beforeAll(async () => {
    baseURL = 'https://example.com';
    console.log('🚀 Starting test suite - Setting up base URL:', baseURL);
  });

  // Global teardown after all tests in this describe block
  test.afterAll(async () => {
    console.log('✅ Completed test suite - Cleaning up resources');
  });

  // ========================================================================
  // GROUPING & HOOKS - Nested describe blocks with beforeEach/afterEach
  // Uses tag property for tagging
  // ========================================================================

  test.describe('Valid Registration Cases', { tag: '@smoke' }, () => {

    // Setup before each test in this group
    test.beforeEach(async ({ page }) => {
      await page.goto('https://playwright.dev');
      console.log('📄 Before each test: Navigated to page');
    });

    // Teardown after each test in this group
    test.afterEach(async ({ page }) => {
      console.log('🧹 After each test: Cleaning up page state');
      await page.close();
    });

    // =====================================================================
    // Test with single tag
    // =====================================================================
    test('User can register with valid email', async ({ page }) => {
      expect(page.url()).toContain('playwright');
    });

    // =====================================================================
    // Test with fixme annotation and tag
    // =====================================================================
    test.fixme('User receives confirmation email', async ({ page }) => {
      // This test is marked as needs fixing and will be skipped
      expect(false).toBe(true);
    });

    // =====================================================================
    // Test with skip annotation
    // =====================================================================
    test.skip('User profile auto-populates from email', async ({ page }) => {
      // This test is skipped
      expect(true).toBe(true);
    });

    // =====================================================================
    // Test.only - Only this test runs (if uncommented)
    // =====================================================================
    // test.only('User password strength validated', async ({ page }) => {
    //   expect(true).toBe(true);
    // });
  });

  // ========================================================================
  // Nested Group with Different Tag
  // ========================================================================
  test.describe('Invalid Registration Cases', { tag: '@regression' }, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('https://playwright.dev');
      console.log('Before each: Navigated to registration form');
    });

    test.afterEach(async ({ page }) => {
      console.log('After each: Validating error messages displayed');
    });

    test('Reject registration with empty email', async ({ page }) => {
      expect(page.url()).toBeTruthy();
    });

    // =====================================================================
    // Test with multiple tags
    // =====================================================================
    test('Reject password with less than 8 characters', { tag: '@critical' }, async ({ page }) => {
      expect(page.url()).toBeTruthy();
    });
  });

  // ========================================================================
  // Performance Tests Group
  // ========================================================================
  test.describe('Performance Tests', { tag: '@performance' }, () => {
    test('Page load time under 2 seconds', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('https://playwright.dev');
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(2000);
    });
  });
});

// ============================================================================
// INDEPENDENT GROUPING without nesting
// ============================================================================

test.describe('Search Functionality', { tag: '@feature' }, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://playwright.dev');
  });

  test('User can search for documentation', { tag: '@smoke' }, async ({ page }) => {
    expect(page.url()).toContain('playwright');
  });

  test('Search returns relevant results', { tag: '@regression' }, async ({ page }) => {
    expect(page.url()).toContain('playwright');
  });

  // =====================================================================
  // Test with multiple tags using array
  // =====================================================================
  test('Search handles special characters', { tag: ['@critical', '@smoke'] }, async ({ page }) => {
    expect(page.url()).toContain('playwright');
  });
});

// ============================================================================
// ANNOTATIONS with test metadata
// ============================================================================

test.describe('Advanced Annotations Examples', () => {
  // Using test.describe.configure() to set timeout
  test.describe.configure({
    timeout: 10000,
  });

  test('Long running test with extended timeout', { tag: '@slow' }, async ({ page }) => {
    // Timeout is set to 10 seconds for this suite
    await page.goto('https://playwright.dev');
    expect(page.url()).toBeTruthy();
  });

  // =====================================================================
  // Test with multiple tags for flexible filtering
  // =====================================================================
  test('Multi-tagged test', { tag: ['@smoke', '@regression', '@critical'] }, async ({ page }) => {
    // This test has multiple tags and can be run with any of them:
    // npx playwright test --grep "@smoke|@regression|@critical"
    await page.goto('https://playwright.dev');
    expect(page.url()).toBeTruthy();
  });

  // =====================================================================
  // Skip with condition
  // =====================================================================
  test('Skip on Windows', { tag: '@windows-skip' }, async ({ page }) => {
    if (process.platform === 'win32') {
      test.skip();
    }
    await page.goto('https://playwright.dev');
    expect(page.url()).toBeTruthy();
  });

  // =====================================================================
  // Fixme with condition
  // =====================================================================
  test.fixme('Needs fixing on Linux', { tag: '@linux-fixme' }, async ({ page }) => {
    if (process.platform === 'linux') {
      test.fixme();
    }
    await page.goto('https://playwright.dev');
    expect(false).toBe(true);
  });
});

// ============================================================================
// Complex Nesting: 3-level grouping with hooks at each level
// ============================================================================

test.describe('E-Commerce Platform', { tag: '@ecommerce' }, () => {
  test.beforeAll(async () => {
    console.log('Setting up E-Commerce test environment');
  });

  test.describe('Shopping Cart', { tag: '@cart' }, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('https://playwright.dev');
    });

    test.describe('Add to Cart', { tag: '@smoke' }, () => {
      test.beforeEach(async ({ page }) => {
        console.log('Preparing cart for addition tests');
      });

      test('User adds single item', async ({ page }) => {
        expect(page.url()).toContain('playwright');
      });

      test('User adds multiple items', { tag: '@regression' }, async ({ page }) => {
        expect(page.url()).toContain('playwright');
      });
    });

    test.describe('Remove from Cart', { tag: '@regression' }, () => {
      test.beforeEach(async ({ page }) => {
        console.log('Preparing items for removal tests');
      });

      test('User removes item from cart', async ({ page }) => {
        expect(page.url()).toContain('playwright');
      });

      test.skip('User clears entire cart', async ({ page }) => {
        expect(page.url()).toContain('playwright');
      });
    });
  });

  test.describe('Checkout Process', { tag: '@checkout' }, () => {
    test.beforeEach(async ({ page }) => {
      console.log('Navigating to checkout');
      await page.goto('https://playwright.dev');
    });

    test('User completes payment', { tag: ['@critical', '@smoke'] }, async ({ page }) => {
      expect(page.url()).toContain('playwright');
    });

    test.fixme('User receives order confirmation', { tag: '@critical' }, async ({ page }) => {
      expect(false).toBe(true);
    });
  });
});

// ============================================================================
// Running these tests with tag filtering:
// ============================================================================
/*

// Run all tests
npx playwright test guide_16_0_comprehensive.spec.ts

// Run only @smoke tests
npx playwright test guide_16_0_comprehensive.spec.ts --grep "@smoke"

// Run @regression tests
npx playwright test guide_16_0_comprehensive.spec.ts --grep "@regression"

// Run @critical tests
npx playwright test guide_16_0_comprehensive.spec.ts --grep "@critical"

// Run tests matching multiple tags
npx playwright test guide_16_0_comprehensive.spec.ts --grep "@smoke|@regression"

// Run tests excluding specific tags
npx playwright test guide_16_0_comprehensive.spec.ts --grep "(?!@slow)"

// Run only specific describe block
npx playwright test guide_16_0_comprehensive.spec.ts --grep "User Registration"

// Run with verbose output to see hook execution
npx playwright test guide_16_0_comprehensive.spec.ts --reporter=list

// Run in UI mode to see all hooks and tags
npx playwright test guide_16_0_comprehensive.spec.ts --ui

// List tests with their tags
npx playwright test guide_16_0_comprehensive.spec.ts --list

*/
