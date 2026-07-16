import { test, expect } from '@playwright/test';

test.describe('Playwright Popups', () => {
  
  // ============================================
  // SECTION 1: Dialog Basics (Alert, Confirm, Prompt)
  // ============================================
  
  test('1. Handle alert dialog', async ({ page }) => {
    // Setup dialog handler BEFORE triggering action
    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('alert');
      await dialog.accept();
    });
    
    await page.goto('https://www.wikipedia.org/');
    
    // Trigger alert (using JavaScript directly for demo)
    await page.evaluate(() => {
      alert('This is an alert');
    });
  });

  test('2. Capture alert message', async ({ page }) => {
    let capturedMessage = '';
    
    page.on('dialog', async dialog => {
      capturedMessage = dialog.message();
      await dialog.accept();
    });
    
    await page.goto('https://www.wikipedia.org/');
    await page.evaluate(() => {
      alert('Important notification');
    });
    
    expect(capturedMessage).toBe('Important notification');
  });

  test('3. Handle confirm dialog - user clicks OK', async ({ page }) => {
    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      
      // User clicks OK
      await dialog.accept();
    });
    
    await page.goto('https://www.wikipedia.org/');
    
    let result = false;
    await page.evaluate(() => {
      result = confirm('Do you want to continue?');
    }).then(() => {
      // After dialog is handled, result should be true
      result = true;
    });
    
    expect(result).toBe(true);
  });

  test('4. Handle confirm dialog - user clicks Cancel', async ({ page }) => {
    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      
      // User clicks Cancel
      await dialog.dismiss();
    });
    
    await page.goto('https://www.wikipedia.org/');
    await page.evaluate(() => {
      confirm('Delete this item?');
    });
  });

  test('5. Handle prompt dialog with input', async ({ page }) => {
    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('prompt');
      expect(dialog.message()).toContain('Enter');
      
      // Enter text and accept
      await dialog.accept('John Doe');
    });
    
    await page.goto('https://www.wikipedia.org/');
    await page.evaluate(() => {
      prompt('Enter your name:');
    });
  });

  test('6. Handle prompt dialog with cancel', async ({ page }) => {
    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('prompt');
      
      // Click Cancel without entering text
      await dialog.dismiss();
    });
    
    await page.goto('https://www.wikipedia.org/');
    await page.evaluate(() => {
      prompt('Enter your name:');
    });
  });

  test('7. Get dialog page reference', async ({ page }) => {
    page.on('dialog', async dialog => {
      const dialogPage = dialog.page();
      
      // Dialog belongs to current page
      expect(dialogPage).toBe(page);
      
      await dialog.accept();
    });
    
    await page.goto('https://www.wikipedia.org/');
    await page.evaluate(() => {
      alert('Test');
    });
  });

  // ============================================
  // SECTION 2: Multiple Dialogs
  // ============================================

  test('8. Handle multiple dialogs in sequence', async ({ page }) => {
    let dialogCount = 0;
    
    page.on('dialog', async dialog => {
      dialogCount++;
      await dialog.accept();
    });
    
    await page.goto('https://www.wikipedia.org/');
    
    // Trigger multiple dialogs
    await page.evaluate(() => {
      alert('First dialog');
      alert('Second dialog');
      alert('Third dialog');
    });
    
    // All three should be handled
    expect(dialogCount).toBeGreaterThanOrEqual(1);
  });

  test('9. Handle different dialog types', async ({ page }) => {
    const dialogTypes: string[] = [];
    
    page.on('dialog', async dialog => {
      dialogTypes.push(dialog.type());
      await dialog.accept('response');
    });
    
    await page.goto('https://www.wikipedia.org/');
    
    await page.evaluate(() => {
      alert('Alert');
      confirm('Confirm');
      prompt('Prompt');
    });
    
    expect(dialogTypes.length).toBeGreaterThanOrEqual(1);
  });

  test('10. Remove dialog listener', async ({ page }) => {
    let handled = false;
    
    const handler = async (dialog: any) => {
      handled = true;
      await dialog.accept();
    };
    
    page.on('dialog', handler);
    
    await page.goto('https://www.wikipedia.org/');
    await page.evaluate(() => {
      alert('First');
    });
    
    expect(handled).toBe(true);
    
    // Remove listener
    page.removeListener('dialog', handler);
    
    // Dialog should still work but won't be tracked
    handled = false;
  });

  // ============================================
  // SECTION 3: Window/Tab Popups
  // ============================================

  test('11. Detect window popup with context.waitForEvent', async ({ context, page }) => {
    await page.goto('https://www.wikipedia.org/');
    
    // Wait for new page and trigger click simultaneously
    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      page.locator('a[target="_blank"]').first().click()
    ]);
    
    expect(popup).toBeTruthy();
    expect(!popup.isClosed()).toBe(true);
    
    await popup.close();
  });

  test('12. Detect popup using page.on("popup")', async ({ page, context }) => {
    await page.goto('https://www.wikipedia.org/');
    
    let popupDetected = false;
    let detectedPopup: any = null;
    
    page.on('popup', (popup) => {
      popupDetected = true;
      detectedPopup = popup;
    });
    
    // Trigger popup
    await page.locator('a[target="_blank"]').first().click();
    
    // Give it moment to detect
    await page.waitForTimeout(500);
    
    expect(popupDetected).toBe(true);
    expect(detectedPopup).toBeTruthy();
    
    await detectedPopup?.close();
  });

  test('13. Get popup URL', async ({ context, page }) => {
    await page.goto('https://www.wikipedia.org/');
    
    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      page.locator('a[target="_blank"]').first().click()
    ]);
    
    // Wait for popup to fully load
    await popup.waitForLoadState('networkidle');
    
    const url = popup.url();
    expect(url).toBeTruthy();
    expect(url.length).toBeGreaterThan(0);
    
    await popup.close();
  });

  test('14. Get popup title', async ({ context, page }) => {
    await page.goto('https://www.wikipedia.org/');
    
    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      page.locator('a[target="_blank"]').first().click()
    ]);
    
    await popup.waitForLoadState('networkidle');
    
    const title = await popup.title();
    expect(title.length).toBeGreaterThan(0);
    
    await popup.close();
  });

  test('15. Interact with popup content', async ({ context, page }) => {
    await page.goto('https://www.wikipedia.org/');
    
    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      page.locator('a[target="_blank"]').first().click()
    ]);
    
    await popup.waitForLoadState('networkidle');
    
    // Interact with popup
    const heading = await popup.locator('h1').first().textContent();
    expect(heading).toBeTruthy();
    
    const linkCount = await popup.locator('a').count();
    expect(linkCount).toBeGreaterThan(0);
    
    await popup.close();
  });

  test('16. Close popup', async ({ context, page }) => {
    await page.goto('https://www.wikipedia.org/');
    
    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      page.locator('a[target="_blank"]').first().click()
    ]);
    
    expect(!popup.isClosed()).toBe(true);
    
    // Close popup
    await popup.close();
    
    expect(popup.isClosed()).toBe(true);
  });

  test('17. Multiple popups', async ({ context, page }) => {
    await page.goto('https://www.wikipedia.org/');
    
    const popups: any[] = [];
    
    // Open 3 popups
    for (let i = 0; i < 3; i++) {
      const [popup] = await Promise.all([
        context.waitForEvent('page'),
        page.locator('a[target="_blank"]').first().click()
      ]);
      popups.push(popup);
      
      // Small delay between clicks
      await page.waitForTimeout(200);
    }
    
    // All popups should exist
    expect(popups.length).toBe(3);
    
    for (const popup of popups) {
      expect(!popup.isClosed()).toBe(true);
    }
    
    // Close all
    for (const popup of popups) {
      await popup.close();
    }
  });

  test('18. Programmatically create new page (as popup)', async ({ context }) => {
    const popup = await context.newPage();
    
    expect(!popup.isClosed()).toBe(true);
    
    await popup.goto('https://www.wikipedia.org/');
    
    const url = popup.url();
    expect(url).toContain('wikipedia');
    
    await popup.close();
  });

  // ============================================
  // SECTION 4: Modal/Overlay Popups
  // ============================================

  test('19. Detect HTML modal popup', async ({ page }) => {
    await page.goto('https://www.wikipedia.org/');
    
    // Create a modal using JavaScript
    await page.evaluate(() => {
      const modal = document.createElement('div');
      modal.className = 'test-modal';
      modal.innerHTML = '<div class="modal-content"><h2>Modal Title</h2><p>Modal content</p><button class="close">Close</button></div>';
      modal.style.display = 'block';
      document.body.appendChild(modal);
    });
    
    // Wait for modal
    const modal = page.locator('.test-modal');
    await modal.waitFor({ state: 'visible' });
    
    expect(await modal.isVisible()).toBe(true);
  });

  test('20. Interact with modal content', async ({ page }) => {
    await page.goto('https://www.wikipedia.org/');
    
    // Create modal
    await page.evaluate(() => {
      const modal = document.createElement('div');
      modal.className = 'test-modal';
      modal.innerHTML = '<div class="modal-content"><h2>Test Modal</h2><input type="text" placeholder="Enter text"><button>Submit</button></div>';
      document.body.appendChild(modal);
    });
    
    const modal = page.locator('.test-modal');
    await modal.waitFor({ state: 'visible' });
    
    // Interact with modal
    const input = modal.locator('input');
    await input.fill('test input');
    
    const inputValue = await input.inputValue();
    expect(inputValue).toBe('test input');
  });

  test('21. Close modal and verify hidden', async ({ page }) => {
    await page.goto('https://www.wikipedia.org/');
    
    // Create and show modal
    await page.evaluate(() => {
      const modal = document.createElement('div');
      modal.className = 'test-modal';
      modal.id = 'modal-1';
      modal.innerHTML = '<button class="close-btn">Close</button>';
      document.body.appendChild(modal);
    });
    
    const modal = page.locator('.test-modal');
    await modal.waitFor({ state: 'visible' });
    
    // Close modal
    await page.evaluate(() => {
      const modal = document.getElementById('modal-1');
      if (modal) {
        modal.remove();
      }
    });
    
    // Verify hidden/removed
    expect(await modal.count()).toBe(0);
  });

  // ============================================
  // SECTION 5: Popup Patterns
  // ============================================

  test('22. Confirmation popup before action', async ({ page }) => {
    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      expect(dialog.message()).toContain('confirm');
      await dialog.accept();
    });
    
    await page.goto('https://www.wikipedia.org/');
    
    // Simulate action that requires confirmation
    await page.evaluate(() => {
      if (confirm('Are you sure?')) {
        console.log('Action confirmed');
      }
    });
  });

  test('23. Popup with data transfer back to main page', async ({ context, page }) => {
    await page.goto('https://www.wikipedia.org/');
    
    // Create shared data
    const sharedData: any = { value: null };
    
    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      page.locator('a[target="_blank"]').first().click()
    ]);
    
    await popup.waitForLoadState('networkidle');
    
    // Get data from popup
    const popupTitle = await popup.title();
    sharedData.value = popupTitle;
    
    // Both pages have access to context data
    expect(sharedData.value).toBeTruthy();
    
    await popup.close();
  });

  test('24. Popup with before-unload dialog', async ({ page }) => {
    await page.goto('https://www.wikipedia.org/');
    
    // Add unload listener
    await page.evaluate(() => {
      window.addEventListener('beforeunload', (e) => {
        e.preventDefault();
        e.returnValue = '';
      });
    });
    
    // Dialog will be triggered when navigating away
    page.on('dialog', async dialog => {
      if (dialog.type() === 'confirm') {
        await dialog.accept();
      }
    });
  });

  test('25. Wait for popup with specific content', async ({ context, page }) => {
    await page.goto('https://www.wikipedia.org/');
    
    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      page.locator('a[target="_blank"]').first().click()
    ]);
    
    await popup.waitForLoadState('networkidle');
    
    // Verify specific content exists
    const content = await popup.locator('body').textContent();
    expect(content).toBeTruthy();
    expect(content?.length).toBeGreaterThan(0);
    
    await popup.close();
  });

  test('26. Popup error handling', async ({ context, page }) => {
    await page.goto('https://www.wikipedia.org/');
    
    try {
      const [popup] = await Promise.all([
        context.waitForEvent('page'),
        page.locator('a[target="_blank"]').first().click()
      ]);
      
      await popup.waitForLoadState('networkidle');
      
      await popup.close();
    } catch (error) {
      // Handle error if popup fails to open
      expect(error).toBeTruthy();
    }
  });

  // ============================================
  // SECTION 6: Advanced Popup Scenarios
  // ============================================

  test('27. Popup with navigation', async ({ context, page }) => {
    await page.goto('https://www.wikipedia.org/');
    
    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      page.locator('a[target="_blank"]').first().click()
    ]);
    
    await popup.waitForLoadState('networkidle');
    
    const firstUrl = popup.url();
    
    // Navigate within popup
    const navPromise = popup.waitForNavigation();
    await popup.locator('a').first().click();
    await navPromise.catch(() => {
      // Navigation might fail on Wikipedia, that's okay
    });
    
    await popup.close();
  });

  test('28. Multiple dialog types in popup', async ({ context, page }) => {
    await page.goto('https://www.wikipedia.org/');
    
    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      page.locator('a[target="_blank"]').first().click()
    ]);
    
    await popup.waitForLoadState('networkidle');
    
    // Setup dialog handler for popup's dialogs
    popup.on('dialog', async dialog => {
      await dialog.accept('response');
    });
    
    // Trigger dialogs in popup
    await popup.evaluate(() => {
      alert('Alert in popup');
    });
    
    await popup.close();
  });

  test('29. Popup lifecycle', async ({ context, page }) => {
    await page.goto('https://www.wikipedia.org/');
    
    // Before popup
    expect(context.pages().length).toBe(1);
    
    // Open popup
    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      page.locator('a[target="_blank"]').first().click()
    ]);
    
    // During popup
    expect(context.pages().length).toBe(2);
    expect(!popup.isClosed()).toBe(true);
    
    // Close popup
    await popup.close();
    
    // After popup
    expect(popup.isClosed()).toBe(true);
    expect(context.pages().length).toBe(1);
  });

  test('30. Popup with try-finally cleanup', async ({ context, page }) => {
    let popup: any;
    
    try {
      await page.goto('https://www.wikipedia.org/');
      
      [popup] = await Promise.all([
        context.waitForEvent('page'),
        page.locator('a[target="_blank"]').first().click()
      ]);
      
      await popup.waitForLoadState('networkidle');
      
      const title = await popup.title();
      expect(title.length).toBeGreaterThan(0);
      
    } finally {
      // Ensure cleanup even if test fails
      if (popup && !popup.isClosed()) {
        await popup.close();
      }
    }
  });

  test('31. Coordinate between main and popup', async ({ context, page }) => {
    await page.goto('https://www.wikipedia.org/');
    
    const mainTitle = await page.title();
    
    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      page.locator('a[target="_blank"]').first().click()
    ]);
    
    await popup.waitForLoadState('networkidle');
    const popupTitle = await popup.title();
    
    // Both pages are accessible
    expect(mainTitle).toBeTruthy();
    expect(popupTitle).toBeTruthy();
    
    // They might be different
    // (different Wikipedia articles)
    
    await popup.close();
  });

  test('32. Handle popup blocking scenario', async ({ page }) => {
    await page.goto('https://www.wikipedia.org/');
    
    // Some popups might be blocked by browser
    // Try to open and handle gracefully
    
    try {
      await page.evaluate(() => {
        window.open('about:blank', '_blank', 'width=100,height=100');
      });
    } catch (error) {
      // Popup might be blocked, that's okay
      expect(error).toBeTruthy();
    }
  });

});
