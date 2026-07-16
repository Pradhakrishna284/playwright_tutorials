import { test, expect, Page } from '@playwright/test';

/**
 * PLAYWRIGHT DIALOG HANDLING - COMPREHENSIVE GUIDE
 * 
 * Dialogs in web applications come in several types:
 * 1. Alert - Simple message with OK button
 * 2. Confirm - Message with OK and Cancel buttons
 * 3. Prompt - Text input with OK and Cancel buttons
 * 4. BeforeUnload - Warning when leaving page with unsaved changes
 * 
 * Key Concepts:
 * - Dialog listeners must be set BEFORE triggering the dialog
 * - page.on('dialog', callback) or page.once('dialog', callback)
 * - dialog.accept() or dialog.dismiss()
 * - dialog.inputValue() for getting default text in prompt
 * - dialog.message() for getting dialog message
 * - dialog.type for getting dialog type
 */

test.describe('Dialog Handling in Playwright', () => {

  /**
   * EXAMPLE 1: Simple Alert Dialog
   * Alert shows a message and has only an OK button.
   * User must click OK to dismiss it.
   */
  test('Example 1 - Handling Alert Dialog', async ({ page }) => {
    // Navigate to a page with alert (using a public testing site)
    await page.goto('https://alertsjs.com/');

    // Set up listener BEFORE triggering the dialog
    page.once('dialog', async (dialog) => {
      console.log(`Dialog Type: ${dialog.type()}`);        // 'alert'
      console.log(`Dialog Message: ${dialog.message()}`);  // The alert text
      
      // Accept the alert (click OK button)
      await dialog.accept();
    });

    // Click button that triggers alert
    await page.click('button:has-text("Alert")');
    
    // Dialog is automatically handled by listener
  });

  /**
   * EXAMPLE 2: Confirm Dialog
   * Confirm shows a message with OK and Cancel buttons.
   * You choose to accept (OK) or dismiss (Cancel).
   */
  test('Example 2 - Handling Confirm Dialog', async ({ page }) => {
    await page.goto('https://alertsjs.com/');

    // Listen for dialog and accept it
    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm');
      console.log(`Confirm Message: ${dialog.message()}`);
      
      // Click OK button
      await dialog.accept();
    });

    await page.click('button:has-text("Confirm")');
  });

  /**
   * EXAMPLE 3: Dismiss Confirm Dialog
   * User clicks Cancel instead of OK.
   */
  test('Example 3 - Dismiss Confirm Dialog (Click Cancel)', async ({ page }) => {
    await page.goto('https://alertsjs.com/');

    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm');
      
      // Click Cancel button (dismiss the dialog)
      await dialog.dismiss();
    });

    await page.click('button:has-text("Confirm")');
  });

  /**
   * EXAMPLE 4: Prompt Dialog
   * Prompt asks for user input. Has a text field, OK, and Cancel buttons.
   * You can provide input and accept, or just dismiss.
   */
  test('Example 4 - Handling Prompt Dialog with Input', async ({ page }) => {
    await page.goto('https://alertsjs.com/');

    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('prompt');
      console.log(`Prompt Message: ${dialog.message()}`);
      console.log(`Default Value: ${dialog.inputValue()}`); // Get pre-filled value
      
      // Type text into the prompt and accept
      await dialog.accept('John Doe');
    });

    await page.click('button:has-text("Prompt")');
  });

  /**
   * EXAMPLE 5: Prompt Dialog - Dismiss without Input
   * User clicks Cancel on prompt dialog.
   */
  test('Example 5 - Dismiss Prompt Dialog', async ({ page }) => {
    await page.goto('https://alertsjs.com/');

    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('prompt');
      
      // Click Cancel button
      await dialog.dismiss();
    });

    await page.click('button:has-text("Prompt")');
  });

  /**
   * EXAMPLE 6: Multiple Dialogs in Sequence
   * If multiple dialogs appear in sequence, handle them one by one.
   * Use page.on() instead of page.once() to listen for multiple dialogs.
   */
  test('Example 6 - Multiple Dialogs in Sequence', async ({ page }) => {
    await page.goto('https://alertsjs.com/');

    let dialogCount = 0;

    // Use page.on() to listen for multiple dialogs
    page.on('dialog', async (dialog) => {
      dialogCount++;
      console.log(`Dialog ${dialogCount}: ${dialog.message()}`);
      
      if (dialogCount === 1) {
        await dialog.accept(); // First dialog - click OK
      } else if (dialogCount === 2) {
        await dialog.accept('User Input'); // Second dialog - provide input
      }
    });

    // Trigger multiple dialogs
    await page.click('button:has-text("Alert")');
    await page.click('button:has-text("Prompt")');

    // Clean up listener
    page.off('dialog', () => {});
  });

  /**
   * EXAMPLE 7: Dialog with Context Manager Pattern
   * Best practice: use page.once() for single dialogs, page.on() for multiple
   * Always handle exceptions in dialog listener
   */
  test('Example 7 - Dialog with Error Handling', async ({ page }) => {
    await page.goto('https://alertsjs.com/');

    page.once('dialog', async (dialog) => {
      try {
        if (dialog.type() === 'alert') {
          console.log(`Alert: ${dialog.message()}`);
          await dialog.accept();
        } else if (dialog.type() === 'confirm') {
          console.log(`Confirm: ${dialog.message()}`);
          await dialog.accept();
        } else if (dialog.type() === 'prompt') {
          console.log(`Prompt: ${dialog.message()}`);
          await dialog.accept('Input Value');
        }
      } catch (error) {
        console.error(`Error handling dialog: ${error}`);
        await dialog.dismiss();
      }
    });

    await page.click('button:has-text("Alert")');
  });

  /**
   * EXAMPLE 8: Dialog Message Verification
   * Verify the exact message shown in the dialog.
   */
  test('Example 8 - Verify Dialog Message', async ({ page }) => {
    await page.goto('https://alertsjs.com/');

    page.once('dialog', async (dialog) => {
      const message = dialog.message();
      
      // Verify message content
      expect(message).toContain('Are you sure');
      expect(dialog.type()).toBe('confirm');
      
      await dialog.accept();
    });

    await page.click('button:has-text("Confirm")');
  });

  /**
   * EXAMPLE 9: Handling BeforeUnload Dialog
   * Shown when trying to leave a page with unsaved changes.
   * Message is usually controlled by browser, not website.
   */
  test('Example 9 - BeforeUnload Dialog', async ({ page }) => {
    await page.goto('https://example.com/form-with-unsaved-changes');

    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('beforeunload');
      
      // Accept to leave the page
      await dialog.accept();
    });

    // Try to navigate away
    await page.goto('https://example.com/other-page');
  });

  /**
   * EXAMPLE 10: Dialog Timeout Pattern
   * Handle case where dialog doesn't appear (with timeout).
   */
  test('Example 10 - Dialog with Timeout Handling', async ({ page }) => {
    await page.goto('https://alertsjs.com/');

    let dialogHandled = false;

    const dialogHandler = async (dialog) => {
      dialogHandled = true;
      console.log(`Dialog appeared: ${dialog.message()}`);
      await dialog.accept();
    };

    page.once('dialog', dialogHandler);

    // Try to trigger dialog
    try {
      await page.click('button:has-text("Alert")', { timeout: 5000 });
      
      // Wait a bit for dialog to appear
      await page.waitForTimeout(2000);
      
      if (!dialogHandled) {
        console.log('Dialog did not appear');
        page.off('dialog', dialogHandler);
      }
    } catch (error) {
      console.error('Error triggering dialog:', error);
    }
  });

  /**
   * EXAMPLE 11: Dialog with Element State Verification
   * Verify page state AFTER dialog is handled.
   */
  test('Example 11 - Verify State After Dialog', async ({ page }) => {
    await page.goto('https://alertsjs.com/');

    page.once('dialog', async (dialog) => {
      console.log(`Handling dialog: ${dialog.message()}`);
      await dialog.accept();
    });

    // Check initial state
    const initialText = await page.locator('body').textContent();
    
    // Trigger dialog
    await page.click('button:has-text("Alert")');
    
    // Verify page state after dialog
    const finalText = await page.locator('body').textContent();
    expect(finalText).toBeTruthy();
  });

  /**
   * EXAMPLE 12: Custom Alert Wrapper Function
   * Reusable pattern for common dialog handling.
   */
  test('Example 12 - Custom Dialog Handler Function', async ({ page }) => {
    
    // Define custom dialog handler
    async function handleAlert(page: Page) {
      return new Promise((resolve) => {
        page.once('dialog', async (dialog) => {
          console.log(`[${dialog.type().toUpperCase()}] ${dialog.message()}`);
          await dialog.accept();
          resolve(true);
        });
      });
    }

    await page.goto('https://alertsjs.com/');

    // Use the custom handler
    const alertPromise = handleAlert(page);
    await page.click('button:has-text("Alert")');
    const handled = await alertPromise;
    
    expect(handled).toBe(true);
  });

  /**
   * KEY TAKEAWAYS:
   * 
   * 1. TIMING: Set dialog listener BEFORE triggering action
   *    ✓ page.once() or page.on() before click
   *    ✗ Don't set listener after click
   * 
   * 2. DIALOG TYPES: alert, confirm, prompt, beforeunload
   *    - Use dialog.type() to check type
   *    - Different types have different properties
   * 
   * 3. ACCEPTANCE: Use dialog.accept() to click OK
   *    - For prompt: dialog.accept(text) provides input
   *    - For confirm: dialog.accept() = OK, dialog.dismiss() = Cancel
   * 
   * 4. DISMISSAL: Use dialog.dismiss() to click Cancel/X
   *    - Works for confirm and prompt dialogs
   *    - Alert dialogs only have OK (must use accept)
   * 
   * 5. INFORMATION: Extract data using:
   *    - dialog.message() - Get the displayed message
   *    - dialog.inputValue() - Get default text in prompt
   *    - dialog.type() - Get dialog type
   * 
   * 6. LISTENERS: Manage with care
   *    - page.once() for single dialog
   *    - page.on() for multiple dialogs
   *    - page.off() to remove listener
   * 
   * 7. COMMON ISSUES:
   *    - Listener not set before trigger → Dialog not caught
   *    - Using page.once() then expecting 2nd dialog → Only 1st caught
   *    - Forgetting to await dialog handling → Test continues
   *    - Not removing page.on() listener → May affect other tests
   */
});
