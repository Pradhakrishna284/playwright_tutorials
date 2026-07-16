/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║           IFRAME HANDLING IN PLAYWRIGHT - COMPREHENSIVE NOTES        ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 * 
 * An iframe (inline frame) is an HTML element that embeds another HTML page
 * within a page. Playwright provides special methods to interact with elements
 * inside iframes since they exist in a separate document context.
 */

import { test, expect } from '@playwright/test';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 1. BASIC IFRAME HANDLING WITH frameLocator()
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * frameLocator() is the recommended way to work with iframes.
 * Returns a FrameLocator object that automatically handles frame context.
 * 
 * Key Benefits:
 * - Auto-waits for iframe to load
 * - No manual context switching needed
 * - Works with cross-origin iframes
 * - Type-safe locator chaining
 */

test('Basic iframe interaction - ID selector', async ({ page }) => {
  // Navigate to page with iframe
  await page.goto('https://example.com/page-with-iframe');
  
  // Method 1: Locate iframe by ID
  const frame = page.frameLocator('iframe#myframe');
  
  // Interact with elements inside the iframe
  await frame.locator('#username').fill('testuser');
  await frame.locator('#password').fill('password123');
  await frame.getByRole('button', { name: 'Login' }).click();
  
  // Verify content inside iframe
  await expect(frame.locator('.success-message')).toBeVisible();
});

test('Basic iframe interaction - name attribute', async ({ page }) => {
  await page.goto('https://example.com/payment-page');
  
  // Locate iframe by name attribute
  const paymentFrame = page.frameLocator('iframe[name="payment"]');
  
  // Fill payment form inside iframe
  await paymentFrame.locator('#card-number').fill('4242424242424242');
  await paymentFrame.locator('#expiry').fill('12/25');
  await paymentFrame.locator('#cvv').fill('123');
  
  await expect(paymentFrame.locator('#payment-status')).toContainText('Success');
});

test('Basic iframe interaction - CSS selectors', async ({ page }) => {
  await page.goto('https://example.com/embedded-content');
  
  // Using various CSS selectors to locate iframe
  const frame1 = page.frameLocator('iframe.content-frame');
  const frame2 = page.frameLocator('iframe[data-testid="embedded-form"]');
  const frame3 = page.frameLocator('iframe[src*="cdn"]');
  
  await frame1.locator('button').click();
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 2. NESTED IFRAMES (IFRAME WITHIN IFRAME)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Chain frameLocator() calls to handle nested iframes.
 * Each level of nesting adds a frameLocator() call.
 */

test('Nested iframes - two levels deep', async ({ page }) => {
  await page.goto('https://example.com/nested-iframes');
  
  // Access outer iframe
  const outerFrame = page.frameLocator('iframe#outer-frame');
  
  // Access inner iframe nested within outer
  const innerFrame = outerFrame.frameLocator('iframe#inner-frame');
  
  // Interact with elements in innermost frame
  await innerFrame.locator('#nested-button').click();
  await expect(innerFrame.locator('#result')).toBeVisible();
});

test('Deeply nested iframes - three levels', async ({ page }) => {
  await page.goto('https://example.com/triple-nested');
  
  // Level 1: Outer iframe
  const level1 = page.frameLocator('iframe#level-1');
  
  // Level 2: Iframe inside level 1
  const level2 = level1.frameLocator('iframe#level-2');
  
  // Level 3: Iframe inside level 2
  const level3 = level2.frameLocator('iframe#level-3');
  
  // Interact with deeply nested content
  await level3.locator('input').fill('deep value');
  await level3.getByRole('button').click();
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 3. MULTIPLE IFRAMES ON SAME PAGE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * When a page contains multiple iframes, target them specifically using
 * CSS selectors, nth-child, or other distinguishing attributes.
 */

test('Multiple iframes - access specific frames', async ({ page }) => {
  await page.goto('https://example.com/multi-iframe-page');
  
  // Access first iframe by index
  const frame1 = page.frameLocator('iframe').first();
  
  // Access specific iframe by selector
  const videoFrame = page.frameLocator('iframe[title="Video Player"]');
  const chatFrame = page.frameLocator('iframe[title="Live Chat"]');
  
  // Interact with different iframes independently
  await videoFrame.locator('.play-button').click();
  await chatFrame.locator('#message-input').fill('Hello!');
  await chatFrame.getByRole('button', { name: 'Send' }).click();
});

test('Multiple iframes - nth-child selector', async ({ page }) => {
  await page.goto('https://example.com/dashboard');
  
  // Select iframe by position (CSS :nth-child)
  const firstIframe = page.frameLocator('iframe:nth-child(1)');
  const secondIframe = page.frameLocator('iframe:nth-child(2)');
  const thirdIframe = page.frameLocator('iframe:nth-child(3)');
  
  // Update each iframe section
  await firstIframe.locator('input').fill('value1');
  await secondIframe.locator('input').fill('value2');
  await thirdIframe.locator('input').fill('value3');
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 4. IFRAME WITH DIFFERENT LOCATOR STRATEGIES
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * frameLocator() works with all Playwright locator strategies:
 * - getByRole() - semantic element selection
 * - getByLabel() - form labels
 * - getByPlaceholder() - input placeholders
 * - getByText() - text content
 * - getByTestId() - data-testid attributes
 * - locator() - CSS/XPath selectors
 */

test('Iframe with getByRole()', async ({ page }) => {
  await page.goto('https://example.com/form-iframe');
  
  const formFrame = page.frameLocator('iframe#form');
  
  // Use semantic selectors within iframe
  await formFrame.getByLabel('Email').fill('test@example.com');
  await formFrame.getByLabel('Password').fill('securepass');
  await formFrame.getByRole('button', { name: 'Submit' }).click();
  
  await expect(formFrame.getByRole('status')).toContainText('Form submitted');
});

test('Iframe with getByPlaceholder()', async ({ page }) => {
  await page.goto('https://example.com/search-iframe');
  
  const searchFrame = page.frameLocator('iframe[name="search"]');
  
  // Use placeholder text to find input
  await searchFrame.getByPlaceholder('Search products...').fill('laptop');
  await searchFrame.getByRole('button', { name: /search/i }).click();
  
  await expect(searchFrame.locator('.results')).toBeVisible();
});

test('Iframe with getByTestId()', async ({ page }) => {
  await page.goto('https://example.com/dashboard');
  
  const widgetFrame = page.frameLocator('iframe[data-testid="widget-1"]');
  
  // Use data-testid for precise targeting
  await widgetFrame.getByTestId('refresh-button').click();
  await expect(widgetFrame.getByTestId('loading-spinner')).toBeVisible();
  await expect(widgetFrame.getByTestId('loading-spinner')).not.toBeVisible();
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 5. CROSS-ORIGIN IFRAMES
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * frameLocator() works with cross-origin iframes (different domain).
 * Playwright can interact with them as long as the page has access.
 * 
 * Note: Some cross-origin iframes may have restrictions depending on
 * CORS policies and iframe sandbox attributes.
 */

test('Cross-origin iframe interaction', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Access iframe from different origin
  const externalFrame = page.frameLocator('iframe[src="https://other-domain.com/widget"]');
  
  // Interact with cross-origin iframe content
  await externalFrame.locator('#external-button').click();
  await expect(externalFrame.locator('.result')).toBeVisible();
});

test('Iframe with sandbox attribute', async ({ page }) => {
  await page.goto('https://example.com/sandbox-iframe');
  
  // Even sandboxed iframes can be interacted with
  const sandboxFrame = page.frameLocator('iframe[sandbox]');
  
  // Note: Some actions might be restricted depending on sandbox permissions
  await sandboxFrame.locator('input').fill('test value');
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 6. WAITING FOR IFRAME TO LOAD
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * frameLocator() automatically waits for:
 * - The iframe element to be in the DOM
 * - The iframe content to be loaded
 * 
 * For additional waiting, use waitFor() on the locator.
 */

test('Wait for iframe to load', async ({ page }) => {
  await page.goto('https://example.com/lazy-iframe');
  
  // frameLocator waits for iframe to be ready
  const frame = page.frameLocator('iframe#lazy-loaded');
  
  // Wait for specific element to appear in iframe
  await frame.locator('#content').waitFor({ state: 'visible' });
  
  // Now interact with it
  await frame.locator('#button').click();
});

test('Wait for iframe to load with timeout', async ({ page }) => {
  await page.goto('https://example.com/slow-iframe');
  
  const frame = page.frameLocator('iframe#slow');
  
  // Custom timeout for waiting
  await expect(frame.locator('.loaded-content')).toBeVisible({ timeout: 10000 });
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 7. GETTING IFRAME CONTENT & ATTRIBUTES
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Extract information from iframes without just interacting with elements.
 */

test('Get text content from iframe', async ({ page }) => {
  await page.goto('https://example.com/content-iframe');
  
  const frame = page.frameLocator('iframe#content');
  
  // Get text content
  const heading = await frame.locator('h1').textContent();
  expect(heading).toContain('Welcome');
  
  // Get all text within element
  const paragraphText = await frame.locator('p').innerText();
  console.log(paragraphText);
  
  // Get attribute value
  const linkHref = await frame.locator('a').getAttribute('href');
  expect(linkHref).toBeTruthy();
});

test('Get multiple elements from iframe', async ({ page }) => {
  await page.goto('https://example.com/list-iframe');
  
  const frame = page.frameLocator('iframe#list');
  
  // Get count of elements
  const itemCount = await frame.locator('li').count();
  expect(itemCount).toBeGreaterThan(0);
  
  // Get text from all matching elements
  const items = await frame.locator('li').allTextContents();
  console.log(items);
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 8. COMMON IFRAME USE CASES & PATTERNS
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Pattern 1: Payment Gateway (Stripe, PayPal, etc.)
test('Payment iframe - Stripe', async ({ page }) => {
  await page.goto('https://shop.example.com/checkout');
  
  const paymentFrame = page.frameLocator('iframe[title="Stripe"]');
  
  // Fill payment details in Stripe iframe
  await paymentFrame.locator('[placeholder="Card number"]').fill('4242424242424242');
  await paymentFrame.locator('[placeholder="MM / YY"]').fill('12 / 25');
  await paymentFrame.locator('[placeholder="CVC"]').fill('123');
  
  await page.click('button[type="submit"]');
  await expect(page.locator('.order-confirmation')).toBeVisible();
});

// Pattern 2: Embedded Map
test('Embedded map iframe - Google Maps', async ({ page }) => {
  await page.goto('https://business.example.com/location');
  
  const mapFrame = page.frameLocator('iframe[title="Google Maps"]');
  
  // Maps don't typically have clickable elements in iframe context
  // But we can verify the iframe exists and is visible
  await expect(mapFrame.locator('text=Map data')).toBeVisible();
});

// Pattern 3: Live Chat Widget
test('Live chat iframe', async ({ page }) => {
  await page.goto('https://support.example.com');
  
  const chatFrame = page.frameLocator('iframe[title="Chat Widget"]');
  
  // Type message in chat
  await chatFrame.locator('.message-input').fill('Hello, need help');
  await chatFrame.getByRole('button', { name: 'Send' }).click();
  
  // Wait for response
  await expect(chatFrame.locator('.agent-message')).toBeVisible({ timeout: 5000 });
});

// Pattern 4: Video Player (YouTube, Vimeo, etc.)
test('Video player iframe', async ({ page }) => {
  await page.goto('https://tutorial.example.com');
  
  const videoFrame = page.frameLocator('iframe[title*="video" i]');
  
  // Some video players have play buttons outside the frame
  // Or require interacting with the page's video controls
  // Direct iframe interaction may be limited due to cross-origin policies
});

// Pattern 5: RTE (Rich Text Editor) - CKEditor, TinyMCE
test('Rich text editor in iframe', async ({ page }) => {
  await page.goto('https://editor.example.com');
  
  // Many RTEs put the editable content in an iframe
  const editorFrame = page.frameLocator('iframe.cke_wysiwyg_frame');
  
  // Get the body or editor content area
  const editorBody = editorFrame.locator('body');
  
  // Click and type in editor
  await editorBody.click();
  await page.keyboard.type('This is my article content');
  
  // Or use contenteditable div if available
  await editorFrame.locator('[contenteditable="true"]').fill('Edited content');
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 9. DEPRECATED APPROACH (AVOID)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Old frameLocator approach - NOT RECOMMENDED:
 * Uses page.frame() which requires waiting and context switching.
 */

test.skip('Old approach - DO NOT USE', async ({ page }) => {
  // OLD WAY (deprecated - avoid this):
  // const frame = await page.frame({ name: 'myframe' });
  // await frame?.click('#button');
  
  // This has issues:
  // - No auto-waiting for iframe
  // - Manual context switching needed
  // - Returns null if frame not found, causing errors
  // - Less type-safe
  
  // ALWAYS USE frameLocator() INSTEAD:
  const frame = page.frameLocator('iframe[name="myframe"]');
  await frame.locator('#button').click();
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 10. TROUBLESHOOTING IFRAME ISSUES
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Common Issues & Solutions:
 * 
 * Issue 1: "Cannot find frame" error
 * - Solution: Verify iframe selector with page inspection
 * - Solution: Check if iframe is loaded (use waitFor)
 * - Solution: Ensure iframe is visible on page
 * 
 * Issue 2: Cross-origin iframe access blocked
 * - Solution: Some cross-origin content is inaccessible due to CORS
 * - Solution: Check iframe sandbox attributes
 * - Solution: Verify domain trust settings
 * 
 * Issue 3: Elements inside iframe not found
 * - Solution: Make sure you're using frameLocator() first
 * - Solution: Check for nested iframes (might need multiple frameLocator calls)
 * - Solution: Verify element is visible/not hidden
 * 
 * Issue 4: Slow iframe loading
 * - Solution: Increase timeout in waitFor() or expect()
 * - Solution: Wait for iframe document to be ready
 * - Solution: Check network conditions
 * 
 * Issue 5: Dynamic iframe content
 * - Solution: Wait for content to appear after interaction
 * - Solution: Use waitFor() with explicit state checks
 */

test('Debugging iframe selector', async ({ page }) => {
  // Step 1: Verify the iframe exists with page inspector
  // await page.pause(); // Open browser inspector to find iframe selector
  
  // Step 2: Test multiple selector approaches
  const by_id = page.frameLocator('iframe#content');
  const by_name = page.frameLocator('iframe[name="content"]');
  const by_src = page.frameLocator('iframe[src*="content"]');
  
  // Step 3: Debug with expect and logging
  // console.log(await by_id.locator('body').textContent());
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * QUICK REFERENCE CHEAT SHEET
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Basic Usage:
 *   const frame = page.frameLocator('iframe#id');
 *   await frame.locator('#element').click();
 * 
 * Nested Iframes:
 *   const inner = page.frameLocator('iframe1').frameLocator('iframe2');
 *   await inner.locator('#button').click();
 * 
 * Multiple Iframes:
 *   const frame1 = page.frameLocator('iframe').first();
 *   const frame2 = page.frameLocator('iframe').nth(1);
 * 
 * Selectors:
 *   page.frameLocator('iframe#id')
 *   page.frameLocator('iframe[name="name"]')
 *   page.frameLocator('iframe[src*="keyword"]')
 *   page.frameLocator('iframe[title="title"]')
 *   page.frameLocator('iframe[data-testid="id"]')
 * 
 * Locator Methods (within frame):
 *   frame.locator('selector')
 *   frame.getByRole('button')
 *   frame.getByLabel('Label')
 *   frame.getByPlaceholder('Placeholder')
 *   frame.getByText('Text')
 *   frame.getByTestId('id')
 * 
 * Waiting:
 *   frame.locator('#element').waitFor({ state: 'visible' })
 *   await expect(frame.locator('#element')).toBeVisible()
 * 
 * Getting Info:
 *   await frame.locator('#element').textContent()
 *   await frame.locator('#element').getAttribute('attr')
 *   await frame.locator('li').count()
 *   await frame.locator('li').allTextContents()
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * INTERVIEW QUESTIONS ON IFRAMES
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Q1: What is an iframe and why do we need special handling in Playwright?
 * 
 * Answer:
 * - An iframe (inline frame) is an HTML element that embeds another HTML
 *   page within a page using <iframe> tags
 * - Iframes have a separate document context and isolated DOM
 * - Elements inside an iframe are not directly accessible from the parent page
 * - Playwright's frameLocator() provides a way to switch context and
 *   interact with iframe content
 * 
 * Code Example:
 */
test.skip('Q1: Iframe definition and handling', async ({ page }) => {
  // HTML structure with iframe:
  // <html>
  //   <body>
  //     <iframe id="payment" src="https://payment-provider.com"></iframe>
  //   </body>
  // </html>
  
  // You cannot do: await page.locator('#card-number').fill('4242...')
  // Because #card-number is inside the iframe, not in parent document
  
  // You must use frameLocator first:
  const frame = page.frameLocator('iframe#payment');
  await frame.locator('#card-number').fill('4242424242424242');
});

/**
 * Q2: What is the difference between frameLocator() and page.frame()?
 * 
 * Answer:
 * frameLocator() (RECOMMENDED):
 * - Returns a FrameLocator object
 * - Auto-waits for iframe to load
 * - Type-safe and chainable
 * - Works with cross-origin iframes
 * - No manual context switching needed
 * - Modern approach
 * 
 * page.frame() (DEPRECATED):
 * - Returns a Frame object or null
 * - No auto-waiting for iframe load
 * - Requires manual error handling (can return null)
 * - Context switching behavior
 * - Older approach
 * 
 * Code Comparison:
 */
test.skip('Q2: frameLocator vs page.frame', async ({ page }) => {
  // RECOMMENDED WAY:
  const frame = page.frameLocator('iframe#myframe');
  await frame.locator('#button').click(); // Auto-waits, safe
  
  // OLD WAY (AVOID):
  // const frame = await page.frame({ name: 'myframe' });
  // if (frame) {
  //   await frame.click('#button'); // No auto-wait, needs null check
  // }
});

/**
 * Q3: How do you handle nested iframes?
 * 
 * Answer:
 * - Chain frameLocator() calls for each level of nesting
 * - Each frameLocator() call represents one level of iframe nesting
 * - Example: page.frameLocator('iframe1').frameLocator('iframe2')
 * - No limit to nesting depth (but more levels = slower)
 * 
 * Code Example:
 */
test.skip('Q3: Nested iframes handling', async ({ page }) => {
  // Three-level nested iframes
  const level1 = page.frameLocator('iframe#outer');
  const level2 = level1.frameLocator('iframe#middle');
  const level3 = level2.frameLocator('iframe#inner');
  
  // Interact with deeply nested element
  await level3.locator('#deeply-nested-button').click();
});

/**
 * Q4: What selectors can you use with frameLocator()?
 * 
 * Answer:
 * - CSS selectors: 'iframe#id', 'iframe.class', 'iframe[attr="value"]'
 * - ID selectors: 'iframe#myframe'
 * - Name attribute: 'iframe[name="payment"]'
 * - Source attribute: 'iframe[src*="cdn"]'
 * - Title attribute: 'iframe[title="Video Player"]'
 * - Data attributes: 'iframe[data-testid="widget"]'
 * - Pseudo-selectors: 'iframe:first-child', 'iframe:nth-child(2)'
 * - Text selectors: 'iframe' (then chain with locator methods)
 * 
 * Code Examples:
 */
test.skip('Q4: Iframe selectors', async ({ page }) => {
  // By ID
  const frame1 = page.frameLocator('iframe#myframe');
  
  // By name
  const frame2 = page.frameLocator('iframe[name="payment"]');
  
  // By src attribute
  const frame3 = page.frameLocator('iframe[src*="stripe"]');
  
  // By title
  const frame4 = page.frameLocator('iframe[title="Chat Widget"]');
  
  // By data-testid
  const frame5 = page.frameLocator('iframe[data-testid="embedded-form"]');
  
  // By position
  const frame6 = page.frameLocator('iframe:nth-child(2)');
  
  // Multiple iframes, get first and second
  const firstIframe = page.frameLocator('iframe').first();
  const secondIframe = page.frameLocator('iframe').nth(1);
});

/**
 * Q5: How does frameLocator() auto-waiting work?
 * 
 * Answer:
 * - frameLocator() automatically waits for the iframe element to be in DOM
 * - Waits for the iframe's document to be loaded and ready
 * - Uses default timeout (30 seconds by default)
 * - Doesn't require manual waitFor() calls in most cases
 * - Locators inside frame also auto-wait for elements
 * 
 * Code Example:
 */
test.skip('Q5: Auto-waiting in frameLocator', async ({ page }) => {
  // This automatically waits for iframe to be ready
  const frame = page.frameLocator('iframe#slow-loading');
  
  // This automatically waits for element inside iframe
  await frame.locator('#button').click();
  
  // If you need explicit waiting with custom timeout:
  await frame.locator('#content').waitFor({ state: 'visible', timeout: 10000 });
  
  // Or use expect with timeout
  await expect(frame.locator('#content')).toBeVisible({ timeout: 15000 });
});

/**
 * Q6: Can you interact with cross-origin iframes?
 * 
 * Answer:
 * - Yes, frameLocator() works with cross-origin iframes
 * - Cross-origin = iframe loads from different domain/origin
 * - Some cross-origin content may be restricted by:
 *   - CORS policies
 *   - Iframe sandbox attributes
 *   - Content Security Policy (CSP)
 * - Playwright can still interact with accessible cross-origin iframes
 * 
 * Code Example:
 */
test.skip('Q6: Cross-origin iframe interaction', async ({ page }) => {
  // Page from example.com
  await page.goto('https://example.com');
  
  // Iframe from different domain (cross-origin)
  const externalFrame = page.frameLocator('iframe[src="https://payment-provider.com"]');
  
  // Can still interact with it (if not restricted)
  await externalFrame.locator('#card-number').fill('4242424242424242');
});

/**
 * Q7: What are common use cases for iframes in web applications?
 * 
 * Answer:
 * 1. Payment Gateways
 *    - Stripe, PayPal, Square for secure payment processing
 *    - Sandboxes payment data from main application
 * 
 * 2. Third-party Widgets
 *    - Live chat (Intercom, Drift, Zendesk)
 *    - Feedback widgets (Hotjar, UserTesting)
 *    - Analytics dashboards (Google Analytics, Datadog)
 * 
 * 3. Embedded Content
 *    - YouTube, Vimeo videos
 *    - Google Maps
 *    - Twitter/X timelines
 *    - Spotify, SoundCloud players
 * 
 * 4. Rich Text Editors
 *    - CKEditor, TinyMCE, Quill
 *    - Editor content runs in isolated iframe
 * 
 * 5. Security Sandboxes
 *    - Isolate untrusted content
 *    - Run ads safely
 *    - Embed user-generated content
 * 
 * Code Examples:
 */
test.skip('Q7: Common iframe use cases', async ({ page }) => {
  // 1. Payment iframe
  const paymentFrame = page.frameLocator('iframe[title="Stripe"]');
  await paymentFrame.locator('[placeholder="Card number"]').fill('4242...');
  
  // 2. Live chat widget
  const chatFrame = page.frameLocator('iframe[title="Chat Widget"]');
  await chatFrame.locator('.message-input').fill('Hello!');
  
  // 3. Video player
  const videoFrame = page.frameLocator('iframe[src*="youtube"]');
  // Note: YouTube iframe play button may not be clickable due to restrictions
  
  // 4. Text editor
  const editorFrame = page.frameLocator('iframe.cke_wysiwyg_frame');
  await editorFrame.locator('body').click();
  await page.keyboard.type('My content');
  
  // 5. Embedded map
  const mapFrame = page.frameLocator('iframe[title*="map" i]');
  // Map iframes are often restricted from automation
});

/**
 * Q8: What should you do if you cannot find an element in an iframe?
 * 
 * Answer - Troubleshooting Steps:
 * 1. Verify the iframe selector is correct using browser DevTools
 * 2. Check if iframe is actually loaded and visible
 * 3. Confirm element exists inside the frame (not in parent page)
 * 4. Check for nested iframes (might need multiple frameLocator calls)
 * 5. Verify cross-origin restrictions aren't blocking access
 * 6. Look for dynamic content - wait for element to appear
 * 7. Check iframe's id, name, src, or data-testid for targeting
 * 8. Enable trace/debug mode to see what's happening
 * 
 * Code Example:
 */
test.skip('Q8: Debugging missing iframe elements', async ({ page }) => {
  // Step 1: Verify iframe exists
  const frameLocator = page.frameLocator('iframe#myframe');
  
  // Step 2: Check if iframe is visible
  await expect(frameLocator.locator('body')).toBeVisible();
  
  // Step 3: Log content to debug
  const content = await frameLocator.locator('body').textContent();
  console.log('Iframe content:', content);
  
  // Step 4: Wait for dynamic content
  await frameLocator.locator('#dynamic-element').waitFor({ state: 'visible' });
  
  // Step 5: Try different selectors
  const byId = frameLocator.locator('#element-id');
  const byClass = frameLocator.locator('.element-class');
  const byText = frameLocator.getByText('Element text');
  
  // Step 6: Check element count
  const elementCount = await frameLocator.locator('button').count();
  console.log('Button count:', elementCount);
});

/**
 * Q9: How do you extract data/content from an iframe?
 * 
 * Answer:
 * - Use locator methods to get text, attributes, or inner content
 * - textContent() - gets all text with whitespace preserved
 * - innerText() - gets visible text only
 * - getAttribute() - gets specific attribute value
 * - count() - gets number of matching elements
 * - allTextContents() - gets array of all matching elements' text
 * 
 * Code Example:
 */
test.skip('Q9: Extracting data from iframe', async ({ page }) => {
  const frame = page.frameLocator('iframe#data');
  
  // Get single element text
  const heading = await frame.locator('h1').textContent();
  console.log('Heading:', heading);
  
  // Get visible text only
  const visibleText = await frame.locator('p').innerText();
  console.log('Paragraph:', visibleText);
  
  // Get element attribute
  const linkUrl = await frame.locator('a').getAttribute('href');
  console.log('Link URL:', linkUrl);
  
  // Get count of elements
  const listItemCount = await frame.locator('li').count();
  console.log('List items:', listItemCount);
  
  // Get all items as array
  const allItems = await frame.locator('li').allTextContents();
  console.log('All items:', allItems);
  
  // Get multiple attributes
  const allLinks = await frame.locator('a').evaluateAll(
    (elements) => elements.map((el) => el.getAttribute('href'))
  );
  console.log('All URLs:', allLinks);
});

/**
 * Q10: What locator strategies work inside an iframe with frameLocator()?
 * 
 * Answer:
 * All Playwright locator strategies work inside frames:
 * 
 * - locator(selector) - CSS or XPath
 * - getByRole(role, options) - semantic role
 * - getByLabel(text) - form labels
 * - getByPlaceholder(text) - input placeholders
 * - getByText(text) - text content
 * - getByTestId(id) - data-testid attributes
 * - getByTitle(title) - title attribute
 * 
 * Code Example:
 */
test.skip('Q10: Locator strategies in frames', async ({ page }) => {
  const frame = page.frameLocator('iframe#form');
  
  // getByRole - semantic selection
  await frame.getByRole('button', { name: 'Submit' }).click();
  
  // getByLabel - form labels
  await frame.getByLabel('Email').fill('test@example.com');
  
  // getByPlaceholder - input placeholders
  await frame.getByPlaceholder('Enter your name').fill('John Doe');
  
  // getByText - text content
  await frame.getByText('Login').click();
  
  // getByTestId - data-testid attributes
  await frame.getByTestId('submit-button').click();
  
  // getByTitle - title attributes
  await frame.getByTitle('Help').hover();
  
  // locator - CSS or XPath
  await frame.locator('#email').fill('test@example.com');
  await frame.locator('xpath=//button[@type="submit"]').click();
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * END OF INTERVIEW QUESTIONS
 * ═══════════════════════════════════════════════════════════════════════════
 */
