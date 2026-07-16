/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║         WINDOW HANDLES & MULTIPLE PAGES IN PLAYWRIGHT               ║
 * ║              (Tabs, Windows, Pop-ups, Multiple Contexts)             ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 * 
 * Window handles manage browser windows, tabs, and pop-ups.
 * In Playwright, we don't use "handles" like Selenium, but instead use
 * the Page object to represent browser tabs/windows.
 * 
 * Key Concept: In Playwright, each page/tab is represented by a Page object,
 * and we work with multiple Page objects simultaneously rather than
 * switching window handles.
 */

import { test, expect, chromium } from '@playwright/test';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 1. UNDERSTANDING PAGES VS WINDOWS IN PLAYWRIGHT
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Terminology:
 * - Page: A single tab or window in browser (represented by Page object)
 * - Browser: The browser instance
 * - BrowserContext: An isolated environment (like incognito mode)
 * - Multiple Pages: Can exist in same context or different contexts
 * 
 * Unlike Selenium:
 * - Selenium uses window handles (strings like "window-1", "window-2")
 * - Playwright uses Page objects directly
 * - No need to switch between handles, just reference different Page objects
 */

test('Understand Playwright pages vs Selenium handles', async ({ page }) => {
  // In Playwright, 'page' is the main page/tab
  // This is equivalent to Selenium's "window 0"
  
  console.log('Current page URL:', page.url());
  
  // You can store reference to this page
  const mainPage = page;
  
  // If you open a new page, you get a new Page object
  // No need to manage handles - just keep references to Page objects
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 2. OPENING NEW PAGES/TABS (Browser Context)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Ways to open new pages:
 * 1. context.newPage() - create new page in same context
 * 2. page.context().newPage() - same as above
 * 3. User interaction triggers new page (click link with target="_blank")
 * 
 * All pages in same context share:
 * - Cookies
 * - Local storage
 * - Session storage
 */

test('Open new page using context.newPage()', async ({ context, page }) => {
  // Original page
  await page.goto('https://example.com');
  console.log('Page 1:', page.url());
  
  // Create a new page in the same context
  const page2 = await context.newPage();
  await page2.goto('https://google.com');
  console.log('Page 2:', page2.url());
  
  // Both pages exist simultaneously
  // Can interact with both
  console.log('Page 1 is still accessible:', page.url());
  console.log('Page 2 URL:', page2.url());
  
  // Must close page2 explicitly
  await page2.close();
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 3. HANDLING USER-TRIGGERED POP-UPS (target="_blank")
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * When user clicks link with target="_blank", new page opens.
 * Use page.waitForPopup() to catch the new page.
 * 
 * This is equivalent to Selenium's:
 * - Getting all window handles
 * - Switching to new window
 * - But simpler in Playwright
 */

test('Wait for pop-up from user interaction', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Method 1: waitForPopup() - most common
  // Start waiting before clicking the link
  const popupPromise = page.waitForPopup();
  
  // Click link that opens in new tab (target="_blank")
  await page.click('a[target="_blank"]');
  
  // Get the popup page
  const popup = await popupPromise;
  
  console.log('Popup URL:', popup.url());
  
  // Interact with popup page
  await expect(popup.locator('h1')).toBeVisible();
  
  // Close popup when done
  await popup.close();
});

test('Wait for pop-up with timeout', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Wait for popup with custom timeout
  const popupPromise = page.waitForPopup();
  await page.click('a[target="_blank"]');
  
  const popup = await popupPromise;
  
  // If popup doesn't open within 5 seconds, this will timeout
  try {
    await popup.waitForLoadState('load', { timeout: 5000 });
    console.log('Popup loaded successfully');
  } catch (error) {
    console.log('Popup loading timed out');
  }
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 4. OPENING NEW PAGES PROGRAMMATICALLY (Not from User Click)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Use context.newPage() to open pages without user interaction.
 * This simulates opening new tabs programmatically.
 */

test('Open multiple pages programmatically', async ({ context, page }) => {
  // Main page
  await page.goto('https://example.com');
  
  // Open second page
  const page2 = await context.newPage();
  await page2.goto('https://google.com');
  
  // Open third page
  const page3 = await context.newPage();
  await page3.goto('https://github.com');
  
  // Now we have 3 pages open simultaneously
  // Work with any page without switching
  console.log('Page 1:', page.url());
  console.log('Page 2:', page2.url());
  console.log('Page 3:', page3.url());
  
  // Can verify content on each page
  await expect(page.locator('body')).toBeVisible();
  await expect(page2.locator('body')).toBeVisible();
  await expect(page3.locator('body')).toBeVisible();
  
  // Clean up
  await page2.close();
  await page3.close();
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 5. HANDLING MULTIPLE PAGES IN PARALLEL
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Open multiple pages and work with them in parallel.
 * This is useful for:
 * - Testing concurrent operations
 * - User session comparisons
 * - Load testing
 */

test('Work with multiple pages simultaneously', async ({ context, page }) => {
  // Create multiple pages
  const pages = [page];
  
  for (let i = 1; i < 3; i++) {
    const newPage = await context.newPage();
    pages.push(newPage);
  }
  
  // Load different URLs in each page
  await Promise.all([
    pages[0].goto('https://example.com/page1'),
    pages[1].goto('https://example.com/page2'),
    pages[2].goto('https://example.com/page3'),
  ]);
  
  // Verify all pages loaded
  await Promise.all([
    expect(pages[0].locator('body')).toBeVisible(),
    expect(pages[1].locator('body')).toBeVisible(),
    expect(pages[2].locator('body')).toBeVisible(),
  ]);
  
  // Perform actions on all pages in parallel
  await Promise.all([
    pages[0].fill('input[name="email"]', 'user1@example.com'),
    pages[1].fill('input[name="email"]', 'user2@example.com'),
    pages[2].fill('input[name="email"]', 'user3@example.com'),
  ]);
  
  // Close all pages except first
  for (let i = 1; i < pages.length; i++) {
    await pages[i].close();
  }
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 6. SWITCHING BETWEEN PAGES/TABS
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Unlike Selenium (switch_to.window()), in Playwright you just reference
 * different Page objects.
 * 
 * Pattern:
 * - Keep references to different Page objects
 * - Call methods on whichever page object you want to interact with
 * - No explicit "switching" needed
 */

test('Switch between pages (implicit, no switch call)', async ({ context, page }) => {
  const page1 = page;
  const page2 = await context.newPage();
  
  // Load different content
  await page1.goto('https://example.com');
  await page2.goto('https://google.com');
  
  // Interact with page1
  await page1.fill('input[name="search"]', 'Playwright');
  
  // Interact with page2 (no "switch" needed, just use page2 object)
  await page2.fill('input[name="q"]', 'Playwright testing');
  
  // Back to page1 operations
  await page1.click('button[type="submit"]');
  
  // Verify page1 state
  await expect(page1.locator('h1')).toContainText('Search Results');
  
  // Verify page2 state (it's still accessible)
  console.log('Page 2 URL:', page2.url());
  
  await page2.close();
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 7. MANAGING PAGE LIFECYCLE (Close, Wait, Events)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Page events and lifecycle management:
 * - page.on('popup') - catch popup events
 * - page.on('close') - when page closes
 * - page.on('framenavigated') - when frame navigates
 * - page.on('framedetached') - when frame is removed
 * - page.close() - close the page
 * - page.isClosed() - check if page is closed
 */

test('Page lifecycle events', async ({ context, page }) => {
  // Setup event listeners before opening pages
  let popupCount = 0;
  page.on('popup', (newPage) => {
    console.log('Popup detected:', newPage.url());
    popupCount++;
    newPage.close(); // Auto-close popups
  });
  
  let closedCount = 0;
  page.on('close', () => {
    console.log('Page closed');
    closedCount++;
  });
  
  // Simulate actions that might trigger popups
  // ...
  
  // Verify events were triggered
  console.log('Popups detected:', popupCount);
  console.log('Pages closed:', closedCount);
});

test('Check if page is closed', async ({ context, page }) => {
  const newPage = await context.newPage();
  await newPage.goto('https://example.com');
  
  console.log('Is page closed?', newPage.isClosed()); // false
  
  await newPage.close();
  
  console.log('Is page closed?', newPage.isClosed()); // true
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 8. WORKING WITH MULTIPLE BROWSER CONTEXTS
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Browser Contexts are isolated environments:
 * - Each has separate cookies, storage, cache
 * - Useful for testing multiple users
 * - Like opening incognito windows
 * - Better than separate browsers for performance
 * 
 * Context advantages over separate browsers:
 * - Faster (reuse browser instance)
 * - Isolated state (separate cookies/storage)
 * - Can run concurrently
 */

test('Multiple contexts - simulating multiple users', async ({ browser }) => {
  // Create context for user 1
  const context1 = await browser.newContext();
  const page1 = await context1.newPage();
  await page1.goto('https://example.com/login');
  await page1.fill('input[name="email"]', 'user1@example.com');
  await page1.fill('input[name="password"]', 'password1');
  await page1.click('button[type="submit"]');
  
  // Create context for user 2 (isolated, separate cookies)
  const context2 = await browser.newContext();
  const page2 = await context2.newPage();
  await page2.goto('https://example.com/login');
  await page2.fill('input[name="email"]', 'user2@example.com');
  await page2.fill('input[name="password"]', 'password2');
  await page2.click('button[type="submit"]');
  
  // Both users are logged in simultaneously on different contexts
  // They don't interfere with each other
  
  const user1Name = await page1.locator('.user-name').textContent();
  const user2Name = await page2.locator('.user-name').textContent();
  
  expect(user1Name).toBe('User 1');
  expect(user2Name).toBe('User 2');
  
  // Cleanup
  await context1.close();
  await context2.close();
});

test('Context isolation - cookies not shared', async ({ browser }) => {
  // User 1 context
  const context1 = await browser.newContext();
  const page1 = await context1.newPage();
  await page1.goto('https://example.com');
  
  // Set cookie in context 1
  await context1.addCookies([{
    name: 'user_id',
    value: 'user1',
    url: 'https://example.com',
  }]);
  
  // User 2 context (separate)
  const context2 = await browser.newContext();
  const page2 = await context2.newPage();
  await page2.goto('https://example.com');
  
  // Context 2 doesn't have cookie from context 1
  const cookies2 = await context2.cookies();
  expect(cookies2.length).toBe(0); // No user_id cookie
  
  await context1.close();
  await context2.close();
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 9. POPUP HANDLING PATTERNS
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Common popup patterns and how to handle them.
 */

test('Dialog (Alert, Confirm, Prompt)', async ({ page }) => {
  // Dialogs are different from pages/popups
  // Handle with page.on('dialog') or page.once('dialog')
  
  page.once('dialog', async (dialog) => {
    console.log('Dialog message:', dialog.message());
    console.log('Dialog type:', dialog.type()); // alert, confirm, prompt, beforeunload
    
    // Accept dialog (click OK)
    await dialog.accept();
    
    // Or dismiss (click Cancel)
    // await dialog.dismiss();
  });
  
  // Trigger dialog
  await page.click('button[onclick="alert(\'Hello\')"]');
  
  // Alternatively, use waitForEvent
  const dialogPromise = page.waitForEvent('dialog');
  await page.click('button[onclick="confirm(\'Proceed?\')"]');
  
  const dialog = await dialogPromise;
  await dialog.accept(); // Accept confirm
});

test('New page from link (target="_blank")', async ({ page }) => {
  // This is the most common scenario
  await page.goto('https://example.com');
  
  // Start listening for popup before click
  const popupPromise = page.waitForPopup();
  
  // Click link that opens in new tab
  await page.click('a[target="_blank"]');
  
  // Get the new page
  const popup = await popupPromise;
  
  // Work with popup
  await popup.waitForLoadState('load');
  console.log('Popup URL:', popup.url());
  
  // Get data from popup
  const popupTitle = await popup.title();
  console.log('Popup title:', popupTitle);
  
  await popup.close();
});

test('Window.open() from JavaScript', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Listen for popup from JavaScript window.open()
  const popupPromise = page.waitForPopup();
  
  // Trigger window.open() via JavaScript
  await page.evaluate(() => {
    window.open('https://example.com/details', 'details');
  });
  
  const popup = await popupPromise;
  console.log('Window.open() popup:', popup.url());
  
  await popup.close();
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 10. CROSS-PAGE COMMUNICATION & DATA SHARING
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Share data between pages without using storage (which is context-based).
 * Use JavaScript variables or evaluate across pages.
 */

test('Share data between pages using page variables', async ({ context, page }) => {
  // Main page
  await page.goto('https://example.com');
  
  // Store data in page context (not browser storage)
  const sharedData = { userId: 'user123', userName: 'John Doe' };
  
  // Create second page
  const page2 = await context.newPage();
  await page2.goto('https://example.com');
  
  // Use shared data in both pages (kept in JavaScript memory)
  console.log('Shared data:', sharedData);
  
  // Can also use localStorage (but scoped to context)
  await page.evaluate((data) => {
    localStorage.setItem('userData', JSON.stringify(data));
  }, sharedData);
  
  // page2 has access to same localStorage (same context)
  const userData = await page2.evaluate(() => {
    return JSON.parse(localStorage.getItem('userData') || '{}');
  });
  
  expect(userData.userId).toBe('user123');
  
  await page2.close();
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 11. PRACTICAL SCENARIOS WITH MULTIPLE PAGES
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Scenario 1: Test user interaction across pages
test('Scenario: Email verification flow', async ({ context, page }) => {
  // User signs up on page 1
  await page.goto('https://example.com/signup');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  // In real scenario, user gets email and clicks link
  // Simulate this by opening new page to email verification URL
  const emailPage = await context.newPage();
  await emailPage.goto('https://example.com/verify?token=abc123');
  
  // Verify email page loaded
  await expect(emailPage.locator('h1')).toContainText('Email Verified');
  
  // Go back to main page and check account is verified
  await page.reload();
  const status = await page.locator('.account-status').textContent();
  expect(status).toContain('Verified');
  
  await emailPage.close();
});

// Scenario 2: Test concurrent user actions
test('Scenario: Concurrent shopping - two users checkout', async ({ context, page }) => {
  // User 1: Add to cart
  await page.goto('https://shop.example.com');
  await page.click('button[data-product-id="1"]'); // Add to cart
  await page.click('a[href="/cart"]');
  const user1CartCount = await page.locator('.cart-count').textContent();
  
  // User 2: Add to cart in separate context (different user)
  const user2Context = await context.browser()?.newContext() || context;
  const page2 = await user2Context.newPage();
  await page2.goto('https://shop.example.com');
  await page2.click('button[data-product-id="2"]'); // Different product
  await page2.click('a[href="/cart"]');
  const user2CartCount = await page2.locator('.cart-count').textContent();
  
  // Both users have their own separate carts
  expect(user1CartCount).not.toBe(user2CartCount);
  
  if (page2.context() !== context) {
    await user2Context.close();
  } else {
    await page2.close();
  }
});

// Scenario 3: Test admin action affects user page
test('Scenario: Admin updates content, user sees changes', async ({ browser }) => {
  // Admin context
  const adminContext = await browser.newContext();
  const adminPage = await adminContext.newPage();
  await adminPage.goto('https://example.com/admin');
  await adminPage.fill('input[name="content"]', 'Updated content');
  await adminPage.click('button[type="submit"]');
  
  // User context
  const userContext = await browser.newContext();
  const userPage = await userContext.newPage();
  await userPage.goto('https://example.com');
  
  // User page initially has old content
  let userContent = await userPage.locator('.content').textContent();
  expect(userContent).toContain('Old content'); // Cached
  
  // After refresh, user sees updated content
  await userPage.reload();
  userContent = await userPage.locator('.content').textContent();
  expect(userContent).toContain('Updated content');
  
  await adminContext.close();
  await userContext.close();
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 12. PAGE SCREENSHOT & COMPARISON ACROSS PAGES
 * ═══════════════════════════════════════════════════════════════════════════
 */

test('Compare visual state across multiple pages', async ({ context, page }) => {
  const page1 = page;
  const page2 = await context.newPage();
  
  // Load same page in both
  await page1.goto('https://example.com');
  await page2.goto('https://example.com');
  
  // Perform different actions on each
  await page1.locator('button').click();
  // page2 doesn't click anything
  
  // Compare screenshots
  const screenshot1 = await page1.screenshot();
  const screenshot2 = await page2.screenshot();
  
  // In real test, you'd compare these
  expect(screenshot1.length).toBeGreaterThan(0);
  expect(screenshot2.length).toBeGreaterThan(0);
  
  await page2.close();
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * QUICK REFERENCE CHEAT SHEET
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Opening Pages:
 *   const page2 = await context.newPage();
 *   const popup = await page.waitForPopup();
 * 
 * Closing Pages:
 *   await page.close();
 *   await context.close();
 * 
 * Multiple Contexts:
 *   const context = await browser.newContext();
 *   const page = await context.newPage();
 * 
 * Page Events:
 *   page.on('popup', (newPage) => {})
 *   page.on('close', () => {})
 *   page.once('dialog', (dialog) => {})
 * 
 * Checking Page State:
 *   page.isClosed()
 *   page.url()
 *   page.title()
 *   page.context()
 * 
 * Working with Multiple Pages:
 *   const pages = [page1, page2, page3];
 *   await Promise.all(pages.map(p => p.goto(...)));
 * 
 * Storage:
 *   await context.addCookies([...])
 *   await page.evaluate(() => localStorage.setItem(...))
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * INTERVIEW QUESTIONS ON WINDOW HANDLES & MULTIPLE PAGES
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Q1: What is the equivalent of Selenium's "window handles" in Playwright?
 * 
 * Answer:
 * In Selenium:
 * - Window handles are strings (e.g., "window-1", "window-2")
 * - You use driver.window_handles to get list of all handles
 * - You switch with driver.switch_to.window(handle)
 * 
 * In Playwright:
 * - Each page/tab is a Page object
 * - No "handles" - you work directly with Page objects
 * - Keep references to different Page objects
 * - No switching needed - just call methods on the Page object you want
 * 
 * Selenium vs Playwright Example:
 */
test.skip('Q1: Window handles Selenium vs Playwright', async ({ context, page }) => {
  // SELENIUM WAY:
  // handles = driver.window_handles
  // driver.switch_to.window(handles[1])
  // element = driver.find_element(...)
  
  // PLAYWRIGHT WAY:
  const page1 = page;
  const page2 = await context.newPage();
  
  // Just use the Page object you want - no switching
  await page1.goto('https://example.com/page1');
  await page2.goto('https://example.com/page2');
  
  // Interact with page2 directly
  await page2.locator('button').click();
  
  // Come back to page1 - no switching needed
  const content = await page1.locator('.content').textContent();
});

/**
 * Q2: How do you handle a pop-up window (new tab) that opens from a link click?
 * 
 * Answer:
 * Use page.waitForPopup() before the action that triggers the popup.
 * 
 * Pattern:
 * 1. Create a promise to wait for popup
 * 2. Perform action that opens popup
 * 3. Await the popup promise to get the new page
 * 4. Interact with the popup page
 * 5. Close the popup when done
 * 
 * Code Example:
 */
test.skip('Q2: Handle pop-up from link click', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Method 1: waitForPopup() - most common
  const popupPromise = page.waitForPopup();
  await page.click('a[target="_blank"]');
  const popup = await popupPromise;
  
  // Interact with popup
  console.log('Popup URL:', popup.url());
  await popup.close();
  
  // Method 2: waitForEvent (alternative)
  // const popupPromise = page.waitForEvent('popup');
  // await page.click('a[target="_blank"]');
  // const popup = await popupPromise;
});

/**
 * Q3: How do you open a new page/tab programmatically (not from user click)?
 * 
 * Answer:
 * Use context.newPage() to open a new page without user interaction.
 * This is different from waitForPopup() which catches user-triggered popups.
 * 
 * Code Example:
 */
test.skip('Q3: Open new page programmatically', async ({ context, page }) => {
  // Original page
  await page.goto('https://example.com');
  
  // Open new page programmatically
  const newPage = await context.newPage();
  await newPage.goto('https://google.com');
  
  // Both pages exist, interact with any of them
  console.log('Page 1:', page.url());
  console.log('Page 2:', newPage.url());
  
  // This is simulating opening a new tab manually
  // vs. waiting for a user action to open it
});

/**
 * Q4: What is a Browser Context and how is it different from a Page?
 * 
 * Answer:
 * - Page: A single tab or window (like a window in Selenium WebDriver)
 * - Context: An isolated browser environment (like an incognito window)
 * 
 * Key Differences:
 * 
 * PAGES in same context:
 * - Share cookies
 * - Share local storage
 * - Share session storage
 * - Share service workers
 * - Same user session
 * 
 * CONTEXTS are separate:
 * - Each has isolated cookies and storage
 * - Like opening incognito windows
 * - Different users simultaneously
 * - Better for testing multi-user scenarios
 * 
 * Code Example:
 */
test.skip('Q4: Context vs Page - storage isolation', async ({ browser }) => {
  // Create 2 contexts (like 2 users)
  const context1 = await browser.newContext();
  const context2 = await browser.newContext();
  
  // Pages in same context share storage
  const page1a = await context1.newPage();
  const page1b = await context1.newPage();
  
  // Set cookie in first page of context1
  await context1.addCookies([{
    name: 'user_id',
    value: 'user1',
    url: 'https://example.com',
  }]);
  
  // Second page in context1 sees the cookie
  const page1bCookies = await context1.cookies();
  console.log('Context1 cookies:', page1bCookies);
  
  // Context2 doesn't have cookie from context1 (isolated)
  const context2Cookies = await context2.cookies();
  console.log('Context2 cookies:', context2Cookies); // Empty
  
  await context1.close();
  await context2.close();
});

/**
 * Q5: How do you work with multiple pages simultaneously?
 * 
 * Answer:
 * Keep references to all Page objects and use them in parallel.
 * Use Promise.all() for parallel operations across pages.
 * 
 * Code Example:
 */
test.skip('Q5: Multiple pages simultaneously', async ({ context, page }) => {
  // Create multiple pages
  const page1 = page;
  const page2 = await context.newPage();
  const page3 = await context.newPage();
  
  // Load all pages in parallel
  await Promise.all([
    page1.goto('https://example.com/page1'),
    page2.goto('https://example.com/page2'),
    page3.goto('https://example.com/page3'),
  ]);
  
  // Perform actions in parallel
  await Promise.all([
    page1.fill('input[name="name"]', 'User 1'),
    page2.fill('input[name="name"]', 'User 2'),
    page3.fill('input[name="name"]', 'User 3'),
  ]);
  
  // Verify all pages
  await Promise.all([
    page1.click('button[type="submit"]'),
    page2.click('button[type="submit"]'),
    page3.click('button[type="submit"]'),
  ]);
});

/**
 * Q6: What is the difference between page.waitForPopup() and context.newPage()?
 * 
 * Answer:
 * 
 * page.waitForPopup():
 * - Waits for user-triggered popup (link click, window.open(), etc.)
 * - Must call before the action that opens popup
 * - Returns Promise that resolves when popup opens
 * - For handling popups from page interactions
 * 
 * context.newPage():
 * - Opens new page programmatically (no user interaction)
 * - Can call anytime
 * - Immediately returns a new Page object
 * - For opening new pages in code (testing scenarios)
 * 
 * Code Example:
 */
test.skip('Q6: waitForPopup vs newPage', async ({ context, page }) => {
  await page.goto('https://example.com');
  
  // Use waitForPopup for user-triggered popup
  const popupPromise = page.waitForPopup();
  await page.click('a[target="_blank"]'); // User action
  const popup1 = await popupPromise;
  
  // Use newPage for programmatic opening
  const popup2 = await context.newPage(); // Programmatic, no click needed
  
  await popup1.close();
  await popup2.close();
});

/**
 * Q7: How do you handle JavaScript dialogs (alert, confirm, prompt)?
 * 
 * Answer:
 * Dialogs are different from pages/popups.
 * Use page.on('dialog') or page.waitForEvent('dialog') to handle them.
 * 
 * Dialog types:
 * - alert: Can only accept (click OK)
 * - confirm: Can accept or dismiss
 * - prompt: Can accept with input or dismiss
 * - beforeunload: Can accept or dismiss
 * 
 * Code Example:
 */
test.skip('Q7: Handle JavaScript dialogs', async ({ page }) => {
  // Handle alert
  page.once('dialog', async (dialog) => {
    expect(dialog.type()).toBe('alert');
    console.log('Alert message:', dialog.message());
    await dialog.accept();
  });
  await page.click('button[onclick="alert(\'Hello\')"]');
  
  // Handle confirm
  page.once('dialog', async (dialog) => {
    expect(dialog.type()).toBe('confirm');
    console.log('Confirm message:', dialog.message());
    await dialog.accept(); // Click OK
    // or: await dialog.dismiss(); // Click Cancel
  });
  await page.click('button[onclick="confirm(\'Continue?\')"]');
  
  // Handle prompt
  page.once('dialog', async (dialog) => {
    expect(dialog.type()).toBe('prompt');
    console.log('Prompt message:', dialog.message());
    await dialog.accept('My Input'); // Provide input
  });
  await page.click('button[onclick="prompt(\'Enter name:\')"]');
});

/**
 * Q8: How do you share data between different pages/contexts?
 * 
 * Answer:
 * Pages in same context:
 * - Share localStorage and sessionStorage
 * - Share cookies
 * 
 * Pages in different contexts:
 * - Cannot share storage directly
 * - Use external variables or addCookies() to sync data
 * - Store data outside page context
 * 
 * Code Example:
 */
test.skip('Q8: Share data between pages', async ({ context, browser }) => {
  // Share within same context (via storage)
  const page1 = await context.newPage();
  const page2 = await context.newPage();
  
  await page1.goto('https://example.com');
  await page1.evaluate(() => {
    localStorage.setItem('userData', JSON.stringify({ userId: 123 }));
  });
  
  // page2 in same context can access storage
  await page2.goto('https://example.com');
  const userData = await page2.evaluate(() => {
    return JSON.parse(localStorage.getItem('userData') || '{}');
  });
  console.log('Shared data:', userData);
  
  // Share across different contexts
  const externalData = { userId: 456 };
  
  const context1 = await browser.newContext();
  const context2 = await browser.newContext();
  
  // Both contexts use same external data
  console.log('Context 1 data:', externalData);
  console.log('Context 2 data:', externalData);
  
  await context1.close();
  await context2.close();
});

/**
 * Q9: What happens when you close a page vs close a context?
 * 
 * Answer:
 * 
 * page.close():
 * - Closes only that single page/tab
 * - Other pages in same context remain open
 * - Page object becomes invalid after close
 * - Can still interact with other pages in context
 * 
 * context.close():
 * - Closes all pages in that context
 * - Context becomes invalid
 * - All Page objects in that context become invalid
 * - Browser itself remains open
 * 
 * browser.close():
 * - Closes entire browser
 * - All contexts and pages are closed
 * - Cannot use any page/context objects after
 * 
 * Code Example:
 */
test.skip('Q9: Close page vs context vs browser', async ({ browser }) => {
  const context = await browser.newContext();
  const page1 = await context.newPage();
  const page2 = await context.newPage();
  
  // Close single page
  await page1.close();
  console.log('Page 1 closed, page 2 still open');
  
  // page2 still works
  await page2.goto('https://example.com');
  
  // Close entire context
  await context.close();
  console.log('All pages in context closed');
  
  // Now we cannot use page1 or page2
  // Cannot call: await page2.goto(...) - will error
});

/**
 * Q10: How do you test concurrent user scenarios with multiple contexts?
 * 
 * Answer:
 * Create separate contexts for each user to simulate:
 * - Multiple users using app simultaneously
 * - Users with different permissions
 * - Different user sessions
 * - Race conditions or data conflicts
 * 
 * Code Example:
 */
test.skip('Q10: Multi-user testing with contexts', async ({ browser }) => {
  // Admin user
  const adminContext = await browser.newContext();
  const adminPage = await adminContext.newPage();
  await adminPage.goto('https://example.com/login');
  await adminPage.fill('input[name="email"]', 'admin@example.com');
  await adminPage.fill('input[name="password"]', 'admin123');
  await adminPage.click('button[type="submit"]');
  
  // Regular user
  const userContext = await browser.newContext();
  const userPage = await userContext.newPage();
  await userPage.goto('https://example.com/login');
  await userPage.fill('input[name="email"]', 'user@example.com');
  await userPage.fill('input[name="password"]', 'user123');
  await userPage.click('button[type="submit"]');
  
  // Guest user
  const guestContext = await browser.newContext();
  const guestPage = await guestContext.newPage();
  await guestPage.goto('https://example.com');
  
  // Test that each user sees appropriate content
  
  // Admin can see admin panel
  await adminPage.goto('https://example.com/admin');
  await expect(adminPage.locator('h1')).toContainText('Admin Panel');
  
  // Regular user cannot access admin panel
  await userPage.goto('https://example.com/admin');
  await expect(userPage).not.toHaveURL('**/admin');
  
  // Guest sees login prompt
  await guestPage.goto('https://example.com/dashboard');
  await expect(guestPage).not.toHaveURL('**/dashboard');
  
  // Cleanup
  await adminContext.close();
  await userContext.close();
  await guestContext.close();
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * END OF INTERVIEW QUESTIONS
 * ═══════════════════════════════════════════════════════════════════════════
 */
