# Browser, BrowserContext, and Page - Quick Summary

## What You've Created

### 1. **BROWSER_CONTEXT_PAGE_GUIDE.md** - Complete Reference
A comprehensive 1000+ line guide covering:
- ✅ Playwright architecture overview
- ✅ Browser lifecycle and properties
- ✅ BrowserContext creation and configuration
- ✅ Page fundamentals and methods
- ✅ Storage and state management
- ✅ Network interception
- ✅ Real-world examples (multi-user, geolocation, locales, auth, etc.)
- ✅ Best practices (DO's and DON'Ts)
- ✅ Quick reference tables

### 2. **tests/guide_browsercontext.spec.ts** - 30+ Practical Examples
Runnable test cases demonstrating:
- ✅ Browser launch and configuration
- ✅ Context creation with various options
- ✅ Page creation and properties
- ✅ Multiple pages in same context
- ✅ Multiple contexts for different users
- ✅ Device emulation
- ✅ Cookie and permission management
- ✅ Offline mode
- ✅ Event listeners (console, errors, dialogs, navigation)
- ✅ Network interception (mock, abort, modify)
- ✅ Best practice patterns
- ✅ Proper cleanup patterns

### 3. **tests/pw_browsercontext.spec.ts** - 19 Practice Exercises
Skeleton test cases for hands-on practice with solutions guide.

---

## Key Concepts

### Three-Layer Hierarchy

```
Browser (1 per test suite)
  ├─ BrowserContext (1-N per test)
  │   ├─ Page (1-M per context)
  │   ├─ Page
  │   └─ Page
  ├─ BrowserContext
  │   ├─ Page
  │   └─ Page
```

### Resource Costs

| Resource | Launch Time | When to Create |
|----------|-------------|---|
| **Browser** | ~2-3 seconds | Once per test suite |
| **BrowserContext** | ~50-100ms | Once per test |
| **Page** | ~200-500ms | Multiple per test OK |

### Isolation Levels

| Data | Browser | Context | Page |
|------|---------|---------|------|
| Cookies | ❌ Shared | ✅ Isolated | ✅ Shared with context |
| Storage | ❌ Shared | ✅ Isolated | ✅ Shared with context |
| Cache | ❌ Shared | ✅ Isolated | ✅ Shared with context |
| Viewport | N/A | ✅ Isolated | ✅ Shared with context |
| User Agent | N/A | ✅ Isolated | ✅ Shared with context |

---

## Common Patterns

### Pattern 1: Single Browser, Fresh Context Per Test
```javascript
// Most efficient and recommended
let browser;

beforeAll(() => { browser = await chromium.launch(); });
beforeEach(() => { context = await browser.newContext(); });
afterEach(() => { await context.close(); });
afterAll(() => { await browser.close(); });
```

### Pattern 2: Multi-User Simulation
```javascript
const user1Context = await browser.newContext();
const user2Context = await browser.newContext();

// Each user has isolated cookies, storage, cache
// But shares the same browser process
```

### Pattern 3: Device Testing
```javascript
const mobileContext = await browser.newContext({
  ...devices['iPhone 12']
});
const desktopContext = await browser.newContext({
  viewport: { width: 1920, height: 1080 }
});
// Test same app on different devices
```

### Pattern 4: Context with Permissions and Location
```javascript
const context = await browser.newContext({
  geolocation: { latitude: 40.7128, longitude: -74.0060 },
  permissions: ['geolocation']
});
```

### Pattern 5: Multi-Page Coordination
```javascript
const page1 = await context.newPage();
const page2 = await context.newPage();

// Navigate both
await page1.goto(url1);
await page2.goto(url2);

// They share cookies from context
// But have independent DOM/JavaScript
```

---

## Quick Do's and Don'ts

### ✅ DO

```javascript
// 1. Reuse browser
const browser = await chromium.launch();
const ctx1 = await browser.newContext();
const ctx2 = await browser.newContext();

// 2. Fresh context per test
beforeEach(async () => {
  context = await browser.newContext();
});

// 3. Proper cleanup
try { ... } finally { 
  await page.close();
  await context.close();
  // browser handled by fixture
}

// 4. Use frameLocator for iframes
page.frameLocator('iframe').locator('button')

// 5. Wait for proper state
await page.goto(url, { waitUntil: 'networkidle' });
```

### ❌ DON'T

```javascript
// 1. Create new browser for each test (SLOW!)
test('test 1', async () => {
  const browser = await chromium.launch(); // ❌ DON'T
  // ...
});

// 2. Reuse context across tests (isolation issue)
let sharedContext; // ❌ DON'T

// 3. Forget cleanup
context = await browser.newContext(); // ❌ No cleanup

// 4. Use deprecated $ methods
const elem = await page.$('button'); // ❌ DON'T
const elem = page.locator('button'); // ✅ DO

// 5. Navigate without waiting
await page.goto(url);
await page.locator('button').click(); // May fail
```

---

## Running the Tests

```bash
# Run all browser context tests
npx playwright test guide_browsercontext.spec.ts

# Run specific test
npx playwright test guide_browsercontext.spec.ts -g "launch browser"

# Run with UI
npx playwright test guide_browsercontext.spec.ts --ui

# Run headed (see browser)
npx playwright test guide_browsercontext.spec.ts --headed

# Run practice exercises
npx playwright test pw_browsercontext.spec.ts
```

---

## Key Methods Cheat Sheet

### Browser
```javascript
await chromium.launch(options)
await browser.version()
browser.isConnected()
await browser.newContext(options)
browser.contexts()
await browser.close()
```

### BrowserContext
```javascript
await context.newPage()
context.pages()
await context.addCookies([...])
await context.cookies()
await context.clearCookies()
await context.grantPermissions([...])
await context.setGeolocation({...})
await context.setOffline(true/false)
await context.setExtraHTTPHeaders({...})
await context.addInitScript(fn)
await context.exposeFunction(name, fn)
await context.close()
```

### Page
```javascript
await page.goto(url, options)
page.url()
await page.title()
page.viewportSize()
page.locator(selector)
page.on('event', handler)
await page.route(pattern, handler)
await page.unroute(pattern)
await page.screenshot(options)
await page.close()
```

---

## Resources

### Documentation Files
- 📄 [BROWSER_CONTEXT_PAGE_GUIDE.md](../BROWSER_CONTEXT_PAGE_GUIDE.md) - Full reference guide
- 📄 [guide_browsercontext.spec.ts](guide_browsercontext.spec.ts) - Runnable examples
- 📄 [pw_browsercontext.spec.ts](pw_browsercontext.spec.ts) - Practice exercises

### Official Links
- [Playwright Documentation](https://playwright.dev/)
- [Browser API](https://playwright.dev/docs/api/class-browser)
- [BrowserContext API](https://playwright.dev/docs/api/class-browsercontext)
- [Page API](https://playwright.dev/docs/api/class-page)

---

## Next Steps

1. **Run the guide tests**: `npx playwright test guide_browsercontext.spec.ts`
2. **Try the practice exercises**: `npx playwright test pw_browsercontext.spec.ts`
3. **Modify and experiment**: Change viewports, add cookies, simulate users
4. **Read the full guide**: Open BROWSER_CONTEXT_PAGE_GUIDE.md for detailed explanations
5. **Build real tests**: Use these patterns in your actual test suite

---

## Summary Table

| Feature | Browser | BrowserContext | Page |
|---------|---------|---|---|
| **Cost** | High | Low | Very Low |
| **Count per Test** | 1 | 1 | 1+ |
| **Reusable** | Yes | No (per test) | No (per action) |
| **Isolation** | None | Full | Within context |
| **Cookies** | Shared | Isolated | Shared w/ context |
| **Storage** | Shared | Isolated | Shared w/ context |
| **Can Create** | Contexts | Pages | Nothing |
| **Created From** | Launch | Browser | Context |
| **Cleanup** | Last | Per test | As needed |

