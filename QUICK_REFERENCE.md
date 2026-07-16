# Playwright Quick Reference Guide

## Test Structure Template

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Group', () => {
  test.beforeAll(async () => {
    // Run once per group
  });

  test.beforeEach(async ({ page }) => {
    // Run before each test
    await page.goto('https://example.com');
  });

  test.afterEach(async ({ page }) => {
    // Run after each test
    if (test.info().status !== 'passed') {
      await page.screenshot();
    }
  });

  test('should perform action', async ({ page }) => {
    // Arrange
    const input = page.locator('input[name="email"]');
    
    // Act
    await input.fill('user@example.com');
    await page.click('button:has-text("Submit")');
    
    // Assert
    await expect(page).toHaveURL('/success');
  });
});
```

---

## Common Selectors

```typescript
// Recommended: Role-based (most accessible)
page.locator('role=button[name="Click me"]')
page.locator('role=heading[name="Page Title"]')
page.locator('role=textbox[name="Email"]')

// Recommended: Test ID
page.locator('[data-testid="submit-button"]')

// By text
page.locator('text=Click me')
page.locator('button:has-text("Click me")')

// By CSS
page.locator('button.primary')
page.locator('#main-content')
page.locator('.modal-dialog button')

// By XPath
page.locator('//button[@type="submit"]')
page.locator('//input[@name="email"]')

// By placeholder
page.locator('[placeholder="Enter email"]')

// By attribute
page.locator('[data-value="123"]')
```

---

## Common Actions

```typescript
// Navigation
await page.goto('https://example.com');
await page.go back();
await page.reload();

// Filling inputs
await page.fill('input[name="email"]', 'user@example.com');
await page.locator('input[name="email"]').fill('user@example.com');

// Clicking
await page.click('button');
await page.click('text=Click me');
await page.locator('button').click();

// Checkboxes & Radio
await page.check('input[type="checkbox"]');  // Check
await page.uncheck('input[type="checkbox"]'); // Uncheck
await page.check('input[value="option1"]');  // Radio

// Selects/Dropdowns
await page.selectOption('select#country', 'usa');
await page.selectOption('select', { value: 'us' });

// Type (slower, character by character)
await page.type('input[name="search"]', 'Playwright');

// Keyboard
await page.press('input[name="email"]', 'Enter');
await page.keyboard.press('ArrowDown');
await page.keyboard.down('Shift');
await page.keyboard.up('Shift');

// Focus/Blur
await page.locator('input').focus();
await page.locator('input').blur();

// Hover
await page.locator('element').hover();

// Drag and drop
await page.locator('#source').dragTo(page.locator('#target'));

// Triple-click (select all in input)
await page.locator('input').tripleClick();
```

---

## Common Assertions

### Visibility & State
```typescript
await expect(locator).toBeVisible();
await expect(locator).toBeHidden();
await expect(locator).toBeEnabled();
await expect(locator).toBeDisabled();
await expect(locator).toBeChecked();
await expect(locator).toBeInViewport();
await expect(locator).toBeFocused();
await expect(locator).toBeEditable();
```

### Text & Content
```typescript
await expect(locator).toHaveText('Expected text');
await expect(locator).toContainText('Partial text');
await expect(locator).toHaveTextContent(/regex/);
```

### Value
```typescript
await expect(locator).toHaveValue('expected_value');
await expect(locator).toHaveAttribute('type', 'email');
await expect(locator).toHaveClass('active');
```

### Count
```typescript
await expect(locator).toHaveCount(5);
```

### URL & Title
```typescript
await expect(page).toHaveURL('https://example.com');
await expect(page).toHaveURL(/example/);
await expect(page).toHaveTitle('Page Title');
```

### Soft Assertions (continue on failure)
```typescript
await expect.soft(locator).toBeVisible();
```

---

## Waiting & Timeouts

```typescript
// Auto-waiting (built-in for actions)
await page.click('button');  // Waits for actionability

// Wait for element
await page.waitForSelector('button');
await page.locator('button').waitFor();

// Wait for function
await page.waitForFunction(() => document.title.includes('Loaded'));

// Wait for navigation
await page.waitForNavigation();
await page.click('link');  // Also triggers waitForNavigation

// Wait for load state
await page.goto('https://example.com');
await page.waitForLoadState('networkidle');
await page.waitForLoadState('domcontentloaded');

// Wait for event
const [popup] = await Promise.all([
  page.waitForEvent('popup'),
  page.click('a[target="_blank"]')
]);

// Custom timeout
await expect(locator).toBeVisible({ timeout: 5000 });
await page.goto(url, { timeout: 30000 });
```

---

## Getting Information

```typescript
// Text content
const text = await page.locator('h1').textContent();
const innerText = await page.locator('h1').innerText();

// Input value
const value = await page.locator('input').inputValue();

// Attribute
const type = await page.locator('input').getAttribute('type');

// Count elements
const count = await page.locator('.item').count();

// Is visible/enabled
const isVisible = await page.locator('button').isVisible();
const isEnabled = await page.locator('button').isEnabled();

// Get page info
const url = page.url();
const title = await page.title();

// Get all matched elements
const items = await page.locator('.item').all(); // Returns array
for (const item of items) {
  console.log(await item.textContent());
}

// Get nth element
const firstItem = page.locator('.item').first();
const secondItem = page.locator('.item').nth(1);
const lastItem = page.locator('.item').last();
```

---

## Advanced Interactions

### File Upload
```typescript
// Upload single file
await page.locator('input[type="file"]').setInputFiles('path/to/file.pdf');

// Upload multiple files
await page.locator('input[type="file"]').setInputFiles([
  'file1.pdf',
  'file2.pdf'
]);

// Clear file input
await page.locator('input[type="file"]').setInputFiles([]);
```

### File Download
```typescript
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.click('a[download]')
]);

const path = await download.path();
const filename = download.suggestedFilename();
```

### Popups/New Tabs
```typescript
// Wait for popup
const [popup] = await Promise.all([
  page.waitForEvent('popup'),
  page.click('link')
]);

await popup.waitForLoadState();
const title = await popup.title();

// Wait for new page (context)
const [newPage] = await Promise.all([
  context.waitForEvent('page'),
  page.click('a[target="_blank"]')
]);
```

### iFrames
```typescript
// Access iframe
const frame = page.frameLocator('iframe#embedded');
await frame.locator('button').click();

// Get all frames
const frames = page.frames();

// Access frame by name
const frame = page.frame('iframe-name');
```

### Dialog Boxes
```typescript
// Alert/Confirm/Prompt
page.on('dialog', dialog => {
  console.log(dialog.message());
  dialog.accept();  // or dismiss()
});

// Trigger alert
await page.click('button');  // That triggers alert
```

### Screenshots & Videos
```typescript
// Screenshot
await page.screenshot({ path: 'screenshot.png' });
await page.screenshot({ path: 'full-page.png', fullPage: true });

// Specific element
await page.locator('#element').screenshot({ path: 'element.png' });
```

---

## Context & Page Management

```typescript
// Create context
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  locale: 'en-US',
  timezone: 'America/New_York',
});

// Create page
const page = await context.newPage();

// Set viewport
await page.setViewportSize({ width: 1280, height: 720 });

// Get all pages in context
const pages = context.pages();

// Add cookies
await context.addCookies([{
  name: 'sessionId',
  value: 'abc123',
  url: 'https://example.com'
}]);

// Get cookies
const cookies = await context.cookies();

// Clear cookies
await context.clearCookies();
context.clearCookies({ name: 'sessionId' }); // Specific cookie

// Close
await page.close();
await context.close();
await browser.close();
```

---

## JavaScript Execution

```typescript
// Execute async function
const value = await page.evaluate(async () => {
  return await fetch('https://api.example.com').then(r => r.json());
});

// Pass data to function
const result = await page.evaluate(([a, b]) => a + b, [1, 2]);

// Get element info
const boundingBox = await page.evaluate(() => {
  const element = document.querySelector('button');
  return element.getBoundingClientRect();
});

// Inject function
await page.evaluateHandle((selector) => {
  window.clicked = document.querySelectorAll(selector).length;
}, '.item');

const clicked = await page.evaluate(() => window.clicked);
```

---

## Error Handling

```typescript
// Try-catch for soft failures
try {
  await expect(locator).toBeVisible({ timeout: 1000 });
} catch (error) {
  console.log('Element not found (expected):',error);
}

// Soft assertions
await expect.soft(locator).toBeVisible();
await expect.soft(locator).toHaveText('text');
// Test continues even if soft assertions fail

// Skip/only
test.skip('this test is skipped', async () => {});
test.only('run only this test', async () => {});

// Fixme (marks test as to-fix)
test.fixme('this needs fixing', async () => {});
```

---

## Configuration Quick Reference

```typescript
// playwright.config.ts
export default defineConfig({
  // Paths
  testDir: './tests',
  testIgnore: '**/example.spec.ts',
  
  // Parallelism
  fullyParallel: true,
  workers: process.env.CI ? 1 : undefined,
  
  // Retries & Timeouts
  retries: process.env.CI ? 2 : 0,
  timeout: 60 * 1000,
  expect: { timeout: 10 * 1000 },
  
  // Filtering
  grep: /@smoke/, // Run only @smoke tests
  
  // Reporting
  reporter: [
    ['html', { open: 'always' }],
    ['line'],
    ['json', { outputFile: 'test-results.json' }],
  ],
  
  // Screenshots/Videos
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
});
```

---

## CLI Commands

```bash
# Run all tests
npx playwright test

# Run specific file
npx playwright test tests/login.spec.ts

# Run tests matching pattern
npx playwright test --grep "login"

# Run with tag
npx playwright test --grep "@smoke"

# Run specific browser
npx playwright test --project=chromium

# Run with options
npx playwright test --headed --debug --slow-mo=1000

# Watch mode
npx playwright test --watch

# Generate report
npx playwright show-report

# Codegen (record test)
npx playwright codegen https://example.com
```

---

## Custom Fixture Template

```typescript
import { test as base, expect } from '@playwright/test';

const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // Setup
    await page.goto('https://example.com/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button:has-text("Login")');
    await page.waitForURL('**/dashboard');
    
    // Use in test
    await use(page);
    
    // Teardown
    await page.click('button:has-text("Logout")');
  },
});

// Use
test('should access dashboard', async ({ authenticatedPage }) => {
  await expect(authenticatedPage).toHaveURL(/\/dashboard/);
});

export { test, expect };
```

---

## Common Testing Patterns

### Arrange-Act-Assert
```typescript
test('should login successfully', async ({ page }) => {
  // Arrange
  await page.goto('https://example.com/login');
  const emailInput = page.locator('input[name="email"]');
  const passwordInput = page.locator('input[name="password"]');
  
  // Act
  await emailInput.fill('user@example.com');
  await passwordInput.fill('password');
  await page.click('button:has-text("Login")');
  
  // Assert
  await expect(page).toHaveURL('/dashboard');
});
```

### Page Object Model
```typescript
class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button:has-text("Login")');
  }
  
  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

// Usage
test('should login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.goto('https://example.com/login');
  await loginPage.login('user@example.com', 'password');
});
```

---

**Save this file for quick reference while writing tests!**
