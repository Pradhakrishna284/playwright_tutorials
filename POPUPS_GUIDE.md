# Popups - Complete Guide

## Table of Contents
1. [Understanding Popups](#understanding-popups)
2. [Types of Popups](#types-of-popups)
3. [Detecting and Handling Popups](#detecting-and-handling-popups)
4. [Dialog Popups (Alert, Confirm, Prompt)](#dialog-popups)
5. [Window/Tab Popups](#windowtab-popups)
6. [Common Patterns](#common-patterns)
7. [Real-World Examples](#real-world-examples)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

---

## Understanding Popups

### What is a Popup?

In web automation, a **popup** refers to any content that appears on top of the main page content. There are several types:

1. **Dialog Popups** - Alert, confirm, and prompt dialogs
2. **Modal/Non-Modal Windows** - Actual browser windows or tabs
3. **Overlay Popups** - HTML overlays (modals, tooltips, notifications)
4. **Blocked Popups** - Popups blocked by browser

### Popups vs Tabs

| Feature | Popup | Tab |
|---------|-------|-----|
| Trigger | script or user action | link or button |
| Parent window | Can communicate back | Independent |
| Close behavior | Often closes parent | Separate |
| Representation | Page or Dialog object | Page object |
| URL | May be empty initially | Has URL |

---

## Types of Popups

### 1. Browser Dialog Popups (Alert, Confirm, Prompt)

```javascript
// These are browser native dialogs
// Triggered by: alert(), confirm(), prompt()
```

**JavaScript Examples:**
```javascript
alert('This is an alert');           // Displays message, user clicks OK
confirm('Continue?');                // Displays message, returns true/false
prompt('Enter name:');               // Displays input field
```

**In Playwright:**
```javascript
// Listen for dialog
page.on('dialog', async dialog => {
  console.log('Dialog type:', dialog.type());      // 'alert', 'confirm', 'prompt'
  console.log('Dialog message:', dialog.message());
  
  if (dialog.type() === 'alert') {
    await dialog.accept();           // Click OK
  } else if (dialog.type() === 'confirm') {
    await dialog.accept();           // Click OK or dismiss() for Cancel
  } else if (dialog.type() === 'prompt') {
    await dialog.accept('User Input');  // Enter text and click OK
  }
});
```

### 2. Window/Tab Popups

```javascript
// Triggered by: window.open(), target="_blank"
// Represented by: Page object in Playwright
```

**JavaScript Examples:**
```javascript
window.open('https://example.com', '_blank');           // New window
window.open('https://example.com', 'popup');           // Named window
window.open('https://example.com', 'popup', 'width=800,height=600');  // Sized window
```

**In Playwright:**
```javascript
// Listen for new pages/windows
context.on('page', page => {
  console.log('New window opened:', page.url());
});

// Or wait for specific popup
const [popup] = await Promise.all([
  context.waitForEvent('page'),
  page.locator('button').click()
]);
```

### 3. HTML Overlay Popups (Modals)

```html
<!-- Created with HTML/CSS/JavaScript -->
<div class="modal" id="popup">
  <div class="modal-content">
    <h2>Popup Title</h2>
    <p>Popup content here</p>
    <button>Close</button>
  </div>
</div>
```

**In Playwright:**
```javascript
// Wait for modal to appear
await page.locator('.modal').waitFor({ state: 'visible' });

// Interact with modal
await page.locator('.modal button').click();

// Wait for modal to close
await page.locator('.modal').waitFor({ state: 'hidden' });
```

---

## Detecting and Handling Popups

### Method 1: Listen for All Dialogs

```javascript
test('handle dialog popup', async ({ page }) => {
  // Set up listener BEFORE action that triggers dialog
  page.on('dialog', async dialog => {
    console.log('Dialog message:', dialog.message());
    await dialog.accept();
  });
  
  // Action that triggers alert
  await page.goto('https://example.com');
  await page.locator('button[data-action="alert"]').click();
});
```

### Method 2: Wait for Specific Dialog

```javascript
test('wait for dialog and verify', async ({ page }) => {
  // Both approaches work:
  
  // Approach 1: Using waitForEvent
  const dialogPromise = page.waitForEvent('dialog');
  await page.locator('button').click();
  const dialog = await dialogPromise;
  
  // Approach 2: Using Promise.all (more reliable)
  const [dialog] = await Promise.all([
    page.waitForEvent('dialog'),
    page.locator('button').click()
  ]);
  
  // Handle dialog
  expect(dialog.type()).toBe('alert');
  expect(dialog.message()).toContain('Are you sure');
  
  await dialog.accept();
});
```

### Method 3: Listen for New Windows/Pages

```javascript
test('handle window popup', async ({ page, context }) => {
  // Set up listener for new pages
  page.on('popup', async popup => {
    console.log('Popup opened:', popup.url());
    await popup.close();
  });
  
  // Or wait for specific popup
  const [popup] = await Promise.all([
    context.waitForEvent('page'),
    page.locator('a[target="_blank"]').click()
  ]);
  
  await popup.close();
});
```

### Method 4: Listen for HTML Overlay Popups

```javascript
test('handle modal popup', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Wait for modal to appear
  const modal = page.locator('.modal');
  await modal.waitFor({ state: 'visible' });
  
  // Interact with modal
  const title = await modal.locator('h2').textContent();
  console.log('Modal title:', title);
  
  // Close modal
  await modal.locator('.close-btn').click();
  
  // Wait for modal to disappear
  await modal.waitFor({ state: 'hidden' });
});
```

---

## Dialog Popups

### Understanding Dialog Types

```javascript
// ALERT - Just shows message
alert('This is an alert');
// User must click OK to proceed

// CONFIRM - Shows yes/no question
if (confirm('Delete this item?')) {
  // User clicked OK
} else {
  // User clicked Cancel
}

// PROMPT - Gets user input
const name = prompt('Enter your name:');
// Returns string or null
```

### Handling Alert Dialogs

```javascript
test('handle alert dialog', async ({ page }) => {
  // Setup listener
  page.on('dialog', async dialog => {
    expect(dialog.type()).toBe('alert');
    expect(dialog.message()).toBe('Item deleted successfully');
    
    await dialog.accept();  // Click OK
  });
  
  // Trigger alert
  await page.goto('https://example.com');
  await page.locator('button[data-action="delete"]').click();
});
```

### Handling Confirm Dialogs

```javascript
test('handle confirm dialog - user clicks OK', async ({ page }) => {
  page.on('dialog', async dialog => {
    expect(dialog.type()).toBe('confirm');
    
    // User clicks OK
    await dialog.accept();
  });
  
  await page.goto('https://example.com');
  await page.locator('button[data-action="save"]').click();
});

test('handle confirm dialog - user clicks Cancel', async ({ page }) => {
  page.on('dialog', async dialog => {
    expect(dialog.type()).toBe('confirm');
    
    // User clicks Cancel
    await dialog.dismiss();
  });
  
  await page.goto('https://example.com');
  await page.locator('button[data-action="save"]').click();
});
```

### Handling Prompt Dialogs

```javascript
test('handle prompt dialog', async ({ page }) => {
  page.on('dialog', async dialog => {
    expect(dialog.type()).toBe('prompt');
    
    // Enter text and click OK
    await dialog.accept('John Doe');
    
    // Alternative: Click Cancel (returns null)
    // await dialog.dismiss();
  });
  
  await page.goto('https://example.com');
  await page.locator('button[data-action="ask-name"]').click();
});
```

### Getting Dialog Properties

```javascript
test('dialog properties', async ({ page }) => {
  page.on('dialog', async dialog => {
    // Get dialog type
    const type = dialog.type();  // 'alert', 'confirm', or 'prompt'
    
    // Get dialog message
    const message = dialog.message();
    
    // Get dialog page (which page triggered it)
    const dialogPage = dialog.page();
    
    console.log(`Type: ${type}`);
    console.log(`Message: ${message}`);
    
    await dialog.accept();
  });
  
  await page.goto('https://example.com');
  await page.locator('button').click();
});
```

---

## Window/Tab Popups

### Detecting Window Popups

```javascript
test('detect window popup', async ({ page, context }) => {
  // Method 1: Using page.on('popup')
  let popupDetected = false;
  
  page.on('popup', (popup) => {
    popupDetected = true;
    console.log('Popup detected:', popup.url());
  });
  
  await page.goto('https://example.com');
  await page.locator('button[data-action="open-popup"]').click();
  
  // Give it time to detect
  await page.waitForTimeout(1000);
  expect(popupDetected).toBe(true);
});
```

### Waiting for Window Popups

```javascript
test('wait for window popup', async ({ context, page }) => {
  await page.goto('https://example.com');
  
  // Wait for new page and trigger simultaneously
  const [popup] = await Promise.all([
    context.waitForEvent('page'),
    page.locator('button[data-action="open-popup"]').click()
  ]);
  
  expect(popup).toBeTruthy();
  expect(!popup.isClosed()).toBe(true);
  
  await popup.close();
});
```

### Interacting with Window Popups

```javascript
test('interact with popup window', async ({ context, page }) => {
  await page.goto('https://example.com');
  
  const [popup] = await Promise.all([
    context.waitForEvent('page'),
    page.locator('a[target="_blank"]').click()
  ]);
  
  // Wait for popup to load
  await popup.waitForLoadState('networkidle');
  
  // Get popup info
  const title = await popup.title();
  const url = popup.url();
  
  console.log(`Popup: ${title} - ${url}`);
  
  // Interact with popup
  const heading = await popup.locator('h1').textContent();
  expect(heading).toBeTruthy();
  
  // Close popup
  await popup.close();
});
```

### Multiple Popups

```javascript
test('handle multiple popups', async ({ context, page }) => {
  await page.goto('https://example.com');
  
  const popups: any[] = [];
  
  // Setup listener
  context.on('page', (popup) => {
    popups.push(popup);
  });
  
  // Open multiple popups
  for (let i = 0; i < 3; i++) {
    await page.locator('button[data-action="popup"]').click();
    await page.waitForTimeout(500);
  }
  
  // Should have 3 popups
  expect(popups.length).toBe(3);
  
  // Close all
  for (const popup of popups) {
    await popup.close();
  }
});
```

---

## Common Patterns

### Pattern 1: Dialog Before Navigation

```javascript
test('confirm dialog before leaving page', async ({ page }) => {
  await page.goto('https://example.com/form');
  
  // Fill form
  await page.locator('input[name="email"]').fill('test@example.com');
  
  // Setup dialog handler
  page.on('dialog', async dialog => {
    expect(dialog.message()).toContain('You have unsaved changes');
    await dialog.accept();  // OK to leave
  });
  
  // Try to navigate away
  await page.goto('https://example.com/other');
});
```

### Pattern 2: Multiple Dialogs in Sequence

```javascript
test('handle multiple dialogs sequentially', async ({ page }) => {
  let dialogCount = 0;
  
  page.on('dialog', async dialog => {
    dialogCount++;
    await dialog.accept();
  });
  
  await page.goto('https://example.com');
  
  // Trigger first dialog
  await page.locator('button[data-dialog="1"]').click();
  expect(dialogCount).toBe(1);
  
  // Trigger second dialog
  await page.locator('button[data-dialog="2"]').click();
  expect(dialogCount).toBe(2);
});
```

### Pattern 3: Popup Close Confirmation

```javascript
test('popup with close confirmation', async ({ context, page }) => {
  await page.goto('https://example.com');
  
  const [popup] = await Promise.all([
    context.waitForEvent('page'),
    page.locator('button[data-action="open"]').click()
  ]);
  
  // Inside popup, handle close dialog
  popup.on('dialog', async dialog => {
    if (dialog.message().includes('unsaved')) {
      await dialog.accept();  // Confirm close
    }
  });
  
  // Close popup (may trigger dialog)
  await popup.close();
});
```

### Pattern 4: Focus Between Main and Popup

```javascript
test('focus between main window and popup', async ({ context, page }) => {
  await page.goto('https://example.com');
  
  const [popup] = await Promise.all([
    context.waitForEvent('page'),
    page.locator('button[data-action="open"]').click()
  ]);
  
  // Do action in popup
  await popup.locator('button').click();
  
  // Return focus to main page
  const mainTitle = await page.title();
  
  // Verify main page still accessible
  expect(mainTitle).toBeTruthy();
  
  // Go back to popup
  const popupUrl = popup.url();
  expect(popupUrl).toBeTruthy();
  
  await popup.close();
});
```

### Pattern 5: Popup Form Submission

```javascript
test('submit form in popup', async ({ context, page }) => {
  await page.goto('https://example.com');
  
  const [popup] = await Promise.all([
    context.waitForEvent('page'),
    page.locator('button[data-action="form"]').click()
  ]);
  
  await popup.waitForLoadState('networkidle');
  
  // Fill form in popup
  await popup.locator('input[name="name"]').fill('John Doe');
  await popup.locator('input[name="email"]').fill('john@example.com');
  
  // Submit form
  const submitPromise = popup.waitForNavigation();
  await popup.locator('button[type="submit"]').click();
  await submitPromise;
  
  // Verify success
  const message = await popup.locator('.success-message').textContent();
  expect(message).toContain('Success');
  
  await popup.close();
});
```

---

## Real-World Examples

### Example 1: Login Form Opens in Popup

```javascript
test('login in popup window', async ({ context, page }) => {
  await page.goto('https://example.com');
  
  // Click "Login" which opens popup
  const [loginPopup] = await Promise.all([
    context.waitForEvent('page'),
    page.locator('button:has-text("Login")').click()
  ]);
  
  await loginPopup.waitForLoadState('networkidle');
  
  // Fill login form in popup
  await loginPopup.locator('input[type="email"]').fill('user@example.com');
  await loginPopup.locator('input[type="password"]').fill('password123');
  
  // Submit
  const submitPromise = loginPopup.waitForNavigation();
  await loginPopup.locator('button:has-text("Login")').click();
  await submitPromise;
  
  // Verify logged in
  const logoutBtn = await loginPopup.locator('button:has-text("Logout")').isVisible();
  expect(logoutBtn).toBe(true);
  
  await loginPopup.close();
});
```

### Example 2: Confirmation Dialog Before Delete

```javascript
test('delete with confirmation dialog', async ({ page }) => {
  await page.goto('https://example.com/items');
  
  // Setup dialog handler
  page.on('dialog', async dialog => {
    expect(dialog.type()).toBe('confirm');
    expect(dialog.message()).toContain('Delete this item?');
    
    // Confirm deletion
    await dialog.accept();
  });
  
  // Click delete button
  await page.locator('button[data-action="delete"]').click();
  
  // Verify item was deleted (no longer visible)
  const item = page.locator('[data-test="item"]');
  await item.waitFor({ state: 'hidden' });
});
```

### Example 3: PDF Preview in New Window

```javascript
test('open PDF in popup window', async ({ context, page }) => {
  await page.goto('https://example.com/documents');
  
  // Click "Preview PDF"
  const [pdfPopup] = await Promise.all([
    context.waitForEvent('page'),
    page.locator('a[target="_blank"]:has-text("Preview")').click()
  ]);
  
  await pdfPopup.waitForLoadState('networkidle');
  
  // Verify PDF opened (check for PDF content)
  const url = pdfPopup.url();
  expect(url).toContain('.pdf');
  
  await pdfPopup.close();
});
```

### Example 4: Chat Widget Popup

```javascript
test('interact with chat widget popup', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Click to open chat
  await page.locator('[data-test="chat-button"]').click();
  
  // Wait for chat popup to appear
  const chatPopup = page.locator('[data-test="chat-popup"]');
  await chatPopup.waitFor({ state: 'visible' });
  
  // Send message
  await chatPopup.locator('input[placeholder="Type message"]').fill('Hello');
  await chatPopup.locator('button:has-text("Send")').click();
  
  // Verify message sent
  const message = chatPopup.locator('[data-test="message"]:has-text("Hello")');
  await message.waitFor({ state: 'visible' });
  
  // Close chat
  await chatPopup.locator('.close-btn').click();
  await chatPopup.waitFor({ state: 'hidden' });
});
```

### Example 5: Unsaved Changes Warning

```javascript
test('unsaved changes popup warning', async ({ page }) => {
  await page.goto('https://example.com/editor');
  
  // Make changes
  await page.locator('textarea').fill('Modified content');
  
  // Try to navigate away
  page.on('dialog', async dialog => {
    expect(dialog.type()).toBe('confirm');
    expect(dialog.message()).toContain('You have unsaved changes');
    
    // Discard changes
    await dialog.dismiss();
  });
  
  await page.goto('https://example.com/home');
});
```

### Example 6: Share Dialog Popup

```javascript
test('share functionality with popup', async ({ context, page }) => {
  await page.goto('https://example.com/article');
  
  // Click share button
  await page.locator('button[data-action="share"]').click();
  
  // Wait for share options popup to appear
  const sharePopup = page.locator('[data-test="share-options"]');
  await sharePopup.waitFor({ state: 'visible' });
  
  // Click share on Twitter (opens new window)
  const [twitterPopup] = await Promise.all([
    context.waitForEvent('page'),
    sharePopup.locator('a[data-social="twitter"]').click()
  ]);
  
  // Verify Twitter URL
  expect(twitterPopup.url()).toContain('twitter.com');
  
  await twitterPopup.close();
});
```

---

## Best Practices

### ✅ DO

```javascript
// 1. Always set up dialog handler before triggering action
page.on('dialog', async dialog => {
  await dialog.accept();
});

// 2. Use Promise.all for popup detection and trigger
const [popup] = await Promise.all([
  context.waitForEvent('page'),
  page.locator('button').click()
]);

// 3. Wait for popup to load before interacting
const [popup] = await Promise.all([
  context.waitForEvent('page'),
  page.locator('button').click()
]);
await popup.waitForLoadState('networkidle');

// 4. Handle all possible dialog types
page.on('dialog', async dialog => {
  switch (dialog.type()) {
    case 'alert':
      await dialog.accept();
      break;
    case 'confirm':
      await dialog.accept();  // or dismiss()
      break;
    case 'prompt':
      await dialog.accept('user input');
      break;
  }
});

// 5. Close popups properly
try {
  // popup usage
} finally {
  await popup.close();
}

// 6. Verify popup content before interacting
const title = await popup.title();
const url = popup.url();
expect(title).toBeTruthy();
expect(url).toContain('expected-domain');
```

### ❌ DON'T

```javascript
// 1. Don't click before setting up dialog handler
// ❌ DON'T
await page.locator('button').click();
page.on('dialog', async dialog => { ... });

// ✅ DO
page.on('dialog', async dialog => { ... });
await page.locator('button').click();

// 2. Don't assume popup URL is ready immediately
// ❌ DON'T
const [popup] = await Promise.all([
  context.waitForEvent('page'),
  page.locator('button').click()
]);
const url = popup.url();  // May not be final URL

// ✅ DO
const [popup] = await Promise.all([
  context.waitForEvent('page'),
  page.locator('button').click()
]);
await popup.waitForLoadState('networkidle');
const url = popup.url();

// 3. Don't forget to close popups
// ❌ DON'T
const [popup] = await Promise.all([
  context.waitForEvent('page'),
  page.locator('button').click()
]);
// No cleanup

// ✅ DO
try {
  const [popup] = await Promise.all([
    context.waitForEvent('page'),
    page.locator('button').click()
  ]);
  // use popup
} finally {
  await popup.close();
}

// 4. Don't mix up dialog and popup handling
// ❌ DON'T
page.on('dialog', async popup => {  // Wrong - this is dialog, not popup
  await popup.close();
});

// ✅ DO - Dialog handling
page.on('dialog', async dialog => {
  await dialog.accept();  // or dismiss()
});

// ✅ DO - Popup handling
const [popup] = await Promise.all([
  context.waitForEvent('page'),
  page.locator('button').click()
]);
await popup.close();

// 5. Don't ignore error handling
// ❌ DON'T
const [popup] = await Promise.all([
  context.waitForEvent('page'),
  page.locator('button').click()
]);

// ✅ DO
try {
  const [popup] = await Promise.all([
    context.waitForEvent('page'),
    page.locator('button').click()
  ]);
} catch (error) {
  console.error('Popup failed:', error);
}
```

---

## Troubleshooting

### Problem: Dialog Handler Not Triggered

```javascript
// ❌ Wrong - handler set up after click
await page.locator('button').click();
page.on('dialog', async dialog => { ... });

// ✅ Right - handler set up before click
page.on('dialog', async dialog => { ... });
await page.locator('button').click();
```

### Problem: Popup URL is 'about:blank'

```javascript
// ❌ Wrong - accessing URL immediately
const [popup] = await Promise.all([
  context.waitForEvent('page'),
  page.locator('button').click()
]);
console.log(popup.url());  // May be about:blank

// ✅ Right - wait for navigation
const [popup] = await Promise.all([
  context.waitForEvent('page'),
  page.locator('button').click()
]);
await popup.waitForLoadState('networkidle');
console.log(popup.url());  // Final URL
```

### Problem: Popup Closes Too Quickly

```javascript
// ❌ Popup closes before you can interact
const [popup] = await Promise.all([
  context.waitForEvent('page'),
  page.locator('button').click()
]);
// popup closes immediately

// ✅ Solution - don't close it
// Keep reference to popup throughout test
const [popup] = await Promise.all([
  context.waitForEvent('page'),
  page.locator('button').click()
]);

// Use popup for assertions/actions
const content = await popup.textContent('body');
expect(content).toContain('expected text');

// Only close when done
await popup.close();
```

### Problem: Multiple Dialogs Not Handled

```javascript
// ❌ Wrong - only handles first dialog
page.once('dialog', async dialog => {
  await dialog.accept();
});

// ✅ Right - handles all dialogs
page.on('dialog', async dialog => {
  await dialog.accept();
});

// Both triggers will be handled
await page.locator('button1').click();
await page.locator('button2').click();
```

### Problem: Can't Switch Focus Between Popup and Main

```javascript
// ✅ Correct - both windows are independent Page objects
const [popup] = await Promise.all([
  context.waitForEvent('page'),
  page.locator('button').click()
]);

// Action on main page
await page.locator('input').fill('data');

// Action on popup
await popup.locator('button').click();

// Back to main page
await page.locator('.submit').click();

// No explicit focus switching needed
```

---

## Quick Reference

### Handling Dialogs
```javascript
// Listen for all dialogs
page.on('dialog', async dialog => {
  await dialog.accept();  // OK/Yes
  // or
  await dialog.dismiss();  // Cancel/No
});

// Get dialog info
dialog.type()        // 'alert', 'confirm', 'prompt'
dialog.message()     // Dialog text
dialog.page()        // Which page triggered it
```

### Handling Window/Tab Popups
```javascript
// Detect popup
const [popup] = await Promise.all([
  context.waitForEvent('page'),
  page.locator('button').click()
]);

// Popup info
popup.url()          // Popup URL
await popup.title()  // Popup title
popup.isClosed()     // Check if closed

// Cleanup
await popup.close()
```

### Common Dialog Types
```javascript
// Alert - just OK button
await dialog.accept();

// Confirm - OK and Cancel buttons
await dialog.accept();   // OK
await dialog.dismiss();  // Cancel

// Prompt - text input + OK/Cancel
await dialog.accept('input value');
await dialog.dismiss();  // Cancel without input
```

### Modal/Overlay Popups
```javascript
// Wait for modal
const modal = page.locator('.modal');
await modal.waitFor({ state: 'visible' });

// Interact
await modal.locator('button').click();

// Wait for close
await modal.waitFor({ state: 'hidden' });
```

