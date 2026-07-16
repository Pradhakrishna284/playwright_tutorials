/*
================================================================================
PLAYWRIGHT BUILT-IN LOCATORS - COMPREHENSIVE GUIDE
================================================================================

WHAT IS A LOCATOR?
------------------
A locator identifies elements on a web page. Playwright locators are:
- LAZY: They don't find elements until an action is performed
- AUTO-WAITING: Playwright waits for elements to be actionable
- AUTO-RETRY: Automatically retries if element is not ready
- UP-TO-DATE: Every action locates the element fresh from the DOM

DOM (Document Object Model):
- API for HTML and XML documents
- Represents the page structure as a tree
- Each node represents a part of the document

WHEN TO USE AWAIT:
------------------
✓ USE await when performing ACTIONS on locators:
  - await locator.click()
  - await locator.fill()
  - await locator.check()
  - await expect(locator).toBeVisible()

✗ DON'T use await when just CREATING locators:
  - const locator = page.getByRole('button') // NO await needed
  - Locators are lazy - they don't search DOM until action is performed

WHY await is needed:
- Actions are asynchronous operations
- Playwright needs to wait for element to be ready
- Returns a Promise that must be resolved

================================================================================
BUILT-IN LOCATORS (In Order of Priority)
================================================================================

1. page.getByRole()       - Locate by ARIA role/accessibility (MOST RECOMMENDED)
2. page.getByLabel()      - Locate form controls by label text
3. page.getByPlaceholder() - Locate inputs by placeholder
4. page.getByText()       - Locate by text content
5. page.getByAltText()    - Locate images by alt text
6. page.getByTitle()      - Locate by title attribute
7. page.getByTestId()     - Locate by data-testid (MOST RESILIENT)
8. page.locator()         - CSS/XPath (LAST RESORT)

================================================================================
*/

import {test, expect, Locator} from '@playwright/test';

/*
================================================================================
1. page.getByRole() - MOST RECOMMENDED LOCATOR
================================================================================

WHEN TO USE:
✓ Primary choice for ALL interactive elements
✓ Ensures accessibility compliance
✓ Reflects how users and screen readers perceive the page
✓ Most resilient to UI changes

WHY USE THIS LOCATOR:
- Closest to how users interact with the page
- Follows W3C ARIA specifications
- Tests actual accessibility of your application
- Role values are stable across text changes

WHEN TO USE await:
✓ await page.getByRole('button').click()     - Performing action
✓ await expect(page.getByRole('heading')).toBeVisible() - Assertion
✗ const locator = page.getByRole('button')   - Just creating locator (no await)

EXPLANATION:
- Locates elements by their ARIA role (button, link, textbox, checkbox, etc.)
- Can filter by name (accessible name from label, text, or aria-label)
- Common roles: button, link, textbox, heading, checkbox, radio, table, row, cell

SYNTAX:
page.getByRole(role, options?)
  - role: ARIA role string ('button', 'link', 'heading', etc.)
  - options: { name, exact, checked, disabled, expanded, level, pressed, selected }
*/
test('page.getByRole() - Locate by accessibility role', async ({page}) => {
    await page.goto('https://demo.nopcommerce.com');
    
    // Example 1: Locate link by role and name
    // When: Use for navigation links
    // Why await: click() is an action that returns a Promise
    await page.getByRole('link', { name: 'Register' }).click();
    
    // Example 2: Verify heading is visible
    // When: Checking page structure/content
    // Why await: expect() assertion needs to resolve
    await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();
    
    // Example 3: Locate radio button by role
    // When: Working with form controls
    const genderMale: Locator = page.getByRole('radio', { name: 'Male' });
    await genderMale.check(); // Why await: check() is asynchronous action
    
    // Example 4: Locate textbox (input field)
    // When: Filling out forms
    await page.getByRole('textbox', { name: 'First name:' }).fill('John');
    
    // Example 5: Locate button by partial name match
    // When: Button text might vary slightly
    await page.getByRole('button', { name: /register/i }).click();
});

/*
================================================================================
2. page.getByLabel() - BEST FOR FORM CONTROLS
================================================================================

WHEN TO USE:
✓ Locating form fields (input, select, textarea) with labels
✓ Any input associated with a <label> element
✓ Form validation and data entry

WHY USE THIS LOCATOR:
- Mirrors how users find form fields (by reading labels)
- Ensures proper label-input association (accessibility)
- Label text is more stable than placeholder text
- Works even if input is hidden in custom components

WHEN TO USE await:
✓ await page.getByLabel('Email').fill('test@example.com') - Action needed
✗ const emailInput = page.getByLabel('Email')             - No action yet

EXPLANATION:
- Locates form controls by their associated <label> element text
- HTML associates labels with inputs via 'for' attribute or wrapping
- Supports nested labels and aria-labelledby

HTML EXAMPLES:
<label for="email">Email Address</label>
<input id="email" type="email" />

OR

<label>
  Email Address
  <input type="email" />
</label>
*/
test('page.getByLabel() - Locate form fields by label', async ({page}) => {
    await page.goto('https://demo.nopcommerce.com/register');
    
    // Example 1: Locate input by exact label text
    // When: Form has clear label text
    // Why await: fill() is an asynchronous action
    await page.getByLabel('First name:').fill('John');
    await page.getByLabel('Last name:').fill('Doe');
    
    // Example 2: Locate with partial match
    // When: Label text might have extra characters
    await page.getByLabel('Email:', { exact: false }).fill('john.doe@example.com');
    
    // Example 3: Locate dropdown/select
    // When: Working with select elements
    const dayDropdown: Locator = page.getByLabel('Date of birth:').first();
    await dayDropdown.selectOption('15');
    
    // Example 4: Locate checkbox by label
    // When: User needs to check/uncheck options
    await page.getByLabel('Newsletter:').check();
});

/*
================================================================================
3. page.getByPlaceholder() - FOR INPUTS WITHOUT LABELS
================================================================================

WHEN TO USE:
✓ Form elements without visible labels
✓ Search boxes and input fields
✓ Modern UI designs that use placeholders instead of labels

WHY USE THIS LOCATOR:
- Some forms use placeholder instead of labels
- Common in search boxes and minimal designs
- Placeholder text is visible to users
- Fallback when labels are not available

WHEN TO USE await:
✓ await page.getByPlaceholder('Search...').fill('laptop') - Action
✗ const searchBox = page.getByPlaceholder('Search...')    - No action

EXPLANATION:
- Locates input elements by their placeholder attribute
- Placeholder is the hint text shown when input is empty
- Only works with elements that support placeholder (input, textarea)

HTML EXAMPLE:
<input type="text" placeholder="Search store" />
*/
test('page.getByPlaceholder() - Locate by placeholder text', async ({page}) => {
    await page.goto('https://demo.nopcommerce.com');
    
    // Example 1: Locate search box by placeholder
    // When: Search box uses placeholder instead of label
    // Why await: fill() is an action that modifies the input
    const searchBox: Locator = page.getByPlaceholder('Search store');
    await searchBox.fill('laptop');
    
    // Example 2: Press Enter to submit search
    // When: Need to trigger search without clicking button
    // Why await: press() is an asynchronous keyboard action
    await searchBox.press('Enter');
    
    // Example 3: Verify placeholder exists (accessibility check)
    // When: Testing that placeholder text is helpful
    await expect(page.getByPlaceholder('Search store')).toBeVisible();
    
    // Example 4: Use regex for flexible matching
    // When: Placeholder text might vary slightly
    await page.getByPlaceholder(/search/i).fill('macbook');
});

/*
================================================================================
4. page.getByText() - LOCATE BY VISIBLE TEXT
================================================================================

WHEN TO USE:
✓ Non-interactive elements (div, span, p)
✓ Verifying text content is displayed
✓ Filtering items in a list
✗ AVOID for interactive elements - use getByRole instead

WHY USE THIS LOCATOR:
- Text is what users see and read
- Simple and intuitive for content verification
- Good for finding specific content on page
- Works with substring, exact, or regex matching

WHEN TO USE await:
✓ await page.getByText('Welcome').click()           - If element is clickable
✓ await expect(page.getByText('Success')).toBeVisible() - Assertion
✗ const welcomeText = page.getByText('Welcome')     - Just creating locator

EXPLANATION:
- Finds elements by their text content
- Normalizes whitespace (multiple spaces → one space)
- Ignores leading/trailing whitespace
- Supports substring, exact match, and regular expressions

MATCHING OPTIONS:
- Default: Substring match (case-sensitive)
- { exact: true }: Exact match
- /regex/i: Regular expression (i = case-insensitive)
*/
test('page.getByText() - Locate by text content', async ({page}) => {
    await page.goto('https://demo.nopcommerce.com');
    
    // Example 1: Substring match (default)
    // When: Finding text within larger content
    // Why await: expect() needs to resolve the assertion
    await expect(page.getByText('Welcome to our store')).toBeVisible();
    
    // Example 2: Exact match
    // When: Need precise text matching
    const exactText: Locator = page.getByText('Featured products', { exact: true });
    await expect(exactText).toBeVisible();
    
    // Example 3: Regular expression for flexible matching
    // When: Text might vary slightly (case, numbers, etc.)
    await expect(page.getByText(/welcome/i)).toBeVisible(); // Case-insensitive
    
    // Example 4: Click on text element (if clickable)
    // When: Element has click handler but no role
    // await page.getByText('Click here').click();
    
    // Example 5: Get text from element
    // When: Need to extract and verify specific text
    const pageTitle = page.getByText('nopCommerce demo store');
    const titleText = await pageTitle.textContent(); // Why await: textContent() is async
    console.log('Page title:', titleText);
});

/*
================================================================================
4B. textContent() vs allTextContents() - DIFFERENCE AND USAGE
================================================================================

TEXTCONTENT() - Gets text from SINGLE element
- Returns: string | null
- Use when: You need text from ONE specific element
- Speed: Faster - retrieves only one element's text
- Pattern: await locator.textContent()
- Example: await page.getByRole('button').first().textContent()

ALLTEXTCONTENTS() - Gets text from ALL matching elements
- Returns: Promise<string[]> (array of strings)
- Use when: You need text from MULTIPLE elements at once
- Speed: Efficient for batch retrieval (better than looping textContent())
- Pattern: await locator.allTextContents()
- Example: await page.getByRole('button').allTextContents() // all buttons' text

KEY DIFFERENCES:
1. SCOPE: textContent() = 1 element, allTextContents() = all elements
2. RETURN TYPE: textContent() = string, allTextContents() = string[]
3. ELEMENT SELECTION: Use .first(), .nth() with textContent(); none needed with allTextContents()
4. USE CASE: textContent() = specific element, allTextContents() = verify all texts at once

WHEN TO USE:
✓ textContent(): Getting text from first element or specific nth element
✓ allTextContents(): Verifying entire list of texts, comparing multiple values
✗ textContent(): When you need all texts (use allTextContents() instead)
✗ allTextContents(): When you only need one element's text (use textContent())
*/

test('textContent() vs allTextContents() - Extract and verify text', async ({page}) => {
    await page.goto('https://demo.nopcommerce.com');
    
    // Example 1: Using allTextContents() - Get text from ALL matching elements
    // WHEN: Need to verify all menu items or all list items at once
    // WHY: Efficient batch retrieval; returns complete array in one call
    const menuItems = page.locator("//ul[@class='top-menu']/li");
    const allMenuTexts: string[] = await menuItems.allTextContents();
    console.log('All Menu Items:', allMenuTexts);
    expect(allMenuTexts.length).toBeGreaterThan(0);
    
    // Example 2: Using textContent() with first() - Get text from FIRST element only
    // WHEN: You only need the first item's text
    // WHY: More focused than allTextContents() when you want one specific element
    const firstMenuText = await menuItems.first().textContent();
    console.log('First Menu Item:', firstMenuText);
    expect(firstMenuText).not.toBeNull();
    
    // Example 3: Using textContent() with nth() - Get text from SPECIFIC element by index
    // WHEN: You need text from a specific position (2nd, 3rd, etc.)
    // WHY: Precise targeting without retrieving all texts
    const secondMenuText = await menuItems.nth(1).textContent();
    console.log('Second Menu Item:', secondMenuText);
    
    // Example 4: Comparing results
    // allTextContents() returns [text1, text2, text3...]
    // textContent() returns "text1" (single string)
    expect(allMenuTexts[0]).toBe(firstMenuText?.trim());
    expect(allMenuTexts[1]).toBe(secondMenuText?.trim());
    
    // Example 5: Use allTextContents() for assertions on complete list
    // WHEN: Verifying all expected items are present
    expect(allMenuTexts).toContain('Computers');
    expect(allMenuTexts.length).toBe(7);
});

/*
================================================================================
5. XPATH text() vs normalize-space() - WHITESPACE HANDLING IN TEXT MATCHING
================================================================================

OVERVIEW:
Both are XPath functions for text matching, but they handle whitespace differently.

text() FUNCTION - Exact text matching (preserves all whitespace)
- Returns: Text exactly as it appears in HTML (spaces, tabs, newlines included)
- Matching: Requires EXACT match including whitespace
- Performance: Faster (no text processing)
- Use case: Clean HTML with consistent formatting
- Example: <button>Click</button> matches //button[text()="Click"]
- Problem: <button>  Click  </button> does NOT match //button[text()="Click"]

normalize-space() FUNCTION - Smart text matching (removes extra whitespace)
- Returns: Text with whitespace normalized (leading/trailing removed, internal collapsed)
- Matching: Matches despite extra spaces, tabs, line breaks
- Performance: Slightly slower (processes whitespace)
- Use case: Real-world messy HTML with inconsistent formatting
- Example: <button>  Click  </button> matches //button[normalize-space()="Click"]
- Advantage: Handles poorly formatted HTML gracefully

WHITESPACE TRANSFORMATION:
Input:      "  Hello    World  \n  \t"
text():     "  Hello    World  \n  \t"  (unchanged)
normalize-space(): "Hello World"         (cleaned)

COMPARISON TABLE:
┌─────────────────┬──────────────────┬──────────────────────┐
│ Aspect          │ text()           │ normalize-space()    │
├─────────────────┼──────────────────┼──────────────────────┤
│ Whitespace      │ Preserved        │ Removed/Collapsed    │
│ Matching        │ Strict           │ Flexible             │
│ Performance     │ Faster           │ Slightly slower      │
│ Real-world HTML │ Often fails      │ Usually works        │
│ Edge cases      │ Extra spaces fail│ Handles gracefully   │
└─────────────────┴──────────────────┴──────────────────────┘

WHEN TO USE:
✓ text(): Web apps with perfect HTML formatting, unit testing
✓ normalize-space(): Production websites, automated testing, user acceptance testing
✗ text(): When HTML has indentation or extra whitespace
✗ normalize-space(): When whitespace differences matter (rare)
*/

test('text() vs normalize-space() - XPath whitespace handling', async ({page}) => {
    await page.goto('https://demo.nopcommerce.com');
    
    // Example 1: Using text() - Exact text matching
    // WHEN: You know the HTML is clean and consistently formatted
    // WHY: Faster, works when text has no extra whitespace
    const registerLink = page.locator('//a[text()="Register"]');
    const registerCount1 = await registerLink.count();
    console.log(`Elements found with text()="Register": ${registerCount1}`);
    
    // Example 2: Using normalize-space() - Whitespace-tolerant matching
    // WHEN: HTML might have extra spaces, tabs, line breaks from formatting
    // WHY: More robust for real-world HTML with indentation
    const registerLinkNorm = page.locator('//a[normalize-space()="Register"]');
    const registerCount2 = await registerLinkNorm.count();
    console.log(`Elements found with normalize-space()="Register": ${registerCount2}`);
    expect(registerCount2).toBeGreaterThanOrEqual(registerCount1);
    
    // Example 3: Using contains() with text()
    // WHEN: Searching for substring without worrying about exact whitespace
    // WHY: More flexible than exact text() match
    const loginElements1 = page.locator('//a[contains(text(), "Log")]');
    const loginCount1 = await loginElements1.count();
    console.log(`Elements found with contains(text(), "Log"): ${loginCount1}`);
    
    // Example 4: Using contains() with normalize-space()
    // WHEN: Searching for substring while being whitespace-tolerant
    // WHY: Most flexible - handles both substring and whitespace issues
    const loginElements2 = page.locator('//a[contains(normalize-space(), "Log")]');
    const loginCount2 = await loginElements2.count();
    console.log(`Elements found with contains(normalize-space(), "Log"): ${loginCount2}`);
    expect(loginCount2).toBeGreaterThanOrEqual(loginCount1);
    
    // Example 5: Real-world scenario - menu items with varying formatting
    // Some menu items might have extra whitespace from HTML indentation
    const menuItems1 = page.locator("//ul[@class='top-menu']/li[text()]");
    const cleanMenuItems = page.locator("//ul[@class='top-menu']/li[normalize-space()]");
    
    const cleanCount = await cleanMenuItems.count();
    console.log(`Menu items found with normalize-space(): ${cleanCount}`);
    
    // Example 6: Practical recommendation for test automation
    // For automated testing, normalize-space() is SAFER because:
    // 1. HTML often has indentation from formatters
    // 2. Line breaks can be introduced by preprocessors
    // 3. normalize-space() is more resilient to these changes
    const buttons = page.locator('//button[normalize-space()="Continue"]');
    if (await buttons.count() > 0) {
        console.log('Found button using normalize-space() - recommended approach');
        await buttons.first().click();
    }
    
    // Example 7: Comparing starts-with() with both approaches
    // starts-with(text()) - strict whitespace
    const startsWith1 = page.locator('//a[starts-with(text(), "Reg")]');
    const startCount1 = await startsWith1.count();
    
    // starts-with(normalize-space()) - whitespace-tolerant
    const startsWith2 = page.locator('//a[starts-with(normalize-space(), "Reg")]');
    const startCount2 = await startsWith2.count();
    
    console.log(`starts-with(text(), "Reg"): ${startCount1}`);
    console.log(`starts-with(normalize-space(), "Reg"): ${startCount2}`);
    expect(startCount2).toBeGreaterThanOrEqual(startCount1);
    
    // BEST PRACTICE SUMMARY:
    // ✓ Use normalize-space() by default for production automation
    // ✓ Use text() only when you're sure HTML is clean
    // ✓ Combine with contains() for maximum flexibility
    // ✓ Remember: normalize-space() handles real-world HTML better
});

/*
================================================================================
5. page.getByAltText() - FOR IMAGES AND GRAPHICS
================================================================================

WHEN TO USE:
✓ Image elements (<img>)
✓ Area elements (<area>)
✓ Any element with alt attribute
✓ Accessibility testing for images

WHY USE THIS LOCATOR:
- Alt text is required for accessibility
- Describes image content for screen readers
- More semantic than CSS selectors
- Tests that images have proper descriptions

WHEN TO USE await:
✓ await page.getByAltText('Logo').click()             - If image is clickable
✓ await expect(page.getByAltText('Logo')).toBeVisible() - Verification
✗ const logo = page.getByAltText('Logo')              - Just creating locator

EXPLANATION:
- Locates elements by their alt attribute
- Alt text provides text alternative for images
- Essential for accessibility (screen readers read alt text)
- Used primarily for <img> elements but works with any element with alt

HTML EXAMPLE:
<img src="logo.png" alt="Company Logo" />
*/
test('page.getByAltText() - Locate images by alt text', async ({page}) => {
    await page.goto('https://demo.nopcommerce.com');
    
    // Example 1: Locate logo image by alt text
    // When: Testing logo visibility or clicking logo
    // Why await: expect() is an assertion that needs to resolve
    const imageLogo: Locator = page.getByAltText('nopCommerce demo store');
    await expect(imageLogo).toBeVisible();
    
    // Example 2: Click on clickable image (logo link)
    // When: Logo acts as home page link
    // Why await: click() is an asynchronous action
    await imageLogo.click();
    
    // Example 3: Verify image is loaded
    // When: Ensuring images loaded correctly
    const productImage = page.getByAltText(/picture of/i).first();
    await expect(productImage).toHaveAttribute('src', /.+\.jpg/);
    
    // Example 4: Get image attributes
    // When: Need to validate image properties
    const logoSrc = await imageLogo.getAttribute('src');
    console.log('Logo source:', logoSrc);
    
    // Example 5: Accessibility check - all images should have alt text
    // When: Testing accessibility compliance
    const images = page.locator('img');
    const imageCount = await images.count();
    console.log(`Total images on page: ${imageCount}`);
    // In real tests, verify each has alt attribute
});

/*
================================================================================
6. page.getByTitle() - LOCATE BY TITLE ATTRIBUTE
================================================================================

WHEN TO USE:
✓ Elements with title attributes
✓ Tooltips or informational elements
✓ Icons with title text
✓ When element has no other identifying text

WHY USE THIS LOCATOR:
- Title attribute provides additional information
- Shows as tooltip on hover
- Useful when element lacks visible text
- Common in icon-only buttons and links

WHEN TO USE await:
✓ await page.getByTitle('Settings').click()        - Action on element
✓ await expect(page.getByTitle('Info')).toBeVisible() - Verification
✗ const settingsBtn = page.getByTitle('Settings')  - Just creating locator

EXPLANATION:
- Locates elements by title attribute
- Title shows as tooltip when hovering over element
- Good for icon buttons that have no visible text
- Ensures tooltips provide useful information

HTML EXAMPLE:
<button title="Close dialog">
  <svg>...</svg>  <!-- Icon, no text -->
</button>
*/
test('page.getByTitle() - Locate by title attribute', async ({page}) => {
    await page.goto('https://demo.nopcommerce.com');
    
    // Example 1: Locate element by title
    // When: Element uses title for description
    // Why await: expect() assertion needs to resolve
    const titleElement: Locator = page.getByTitle('Show details for nopCommerce').first();
    await expect(titleElement).toBeVisible();
    
    // Example 2: Click icon button with title
    // When: Icon-only button uses title for accessibility
    // await page.getByTitle('Settings').click();
    
    // Example 3: Verify title text matches expected
    // When: Testing tooltip content
    await expect(page.getByTitle(/show details/i)).toHaveCount(1);
    
    // Example 4: Hover to show tooltip
    // When: Testing tooltip appears on hover
    // await page.getByTitle('Help').hover();
    
    // Note: Title is often used for:
    // - Icon-only buttons
    // - Abbreviated text
    // - Additional context
    // - Accessibility tooltips
});

/*
================================================================================
7. page.getByTestId() - MOST RESILIENT FOR TEST AUTOMATION
================================================================================

WHEN TO USE:
✓ When role or text values are important but may change
✓ When you can't locate by role or text
✓ For stable test automation
✓ Elements that change frequently (translations, A/B testing)
✗ NOT user-facing - prefer role/text when possible

WHY USE THIS LOCATOR:
- Most resilient to UI changes
- Survives text changes (translations, content updates)
- Survives role/structure changes
- Explicit contract between dev and test teams
- Custom attribute won't conflict with application logic

WHEN TO USE await:
✓ await page.getByTestId('submit-btn').click()       - Action
✓ await expect(page.getByTestId('error')).toBeVisible() - Assertion
✗ const submitBtn = page.getByTestId('submit-btn')   - No action needed

EXPLANATION:
- Locates by data-testid attribute (configurable)
- Dedicated attribute for testing (not for production functionality)
- Most stable locator strategy
- Requires adding test IDs to your HTML

HTML EXAMPLE:
<button data-testid="checkout-button">Proceed to Checkout</button>

CONFIGURATION (playwright.config.ts):
export default defineConfig({
  use: {
    testIdAttribute: 'data-testid'  // Default
    // or use custom: 'data-pw', 'data-test', 'data-qa', etc.
  }
});
*/
test('page.getByTestId() - Locate by test ID (most resilient)', async ({page}) => {
    // Note: This example assumes the site has data-testid attributes
    // In real projects, developers add these attributes specifically for testing
    
    await page.goto('https://demo.nopcommerce.com');
    
    // Example 1: Typical usage with test IDs
    // When: Element text/structure might change
    // Why await: click() is an asynchronous action
    // await page.getByTestId('search-button').click();
    
    // Example 2: Form submission
    // When: Button text is translated or changes
    // await page.getByTestId('login-form').getByTestId('submit').click();
    
    // Example 3: Verify error message
    // When: Error text changes but test should remain stable
    // await expect(page.getByTestId('error-message')).toBeVisible();
    
    // Example 4: Complex components
    // When: Component structure is complex
    // const productCard = page.getByTestId('product-123');
    // await productCard.getByTestId('add-to-cart').click();
    
    // BEST PRACTICES:
    // ✓ Use descriptive IDs: 'submit-login' not 'btn1'
    // ✓ Use kebab-case: 'shopping-cart' not 'shoppingCart'
    // ✓ Make IDs unique within context
    // ✓ Document why test ID is needed (vs role/text)
    // ✗ Don't overuse - prefer role/text when stable
    
    console.log('Test IDs are most resilient but should be used sparingly');
    console.log('Prefer getByRole and getByLabel for accessibility benefits');
});

/*
================================================================================
8. page.locator() - CSS/XPATH SELECTORS (LAST RESORT)
================================================================================

WHEN TO USE:
✓ Only as last resort when other methods don't work
✓ Selecting by CSS class when unavoidable
✓ Complex DOM queries
✗ Try to combine with other methods if possible

WHY AVOID THIS LOCATOR:
- Tied to DOM structure (fragile)
- Breaks easily when HTML changes
- Long selector chains are unstable
- Not user-facing (doesn't reflect user experience)
- Poor accessibility testing

WHEN TO USE await:
✓ await page.locator('.submit-btn').click()          - Action
✓ await expect(page.locator('#error')).toBeVisible() - Assertion
✗ const btn = page.locator('button')                 - No action

EXPLANATION:
- Uses CSS selectors or XPath
- Most flexible but least stable
- Should be last choice after all other locators
- Playwright auto-detects CSS vs XPath

CSS EXAMPLES:
- .classname
- #id
- element[attribute='value']
- parent > child
- element:nth-child(n)

XPATH EXAMPLES:
- //tag[@attribute='value']
- //tag[contains(text(), 'text')]
*/
test('page.locator() - CSS/XPath selectors (use as last resort)', async ({page}) => {
    await page.goto('https://demo.nopcommerce.com');
    
    // Example 1: CSS class selector
    // When: Element has unique class, no better option
    // Why await: click() is asynchronous
    await page.locator('.search-box-button').click();
    
    // Example 2: ID selector
    // When: Element has unique ID
    await expect(page.locator('#small-searchterms')).toBeVisible();
    
    // Example 3: Attribute selector
    // When: Selecting by specific attribute value
    const searchInput = page.locator('input[name="q"]');
    await searchInput.fill('laptop');
    
    // Example 4: Combining selectors
    // When: Need more specificity
    await page.locator('div.search-box input[type="text"]').fill('computer');
    
    // Example 5: nth-child (FRAGILE - avoid when possible)
    // When: No other option (but very fragile)
    // await page.locator('.product-item:nth-child(1)').click();
    
    // Example 6: XPath (even more fragile)
    // When: Complex DOM traversal needed
    // await page.locator('//input[@placeholder="Search store"]').fill('phone');
    
    // WHY THESE ARE BAD:
    // ❌ page.locator('#tsf > div:nth-child(2) > div.A8SBwf > div.RNNXgb')
    //    - Breaks if any parent element changes
    //    - Not readable or maintainable
    //    - No accessibility testing
    
    // BETTER ALTERNATIVES:
    // ✓ page.getByRole('textbox', { name: 'Search' })
    // ✓ page.getByPlaceholder('Search store')
    // ✓ page.getByLabel('Search')
    
    console.log('CSS/XPath locators should be last resort');
    console.log('Always try getByRole, getByLabel, or getByText first');
});

/*
================================================================================
COMPARISON: ALL LOCATORS TOGETHER
================================================================================
*/
test('Complete example - All locators in action', async ({page}) => {
    await page.goto('https://demo.nopcommerce.com/register');
    
    // 1. Role - Best for interactive elements
    await page.getByRole('link', { name: 'Register' }).click();
    await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();
    
    // 2. Label - Best for form fields
    await page.getByLabel('First name:').fill('John');
    await page.getByLabel('Last name:').fill('Doe');
    
    // 3. Placeholder - When no label available
    await page.getByPlaceholder('Search store').fill('laptop');
    
    // 4. Text - For non-interactive content
    await expect(page.getByText('Personal details')).toBeVisible();
    
    // 5. Alt Text - For images
    await expect(page.getByAltText('nopCommerce demo store')).toBeVisible();
    
    // 6. Title - For tooltips/additional info
    // await expect(page.getByTitle('Show details')).toBeVisible();
    
    // 7. Test ID - Most resilient (when added)
    // await page.getByTestId('register-form').isVisible();
    
    // 8. Locator - Last resort
    await page.locator('#gender-male').check();
    
    console.log('✅ All 8 built-in locators demonstrated!');
});

/*
================================================================================
KEY TAKEAWAYS
================================================================================

1. PRIORITY ORDER (Use in this order):
   1st: getByRole()       - Most recommended, tests accessibility
   2nd: getByLabel()      - Best for forms
   3rd: getByPlaceholder() - When labels not available
   4th: getByText()       - For non-interactive content
   5th: getByAltText()    - For images
   6th: getByTitle()      - For tooltips
   7th: getByTestId()     - Most resilient, but not user-facing
   8th: locator()         - Last resort only

2. WHEN TO USE await:
   ✓ Use await for ACTIONS: click(), fill(), check(), press(), etc.
   ✓ Use await for ASSERTIONS: expect(...).toBeVisible()
   ✓ Use await for GETTERS: textContent(), getAttribute(), count()
   ✗ DON'T use await when creating locators (they're lazy)

3. WHY LOCATORS ARE LAZY:
   - Locator doesn't search DOM until action is performed
   - This allows Playwright to auto-wait and retry
   - Element is found fresh every time (handles dynamic content)

4. BEST PRACTICES:
   ✓ Prefer user-facing locators (role, label, text)
   ✓ Test accessibility by using getByRole
   ✓ Use test IDs sparingly (when text/structure unstable)
   ✗ Avoid CSS/XPath unless absolutely necessary
   ✓ Write tests that reflect user behavior

5. AUTO-WAITING:
   - Playwright automatically waits for elements to be:
     • Attached to DOM
     • Visible
     • Stable (not animating)
     • Enabled
     • Receives events
   - This is why we use await - waiting for conditions to be met

================================================================================
*/

/*
================================================================================
XPATH SIBLING AXES - following-sibling:: and preceding-sibling::
================================================================================

DEFINITION:
Sibling axes navigate between elements at the SAME DOM level (same parent).
They help locate elements based on their relationship to other known elements.

VISUAL EXAMPLE:
<div class="header-links">
  <a>Home</a>              ← sibling 1
  <a>Log in</a>           ← sibling 2 (reference element)
  <a>Register</a>         ← sibling 3 (following-sibling of "Log in")
  <a>Contact</a>          ← sibling 4
</div>

FOLLOWING-SIBLING:: axis
========================
Definition: Selects all siblings AFTER (forward/down) the current element
Syntax: element/following-sibling::type[condition]
Returns: Sequence of matching elements (can use [1], [2], [last()])
Direction: Moves FORWARD through siblings
When siblings appear AFTER the reference element in HTML

PRECEDING-SIBLING:: axis
=========================
Definition: Selects all siblings BEFORE (backward/up) the current element
Syntax: element/preceding-sibling::type[condition]
Returns: Sequence of matching elements (can use [1], [2], [last()])
Direction: Moves BACKWARD through siblings
When siblings appear BEFORE the reference element in HTML

COMPARISON TABLE:
┌──────────────────────┬──────────────────────┬──────────────────────────┐
│ Aspect               │ following-sibling    │ preceding-sibling        │
├──────────────────────┼──────────────────────┼──────────────────────────┤
│ Direction            │ Forward/Next         │ Backward/Previous        │
│ Position             │ Elements AFTER       │ Elements BEFORE          │
│ HTML appearance      │ Appears later        │ Appears earlier          │
│ [1] means            │ Immediately next     │ Immediately previous     │
│ [last()] means       │ Last element after   │ First element before     │
│ Common use           │ Next button/link     │ Label for input field    │
└──────────────────────┴──────────────────────┴──────────────────────────┘

POSITION FILTERING:
[1]      = First matching sibling in direction (most common)
[2]      = Second matching sibling
[last()] = Last matching sibling (last following, first preceding)
[position()=1] = Alternative syntax for [1]

REAL-WORLD USE CASES:
✓ //input/preceding-sibling::label           - Get form field label
✓ //button[text()="Save"]/following-sibling::button - Get buttons after save
✓ //h2[text()="Contact"]/following-sibling::p[1]  - Get first paragraph after heading
✓ //error-message/preceding-sibling::input   - Get input associated with error
✓ //active-tab/following-sibling::tab        - Get next tab in tablist
✓ //menu-item[@active]/preceding-sibling::menu-item - Get previous menu item

WHY USE SIBLING AXES:
1. RELATIONSHIP-BASED: Finds elements based on relationships, not absolute positions
2. MAINTAINABLE: Less fragile than hard-coded XPath indices
3. SEMANTIC: Better reflects how users see related elements
4. FLEXIBLE: Works regardless of absolute position in document
5. RESILIENT: Survives HTML structural changes (as long as relationships stay)

PERFORMANCE NOTE:
- Sibling axes are fast (operate within same parent)
- More efficient than scanning entire document
- [1] is more efficient than [last()] or no filter
*/

test('XPath sibling axes - following-sibling and preceding-sibling', async ({page}) => {
    await page.goto('https://demo.nopcommerce.com');
    
    // Example 1: Using following-sibling:: to find next element
    // WHEN: You know element A and need to find element B that comes after it
    // WHY: Avoids hard-coding positions; uses relationships
    const followingLink = page.locator('//a[text()="Register"]/following-sibling::a[1]');
    const followingText = await followingLink.textContent();
    console.log(`Element after "Register": ${followingText?.trim()}`);
    
    // Example 2: Using preceding-sibling:: to find previous element
    // WHEN: You know element B and need to find element A that comes before it
    // WHY: Navigates backward; useful for labels before inputs
    const precedingLink = page.locator('//a[text()="Register"]/preceding-sibling::a[text()="Log in"]');
    await expect(precedingLink).toBeVisible();
    console.log('✓ Found "Log in" as preceding-sibling of "Register"');
    
    // Example 3: Get count of all following siblings
    // WHEN: You need to know how many elements follow a reference element
    // WHY: Verify structure, pagination, or list completeness
    const allFollowing = page.locator('//a[text()="Log in"]/following-sibling::*');
    const followingCount = await allFollowing.count();
    console.log(`Total elements after "Log in": ${followingCount}`);
    
    // Example 4: Get text from all following siblings
    // WHEN: You need content from multiple elements after a reference
    // WHY: Gather all related items at once
    const followingTexts = await allFollowing.allTextContents();
    console.log(`All elements after "Log in": ${followingTexts.join(', ')}`);
    
    // Example 5: Using [last()] with following-sibling
    // WHEN: You need the very last element after reference
    // WHY: Get end of list without knowing exact count
    const lastFollowing = page.locator('//a[text()="Log in"]/following-sibling::*[last()]');
    const lastText = await lastFollowing.textContent();
    console.log(`Last sibling after "Log in": ${lastText?.trim()}`);
    
    // Example 6: Practical scenario - Finding label for form field
    // WHEN: Input field has preceding sibling label
    // WHY: Verify form structure and label associations
    const emailInput = page.locator('//input[@type="email"]');
    const emailLabel = page.locator('//input[@type="email"]/preceding-sibling::label[1]');
    const labelText = await emailLabel.textContent();
    if (labelText) {
        console.log(`Label for email input: ${labelText.trim()}`);
    }
    
    // Example 7: Using preceding-sibling with multiple conditions
    // WHEN: Multiple preceding siblings exist, need specific one
    // WHY: Precise targeting with complex conditions
    const conditionPreceding = page.locator('//input[@type="email"]/preceding-sibling::label[@for="email"]');
    const conditionExists = await conditionPreceding.count();
    console.log(`Preceding label with @for attribute exists: ${conditionExists > 0}`);
    
    // Example 8: Combining following-sibling with contains()
    // WHEN: Following sibling text contains substring
    // WHY: Find elements without exact text match
    const containsFollowing = page.locator('//button[contains(text(), "Login")]/following-sibling::button[contains(text(), "Sign")]');
    const containsExists = await containsFollowing.count();
    console.log(`Following button containing "Sign": ${containsExists > 0}`);
    
    // Example 9: Using both axes together (advanced)
    // WHEN: Element is surrounded by known siblings
    // WHY: Pinpoint exact element using surrounding context
    const surrounded = page.locator('//a[preceding-sibling::a[text()="Log in"] and following-sibling::a[text()="Contact"]]');
    const surroundedCount = await surrounded.count();
    console.log(`Elements between "Log in" and "Contact": ${surroundedCount}`);
    
    // Example 10: Comparison - XPath sibling vs other methods
    // Both achieve same result, different approaches:
    
    // Method 1: Using sibling axes (recommended for relationships)
    const siblingApproach = page.locator('//a[text()="Log in"]/following-sibling::a[1]');
    
    // Method 2: Using index directly (not recommended - fragile)
    // const indexApproach = page.locator('//a[2]'); // Brittle!
    
    console.log('✓ Sibling axes provide more maintainable locators');
    
    // BEST PRACTICES DEMONSTRATED:
    console.log(`
    SIBLING AXES BEST PRACTICES:
    ===========================
    1. ✓ Use following-sibling for "next" elements
    2. ✓ Use preceding-sibling for "previous" elements
    3. ✓ Use [1] for nearest sibling (most common)
    4. ✓ Use [last()] when you need the final element
    5. ✓ Combine with conditions for precise targeting
    6. ✓ Works great for form labels and buttons
    7. ✓ Better than absolute indices (less fragile)
    8. ✗ Don't use when parent relationship is unclear
    9. ✗ Don't mix with parent/ancestor axes unnecessarily
    10. ✓ Test that sibling relationship survives HTML updates
    `);
});

/*
================================================================================
XPATH VERTICAL AXES - ancestor::, descendant::, self::
================================================================================

These axes navigate UP and DOWN the DOM hierarchy (parent-child relationships).

ancestor:: AXIS
===============
Direction: UP the tree toward root
Selects: All parent, grandparent, great-grandparent elements
Scope: From immediate parent all way to <html> root
Returns: Multiple ancestors in document order
Syntax: element/ancestor::type[condition]
Use [1]: Gets the immediate parent (closest ancestor)
Use [last()]: Gets the furthest ancestor (usually <html> or <body>)

WHEN TO USE:
✓ Find link/button wrapping an image
✓ Find form containing an input field
✓ Find container with specific class containing nested element
✓ Navigate from child to parent wrapper
EXAMPLE: //img/ancestor::a - Find <a> element containing image

descendant:: AXIS
=================
Direction: DOWN the tree toward leaves
Selects: All children, grandchildren, great-grandchildren elements
Scope: All nested elements at any depth inside target
Returns: Multiple descendants in document order
Syntax: element/descendant::type[condition]
Similar to: // (descendant-or-self)
Difference from /: Slash (/) only gets direct children; descendant goes any depth

WHEN TO USE:
✓ Find all inputs in a form (regardless of fieldset nesting)
✓ Find all images in a gallery container
✓ Find all buttons within a specific section
✓ Navigate from parent to any nested child at any level
EXAMPLE: //form[@id="login"]/descendant::input - Find all inputs in form

self:: AXIS
===========
Direction: NONE (stays on current node)
Selects: The current element itself
Returns: 0 or 1 (element if matches condition, else nothing)
Syntax: element/self::type[condition]
Purpose: Validate element type (rarely practical)
Note: Usually redundant since initial selector already specifies type

WHEN TO USE:
✓ Validate current element IS a specific type (rare)
✓ Use in complex multi-condition filters
✓ Mostly educational; rarely needed in practice
EXAMPLE: //a/self::a - Confirm element is <a> (redundant)

VISUAL DOM EXAMPLE:
<html>
  <body>
    <div class="container">           ← ancestor::div
      <form id="login">               ← ancestor::form
        <label for="user">User</label>
        <input id="user"/>            ← self::input (current)
      </form>                         ← ancestor::form[1]
    </div>                            ← ancestor::div[1]
  </body>
</html>

COMPARISON TABLE:
┌──────────────────┬─────────────┬──────────────┬──────────────┐
│ Aspect           │ ancestor::  │ descendant:: │ self::       │
├──────────────────┼─────────────┼──────────────┼──────────────┤
│ Movement         │ UP          │ DOWN         │ NONE         │
│ Scope            │ To parents  │ To children  │ Current only │
│ Returns          │ Multiple    │ Multiple     │ 0 or 1       │
│ [1] means        │ Closest     │ First        │ N/A          │
│ Common use       │ 30%         │ 60%          │ 10%          │
│ Practical value  │ High        │ High         │ Low          │
└──────────────────┴─────────────┴──────────────┴──────────────┘

REAL-WORLD PATTERNS:
✓ //button/ancestor::form              - Get form containing button
✓ //form/descendant::input             - Get all inputs in form
✓ //span[@class="error"]/ancestor::div - Get field container with error
✓ //img/ancestor::a[1]                 - Get immediate link parent
✓ //section/descendant::*[@id="main"]  - Find element with id in section
✓ //input[@type="password"]/ancestor::form[1] - Get form containing password input
✓ //div[@class="header"]//descendant::img - Get any image in header
*/

test('XPath vertical axes - ancestor, descendant, self in action', async ({page}) => {
    await page.goto('https://demo.nopcommerce.com');
    
    // ====================================================================
    // ANCESTOR:: EXAMPLES - Navigate UP the DOM tree
    // ====================================================================
    
    // Example 1: Find parent <a> of image
    // STATEMENT: //img[@alt="nopCommerce demo store"]/ancestor::a
    // What it does: Find logo image, then find its <a> ancestor
    // Returns: The <a> element wrapping the image
    // USE CASE: Testing logo link is clickable
    const logoImage = page.locator('//img[@alt]').first();
    const parentLink = page.locator('//img[@alt]/ancestor::a[1]');
    const linkExists = await parentLink.count();
    console.log(`Image has parent <a> link: ${linkExists > 0}`);
    
    // Example 2: Get all ancestors (any type)
    // ancestor::* returns ANY tag type (div, section, header, etc.)
    const allAncestors = page.locator('//img[@alt]/ancestor::*');
    const ancestorCount = await allAncestors.count();
    console.log(`Total ancestors of image: ${ancestorCount}`);
    
    // Example 3: Find form containing input
    // STATEMENT: //input[@type="email"]/ancestor::form[1]
    // Returns: The form that contains this email input
    // USE CASE: Submit form after filling input
    const emailForm = page.locator('//input[@type="email"]/ancestor::form[1]');
    const formExists = await emailForm.count();
    console.log(`Email input in form: ${formExists > 0}`);
    
    // Example 4: Find container div with specific class
    // Navigate up until you find a div with class="container"
    const container = page.locator('//button/ancestor::div[@class*="container"]');
    const containerExists = await container.count();
    console.log(`Button has container ancestor: ${containerExists > 0}`);
    
    // Example 5: Practical - Find parent section with specific attribute
    const section = page.locator('//button/ancestor::section[@id]');
    const sectionId = await section.getAttribute('id');
    console.log(`Section containing button has id: ${sectionId ? 'yes' : 'no'}`);
    
    // ====================================================================
    // DESCENDANT:: EXAMPLES - Navigate DOWN the DOM tree
    // ====================================================================
    
    // Example 1: Find all inputs in a form
    // STATEMENT: //form/descendant::input
    // What it does: Find form, then find ALL <input> descendants (any depth)
    // Returns: All inputs regardless of nesting level
    // USE CASE: Get all form fields, validate form structure
    const formInputs = page.locator('//form/descendant::input');
    const inputCount = await formInputs.count();
    console.log(`Total inputs in form: ${inputCount}`);
    
    // Example 2: Get text content of all descendants
    // Find all text nodes within a specific container
    const containerText = page.locator('//div[@class="header"]/descendant::*');
    const textCount = await containerText.count();
    console.log(`Total elements in header: ${textCount}`);
    
    // Example 3: Find all images in page (any depth)
    // descendant-or-self (//): Same as /descendant::
    const allImages = page.locator('//img');
    const imageCount = await allImages.count();
    console.log(`Total images on page: ${imageCount}`);
    
    // Example 4: Find inputs with specific type in section
    // /descendant::input[condition] - descendants with filter
    const emailInputs = page.locator('//section/descendant::input[@type="email"]');
    const emailCount = await emailInputs.count();
    console.log(`Email inputs in section: ${emailCount}`);
    
    // Example 5: Practical - Get all links in navigation
    const navLinks = page.locator('//nav/descendant::a');
    const navCount = await navLinks.count();
    console.log(`Links in navigation: ${navCount}`);
    
    // Example 6: Difference between / (child) and /descendant::
    // These are DIFFERENT:
    // //form/input         - Only DIRECT child inputs (fails if wrapped in <fieldset>)
    // //form/descendant::input - Any input at ANY depth (more reliable)
    const directInputs = page.locator('//form > input'); // Only direct children
    const anyInputs = page.locator('//form//input'); // Any depth (same as descendant)
    console.log(`Demonstrating child (/) vs descendant (//) difference`);
    
    // ====================================================================
    // SELF:: EXAMPLES - Validate current element
    // ====================================================================
    
    // Example 1: Confirm element type (usually redundant)
    // STATEMENT: //a/self::a
    // Already know it's an <a>, so /self::a doesn't add value
    const confirmLink = page.locator('//a/self::a');
    const linkCount = await confirmLink.count();
    console.log(`//a/self::a found ${linkCount} links (same as //a)`);
    
    // Example 2: More practical - Type validation with condition
    // Find element that IS an <a> AND has href attribute
    const linkWithHref = page.locator('//a/self::a[@href]');
    const hrefCount = await linkWithHref.count();
    console.log(`Links with @href attribute: ${hrefCount}`);
    
    // Example 3: Validate element is NOT a certain type
    // //div/self::section returns nothing (div is not section)
    const divAsSection = page.locator('//div/self::section');
    const sectionFound = await divAsSection.count();
    console.log(`//div/self::section found: ${sectionFound} (0 - expected)`);
    
    // Example 4: self with multiple conditions (rarely used)
    // Element must match both conditions to be returned
    const selfCondition = page.locator('//a/self::a[@href][contains(text(), "Log")]');
    const conditionCount = await selfCondition.count();
    console.log(`Link that is <a> with href and contains "Log": ${conditionCount}`);
    
    // ====================================================================
    // COMBINED AXES EXAMPLES
    // ====================================================================
    
    // Example 1: Navigate both directions
    // Find label (ancestor), then its associated input (could be sibling)
    const label = page.locator('//input[@id]/preceding-sibling::label[1]');
    const labelText = await label.textContent();
    console.log(`Associated label for input: ${labelText?.trim()}`);
    
    // Example 2: Complex navigation
    // Find error message (descendant), then find form (ancestor)
    const errorForm = page.locator('//span[@class="error"]/ancestor::form');
    const errorFormExists = await errorForm.count();
    console.log(`Form containing error message: ${errorFormExists > 0}`);
    
    // ====================================================================
    // SUMMARY
    // ====================================================================
    console.log(`
    VERTICAL AXES QUICK REFERENCE:
    ==============================
    
    ancestor:: (UP ↑)
    ✓ Use: //child/ancestor::parent - Find element's parent
    ✓ Returns: All parents up to <html>
    ✓ [1] = immediate parent
    ✓ Common: Form containing input, Link containing image
    
    descendant:: (DOWN ↓)
    ✓ Use: //parent/descendant::child - Find nested elements
    ✓ Returns: All children at any depth
    ✓ Works through multiple nesting levels
    ✓ Common: Inputs in form, Buttons in section
    ✓ More reliable than direct child (/) because handles nesting
    
    self:: (CURRENT =)
    ✓ Use: //a/self::a - Validate element type
    ✓ Returns: Element itself if matches (0 or 1)
    ✓ Rarely practical - initial selector already specifies type
    ✓ Mostly educational value
    
    KEY INSIGHT:
    - ancestor:: solves "I know child, need parent"
    - descendant:: solves "I know parent, need nested child"
    - self:: rarely needed (initial selector already filters type)
    `);
});

test('Test parent and child axes - Direct relationships', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com');
    
    console.log('=== parent:: AXIS - Direct Parent Navigation ===\n');
    
    // Example 1: parent:: - Get immediate parent only
    // Syntax: //child/parent::type
    // Key: Returns ONLY the direct parent (not grandparents)
    const logo = page.locator('img[src*="logo"]').first();
    const parentA = page.locator('img[src*="logo"]/parent::a').first();
    const parentLink = await parentA.getAttribute('href');
    console.log(`1. Logo's direct parent is: <${await parentA.evaluate((el) => el.tagName)}>`);
    console.log(`   Parent href: ${parentLink}`);
    
    // Example 2: parent:: vs ancestor:: - Scope difference
    // parent:: returns only immediate (0 or 1)
    // ancestor:: returns all parents (multiple)
    const parentDirect = page.locator('img[src*="logo"]/parent::*');
    const ancestorAll = page.locator('img[src*="logo"]/ancestor::*');
    const parentCount = await parentDirect.count();
    const ancestorCount = await ancestorAll.count();
    console.log(`\n2. parent::* count: ${parentCount} (only 1 parent)`);
    console.log(`   ancestor::* count: ${ancestorCount} (all parents up)`);
    
    // Example 3: Type checking with parent::
    // parent::type returns parent ONLY if matches type
    const parentDiv = page.locator('img[src*="logo"]/parent::div');
    const parentDivExists = await parentDiv.count();
    console.log(`\n3. Logo's parent is <div>: ${parentDivExists > 0}`);
    
    // Example 4: parent:: with conditions
    // Find input, then get parent with class 'form-group'
    const parentWithClass = page.locator('input/parent::div[@class*="form"]').first();
    const parentClassExists = await parentWithClass.count();
    console.log(`\n4. Input's parent div with form class: ${parentClassExists > 0}`);
    
    // Example 5: Practical - Get form containing button
    const submitButton = page.locator('button:has-text("Search")').first();
    const parentForm = page.locator('button:has-text("Search")/parent::form').first();
    const formMethod = await parentForm.getAttribute('method');
    console.log(`\n5. Search button's parent form method: ${formMethod || 'not found'}`);
    
    console.log('\n=== child:: AXIS - Direct Children Navigation ===\n');
    
    // Example 6: child:: - Get direct children only
    // Syntax: //parent/child::type
    // Key: Returns ONLY direct children (not nested)
    const navList = page.locator('.header-links-wrapper > ul').first();
    const childItems = page.locator('.header-links-wrapper > ul > li');
    const childCount = await childItems.count();
    console.log(`6. Direct <li> children of nav <ul>: ${childCount}`);
    
    // Example 7: child:: vs descendant:: - Depth difference
    // child:: only direct level
    // descendant:: any depth including nested
    const directChild = page.locator('nav > li'); // Direct children
    const anyDepth = page.locator('nav li'); // Any depth (descendant)
    const directCount = await directChild.count();
    const depthCount = await anyDepth.count();
    console.log(`\n7. Direct children nav > li: ${directCount}`);
    console.log(`   All descendants nav li: ${depthCount}`);
    
    // Example 8: Get all children of container
    const topMenu = page.locator('ul.notmobile').first();
    const menuChildren = page.locator('ul.notmobile > li');
    const menuCount = await menuChildren.count();
    console.log(`\n8. Top menu direct children: ${menuCount}`);
    
    // Example 9: child:: with type filter
    // Get specific types of direct children
    const listChildren = page.locator('ul > li');
    const listCount = await listChildren.count();
    console.log(`\n9. List items (direct children of ul): ${listCount}`);
    
    // Example 10: Practical - Get inputs in form (direct level only)
    const formDirect = page.locator('form').first();
    const directInputs = page.locator('form > input');
    const directInputCount = await directInputs.count();
    console.log(`\n10. Direct <input> children of form: ${directInputCount}`);
    
    console.log(`
    === SUMMARY: parent:: vs ancestor:: and child:: vs descendant:: ===
    
    parent:: (Single Parent)
    ✓ Returns: Only 1 element (the direct parent)
    ✓ Use: When you need ONLY the immediate parent
    ✓ Example: //img/parent::a - Get image wrapper link
    ✓ Similar to ancestor::*[1] but more explicit
    
    ancestor:: (All Parents)
    ✓ Returns: Multiple elements (all parents)
    ✓ Use: When you need any parent level
    ✓ Example: //img/ancestor::section - Get any section ancestor
    ✓ More flexible for finding parent at unknown depth
    
    child:: (Direct Children Only)
    ✓ Returns: Multiple elements (direct children only)
    ✓ Use: When you MUST have direct children only
    ✓ Example: //ul/child::li - Get ul's direct items
    ✓ Same as using > selector in CSS
    
    descendant:: (All Nested Children)
    ✓ Returns: Multiple elements (any nesting level)
    ✓ Use: When children might be nested
    ✓ Example: //form/descendant::input - Get inputs at any depth
    ✓ Same as using space selector in CSS
    
    DECISION GUIDE:
    - Do you want only immediate parent? → parent::
    - Do you want any parent level? → ancestor::
    - Do you want direct children only? → child:: or >
    - Do you want nested children too? → descendant:: or space
    `);
});

test('Test following and preceding axes - Document order navigation', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com');
    
    console.log('=== following:: AXIS - All Elements After ===\n');
    
    // Example 1: following:: - Elements AFTER current (any location)
    // Key difference: Not just siblings, but ANY elements after
    const headerLogo = page.locator('img[src*="logo"]').first();
    const afterLogo = page.locator('img[src*="logo"]/following::a');
    const followingCount = await afterLogo.count();
    console.log(`1. <a> elements appearing AFTER logo: ${followingCount}`);
    
    // Example 2: following:: vs following-sibling:: - Scope difference
    // following-sibling:: = same parent level only
    // following:: = ANY element after (different parents OK)
    const refElement = page.locator('.search-box').first();
    const sibAfter = page.locator('.search-box/following-sibling::*').first();
    const anyAfter = page.locator('.search-box/following::div').first();
    const sibExists = await sibAfter.count() > 0;
    const anyExists = await anyAfter.count() > 0;
    console.log(`\n2. following-sibling::* exists: ${sibExists} (same level)`);
    console.log(`   following::* exists: ${anyExists} (any location after)`);
    
    // Example 3: Find first element after reference
    // following::*[1] = first element in document order after
    const firstAfter = page.locator('img[src*="logo"]/following::*[1]');
    const firstAfterTag = await firstAfter.evaluate((el) => el.tagName);
    console.log(`\n3. First element after logo: <${firstAfterTag}>`);
    
    // Example 4: following:: to find related content
    // Find all elements after a heading (could be used for section content)
    const headings = page.locator('h1, h2, h3').first();
    const afterHeading = page.locator('h1/following::*');
    const afterCount = await afterHeading.count();
    console.log(`\n4. Elements appearing after heading: ${afterCount}`);
    
    // Example 5: following:: with type and condition
    // Find paragraphs (any location) after a reference point
    const refPoint = page.locator('.search-box').first();
    const followingP = page.locator('.search-box/following::p');
    const pCount = await followingP.count();
    console.log(`\n5. Paragraphs appearing after search box: ${pCount}`);
    
    console.log('\n=== preceding:: AXIS - All Elements Before ===\n');
    
    // Example 6: preceding:: - Elements BEFORE current (any location)
    // Key difference: Not just siblings, but ANY elements before
    const footer = page.locator('footer').first();
    const beforeFooter = page.locator('footer/preceding::div');
    const precedingDivCount = await beforeFooter.count();
    console.log(`6. <div> elements appearing BEFORE footer: ${precedingDivCount}`);
    
    // Example 7: preceding:: vs preceding-sibling:: - Scope difference
    // preceding-sibling:: = same parent level only
    // preceding:: = ANY element before (different parents OK)
    const target = page.locator('.search-box').first();
    const sibBefore = page.locator('.search-box/preceding-sibling::*').first();
    const anyBefore = page.locator('.search-box/preceding::div').first();
    const sibBeforeExists = await sibBefore.count() > 0;
    const anyBeforeExists = await anyBefore.count() > 0;
    console.log(`\n7. preceding-sibling::* exists: ${sibBeforeExists} (same level)`);
    console.log(`   preceding::* exists: ${anyBeforeExists} (any location before)`);
    
    // Example 8: Find last element before reference
    // preceding::*[1] = last element in document order before (positions reversed)
    const lastBefore = page.locator('footer/preceding::*[1]');
    const lastBeforeTag = await lastBefore.evaluate((el) => el.tagName);
    console.log(`\n8. Last element before footer: <${lastBeforeTag}>`);
    
    // Example 9: preceding:: with type filter
    // Find form elements appearing anywhere before current position
    const target2 = page.locator('.product-grid').first();
    const formsBefore = page.locator('.product-grid/preceding::form');
    const formsCount = await formsBefore.count();
    console.log(`\n9. Forms appearing before product grid: ${formsCount}`);
    
    // Example 10: Practical - Find related labels
    // Input might have label anywhere before it (not always immediate sibling)
    const input = page.locator('input[type="search"]').first();
    const relatedLabel = page.locator('input[type="search"]/preceding::label');
    const labelCount = await relatedLabel.count();
    console.log(`\n10. Labels appearing before search input: ${labelCount}`);
    
    console.log(`
    === SUMMARY: following:: vs preceding:: ===
    
    SIBLING AXES (limited to same parent):
    ────────────────────────────────────────
    following-sibling:: (forward at same level)
    ✓ Returns: Elements after at SAME parent level
    ✓ Scope: Siblings only
    ✓ Example: //button/following-sibling::button
    
    preceding-sibling:: (backward at same level)
    ✓ Returns: Elements before at SAME parent level
    ✓ Scope: Siblings only
    ✓ Example: //input/preceding-sibling::label
    
    GENERAL AXES (any location):
    ────────────────────────────
    following:: (forward anywhere)
    ✓ Returns: ALL elements AFTER in document order
    ✓ Scope: Any location (different parents OK)
    ✓ Example: //h2/following::p - Paragraphs after heading
    ✓ More flexible: Works across different containers
    
    preceding:: (backward anywhere)
    ✓ Returns: ALL elements BEFORE in document order
    ✓ Scope: Any location (different parents OK)
    ✓ Example: //input/preceding::label - Any label before input
    ✓ More flexible: Works across different containers
    
    DECISION GUIDE:
    - Elements after at same level? → following-sibling::
    - Elements anywhere after? → following::
    - Elements before at same level? → preceding-sibling::
    - Elements anywhere before? → preceding::
    
    KEY INSIGHT:
    Sibling axes are faster (limited scope)
    General axes are more flexible (full document scope)
    Choose sibling:: when structure is guaranteed
    Choose general:: when structure varies
    `);
});
