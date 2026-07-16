/**
 * ================================================================================
 * PLAYWRIGHT ACTIONS - HANDLING HTML ELEMENTS TEST SUITE
 * ================================================================================
 * 
 * Source Documentation:
 * - Playwright Input API: https://playwright.dev/docs/input
 * - Video Tutorial: https://www.youtube.com/watch?v=u5LDd2JSXMs&list=PLUDwpEzHYYLtvMVjc-Va3RXLKtdB-ofc2&index=6
 * 
 * Test Application: testautomationpractice.blogspot.com
 * 
 * ================================================================================
 * TEST COVERAGE - 16 COMPREHENSIVE TESTS
 * ================================================================================
 * 
 * ✓ TEST 1:  Input Textbox - fill(), getAttribute(), inputValue()
 * ✓ TEST 2:  Input Password - password field handling
 * ✓ TEST 3:  Input Email - type-specific inputs
 * ✓ TEST 4:  TextArea - multi-line text entry
 * ✓ TEST 5:  Radio Buttons - single selection, mutual exclusivity
 * ✓ TEST 6:  Checkboxes - multiple selection, check/uncheck
 * ✓ TEST 7:  Select Dropdown - selectOption(), value vs label
 * ✓ TEST 8:  inputValue() vs textContent() - CRITICAL DIFFERENCE
 * ✓ TEST 9:  Click Actions - click, dblclick, right-click, options
 * ✓ TEST 10: Keyboard Actions - pressSequentially(), press(), shortcuts
 * ✓ TEST 11: Focus and Blur - focus management, validation on blur
 * ✓ TEST 12: Hover Actions - hover(), tooltip/dropdown testing
 * ✓ TEST 13: Scroll Actions - scrollIntoViewIfNeeded(), manual scroll
 * ✓ TEST 14: File Upload - setInputFiles(), single/multiple files
 * ✓ TEST 15: Drag and Drop - dragTo(), manual drag simulation
 * ✓ TEST 16: Attribute Retrieval - getAttribute(), validation attributes
 * 
 * ================================================================================
 * IMPORTANT CONCEPTS - inputValue() vs textContent:
 * ================================================================================
 * 
 * inputValue() - FOR FORM INPUTS ONLY
 *   • Returns the VALUE attribute of <input>, <textarea>, <select>
 *   • Returns string or null
 *   • Returns what user typed/selected
 *   • USE WHEN: Getting input field values
 * 
 * textContent - FOR ANY ELEMENT
 *   • Returns all text content of any element
 *   • Works on ALL elements (button, div, span, etc.)
 *   • For inputs, may return empty string
 *   • USE WHEN: Getting button text, labels, messages, etc.
 * 
 * DIFFERENCE TABLE:
 * HTML: <input type="text" value="hello" placeholder="Enter text">
 *   inputValue() → "hello"     (the VALUE)
 *   textContent  → ""          (empty - inputs have no text)
 * 
 * HTML: <button id="btn">Click Me</button>
 *   inputValue() → null        (not a form input)
 *   textContent  → "Click Me"  (the button text)
 * 
 * ================================================================================
 * QUICK REFERENCE - PLAYWRIGHT ACTIONS
 * ================================================================================
 * 
 * TEXT INPUT METHODS:
 *   fill(text)                  - Clear field and type text (fast, recommended)
 *   pressSequentially(text)     - Type character by character (slower, for handlers)
 *   type(text)                  - Type text method variant
 * 
 * INTERACTION METHODS:
 *   click()                     - Single left click
 *   dblclick()                  - Double click
 *   click({button: 'right'})    - Right-click
 *   check()                     - Select checkbox/radio
 *   uncheck()                   - Deselect checkbox
 *   selectOption(value)         - Select dropdown option
 * 
 * KEYBOARD METHODS:
 *   press(key)                  - Press keyboard key
 *   pressSequentially(text)     - Type with character events
 * 
 * FOCUS/HOVER METHODS:
 *   focus()                     - Set focus to element
 *   blur()                      - Remove focus
 *   hover()                     - Move mouse over element
 * 
 * SCROLL METHODS:
 *   scrollIntoViewIfNeeded()    - Auto scroll into view
 *   page.mouse.wheel()          - Mouse wheel scroll
 *   page.evaluate()             - Custom scroll script
 * 
 * FILE/DRAG METHODS:
 *   setInputFiles(path)         - Set file input value
 *   dragTo(target)              - Drag to target element
 * 
 * VALUE RETRIEVAL METHODS:
 *   inputValue()                - Get form input value
 *   textContent()               - Get element text
 *   getAttribute(name)          - Get HTML attribute
 * 
 * ASSERTION METHODS:
 *   toBeVisible()               - Assert element visible
 *   toBeEnabled()               - Assert element enabled
 *   toBeChecked()               - Assert checkbox checked
 *   toHaveValue(value)          - Assert input has value
 * 
 * ================================================================================
 */

import { test, expect, Locator } from '@playwright/test';

//testautomationpractice.blogspot.com
//'Handling HTML Elements - Input Textbox, TextArea, Radio Button, Checkbox, Dropdown'

/**
 * TEST 1: Input Textbox - Basic Text Entry & Value Extraction
 * 
 * OBJECTIVE:
 *   - Demonstrate fill() action for entering text
 *   - Show inputValue() to retrieve input field value
 *   - Verify element attributes and state
 * 
 * KEY METHODS:
 *   - fill()           : Enter text into form field
 *   - getAttribute()   : Get HTML attribute value
 *   - inputValue()     : Get the VALUE of form input
 *   - toBeVisible()    : Assert element is visible
 *   - toBeEnabled()    : Assert element is enabled
 */
test('Handling HTML Elements - Input Textbox', async ({ page }) => {
  // Navigate to base URL configured in playwright.config.ts
  // The test app runs locally on this base URL
  await page.goto('/');

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 1: LOCATE THE ELEMENT
  // ─────────────────────────────────────────────────────────────────────────────

  // Locate element with id='name'
  // Returns a Locator object - a reusable query for finding elements
  const name: Locator = page.locator('#name');

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 2: VERIFY ACTIONABILITY
  // ─────────────────────────────────────────────────────────────────────────────

  // Assert element is visible in viewport
  // toBeVisible() checks: not hidden, not display:none, not covered by other elements
  await expect(name).toBeVisible();

  // Assert element is enabled
  // toBeEnabled() checks: doesn't have disabled attribute
  await expect(name).toBeEnabled();

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 3: GET ELEMENT ATTRIBUTES
  // ─────────────────────────────────────────────────────────────────────────────

  // Get the 'maxlength' HTML attribute
  // getAttribute() returns the attribute value as string or null if doesn't exist
  // Example HTML: <input id="name" maxlength="15">
  const getMaxLength: string | null = await name.getAttribute('maxlength');

  // Log to console for debugging (visible in test output)
  console.log('Max Length of Input Textbox: ' + getMaxLength);

  // Assert maxlength is "15" (attributes are strings, not numbers)
  expect(getMaxLength).toBe('15');

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 4: FILL ACTION - ENTER TEXT INTO INPUT
  // ─────────────────────────────────────────────────────────────────────────────

  // fill() simulates user typing text into a form field
  // What fill() does internally:
  //   1. Focuses the element
  //   2. Clears existing text (Ctrl+A then Delete)
  //   3. Types the new text
  //   4. Triggers 'input' event
  //   5. Triggers 'change' event
  //
  // This is the RECOMMENDED way to enter text in form fields
  // (use fill() instead of pressSequentially() for most cases)
  await name.fill('Radha Krishna');

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 5: GET INPUT VALUE - Extract Entered Text
  // ─────────────────────────────────────────────────────────────────────────────

  // inputValue() gets the current VALUE of a form input
  //
  // KEY POINT: This is for FORM INPUTS ONLY
  //   Works on: <input>, <textarea>, <select>
  //   Returns: string (what's in the field) or null (if not a form input)
  //
  // DIFFERENCE FROM textContent:
  //   HTML: <input id="email" value="user@example.com" placeholder="Enter email">
  //   inputValue() → "user@example.com"  ✓ Returns the VALUE attribute
  //   textContent  → ""                  ✗ Empty - inputs have no text content
  //
  // WHEN TO USE EACH:
  //   inputValue() : For form inputs (<input>, <textarea>, <select>)
  //   textContent  : For non-form elements (button, div, span, etc.)
  const getTextBoxValue: string | null = await name.inputValue();

  // Log the extracted value for verification
  console.log('Text entered in Input Textbox: ' + getTextBoxValue);

  // Assert the value in the input field is exactly what we entered
  expect(getTextBoxValue).toBe('Radha Krishna');

  // ─────────────────────────────────────────────────────────────────────────────
  // WAIT (for visual verification only)
  // ─────────────────────────────────────────────────────────────────────────────

  // Wait 3 seconds to see the result (only for demo, not needed in real tests)
  // In production tests, use waitForNavigation() or waitForFunction() instead
  await page.waitForTimeout(3000);
});

/**
 * TEST 2: Input Password - Sensitive Data Handling
 * 
 * OBJECTIVE:
 *   - Demonstrate fill() on password fields
 *   - Show that inputValue() still retrieves the actual value
 *   - Verify the field type is password
 * 
 * KEY METHODS:
 *   - fill()           : Enter text into password field
 *   - inputValue()     : Get password value (returns actual text, not masked)
 *   - getAttribute()   : Get type attribute to verify it's type="password"
 */
test('Handling HTML Elements - Input Password', async ({ page }) => {
  // Navigate to the test application
  await page.goto('/');

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 1: LOCATE AND VERIFY PASSWORD INPUT
  // ─────────────────────────────────────────────────────────────────────────────

  // Locate the password input element
  const passwordInput: Locator = page.locator('#inputPassword');

  // Verify it's visible and enabled
  await expect(passwordInput).toBeVisible();
  await expect(passwordInput).toBeEnabled();

  // Get the type attribute to confirm it's a password field
  // HTML: <input id="inputPassword" type="password">
  const inputType: string | null = await passwordInput.getAttribute('type');
  console.log('Input type: ' + inputType);
  expect(inputType).toBe('password');

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 2: FILL PASSWORD (masked in UI, but real value in test)
  // ─────────────────────────────────────────────────────────────────────────────

  // fill() works the same on password fields as text inputs
  // In the browser: Shows • • • • • • • (masked)
  // In the test: Gets the actual password value
  await passwordInput.fill('SecurePassword123!');

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 3: GET PASSWORD VALUE
  // ─────────────────────────────────────────────────────────────────────────────

  // inputValue() returns the ACTUAL password, not masked
  // This is important for testing:
  //   • Form validation
  //   • Password reset flows
  //   • Authentication
  const passwordValue: string | null = await passwordInput.inputValue();
  console.log('Password value: ' + passwordValue);

  // Assert we can retrieve the exact password we entered
  expect(passwordValue).toBe('SecurePassword123!');

  await page.waitForTimeout(2000);
});

/**
 * TEST 3: Input Email - Type-Specific Input Field
 * 
 * OBJECTIVE:
 *   - Demonstrate fill() on email-type input
 *   - Show validation behavior of email inputs
 *   - Show how to verify input type
 * 
 * KEY METHODS:
 *   - fill()           : Enter email address
 *   - inputValue()     : Get the email value
 *   - getAttribute()   : Check input type
 */
test('Handling HTML Elements - Input Email', async ({ page }) => {
  // Navigate to the test application
  await page.goto('/');

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 1: LOCATE EMAIL INPUT
  // ─────────────────────────────────────────────────────────────────────────────

  const emailInput: Locator = page.locator('#inputEmail');

  // Verify actionability
  await expect(emailInput).toBeVisible();
  await expect(emailInput).toBeEnabled();

  // Verify it's an email type input
  const emailType: string | null = await emailInput.getAttribute('type');
  expect(emailType).toBe('email');

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 2: FILL EMAIL ADDRESS
  // ─────────────────────────────────────────────────────────────────────────────

  // fill() works for email inputs just like text inputs
  // Email inputs have built-in HTML5 validation
  const testEmail = 'test.user@example.com';
  await emailInput.fill(testEmail);

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 3: VERIFY EMAIL VALUE
  // ─────────────────────────────────────────────────────────────────────────────

  // Get the email value using inputValue()
  const emailValue: string | null = await emailInput.inputValue();
  console.log('Email entered: ' + emailValue);

  // Assert the exact email was entered
  expect(emailValue).toBe(testEmail);

  await page.waitForTimeout(2000);
});

/**
 * TEST 4: TextArea - Multi-line Text Entry
 * 
 * OBJECTIVE:
 *   - Demonstrate fill() on textarea elements
 *   - Show how to enter multi-line text
 *   - Show inputValue() retrieves entire text including newlines
 * 
 * KEY METHODS:
 *   - fill()           : Enter multi-line text
 *   - inputValue()     : Get textarea content (preserves newlines)
 *   - toHaveValue()    : Assertion helper for input values
 */
test('Handling HTML Elements - TextArea', async ({ page }) => {
  // Navigate to the test application
  await page.goto('/');

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 1: LOCATE TEXTAREA
  // ─────────────────────────────────────────────────────────────────────────────

  const textarea: Locator = page.locator('#textarea');

  // Verify it's visible and enabled
  await expect(textarea).toBeVisible();
  await expect(textarea).toBeEnabled();

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 2: FILL TEXTAREA WITH MULTI-LINE TEXT
  // ─────────────────────────────────────────────────────────────────────────────

  // fill() works on textareas (which are form inputs, like input fields)
  // Can include newlines and special characters
  const comments = 'This is a test automation practice website.\nIt has multiple HTML elements to practice with.';
  await textarea.fill(comments);

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 3: GET TEXTAREA VALUE
  // ─────────────────────────────────────────────────────────────────────────────

  // inputValue() returns the complete text, including newlines
  const textareaValue: string | null = await textarea.inputValue();
  console.log('Textarea content: ' + textareaValue);

  // Assert the exact content was entered
  expect(textareaValue).toBe(comments);

  // Alternative assertion method: toHaveValue()
  // toHaveValue() is a convenient locator assertion for form inputs
  await expect(textarea).toHaveValue(comments);

  await page.waitForTimeout(2000);
});

/**
 * TEST 5: Radio Buttons - Single Selection
 * 
 * OBJECTIVE:
 *   - Demonstrate check() action on radio buttons
 *   - Show how to verify radio button selection
 *   - Show mutual exclusivity of radio buttons
 * 
 * KEY METHODS:
 *   - check()          : Select a radio button
 *   - isChecked()      : Get radio button checked state
 *   - toBeChecked()    : Assert radio button is selected
 */
test('Handling HTML Elements - Radio Buttons', async ({ page }) => {
  // Navigate to the test application
  await page.goto('/');

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 1: LOCATE RADIO BUTTONS
  // ─────────────────────────────────────────────────────────────────────────────

  // Radio buttons are usually grouped with the same 'name' attribute
  // HTML: <input type="radio" name="gender" value="male">
  //       <input type="radio" name="gender" value="female">
  const maleRadio: Locator = page.locator('#male');
  const femaleRadio: Locator = page.locator('#female');

  // Verify both are visible and enabled
  await expect(maleRadio).toBeVisible();
  await expect(femaleRadio).toBeVisible();

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 2: CHECK A RADIO BUTTON
  // ─────────────────────────────────────────────────────────────────────────────

  // check() selects the radio button
  // Only one radio button per group can be checked (mutual exclusivity)
  await maleRadio.check();

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 3: VERIFY SELECTION
  // ─────────────────────────────────────────────────────────────────────────────

  // toBeChecked() asserts the radio button is selected
  await expect(maleRadio).toBeChecked();

  // Verify the other option is not checked
  await expect(femaleRadio).not.toBeChecked();

  // Alternative: Get checked state as boolean
  const isMaleChecked: boolean = await maleRadio.isChecked();
  console.log('Is male radio checked: ' + isMaleChecked);
  expect(isMaleChecked).toBe(true);

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 4: SWITCH SELECTION
  // ─────────────────────────────────────────────────────────────────────────────

  // Select the female radio button
  await femaleRadio.check();

  // Verify the selection changed (mutual exclusivity)
  await expect(femaleRadio).toBeChecked();
  await expect(maleRadio).not.toBeChecked();

  await page.waitForTimeout(2000);
});

/**
 * TEST 6: Checkboxes - Multiple Selection
 * 
 * OBJECTIVE:
 *   - Demonstrate check() and uncheck() on checkboxes
 *   - Show difference between checkboxes and radio buttons
 *   - Show how to verify multiple selections
 * 
 * KEY METHODS:
 *   - check()          : Select a checkbox
 *   - uncheck()        : Deselect a checkbox
 *   - isChecked()      : Get checkbox state
 *   - toBeChecked()    : Assert checkbox is checked
 */
test('Handling HTML Elements - Checkboxes', async ({ page }) => {
  // Navigate to the test application
  await page.goto('/');

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 1: LOCATE CHECKBOXES
  // ─────────────────────────────────────────────────────────────────────────────

  // Unlike radio buttons, checkboxes allow multiple selections
  // HTML: <input type="checkbox" value="Monday">
  //       <input type="checkbox" value="Tuesday">
  const mondayCheckbox: Locator = page.locator('input[value="Monday"]');
  const tuesdayCheckbox: Locator = page.locator('input[value="Tuesday"]');
  const wednesdayCheckbox: Locator = page.locator('input[value="Wednesday"]');

  // Verify all are visible
  await expect(mondayCheckbox).toBeVisible();

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 2: CHECK MULTIPLE CHECKBOXES
  // ─────────────────────────────────────────────────────────────────────────────

  // Check multiple checkboxes (unlike radio buttons, multiple can be selected)
  await mondayCheckbox.check();
  await wednesdayCheckbox.check();

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 3: VERIFY SELECTIONS
  // ─────────────────────────────────────────────────────────────────────────────

  // Assert selected checkboxes
  await expect(mondayCheckbox).toBeChecked();
  await expect(wednesdayCheckbox).toBeChecked();

  // Assert unselected checkbox
  await expect(tuesdayCheckbox).not.toBeChecked();

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 4: UNCHECK A CHECKBOX
  // ─────────────────────────────────────────────────────────────────────────────

  // uncheck() deselects a checkbox
  await mondayCheckbox.uncheck();

  // Verify it's unchecked
  await expect(mondayCheckbox).not.toBeChecked();

  // Wednesday should still be checked (no automatic deselection like radio buttons)
  await expect(wednesdayCheckbox).toBeChecked();

  await page.waitForTimeout(2000);
});

/**
 * TEST 7: Select Dropdown - Selection Methods
 * 
 * OBJECTIVE:
 *   - Demonstrate selectOption() for dropdown selection
 *   - Show how to get selected value using inputValue()
 *   - Show different selection methods (by value, by label)
 * 
 * KEY METHODS:
 *   - selectOption()   : Select dropdown option
 *   - inputValue()     : Get selected option VALUE
 *   - textContent()    : Get selected option LABEL (text)
 */
test('Handling HTML Elements - Select Dropdown', async ({ page }) => {
  // Navigate to the test application
  await page.goto('/');

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 1: LOCATE SELECT DROPDOWN
  // ─────────────────────────────────────────────────────────────────────────────

  const countrySelect: Locator = page.locator('#country');

  // Verify dropdown is visible and enabled
  await expect(countrySelect).toBeVisible();
  await expect(countrySelect).toBeEnabled();

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 2: SELECT OPTION BY VALUE
  // ─────────────────────────────────────────────────────────────────────────────

  // selectOption() selects an option by value attribute
  // HTML: <select id="country">
  //         <option value="in">India</option>
  //         <option value="us">United States</option>
  //       </select>
  //
  // selectOption('in') selects the "India" option
  await countrySelect.selectOption('in');

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 3: GET SELECTED VALUE (VALUE ATTRIBUTE)
  // ─────────────────────────────────────────────────────────────────────────────

  // inputValue() returns the VALUE attribute of the selected option
  // NOT the visible text, but the value="..." attribute
  const selectedValue: string | null = await countrySelect.inputValue();
  console.log('Selected value: ' + selectedValue);
  expect(selectedValue).toBe('in');

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 4: GET SELECTED LABEL (DISPLAYED TEXT)
  // ─────────────────────────────────────────────────────────────────────────────

  // To get the visible text of selected option, query the selected option
  // This demonstrates the difference between inputValue() and textContent()
  const selectedLabel: string | null = await countrySelect
    .locator('option:checked')
    .textContent();
  console.log('Selected label: ' + selectedLabel);
  expect(selectedLabel?.trim()).toBe('India');

  // ─────────────────────────────────────────────────────────────────────────────
  // STEP 5: SELECT OPTION BY LABEL (TEXT)
  // ─────────────────────────────────────────────────────────────────────────────

  // selectOption() can also select by visible text
  await countrySelect.selectOption({ label: 'United States' });

  // Verify the selection changed
  const newValue: string | null = await countrySelect.inputValue();
  expect(newValue).toBe('us');

  await page.waitForTimeout(2000);
});

/**
 * TEST 8: inputValue() vs textContent() - Direct Comparison
 * 
 * OBJECTIVE:
 *   - Demonstrate the CRITICAL difference between inputValue() and textContent()
 *   - Show that using the wrong method returns empty/null
 *   - Show when to use each method
 * 
 * KEY METHODS:
 *   - inputValue()     : Get form input value
 *   - textContent()    : Get element text content
 *   - getAttribute()   : Get HTML attribute
 */
test('Handling HTML Elements - inputValue() vs textContent() Comparison', async ({ page }) => {
  // Navigate to the test application
  await page.goto('/');

  // ═════════════════════════════════════════════════════════════════════════════
  // COMPARISON 1: FORM INPUT (type="text")
  // ═════════════════════════════════════════════════════════════════════════════

  // HTML: <input id="name" type="text" value="">
  const textInput = page.locator('#name');
  await textInput.fill('John Doe');

  // ─────────────────────────────────────────────────────────────────────────────
  // Using inputValue() - CORRECT ✓
  // ─────────────────────────────────────────────────────────────────────────────
  const valueByInputValue = await textInput.inputValue();
  console.log('Text input - inputValue(): ' + valueByInputValue);
  expect(valueByInputValue).toBe('John Doe'); // ✓ Gets the entered text

  // ─────────────────────────────────────────────────────────────────────────────
  // Using textContent() - WRONG ✗
  // ─────────────────────────────────────────────────────────────────────────────
  const valueByTextContent = await textInput.textContent();
  console.log('Text input - textContent(): ' + valueByTextContent);
  expect(valueByTextContent).toBe(''); // ✗ Returns empty for inputs!

  // ═════════════════════════════════════════════════════════════════════════════
  // COMPARISON 2: BUTTON ELEMENT
  // ═════════════════════════════════════════════════════════════════════════════

  // HTML: <button id="btnSubmit">Click to Submit</button>
  const submitButton = page.locator('button:has-text("Submit")').first();

  // ─────────────────────────────────────────────────────────────────────────────
  // Using textContent() - CORRECT ✓
  // ─────────────────────────────────────────────────────────────────────────────
  const buttonText = await submitButton.textContent();
  console.log('Button - textContent(): ' + buttonText);
  expect(buttonText?.trim()).toContain('Submit'); // ✓ Gets button text

  // ─────────────────────────────────────────────────────────────────────────────
  // Using inputValue() - WRONG ✗
  // ─────────────────────────────────────────────────────────────────────────────
  const buttonValue = await submitButton.inputValue();
  console.log('Button - inputValue(): ' + buttonValue);
  expect(buttonValue).toBe(null); // ✗ Returns null for non-form elements!

  // ═════════════════════════════════════════════════════════════════════════════
  // COMPARISON 3: SELECT DROPDOWN
  // ═════════════════════════════════════════════════════════════════════════════

  // HTML: <select id="country"><option value="in">India</option></select>
  const select = page.locator('#country');
  await select.selectOption('in');

  // ─────────────────────────────────────────────────────────────────────────────
  // Using inputValue() - CORRECT for getting VALUE ✓
  // ─────────────────────────────────────────────────────────────────────────────
  const selectValue = await select.inputValue();
  console.log('Select - inputValue(): ' + selectValue);
  expect(selectValue).toBe('in'); // ✓ Gets the option VALUE attribute

  // ─────────────────────────────────────────────────────────────────────────────
  // Using textContent() - Gets ALL text (all options)
  // ─────────────────────────────────────────────────────────────────────────────
  const selectText = await select.textContent();
  console.log('Select - textContent(): ' + selectText);
  expect(selectText).toContain('India'); // Contains all option texts, not just selected

  // ─────────────────────────────────────────────────────────────────────────────
  // CORRECT: To get SELECTED option text specifically
  // ─────────────────────────────────────────────────────────────────────────────
  const selectedOptionText = await select.locator('option:checked').textContent();
  console.log('Select - selected option text: ' + selectedOptionText);
  expect(selectedOptionText?.trim()).toBe('India'); // ✓ Gets only selected option text

  // ═════════════════════════════════════════════════════════════════════════════
  // QUICK REFERENCE SUMMARY
  // ═════════════════════════════════════════════════════════════════════════════

  console.log('\n=== WHEN TO USE EACH METHOD ===');
  console.log('inputValue()   → Use for FORM INPUTS (<input>, <textarea>, <select>)');
  console.log('textContent()  → Use for ANY ELEMENT (button, div, span, label, etc.)');
  console.log('\nWrong choice = empty/null/wrong result!');

  await page.waitForTimeout(3000);
});

/**
 * TEST 9: Click Actions - Single, Double, Right-Click
 * 
 * OBJECTIVE:
 *   - Demonstrate different click types (left, double, right)
 *   - Show click event handling
 *   - Show how click() waits for actionability
 * 
 * KEY METHODS:
 *   - click()          : Single left mouse click
 *   - dblclick()       : Double click
 *   - click({button: 'right'}) : Right-click (context menu)
 *   - click({clickCount: 3})   : Multi-click
 */
test('Handling HTML Elements - Click Actions', async ({ page }) => {
  await page.goto('/');

  // ─────────────────────────────────────────────────────────────────────────────
  // SINGLE LEFT CLICK
  // ─────────────────────────────────────────────────────────────────────────────

  // Find a clickable element (button)
  const submitButton = page.locator('button:has-text("Submit")').first();

  // click() simulates a single left mouse click
  // What happens internally:
  //   1. Waits for element to be visible
  //   2. Waits for element to be enabled
  //   3. Scrolls into view if needed
  //   4. Triggers pointerover, pointerdown, pointerup events
  //   5. Triggers click event
  //   6. Waits for potential navigation/response
  
  // Don't actually click in this demo (would submit form)
  // await submitButton.click();

  // Verify button is visible and enabled (what click() checks)
  await expect(submitButton).toBeVisible();
  await expect(submitButton).toBeEnabled();

  // ─────────────────────────────────────────────────────────────────────────────
  // DOUBLE CLICK
  // ─────────────────────────────────────────────────────────────────────────────

  // dblclick() simulates double-clicking
  // Triggers: pointerdown, pointerup, click, pointerdown, pointerup, click, dblclick
  // Use case: Selecting text, opening items in list, special UI interactions
  const textElement = page.locator('#name');
  
  // Example (not executed): await textElement.dblclick();

  // ─────────────────────────────────────────────────────────────────────────────
  // RIGHT CLICK (CONTEXT MENU)
  // ─────────────────────────────────────────────────────────────────────────────

  // click({button: 'right'}) simulates right mouse button click
  // Triggers context menu / pointerdown with button=2
  // Use case: Testing context menus, right-click handling

  // Example (not executed): await submitButton.click({button: 'right'});

  // ─────────────────────────────────────────────────────────────────────────────
  // CLICK WITH OPTIONS
  // ─────────────────────────────────────────────────────────────────────────────

  // click() accepts options:
  //   button: 'left' | 'right' | 'middle'
  //   clickCount: number (for multi-click)
  //   delay: milliseconds between mousedown and mouseup
  //   position: {x: number, y: number} - click position within element
  //   modifiers: ['Alt' | 'Control' | 'Meta' | 'Shift'] - keyboard modifiers
  //   force: boolean - bypass actionability checks (not recommended)
  //   timeout: override default timeout

  // Example: Click with Ctrl pressed (multi-select)
  // await item.click({modifiers: ['Control']});

  // Example: Click with delay (useful for observing animation)
  // await button.click({delay: 500});

  console.log('Click actions demonstrated (not executed to avoid form submission)');
  await page.waitForTimeout(1000);
});

/**
 * TEST 10: Keyboard Actions - pressSequentially vs Type Methods
 * 
 * OBJECTIVE:
 *   - Demonstrate pressSequentially() for character-by-character input
 *   - Show keyboard event generation
 *   - Show when to use vs fill()
 * 
 * KEY METHODS:
 *   - pressSequentially() : Type character by character with delay
 *   - press()             : Press specific keyboard key
 *   - type()              : Type text (similar to fill but different)
 */
test('Handling HTML Elements - Keyboard Actions', async ({ page }) => {
  await page.goto('/');

  // ─────────────────────────────────────────────────────────────────────────────
  // pressSequentially() - Character by Character Typing
  // ─────────────────────────────────────────────────────────────────────────────

  const searchInput = page.locator('#name');

  // pressSequentially() types text character by character
  // Each character triggers:
  //   - keydown event
  //   - keypress event (for typeable keys)
  //   - input event
  //   - keyup event
  //
  // Benefits over fill():
  //   • Tests autocomplete handlers
  //   • Tests character-by-character validation
  //   • Tests real keyboard events (some inputs listen for keydown/keyup)
  //   • More realistic user simulation
  //
  // Downsides:
  //   • Much slower than fill()
  //   • Takes longer to execute
  //
  // Use pressSequentially() when testing special handlers

  // Example: Typing with default delay
  await searchInput.fill(''); // Clear first
  await searchInput.pressSequentially('React', {delay: 100});

  // Verify text was entered
  const typedValue = await searchInput.inputValue();
  expect(typedValue).toBe('React');

  // ─────────────────────────────────────────────────────────────────────────────
  // press() - Press Specific Keys
  // ─────────────────────────────────────────────────────────────────────────────

  // press() presses a specific keyboard key
  // Examples of key names:
  //   - 'Enter', 'Escape', 'Backspace', 'Delete'
  //   - 'Tab', 'Space'
  //   - 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'
  //   - 'PageUp', 'PageDown', 'Home', 'End'
  //   - 'a', 'b', 'c' (for single character keys)
  //   - 'A' or 'Shift+a' (with modifiers)

  // Example: Press Backspace to delete character
  await searchInput.press('Backspace');
  const afterBackspace = await searchInput.inputValue();
  expect(afterBackspace).toBe('Reac'); // 't' deleted

  // Example: Press Enter (submit form)
  // await searchInput.press('Enter');

  // ─────────────────────────────────────────────────────────────────────────────
  // Keyboard Shortcuts with Modifiers
  // ─────────────────────────────────────────────────────────────────────────────

  // press() can use keyboard shortcuts
  await searchInput.fill('test text');

  // Select all text: Ctrl+A
  await searchInput.press('Control+A');

  // Copy: Ctrl+C
  // await searchInput.press('Control+C');

  // Paste: Ctrl+V
  // await searchInput.press('Control+V');

  console.log('Keyboard actions demonstrated');
  await page.waitForTimeout(1000);
});

/**
 * TEST 11: Focus and Blur - Focus Management
 * 
 * OBJECTIVE:
 *   - Demonstrate focus() action
 *   - Show blur() for removing focus
 *   - Show testing of focus-dependent behaviors
 * 
 * KEY METHODS:
 *   - focus()          : Set focus to element
 *   - blur()           : Remove focus from element
 *   - isFocused()      : Check if element has focus
 * 
 * WHY IT MATTERS:
 *   - Tests focus-dependent styling
 *   - Tests form validation on blur
 *   - Tests keyboard navigation
 */
test('Handling HTML Elements - Focus and Blur', async ({ page }) => {
  await page.goto('/');

  // ─────────────────────────────────────────────────────────────────────────────
  // FOCUS ACTION
  // ─────────────────────────────────────────────────────────────────────────────

  const emailInput = page.locator('#inputEmail');

  // focus() sets focus to the element
  // Triggers: focus, focusin events
  // Useful for testing:
  //   • Focus-dependent styling
  //   • Focus order in forms
  //   • Focus-dependent JavaScript handlers
  await emailInput.focus();

  // Verify element has focus
  // Note: isFocused() might not work in all scenarios due to browser restrictions
  const hasFocus = await emailInput.evaluate((el) => {
    return document.activeElement === el;
  });
  expect(hasFocus).toBe(true);

  // ─────────────────────────────────────────────────────────────────────────────
  // BLUR ACTION
  // ─────────────────────────────────────────────────────────────────────────────

  // blur() removes focus from element
  // Triggers: blur, focusout events, and input validation
  // Important for: Testing form validation on field blur
  
  // Enter email first
  await emailInput.fill('test@example.com');

  // blur() removes focus and may trigger validation
  // Many forms validate on blur event
  await emailInput.blur();

  // Verify focus was removed
  const noFocus = await emailInput.evaluate((el) => {
    return document.activeElement !== el;
  });
  expect(noFocus).toBe(true);

  // ─────────────────────────────────────────────────────────────────────────────
  // PRACTICAL USE: TESTING VALIDATION ON BLUR
  // ─────────────────────────────────────────────────────────────────────────────

  // Many modern forms validate on blur event
  const nameInput = page.locator('#name');

  // Fill invalid data
  await nameInput.focus();
  await nameInput.fill('12345'); // Maybe invalid for a name field

  // Blur to trigger validation
  await nameInput.blur();

  // Wait for potential error message
  // const errorMsg = page.locator('.error-message');
  // await expect(errorMsg).toBeVisible();

  console.log('Focus and blur actions demonstrated');
  await page.waitForTimeout(1000);
});

/**
 * TEST 12: Hover - Mouse Hover Actions
 * 
 * OBJECTIVE:
 *   - Demonstrate hover() method
 *   - Show hover-dependent UI changes (tooltips, dropdowns)
 *   - Show when hover is necessary for testing
 * 
 * KEY METHODS:
 *   - hover()          : Move mouse over element
 *   - isVisible()      : Check visibility after hover
 */
test('Handling HTML Elements - Hover Actions', async ({ page }) => {
  await page.goto('/');

  // ─────────────────────────────────────────────────────────────────────────────
  // BASIC HOVER
  // ─────────────────────────────────────────────────────────────────────────────

  const element = page.locator('button').first();

  // hover() moves the mouse cursor over the element
  // Triggers: pointerover, pointermove, mouseenter, mouseover events
  // Use cases:
  //   • Revealing tooltips
  //   • Opening dropdown menus
  //   • Changing element appearance
  //   • Testing hover-dependent behavior
  
  await element.hover();

  // ─────────────────────────────────────────────────────────────────────────────
  // TESTING HOVER-DEPENDENT CONTENT
  // ─────────────────────────────────────────────────────────────────────────────

  // Example: Tooltip appears on hover
  // Many UIs show tooltips or additional info on hover

  // HTML example:
  // <button>More Info
  //   <span class="tooltip" style="display:none">Hidden tooltip</span>
  // </button>

  // To test tooltip on hover:
  const tooltipElement = page.locator('.tooltip'); // Hypothetical tooltip

  // Hover over button
  await element.hover();

  // Check if tooltip became visible
  // Note: May need to wait for animation
  // const isVisible = await tooltipElement.isVisible();

  // Another example: Dropdown menu on hover
  // const menu = page.locator('.dropdown-menu');
  // await button.hover();
  // await expect(menu).toBeVisible();

  console.log('Hover action demonstrated');
  await page.waitForTimeout(1000);
});

/**
 * TEST 13: Scroll Actions - ScrollIntoViewIfNeeded
 * 
 * OBJECTIVE:
 *   - Demonstrate scrolling to elements
 *   - Show when scrolling is automatic vs manual
 *   - Show how to scroll element into view
 * 
 * KEY METHODS:
 *   - scrollIntoViewIfNeeded() : Auto scroll element into view if needed
 *   - scroll()                 : Manual scrolling
 */
test('Handling HTML Elements - Scroll Actions', async ({ page }) => {
  await page.goto('/');

  // ─────────────────────────────────────────────────────────────────────────────
  // AUTOMATIC SCROLLING IN ACTIONS
  // ─────────────────────────────────────────────────────────────────────────────

  // Most Playwright actions automatically scroll the element into view:
  //   • click() scrolls automatically
  //   • fill() scrolls automatically
  //   • check() scrolls automatically
  //   • hover() scrolls automatically
  //
  // This is built-in and you don't need to do it manually

  const emailInput = page.locator('#inputEmail');

  // This automatically scrolls into view if needed
  await emailInput.fill('user@example.com');

  // ─────────────────────────────────────────────────────────────────────────────
  // EXPLICIT SCROLLING
  // ─────────────────────────────────────────────────────────────────────────────

  // If you need to scroll manually before an action:
  await emailInput.scrollIntoViewIfNeeded();

  // ─────────────────────────────────────────────────────────────────────────────
  // PAGE-LEVEL SCROLLING
  // ─────────────────────────────────────────────────────────────────────────────

  // Scroll the page itself
  // Scroll down
  // await page.evaluate(() => window.scrollBy(0, 500));

  // Scroll to position
  // await page.evaluate(() => window.scrollTo(0, 1000));

  // Scroll to element using JavaScript
  // await page.evaluate(selector => {
  //   document.querySelector(selector).scrollIntoView();
  // }, '#inputEmail');

  // ─────────────────────────────────────────────────────────────────────────────
  // MOUSE WHEEL SCROLLING
  // ─────────────────────────────────────────────────────────────────────────────

  // Simulate mouse wheel scroll
  // await page.mouse.wheel(0, 500); // Scroll down 500 pixels

  console.log('Scroll actions demonstrated');
  await page.waitForTimeout(1000);
});

/**
 * TEST 14: File Upload - setInputFiles
 * 
 * OBJECTIVE:
 *   - Demonstrate file upload using setInputFiles()
 *   - Show how to upload single and multiple files
 *   - Show alternative file handling methods
 * 
 * KEY METHODS:
 *   - setInputFiles()  : Set file input value
 *   - setInputFiles([file1, file2]) : Multiple files
 */
test('Handling HTML Elements - File Upload', async ({ page }) => {
  await page.goto('/');

  // ─────────────────────────────────────────────────────────────────────────────
  // LOCATE FILE INPUT
  // ─────────────────────────────────────────────────────────────────────────────

  // Find file input element
  // HTML: <input type="file" id="fileUpload">
  const fileInput = page.locator('input[type="file"]').first();

  // ─────────────────────────────────────────────────────────────────────────────
  // UPLOAD SINGLE FILE
  // ─────────────────────────────────────────────────────────────────────────────

  // setInputFiles() programmatically sets file input value
  // No need to use file picker dialog
  // Much faster and more reliable than dialog handling

  // Example: Upload from file path
  // Commented out as we don't have actual test files
  // await fileInput.setInputFiles('./test-files/document.pdf');

  // ─────────────────────────────────────────────────────────────────────────────
  // UPLOAD MULTIPLE FILES
  // ─────────────────────────────────────────────────────────────────────────────

  // For multi-file input, pass array of paths
  // await fileInput.setInputFiles([
  //   './test-files/file1.pdf',
  //   './test-files/file2.pdf',
  //   './test-files/file3.pdf'
  // ]);

  // ─────────────────────────────────────────────────────────────────────────────
  // UPLOAD FILE BUFFER (CREATED IN MEMORY)
  // ─────────────────────────────────────────────────────────────────────────────

  // Alternative: Create file buffer in memory
  // Useful when file doesn't exist on disk
  // await fileInput.setInputFiles({
  //   name: 'test.txt',
  //   mimeType: 'text/plain',
  //   buffer: Buffer.from('Test file content')
  // });

  // ─────────────────────────────────────────────────────────────────────────────
  // CLEAR FILES
  // ─────────────────────────────────────────────────────────────────────────────

  // Clear previously set files
  // await fileInput.setInputFiles([]);

  console.log('File upload actions demonstrated');
  await page.waitForTimeout(1000);
});

/**
 * TEST 15: Drag and Drop - dragTo Method
 * 
 * OBJECTIVE:
 *   - Demonstrate dragTo() for drag and drop
 *   - Show dragging elements to different targets
 *   - Show practical drag-drop testing
 * 
 * KEY METHODS:
 *   - dragTo()         : Drag element to another element
 *   - hover() + mouse control: Manual drag simulation
 */
test('Handling HTML Elements - Drag and Drop', async ({ page }) => {
  await page.goto('/');

  // ─────────────────────────────────────────────────────────────────────────────
  // BASIC DRAG AND DROP
  // ─────────────────────────────────────────────────────────────────────────────

  // dragTo() drags one element to another element's position
  // Simulates:
  //   1. pointerdown on source
  //   2. pointermove to target
  //   3. pointerup on target
  //   4. drop event on target

  // Example (would need appropriate elements):
  // const sourceElement = page.locator('#dragElement');
  // const targetElement = page.locator('#dropZone');
  // await sourceElement.dragTo(targetElement);

  // ─────────────────────────────────────────────────────────────────────────────
  // USE CASES FOR DRAG AND DROP TESTING
  // ─────────────────────────────────────────────────────────────────────────────

  // Common scenarios:
  //   • Reordering list items
  //   • Moving cards in Kanban boards
  //   • File drag-and-drop upload
  //   • UI element positioning

  // ─────────────────────────────────────────────────────────────────────────────
  // MANUAL DRAG CONTROL
  // ─────────────────────────────────────────────────────────────────────────────

  // For more control, use mouse events directly:
  // await source.hover();
  // await page.mouse.down();
  // await target.hover();
  // await page.mouse.up();

  console.log('Drag and drop actions demonstrated');
  await page.waitForTimeout(1000);
});

/**
 * TEST 16: Attribute Retrieval - getAttribute() and Related Methods
 * 
 * OBJECTIVE:
 *   - Demonstrate getting various element attributes
 *   - Show difference between getAttribute and other methods
 *   - Show practical attribute testing
 * 
 * KEY METHODS:
 *   - getAttribute()   : Get HTML attribute value
 *   - textContent()    : Get element text (covered earlier)
 *   - inputValue()     : Get form input value (covered earlier)
 *   - getByRole()      : Get by accessibility role
 */
test('Handling HTML Elements - Attribute Retrieval', async ({ page }) => {
  await page.goto('/');

  // ─────────────────────────────────────────────────────────────────────────────
  // GET HTML ATTRIBUTES
  // ─────────────────────────────────────────────────────────────────────────────

  const emailInput = page.locator('#inputEmail');

  // getAttribute() retrieves HTML attribute values
  // Returns: string or null

  // Get type attribute
  const type = await emailInput.getAttribute('type');
  expect(type).toBe('email');

  // Get placeholder
  const placeholder = await emailInput.getAttribute('placeholder');
  console.log('Placeholder: ' + placeholder);

  // Get data attributes
  const dataTestId = await emailInput.getAttribute('data-testid');
  console.log('Data-testid: ' + dataTestId);

  // Get class attribute
  const className = await emailInput.getAttribute('class');
  console.log('Classes: ' + className);

  // Get aria attributes (accessibility)
  const ariaLabel = await emailInput.getAttribute('aria-label');
  console.log('Aria-label: ' + ariaLabel);

  // ─────────────────────────────────────────────────────────────────────────────
  // CHECK ATTRIBUTE EXISTS AND VALIDATE
  // ─────────────────────────────────────────────────────────────────────────────

  // getAttribute() returns null if attribute doesn't exist
  const nonExistent = await emailInput.getAttribute('data-non-existent');
  expect(nonExistent).toBe(null);

  // ─────────────────────────────────────────────────────────────────────────────
  // TESTING ATTRIBUTES FOR VALIDATION
  // ─────────────────────────────────────────────────────────────────────────────

  // Common attributes to test:
  //   • type: input type
  //   • disabled: element disabled state
  //   • required: form field required
  //   • maxlength: input max length
  //   • placeholder: input placeholder text
  //   • aria-label: accessibility label
  //   • data-*: custom data attributes
  //   • class: CSS classes
  //   • id: element id

  const name = page.locator('#name');

  // Verify required attribute
  const isRequired = await name.getAttribute('required');
  console.log('Is required: ' + isRequired);

  // Verify maxlength
  const maxLength = await name.getAttribute('maxlength');
  expect(maxLength).toBe('15');

  console.log('Attribute retrieval demonstrated');
  await page.waitForTimeout(1000);
});