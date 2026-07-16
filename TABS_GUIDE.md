# Tabs and Multiple Windows - Complete Guide

## Table of Contents
1. [Understanding Tabs in Playwright](#understanding-tabs-in-playwright)
2. [Opening New Tabs](#opening-new-tabs)
3. [Handling Popups and New Windows](#handling-popups-and-new-windows)
4. [Switching Between Tabs](#switching-between-tabs)
5. [Tab Information and Properties](#tab-information-and-properties)
6. [Common Patterns](#common-patterns)
7. [Real-World Examples](#real-world-examples)
8. [Best Practices](#best-practices)

---

## Understanding Tabs in Playwright

### What is a Tab?

In Playwright, a **tab** is represented by a `Page` object. When you:
- Click a link with `target="_blank"`
- Open a new window
- Navigate with JavaScript's `window.open()`

A new `Page` is created within the same `BrowserContext`.

### Key Differences from WebDriver

| Feature | Playwright | WebDriver |
|---------|-----------|----------|
| Handle tabs | Page objects | Switch windows |
| Auto-detect new tabs | Yes, via events | Manual switching |
| Tab data access | Direct from page | Must switch windows |
| Close tabs | `await page.close()` | `driver.close()` |

### Important Concepts

```javascript
// One page = One tab in browser
// Switching between pages = Switching between tabs
// Closing a page = Closing a tab

const page1 = await context.newPage();  // New tab 1
const page2 = await context.newPage();  // New tab 2

await page1.goto('url1');              // Page 1 actions
await page2.goto('url2');              // Page 2 actions

// Both pages exist simultaneously
```

---

## Opening New Tabs

### Method 1: Click Link with target="_blank"

```javascript
// HTML: <a href="https://example.com" target="_blank">Open New Tab</a>

// Wait for new page and click simultaneously
const [newPage] = await Promise.all([
  context.waitForEvent('page'),
  page.locator('a').click()
]);

// Now you have both pages
console.log(page.url());      // Original page URL
console.log(newPage.url());   // New tab URL
```

### Method 2: Using page.waitForEvent('popup')

```javascript
// Some sites use popup windows instead of new tabs
page.on('popup', newPage => {
  console.log('Popup detected:', newPage.url());
});

// Or wait for specific popup
const [popup] = await Promise.all([
  page.waitForEvent('popup'),
  page.locator('button[data-action="popup"]').click()
]);
```

### Method 3: Using context.waitForEvent('page')

```javascript
// Most reliable method for detecting new pages/tabs
const newPagePromise = context.waitForEvent('page');

// Action that triggers new tab
await page.locator('a[target="_blank"]').click();

// Get the new page
const newPage = await newPagePromise;
expect(newPage.url()).toContain('example.com');
```

### Method 4: JavaScript window.open()

```javascript
// If page uses window.open() instead of links
const newPagePromise = context.waitForEvent('page');

await page.evaluate(() => {
  window.open('https://example.com', '_blank');
});

const newPage = await newPagePromise;
```

### Method 5: Creating Tabs Programmatically

```javascript
// Create new tabs without user action
const tab1 = await context.newPage();
const tab2 = await context.newPage();
const tab3 = await context.newPage();

// Navigate each tab
await tab1.goto('https://example.com');
await tab2.goto('https://google.com');
await tab3.goto('https://github.com');

// All tabs exist in same context
const allPages = context.pages();
expect(allPages.length).toBe(3);
```

---

## Handling Popups and New Windows

### Detecting Popups

```javascript
// Listen for all popups
page.on('popup', popup => {
  console.log('New popup:', popup.url());
});

// Wait for specific popup
const [popup] = await Promise.all([
  page.waitForEvent('popup'),
  page.locator('button').click()
]);

// Get popup URL and title
const title = await popup.title();
const url = popup.url();
console.log(`${title} - ${url}`);
```

### Waiting for Multiple Tabs

```javascript
// Wait for multiple new tabs to open
const newPages = [];

// Set up listeners
context.on('page', page => {
  newPages.push(page);
});

// Trigger action that opens multiple tabs
await page.locator('a').click();  // Opens tab 2
await page.locator('a').click();  // Opens tab 3
await page.locator('a').click();  // Opens tab 4

// Wait for all to load
await Promise.all(newPages.map(p => p.waitForLoadState()));

// Now all 4 pages are loaded
expect(context.pages().length).toBe(4);
```

### Handling Popup Dialogs

```javascript
// Note: Dialogs (alert, confirm, prompt) are different from tabs
page.on('dialog', async dialog => {
  console.log('Dialog:', dialog.message());
  await dialog.accept();  // or dismiss()
});
```

---

## Switching Between Tabs

### Method 1: Using Page Variables

```javascript
// Keep references to pages
const tab1 = await context.newPage();
const tab2 = await context.newPage();

// Navigate
await tab1.goto('https://example.com');
await tab2.goto('https://google.com');

// "Switch" by using different variable
await tab1.locator('button').click();  // Actions on tab1
await tab2.locator('input').fill('text');  // Actions on tab2

// Both operations happen simultaneously
```

### Method 2: Get All Pages from Context

```javascript
// Get all open pages
const pages = context.pages();
console.log(`Open tabs: ${pages.length}`);

// Access specific page
const firstTab = pages[0];
const lastTab = pages[pages.length - 1];

// Perform actions
await firstTab.screenshot();
await lastTab.close();
```

### Method 3: Find Page by URL

```javascript
// Find page by URL pattern
const pages = context.pages();
const googleTab = pages.find(p => p.url().includes('google'));
const githubTab = pages.find(p => p.url().includes('github'));

if (googleTab) {
  await googleTab.locator('input').fill('playwright');
  await googleTab.locator('button').click();
}
```

### Method 4: Find Page by Title

```javascript
// Find page by title
const pages = context.pages();
const homePage = pages.find(async p => {
  return (await p.title()) === 'Home - Example';
});

if (homePage) {
  const heading = await homePage.locator('h1').textContent();
  console.log(heading);
}
```

### Method 5: Iterate Through All Tabs

```javascript
// Perform actions on each tab
const pages = context.pages();

for (const page of pages) {
  const title = await page.title();
  const url = page.url();
  console.log(`${title} - ${url}`);
  
  // Take screenshot of each tab
  await page.screenshot({ path: `tab-${pages.indexOf(page)}.png` });
}
```

---

## Tab Information and Properties

### Getting Tab Information

```javascript
// URL
const url = page.url();
console.log('Current URL:', url);

// Title
const title = await page.title();
console.log('Page title:', title);

// Check if closed
const isClosed = page.isClosed();
console.log('Page closed:', isClosed);

// Get viewport
const viewport = page.viewportSize();
console.log('Viewport:', viewport);

// Get all pages in context
const allPages = context.pages();
console.log(`Total pages: ${allPages.length}`);

// Get page context
const ctx = page.context();
console.log('Context:', ctx);
```

### Comparing Tabs

```javascript
const pages = context.pages();

for (let i = 0; i < pages.length; i++) {
  const page = pages[i];
  const title = await page.title();
  const url = page.url();
  
  console.log(`Tab ${i + 1}: ${title}`);
  console.log(`URL: ${url}`);
  console.log('---');
}
```

### Tab Active Status

```javascript
// Playwright doesn't track which tab is "active" in browser UI
// But you can track which page you're interacting with

let activeTab = page;

// When you perform actions on a page, that's the "active" one
await activeTab.goto('https://example.com');
await activeTab.locator('button').click();

// Switch active tab
activeTab = newPage;
await activeTab.goto('https://google.com');
```

---

## Common Patterns

### Pattern 1: Open Tab and Verify Content

```javascript
// Open link in new tab
const [newTab] = await Promise.all([
  context.waitForEvent('page'),
  page.locator('a[data-test="external-link"]').click()
]);

// Wait for new tab to load
await newTab.waitForLoadState('networkidle');

// Verify content
const heading = await newTab.locator('h1').textContent();
expect(heading).toContain('Expected Text');

// Close new tab
await newTab.close();
```

### Pattern 2: Multiple Tabs for Cross-Tab Testing

```javascript
// Open multiple tabs
const tab1 = await context.newPage();
const tab2 = await context.newPage();
const tab3 = await context.newPage();

try {
  // Tab 1: Navigate and perform action
  await tab1.goto('https://example.com');
  await tab1.locator('button').click();
  
  // Tab 2: Different action
  await tab2.goto('https://example.com');
  await tab2.locator('input[type="email"]').fill('test@example.com');
  
  // Tab 3: Another action
  await tab3.goto('https://example.com/admin');
  const adminContent = await tab3.locator('.admin-panel').textContent();
  
  // All actions happen in parallel
  expect(adminContent).toBeTruthy();
  
} finally {
  // Cleanup all tabs
  await tab1.close();
  await tab2.close();
  await tab3.close();
}
```

### Pattern 3: Tab Communication via Shared Context

```javascript
// Add cookie to context (visible in all tabs)
await context.addCookies([{
  name: 'sessionId',
  value: 'abc123',
  url: 'https://example.com'
}]);

const tab1 = await context.newPage();
const tab2 = await context.newPage();

await tab1.goto('https://example.com');
await tab2.goto('https://example.com');

// Both tabs see the same cookie
const cookies1 = await context.cookies();
const cookies2 = await context.cookies();

expect(cookies1).toEqual(cookies2);
```

### Pattern 4: Close All Tabs Except One

```javascript
const pages = context.pages();

// Close all except first tab
for (let i = 1; i < pages.length; i++) {
  await pages[i].close();
}

// Only original page remains
expect(context.pages().length).toBe(1);
```

### Pattern 5: Wait for All Tabs to Load

```javascript
// Open multiple tabs
const newPages = [];

for (let i = 0; i < 3; i++) {
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.locator('a[target="_blank"]').click()
  ]);
  newPages.push(newPage);
}

// Wait for all to finish loading
await Promise.all(
  newPages.map(p => p.waitForLoadState('networkidle'))
);

// All tabs are ready
console.log('All tabs loaded');
```

---

## Real-World Examples

### Example 1: Testing File Download in New Tab

```javascript
test('download file in new tab', async ({ context, page }) => {
  await page.goto('https://example.com/files');
  
  // Download triggers new tab (or window)
  const [downloadPage] = await Promise.all([
    context.waitForEvent('page'),
    page.locator('a[data-action="download"]').click()
  ]);
  
  // Verify download page
  await downloadPage.waitForLoadState();
  const content = await downloadPage.textContent('body');
  expect(content).toContain('Thank you for downloading');
  
  // Close download tab
  await downloadPage.close();
});
```

### Example 2: Cross-Tab Form Testing

```javascript
test('form submission across tabs', async ({ context, page }) => {
  await page.goto('https://example.com/form');
  
  // Open confirmation page in new tab
  const [confirmTab] = await Promise.all([
    context.waitForEvent('page'),
    page.locator('button:has-text("Open Confirmation")').click()
  ]);
  
  // Fill form in first tab
  await page.locator('input[name="email"]').fill('test@example.com');
  await page.locator('input[name="name"]').fill('John Doe');
  
  // Submit form
  const submitPromise = page.waitForNavigation();
  await page.locator('button[type="submit"]').click();
  await submitPromise;
  
  // Check confirmation in second tab
  const message = await confirmTab.locator('.success-message').textContent();
  expect(message).toContain('Success');
  
  await confirmTab.close();
});
```

### Example 3: OAuth Flow with New Tab

```javascript
test('oauth authentication in new tab', async ({ context, page }) => {
  await page.goto('https://example.com/login');
  
  // Click "Login with Google" opens new tab
  const [authTab] = await Promise.all([
    context.waitForEvent('page'),
    page.locator('button:has-text("Google")').click()
  ]);
  
  // In auth tab: sign in
  await authTab.locator('input[type="email"]').fill('user@gmail.com');
  await authTab.locator('button').click();
  
  await authTab.locator('input[type="password"]').fill('password123');
  await authTab.locator('button:has-text("Next")').click();
  
  // Wait for redirect back to original page
  await page.waitForNavigation();
  
  // Verify logged in
  const userMenu = await page.locator('.user-menu').isVisible();
  expect(userMenu).toBe(true);
  
  await authTab.close();
});
```

### Example 4: Multi-Tab Search Comparison

```javascript
test('compare search results across tabs', async ({ context, page }) => {
  const googleTab = await context.newPage();
  const bingTab = await context.newPage();
  
  try {
    // Search on Google
    await googleTab.goto('https://google.com');
    await googleTab.locator('input[name="q"]').fill('playwright testing');
    await googleTab.locator('input[name="q"]').press('Enter');
    await googleTab.waitForLoadState('networkidle');
    
    const googleResults = await googleTab.locator('a h3').count();
    
    // Search on Bing
    await bingTab.goto('https://bing.com');
    await bingTab.locator('input[name="q"]').fill('playwright testing');
    await bingTab.locator('input[name="q"]').press('Enter');
    await bingTab.waitForLoadState('networkidle');
    
    const bingResults = await bingTab.locator('h2').count();
    
    // Compare
    console.log(`Google: ${googleResults} results`);
    console.log(`Bing: ${bingResults} results`);
    
    expect(googleResults).toBeGreaterThan(0);
    expect(bingResults).toBeGreaterThan(0);
    
  } finally {
    await googleTab.close();
    await bingTab.close();
  }
});
```

### Example 5: Simulate Multi-User with Multiple Tabs

```javascript
test('multi-user collaboration simulation', async ({ context }) => {
  const user1Tab = await context.newPage();
  const user2Tab = await context.newPage();
  
  try {
    // User 1 creates task
    await user1Tab.goto('https://example.com/tasks');
    await user1Tab.locator('input[placeholder="Task"]').fill('New Feature');
    await user1Tab.locator('button:has-text("Add")').click();
    
    // User 2 sees task appear (if real-time app)
    await user2Tab.goto('https://example.com/tasks');
    
    // Wait for task to appear in user 2's view
    await user2Tab.locator('text=New Feature').waitFor({ state: 'visible' });
    
    // User 2 assigns task to themselves
    await user2Tab.locator('text=New Feature').click();
    await user2Tab.locator('button:has-text("Assign to Me")').click();
    
    // Verify in user 1's view
    await user1Tab.reload();
    const status = await user1Tab.locator('[data-test="task-status"]').textContent();
    expect(status).toContain('Assigned');
    
  } finally {
    await user1Tab.close();
    await user2Tab.close();
  }
});
```

### Example 6: Shopping Cart in Multiple Tabs

```javascript
test('shopping cart consistency across tabs', async ({ context, page }) => {
  const tab1 = await context.newPage();
  const tab2 = await context.newPage();
  
  try {
    // Both tabs same URL (shares cookies/session)
    await page.goto('https://ecommerce.example.com');
    await tab1.goto('https://ecommerce.example.com');
    await tab2.goto('https://ecommerce.example.com');
    
    // Tab 1: Add product
    await tab1.locator('button:has-text("Add to Cart")').first().click();
    let cartCount = await tab1.locator('[data-test="cart-count"]').textContent();
    expect(cartCount).toContain('1');
    
    // Tab 2: Refresh and check (shares context/cookies)
    await tab2.reload();
    cartCount = await tab2.locator('[data-test="cart-count"]').textContent();
    expect(cartCount).toContain('1');  // Should reflect tab1's addition
    
    // Tab 2: Add another product
    await tab2.locator('button:has-text("Add to Cart")').nth(1).click();
    
    // Check consistency
    await tab1.reload();
    cartCount = await tab1.locator('[data-test="cart-count"]').textContent();
    expect(cartCount).toContain('2');
    
  } finally {
    await tab1.close();
    await tab2.close();
  }
});
```

---

## Best Practices

### ✅ DO

```javascript
// 1. Always wait for new page/popup
const [newPage] = await Promise.all([
  context.waitForEvent('page'),
  page.locator('a[target="_blank"]').click()
]);

// 2. Keep track of pages with variables
const tab1 = await context.newPage();
const tab2 = await context.newPage();

// 3. Cleanup pages after use
try {
  // test code
} finally {
  await tab1.close();
  await tab2.close();
}

// 4. Use context.pages() to get all pages
const allPages = context.pages();
allPages.forEach(p => console.log(p.url()));

// 5. Wait for pages to load
await newPage.waitForLoadState('networkidle');

// 6. Store page references for later use
const newPages = [];
for (let i = 0; i < 3; i++) {
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.locator('a').click()
  ]);
  newPages.push(newPage);
}
```

### ❌ DON'T

```javascript
// 1. Don't assume new page is immediately loaded
const [newPage] = await Promise.all([
  context.waitForEvent('page'),
  page.locator('a').click()
]);
// ❌ Don't do this immediately:
// await newPage.locator('button').click();

// ✅ Wait first:
await newPage.waitForLoadState();
await newPage.locator('button').click();

// 2. Don't forget to close pages
const newPage = await context.newPage();
// ❌ No cleanup

// ✅ Always cleanup:
try { ... } finally { await newPage.close(); }

// 3. Don't use browser.newWindow() - use context.newPage()
// ❌ DON'T
const window = await browser.newWindow();

// ✅ DO
const page = await context.newPage();

// 4. Don't ignore error handling
// ❌ DON'T
await Promise.all([
  context.waitForEvent('page'),
  page.locator('a').click()
]);

// ✅ DO
try {
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.locator('a').click()
  ]);
} catch (error) {
  console.error('Failed to open new tab:', error);
}

// 5. Don't assume order of pages
// ❌ DON'T assume pages[1] is the new page
const pages = context.pages();
const newPage = pages[1];  // Wrong!

// ✅ DO use waitForEvent or find by URL
const [newPage] = await Promise.all([
  context.waitForEvent('page'),
  page.locator('a').click()
]);
```

---

## Troubleshooting

### Problem: New Tab Not Detected

```javascript
// ❌ Wrong - waitForEvent not set up
await page.locator('a[target="_blank"]').click();
const newPage = await context.waitForEvent('page');

// ✅ Right - Promise.all ensures listener is ready
const [newPage] = await Promise.all([
  context.waitForEvent('page'),
  page.locator('a[target="_blank"]').click()
]);
```

### Problem: Timeout Waiting for Tab

```javascript
// ❌ Original code
const [newPage] = await Promise.all([
  context.waitForEvent('page'),
  page.locator('a').click()  // What if this element doesn't exist?
]);

// ✅ Better - check element exists first
const link = page.locator('a[target="_blank"]');
expect(await link.count()).toBeGreaterThan(0);

const [newPage] = await Promise.all([
  context.waitForEvent('page'),
  link.click()
]);
```

### Problem: New Tab URL Wrong

```javascript
// ❌ Assume URL immediately
const [newPage] = await Promise.all([
  context.waitForEvent('page'),
  page.locator('a').click()
]);
console.log(newPage.url());  // May not be final URL

// ✅ Wait for navigation
const [newPage] = await Promise.all([
  context.waitForEvent('page'),
  page.locator('a').click()
]);
await newPage.waitForLoadState('networkidle');
console.log(newPage.url());  // Final URL
```

---

## Quick Reference

### Opening Tabs
```javascript
// Click link with target="_blank"
const [newPage] = await Promise.all([
  context.waitForEvent('page'),
  page.locator('a[target="_blank"]').click()
]);

// Programmatically create tab
const newPage = await context.newPage();

// Detect popup
page.on('popup', popup => { ... });
```

### Getting Pages
```javascript
// All pages
const pages = context.pages();

// By variable
const tab1, tab2, tab3;

// By URL
pages.find(p => p.url().includes('google'));

// By title
pages.find(async p => await p.title() === 'Home');
```

### Tab Information
```javascript
// URL
page.url()

// Title
await page.title()

// Check if closed
page.isClosed()

// All pages count
context.pages().length
```

### Switching and Closing
```javascript
// Switching (just use different variable)
await tab1.goto('url1');
await tab2.goto('url2');

// Close tab
await page.close();

// Close all except one
context.pages().slice(1).forEach(p => p.close());
```

