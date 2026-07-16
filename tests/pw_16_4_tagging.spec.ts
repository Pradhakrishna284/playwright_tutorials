// https://www.youtube.com/watch?v=KDpR5hDtZUw&list=PLUDwpEzHYYLtvMVjc-Va3RXLKtdB-ofc2&index=16

import { test, expect } from '@playwright/test';

// ============================================
// BASIC TAGGING EXAMPLES
// ============================================

test('Simple test with single tag @smoke', async ({ page }) => {
  await page.goto('https://playwright.dev');
  const title = await page.title();
  expect(title).toBeTruthy();
});

test('Test with multiple tags @smoke @quick @critical', async ({ page }) => {
  await page.goto('https://playwright.dev');
  const heading = page.locator('h1');
  await expect(heading).toBeVisible();
});

// ============================================
// TAG BY TEST TYPE
// ============================================

test.describe('Test Type Tags @test-types', () => {
  test('Unit test - validate email format @unit @quick', async ({ page }) => {
    // Testing a single component/function
    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    expect(isValidEmail('test@example.com')).toBeTruthy();
    expect(isValidEmail('invalid')).toBeFalsy();
  });

  test('Integration test - user registration flow @integration @slow', async ({ page }) => {
    // Testing multiple components working together
    await page.goto('https://playwright.dev');
    // Step 1: Visit page
    // Step 2: Fill form
    // Step 3: Submit
    // Step 4: Verify database
  });

  test('End-to-end test - complete user journey @e2e @critical', async ({ page }) => {
    // Testing full user workflow from start to finish
    await page.goto('https://playwright.dev');
    // User lands on page
    // User signs up
    // User logs in
    // User completes purchase
    // User receives confirmation
  });

  test('API test - GET endpoint @api @quick', async ({ page }) => {
    // Testing API endpoints
    const response = await page.request.get('https://api.example.com/users');
    expect(response.status()).toBe(200);
  });

  test('Visual regression test - button styling @visual @slow', async ({ page }) => {
    // Testing visual appearance and layout
    await page.goto('https://playwright.dev');
    // Could take screenshots and compare
  });
});

// ============================================
// TAG BY PRIORITY
// ============================================

test.describe('Priority Tags', () => {
  test('Site loads homepage @smoke @critical', async ({ page }) => {
    // Critical - core functionality, revenue impacting
    await page.goto('https://playwright.dev');
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });

  test('User profile update works @important', async ({ page }) => {
    // Important but not critical
    await page.goto('https://playwright.dev');
  });

  test('Dark mode toggle available @minor', async ({ page }) => {
    // Nice to have feature
    await page.goto('https://playwright.dev');
  });

  test('Easter egg animation plays @trivial', async ({ page }) => {
    // Low priority nice-to-have
    await page.goto('https://playwright.dev');
  });
});

// ============================================
// TAG BY EXECUTION SPEED
// ============================================

test.describe('Execution Speed Tags', () => {
  test('Email validation check @quick @smoke', async ({ page }) => {
    // Should complete in < 1 second
    const isValid = (email: string) => email.includes('@');
    expect(isValid('test@example.com')).toBeTruthy();
  });

  test('Page load and verify content @slow', async ({ page }) => {
    // Takes 3-10 seconds
    await page.goto('https://playwright.dev');
    await page.waitForLoadState('networkidle');
  });

  test('Large file upload and processing @very-slow', async ({ page }) => {
    // Takes > 30 seconds
    // Typically needs extended timeout
  });
});

// ============================================
// TAG BY FEATURE AREA
// ============================================

test.describe('Feature Area Tags', () => {
  test.describe('Authentication Feature @auth', () => {
    test('Login with email @smoke @critical', async ({ page }) => {
      await page.goto('https://playwright.dev');
      // Login steps
    });

    test('Social login with Google @auth @e2e', async ({ page }) => {
      await page.goto('https://playwright.dev');
      // Google OAuth steps
    });

    test('Password reset flow @auth @slow', async ({ page }) => {
      await page.goto('https://playwright.dev');
      // Password reset steps
    });
  });

  test.describe('Shopping Cart @shopping', () => {
    test('Add item to cart @smoke @quick', async ({ page }) => {
      await page.goto('https://playwright.dev');
      // Add to cart steps
    });

    test('Remove item from cart @shopping', async ({ page }) => {
      await page.goto('https://playwright.dev');
      // Remove item steps
    });

    test('Apply discount code @shopping @critical', async ({ page }) => {
      await page.goto('https://playwright.dev');
      // Apply coupon steps
    });
  });

  test.describe('Payment Processing @billing @payment', () => {
    test('Valid credit card transaction @e2e @critical', async ({ page }) => {
      await page.goto('https://playwright.dev');
      // Payment steps
    });

    test('Refund processing @billing @slow', async ({ page }) => {
      await page.goto('https://playwright.dev');
      // Refund steps
    });

    test('Subscription renewal @billing @critical', async ({ page }) => {
      await page.goto('https://playwright.dev');
      // Subscription steps
    });
  });
});

// ============================================
// TAG BY ENVIRONMENT
// ============================================

test.describe('Environment Tags', () => {
  test('Production feature check @prod @critical', async ({ page }) => {
    // Only run against production
    test.skip(process.env.ENVIRONMENT !== 'production', 'Only for production');
    await page.goto('https://example.com');
  });

  test('Staging-only new feature test @staging', async ({ page }) => {
    // Only test new features on staging
    test.skip(process.env.ENVIRONMENT !== 'staging', 'Staging only');
    await page.goto('https://staging.example.com');
  });

  test('Local development debugging @dev', async ({ page }) => {
    // Only run locally for debugging
    test.skip(process.env.CI === 'true', 'Local development only');
    await page.goto('http://localhost:3000');
  });
});

// ============================================
// TAG BY EXECUTION SCHEDULE
// ============================================

test.describe('Execution Schedule Tags', () => {
  test('Must run before every commit @smoke', async ({ page }) => {
    // Quick validation on every commit
    // Runs: Before git commit, on every PR
    await page.goto('https://playwright.dev');
  });

  test('Comprehensive nightly test suite @nightly', async ({ page }) => {
    // Heavy tests run once per night
    // Runs: 2 AM every day
    await page.goto('https://playwright.dev');
  });

  test('Load/stress testing @load @very-slow', async ({ page }) => {
    // Performance testing under load
    // Runs: Weekly on Wednesday
    // Requires 10+ minutes
  });

  test('Pre-deployment smoke check @smoke @pre-deploy', async ({ page }) => {
    // Final check before production release
    // Runs: Manual trigger only
    await page.goto('https://playwright.dev');
  });
});

// ============================================
// COMPLEX TAG COMBINATIONS
// ============================================

test.describe('Complex Real-World Examples', () => {
  test('Complete checkout flow @e2e @critical @payment @slow', async ({ page }) => {
    // Type: E2E test (full journey)
    // Priority: Critical (revenue)
    // Feature: Payment
    // Speed: Slow (takes 30+ seconds)
    await page.goto('https://playwright.dev');
  });

  test('Quick smoke test @smoke @quick @critical @unit', async ({ page }) => {
    // Speed: Quick (< 1 second)
    // Priority: Critical (core feature)
    // Type: Unit test
    // Use: Run on every commit
    const result = 1 + 1;
    expect(result).toBe(2);
  });

  test('API integration with database @api @integration @slow @important', async ({ page }) => {
    // Type: API + Integration
    // Priority: Important
    // Speed: Slow
    // Requires: Database connection
    const response = await page.request.get('https://api.example.com/data');
    expect(response.status()).toBe(200);
  });

  test('Admin user management @admin @e2e @critical @slow', async ({ page }) => {
    // Feature: Admin panel
    // Priority: Critical
    // Type: E2E
    // Speed: Slow
    await page.goto('https://playwright.dev');
  });
});

// ============================================
// RUNNING TESTS WITH TAGS - EXAMPLES
// ============================================

/*
COMMAND LINE EXAMPLES:

Run only smoke tests (fast feedback):
  npx playwright test --grep @smoke

Run critical tests only:
  npx playwright test --grep @critical

Run e2e tests:
  npx playwright test --grep @e2e

Run tests that are quick AND critical (AND logic):
  npx playwright test --grep "(?=.*@quick)(?=.*@critical)"

Run smoke OR quick tests (OR logic):
  npx playwright test --grep "@smoke|@quick"

Run everything EXCEPT slow tests:
  npx playwright test --grep-invert @slow

Run payment tests in Chrome only:
  npx playwright test --grep @payment --project chromium

Run nightly tests in headed mode:
  npx playwright test --grep @nightly --headed

Run specific file with payment tags:
  npx playwright test tests/checkout.spec.ts --grep @payment

Dry run - see what would run:
  npx playwright test --grep @smoke --dry-run

Show all tests with a tag:
  npx playwright test --grep @critical --reporter=list
*/

// ============================================
// CONDITIONAL TAGGING
// ============================================

test('Feature only on Chrome @chrome-only', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Chrome only feature');
  // This test has implicit Chrome-only tag in behavior
  await page.goto('https://playwright.dev');
});

test('Slow only on mobile @mobile-slow', async ({ page }, testInfo) => {
  if (testInfo.project.name === 'Mobile Chrome') {
    test.slow(); // Increase timeout for mobile
  }
  await page.goto('https://playwright.dev');
});

// ============================================
// TAG NAMING BEST PRACTICES
// ============================================

// ✅ GOOD TAG EXAMPLES
test('Good tags - descriptive @smoke @critical @e2e @fast', async ({ page }) => {
  // Lowercase, short, meaningful, hyphens for compound words
  await page.goto('https://playwright.dev');
});

test('Compound words with hyphens @api-integration @user-registration @pre-deploy', async ({ page }) => {
  // Clear multi-word tags
  await page.goto('https://playwright.dev');
});

// ❌ AVOID - TOO MANY TAGS
test.skip('Too many tags @smoke @quick @unit @auth @api @critical @important @e2e @fast @core', async ({ page }) => {
  // This has too many tags - stick to 3-5 relevant ones
  await page.goto('https://playwright.dev');
});

// ============================================
// ORGANIZING BY FEATURE MODULES
// ============================================

test.describe('User Account Management @account', () => {
  test('Create account @account @auth @e2e @critical', async ({ page }) => {
    await page.goto('https://playwright.dev');
  });

  test('Update profile @account @critical', async ({ page }) => {
    await page.goto('https://playwright.dev');
  });

  test('Change password @account @security @critical', async ({ page }) => {
    await page.goto('https://playwright.dev');
  });

  test('Delete account @account @slow @critical', async ({ page }) => {
    await page.goto('https://playwright.dev');
  });
});

test.describe('Product Search and Filtering @search', () => {
  test('Search by keyword @search @smoke @quick', async ({ page }) => {
    await page.goto('https://playwright.dev');
  });

  test('Filter by category @search @quick', async ({ page }) => {
    await page.goto('https://playwright.dev');
  });

  test('Advanced search with multiple filters @search @slow', async ({ page }) => {
    await page.goto('https://playwright.dev');
  });

  test('Search with special characters @search @edge-case', async ({ page }) => {
    await page.goto('https://playwright.dev');
  });
});

// ============================================
// CI/CD PIPELINE SIMULATION
// ============================================

/*
Typical CI/CD Setup:

1. PRE-COMMIT (developer machine):
   npm run test:smoke  →  npx playwright test --grep "@smoke"
   ⏱️  Takes: 2-3 minutes
   ✓ Quick feedback before pushing

2. PULL REQUEST (GitHub/GitLab CI):
   npm run test:full  →  npx playwright test
   ⏱️  Takes: 15-30 minutes
   ✓ Full test coverage

3. MERGE TO MAIN:
   npm run test:critical  →  npx playwright test --grep "@critical"
   ⏱️  Takes: 5-10 minutes
   ✓ Confidence check for main branch

4. NIGHTLY BUILD:
   npm run test:nightly  →  npx playwright test --grep "@nightly"
   ⏱️  Takes: 1-2 hours
   ✓ Comprehensive testing, load tests

5. PRE-PRODUCTION DEPLOYMENT:
   npm run test:pre-deploy  →  npx playwright test --grep "@smoke|@critical"
   ⏱️  Takes: 5-10 minutes
   ✓ Final sanity check before release
*/

