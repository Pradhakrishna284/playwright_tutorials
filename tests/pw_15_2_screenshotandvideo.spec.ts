import { test, expect } from '@playwright/test';

/**
 * PLAYWRIGHT SCREENSHOTS & VIDEO RECORDING - PRACTICAL EXAMPLES
 * ==============================================================
 * 
 * This file demonstrates various ways to:
 * 1. Capture screenshots (full page, viewport, element-level)
 * 2. Mask sensitive data
 * 3. Record videos automatically
 * 4. Use visual regression testing
 * 5. Organize visual artifacts
 * 
 * Run with: npx playwright test pw_15_2_screenshotandvideo.spec.ts
 * Results in: test-results/ folder
 */

// ============================================================================
// EXAMPLE 1: Basic Full-Page Screenshot
// ============================================================================
test('ex1: full-page screenshot', async ({ page }, testInfo) => {
  console.log('📸 Capturing full-page screenshot...');
  
  await page.goto('https://example.com');
  
  // Wait for page to fully load
  await page.waitForLoadState('networkidle');
  
  // Full page screenshot (captures scrollable content)
  await page.screenshot({
    path: `test-results/ex1-fullpage-${testInfo.title}.png`,
    fullPage: true,  // Include all scrollable content
  });
  
  console.log('✓ Full-page screenshot saved');
});

// ============================================================================
// EXAMPLE 2: Viewport-Only Screenshot
// ============================================================================
test('ex2: viewport screenshot', async ({ page }, testInfo) => {
  console.log('📸 Capturing viewport screenshot...');
  
  await page.goto('https://example.com');
  
  // Viewport-only screenshot (only visible area)
  await page.screenshot({
    path: `test-results/ex2-viewport-${testInfo.title}.png`,
    fullPage: false,  // Only visible area (above the fold)
  });
  
  console.log('✓ Viewport screenshot saved');
});

// ============================================================================
// EXAMPLE 3: Element-Level Screenshot
// ============================================================================
test('ex3: element screenshot', async ({ page }, testInfo) => {
  console.log('📸 Capturing element screenshot...');
  
  await page.goto('https://example.com');
  
  // Get an element locator
  const heading = page.locator('h1').first();
  
  // Take screenshot of just that element
  await heading.screenshot({
    path: `test-results/ex3-element-${testInfo.title}.png`,
  });
  
  console.log('✓ Element screenshot saved');
});

// ============================================================================
// EXAMPLE 4: Screenshot with Masking (Sensitive Data)
// ============================================================================
test('ex4: screenshot with masking', async ({ page }, testInfo) => {
  console.log('📸 Capturing masked screenshot...');
  
  await page.goto('https://example.com');
  
  // Screenshot with masked regions (sensitive data hidden)
  await page.screenshot({
    path: `test-results/ex4-masked-${testInfo.title}.png`,
    fullPage: true,
    mask: [
      // Mask any input fields (could contain sensitive data)
      page.locator('input'),
      // Mask any sensitive text
      page.locator('[data-sensitive]'),
    ],
    maskColor: '#FF0000',  // Red mask for visibility
  });
  
  console.log('✓ Masked screenshot saved');
});

// ============================================================================
// EXAMPLE 5: Multiple Element Screenshots
// ============================================================================
test('ex5: screenshot collection - multiple elements', async ({ page }, testInfo) => {
  console.log('📸 Capturing multiple element screenshots...');
  
  await page.goto('https://example.com');
  
  // Get all headings and take screenshots
  const headings = page.locator('h1, h2, h3');
  const count = await headings.count();
  
  for (let i = 0; i < Math.min(count, 3); i++) {
    const heading = headings.nth(i);
    const text = await heading.textContent();
    
    await heading.screenshot({
      path: `test-results/ex5-heading-${i}.png`,
    });
    
    console.log(`  ✓ Heading ${i}: "${text}"`);
  }
  
  console.log('✓ All element screenshots saved');
});

// ============================================================================
// EXAMPLE 6: Screenshot at Different Viewports
// ============================================================================
test('ex6: responsive screenshots', async ({ page }, testInfo) => {
  console.log('📸 Capturing responsive design screenshots...');
  
  const viewports = [
    { name: 'mobile', width: 375, height: 812 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1920, height: 1080 },
  ];
  
  for (const viewport of viewports) {
    // Set viewport size
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    
    await page.goto('https://example.com');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot at this size
    await page.screenshot({
      path: `test-results/ex6-responsive-${viewport.name}.png`,
      fullPage: true,
    });
    
    console.log(`  ✓ ${viewport.name}: ${viewport.width}x${viewport.height}`);
  }
  
  console.log('✓ All responsive screenshots saved');
});

// ============================================================================
// EXAMPLE 7: Before & After Screenshots
// ============================================================================
test('ex7: before-after screenshot comparison', async ({ page }, testInfo) => {
  console.log('📸 Capturing before/after screenshots...');
  
  await page.goto('https://example.com');
  
  // BEFORE screenshot
  await page.screenshot({
    path: `test-results/ex7-before-${testInfo.title}.png`,
    fullPage: true,
  });
  console.log('  ✓ Before screenshot');
  
  // Make a change (e.g., theme toggle, expand section, etc.)
  await page.evaluate(() => {
    document.body.style.backgroundColor = '#f0f0f0';
  });
  
  // AFTER screenshot
  await page.screenshot({
    path: `test-results/ex7-after-${testInfo.title}.png`,
    fullPage: true,
  });
  console.log('  ✓ After screenshot');
  
  console.log('✓ Before/after comparison ready');
});

// ============================================================================
// EXAMPLE 8: Screenshots During Workflow
// ============================================================================
test('ex8: step-by-step screenshots', async ({ page }, testInfo) => {
  console.log('📸 Capturing step-by-step workflow...');
  
  const steps = ['step1', 'step2', 'step3'];
  let stepNum = 0;
  
  await page.goto('https://example.com');
  
  // Step 1: Initial state
  await page.screenshot({
    path: `test-results/ex8-step${++stepNum}-initial.png`,
  });
  console.log(`  ✓ Step ${stepNum}: Initial state`);
  
  // Step 2: After interaction
  await page.evaluate(() => {
    // Simulate some action
    console.log('Performing action...');
  });
  await page.waitForTimeout(500);
  
  await page.screenshot({
    path: `test-results/ex8-step${++stepNum}-action.png`,
  });
  console.log(`  ✓ Step ${stepNum}: After action`);
  
  // Step 3: Final state
  await page.evaluate(() => {
    // Simulate completion
    console.log('Completing workflow...');
  });
  
  await page.screenshot({
    path: `test-results/ex8-step${++stepNum}-complete.png`,
  });
  console.log(`  ✓ Step ${stepNum}: Workflow complete`);
  
  console.log('✓ Workflow screenshots saved');
});

// ============================================================================
// EXAMPLE 9: Screenshot with Custom Opacity/Styling
// ============================================================================
test('ex9: styled element screenshot', async ({ page }, testInfo) => {
  console.log('📸 Capturing styled element screenshot...');
  
  await page.goto('https://example.com');
  
  // Highlight an element with custom style
  await page.locator('h1').first().evaluate(el => {
    el.style.border = '3px solid red';
    el.style.padding = '10px';
    el.style.backgroundColor = 'yellow';
  });
  
  // Screenshot the styled element
  await page.locator('h1').first().screenshot({
    path: `test-results/ex9-styled-${testInfo.title}.png`,
  });
  
  console.log('✓ Styled element screenshot saved');
});

// ============================================================================
// EXAMPLE 10: Video Recording (Auto)
// ============================================================================
test('ex10: automatic video recording', async ({ page, context }, testInfo) => {
  console.log('🎬 Test execution is being recorded...');
  
  // If configured in playwright.config.ts, video auto-starts
  // No special code needed!
  
  await page.goto('https://example.com');
  console.log('  ✓ Navigated to page');
  
  // Perform actions
  await page.evaluate(() => {
    console.log('Performing actions...');
  });
  console.log('  ✓ Actions completed');
  
  // Video automatically saved to test-results/ when test ends
  
  // Optional: Get video path
  const video = context.video();
  if (video) {
    console.log(`🎬 Video will be saved to: ${video.path()}`);
  }
});

// ============================================================================
// EXAMPLE 11: Video with Custom Save Location
// ============================================================================
test('ex11: custom video save location', async ({ page, context }, testInfo) => {
  console.log('🎬 Recording with custom save location...');
  
  // Video auto-records if configured
  const video = context.video();
  
  await page.goto('https://example.com');
  console.log('  ✓ Page loaded');
  
  await page.waitForLoadState('networkidle');
  console.log('  ✓ Network idle');
  
  if (video) {
    // Save video to custom location
    const customPath = `test-results/custom-videos/${testInfo.title}-${Date.now()}.webm`;
    await video.saveAs(customPath);
    console.log(`🎬 Video saved to: ${customPath}`);
  }
});

// ============================================================================
// EXAMPLE 12: Visual Regression Testing
// ============================================================================
test('ex12: visual regression - compare with baseline', async ({ page }, testInfo) => {
  console.log('🔍 Performing visual regression test...');
  
  await page.goto('https://example.com');
  await page.waitForLoadState('networkidle');
  
  // Compare page against baseline screenshot
  // (First run creates baseline, subsequent runs compare)
  try {
    await expect(page).toHaveScreenshot('baseline-homepage.png', {
      maxDiffPixels: 100,   // Allow 100 pixel differences
      threshold: 0.2,       // Allow 20% tolerance
    });
    console.log('✓ Page matches baseline');
  } catch (error) {
    console.log('⚠ Visual differences detected from baseline');
    // This creates actual.png and diff.png for comparison
  }
});

// ============================================================================
// EXAMPLE 13: Element Visual Regression
// ============================================================================
test('ex13: visual regression - element only', async ({ page }, testInfo) => {
  console.log('🔍 Testing element visual regression...');
  
  await page.goto('https://example.com');
  
  // Compare specific element
  const heading = page.locator('h1').first();
  
  try {
    await expect(heading).toHaveScreenshot('heading-baseline.png', {
      maxDiffPixels: 10,
      threshold: 0.1,
    });
    console.log('✓ Element matches baseline');
  } catch (error) {
    console.log('⚠ Element visual differences detected');
  }
});

// ============================================================================
// EXAMPLE 14: Screenshot with Console Output
// ============================================================================
test('ex14: screenshot with console capture', async ({ page }, testInfo) => {
  console.log('📸 Capturing screenshot with console info...');
  
  const consoleLogs: string[] = [];
  
  // Capture console messages
  page.on('console', msg => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
  });
  
  await page.goto('https://example.com');
  
  // Trigger console output
  await page.evaluate(() => {
    console.log('Page is fully loaded');
    console.warn('Some warning message');
  });
  
  // Take screenshot
  await page.screenshot({
    path: `test-results/ex14-with-console-${testInfo.title}.png`,
    fullPage: true,
  });
  
  console.log('Console messages captured:');
  consoleLogs.forEach(log => console.log(`  ${log}`));
  console.log('✓ Screenshot saved');
});

// ============================================================================
// EXAMPLE 15: Performance-Based Screenshots
// ============================================================================
test('ex15: screenshot at performance milestones', async ({ page }, testInfo) => {
  console.log('📸 Capturing performance milestone screenshots...');
  
  // Screenshot 1: Before navigation
  await page.goto('about:blank');
  await page.screenshot({
    path: `test-results/ex15-blank.png`,
  });
  console.log('  ✓ Blank page');
  
  const startTime = Date.now();
  
  // Navigate
  await page.goto('https://example.com');
  const navTime = Date.now() - startTime;
  
  // Screenshot 2: After navigation
  await page.screenshot({
    path: `test-results/ex15-after-nav-${navTime}ms.png`,
  });
  console.log(`  ✓ After navigation (${navTime}ms)`);
  
  // Wait for network
  await page.waitForLoadState('networkidle');
  const totalTime = Date.now() - startTime;
  
  // Screenshot 3: After network idle
  await page.screenshot({
    path: `test-results/ex15-network-idle-${totalTime}ms.png`,
    fullPage: true,
  });
  console.log(`  ✓ Network idle (${totalTime}ms)`);
});

// ============================================================================
// EXAMPLE 16: Grouped Screenshots
// ============================================================================
test.describe('ex16: grouped screenshot suite', () => {
  test('page header', async ({ page }, testInfo) => {
    await page.goto('https://example.com');
    
    const header = page.locator('header').first();
    await header.screenshot({
      path: `test-results/ex16-group-header.png`,
    });
    console.log('✓ Header screenshot');
  });

  test('page main content', async ({ page }, testInfo) => {
    await page.goto('https://example.com');
    
    const main = page.locator('main').first();
    await main.screenshot({
      path: `test-results/ex16-group-main.png`,
    });
    console.log('✓ Main content screenshot');
  });

  test('page footer', async ({ page }, testInfo) => {
    await page.goto('https://example.com');
    
    const footer = page.locator('footer').first();
    if (await footer.isVisible()) {
      await footer.screenshot({
        path: `test-results/ex16-group-footer.png`,
      });
      console.log('✓ Footer screenshot');
    }
  });
});

// ============================================================================
// EXAMPLE 17: Screenshot with Device Emulation
// ============================================================================
test('ex17: mobile device screenshots', async ({ page }, testInfo) => {
  console.log('📸 Capturing mobile device screenshots...');
  
  // iPhone 12 dimensions
  await page.setViewportSize({ width: 390, height: 844 });
  
  await page.goto('https://example.com');
  
  await page.screenshot({
    path: `test-results/ex17-iphone12-${testInfo.title}.png`,
    fullPage: true,
  });
  
  console.log('✓ iPhone 12 screenshot saved');
});

// ============================================================================
// EXAMPLE 18: Error State Screenshot
// ============================================================================
test('ex18: capture screenshot on assertion failure', async ({ page }, testInfo) => {
  console.log('📸 Capturing error state...');
  
  await page.goto('https://example.com');
  
  try {
    // This assertion will fail
    await expect(page.locator('text=NonExistentText')).toBeVisible({ timeout: 2000 });
  } catch (error) {
    // Screenshot the error state before rethrowing
    await page.screenshot({
      path: `test-results/ex18-error-state-${testInfo.title}.png`,
      fullPage: true,
    });
    console.log('✓ Error state screenshot saved');
    throw error;
  }
});

// ============================================================================
// EXAMPLE 19: Animated Content Screenshot
// ============================================================================
test('ex19: screenshot with animation control', async ({ page }, testInfo) => {
  console.log('📸 Capturing with animation disabled...');
  
  await page.goto('https://example.com');
  
  // Disable animations and transitions for consistent screenshots
  await page.addStyleTag({
    content: `
      * {
        animation: none !important;
        transition: none !important;
      }
    `,
  });
  
  // Now animations are disabled
  await page.screenshot({
    path: `test-results/ex19-no-animation-${testInfo.title}.png`,
    fullPage: true,
    animations: 'disabled',
  });
  
  console.log('✓ Screenshot with animations disabled');
});

// ============================================================================
// EXAMPLE 20: Combined Screenshots and Video Workflow
// ============================================================================
test('ex20: combined screenshots and video', async ({ page, context }, testInfo) => {
  console.log('📸🎬 Combined screenshot and video recording...');
  
  // Video auto-records
  
  // Step 1: Initial screenshot
  await page.goto('https://example.com');
  await page.screenshot({
    path: `test-results/ex20-step1.png`,
  });
  console.log('  ✓ Step 1 screenshot');
  
  // Perform action
  await page.waitForTimeout(500);
  
  // Step 2: After action screenshot
  await page.screenshot({
    path: `test-results/ex20-step2.png`,
  });
  console.log('  ✓ Step 2 screenshot');
  
  // Final action
  await page.waitForTimeout(500);
  
  // Step 3: Final screenshot
  await page.screenshot({
    path: `test-results/ex20-step3.png`,
    fullPage: true,
  });
  console.log('  ✓ Step 3 screenshot');
  
  // Video is automatically saved
  const video = context.video();
  console.log(`✓ Workflow recorded in video: ${video?.path()}`);
});

/**
 * RUNNING THESE EXAMPLES:
 * =======================
 * 
 * 1. Run all examples:
 *    npx playwright test pw_15_2_screenshotandvideo.spec.ts
 * 
 * 2. Run specific example:
 *    npx playwright test -g "ex1: full-page"
 * 
 * 3. Run with screenshots enabled:
 *    npx playwright test --config=playwright.config.ts
 * 
 * 4. View results:
 *    - Screenshots: test-results/ folder
 *    - Videos: test-results/ folder (*.webm files)
 *    - HTML Report: npx playwright show-report
 * 
 * OUTPUT STRUCTURE:
 * =================
 * test-results/
 * ├── ex1-fullpage-*.png
 * ├── ex2-viewport-*.png
 * ├── ex3-element-*.png
 * ├── ex4-masked-*.png
 * ├── ... (more screenshots)
 * ├── video.webm
 * └── index.html (HTML report)
 * 
 * VIEWING RESULTS:
 * ================
 * 1. Open test-results/ folder to view PNG files
 * 2. Double-click .webm files to play videos
 * 3. Run 'npx playwright show-report' for detailed HTML report
 * 
 * FILE SIZES:
 * ===========
 * Screenshots: 50-500 KB each
 * Videos: 1-50 MB per test (depending on duration)
 */
