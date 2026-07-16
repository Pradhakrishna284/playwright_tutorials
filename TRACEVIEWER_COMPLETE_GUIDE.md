# Playwright Trace Viewer - Complete Guide

## Table of Contents
1. [Overview](#overview)
2. [What is Trace Viewer?](#what-is-trace-viewer)
3. [Why Use Trace Viewer?](#why-use-trace-viewer)
4. [Installation & Setup](#installation--setup)
5. [Basic Configuration](#basic-configuration)
6. [Recording Traces](#recording-traces)
7. [Viewing Traces](#viewing-traces)
8. [Advanced Features](#advanced-features)
9. [Best Practices](#best-practices)
10. [Real-World Examples](#real-world-examples)

---

## Overview

Trace Viewer is a powerful debugging tool in Playwright that records and visualizes the entire execution flow of your tests. It captures everything: network requests, DOM snapshots, console messages, screenshots, and more.

---

## What is Trace Viewer?

**Trace Viewer** is an interactive tool that records:
- **Actions**: Every interaction (click, type, navigate, etc.)
- **Network requests**: All HTTP/HTTPS traffic
- **Screenshots**: Visual snapshots at each step
- **DOM snapshots**: HTML state at any moment
- **Console logs**: All browser console output
- **Timing information**: Performance metrics

It creates a **`.trace`** file that can be viewed in:
- **Interactive UI**: `npx playwright show-trace <trace-file>`
- **Web-based UI**: Online at trace viewer
- **CI/CD pipelines**: For debugging failed tests

---

## Why Use Trace Viewer?

### Problems It Solves:
✅ **Debugging failures**: See exactly what went wrong without running test again  
✅ **Understanding flakiness**: Analyze timing and race conditions  
✅ **Performance analysis**: Identify slow operations  
✅ **Regression investigation**: Compare test behavior over time  
✅ **No need for screenshots**: Screenshots embedded in trace  
✅ **Network inspection**: Debug API calls and responses  
✅ **DOM inspection**: See HTML state at any step  

---

## Installation & Setup

### Prerequisites
```bash
npm install -D @playwright/test
```

### Trace Viewer is built-in
No additional installation needed. Trace recording is part of Playwright core.

---

## Basic Configuration

### Enable Tracing in `playwright.config.ts`

#### **Option 1: Always Record Traces**
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  
  use: {
    // Record traces for all tests
    trace: 'on',  // Always record
  },
});
```

#### **Option 2: Record Only On Failure**
```typescript
use: {
  trace: 'on-first-retry',  // Only when test retries (best for CI)
}
```

#### **Option 3: Record Only When Needed**
```typescript
use: {
  trace: 'retain-on-failure',  // Keep trace only if test fails
}
```

#### **Option 4: Advanced Configuration (Most Control)**
```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    trace: {
      mode: 'on-first-retry',
      screenshots: true,     // Include screenshots
      snapshots: true,       // Include DOM snapshots
      sources: true,         // Include source files
    },
  },
});
```

### Configuration Options Explained

| Option | Values | Purpose |
|--------|--------|---------|
| `mode` | `'off'`, `'on'`, `'retain-on-failure'`, `'on-first-retry'` | When to record |
| `screenshots` | `true`/`false` | Capture visual states |
| `snapshots` | `true`/`false` | Capture DOM HTML |
| `sources` | `true`/`false` | Include test source code |

---

## Recording Traces

### Method 1: Configuration-Based (Global)
```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    trace: 'retain-on-failure',
  },
});
```
✅ Automatic recording for all tests  
✅ Output in `test-results/` folder

### Method 2: Test-Level Configuration
```typescript
import { test, expect } from '@playwright/test';

test('login flow', async ({ page }, testInfo) => {
  // Start tracing
  await page.context().tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true,
  });

  await page.goto('https://example.com/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Verify success
  await expect(page).toHaveURL('https://example.com/dashboard');

  // Stop and save trace
  await page.context().tracing.stop({
    path: `traces/login-${testInfo.title}.trace`,
  });
});
```

### Method 3: Hook-Based (Multiple Tests)
```typescript
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page, context }) => {
  // Start tracing before each test
  await context.tracing.start({
    screenshots: true,
    snapshots: true,
  });
});

test.afterEach(async ({ page, context }, testInfo) => {
  // Save trace after each test
  await context.tracing.stop({
    path: `traces/${testInfo.title}.trace`,
  });
});

test('add item to cart', async ({ page }) => {
  await page.goto('https://example.com');
  // Test code...
});

test('checkout process', async ({ page }) => {
  await page.goto('https://example.com');
  // Test code...
});
```

### Method 4: Conditional Recording (Smart)
```typescript
import { test, expect } from '@playwright/test';

test('complex workflow', async ({ page, context }, testInfo) => {
  let tracingEnabled = false;

  // Only record if test is flaky or in specific conditions
  if (process.env.ENABLE_TRACE === 'true' || testInfo.retry > 0) {
    await context.tracing.start({
      screenshots: true,
      snapshots: true,
      sources: true,
    });
    tracingEnabled = true;
  }

  try {
    // Test code
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example/);
  } finally {
    if (tracingEnabled) {
      await context.tracing.stop({
        path: `traces/${testInfo.title}-retry${testInfo.retry}.trace`,
      });
    }
  }
});
```

---

## Viewing Traces

### Method 1: Command Line
```bash
# View any trace file
npx playwright show-trace path/to/trace.trace

# View all traces from last run
npx playwright show-trace ./test-results
```

### Method 2: Browser-Based UI
```bash
# Start trace viewer web server
npx playwright show-trace
```

### Method 3: Local File (Without Server)
```bash
# Open in default browser
npx playwright show-trace ./test-results/trace.trace
```

---

## Advanced Features

### 1. **Trace Inspector Navigation**

Inside the Trace Viewer UI, you can:

| Feature | What It Does |
|---------|-------------|
| **Timeline** | Scroll through test execution chronologically |
| **Actions** | Click any action to see before/after state |
| **Network** | View all HTTP requests and responses |
| **Console** | See all console logs and errors |
| **Snapshots** | Browse DOM state at any step |
| **Screenshots** | Visual representation of page state |
| **Timeline Scrubber** | Drag to jump to specific points |

### 2. **Filtering Events**

In the trace viewer, filter by:
- Action type (click, type, navigate, etc.)
- Network requests (XHR, fetch, etc.)
- Log levels (error, warning, info, etc.)

### 3. **Exporting Data**

```bash
# Traces are `.trace` files (JSON-based archives)
# Can be:
# - Shared with team members
# - Stored in CI artifacts
# - Analyzed programmatically
```

### 4. **Programmatic Trace Access**

```typescript
import fs from 'fs';
import { readFileSync } from 'fs';

// Read trace file (it's a gzipped archive)
// You can extract and analyze if needed
const traceBuffer = readFileSync('path/to/trace.trace');
console.log('Trace file size:', traceBuffer.length, 'bytes');
```

---

## Best Practices

### ✅ DO:

1. **Use `on-first-retry` in CI/CD**
   ```typescript
   trace: 'on-first-retry'  // Most efficient for CI
   ```

2. **Enable all features for failing tests**
   ```typescript
   trace: {
     mode: 'retain-on-failure',
     screenshots: true,
     snapshots: true,
     sources: true,
   }
   ```

3. **Name traces meaningfully**
   ```typescript
   path: `traces/${testInfo.title}-${new Date().toISOString()}.trace`
   ```

4. **Store traces in git artifacts** (CI/CD)
   ```yaml
   # GitHub Actions example
   - uses: actions/upload-artifact@v2
     if: failure()
     with:
       name: playwright-traces
       path: test-results/
   ```

5. **Use local dev for full tracing**
   ```typescript
   // In development: Full recording
   trace: 'on'
   
   // In CI: Smart recording
   trace: 'on-first-retry'
   ```

### ❌ DON'T:

1. **Don't always record in CI** (storage & performance)
   ```typescript
   // ❌ Bad for CI
   trace: 'on'  // Records all tests
   ```

2. **Don't disable snapshots** (harder to debug)
   ```typescript
   // ❌ Less useful
   snapshots: false
   ```

3. **Don't lose traces after runs**
   ```typescript
   // ✅ Save to long-term storage
   path: `/permanent/traces/${testInfo.title}.trace`
   ```

4. **Don't ignore console logs**
   ```typescript
   // ✅ Include all debugging info
   sources: true
   ```

---

## Real-World Examples

### Example 1: E-Commerce Checkout Test with Full Tracing

```typescript
import { test, expect } from '@playwright/test';

test('complete checkout process', async ({ page, context }, testInfo) => {
  // Start comprehensive tracing
  await context.tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true,
  });

  try {
    // Navigate to store
    await page.goto('https://example-store.com');
    await expect(page).toHaveTitle(/Store/);

    // Add item to cart
    await page.click('button:has-text("Add to Cart")');
    await expect(page.locator('.cart-count')).toContainText('1');

    // Go to cart
    await page.click('a:has-text("Cart")');
    await expect(page).toHaveURL(/.*cart/);

    // Checkout
    await page.click('button:has-text("Checkout")');
    
    // Fill shipping info
    await page.fill('input[name="address"]', '123 Main St');
    await page.fill('input[name="zip"]', '12345');
    
    // Fill payment info
    await page.fill('input[name="card-number"]', '4242 4242 4242 4242');
    await page.fill('input[name="expiry"]', '12/25');
    
    // Submit order
    await page.click('button:has-text("Place Order")');
    await expect(page).toHaveURL(/.*order-confirmation/);
    
    // Verify order number appears
    const orderNumber = await page.locator('.order-number').textContent();
    expect(orderNumber).toBeTruthy();

  } finally {
    // Always save trace, even on success (for analysis)
    await context.tracing.stop({
      path: `traces/checkout-${testInfo.title}-${new Date().getTime()}.trace`,
    });
  }
});
```

**What you can analyze in the trace:**
- Exact timing of each action
- Network requests to payment gateway
- Page load performance
- Any console errors during checkout
- Visual rendering at each step

---

### Example 2: API Test with Network Tracing

```typescript
import { test, expect } from '@playwright/test';

test('verify API calls during login', async ({ page, context }, testInfo) => {
  await context.tracing.start({
    screenshots: true,
    snapshots: true,
  });

  try {
    // Intercept and log network
    page.on('request', request => {
      console.log('Request:', request.method(), request.url());
    });

    page.on('response', response => {
      console.log('Response:', response.status(), response.url());
    });

    // Navigate
    await page.goto('https://api-test.com/login');
    
    // Login
    await page.fill('input[type="email"]', 'user@example.com');
    await page.fill('input[type="password"]', 'pass123');
    await page.click('button:has-text("Login")');

    // Wait for navigation and API call
    await page.waitForURL('**/dashboard');
    
    // Verify logged in
    await expect(page.locator('[data-testid="user-greeting"]'))
      .toContainText('Welcome');

  } finally {
    await context.tracing.stop({
      path: `traces/api-login-${testInfo.title}.trace`,
    });
  }
});
```

**Trace will show:**
- All API requests/responses
- Headers and payloads
- Network timing
- Any failed requests
- Console errors

---

### Example 3: Debugging Flaky Test

```typescript
import { test, expect } from '@playwright/test';

test.describe('flaky test detection', () => {
  // Retry 3 times, trace every retry
  test.describe.configure({ retries: 3 });

  test('intermittent element visibility', async ({ page, context }, testInfo) => {
    // Always trace retries
    await context.tracing.start({
      screenshots: true,
      snapshots: true,
      sources: true,
    });

    try {
      await page.goto('https://example.com/dynamic-content');
      
      // This might be flaky due to timing
      await page.waitForSelector('.dynamic-element', { timeout: 5000 });
      
      const element = page.locator('.dynamic-element');
      await expect(element).toBeVisible();
      
      // Capture state
      console.log('Element visible at attempt', testInfo.retry);

    } finally {
      await context.tracing.stop({
        path: `traces/flaky-test-retry${testInfo.retry}.trace`,
      });
    }
  });
});
```

**By comparing traces across retries, you'll see:**
- Why it fails sometimes
- Timing differences
- Network delays
- DOM rendering issues

---

### Example 4: Production-Ready Configuration

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  
  // Retry failed tests once
  retries: process.env.CI ? 1 : 0,
  
  // Report configuration
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Smart tracing for CI environments
        trace: process.env.CI 
          ? 'on-first-retry'  // Only on retries in CI
          : 'retain-on-failure',  // All failures locally
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        trace: process.env.CI ? 'on-first-retry' : 'retain-on-failure',
      },
    },
  ],

  // Output configuration
  outputDir: 'test-results',
});
```

---

### Example 5: Custom Trace Management

```typescript
import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

// Helper to manage traces
class TraceManager {
  static createTraceDir(dir: string) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  static getTracePath(testName: string, suffix: string = ''): string {
    const dir = 'traces/detailed';
    this.createTraceDir(dir);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return path.join(dir, `${testName}-${timestamp}${suffix}.trace`);
  }
}

test('user profile update', async ({ page, context }, testInfo) => {
  const tracePath = TraceManager.getTracePath(testInfo.title);
  
  await context.tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true,
  });

  try {
    // Test code
    await page.goto('https://example.com/profile');
    await page.fill('input[name="fullname"]', 'John Doe');
    await page.click('button:has-text("Save")');
    await expect(page.locator('.success-message')).toBeVisible();

  } catch (error) {
    console.error('Test failed:', error);
    throw error;

  } finally {
    // Save trace with metadata
    await context.tracing.stop({ path: tracePath });
    console.log(`Trace saved to: ${tracePath}`);
  }
});
```

---

## Trace Viewer UI Guide

When you open a trace, you'll see:

```
┌─────────────────────────────────────────────────────────┐
│ Trace Viewer Interface                                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Timeline Scrubber (drag to navigate)                  │
│  ─────────────────────────────────────                  │
│                                                         │
│  Actions List          │ Screenshots  │ DOM Snapshots   │
│  ─────────────────── │ ──────────────│ ──────────────   │
│  • navigate           │              │                  │
│  • click              │ [Screenshot] │ <html>...</html> │
│  • fill               │              │                  │
│  • press              │              │                  │
│                       │              │                  │
│  Network Requests     │ Console      │ Performance     │
│  ─────────────────────│ ──────────── │ ────────────────│
│  • GET /api/users     │ log: "test"  │ Load: 1.2s      │
│  • POST /submit       │ error: "404" │ Ready: 0.8s     │
│                       │              │                  │
└─────────────────────────────────────────────────────────┘
```

---

## Troubleshooting

### Issue: Trace files are too large
**Solution:**
```typescript
trace: {
  mode: 'on-first-retry',
  screenshots: true,
  snapshots: false,  // Disable if not needed
}
```

### Issue: Traces not being saved
**Solution:**
```typescript
// Ensure path is specified
await context.tracing.stop({
  path: './traces/my-test.trace'  // Must provide path
});
```

### Issue: Can't open trace file
**Solution:**
```bash
# Always use the Playwright viewer
npx playwright show-trace ./trace.trace

# Don't try to open .trace files directly in browsers
```

### Issue: CI traces not showing up
**Solution:**
```yaml
# GitHub Actions - Upload traces as artifacts
- uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-traces
    path: test-results/
    retention-days: 30
```

---

## Summary

| Feature | Value |
|---------|-------|
| **What** | Records complete test execution flow |
| **How** | Browser DevTools protocol |
| **Output** | `.trace` files (JSON-based) |
| **Viewing** | `npx playwright show-trace` |
| **Best for** | Debugging failures, analyzing performance |
| **Storage** | Typically 1-50MB per trace |
| **CI Strategy** | Use `on-first-retry` for efficiency |

Trace Viewer is essential for professional test debugging and should be part of every Playwright test suite!
