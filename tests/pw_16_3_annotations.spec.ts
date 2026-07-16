//https://www.youtube.com/watch?v=KDpR5hDtZUw&list=PLUDwpEzHYYLtvMVjc-Va3RXLKtdB-ofc2&index=16
import { test, expect } from '@playwright/test';

// ============================================
// BASIC ANNOTATIONS EXAMPLES
// ============================================

test('Normal test - runs as usual', async ({ page }) => {
  await page.goto('https://playwright.dev');
  const title = await page.title();
  expect(title).toContain('Playwright');
});

// SKIP - This test will not run
test.skip('Skipped test - feature not ready', async ({ page }) => {
  await page.goto('https://example.com');
  // This code will never execute
});

// ONLY - Only this test runs (comment out to run others)
// test.only('Only this test runs', async ({ page }) => {
//   await page.goto('https://playwright.dev');
// });

// FIXME - Test runs but failures are ignored (known bug)
test.fixme('Known issue - checkout button disabled', async ({ page }) => {
  await page.goto('https://playwright.dev');
  // Failures won't block test suite
});

// FAIL - Test is expected to fail (if it passes, that's unexpected!)
test.fail('Expected to fail - waiting for bug fix (JIRA-456)', async ({ page }) => {
  await page.goto('https://playwright.dev');
  // This test SHOULD fail. If it passes unexpectedly, test reports it.
  // Similar to fixme but with specific semantics
});

// SLOW - Gets 3x the normal timeout
test.slow('Large file upload simulation', async ({ page }) => {
  // Timeout: 30s → 90s
  await page.goto('https://playwright.dev');
  await page.waitForLoadState('networkidle');
});

// ============================================
// CONDITIONAL ANNOTATIONS
// ============================================

test('Skip based on browser type', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'Not supported on Safari');
  
  await page.goto('https://playwright.dev');
  expect(browserName).toBe('chromium');
});

test('Skip based on operating system', async ({ page }, testInfo) => {
  test.skip(
    process.platform !== 'win32',
    'Only runs on Windows'
  );
  
  await page.goto('https://playwright.dev');
});

test('Skip in CI environment', async ({ page }) => {
  test.skip(
    process.env.CI === 'true',
    'Skipped when running in CI'
  );
  
  await page.goto('http://localhost:3000');
});

test('Multiple conditions', async ({ page, browserName }, testInfo) => {
  test.skip(
    browserName === 'webkit' && process.platform === 'linux',
    'Safari on Linux not supported'
  );
  
  await page.goto('https://playwright.dev');
});

// ============================================
// TEST GROUPS WITH ANNOTATIONS
// ============================================

test.describe('Authentication Tests @authentication', () => {
  test('Login with valid credentials @smoke @critical', async ({ page }) => {
    await page.goto('https://playwright.dev');
    // Login implementation
  });

  test.skip('Login with SSO @feature-pending', async ({ page }) => {
    // SSO feature still in development
    await page.goto('https://example.com/sso');
  });

  test.fixme('Login with biometric @known-issue', async ({ page }) => {
    // Waiting for backend support
    await page.goto('https://example.com/biometric');
  });

  test.slow('Login with 2FA @critical @security', async ({ page }) => {
    // 2FA adds extra processing time
    await page.goto('https://example.com/login');
  });
});

test.describe('E2E Shopping Flow @e2e', () => {
  test('Complete purchase on desktop', async ({ page, browserName }) => {
    test.skip(
      browserName !== 'chromium',
      'Tested on Chrome only'
    );
    
    await page.goto('https://playwright.dev');
    // Purchase steps
  });

  test('Mobile checkout flow @mobile', async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'Mobile Chrome',
      'Mobile only test'
    );
    
    await page.setViewportSize({ width: 375, height: 667 });
  });
});

// ============================================
// FAIL ANNOTATION - EXPECTED FAILURE TESTS
// ============================================

test.fail('Bug: Payment processing fails on Safari', async ({ page, browserName }) => {
  // This test is EXPECTED to fail
  // If it starts passing, it's reported as "unexpected pass"
  test.skip(browserName !== 'webkit', 'Safari-specific bug');
  
  await page.goto('https://playwright.dev');
  // Payment processing code that currently fails on Safari
});

test.fail('Feature not yet implemented - waiting for backend', async ({ page }) => {
  // Test documents missing functionality
  // Expected to fail until feature is complete
  await page.goto('https://example.com/new-feature');
  // Code for feature that doesn't exist yet
});

test.fail('Race condition - intermittent failure', async ({ page }) => {
  // Documents known flaky behavior
  // Test is expected to fail intermittently
  await page.goto('https://playwright.dev');
  // Code with known race condition
});

// Conditional fail annotation
test('Fail only on specific browser', async ({ page, browserName }) => {
  if (browserName === 'webkit') {
    test.fail(true, 'Safari has rendering bug (reported to vendor)');
  }
  
  await page.goto('https://playwright.dev');
});

// ============================================
// COMPARISON: FIXME vs FAIL
// ============================================

test.fixme('FIXME: Logout button disabled on mobile', async ({ page }) => {
  // FIXME = "This test fails, ignore failures, continue test run"
  // Used when you DON'T CARE if it passes or fails
  // Just want to run it without blocking suite
});

test.fail('FAIL: Expected - logout button disabled on mobile', async ({ page }) => {
  // FAIL = "This test is EXPECTED to fail"
  // If it PASSES -> reported as unexpected pass (something improved!)
  // If it FAILS -> expected (document issue with timeline)
  // More semantic - documents failing tests you're tracking
});

test.slow('High-value purchase order', async ({ page }) => {
  // Complex order processing takes longer
  await page.goto('https://playwright.dev');
});


// ============================================
// ADVANCED CONDITIONAL LOGIC
// ============================================

test('Feature flag dependent test', async ({ page }) => {
  const featureEnabled = process.env.NEW_FEATURE_ENABLED === 'true';
  
  test.skip(
    !featureEnabled,
    'Feature not enabled - set NEW_FEATURE_ENABLED=true'
  );
  
  await page.goto('https://playwright.dev');
});

test('API availability check', async ({ page }) => {
  const apiUrl = process.env.API_URL;
  
  test.skip(
    !apiUrl,
    'API URL not configured - set API_URL environment variable'
  );
  
  const response = await page.request.get(apiUrl);
  expect(response.ok()).toBeTruthy();
});

test('Environment-specific test', async ({ page }) => {
  const env = process.env.TEST_ENV || 'staging';
  
  test.skip(
    env === 'development',
    'Requires staging or production environment'
  );
  
  await page.goto(`https://${env}.example.com`);
});

// ============================================
// PRACTICAL EXAMPLES
// ============================================

test('Cross-browser compatibility check @critical', async ({ page, browserName }) => {
  // Skip Safari for this specific test
  test.skip(
    browserName === 'webkit',
    'Safari has rendering issues with this component'
  );
  
  await page.goto('https://playwright.dev');
  
  // Component-specific assertions
  const header = page.locator('header');
  await expect(header).toBeVisible();
});

test.describe('Performance Tests @performance @slow', () => {
  test.slow('Page load performance', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('https://playwright.dev');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(5000);
  });

  test.slow('Complex animation rendering', async ({ page }) => {
    // Needs extra time for animations
    await page.goto('https://playwright.dev');
    await page.waitForLoadState('networkidle');
  });
});

// ============================================
// SKIP vs FAIL vs FIXME - COMPARISON
// ============================================

test.describe('Understanding Annotations', () => {
  // === SKIP ===
  // Use when: Feature doesn't exist yet
  // Test runs? NO
  // Result if it WOULD pass: ⊘ Skipped
  // Result if it WOULD fail: ⊘ Skipped
  // Report: No impact
  test.skip('Feature not implemented yet - coming v2.0', async ({ page }) => {
    // This code NEVER runs
    // Backend API not ready, frontend not built
  });

  test('Import PDF documents', async ({ page }) => {
    test.skip(!process.env.PDF_SERVICE_URL, 'PDF service not configured');
    // Skipped in local dev, runs in CI
  });

  // === FAIL ===
  // Use when: Known bug with fix timeline
  // Test runs? YES
  // Result if it PASSES: 🔔 Unexpected! (alerts team)
  // Result if it FAILS: ✅ Expected (as intended)
  // Report: Alerts on unexpected pass (good sign!)
  test.fail('Payment fails on Safari - JIRA-2847', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit', 'Safari-only bug');
    // Team is fixing this bug
    // When it unexpectedly passes, team is alerted
    // Useful for tracking when vendors fix issues
  });

  // === FIXME ===
  // Use when: Investigating, temporary, work-in-progress
  // Test runs? YES
  // Result if it PASSES: ✅ Passes
  // Result if it FAILS: ✅ Ignored (doesn't block CI)
  // Report: No impact
  test.fixme('WebSocket - investigating intermittent failures', async ({ page }) => {
    // Sometimes passes, sometimes fails
    // Not sure if it's: app bug, test wrong, or network issue
    // Suppress failures while investigating
    // Plan: Fix or delete when investigation complete
  });

  test.fixme('AI recommendations - feature in heavy development', async ({ page }) => {
    // Feature under active development
    // Might work, might not - don't care yet
    // Remove annotation when feature stabilizes
  });
});

// ============================================
// FEATURE DEVELOPMENT LIFECYCLE
// ============================================

test.describe('Real-world Feature Timeline @lifecycle', () => {
  // WEEK 1: Not started
  test.skip('Dark mode support - Design phase', async ({ page }) => {
    // Feature hasn't started yet
    // API doesn't exist
    // UI not designed
  });

  // WEEK 2: In progress, unclear status
  test.fixme('Dark mode CSS integration', async ({ page }) => {
    // Development in progress
    // Might work today, broken tomorrow
    // Don't want to block CI
    // Plan to remove when feature stable
  });

  // WEEK 3: Mostly working, one bug found
  test.fail('Dark mode: text color hard to read - JIRA-3421', async ({ page }) => {
    // Feature works but has a visual bug
    // Designer is fixing the color palette
    // When unexpected pass occurs → bug fixed!
  });

  // WEEK 4: Bug fixed, ready for production ✅
  test('Dark mode toggle works correctly', async ({ page }) => {
    // Normal test! No annotation needed
    // Feature complete and working
  });
});

// ============================================
// BROWSER-SPECIFIC EXAMPLES
// ============================================

test.describe('Browser Compatibility', () => {
  // Skip: Browser doesn't support feature at all
  test('File system access API', async ({ page, browserName }) => {
    test.skip(
      browserName !== 'chromium',
      'Only Chrome supports File System Access API'
    );
    // Feature only available on Chrome
  });

  // Fail: Browser has bug, vendor aware
  test('IndexedDB performance', async ({ page, browserName }) => {
    test.fail(
      browserName === 'webkit',
      'Safari IndexedDB slow - WebKit issue #98765 reported'
    );
    // Safari has known performance issue
    // Apple developer team is aware
    // Monitoring for when fixed
  });

  // Fixme: Unclear if browser or our app is broken
  test.fixme('WebGL rendering - investigating', async ({ page, browserName }) => {
    test.skip(browserName === 'firefox', 'Firefox GPU rendering disabled in CI');
    // WebGL works on Chrome locally but fails in some CI environments
    // Investigating: driver issue? container limitation? our code?
  });
});

// ============================================
// ENVIRONMENT-SPECIFIC EXAMPLES
// ============================================

test.describe('Environment Configuration', () => {
  // Skip: Resource not available
  test('Database migrations', async ({ page }) => {
    test.skip(
      !process.env.TEST_DB_URL,
      'No test database configured'
    );
    // Skipped in local dev, runs in CI
  });

  // Fail: Known limitation being addressed
  test.fail(
    process.env.ENVIRONMENT === 'staging',
    'SSL certificate issue in staging - expires Feb 15'
  );

  // Fixme: Investigating environment issue
  test.fixme('Load test performance', async ({ page }) => {
    // Works locally, fails in CI load testing
    // Not sure if: test is flaky, CI has resource limits, or app has issue
  });
});

// ============================================
// WHEN TO REMOVE ANNOTATIONS
// ============================================

test.describe('Annotation Cleanup', () => {
  // ✅ BEFORE: Has annotation
  // test.skip('OAuth - coming in v3.0', async ({ page }) => {});
  
  // ✅ AFTER: OAuth implemented, remove skip
  test('OAuth login works', async ({ page }) => {
    // Feature now complete - no annotation needed
  });

  // ✅ BEFORE: Has fail annotation
  // test.fail('Safari payment bug - JIRA-123', async ({ page }) => {});
  
  // ✅ AFTER: Safari bug fixed, remove annotation
  test('Safari payment processing', async ({ page }) => {
    // Bug is fixed - no annotation needed
  });

  // ✅ BEFORE: Has fixme annotation
  // test.fixme('WebSocket reconnection', async ({ page }) => {});
  
  // ✅ AFTER: Issue resolved or test deleted
  test('WebSocket auto-reconnect', async ({ page }) => {
    // Issue was fixed or test was removed
  });
});

// ============================================
// DEBUGGING & FOCUS
// ============================================

// Uncomment to run ONLY this test for debugging
// test.only('Debugging specific scenario', async ({ page }) => {
//   await page.goto('https://playwright.dev');
//   const title = await page.title();
//   console.log('Page title:', title);
// });

// Mark tests that need investigation
test.fixme('Investigate flaky test - intermittent timeout', async ({ page }) => {
  await page.goto('https://playwright.dev', { waitUntil: 'networkidle' });
  // This test sometimes fails - needs investigation
});