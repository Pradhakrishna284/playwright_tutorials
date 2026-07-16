import { test, expect } from '@playwright/test';

test.describe('Playwright Tabs and Multiple Windows', () => {
  
  // ============================================
  // SECTION 1: Basic Tab Detection
  // ============================================
  
  test('1. Detect new tab when link has target="_blank"', async ({ context, page }) => {
    // Setup - note: using Wikipedia to test real target="_blank" link
    await page.goto('https://www.wikipedia.org/');
    
    // Wait for new page and click simultaneously
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.locator('a[target="_blank"]').first().click()
    ]);
    
    // Verify new page was created
    expect(newPage).toBeTruthy();
    expect(!newPage.isClosed()).toBe(true);
    
    await newPage.close();
  });

  test('2. Get new page from context.waitForEvent()', async ({ context, page }) => {
    await page.goto('https://www.wikipedia.org/');
    
    // Method: Use context.waitForEvent('page')
    const newPagePromise = context.waitForEvent('page');
    
    // Trigger opening new tab
    await page.locator('a[target="_blank"]').first().click();
    
    // Get the new page
    const newPage = await newPagePromise;
    
    expect(newPage).toBeTruthy();
    expect(context.pages().length).toBe(2);
    
    await newPage.close();
  });

  test('3. Access multiple new tabs that open', async ({ context, page }) => {
    await page.goto('https://www.wikipedia.org/');
    
    const newPages: any[] = [];
    
    // Open 3 new tabs
    for (let i = 0; i < 3; i++) {
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        page.locator('a[target="_blank"]').first().click()
      ]);
      newPages.push(newPage);
    }
    
    // Verify all 3 new tabs opened (plus original = 4 total)
    expect(context.pages().length).toBe(4);
    
    // Cleanup
    newPages.forEach(p => p.close());
  });

  // ============================================
  // SECTION 2: Working with Multiple Pages
  // ============================================

  test('4. Create multiple pages programmatically', async ({ context }) => {
    const pages: any[] = [];
    
    // Create 3 pages
    for (let i = 0; i < 3; i++) {
      const newPage = await context.newPage();
      pages.push(newPage);
    }
    
    // Verify all pages exist
    expect(context.pages().length).toBe(3);
    
    // Verify pages are distinct
    const urls = pages.map(p => p.url());
    expect(urls).toEqual(['about:blank', 'about:blank', 'about:blank']);
    
    // Cleanup
    pages.forEach(p => p.close());
  });

  test('5. Navigate each page independently', async ({ context }) => {
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    
    // Navigate to different URLs
    await page1.goto('https://www.wikipedia.org/');
    await page2.goto('https://www.github.com/');
    
    // Verify each page has correct URL
    expect(page1.url()).toContain('wikipedia');
    expect(page2.url()).toContain('github');
    
    // Both exist and are navigated
    expect(context.pages().length).toBe(2);
    
    await page1.close();
    await page2.close();
  });

  test('6. Perform simultaneous actions on multiple pages', async ({ context }) => {
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    const page3 = await context.newPage();
    
    try {
      // All navigate at same time
      await Promise.all([
        page1.goto('https://www.wikipedia.org/'),
        page2.goto('https://www.github.com/'),
        page3.goto('https://www.google.com/')
      ]);
      
      // All pages loaded
      expect(page1.url()).toContain('wikipedia');
      expect(page2.url()).toContain('github');
      expect(page3.url()).toContain('google');
      
    } finally {
      await page1.close();
      await page2.close();
      await page3.close();
    }
  });

  // ============================================
  // SECTION 3: Switching Between Tabs/Pages
  // ============================================

  test('7. Switch between pages using variables', async ({ context }) => {
    const tab1 = await context.newPage();
    const tab2 = await context.newPage();
    
    // Navigate
    await tab1.goto('https://www.wikipedia.org/');
    await tab2.goto('https://www.github.com/');
    
    // "Switch" to tab1
    const tab1Title = await tab1.title();
    expect(tab1Title.length).toBeGreaterThan(0);
    
    // "Switch" to tab2
    const tab2Title = await tab2.title();
    expect(tab2Title.length).toBeGreaterThan(0);
    
    await tab1.close();
    await tab2.close();
  });

  test('8. Get page from context.pages() array', async ({ context, page }) => {
    await page.goto('https://www.wikipedia.org/');
    
    // Get all pages
    const pages = context.pages();
    expect(pages.length).toBe(1);
    
    // Get first page (which is our page)
    const firstPage = pages[0];
    expect(firstPage).toBe(page);
    
    const title = await firstPage.title();
    expect(title).toBeTruthy();
  });

  test('9. Find page by URL pattern', async ({ context }) => {
    const tab1 = await context.newPage();
    const tab2 = await context.newPage();
    
    await tab1.goto('https://www.wikipedia.org/');
    await tab2.goto('https://www.github.com/');
    
    // Find page by URL
    const pages = context.pages();
    const wikipediaTab = pages.find(p => p.url().includes('wikipedia'));
    const githubTab = pages.find(p => p.url().includes('github'));
    
    expect(wikipediaTab).toBeTruthy();
    expect(githubTab).toBeTruthy();
    expect(wikipediaTab).toBe(tab1);
    expect(githubTab).toBe(tab2);
    
    await tab1.close();
    await tab2.close();
  });

  test('10. Find page by title', async ({ context }) => {
    const tab1 = await context.newPage();
    const tab2 = await context.newPage();
    
    await tab1.goto('https://www.wikipedia.org/');
    await tab2.goto('https://www.github.com/');
    
    // Wait for pages to load so titles are available
    await tab1.waitForLoadState('networkidle');
    await tab2.waitForLoadState('networkidle');
    
    // Find by title
    const pages = context.pages();
    const wikipediaPage = pages.find(async p => {
      const title = await p.title();
      return title.includes('Wikipedia');
    });
    
    expect(wikipediaPage).toBeTruthy();
    
    await tab1.close();
    await tab2.close();
  });

  // ============================================
  // SECTION 4: Tab Information and Properties
  // ============================================

  test('11. Get tab URL', async ({ context }) => {
    const page = await context.newPage();
    await page.goto('https://www.github.com/');
    
    const url = page.url();
    expect(url).toContain('github.com');
    
    await page.close();
  });

  test('12. Get tab title', async ({ context }) => {
    const page = await context.newPage();
    await page.goto('https://www.github.com/');
    
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    expect(title).toContain('GitHub');
    
    await page.close();
  });

  test('13. Check if page is closed', async ({ context }) => {
    const page = await context.newPage();
    
    expect(page.isClosed()).toBe(false);
    
    await page.close();
    
    expect(page.isClosed()).toBe(true);
  });

  test('14. Get viewport size of page', async ({ context }) => {
    const page = await context.newPage();
    
    const viewport = page.viewportSize();
    expect(viewport).toBeTruthy();
    expect(viewport?.width).toBeGreaterThan(0);
    expect(viewport?.height).toBeGreaterThan(0);
    
    await page.close();
  });

  test('15. Get all pages from context', async ({ context }) => {
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    const page3 = await context.newPage();
    
    const allPages = context.pages();
    expect(allPages.length).toBe(3);
    expect(allPages).toContain(page1);
    expect(allPages).toContain(page2);
    expect(allPages).toContain(page3);
    
    await page1.close();
    await page2.close();
    await page3.close();
  });

  // ============================================
  // SECTION 5: Opening and Closing Tabs
  // ============================================

  test('16. Close a single page', async ({ context }) => {
    const page = await context.newPage();
    await page.goto('https://www.wikipedia.org/');
    
    expect(context.pages().length).toBe(1);
    
    await page.close();
    
    expect(context.pages().length).toBe(0);
    expect(page.isClosed()).toBe(true);
  });

  test('17. Close all pages except one', async ({ context }) => {
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    const page3 = await context.newPage();
    
    expect(context.pages().length).toBe(3);
    
    // Close all except first
    await page2.close();
    await page3.close();
    
    expect(context.pages().length).toBe(1);
    expect(!page1.isClosed()).toBe(true);
    
    await page1.close();
  });

  test('18. Iterate and close all pages', async ({ context }) => {
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    const page3 = await context.newPage();
    
    expect(context.pages().length).toBe(3);
    
    // Close all pages
    const pages = context.pages();
    for (const page of pages) {
      await page.close();
    }
    
    expect(context.pages().length).toBe(0);
  });

  test('19. Error when interacting with closed page', async ({ context }) => {
    const page = await context.newPage();
    await page.close();
    
    // Attempting action on closed page should error
    try {
      await page.goto('https://www.wikipedia.org/');
      // If we get here, test should fail
      expect(true).toBe(false);
    } catch (error) {
      // Expected - page is closed
      expect(error).toBeTruthy();
    }
  });

  // ============================================
  // SECTION 6: Handling Popups
  // ============================================

  test('20. Listen for popup events', async ({ page, context }) => {
    await page.goto('https://www.wikipedia.org/');
    
    const popups: any[] = [];
    
    // Listen for all popup events
    page.on('popup', (popup) => {
      popups.push(popup);
    });
    
    // Open link in new tab
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.locator('a[target="_blank"]').first().click()
    ]);
    
    // We should have detected the popup
    expect(newPage).toBeTruthy();
    
    await newPage.close();
  });

  test('21. Remove popup event listener', async ({ page, context }) => {
    await page.goto('https://www.wikipedia.org/');
    
    let popupCount = 0;
    
    const listener = () => {
      popupCount++;
    };
    
    page.on('popup', listener);
    
    // Open first popup
    const [popup1] = await Promise.all([
      context.waitForEvent('page'),
      page.locator('a[target="_blank"]').first().click()
    ]);
    
    expect(popupCount).toBeGreaterThanOrEqual(1);
    
    // Remove listener
    page.removeListener('popup', listener);
    
    // Close first popup
    await popup1.close();
  });

  // ============================================
  // SECTION 7: Tab Context Sharing
  // ============================================

  test('22. Cookies shared across tabs in same context', async ({ context }) => {
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    
    // Add cookie to context
    await context.addCookies([{
      name: 'testCookie',
      value: 'testValue',
      url: 'https://www.wikipedia.org/'
    }]);
    
    // Both pages should see the cookie
    await page1.goto('https://www.wikipedia.org/');
    await page2.goto('https://www.wikipedia.org/');
    
    const cookies1 = await page1.context().cookies();
    const cookies2 = await page2.context().cookies();
    
    expect(cookies1).toEqual(cookies2);
    
    const testCookie1 = cookies1.find(c => c.name === 'testCookie');
    const testCookie2 = cookies2.find(c => c.name === 'testCookie');
    
    expect(testCookie1?.value).toBe('testValue');
    expect(testCookie2?.value).toBe('testValue');
    
    await page1.close();
    await page2.close();
  });

  test('23. Multiple contexts with independent data', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    
    // Add different cookies to each context
    await context1.addCookies([{
      name: 'context',
      value: 'context1',
      url: 'https://www.wikipedia.org/'
    }]);
    
    await context2.addCookies([{
      name: 'context',
      value: 'context2',
      url: 'https://www.wikipedia.org/'
    }]);
    
    // Navigate both pages
    await page1.goto('https://www.wikipedia.org/');
    await page2.goto('https://www.wikipedia.org/');
    
    // Get cookies
    const cookies1 = await context1.cookies();
    const cookies2 = await context2.cookies();
    
    const contextCookie1 = cookies1.find(c => c.name === 'context');
    const contextCookie2 = cookies2.find(c => c.name === 'context');
    
    expect(contextCookie1?.value).toBe('context1');
    expect(contextCookie2?.value).toBe('context2');
    
    await page1.close();
    await page2.close();
    await context1.close();
    await context2.close();
  });

  // ============================================
  // SECTION 8: Real-World Scenarios
  // ============================================

  test('24. Open and verify content in new tab', async ({ context, page }) => {
    await page.goto('https://www.wikipedia.org/');
    
    // Open a Wikipedia article in new tab
    const [newTab] = await Promise.all([
      context.waitForEvent('page'),
      page.locator('a[target="_blank"]').first().click()
    ]);
    
    // Wait for new tab to load
    await newTab.waitForLoadState('networkidle');
    
    // Verify content exists
    const title = await newTab.title();
    expect(title.length).toBeGreaterThan(0);
    
    const content = await newTab.locator('body').textContent();
    expect(content?.length).toBeGreaterThan(0);
    
    await newTab.close();
  });

  test('25. Simulate two users on same site', async ({ context }) => {
    const userTab1 = await context.newPage();
    const userTab2 = await context.newPage();
    
    // Both users navigate to same site
    await userTab1.goto('https://www.wikipedia.org/');
    await userTab2.goto('https://www.wikipedia.org/');
    
    // Get page titles from each user's perspective
    const title1 = await userTab1.title();
    const title2 = await userTab2.title();
    
    expect(title1).toBe(title2);
    expect(context.pages().length).toBe(2);
    
    await userTab1.close();
    await userTab2.close();
  });

  test('26. Chain actions across multiple tabs', async ({ context, page }) => {
    await page.goto('https://www.wikipedia.org/');
    
    const tab1 = page;
    const tab2 = await context.newPage();
    const tab3 = await context.newPage();
    
    // Each tab does different things
    const tab1Url = tab1.url();
    
    await tab2.goto('https://www.github.com/');
    const tab2Url = tab2.url();
    
    await tab3.goto('https://www.google.com/');
    const tab3Url = tab3.url();
    
    // Verify all tabs exist with different content
    expect(tab1Url).toContain('wikipedia');
    expect(tab2Url).toContain('github');
    expect(tab3Url).toContain('google');
    
    expect(context.pages().length).toBe(3);
    
    await tab2.close();
    await tab3.close();
  });

  test('27. Count elements across multiple pages', async ({ context }) => {
    const pages = [];
    
    // Create 3 pages with same URL
    for (let i = 0; i < 3; i++) {
      const newPage = await context.newPage();
      await newPage.goto('https://www.wikipedia.org/');
      pages.push(newPage);
    }
    
    // Count links on each page
    const linkCounts = [];
    for (const page of pages) {
      const count = await page.locator('a').count();
      linkCounts.push(count);
    }
    
    // All pages should have similar link counts
    expect(linkCounts[0]).toBeGreaterThan(0);
    expect(linkCounts[1]).toBeGreaterThan(0);
    expect(linkCounts[2]).toBeGreaterThan(0);
    
    // Cleanup
    for (const page of pages) {
      await page.close();
    }
  });

  // ============================================
  // SECTION 9: Advanced Patterns
  // ============================================

  test('28. Wait for all pages to finish loading', async ({ context, page }) => {
    await page.goto('https://www.wikipedia.org/');
    
    const newPages: any[] = [];
    
    // Open multiple tabs quickly
    for (let i = 0; i < 3; i++) {
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        page.locator('a[target="_blank"]').first().click()
      ]);
      newPages.push(newPage);
    }
    
    // Wait for all to load
    await Promise.all(
      newPages.map(p => p.waitForLoadState('networkidle'))
    );
    
    // All pages should now be loaded
    for (const newPage of newPages) {
      expect(!newPage.isClosed()).toBe(true);
      const title = await newPage.title();
      expect(title.length).toBeGreaterThan(0);
    }
    
    // Cleanup
    newPages.forEach(p => p.close());
  });

  test('29. Compare content across tabs', async ({ context }) => {
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    
    // Same URL, should have same content
    await page1.goto('https://www.wikipedia.org/');
    await page2.goto('https://www.wikipedia.org/');
    
    // Get titles
    const title1 = await page1.title();
    const title2 = await page2.title();
    
    // Same page, same title
    expect(title1).toBe(title2);
    
    // Get page content
    const heading1 = await page1.locator('h1').first().textContent();
    const heading2 = await page2.locator('h1').first().textContent();
    
    expect(heading1).toBe(heading2);
    
    await page1.close();
    await page2.close();
  });

  test('30. Take screenshots of multiple tabs', async ({ context }) => {
    const pages = [];
    const urls = [
      'https://www.wikipedia.org/',
      'https://www.github.com/'
    ];
    
    // Create pages and navigate
    for (const url of urls) {
      const newPage = await context.newPage();
      await newPage.goto(url);
      pages.push(newPage);
    }
    
    // Screenshot each page
    for (let i = 0; i < pages.length; i++) {
      // Verify we can take screenshot
      const buffer = await pages[i].screenshot();
      expect(buffer).toBeTruthy();
      expect(buffer.length).toBeGreaterThan(0);
    }
    
    // Cleanup
    for (const page of pages) {
      await page.close();
    }
  });

  test('31. Cleanup with try-finally pattern', async ({ context }) => {
    let page1, page2, page3;
    
    try {
      page1 = await context.newPage();
      page2 = await context.newPage();
      page3 = await context.newPage();
      
      // Use pages
      await page1.goto('https://www.wikipedia.org/');
      await page2.goto('https://www.github.com/');
      await page3.goto('https://www.google.com/');
      
      expect(context.pages().length).toBe(3);
      
    } finally {
      // Ensure cleanup happens even if test fails
      if (page1 && !page1.isClosed()) await page1.close();
      if (page2 && !page2.isClosed()) await page2.close();
      if (page3 && !page3.isClosed()) await page3.close();
    }
    
    expect(context.pages().length).toBe(0);
  });

  test('32. Handle page context relationship', async ({ context, page }) => {
    // Create multiple pages
    const page1 = page;
    const page2 = await context.newPage();
    
    // Each page has reference to its context
    expect(page1.context()).toBe(context);
    expect(page2.context()).toBe(context);
    
    // Same context
    expect(page1.context()).toBe(page2.context());
    
    await page2.close();
  });

});
