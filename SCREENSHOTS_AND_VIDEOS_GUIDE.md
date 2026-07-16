# Playwright Screenshots & Video Recording - Complete Guide

## Table of Contents
1. [Overview](#overview)
2. [Screenshots](#screenshots)
3. [Video Recording](#video-recording)
4. [Configuration](#configuration)
5. [Best Practices](#best-practices)
6. [Real-World Examples](#real-world-examples)
7. [Comparison & Storage](#comparison--storage)
8. [Troubleshooting](#troubleshooting)

---

## Overview

Playwright provides two powerful visual debugging tools:
- **Screenshots**: Single-moment visual snapshots
- **Videos**: Complete test execution recordings

Both help with:
- Visual regression testing
- Debugging failures
- Documentation
- UI validation
- Performance analysis

---

## Screenshots

### What Are Screenshots?

Screenshots capture the **current visual state** of a page or browser window. They're saved as PNG files.

### Types of Screenshots

| Type | Use Case | Example |
|------|----------|---------|
| **Full Page** | Entire page content | Long scrolling pages |
| **Viewport** | Visible area only | Above-the-fold content |
| **Element** | Single element | Buttons, cards, forms |
| **Mask** | Highlight regions | Sensitive data areas |

### Basic Screenshot Methods

#### 1. **Page Screenshot**
```typescript
// Full page screenshot
await page.screenshot({ path: 'full-page.png' });

// Viewport-only screenshot (visible area)
await page.screenshot({
  path: 'viewport-only.png',
  fullPage: false,
});

// With custom size
await page.screenshot({
  path: 'custom-size.png',
  fullPage: true,
  scale: 'css',  // 1x scale
});
```

#### 2. **Element Screenshot**
```typescript
// Screenshot of specific element
const button = page.locator('button');
await button.screenshot({ path: 'button.png' });

// Element with padding
await button.screenshot({
  path: 'button-padded.png',
  animations: 'disabled',  // Freeze animations
});
```

#### 3. **Screenshot with Masking**
```typescript
// Mask sensitive areas (hide with black boxes)
await page.screenshot({
  path: 'masked-page.png',
  mask: [
    page.locator('input[name="password"]'),
    page.locator('.social-security-number'),
    page.locator('[data-sensitive]'),
  ],
  maskColor: '#000000',  // Black mask
});
```

### Global Configuration for Screenshots

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    // Take screenshot on failure
    screenshot: 'only-on-failure',
    
    // Options: 'off' | 'on' | 'only-on-failure'
  },
});
```

### Screenshot Options Reference

```typescript
interface ScreenshotOptions {
  path?: string;           // File path to save
  fullPage?: boolean;      // Capture entire scrollable page
  omitBackground?: boolean; // Transparent background
  mask?: Locator[];        // Elements to mask (hide)
  maskColor?: string;      // Color for masked areas (default: #000000)
  scale?: 'css' | 'device'; // Scaling mode
  animations?: 'disabled' | 'allow'; // Handle animations
  caret?: 'hide' | 'initial'; // Show/hide text cursor
  maxHeight?: number;      // Crop to height
  maxWidth?: number;       // Crop to width
}
```

---

## Video Recording

### What Is Video Recording?

Video recording captures the **entire test execution** as a video file (WebM format). This shows everything that happens during the test.

### Advantages Over Screenshots

| Screenshot | Video |
|-----------|-------|
| Single moment | Complete flow |
| Small file size | Larger file size |
| Quick to review | Comprehensive |
| Element-level | Page-level |
| Manual capture | Automatic |

### Enable Video Recording

#### Global Configuration
```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    // Record video for all tests
    video: 'on',
    
    // Options: 'off' | 'on' | 'retain-on-failure' | 'on-first-retry'
  },
});
```

#### Per-Test Recording
```typescript
test('user signup', async ({ page, context }, testInfo) => {
  // Start recording
  const video = await context.video();
  
  // Your test code...
  await page.goto('https://example.com/signup');
  
  // Video will be saved automatically
  // Access path with: video.path()
});
```

### Video Configuration Options

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    // Record all videos in same directory
    video: 'retain-on-failure',
    
    // Custom video size
    videoSize: {
      width: 1280,
      height: 720,
    },
    
    // Video frame rate
    // (higher = smoother, bigger file)
    videoPlaybackRate: 1,  // 1x speed
  },
});
```

### Video Size Presets

```typescript
// HD
videoSize: { width: 1280, height: 720 }

// Full HD
videoSize: { width: 1920, height: 1080 }

// 4K
videoSize: { width: 3840, height: 2160 }

// Mobile
videoSize: { width: 375, height: 812 }
```

### Save Video to Custom Location

```typescript
test('with custom video path', async ({ page, context }, testInfo) => {
  await context.tracing.start({
    // ... tracing config
  });

  try {
    // Your test code
    await page.goto('https://example.com');
    
  } finally {
    // Get the video path
    const video = context.video();
    if (video) {
      const videoPath = `videos/${testInfo.title}.webm`;
      await video.saveAs(videoPath);
    }
  }
});
```

---

## Configuration

### Recommended Setup: screenshots.config.ts

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  // Screenshot configuration
  use: {
    // Take screenshot on failure (recommended)
    screenshot: 'only-on-failure',
    
    // Video recording strategy
    video: process.env.CI 
      ? 'on-first-retry'  // Only on retries in CI
      : 'retain-on-failure', // All failures locally
    
    // Custom video size
    videoSize: {
      width: 1280,
      height: 720,
    },
    
    // Video playback speed
    videoPlaybackRate: 1,
  },

  // Output directory for screenshots/videos
  outputDir: 'test-results',

  // Project configurations
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        screenshot: 'only-on-failure',
        video: 'on-first-retry',
      },
    },
    {
      name: 'mobile',
      use: {
        ...devices['Pixel 5'],
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
    },
  ],
});
```

---

## Best Practices

### ✅ DO:

1. **Use `only-on-failure` for screenshots in CI**
   ```typescript
   screenshot: 'only-on-failure'  // Minimal storage
   ```

2. **Enable video for debugging flaky tests**
   ```typescript
   video: 'retain-on-failure'  // Keep all failures
   ```

3. **Mask sensitive data before sharing**
   ```typescript
   mask: [
     page.locator('input[name="password"]'),
     page.locator('[data-sensitive]'),
   ]
   ```

4. **Use element screenshots for regression testing**
   ```typescript
   await page.locator('.component').screenshot({
     path: `screenshots/${testInfo.title}.png`
   });
   ```

5. **Archive videos/screenshots for failed tests**
   ```bash
   # CI/CD example
   - uses: actions/upload-artifact@v3
     if: failure()
     with:
       name: playwright-screenshots-videos
       path: test-results/
   ```

6. **Compare screenshots for visual regression**
   ```typescript
   // Visual comparison
   await expect(page).toHaveScreenshot('expected.png');
   ```

### ❌ DON'T:

1. **Don't record video for every test in CI**
   ```typescript
   // ❌ Too much storage
   video: 'on'
   ```

2. **Don't include sensitive data in screenshots**
   ```typescript
   // ❌ Security risk
   await page.screenshot({ path: 'login.png' });
   ```

3. **Don't store huge video files permanently**
   ```typescript
   // ✅ Set retention policy instead
   retention-days: 30
   ```

4. **Don't skip image optimization**
   ```typescript
   // ✅ Compress screenshots in reports
   ```

5. **Don't mix screenshot formats**
   ```typescript
   // ✅ Use PNG for consistency
   ```

---

## Real-World Examples

### Example 1: Login Page Screenshot with Masking

```typescript
import { test, expect } from '@playwright/test';

test('login page - masked password', async ({ page }, testInfo) => {
  await page.goto('https://example.com/login');
  
  // Fill login form
  await page.fill('input[name="username"]', 'testuser');
  await page.fill('input[name="password"]', 'secretpass123');
  
  // Screenshot WITH password field masked
  await page.screenshot({
    path: `screenshots/login-${testInfo.title}.png`,
    fullPage: true,
    mask: [
      page.locator('input[name="password"]'),  // Hide password
      page.locator('[data-secret]'),           // Hide secrets
    ],
    maskColor: '#FF0000',  // Red mask for visibility
  });
});
```

### Example 2: Element-Level Screenshot for UI Component

```typescript
test('component - button variations', async ({ page }, testInfo) => {
  await page.goto('https://example.com/components');
  
  // Screenshot individual button states
  const buttons = ['.btn-primary', '.btn-secondary', '.btn-danger'];
  
  for (const selector of buttons) {
    const button = page.locator(selector);
    await button.screenshot({
      path: `screenshots/${selector.replace('.', '')}.png`,
      animations: 'disabled',
    });
  }
});
```

### Example 3: Full Page Screenshot - Before & After

```typescript
test('page transformation - before and after', async ({ page }, testInfo) => {
  await page.goto('https://example.com');
  
  // Screenshot initial state
  await page.screenshot({
    path: `screenshots/${testInfo.title}-before.png`,
    fullPage: true,
  });
  
  // Perform transformation
  await page.click('button[data-action="expand"]');
  await page.waitForTimeout(500);
  
  // Screenshot after state
  await page.screenshot({
    path: `screenshots/${testInfo.title}-after.png`,
    fullPage: true,
  });
});
```

### Example 4: Video Recording with Custom Path

```typescript
test('checkout workflow - recorded', async ({ page, context }, testInfo) => {
  // Video starts automatically if configured
  
  await page.goto('https://example.com/shop');
  
  // Add items
  await page.click('[data-testid="add-to-cart"]');
  await page.waitForTimeout(500);
  
  // Go to cart
  await page.click('[data-testid="cart-link"]');
  
  // Proceed to checkout
  await page.click('[data-testid="checkout-btn"]');
  
  // Fill shipping
  await page.fill('input[name="address"]', '123 Main St');
  
  // Submit
  await page.click('button:has-text("Place Order")');
  
  // Video saved automatically to test-results/
  console.log('Video recorded for checkout workflow');
});
```

### Example 5: Responsive Design Screenshots

```typescript
test.describe('responsive design', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 812 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1920, height: 1080 },
  ];

  for (const viewport of viewports) {
    test(`screenshot - ${viewport.name}`, async ({ page, context }, testInfo) => {
      // Create new context with custom viewport
      const newContext = await context.browser()!.newContext({
        viewport: { width: viewport.width, height: viewport.height },
      });
      
      const newPage = await newContext.newPage();
      await newPage.goto('https://example.com');
      
      // Take screenshot at this viewport
      await newPage.screenshot({
        path: `screenshots/responsive-${viewport.name}.png`,
        fullPage: true,
      });
      
      await newContext.close();
    });
  }
});
```

### Example 6: Visual Regression Testing

```typescript
test('visual regression - button component', async ({ page }, testInfo) => {
  await page.goto('https://example.com/button-demo');
  
  // Compare against baseline
  await expect(page.locator('.btn-primary'))
    .toHaveScreenshot('button-primary.png', {
      maxDiffPixels: 100,  // Allow 100 pixel differences
      threshold: 0.2,      // 20% tolerance
    });
});

test('visual regression - full page', async ({ page }, testInfo) => {
  await page.goto('https://example.com');
  
  // Compare entire page
  await expect(page)
    .toHaveScreenshot('homepage.png', {
      maxDiffPixels: 500,
      threshold: 0.1,
    });
});
```

### Example 7: Video Only on Failures with Auto-Save

```typescript
test('complex workflow - video on failure', async ({ page, context }, testInfo) => {
  // Configure video recording
  const videoPromise = context.video()?.saveAs(
    `videos/${testInfo.title}-${Date.now()}.webm`
  );

  try {
    await page.goto('https://example.com');
    
    // Multi-step workflow
    await page.click('.step-1');
    await page.waitForNavigation();
    
    await page.click('.step-2');
    await page.waitForNavigation();
    
    // Assertion
    await expect(page).toHaveURL(/.*success/);
    
    console.log('✓ Workflow completed, video not saved (optional)');
    
  } catch (error) {
    // Video file saved automatically on failure
    console.error('✗ Workflow failed, video saved');
    throw error;
  }
});
```

### Example 8: Performance Monitoring with Screenshots

```typescript
test('page performance - with screenshots', async ({ page }, testInfo) => {
  const metrics: Record<string, number> = {};
  
  // Screenshot 1: Before navigation
  await page.screenshot({
    path: `screenshots/${testInfo.title}-start.png`,
  });
  
  const navStart = Date.now();
  await page.goto('https://example.com', { waitUntil: 'networkidle' });
  metrics.navigationTime = Date.now() - navStart;
  
  // Screenshot 2: After load
  await page.screenshot({
    path: `screenshots/${testInfo.title}-loaded.png`,
  });
  
  // Measure performance
  const perfMetrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0];
    return {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadTime: navigation.loadEventEnd - navigation.loadEventStart,
    };
  });
  
  metrics.domContentLoaded = perfMetrics.domContentLoaded;
  metrics.loadTime = perfMetrics.loadTime;
  
  console.log('Performance metrics:', metrics);
});
```

### Example 9: Diff Highlighting with Multiple Screenshots

```typescript
test('feature comparison - before/after screenshots', async ({ page }, testInfo) => {
  await page.goto('https://example.com/feature-toggle');
  
  // Screenshot 1: Feature disabled
  await page.evaluate(() => {
    localStorage.setItem('feature_new_ui', 'false');
  });
  await page.reload();
  
  await page.screenshot({
    path: `screenshots/${testInfo.title}-old-ui.png`,
    fullPage: true,
  });
  
  // Screenshot 2: Feature enabled
  await page.evaluate(() => {
    localStorage.setItem('feature_new_ui', 'true');
  });
  await page.reload();
  
  await page.screenshot({
    path: `screenshots/${testInfo.title}-new-ui.png`,
    fullPage: true,
  });
});
```

### Example 10: Recording with Multiple Browsers

```typescript
test.describe('cross-browser visual check', () => {
  test('chromium', async ({ browser }, testInfo) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto('https://example.com');
    await page.screenshot({
      path: `screenshots/chromium-${testInfo.title}.png`,
      fullPage: true,
    });
    
    await context.close();
  });

  test('firefox', async ({ browser }, testInfo) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto('https://example.com');
    await page.screenshot({
      path: `screenshots/firefox-${testInfo.title}.png`,
      fullPage: true,
    });
    
    await context.close();
  });
});
```

---

## Comparison & Storage

### File Formats

| Type | Format | Use Case | File Size |
|------|--------|----------|-----------|
| **Screenshot** | PNG | UI comparison, debugging | 50-500 KB |
| **Video** | WebM | Execution flow, interaction | 1-50 MB |

### Storage Considerations

```typescript
// Development: Keep everything
use: {
  screenshot: 'on',
  video: 'on',
}

// Staging: Failures only
use: {
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
}

// Production CI: Smart retention
use: {
  screenshot: 'only-on-failure',
  video: process.env.CI ? 'on-first-retry' : 'retain-on-failure',
}
```

### File Organization

```
test-results/
├── chromium/
│   ├── example-1.png
│   ├── example-2.png
│   └── video.webm
├── firefox/
│   ├── example-1.png
│   ├── example-2.png
│   └── video.webm
└── webkit/
    ├── example-1.png
    ├── example-2.png
    └── video.webm

screenshots/
├── button-primary.png
├── form-filled.png
└── success-state.png

videos/
├── checkout-workflow-1234567.webm
└── login-flow-7654321.webm
```

---

## Troubleshooting

### Issue: Screenshots are blurry

**Solution:**
```typescript
screenshot: {
  scale: 'device',  // Use actual device pixel ratio
  // or
  scale: 'css',     // Use CSS pixels (default)
}
```

### Issue: Video file too large

**Solution:**
```typescript
use: {
  video: 'on-first-retry',  // Only on retries
  videoSize: {
    width: 1280,
    height: 720,  // Reduce from default
  },
}
```

### Issue: Screenshot shows wrong content

**Solution:**
```typescript
// Wait for content before screenshot
await page.waitForLoadState('networkidle');
await page.waitForSelector('.content-loaded');
await page.screenshot({ path: 'screenshot.png' });
```

### Issue: Animations cause blurry screenshots

**Solution:**
```typescript
await page.screenshot({
  path: 'screenshot.png',
  animations: 'disabled',  // Freeze animations
});
```

### Issue: Cannot find video file

**Solution:**
```typescript
// Video is automatically saved to test-results/
// Access current video path:
const video = context.video();
console.log(video?.path());

// Or save to custom location:
await video?.saveAs('videos/my-test.webm');
```

---

## Summary Table

| Feature | Screenshot | Video |
|---------|-----------|-------|
| **Captures** | Single moment | Full execution |
| **Format** | PNG | WebM |
| **File size** | Small (50-500KB) | Large (1-50MB) |
| **Use for** | UI comparison, regression | Flow analysis, debugging |
| **Retention** | Easy | Needs policy |
| **Element-level** | ✓ Yes | ✗ No |
| **Network capture** | ✗ No | ✓ Yes |
| **Masking** | ✓ Yes | ✗ No |
| **Diff comparison** | ✓ Yes | ✗ No |

---

## Quick Reference Commands

```bash
# Run tests and keep screenshots/videos
npx playwright test --config=playwright.config.ts

# View HTML report with screenshots
npx playwright show-report

# View specific screenshot
# Open test-results/ folder directly

# Watch video in player
# Open test-results/*.webm with any video player

# Extract screenshots from trace
npx playwright show-trace test-results/trace.trace
```

Both screenshots and videos are essential debugging tools. Use them strategically for maximum efficiency and minimal storage overhead!
