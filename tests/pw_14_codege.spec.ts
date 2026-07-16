import { test, expect } from '@playwright/test';

// ===== PLAYWRIGHT CODEGEN - COMPREHENSIVE GUIDE =====
// Codegen is a tool that records user interactions and generates Playwright test code automatically
// Perfect for quickly creating test scripts and learning Playwright syntax

// ===== 1. BASIC CODEGEN USAGE =====
/*
COMMAND: npx playwright codegen <url>
Example: npx playwright codegen https://example.com

This opens a browser window where you can interact with the website.
Every action you perform is recorded and converted to Playwright code.

KEY FEATURES:
- Browser window with interactive toolbar
- Generates test code in real-time
- Supports multiple browsers (Chromium, Firefox, Safari)
- Records clicks, typing, navigation, selections

WORKFLOW:
1. Run: npx playwright codegen https://example.com
2. Browser opens with recording toolbar
3. Interact with the page (click buttons, fill forms, etc.)
4. Code is generated on the right side
5. Copy generated code to your test file
6. Run tests with: npx playwright test
*/

// ===== 2. CODEGEN WITH DIFFERENT BROWSERS =====
/*
CHROMIUM (Default):
  npx playwright codegen https://example.com

FIREFOX:
  npx playwright codegen --browser=firefox https://example.com

WEBKIT (Safari):
  npx playwright codegen --browser=webkit https://example.com

ALL BROWSERS:
  npx playwright codegen --browser=chromium --browser=firefox --browser=webkit https://example.com
*/

// ===== 3. CODEGEN WITH SPECIFIC DEVICE EMULATION =====
/*
IPHONE:
  npx playwright codegen --device="iPhone 12" https://example.com

IPAD:
  npx playwright codegen --device="iPad Pro" https://example.com

GALAXY FOLD:
  npx playwright codegen --device="Galaxy Fold" https://example.com

List all devices:
  npx playwright codegen --list-devices

DEVICE WITH SPECIFIC BROWSER:
  npx playwright codegen --device="iPhone 12" --browser=webkit https://example.com
*/

// ===== 4. CODEGEN WITH VIEWPORT/SCREEN SIZE =====
/*
Custom viewport size:
  npx playwright codegen --viewport-size=1920,1080 https://example.com

COMMON VIEWPORT SIZES:
  Desktop: 1920x1080
  Tablet: 1024x768
  Mobile: 375x667
  HD: 1280x720
*/

// ===== 5. CODEGEN WITH AUTHENTICATION =====
/*
If you need to test authenticated pages:

Option 1: Load cookies from existing session
  npx playwright codegen --load-storage=auth.json https://example.com

Option 2: Manual login during codegen
  1. Run: npx playwright codegen https://example.com
  2. Manually login in the browser
  3. Then interact with authenticated pages
  4. Code will include all your interactions

Option 3: Use saved context/cookies
  npx playwright codegen --load-storage=./auth.json https://example.com/dashboard
*/

// ===== 6. CODEGEN WITH NETWORK CONDITIONS =====
/*
Slow network simulation:
  npx playwright codegen --slow-mo=1000 https://example.com
  (Slows down every action by 1000ms - useful for seeing what's recorded)

Offline mode:
  npx playwright codegen --offline https://example.com

Custom user agent:
  npx playwright codegen --user-agent="Custom User Agent" https://example.com
*/

// ===== 7. EXAMPLE 1: RECORDING A LOGIN FLOW =====
test('7.1 - Generated login flow example', async ({ page }) => {
  // This code was generated using:
  // npx playwright codegen https://example.com
  
  await page.goto('https://example.com/login');
  
  // Fill username
  await page.locator('input[name="username"]').click();
  await page.locator('input[name="username"]').fill('testuser@example.com');
  
  // Fill password
  await page.locator('input[name="password"]').click();
  await page.locator('input[name="password"]').fill('password123');
  
  // Click login button
  await page.locator('button:has-text("Login")').click();
  
  // Wait for dashboard to load
  await page.waitForURL('**/dashboard');
  
  // Assert logged in
  expect(page).toHaveURL(/dashboard/);
});

// ===== 8. EXAMPLE 2: RECORDING FORM SUBMISSION =====
test('8.1 - Generated form submission example', async ({ page }) => {
  await page.goto('https://example.com/contact');
  
  // Fill form fields
  await page.locator('#name').fill('John Doe');
  
  await page.locator('#email').fill('john@example.com');
  
  // Select dropdown
  await page.locator('select#country').selectOption('US');
  
  // Check checkbox
  await page.locator('#subscribe').check();
  
  // Fill textarea
  await page.locator('#message').fill('This is a test message');
  
  // Click submit
  await page.locator('button[type="submit"]').click();
  
  // Assert success
  expect(page.locator('.success-message')).toBeVisible();
});

// ===== 9. EXAMPLE 3: RECORDING NAVIGATION & CLICKS =====
test('9.1 - Generated navigation example', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Click navigation link
  await page.locator('nav >> text=Products').click();
  
  // Wait for navigation
  await page.waitForURL('**/products');
  
  // Click product card
  await page.locator('.product-card').first().click();
  
  // Click add to cart
  await page.locator('button:has-text("Add to Cart")').click();
  
  // Verify cart updated
  expect(page.locator('[data-testid="cart-count"]')).toContainText('1');
});

// ===== 10. EXAMPLE 4: RECORDING TABLE INTERACTIONS =====
test('10.1 - Generated table interaction example', async ({ page }) => {
  await page.goto('https://example.com/data-table');
  
  // Click table row
  await page.locator('tbody >> tr').first().click();
  
  // Click edit button in row
  await page.locator('tbody >> tr').first().locator('button:has-text("Edit")').click();
  
  // Update field
  await page.locator('#name').fill('Updated Name');
  
  // Click save
  await page.locator('button:has-text("Save")').click();
  
  // Verify update
  expect(page.locator('tbody >> tr >> text=Updated Name')).toBeVisible();
});

// ===== 11. EXAMPLE 5: RECORDING MODAL/POPUP INTERACTIONS =====
test('11.1 - Generated modal interaction example', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Click to open modal
  await page.locator('button:has-text("Open Modal")').click();
  
  // Wait for modal to appear
  await page.locator('[role="dialog"]').waitFor({ state: 'visible' });
  
  // Fill modal form
  await page.locator('[role="dialog"] input#field1').fill('value1');
  
  // Click modal button
  await page.locator('[role="dialog"] button:has-text("Confirm")').click();
  
  // Verify modal closed
  expect(page.locator('[role="dialog"]')).not.toBeVisible();
});

// ===== 12. EXAMPLE 6: RECORDING DROPDOWN SELECTION =====
test('12.1 - Generated dropdown example', async ({ page }) => {
  await page.goto('https://example.com/form');
  
  // Select from dropdown by value
  await page.locator('select#language').selectOption('en');
  
  // Or by label
  await page.locator('select#country').selectOption({ label: 'United States' });
  
  // Verify selection
  const selectedValue = await page.locator('select#language').inputValue();
  expect(selectedValue).toBe('en');
});

// ===== 13. EXAMPLE 7: RECORDING CHECKBOX & RADIO BUTTONS =====
test('13.1 - Generated checkbox and radio example', async ({ page }) => {
  await page.goto('https://example.com/form');
  
  // Check checkbox
  await page.locator('#agree').check();
  
  // Uncheck checkbox
  await page.locator('#newsletter').uncheck();
  
  // Select radio button
  await page.locator('input[name="gender"][value="male"]').check();
  
  // Verify states
  expect(page.locator('#agree')).toBeChecked();
  expect(page.locator('#newsletter')).not.toBeChecked();
  expect(page.locator('input[name="gender"][value="male"]')).toBeChecked();
});

// ===== 14. EXAMPLE 8: RECORDING KEYBOARD INTERACTIONS =====
test('14.1 - Generated keyboard interaction example', async ({ page }) => {
  await page.goto('https://example.com/search');
  
  // Click and type
  await page.locator('input#search').click();
  await page.locator('input#search').type('playwright');
  
  // Press Enter
  await page.keyboard.press('Enter');
  
  // Wait for results
  await page.waitForURL('**/search?q=playwright');
  
  // Verify results displayed
  expect(page.locator('.search-result')).toHaveCount(10);
});

// ===== 15. EXAMPLE 9: RECORDING HOVER & TOOLTIP =====
test('15.1 - Generated hover interaction example', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Hover over element
  await page.locator('.product-image').first().hover();
  
  // Wait for tooltip
  await page.locator('[role="tooltip"]').waitFor({ state: 'visible' });
  
  // Verify tooltip content
  expect(page.locator('[role="tooltip"]')).toContainText('Quick View');
});

// ===== 16. EXAMPLE 10: RECORDING DYNAMIC CONTENT =====
test('16.1 - Generated dynamic content example', async ({ page }) => {
  await page.goto('https://example.com/infinite-scroll');
  
  // Scroll down
  await page.locator('.content').scrollIntoViewIfNeeded();
  
  // Wait for new items to load
  await page.waitForLoadState('networkidle');
  
  // Verify new items loaded
  const itemCount = await page.locator('.item').count();
  expect(itemCount).toBeGreaterThan(10);
});

// ===== 17. CODEGEN OUTPUT CLEANUP =====
/*
Codegen generates working code but sometimes needs cleanup:

BEFORE (Generated code):
  await page.locator('text=Click Me').click();

AFTER (Optimized):
  await page.locator('button:has-text("Click Me")').click();

COMMON IMPROVEMENTS:
1. Replace generic text selectors with more specific ones
2. Use data-testid for more reliable selectors
3. Add explicit waits for dynamic content
4. Extract common actions into helper functions
5. Add meaningful comments
*/

// ===== 18. BEST PRACTICES WITH CODEGEN =====
/*
1. START WITH SELECTORS:
   - Use data-testid attributes (most reliable)
   - Use role selectors (accessible)
   - Avoid text-based selectors when possible

2. ORGANIZE GENERATED CODE:
   - Group related actions
   - Add comments for clarity
   - Extract helper functions

3. ENHANCE WITH ASSERTIONS:
   - Codegen records interactions
   - YOU add assertions for verification
   - Makes tests more meaningful

4. USE IN DEVELOPMENT:
   - Quick prototyping
   - Learning Playwright syntax
   - Creating initial test structure

5. COMBINE WITH MANUAL CODING:
   - Use codegen to jumpstart tests
   - Enhance with explicit waits
   - Add error handling
   - Improve selector reliability

6. VERSION CONTROL:
   - Keep generated code clean
   - Document changes made after generation
   - Review before committing
*/

// ===== 19. ADVANCED CODEGEN USAGE =====
/*
RECORD TO FILE:
  npx playwright codegen https://example.com --output=test.spec.ts

RECORD IN DEBUG MODE:
  npx playwright codegen --debug https://example.com
  (Opens with DevTools)

WITH HAR RECORDING:
  npx playwright codegen --save-har=network.har https://example.com
  (Records all network requests)

WITH TRACE:
  npx playwright codegen --trace=on https://example.com
  (Records browser trace for debugging)

HEADLESS FALSE (Show browser):
  npx playwright codegen https://example.com
  (Default behavior - shows browser)
*/

// ===== 20. CODEGEN VS MANUAL CODING COMPARISON =====
/*
GENERATED CODE:
✓ Fast initial test creation
✓ Good for learning syntax
✓ Captures exact user flow
✗ May use fragile selectors
✗ Lacks assertions
✗ No error handling

MANUALLY WRITTEN CODE:
✓ More reliable selectors
✓ Better error handling
✓ Includes meaningful assertions
✓ Easier to maintain
✗ Takes more time to write
✗ Requires Playwright knowledge

HYBRID APPROACH (RECOMMENDED):
1. Use codegen to record the flow
2. Add meaningful assertions
3. Improve selectors (use data-testid)
4. Add explicit waits for reliability
5. Extract helper functions
6. Add comments for clarity
*/

// ===== 21. PRACTICAL WORKFLOW EXAMPLE =====
test('21.1 - Complete E2E test built with codegen', async ({ page }) => {
  // 1. Navigate
  await page.goto('https://example.com');
  
  // 2. User registration flow (generated with codegen)
  await page.locator('button:has-text("Sign Up")').click();
  
  // 3. Enhanced with assertions (added manually)
  expect(page.locator('[data-testid="signup-form"]')).toBeVisible();
  
  // 4. Fill form (from codegen)
  await page.locator('input[data-testid="email"]').fill('user@example.com');
  await page.locator('input[data-testid="password"]').fill('SecurePass123!');
  await page.locator('input[data-testid="confirm-password"]').fill('SecurePass123!');
  
  // 5. Accept terms (from codegen, enhanced with assertion)
  await page.locator('#terms').check();
  expect(page.locator('#terms')).toBeChecked();
  
  // 6. Submit (from codegen)
  await page.locator('button[type="submit"]').click();
  
  // 7. Verification (added manually)
  await page.waitForURL('**/dashboard');
  expect(page.locator('[data-testid="welcome-message"]')).toContainText('Welcome');
  expect(page.locator('[data-testid="user-email"]')).toHaveText('user@example.com');
});

// ===== 22. TIPS FOR BETTER CODEGEN OUTPUT =====
/*
1. PREPARE THE WEBSITE:
   - Clear any pre-filled data
   - Login if needed
   - Navigate to starting URL

2. PERFORM ACTIONS SLOWLY:
   - Give codegen time to record each action
   - Wait for page loads between actions
   - Verify codegen captured correctly

3. USE DEVELOPMENT TOOLS:
   - Inspect elements to understand selectors
   - Use data-testid for stable selectors
   - Check network tab for timing issues

4. CLEAN UP AFTERWARDS:
   - Remove unnecessary waits
   - Consolidate similar actions
   - Add meaningful comments

5. TEST THE GENERATED CODE:
   - Run tests immediately
   - Verify they pass consistently
   - Fix any flakiness

6. COMMIT WITH IMPROVEMENTS:
   - Don't commit raw codegen output
   - Add assertions and error handling
   - Document any changes made
*/

// ===== QUICK REFERENCE =====
/*
MOST USEFUL CODEGEN COMMANDS:
  npx playwright codegen https://example.com
  npx playwright codegen --device="iPhone 12" https://example.com
  npx playwright codegen --browser=firefox https://example.com
  npx playwright codegen --output=test.spec.ts https://example.com
  npx playwright codegen --slow-mo=1000 https://example.com
  npx playwright codegen --load-storage=auth.json https://example.com

COMMON GENERATED PATTERNS:
  await page.goto('url');
  await page.locator('selector').click();
  await page.locator('selector').fill('text');
  await page.locator('selector').selectOption('value');
  await page.locator('selector').check();
  await page.waitForURL('pattern');
  expect(page.locator('selector')).toBeVisible();
*/
