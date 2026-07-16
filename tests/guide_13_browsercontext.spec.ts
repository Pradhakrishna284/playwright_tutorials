//https://www.youtube.com/watch?v=dWdLjXEZdIw&list=PLUDwpEzHYYLtvMVjc-Va3RXLKtdB-ofc2&index=13

import {test, expect, chromium, firefox, webkit} from '@playwright/test';

// Browser -- Browser Context -- Page

/*Browser:- A browser is a software application used to access and view websites. 
Examples include Google Chrome, Mozilla Firefox, Microsoft Edge, and Safari.

Browser Context:- A browser context is an isolated environment within a browser instance 
that allows you to create multiple independent sessions.
Each context can have its own cookies, cache, and settings, enabling parallel testing
of different scenarios without interference.
A browser context is like a separate browser profile running within the same browser instance.
It provides isolation between different sessions, allowing you to test multiple users/applications
or scenarios simultaneously.
Each context can have its own cookies, cache, and settings.

Page:- A page represents a single tab or window or popup within a browser context. 
It is where web content is loaded and interacted with.
Each page operates independently within its browser context, allowing you to 
navigate to different URLs, interact with elements, and perform actions specific to that page.

*/

//Basic example to demonstrate Browser and Page
//Here the browser to be launched by Playwright Test Runner
//is defined in the configuration file - playwright.config.ts
test('Browser and Page demo - browser in playwright.config.ts', async ({ browser }) => {
    // Create a new browser context
    const context = await browser.newContext();
    // Create a new page in the browser context
    const page = await context.newPage();
    // Navigate to a website
    await page.goto('https://testautomationpractice.blogspot.com/');
});

// Launch our own browser instance and demonstrate Browser, Browser Context and Page
test('Browser, Browser Context and Page demo - launch own browser', async () => {
    // Launch a new browser instance (using chromium instead of firefox)
    const mybrowser = await chromium.launch({ headless: false });

    // Create a new browser context
    const context = await mybrowser.newContext();

    // Create a new page in the browser context
    const page = await context.newPage();
    
    // Navigate to a website
    await page.goto('https://testautomationpractice.blogspot.com/');

    await page.waitForTimeout(5000);

    // Close the browser
    await mybrowser.close();
});

// Basic example to demonstrate Browser Context and Page
test('Browser Context demo', async ({ context }) => {
    // Create a new page in the browser context
    const page = await context.newPage();
    // Navigate to a website
    await page.goto('https://testautomationpractice.blogspot.com/');
})

// Basic example to demonstrate multiple Pages in a Browser Context
test('Multiple Pages in a Browser Context demo', async ({ context }) => {
    // Create first page
    const page1 = await context.newPage();
    await page1.goto('https://example.com');
    console.log(`Page 1 URL: ${page1.url()}`);
    // Create second page
    const page2 = await context.newPage();
    await page2.goto('https://google.com');
    console.log(`Page 2 URL: ${page2.url()}`);
});

//What is the advatage of browser context?
//Browser contexts provide isolation between different sessions, allowing you to test multiple users/applications
//or scenarios simultaneously without interference. Each context can have its own cookies, cache, and settings,
//enabling parallel testing of different scenarios.
test.only('Multiple Pages demo - create pages from context', async ({ context }) => {
    // Create 3 pages from context
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    const page3 = await context.newPage();
    await page1.goto('https://example.com');
    await page2.goto('https://google.com');
    await page3.goto('https://github.com');
    console.log(`No of pages created: ${context.pages().length}`);
    await page1.waitForTimeout(5000);
    await page2.waitForTimeout(5000);
    await page3.waitForTimeout(5000);
}); 
test('Get all pages from context demo', async ({ context }) => {
    // Create 2 pages
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    // Get context.pages()
    const pages = context.pages();
    console.log(`Total number of pages in context: ${pages.length}`);
    // Navigate each page to https://example.com
    for (const page of pages) {
        await page.goto('https://example.com');
    }
});
test('Share data across pages in same context demo', async ({ context }) => {
    // Add cookie to context with name 'shared' value 'data123'
    await context.addCookies([{ name: 'shared', value: 'data123', domain: 'example.com', path: '/' }]);
    // Create page1 and page2
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    // Both pages should have access to context cookies
    const cookies1 = await page1.context().cookies();   
    const cookies2 = await page2.context().cookies();
    console.log('Cookies in Page 1:', cookies1);
    console.log('Cookies in Page 2:', cookies2);
});
test('Get page URL and title demo', async ({ page }) => {
    // Navigate to https://example.com
    await page.goto('https://example.com');
    // Get page.url() and verify it contains 'example'
    const url = page.url();
    console.log(`Page URL: ${url}`);
    // Get page.title() and verify it contains 'Example'
    const title = await page.title();
    console.log(`Page Title: ${title}`);
});
test('Navigate back and forward demo', async ({ page }) => {
    // Navigate to https://example.com
    await page.goto('https://example.com');
    // Navigate to https://example.com/about (or similar)
    await page.goto('https://example.com/about');       
    // Use page.goBack()
    await page.goBack();
    console.log(`After going back, URL: ${page.url()}`);
    // Use page.goForward()
    await page.goForward();
    console.log(`After going forward, URL: ${page.url()}`);
});
test('Reload page demo', async ({ page }) => {
    // Navigate to https://example.com
    await page.goto('https://example.com');
    console.log(`Before reload, URL: ${page.url()}`);
    // Reload the page
    await page.reload();
    console.log(`After reload, URL: ${page.url()}`);
});
test.describe('Practice: Browser Context and Page Exercises', () => {
  
  test('EXERCISE 8: Create and navigate multiple pages', async ({ context }) => {   
    // 1. Create 3 pages from context
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    const page3 = await context.newPage();
    // 2. Navigate page1 to https://example.com
    await page1.goto('https://example.com');
    // 3. Navigate page2 to https://google.com
    await page2.goto('https://google.com');
    // 4. Navigate page3 to https://github.com
    await page3.goto('https://github.com');
    // 5. Verify each has different URL
    console.log(`Page 1 URL: ${page1.url()}`);
    console.log(`Page 2 URL: ${page2.url()}`);
    console.log(`Page 3 URL: ${page3.url()}`);
    expect(page1.url()).not.toBe(page2.url());
    expect(page1.url()).not.toBe(page3.url());
    expect(page2.url()).not.toBe(page3.url());
    // 6. Close all pages
    await page1.close();
    await page2.close();
    await page3.close();
  });
    test('EXERCISE 9: Get all pages from context', async ({ context }) => {
    // 1. Create 2 pages
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    // 2. Get context.pages()
    const pages = context.pages();
    // 3. Verify length is 2
    expect(pages.length).toBe(2);
    // 4. Navigate each page to https://example.com
    for (const page of pages) {
        await page.goto('https://example.com');
    }
    // 5. Close pages in a loop using context.pages()
    for (const page of context.pages()) {
        await page.close();
    }
    });
    test('EXERCISE 10: Share data across pages in same context', async ({ context }) => {   
    // 1. Add cookie to context with name 'shared' value 'data123'
    await context.addCookies([{ name: 'shared', value: 'data123', domain: 'example.com', path: '/' }]);
    // 2. Create page1 and page2
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    // 3. Get cookies from context (should show shared cookie)
    const cookies = await context.cookies();
    console.log('Cookies in Context:', cookies);
    // 4. Both pages should have access to context cookies
    const cookies1 = await page1.context().cookies();
    const cookies2 = await page2.context().cookies();
    // 5. Verify both pages can see the same cookie
    const cookie1 = cookies1.find(cookie => cookie.name === 'shared');
    const cookie2 = cookies2.find(cookie => cookie.name === 'shared');
    expect(cookie1).toBeDefined();
    expect(cookie2).toBeDefined();
    expect(cookie1?.value).toBe('data123');
    expect(cookie2?.value).toBe('data123'); 
    // 6. Cleanup
    await page1.close();
    await page2.close();
  });
    test('EXERCISE 11: Get page URL and title', async ({ page }) => {   
    // 1. Navigate to https://example.com
    await page.goto('https://example.com');
    // 2. Get page.url() and verify it contains 'example'
    const url = page.url();
    expect(url).toContain('example');
    // 3. Get page.title() and verify it's not empty
    const title = await page.title();
    expect(title).not.toBe('');
    // 4. Check page.isClosed() and verify it's false
    const isClosed = page.isClosed();
    expect(isClosed).toBe(false);
    });
    test('EXERCISE 12: Navigate back and forward', async ({ page }) => {   
    // 1. Navigate to https://example.com
    await page.goto('https://example.com');
        
        
    // 2. Navigate to https://example.com/about (or similar)
    await page.goto('https://example.com/about');
    // 3. Store both URLs
    const firstURL = 'https://example.com';
    const secondURL = 'https://example.com/about';
    // 4. Use page.goBack()
    await page.goBack();
    // 5. Verify you're on first URL
    expect(page.url()).toBe(firstURL);
    // 6. Use page.goForward()
    await page.goForward();
    // 7. Verify you're on second URL
    expect(page.url()).toBe(secondURL);
    });
    test('EXERCISE 13: Reload page', async ({ page }) => {   
    // 1. Navigate to https://example.com
    await page.goto('https://example.com'); 
    console.log(`Before reload, URL: ${page.url()}`);
    // 2. Store the URL
    const currentURL = page.url();  
    // 3. Reload with page.reload()
    await page.reload();
    console.log(`After reload, URL: ${page.url()}`);
    // 4. Verify URL is still the same
    expect(page.url()).toBe(currentURL);
  });
});
