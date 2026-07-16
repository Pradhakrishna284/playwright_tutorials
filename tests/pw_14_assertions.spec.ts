import { test, expect } from '@playwright/test';

test.describe('Playwright Assertions - Complete Guide', () => {
  // ===== 1. PAGE & URL ASSERTIONS =====
  test('1.1 - Check page URL', async ({ page }) => {
    await page.goto('https://example.com');
    // Exact match
    expect(page).toHaveURL('https://example.com/');
    // Partial match with regex
    expect(page).toHaveURL(/example/);
  });

  test('1.2 - Check page title', async ({ page }) => {
    await page.goto('https://example.com');
    expect(page).toHaveTitle('Example Domain');
    expect(page).toHaveTitle(/Example/);
  });

  // ===== 2. VISIBILITY ASSERTIONS =====
  test('2.1 - Element visibility checks', async ({ page }) => {
    await page.goto('https://example.com');
    const element = page.locator('h1');
    
    // Check if element is visible
    expect(element).toBeVisible();
    // Check if element is hidden
    expect(element).toBeHidden();
  });

  test('2.2 - Element enabled/disabled state', async ({ page }) => {
    await page.goto('https://example.com');
    const button = page.locator('button');
    
    // Check if enabled
    await expect(button).toBeEnabled();
    // Check if disabled
    await expect(button).toBeDisabled();
  });

  test('2.3 - Element in viewport', async ({ page }) => {
    await page.goto('https://example.com');
    const element = page.locator('h1');
    
    // Check if element is visible in viewport
    expect(element).toBeInViewport();
  });

  // ===== 3. TEXT CONTENT ASSERTIONS =====
  test('3.1 - Exact text matching', async ({ page }) => {
    await page.goto('https://example.com');
    const heading = page.locator('h1');
    
    // Exact text match (trimmed)
    expect(heading).toHaveText('Example Domain');
    // Will fail if there are extra spaces
  });

  test('3.2 - Partial text matching', async ({ page }) => {
    await page.goto('https://example.com');
    const heading = page.locator('h1');
    
    // Partial match - element contains text
    expect(heading).toContainText('Example');
  });

  test('3.3 - Text content with regex', async ({ page }) => {
    await page.goto('https://example.com');
    const heading = page.locator('h1');
    
    // Using regex for flexible matching
    expect(heading).toHaveText(/^Example/i);
    // i flag = case insensitive
  });

  test('3.4 - Empty text checks', async ({ page }) => {
    await page.goto('https://example.com');
    const element = page.locator('div');
    
    // Check if element has no text
    expect(element).toBeEmpty();
  });

  // ===== 4. ATTRIBUTE ASSERTIONS =====
  test('4.1 - Element has attribute', async ({ page }) => {
    await page.goto('https://example.com');
    const link = page.locator('a').first();
    
    // Check if attribute exists with specific value
    expect(link).toHaveAttribute('href', /example/);
  });

  test('4.2 - Check attribute value', async ({ page }) => {
    await page.goto('https://example.com');
    const link = page.locator('a').first();
    
    // Exact attribute value
    const href = await link.getAttribute('href');
    expect(href).toBe('https://www.iana.org/domains/example');
  });

  test('4.3 - Check class attribute', async ({ page }) => {
    await page.goto('https://example.com');
    const element = page.locator('body');
    
    // Check if element has specific class
    expect(element).toHaveClass(/.*class.*/);
  });

  test('4.4 - Input value checks', async ({ page }) => {
    await page.goto('https://example.com');
    const input = page.locator('input[type="text"]');
    
    // Check input field value
    if (await input.isVisible()) {
      expect(input).toHaveValue(/^expected/);
    }
  });

  // ===== 5. COUNT & EXISTENCE ASSERTIONS =====
  test('5.1 - Count elements', async ({ page }) => {
    await page.goto('https://example.com');
    const links = page.locator('a');
    
    // Exact count
    expect(links).toHaveCount(1);
  });

  test('5.2 - Element existence', async ({ page }) => {
    await page.goto('https://example.com');
    const heading = page.locator('h1');
    
    // Element exists (at least one)
    await expect(heading).toBeTruthy();
  });

  // ===== 6. GENERIC ASSERTIONS =====
  test('6.1 - Generic value assertions', async ({ page }) => {
    await page.goto('https://example.com');
    
    // Basic truthy/falsy assertions
    expect(true).toBeTruthy();
    expect(false).toBeFalsy();
    expect(null).toBeNull();
    expect(undefined).toBeUndefined();
    expect(5).toBeDefined();
  });

  test('6.2 - String assertions', async ({ page }) => {
    const text = 'Hello Playwright';
    
    expect(text).toMatch('Playwright');
    expect(text).toMatch(/playwright/i);
    expect(text).toEqual('Hello Playwright');
    expect(text).toBe('Hello Playwright');
  });

  test('6.3 - Number assertions', async ({ page }) => {
    const num = 42;
    
    expect(num).toBe(42);
    expect(num).toBeGreaterThan(40);
    expect(num).toBeGreaterThanOrEqual(42);
    expect(num).toBeLessThan(50);
    expect(num).toBeLessThanOrEqual(42);
    expect(num).toBeCloseTo(42.1, 0); // Delta = 0.1
  });

  test('6.4 - Array & Object assertions', async ({ page }) => {
    const arr = [1, 2, 3];
    const obj = { name: 'Playwright', version: '1.40' };
    
    // Array assertions
    expect(arr).toContain(2);
    expect(arr).toEqual([1, 2, 3]);
    expect(arr).toHaveLength(3);
    
    // Object assertions
    expect(obj).toHaveProperty('name', 'Playwright');
    expect(obj).toEqual({ name: 'Playwright', version: '1.40' });
  });

  // ===== 7. LOCATOR-SPECIFIC ASSERTIONS =====
  test('7.1 - Locator existence', async ({ page }) => {
    await page.goto('https://example.com');
    
    // Check if locator finds any elements
    const element = page.locator('h1');
    const notFound = page.locator('h999');
    
    // Using filter for precise assertions
    const visibleHeadings = page.locator('h1').filter({ hasText: 'Example' });
    expect(visibleHeadings).toBeVisible();
  });

  // ===== 8. SOFT ASSERTIONS =====
  test('8.1 - Soft assertions (non-blocking failures)', async ({ page }) => {
    await page.goto('https://example.com');
    
    // Soft assertions don't stop test execution
    expect.soft(page).toHaveTitle('Wrong Title');
    expect.soft(page).toHaveURL('https://wrong.url');
    
    // Test continues even if soft assertions fail
    expect(page).toHaveTitle('Example Domain');
  });

  // ===== 9. NOT ASSERTIONS =====
  test('9.1 - Negated assertions', async ({ page }) => {
    await page.goto('https://example.com');
    
    expect(page).not.toHaveURL('https://google.com');
    expect(page.locator('h999')).not.toBeVisible();
    expect('Hello').not.toBe('Goodbye');
  });

  // ===== 10. ASYNC ASSERTIONS WITH POLLING =====
  test('10.1 - Assertions with automatic retrying', async ({ page }) => {
    await page.goto('https://example.com');
    
    // These automatically retry for up to 5 seconds (default timeout)
    const element = page.locator('h1');
    
    // Auto-retry until element appears
    await expect(element).toBeVisible();
    
    // Change timeout for specific assertion
    await expect(element).toBeVisible({ timeout: 10000 });
  });

  test('10.2 - Text content updates', async ({ page }) => {
    await page.goto('https://example.com');
    const heading = page.locator('h1');
    
    // Will retry until text matches
    await expect(heading).toHaveText('Example Domain');
  });

  // ===== 11. COMPARISON OPERATORS =====
  test('11.1 - Using comparison methods', async ({ page }) => {
    const values = [5, 10, 15, 20];
    
    // String/Array comparisons
    expect(values).toEqual([5, 10, 15, 20]); // Deep equality
    expect('test').not.toEqual('Test'); // Case sensitive
  });

  // ===== 12. PRACTICAL EXAMPLES =====
  test('12.1 - Form validation assertions', async ({ page }) => {
    await page.goto('https://example.com');
    
    const form = page.locator('form');
    const submitBtn = form.locator('button[type="submit"]');
    
    // Multi-assertion validation
    expect(form).toBeVisible();
    expect(submitBtn).toBeEnabled();
    expect(submitBtn).toHaveText(/submit/i);
  });

  test('12.2 - Modal/Dialog assertions', async ({ page }) => {
    await page.goto('https://example.com');
    
    const modal = page.locator('[role="dialog"]');
    const closeBtn = modal.locator('button[aria-label="Close"]');
    
    expect(modal).toBeVisible();
    expect(closeBtn).toBeVisible();
    expect(modal).toContainText(/information/i);
  });

  test('12.3 - Dropdown/Select assertions', async ({ page }) => {
    await page.goto('https://example.com');
    
    const select = page.locator('select');
    
    if (await select.isVisible()) {
      expect(select).toBeEnabled();
      
      // Get all options
      const options = await select.locator('option').count();
      expect(options).toBeGreaterThan(0);
    }
  });

  test('12.4 - Table data assertions', async ({ page }) => {
    await page.goto('https://example.com');
    
    const table = page.locator('table');
    const rows = table.locator('tbody tr');
    
    expect(table).toBeVisible();
    expect(rows).toHaveCount(10); // Assuming 10 rows
    
    // Check specific cell
    const firstCell = rows.first().locator('td').first();
    expect(firstCell).toContainText(/value/);
  });
});

// ===== ASSERTION QUICK REFERENCE =====
/*
VISIBILITY:
  toBeVisible()
  toBeHidden()
  toBeEnabled()
  toBeDisabled()
  toBeInViewport()
  toBeEditable()
  toBeChecked()

TEXT & CONTENT:
  toHaveText(text)
  toContainText(text)
  toBeEmpty()

ATTRIBUTES:
  toHaveAttribute(name, value)
  toHaveClass(class)
  toHaveValue(value)
  toHaveId(id)
  toHaveCSS(property, value)

PAGE:
  toHaveURL(url)
  toHaveTitle(title)

COUNT:
  toHaveCount(count)

GENERIC:
  toBe(value) - strict equality (===)
  toEqual(value) - deep equality
  toMatch(pattern)
  toBeTruthy() / toBeFalsy()
  toBeNull() / toBeUndefined() / toBeDefined()
  toBeGreaterThan() / toBeLessThan()
  toBeCloseTo(value, decimals)
  toContain(value)
  toHaveLength(length)
  toHaveProperty(key, value)
  toThrow()

MODIFIERS:
  not - negate assertion (expect().not.toBeVisible())
  soft() - non-blocking assertion (expect.soft())

TIMEOUTS:
  { timeout: 5000 } - custom timeout for assertion polling
*/
