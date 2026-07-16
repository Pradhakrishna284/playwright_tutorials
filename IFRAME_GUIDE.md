# iFrame (Inline Frame) - Complete Guide

## Table of Contents
1. [What is an iFrame?](#what-is-an-iframe)
2. [iFrame Basics](#iframe-basics)
3. [Working with iFrames in Playwright](#working-with-iframes-in-playwright)
4. [Accessing Elements Inside iFrames](#accessing-elements-inside-iframes)
5. [Common Challenges](#common-challenges)
6. [Best Practices](#best-practices)
7. [Real-World Examples](#real-world-examples)

---

## What is an iFrame?

An **iFrame (Inline Frame)** is an HTML element that embeds another HTML document within a web page. It creates a separate browsing context, which means:
- It has its own DOM (Document Object Model)
- It has its own JavaScript execution environment
- It's isolated from the parent page
- Styling may not inherit from the parent page

### HTML Syntax
```html
<iframe 
  src="https://example.com" 
  width="800" 
  height="600" 
  frameborder="0" 
  scrolling="auto">
</iframe>
```

### Key Attributes
- **src**: URL of the document to embed
- **width/height**: Dimensions of the frame
- **frameborder**: Border around the frame (0 = no border)
- **scrolling**: Scrollbar behavior (auto, yes, no)
- **name**: Name for targeting the frame
- **sandbox**: Security restrictions (e.g., `sandbox="allow-scripts"`)

---

## iFrame Basics

### Types of iFrames

#### 1. **External iFrames** (with src attribute)
```html
<iframe src="https://example.com/page.html"></iframe>
```
- Loads content from an external URL
- Subject to CORS restrictions

#### 2. **Inline iFrames** (srcdoc attribute)
```html
<iframe srcdoc="<h1>Hello</h1><p>Content here</p>"></iframe>
```
- Content is embedded directly in the HTML
- No CORS issues
- Good for small content snippets

#### 3. **Named iFrames**
```html
<iframe name="myFrame" src="page.html"></iframe>
```
- Can be targeted with the `name` attribute

### Isolation Features

**Security Sandbox:**
```html
<!-- Highly restricted -->
<iframe sandbox src="page.html"></iframe>

<!-- Allow specific permissions -->
<iframe sandbox="allow-scripts allow-forms allow-same-origin" src="page.html"></iframe>
```

---

## Working with iFrames in Playwright

### Accessing iFrame Content

In Playwright, you access iFrames using the `.frameLocator()` method or by getting the frame object.

#### Method 1: Using `frameLocator()`
```javascript
// Get locator inside iframe
const iframeLocator = page.frameLocator('iframe[src="page.html"]');
const buttonInIframe = iframeLocator.locator('button.submit');
await buttonInIframe.click();
```

#### Method 2: Using `frames()` property
```javascript
// Get all frames
const frames = page.frames();
console.log(`Total frames: ${frames.length}`);

// Find specific frame
const myFrame = frames.find(frame => frame.name() === 'myFrame');
```

#### Method 3: Using `frame(selector)` method
```javascript
// Get frame by selector
const frame = await page.frame({ name: 'myFrame' });
const element = await frame.$('.myClass');
```

---

## Accessing Elements Inside iFrames

### Example 1: Click Button in iFrame
```javascript
// Using frameLocator (recommended - simpler syntax)
await page.frameLocator('iframe#myFrame').locator('button').click();

// Using frame object
const frame = page.frameLocator('iframe#myFrame');
await frame.locator('input[type="text"]').fill('Hello World');
```

### Example 2: Nested iFrames
```javascript
// Multiple levels of iFrames
const level1 = page.frameLocator('iframe.outer');
const level2 = level1.frameLocator('iframe.inner');
const button = level2.locator('button');
await button.click();
```

### Example 3: Wait for iFrame to Load
```javascript
// Wait for iframe to be present
await page.waitForSelector('iframe#content');

// Then interact with it
const frame = page.frameLocator('iframe#content');
await frame.locator('p').waitFor({ state: 'visible' });
const text = await frame.locator('p').textContent();
console.log(text);
```

### Example 4: Get Text from iFrame
```javascript
const frame = page.frameLocator('iframe[name="details"]');
const content = await frame.locator('.message').textContent();
console.log('iFrame content:', content);
```

### Example 5: Fill Form in iFrame
```javascript
const frame = page.frameLocator('iframe.payment-form');

// Fill multiple form fields
await frame.locator('input[name="cardNumber"]').fill('1234-5678-9012-3456');
await frame.locator('input[name="expiry"]').fill('12/25');
await frame.locator('input[name="cvv"]').fill('123');
await frame.locator('button[type="submit"]').click();
```

---

## Common Challenges

### Challenge 1: Cross-Origin iFrames
**Problem:** Cannot access iFrames from different domains due to CORS
```javascript
// This will fail if iframe is from different origin
const frame = page.frameLocator('iframe').locator('button');
// Error: Cross-origin frames not allowed
```

**Solution:** 
- Use cross-origin tests separately
- Set up proper CORS headers if testing your own servers
- Test through API if direct access is blocked

### Challenge 2: Dynamic iFrame Loading
**Problem:** iFrame loads after page load
```javascript
// iFrame might not exist yet!
const frame = page.frameLocator('iframe'); // Could be null
```

**Solution:**
```javascript
// Wait for iframe to exist
await page.waitForSelector('iframe.dynamic');

// Then access it
const frame = page.frameLocator('iframe.dynamic');
await frame.locator('button').waitFor({ state: 'visible' });
await frame.locator('button').click();
```

### Challenge 3: Multiple iFrames on Page
**Problem:** Cannot distinguish between multiple iFrames
```javascript
// Which iframe?
const frame = page.frameLocator('iframe');
```

**Solution:**
```javascript
// Use more specific selectors
const formFrame = page.frameLocator('iframe#contact-form');
const videoFrame = page.frameLocator('iframe[src*="youtube"]');

// Or get all frames and find by URL
const frames = page.frames();
const youtubeFrame = frames.find(f => f.url().includes('youtube'));
```

### Challenge 4: Content Not Visible in iFrame
**Problem:** Element exists but is hidden
```javascript
const element = page.frameLocator('iframe').locator('.hidden');
// Element exists but may not be visible
```

**Solution:**
```javascript
// Wait for visibility before interaction
await page.frameLocator('iframe').locator('.content').waitFor({ 
  state: 'visible',
  timeout: 5000 
});

// Check visibility
const isVisible = await page.frameLocator('iframe')
  .locator('.content')
  .isVisible();
```

---

## Best Practices

### 1. **Use Specific Selectors**
```javascript
// ❌ Avoid - Too generic
const frame = page.frameLocator('iframe');

// ✅ Good - Specific selector
const frame = page.frameLocator('iframe[name="details"]');
const frame = page.frameLocator('iframe#content');
const frame = page.frameLocator('iframe[src*="payment"]');
```

### 2. **Wait for iFrame Load**
```javascript
// Always wait for iframe to be ready
await page.waitForSelector('iframe#myFrame', { timeout: 5000 });
const frame = page.frameLocator('iframe#myFrame');
await frame.locator('body').waitFor({ state: 'attached' });
```

### 3. **Handle Nested iFrames Gracefully**
```javascript
// Build chain with proper waits
const level1 = page.frameLocator('iframe.outer');
const level2 = level1.frameLocator('iframe.inner');

// Wait at each level
await page.waitForSelector('iframe.outer');
await level1.locator('iframe.inner').waitFor({ state: 'attached' });

const content = await level2.locator('.content').textContent();
```

### 4. **Check iFrame Existence Before Access**
```javascript
const iframeExists = await page.locator('iframe#myFrame').count() > 0;

if (iframeExists) {
  const frame = page.frameLocator('iframe#myFrame');
  // Interact with frame
} else {
  console.log('iframe not found');
}
```

### 5. **Use Proper Waits**
```javascript
// Poor - May race condition
await page.frameLocator('iframe').locator('button').click();

// Good - Explicit waits
const frame = page.frameLocator('iframe');
await frame.locator('button').waitFor({ state: 'visible' });
await frame.locator('button').click();
```

### 6. **Take Screenshots for Debugging**
```javascript
// If assertion fails, capture iFrame
const frame = page.frameLocator('iframe');
await page.screenshot({ path: 'debug-iframe.png' });

// Or just the iframe area
const iframeElement = await page.locator('iframe');
// Get bounding box to see what's visible
const box = await iframeElement.boundingBox();
console.log('iFrame position:', box);
```

---

## Real-World Examples

### Example 1: Testing Google Maps iFrame
```javascript
test('interact with embedded Google Map', async ({ page }) => {
  await page.goto('https://example.com/map-page');
  
  // Google Maps is often in an iframe
  const mapFrame = page.frameLocator('iframe[src*="google.com/maps"]');
  
  // Wait for map to load
  await mapFrame.locator('[role="button"]').first().waitFor({ 
    state: 'visible' 
  });
  
  // The actual interactions may be limited due to CORS
  // Better approach: test through the parent page API
  const parentMapElement = page.locator('.map-container');
  expect(await parentMapElement.isVisible()).toBe(true);
});
```

### Example 2: Payment Gateway iFrame
```javascript
test('complete payment in iframe', async ({ page }) => {
  await page.goto('https://example.com/checkout');
  
  // Payment gateway often embedded in iframe
  const paymentFrame = page.frameLocator('iframe[name="payment-gateway"]');
  
  // Wait for iframe to load
  await paymentFrame.locator('form').waitFor({ state: 'visible' });
  
  // Fill payment details
  await paymentFrame
    .locator('input[placeholder="Card Number"]')
    .fill('4111111111111111');
  
  await paymentFrame
    .locator('input[placeholder="MM/YY"]')
    .fill('12/25');
  
  await paymentFrame
    .locator('input[placeholder="CVC"]')
    .fill('123');
  
  // Submit payment
  await paymentFrame.locator('button[type="submit"]').click();
  
  // Wait for success message in parent page
  await page.locator('.payment-success').waitFor({ state: 'visible' });
});
```

### Example 3: Editor iFrame (Rich Text Editor)
```javascript
test('type in rich text editor iframe', async ({ page }) => {
  await page.goto('https://example.com/editor');
  
  // Many rich text editors use iframe for content area
  const editorFrame = page.frameLocator('iframe[title="Editor"]');
  
  // Get the editable content area
  const contentArea = editorFrame.locator('body[contenteditable="true"]');
  
  // Click to focus and type
  await contentArea.click();
  await contentArea.type('This is formatted text in an iframe');
  
  // Get the content
  const text = await contentArea.textContent();
  expect(text).toContain('This is formatted text');
});
```

### Example 4: Multiple iFrames - Switch Between Them
```javascript
test('handle multiple iframes on page', async ({ page }) => {
  await page.goto('https://example.com/dashboard');
  
  // Get all frames
  const allFrames = page.frames();
  console.log(`Page has ${allFrames.length} frames`);
  
  // Access specific frames by index or name
  const frame1 = page.frameLocator('iframe[name="widget-1"]');
  const frame2 = page.frameLocator('iframe[name="widget-2"]');
  
  // Verify content in each frame
  const content1 = await frame1.locator('.title').textContent();
  const content2 = await frame2.locator('.title').textContent();
  
  expect(content1).toBeTruthy();
  expect(content2).toBeTruthy();
  
  // Interact with different frames
  await frame1.locator('button').click();
  await frame2.locator('button').click();
});
```

### Example 5: Wait for Dynamic iFrame Content
```javascript
test('wait for dynamically loaded iframe content', async ({ page }) => {
  await page.goto('https://example.com/slow-load');
  
  // Wait for iframe to appear (may load after initial page load)
  await page.waitForSelector('iframe[data-content="dynamic"]', { 
    timeout: 10000 
  });
  
  const dynamicFrame = page.frameLocator('iframe[data-content="dynamic"]');
  
  // Wait for content to load inside iframe
  await dynamicFrame.locator('.content-loader').waitFor({ 
    state: 'hidden',
    timeout: 10000 
  }); // Wait for loading spinner to disappear
  
  // Now access the content
  const content = await dynamicFrame.locator('.data').textContent();
  console.log('Loaded content:', content);
  
  expect(content).toBeTruthy();
});
```

### Example 6: Testing Inline iFrame (srcdoc)
```javascript
test('interact with inline iframe', async ({ page }) => {
  // Navigate to page with inline iframe
  await page.goto('https://example.com/inline-frame');
  
  // Access inline iframe
  const inlineFrame = page.frameLocator('iframe[srcdoc]');
  
  // Content is directly in the HTML, more reliable
  const heading = await inlineFrame.locator('h1').textContent();
  expect(heading).toBe('Inline Content');
  
  // Interact with elements
  await inlineFrame.locator('button').click();
  
  // Verify action result
  const result = await inlineFrame.locator('.result').textContent();
  expect(result).toContain('Success');
});
```

---

## Quick Reference

### Common iFrame Selectors
```javascript
// By ID
page.frameLocator('iframe#myFrame')

// By name attribute
page.frameLocator('iframe[name="content"]')

// By src attribute (exact)
page.frameLocator('iframe[src="page.html"]')

// By src attribute (contains)
page.frameLocator('iframe[src*="youtube"]')

// By class
page.frameLocator('iframe.embed')

// By role
page.frameLocator('iframe[role="region"]')

// First iframe
page.frameLocator('iframe').first()

// Nth iframe
page.frameLocator('iframe').nth(2)
```

### Common iFrame Operations
```javascript
// Get element from iframe
page.frameLocator('iframe').locator('button')

// Nested frames
page.frameLocator('iframe').frameLocator('iframe')

// Type in iframe
await page.frameLocator('iframe').locator('input').fill('text')

// Click in iframe
await page.frameLocator('iframe').locator('button').click()

// Get text from iframe
await page.frameLocator('iframe').locator('p').textContent()

// Wait for element in iframe
await page.frameLocator('iframe').locator('.loader').waitFor({ state: 'hidden' })

// Count elements in iframe
await page.frameLocator('iframe').locator('li').count()
```

---

## Summary

| Aspect | Details |
|--------|---------|
| **Definition** | Embedded HTML document within a web page |
| **Access Method** | `page.frameLocator()` or `page.frames()` |
| **Key Difference** | Separate DOM, JavaScript environment, may have CORS restrictions |
| **Wait Strategy** | Always wait for iframe and content to load |
| **Selector Specificity** | Use ID, name, or src attributes for specific iframes |
| **Nested iFrames** | Use chained `frameLocator()` calls |
| **CORS Issues** | Cannot access cross-origin iframes in browser context |
| **Best Practice** | Use `frameLocator()` for cleaner, more reliable code |

