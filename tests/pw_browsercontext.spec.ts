import { test, expect, chromium } from '@playwright/test';

/**
 * Practice Exercises: Browser, BrowserContext, and Page
 * 
 * These tests are intentionally simple to practice the concepts
 * Try running them with: npx playwright test pw_browsercontext.spec.ts
 */

test.describe('Practice: Browser Fundamentals', () => {
  
  test('EXERCISE 1: Launch browser and verify connection', async () => {
    // TODO: Complete this exercise
    // 1. Launch a chromium browser
    // 2. Verify it's connected with expect()
    // 3. Close the browser
    
    // Start your code here:
  });

  test('EXERCISE 2: Create multiple contexts and verify count', async () => {
    // TODO: Complete this exercise
    // 1. Launch chromium browser
    // 2. Create 2 contexts
    // 3. Verify browser.contexts().length equals 2
    // 4. Close both contexts and browser
  });

  test('EXERCISE 3: Different viewports in different contexts', async () => {
    // TODO: Complete this exercise
    // 1. Launch browser
    // 2. Create context1 with 800x600 viewport
    // 3. Create context2 with 1920x1080 viewport
    // 4. Create pages from each context
    // 5. Verify viewportSize is different for each page
    // 6. Cleanup
  });
});

test.describe('Practice: BrowserContext Features', () => {
  
  test('EXERCISE 4: Add cookies to context', async ({ browser }) => {
    // TODO: Complete this exercise
    // 1. Create a context
    // 2. Add a cookie with name 'userId' and value 'user123'
    // 3. Get all cookies and verify the cookie exists
    // 4. Cleanup
  });

  test('EXERCISE 5: Different user contexts', async ({ browser }) => {
    // TODO: Complete this exercise
    // 1. Create userContext1
    // 2. Create userContext2
    // 3. Add 'username' cookie to userContext1 with value 'alice'
    // 4. Add 'username' cookie to userContext2 with value 'bob'
    // 5. Get cookies from each context
    // 6. Verify they have different values
    // 7. Cleanup both contexts
  });

  test('EXERCISE 6: Context with custom user agent', async ({ browser }) => {
    // TODO: Complete this exercise
    // 1. Create context with custom userAgent 'MyTestBot/1.0'
    // 2. Create page from context
    // 3. Use page.evaluate to get navigator.userAgent
    // 4. Verify it contains 'MyTestBot'
    // 5. Cleanup
  });

  test('EXERCISE 7: Locale and timezone context', async ({ browser }) => {
    // TODO: Complete this exercise
    // 1. Create context with locale 'en-US' and timezoneId 'America/New_York'
    // 2. Create page from context
    // 3. Use page.evaluate to get navigator.language
    // 4. Verify it equals 'en-US'
    // 5. Cleanup
  });
});

test.describe('Practice: Multiple Pages', () => {
  
  test('EXERCISE 8: Create and navigate multiple pages', async ({ context }) => {
    // TODO: Complete this exercise
    // 1. Create 3 pages from context
    // 2. Navigate page1 to https://example.com
    // 3. Navigate page2 to https://google.com
    // 4. Navigate page3 to https://github.com
    // 5. Verify each has different URL
    // 6. Close all pages
  });

  test('EXERCISE 9: Get all pages from context', async ({ context }) => {
    // TODO: Complete this exercise
    // 1. Create 2 pages
    // 2. Get context.pages()
    // 3. Verify length is 2
    // 4. Navigate each page to https://example.com
    // 5. Close pages in a loop using context.pages()
  });

  test('EXERCISE 10: Share data across pages in same context', async ({ context }) => {
    // TODO: Complete this exercise
    // 1. Add cookie to context with name 'shared' value 'data123'
    // 2. Create page1 and page2
    // 3. Get cookies from context (should show shared cookie)
    // 4. Both pages should have access to context cookies
    // 5. Verify both pages can see the same cookie
    // 6. Cleanup
  });
});

test.describe('Practice: Page Properties and Navigation', () => {
  
  test('EXERCISE 11: Get page URL and title', async ({ page }) => {
    // TODO: Complete this exercise
    // 1. Navigate to https://example.com
    // 2. Get page.url() and verify it contains 'example'
    // 3. Get page.title() and verify it's not empty
    // 4. Check page.isClosed() and verify it's false
  });

  test('EXERCISE 12: Navigate back and forward', async ({ page }) => {
    // TODO: Complete this exercise
    // 1. Navigate to https://example.com
    // 2. Navigate to https://example.com/about (or similar)
    // 3. Store both URLs
    // 4. Use page.goBack()
    // 5. Verify you're on first URL
    // 6. Use page.goForward()
    // 7. Verify you're on second URL
  });

  test('EXERCISE 13: Reload page', async ({ page }) => {
    // TODO: Complete this exercise
    // 1. Navigate to https://example.com
    // 2. Store the URL
    // 3. Reload with page.reload()
    // 4. Verify URL is still the same
  });

  test('EXERCISE 14: Viewport size', async ({ page }) => {
    // TODO: Complete this exercise
    // 1. Navigate to https://example.com
    // 2. Get page.viewportSize()
    // 3. Verify width > 0 and height > 0
  });
});

test.describe('Practice: Console and Events', () => {
  
  test('EXERCISE 15: Listen to console messages', async ({ page }) => {
    // TODO: Complete this exercise
    // 1. Set up listener for 'console' event
    // 2. Set page content with inline script that calls console.log()
    // 3. Verify message was captured
    
    const messages: string[] = [];
    page.on('console', msg => {
      messages.push(msg.text());
    });

    await page.setContent(`<script>console.log('Hello Test');</script>`);
    await page.waitForTimeout(500);

    // Add your assertion here:
    // expect(messages).toContain('Hello Test');
  });

  test('EXERCISE 16: Handle page errors', async ({ page }) => {
    // TODO: Complete this exercise
    // 1. Set up listener for 'pageerror' event
    // 2. Set page content with script that throws error
    // 3. Verify error was captured
  });

  test('EXERCISE 17: Responsive design - mobile vs desktop', async ({ browser }) => {
    // TODO: Complete this exercise
    // 1. Create mobile context with viewport 375x812
    // 2. Create desktop context with viewport 1920x1080
    // 3. Get pages from each
    // 4. Navigate both to same URL
    // 5. Compare viewportSize()
    // 6. Verify they're different
  });
});

test.describe('Practice: Cleanup Patterns', () => {
  
  test('EXERCISE 18: Proper cleanup with try-finally', async () => {
    // TODO: Complete this exercise
    // Use try-finally pattern to ensure cleanup:
    // 1. Launch browser in try block
    // 2. Create context and page
    // 3. Navigate somewhere
    // 4. Always close in finally block (even if error occurs)
    
    const browser = await chromium.launch();
    try {
      // Your test code
      expect(browser.isConnected()).toBe(true);
    } finally {
      await browser.close();
    }
  });

  test('EXERCISE 19: Close resources in order', async ({ browser }) => {
    // TODO: Complete this exercise
    // Demonstrate proper cleanup order:
    // Pages -> Contexts -> Browser
    
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    
    // Close in proper order:
    // 1. Close pages first
    // 2. Close contexts second
    // 3. Browser is managed by fixture
  });
});

/**
 * Solutions Reference:
 * 
 * EXERCISE 1 Solution:
 * const browser = await chromium.launch();
 * expect(browser.isConnected()).toBe(true);
 * await browser.close();
 * 
 * EXERCISE 2 Solution:
 * const browser = await chromium.launch();
 * const ctx1 = await browser.newContext();
 * const ctx2 = await browser.newContext();
 * expect(browser.contexts().length).toBe(2);
 * await ctx1.close();
 * await ctx2.close();
 * await browser.close();
 * 
 * Run tests with: npx playwright test pw_browsercontext.spec.ts
 * See detailed guide in: BROWSER_CONTEXT_PAGE_GUIDE.md
 */
