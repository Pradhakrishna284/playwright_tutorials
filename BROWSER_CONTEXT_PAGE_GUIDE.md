# Browser, BrowserContext, and Page - Complete Guide

## Table of Contents
1. [Playwright Architecture Overview](#playwright-architecture-overview)
2. [Browser - The Foundation](#browser---the-foundation)
3. [BrowserContext - Isolated Sessions](#browsercontext---isolated-sessions)
4. [Page - The Workable Interface](#page---the-workable-interface)
5. [Hierarchy and Relationships](#hierarchy-and-relationships)
6. [Practical Patterns](#practical-patterns)
7. [Real-World Examples](#real-world-examples)
8. [Best Practices](#best-practices)

---

## Playwright Architecture Overview

Playwright uses a hierarchical model to organize automated browser interactions:

```
Browser
├── BrowserContext 1
│   ├── Page 1
│   ├── Page 2
│   └── Page 3
├── BrowserContext 2
│   ├── Page 1
│   └── Page 2
└── BrowserContext 3
    └── Page 1
```

### Three-Layer Model

| Layer | Purpose | Scope | Lifetime |
|-------|---------|-------|----------|
| **Browser** | Controls the entire browser instance | Global | Test session/fixture |
| **BrowserContext** | Isolated session (cookies, storage, cache) | Per context | One or more tests |
| **Page** | Single tab/window in a context | Per page | Specific test or workflow |

---

## Browser - The Foundation

### What is a Browser?

A **Browser** is the top-level Playwright object that:
- Launches the actual browser executable (Chrome, Firefox, Safari, Edge)
- Manages the lifecycle of browser processes
- Creates and manages BrowserContexts
- Handles browser-wide settings
- Is expensive to create (takes time to launch)

### Browser Creation

```javascript
import { chromium, firefox, webkit } from '@playwright/test';

// Launch a browser
const browser = await chromium.launch();

// With options
const browser = await chromium.launch({
  headless: false,           // Show UI
  args: ['--disable-blink-features=AutomationControlled'],
  downloadsPath: './downloads',
  proxy: { server: 'http://proxy.example.com:3128' }
});

// Alternative browsers
const firefoxBrowser = await firefox.launch();
const safariLikeBrowser = await webkit.launch();
```

### Key Browser Properties and Methods

```javascript
// Get browser info
const version = await browser.version();
console.log('Browser version:', version);

// Get all contexts
const contexts = browser.contexts();
console.log(`Open contexts: ${contexts.length}`);

// Create new context
const context = await browser.newContext();

// Check if browser is connected
const isConnected = browser.isConnected();

// Close browser
await browser.close();
```

### Browser Lifecycle

```javascript
// Browser is expensive - reuse it
const browser = await chromium.launch();

try {
  // Create multiple contexts from same browser
  const context1 = await browser.newContext();
  const context2 = await browser.newContext();
  
  // Do work with contexts
  
} finally {
  // Always close browser
  await browser.close();
}
```

---

## BrowserContext - Isolated Sessions

### What is a BrowserContext?

A **BrowserContext** is an isolated session within a browser that:
- Has its own cookies, local storage, and session storage
- Has its own cache
- Has its own network interception rules
- Simulates a separate user profile
- Can have multiple Pages
- Is cheaper to create than a Browser
- Is independent from other contexts

### BrowserContext Creation and Configuration

```javascript
// Simple context
const context = await browser.newContext();

// Context with configuration
const context = await browser.newContext({
  // Viewport and device emulation
  viewport: { width: 1280, height: 720 },
  
  // User agent
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  
  // Color scheme
  colorScheme: 'dark',  // 'light' | 'dark' | 'no-preference'
  
  // Reduced motion
  reducedMotion: 'reduce',  // 'reduce' | 'no-preference'
  
  // Geolocation
  geolocation: { latitude: 37.7749, longitude: -122.4194 },
  permissions: ['geolocation'],
  
  // Timezone and locale
  timezoneId: 'America/New_York',
  locale: 'en-US',
  
  // HTTP headers
  extraHTTPHeaders: {
    'X-Custom-Header': 'value',
    'Accept-Language': 'en-US,en;q=0.9'
  },
  
  // Authentication
  httpCredentials: {
    username: 'user',
    password: 'pass'
  },
  
  // Proxy
  proxy: {
    server: 'http://proxy.example.com:3128',
    bypass: 'localhost,127.0.0.1'
  },
  
  // Offline mode
  offline: false,
  
  // Ignore HTTPS errors (for testing)
  ignoreHTTPSErrors: true
});

// Device emulation preset
const iPhone = await browser.newContext({
  ...devices['iPhone 12'],
  // Optional: override specific properties
  viewport: { width: 800, height: 1000 }
});
```

### Key BrowserContext Methods and Properties

```javascript
const context = await browser.newContext();

// Create new page in context
const page = await context.newPage();

// Get all pages in context
const pages = context.pages();
console.log(`Pages in context: ${pages.length}`);

// Add/remove cookies
await context.addCookies([
  {
    name: 'sessionId',
    value: 'abc123',
    url: 'https://example.com'
  }
]);

// Get all cookies
const cookies = await context.cookies();

// Clear cookies
await context.clearCookies();

// Grant/revoke permissions
await context.grantPermissions(['geolocation']);
await context.revokePermissions(['geolocation']);

// Set geolocation
await context.setGeolocation({ latitude: 40.7128, longitude: -74.0060 });

// Set offline mode
await context.setOffline(true);
await context.setOffline(false);

// Set extra HTTP headers
await context.setExtraHTTPHeaders({
  'X-My-Header': 'value'
});

// Clear all storage (cookies, local storage, session storage)
await context.clearCookies();

// Close context
await context.close();
```

### BrowserContext Storage and State

```javascript
// Work with localStorage
await context.addInitScript(() => {
  localStorage.setItem('userPreference', 'darkMode');
});

// Work with sessionStorage
await context.addInitScript(() => {
  sessionStorage.setItem('tempData', 'value');
});

// Execute script on every page created in context
await context.addInitScript((value) => {
  window.myGlobalValue = value;
}, 'stored-value');

// Expose function to all pages in context
await context.exposeFunction('myFunction', (arg) => {
  return `Result: ${arg}`;
});
```

---

## Page - The Workable Interface

### What is a Page?

A **Page** is the interface you use to interact with:
- A single browser tab/window
- The DOM and elements
- Navigation and routing
- Events and listeners
- Network requests
- Storage and cookies (via context)

### Page Creation

```javascript
// Create page from context
const page = await context.newPage();

// Create page with viewport
const page = await context.newPage();
await page.setViewportSize({ width: 1024, height: 768 });

// Get page from browser directly (creates new context)
const page = await browser.newPage();
```

### Key Page Properties

```javascript
const page = await context.newPage();

// Get page URL
const url = page.url();
console.log('Current URL:', url);

// Get page title
const title = await page.title();
console.log('Page title:', title);

// Get viewport size
const viewport = page.viewportSize();
console.log('Viewport:', viewport);

// Check if closed
const isClosed = page.isClosed();

// Get context
const ctx = page.context();
```

### Core Page Methods

#### Navigation

```javascript
const page = await context.newPage();

// Navigate to URL
await page.goto('https://example.com');

// With options
await page.goto('https://example.com', {
  waitUntil: 'networkidle',  // 'load' | 'domcontentloaded' | 'networkidle'
  referer: 'https://google.com',
  timeout: 30000
});

// Go back
await page.goBack();

// Go forward
await page.goForward();

// Reload
await page.reload({ waitUntil: 'networkidle' });

// Wait for navigation (useful for form submissions)
await Promise.all([
  page.waitForNavigation(),
  page.click('a[href="/next-page"]')
]);
```

#### DOM Interaction

```javascript
// Locators (preferred)
const button = page.locator('button.submit');
await button.click();

// Deprecated $ methods (avoid)
const element = await page.$('button');
await element.click();

// Querying
const count = await page.locator('li').count();
const text = await page.locator('h1').textContent();
const isVisible = await page.locator('div').isVisible();

// Waiting
await page.locator('button').waitFor({ state: 'visible' });
await page.waitForSelector('button', { timeout: 5000 });
```

#### Event Handling

```javascript
const page = await context.newPage();

// Listen to console messages
page.on('console', msg => console.log('Page log:', msg.text()));

// Listen to page errors
page.on('pageerror', error => console.error('Page error:', error));

// Listen to dialogs
page.on('dialog', dialog => {
  console.log('Dialog type:', dialog.type());
  dialog.accept('input value');
});

// Listen to popups
page.on('popup', popup => {
  console.log('New popup:', popup.url());
});

// Listen to response
page.on('response', response => {
  if (response.status() === 200) {
    console.log('Response:', response.url());
  }
});

// Listen to request
page.on('request', request => {
  console.log('Request:', request.url());
});

// Remove listener
const handler = msg => console.log(msg);
page.on('console', handler);
page.removeListener('console', handler);

// Wait for event
const [popup] = await Promise.all([
  page.waitForEvent('popup'),
  page.click('a[target="_blank"]')
]);
```

#### Network Control

```javascript
// Route requests (intercept and modify)
await page.route('**/*', route => {
  // Modify request
  route.continue({
    headers: {
      ...route.request().headers(),
      'X-Custom-Header': 'value'
    }
  });
});

// Abort requests
await page.route('**/*.png', route => route.abort());

// Mock responses
await page.route('**/api/users', route => {
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([{ id: 1, name: 'John' }])
  });
});

// Wait for response
const response = await page.waitForResponse(
  response => response.url().includes('/api/data') && response.status() === 200
);

// Wait for request
const request = await page.waitForRequest(
  request => request.url().includes('/api/submit')
);

// Unroute
await page.unroute('**/*');
```

#### Screenshots and Videos

```javascript
// Screenshot
await page.screenshot({
  path: 'screenshot.png',
  fullPage: true,  // Full page height
  type: 'png'      // 'png' | 'jpeg'
});

// Screenshot element
const element = page.locator('button');
await element.screenshot({ path: 'button.png' });

// Get screenshot as buffer
const buffer = await page.screenshot();
```

---

## Hierarchy and Relationships

### Memory and Resource Management

```javascript
// Browser is most expensive
const browser = await chromium.launch();

// BrowserContext is cheaper - create many from one browser
const context1 = await browser.newContext();
const context2 = await browser.newContext();
const context3 = await browser.newContext();

// Page is cheapest - create many from one context
const page1 = await context1.newPage();
const page2 = await context1.newPage();
const page3 = await context2.newPage();

// Cleanup: Pages -> Contexts -> Browser
await page1.close();
await page2.close();
await page3.close();
await context1.close();
await context2.close();
await context3.close();
await browser.close();
```

### Access Between Layers

```javascript
// From Page to Context
const context = page.context();

// From Page to Browser (indirect)
const browser = page.context().browser();

// From Context to Browser
const browser = context.browser();

// From Context to Pages
const pages = context.pages();

// From Browser to Contexts
const contexts = browser.contexts();
```

### Storage and Context Isolation

```javascript
// Each context has independent storage
const context1 = await browser.newContext();
const context2 = await browser.newContext();

const page1 = await context1.newPage();
const page2 = await context2.newPage();

// Add cookie to context1 only
await context1.addCookies([{
  name: 'id',
  value: 'user1',
  url: 'https://example.com'
}]);

await page1.goto('https://example.com');
// Cookie is available

await page2.goto('https://example.com');
// Cookie is NOT available (different context)
```

---

## Practical Patterns

### Pattern 1: Browser Per Test Suite / Context Per Test

```javascript
import { chromium, BrowserContext, Page } from '@playwright/test';

describe('User Tests', () => {
  let browser;
  let context;
  let page;

  beforeAll(async () => {
    // Create browser once per suite
    browser = await chromium.launch();
  });

  beforeEach(async () => {
    // Create fresh context per test
    context = await browser.newContext();
    page = await context.newPage();
  });

  afterEach(async () => {
    // Clean up context after each test
    await context.close();
  });

  afterAll(async () => {
    // Close browser once
    await browser.close();
  });

  test('login', async () => {
    // Test code
  });

  test('logout', async () => {
    // Test code
  });
});
```

### Pattern 2: Multiple Contexts for Parallel Users

```javascript
test('multiple users interact simultaneously', async ({ browser }) => {
  // Create contexts for different users
  const userAContext = await browser.newContext();
  const userBContext = await browser.newContext();

  const pageA = await userAContext.newPage();
  const pageB = await userBContext.newPage();

  // Parallel actions
  await Promise.all([
    pageA.goto('https://example.com'),
    pageB.goto('https://example.com')
  ]);

  // User A actions
  await pageA.locator('input[name="search"]').fill('product');
  
  // User B actions
  await pageB.locator('input[name="search"]').fill('service');

  // Verify independent sessions
  const textA = await pageA.locator('#results').textContent();
  const textB = await pageB.locator('#results').textContent();

  expect(textA).toContain('product');
  expect(textB).toContain('service');

  await userAContext.close();
  await userBContext.close();
});
```

### Pattern 3: Switching Between Pages

```javascript
test('work with multiple pages in same context', async ({ context }) => {
  const page1 = await context.newPage();
  const page2 = await context.newPage();

  // Navigate both pages
  await page1.goto('https://example.com');
  await page2.goto('https://example.com/other');

  // Get all pages
  const pages = context.pages();
  expect(pages.length).toBe(2);

  // Get specific page
  const firstPage = pages[0];
  const title1 = await firstPage.title();

  // Switch between pages
  const title2 = await page2.title();

  await page1.close();
  await page2.close();
});
```

### Pattern 4: Device Emulation with Context

```javascript
import { devices } from '@playwright/test';

test('test on mobile device', async ({ browser }) => {
  // Use predefined device
  const mobileContext = await browser.newContext({
    ...devices['iPhone 12']
  });

  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('https://example.com');

  // Verify mobile layout
  const viewport = mobilePage.viewportSize();
  expect(viewport?.width).toBe(390);

  await mobileContext.close();
});

test('test on tablet', async ({ browser }) => {
  const tabletContext = await browser.newContext({
    ...devices['iPad Pro'],
    viewport: { width: 1024, height: 1366 }
  });

  const tabletPage = await tabletContext.newPage();
  // Test tablet experience

  await tabletContext.close();
});
```

---

## Real-World Examples

### Example 1: Multi-User Collaboration Test

```javascript
test('multiple users chat in real-time', async ({ browser }) => {
  // Create contexts for 3 users
  const users = [];
  
  for (let i = 0; i < 3; i++) {
    const context = await browser.newContext();
    const page = await context.newPage();
    users.push({ context, page, name: `User${i + 1}` });
  }

  try {
    // All users navigate to chat app
    await Promise.all(
      users.map(u => u.page.goto('https://chat.example.com'))
    );

    // User 1 sends message
    await users[0].page
      .locator('input[placeholder="Message"]')
      .fill('Hello everyone!');
    await users[0].page.locator('button:has-text("Send")').click();

    // User 2 and 3 wait for message and verify
    await Promise.all([
      users[1].page.locator('text=Hello everyone!').waitFor({ state: 'visible' }),
      users[2].page.locator('text=Hello everyone!').waitFor({ state: 'visible' })
    ]);

    // Verify message appears in all views
    for (const user of users) {
      const messages = await user.page.locator('.message').count();
      expect(messages).toBeGreaterThan(0);
    }
  } finally {
    // Clean up
    await Promise.all(
      users.map(u => u.context.close())
    );
  }
});
```

### Example 2: Testing with Different Geolocations

```javascript
test('geolocation affects content', async ({ browser }) => {
  const locations = [
    { name: 'New York', latitude: 40.7128, longitude: -74.0060 },
    { name: 'London', latitude: 51.5074, longitude: -0.1278 },
    { name: 'Tokyo', latitude: 35.6762, longitude: 139.6503 }
  ];

  for (const location of locations) {
    const context = await browser.newContext({
      geolocation: { latitude: location.latitude, longitude: location.longitude },
      permissions: ['geolocation']
    });

    const page = await context.newPage();
    await page.goto('https://example.com/location');

    // Verify location-specific content
    const content = await page.locator('.location-info').textContent();
    expect(content).toContain(location.name);

    await context.close();
  }
});
```

### Example 3: Testing Multiple Languages and Locales

```javascript
test('UI displays in correct language', async ({ browser }) => {
  const locales = [
    { locale: 'en-US', timezone: 'America/New_York' },
    { locale: 'fr-FR', timezone: 'Europe/Paris' },
    { locale: 'ja-JP', timezone: 'Asia/Tokyo' }
  ];

  for (const loc of locales) {
    const context = await browser.newContext({
      locale: loc.locale,
      timezoneId: loc.timezone
    });

    const page = await context.newPage();
    await page.goto('https://example.com');

    // Verify language
    const htmlLang = await page.getAttribute('html', 'lang');
    expect(htmlLang).toContain(loc.locale.split('-')[0]);

    // Verify date format
    const dateStr = await page.locator('[data-date]').getAttribute('data-date');
    console.log(`${loc.locale}: ${dateStr}`);

    await context.close();
  }
});
```

### Example 4: HTTP Authentication

```javascript
test('login with HTTP authentication', async ({ browser }) => {
  const context = await browser.newContext({
    httpCredentials: {
      username: 'testuser',
      password: 'testpass'
    }
  });

  const page = await context.newPage();

  // Navigate to protected resource
  // Browser automatically sends HTTP auth credentials
  await page.goto('https://httpbin.org/basic-auth/testuser/testpass');

  // Verify authenticated access
  const text = await page.textContent('body');
  expect(text).toContain('authenticated');

  await context.close();
});
```

### Example 5: Network Interception and Mocking

```javascript
test('mock API responses', async ({ page }) => {
  // Route API requests
  await page.route('**/api/users/**', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 123,
        name: 'John Doe',
        email: 'john@example.com'
      })
    });
  });

  await page.goto('https://example.com/user/123');

  // Verify mocked data is used
  expect(await page.locator('text=John Doe')).toBeVisible();
});

test('block images and CSS', async ({ page }) => {
  // Block all image and CSS requests
  await page.route('**/*.{png,jpg,jpeg,gif,css}', route => {
    route.abort();
  });

  const startTime = Date.now();
  await page.goto('https://example.com');
  const loadTime = Date.now() - startTime;

  // Page loads faster without images
  console.log(`Load time without images: ${loadTime}ms`);

  expect(loadTime).toBeLessThan(5000);
});
```

### Example 6: Persistent Context (Cookies and Storage)

```javascript
test('persist cookies across page sessions', async ({ browser }) => {
  // Create context that preserves storage
  const context = await browser.newContext();
  const page = await context.newPage();

  // First visit
  await page.goto('https://example.com/login');
  await page.locator('input[name="username"]').fill('user');
  await page.locator('input[name="password"]').fill('pass');
  await page.locator('button[type="submit"]').click();

  // Wait for login to complete and get cookies
  await page.waitForNavigation();

  // Get cookies after login
  const cookies = await context.cookies();
  console.log('Cookies:', cookies);

  // Verify session cookie exists
  const sessionCookie = cookies.find(c => c.name === 'sessionId');
  expect(sessionCookie).toBeDefined();

  // Create second page in same context
  const page2 = await context.newPage();
  await page2.goto('https://example.com/dashboard');

  // Verify still logged in (cookies persist)
  const isLoggedIn = await page2.locator('.user-profile').isVisible();
  expect(isLoggedIn).toBe(true);

  await context.close();
});
```

---

## Best Practices

### ✅ DO

```javascript
// 1. Reuse browser for efficiency
const browser = await chromium.launch();
// Create multiple contexts/pages from same browser

// 2. Create fresh context per test for isolation
beforeEach(async () => {
  context = await browser.newContext();
});

// 3. Use proper cleanup
afterEach(async () => {
  await context.close();
});

// 4. Use specific viewport configuration
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 }
});

// 5. Set timeout appropriately
await page.goto(url, { timeout: 30000 });

// 6. Wait for proper state
await page.goto(url, { waitUntil: 'networkidle' });

// 7. Use context for state setup
await context.addCookies([...]);
await context.grantPermissions(['geolocation']);

// 8. Take screenshots for debugging
await page.screenshot({ path: 'debug.png' });
```

### ❌ DON'T

```javascript
// 1. Don't create new browser for each test (very slow)
// ❌ WRONG
test('test 1', async () => {
  const browser = await chromium.launch();
  // ... test code
  await browser.close();
});

// 2. Don't reuse context across tests (isolation issue)
// ❌ WRONG
let sharedContext;
beforeAll(async () => {
  sharedContext = await browser.newContext();
});

// 3. Don't forget to close resources
// ❌ WRONG
const context = await browser.newContext();
// No cleanup

// 4. Don't use deprecated $ methods
// ❌ WRONG
const elem = await page.$('button');

// ✅ RIGHT
const elem = page.locator('button');

// 5. Don't navigate without waiting
// ❌ WRONG
await page.goto(url);
await page.locator('button').click(); // May not work

// ✅ RIGHT
await page.goto(url, { waitUntil: 'networkidle' });
await page.locator('button').waitFor({ state: 'visible' });
await page.locator('button').click();

// 6. Don't ignore errors
// ❌ WRONG
try {
  await page.click('nonexistent');
} catch (e) {
  // Silently ignore
}

// ✅ RIGHT
try {
  await page.locator('button').click();
} catch (e) {
  console.error('Click failed:', e);
  throw e;
}
```

---

## Quick Reference

### Browser

```javascript
// Lifecycle
const browser = await chromium.launch();
await browser.close();
browser.isConnected()

// Contexts
const context = await browser.newContext();
const contexts = browser.contexts()
await browser.newPage()  // Creates context + page

// Info
await browser.version()
await browser.close()
```

### BrowserContext

```javascript
// Lifecycle
const context = await browser.newContext(options)
await context.close()

// Pages
const page = await context.newPage()
const pages = context.pages()

// Storage
await context.addCookies([...])
const cookies = await context.cookies()
await context.clearCookies()

// Permissions
await context.grantPermissions(['geolocation'])
await context.revokePermissions(['geolocation'])

// Location
await context.setGeolocation({latitude, longitude})

// Network
await context.setOffline(true/false)
await context.setExtraHTTPHeaders({...})

// Execution
await context.addInitScript(function, arg)
await context.exposeFunction(name, function)
```

### Page

```javascript
// Navigation
await page.goto(url, options)
await page.goBack()
await page.goForward()
await page.reload()

// Info
page.url()
await page.title()
page.viewportSize()
page.isClosed()

// DOM
page.locator(selector)
await page.$(selector)  // Deprecated
await page.$$(selector)  // Deprecated

// Events
page.on('console', callback)
page.on('pageerror', callback)
page.on('dialog', callback)
page.on('popup', callback)

// Network
await page.route(pattern, handler)
await page.unroute(pattern)
await page.waitForResponse(predicate)
await page.waitForRequest(predicate)

// Screenshots
await page.screenshot(options)
```

---

## Summary

| Aspect | Browser | BrowserContext | Page |
|--------|---------|---|---|
| **Purpose** | Manages browser process | Isolated session | Interact with DOM |
| **Scope** | Test suite/session | Single test or workflow | Specific action/assertion |
| **Cost** | High (slow to create) | Low | Very low |
| **Isolation** | None (shared process) | Full (cookies, storage) | None (shares context) |
| **Typical Count** | 1 per test file | 1-3 per test | 1-10 per test |
| **Reuse** | Yes, across tests | Per test | Multiple in one test |
| **Storage** | N/A | Has own cookies | Uses context's storage |
| **Network** | N/A | Can set proxy, auth | Can intercept requests |

