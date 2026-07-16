# Playwright Timeouts: Comprehensive Guide

## Overview

Timeouts in Playwright define how long the test framework will wait for certain conditions to be met before throwing an error. Proper timeout configuration is critical for reliable test execution.

**Three main timeout categories:**
1. **Action Timeouts** - for user interactions (click, fill, type, etc.)
2. **Assertion Timeouts** - for expect() statements
3. **Test Timeouts** - for entire test execution

---

## Default Timeout Values

### Global Defaults

| Timeout Type | Default Value | Use Case |
|--------------|---------------|----------|
| Test Timeout | 30 seconds | Entire test execution |
| Action Timeout | 30 seconds | Each action (click, fill, etc.) |
| Assertion Timeout | 5 seconds | Each expect() statement |
| Navigation Timeout | 30 seconds | page.goto(), page.waitForNavigation() |

### Quick Reference

```typescript
// Playwright built-in defaults (in milliseconds)
30000  // 30 seconds - test & action timeout
5000   // 5 seconds - assertion timeout
30000  // 30 seconds - navigation timeout
```

---

## Configuration Levels

Timeouts can be configured at multiple levels (in order of precedence):

### Level 1: Global Configuration (playwright.config.ts)

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Overall test timeout - applies to entire test
  timeout: 30000, // 30 seconds
  
  use: {
    // Action timeout - applies to all actions
    actionTimeout: 10000, // 10 seconds
  },
  
  expect: {
    // Assertion timeout - applies to all expect() statements
    timeout: 5000, // 5 seconds
  },
  
  // Navigation timeout for goto/waitForNavigation
  navigationTimeout: 30000, // 30 seconds
  
  webServer: {
    command: 'npm run start',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // 120 seconds to start server
  },
});
```

### Level 2: Context-Level Configuration

```typescript
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ browser }) => {
  const context = await browser.newContext();
  
  // Set timeout for entire context
  context.setDefaultTimeout(15000); // 15 seconds
  
  // Set navigation timeout for context
  context.setDefaultNavigationTimeout(20000); // 20 seconds
});
```

### Level 3: Test-Level Configuration

```typescript
import { test, expect } from '@playwright/test';

test.describe('Slow Loading Tests', () => {
  test.use({ 
    actionTimeout: 20000, // 20 seconds for actions
  });
  
  test('slow action test', async ({ page }) => {
    await page.goto('https://slow-website.com');
    // Actions now have 20 second timeout
  });
});
```

### Level 4: Action-Level Configuration (Highest Priority)

```typescript
test('action-specific timeouts', async ({ page }) => {
  // Override timeout for this specific action
  await page.click('button', { timeout: 5000 }); // 5 seconds
  
  // This action uses the default again
  await page.fill('input', 'text'); // Back to global default
  
  // Override assertion timeout
  await expect(page.locator('.loading')).not.toBeVisible({ 
    timeout: 3000 
  });
});
```

---

## Types of Timeouts

### 1. Test Timeout

Controls the maximum time allowed for an entire test to complete.

```typescript
import { test, expect } from '@playwright/test';

test('quick test', async ({ page }) => {
  // Default: 30 seconds for entire test
  await page.goto('https://example.com');
  await page.click('button');
  await expect(page.locator('.result')).toBeVisible();
});

test.only('slow test with custom timeout', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds for this test only
  
  // Complex operations that take time
  await page.goto('https://slow-site.com');
  for (let i = 0; i < 10; i++) {
    await page.click('button.load-more');
    await page.waitForLoadState('networkidle');
  }
});

test('very fast test', async ({ page }) => {
  test.setTimeout(5000); // Only 5 seconds
  await page.goto('https://example.com');
  await expect(page.title()).toContain('Example');
});
```

### 2. Action Timeout

Controls how long actions wait for elements to become actionable.

```typescript
test('action timeouts', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Default action timeout (30 seconds by default)
  await page.click('button.visible');
  
  // Custom timeout for slow-appearing element
  await page.click('button.slow-to-appear', { 
    timeout: 15000 // Wait 15 seconds
  });
  
  // Short timeout for element that should be ready
  await page.fill('input[type="email"]', 'test@example.com', { 
    timeout: 2000 // Only wait 2 seconds
  });
  
  // Very long timeout for very slow element
  await page.click('button.very-slow', { 
    timeout: 60000 // Wait 60 seconds
  });
});
```

### 3. Navigation Timeout

Controls how long page.goto() waits for a page to load.

```typescript
test('navigation timeouts', async ({ page }) => {
  // Default: 30 seconds
  await page.goto('https://example.com');
  
  // Custom navigation timeout
  await page.goto('https://slow-loading-site.com', {
    waitUntil: 'domcontentloaded', // Don't wait for full load
    timeout: 10000 // 10 seconds
  });
  
  // Navigate with network idle (wait for all network requests)
  await page.goto('https://api-heavy-site.com', {
    waitUntil: 'networkidle', // Wait for network to be idle
    timeout: 60000 // 60 seconds
  });
  
  // Navigate with load (wait for window.onload)
  await page.goto('https://example.com', {
    waitUntil: 'load', // Wait for load event
    timeout: 30000 // 30 seconds
  });
});
```

**Navigation WaitUntil Options:**
- `load` - Wait for window.onload event
- `domcontentloaded` - Wait for DOMContentLoaded event
- `networkidle` - Wait for no network activity
- `commit` - Minimal wait (rarely used)

### 4. Assertion Timeout

Controls how long expect() statements wait for conditions.

```typescript
test('assertion timeouts', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Default assertion timeout (5 seconds)
  await expect(page.locator('h1')).toContainText('Welcome');
  
  // Short timeout for element that should be visible immediately
  await expect(page.locator('.instant-message')).toBeVisible({ 
    timeout: 1000 // 1 second
  });
  
  // Long timeout for loading state that takes time
  await expect(page.locator('.loading-complete')).toBeVisible({ 
    timeout: 15000 // 15 seconds
  });
  
  // Very long timeout for slow API response
  await expect(page.locator('text=Data loaded')).toBeVisible({ 
    timeout: 30000 // 30 seconds
  });
});
```

### 5. Wait-Specific Timeouts

```typescript
test('specific wait timeouts', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Wait for selector with timeout
  await page.waitForSelector('.modal', { timeout: 10000 });
  
  // Wait for function with timeout
  await page.waitForFunction(() => {
    return document.querySelectorAll('li').length > 5;
  }, { timeout: 15000 });
  
  // Wait for navigation with timeout
  await page.waitForNavigation({ timeout: 20000 });
  
  // Wait for load state with timeout
  await page.waitForLoadState('networkidle', { timeout: 30000 });
  
  // Wait for response with timeout
  const response = await page.waitForResponse('**/api/**', { 
    timeout: 10000 
  });
});
```

---

## Common Timeout Scenarios

### Scenario 1: Slow Network

```typescript
test('handle slow network', async ({ page }) => {
  // Increase timeouts for slower connections
  await page.goto('https://example.com', {
    waitUntil: 'domcontentloaded', // Don't wait for all resources
    timeout: 45000 // 45 seconds
  });
  
  // Use longer action timeouts
  await page.click('button', { timeout: 20000 });
  
  // Use longer assertion timeouts
  await expect(page.locator('.result')).toBeVisible({ 
    timeout: 20000 
  });
});
```

### Scenario 2: Animated Elements

```typescript
test('interact with animated elements', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Animations take time, so increase timeout
  await page.click('button.animate-in', { 
    timeout: 10000 // Animation + actionability
  });
  
  // Wait for animation to complete
  await page.waitForFunction(() => {
    const element = document.querySelector('.animated');
    // Check if animation is done (not animating class)
    return !element.classList.contains('animating');
  }, { timeout: 5000 });
});
```

### Scenario 3: Dynamic Content Loading

```typescript
test('wait for dynamic content', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Click to trigger dynamic load
  await page.click('button.load-data');
  
  // Wait for new content to appear
  await page.waitForSelector('.dynamic-content', { 
    timeout: 15000 
  });
  
  // Wait for animation to complete
  await page.waitForFunction(() => {
    const content = document.querySelector('.dynamic-content');
    return content && getComputedStyle(content).opacity === '1';
  }, { timeout: 5000 });
});
```

### Scenario 4: API Response Waiting

```typescript
test('wait for API response', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Wait for API call and action simultaneously
  const [response] = await Promise.all([
    page.waitForResponse(response => 
      response.url().includes('/api/users') && response.status() === 200,
      { timeout: 10000 }
    ),
    page.click('button.fetch-users')
  ]);
  
  // Verify response
  const data = await response.json();
  console.log('Users:', data);
});
```

### Scenario 5: Modal Dialog

```typescript
test('modal with timeout', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Click to open modal
  await page.click('button.open-modal');
  
  // Wait for modal to appear and become stable
  await expect(page.locator('.modal-overlay')).toBeVisible({ 
    timeout: 10000 
  });
  
  // Wait for modal animation to complete
  await page.waitForFunction(() => {
    const modal = document.querySelector('.modal');
    return modal && getComputedStyle(modal).opacity === '1';
  }, { timeout: 3000 });
  
  // Interact with modal
  await page.fill('.modal input', 'data', { timeout: 5000 });
});
```

---

## Error Handling with Timeouts

### Catching Timeout Errors

```typescript
import { test, expect } from '@playwright/test';

test('handle timeout errors', async ({ page }) => {
  try {
    await page.click('button.never-appears', { timeout: 2000 });
  } catch (error) {
    // Handle timeout error
    if (error.name === 'TimeoutError') {
      console.log('Element never became visible');
      await page.screenshot({ path: 'timeout-debug.png' });
      throw error; // Re-throw or handle gracefully
    }
  }
});

test('graceful timeout handling', async ({ page }) => {
  try {
    await expect(page.locator('.important-data')).toBeVisible({ 
      timeout: 5000 
    });
  } catch (error) {
    console.log('Data not loaded in time, retrying...');
    
    // Retry with longer timeout
    await expect(page.locator('.important-data')).toBeVisible({ 
      timeout: 15000 
    });
  }
});
```

### Debugging Timeout Issues

```typescript
test('debug timeout problems', async ({ page }) => {
  try {
    await page.click('button.mysterious', { timeout: 5000 });
  } catch (error) {
    console.log('Timeout occurred. Debugging info:');
    
    // Get element state
    const exists = await page.locator('button.mysterious').count() > 0;
    const visible = await page.locator('button.mysterious').isVisible();
    const enabled = await page.locator('button.mysterious').isEnabled();
    
    console.log(`Exists: ${exists}, Visible: ${visible}, Enabled: ${enabled}`);
    
    // Take screenshot
    await page.screenshot({ path: 'debug-timeout.png' });
    
    // Log HTML
    const html = await page.locator('button.mysterious').evaluate(el => el.outerHTML);
    console.log('Element HTML:', html);
    
    throw error;
  }
});
```

---

## Real-World Examples

### Example 1: E-Commerce Checkout

```typescript
import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test.use({ 
    actionTimeout: 15000, // Longer timeout for e-commerce
  });

  test('complete purchase with timeouts', async ({ page }) => {
    // Navigate with longer timeout
    await page.goto('https://shop.example.com', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    // Add to cart
    await page.click('button:has-text("Add to Cart")', { 
      timeout: 10000 
    });
    
    // Wait for notification
    await expect(page.locator('.notification')).toContainText('Added', { 
      timeout: 5000 
    });
    
    // Navigate to cart with longer timeout
    await page.goto('https://shop.example.com/cart', {
      waitUntil: 'domcontentloaded',
      timeout: 20000
    });
    
    // Proceed to checkout
    await page.click('button:has-text("Checkout")');
    
    // Wait for checkout form to load
    await expect(page.locator('form.checkout')).toBeVisible({ 
      timeout: 10000 
    });
    
    // Fill form with standard timeout
    await page.fill('input[name="email"]', 'user@example.com', { 
      timeout: 5000 
    });
    
    // Submit order - wait for API response
    const [response] = await Promise.all([
      page.waitForResponse(r => 
        r.url().includes('/api/checkout') && r.status() === 200,
        { timeout: 15000 }
      ),
      page.click('button:has-text("Place Order")')
    ]);
    
    // Verify success
    await expect(page.locator('h1:has-text("Order Confirmed")')).toBeVisible({ 
      timeout: 10000 
    });
  });
});
```

### Example 2: Data-Heavy Application

```typescript
test('data-heavy app with custom timeouts', async ({ page }) => {
  test.setTimeout(120000); // 2 minutes for entire test
  
  await page.goto('https://dashboard.example.com', {
    waitUntil: 'networkidle',
    timeout: 45000 // Long initial load
  });
  
  // Wait for dashboard to render
  await page.waitForFunction(() => {
    const charts = document.querySelectorAll('.chart');
    return charts.length > 0;
  }, { timeout: 30000 });
  
  // Click to load detailed view
  await page.click('button.view-details', { timeout: 10000 });
  
  // Wait for data API response
  await page.waitForResponse(r => 
    r.url().includes('/api/details'),
    { timeout: 20000 }
  );
  
  // Wait for detailed view to render
  await expect(page.locator('.details-panel')).toBeVisible({ 
    timeout: 15000 
  });
  
  // Load more data
  for (let i = 0; i < 5; i++) {
    await page.click('button.load-more', { timeout: 5000 });
    await page.waitForTimeout(1000); // Small delay between loads
  }
  
  // Verify final state
  await expect(page.locator('.data-loaded')).toBeVisible({ 
    timeout: 10000 
  });
});
```

### Example 3: Third-Party Services

```typescript
test('third-party service integration', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Click to load external service
  await page.click('button.open-payment');
  
  // Third-party services can be slow - use longer timeout
  await page.waitForSelector('iframe[src*="payment"]', { 
    timeout: 20000 
  });
  
  // Wait for iframe to be fully loaded
  const frame = page.frameLocator('iframe[src*="payment"]');
  await expect(frame.locator('form')).toBeVisible({ 
    timeout: 15000 
  });
  
  // Wait for payment service response
  const [response] = await Promise.all([
    page.waitForResponse(r => 
      r.url().includes('payment-processor.com'),
      { timeout: 30000 }
    ),
    page.click('button:has-text("Pay")')
  ]);
});
```

---

## Configuration Best Practices

### Development Configuration

```typescript
// playwright.config.ts - Development
export default defineConfig({
  timeout: 30000, // 30 seconds - good for dev
  use: {
    actionTimeout: 10000, // 10 seconds
  },
  expect: {
    timeout: 5000, // 5 seconds
  },
});
```

### CI/CD Configuration

```typescript
// playwright.config.ts - CI/CD
export default defineConfig({
  timeout: process.env.CI ? 60000 : 30000, // 60 seconds in CI
  use: {
    actionTimeout: process.env.CI ? 20000 : 10000,
  },
  expect: {
    timeout: process.env.CI ? 10000 : 5000,
  },
  workers: process.env.CI ? 1 : 4, // Single worker in CI
});
```

### Project-Specific Configuration

```typescript
export default defineConfig({
  projects: [
    {
      name: 'Fast Tests',
      use: { ...devices['chromium'] },
      timeout: 15000, // Quick timeout
    },
    {
      name: 'Slow Tests',
      use: { ...devices['webkit'] }, // WebKit slower
      timeout: 60000, // Long timeout
    },
  ],
});
```

---

## Summary & Recommendations

| Type | Default | When to Increase | When to Decrease |
|------|---------|------------------|------------------|
| Test Timeout | 30s | Complex tests, slow APIs | Simple fast tests |
| Action Timeout | 30s | Animations, slow load | Quick interactions |
| Assertion Timeout | 5s | Loading states | Expected instant state |
| Navigation Timeout | 30s | Slow sites, heavy APIs | Fast SPAs |

### Quick Guidelines

✅ **DO:**
- Use longer timeouts for slow/external services
- Configure at global level for consistency
- Override only when necessary
- Test with realistic network conditions

❌ **DON'T:**
- Set timeouts too short (creates flaky tests)
- Set timeouts too long (hides real issues)
- Ignore TimeoutError exceptions
- Use waitForTimeout() to wait for specific durations

### Recommended Starting Values

```typescript
// For most applications
timeout: 30000          // 30 seconds
actionTimeout: 10000    // 10 seconds
assertionTimeout: 5000  // 5 seconds

// For slow/heavy applications
timeout: 60000          // 60 seconds
actionTimeout: 20000    // 20 seconds
assertionTimeout: 10000 // 10 seconds

// For fast/optimized applications
timeout: 15000          // 15 seconds
actionTimeout: 5000     // 5 seconds
assertionTimeout: 3000  // 3 seconds
```

Proper timeout configuration ensures tests are **reliable** (don't fail randomly), **fast** (don't waste time), and **accurate** (catch real issues).
