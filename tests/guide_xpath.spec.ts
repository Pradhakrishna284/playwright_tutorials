//https://www.youtube.com/watch?v=ZQ3upj6H2gI&list=PLUDwpEzHYYLtvMVjc-Va3RXLKtdB-ofc2&index=3
//https://www.youtube.com/watch?v=-gselrc9Py8&list=PLUDwpEzHYYLtvMVjc-Va3RXLKtdB-ofc2&index=4

import {test, expect, Locator} from '@playwright/test';

test('Xpath locator - locate elements using XPath expressions', async ({page}) => {
    // Using async: Allows the test function to pause execution with 'await' for asynchronous operations
    // This enables sequential execution of browser automation steps that take time to complete
    
    // await page.goto(): Waits for page navigation to complete before proceeding
    // Without await, the next line would execute before the page loads, causing failures
    await page.goto('https://demowebshop.tricentis.com/');
    
    // Example 1: Locate element by exact text using XPath
    // WHEN: Need to find element with specific text
    // WHY XPath: Powerful for complex text matching
    const exactTextLocator: Locator = page.locator('//a[text()="Register"]');
    // await expect(): Waits for the assertion to complete
    // Playwright automatically retries the assertion for a default period to handle timing issues
    // Without await, the promise would not resolve and the test would not wait for verification
    await expect(exactTextLocator).toBeVisible();

    // Example 2: Locate element by partial text using XPath contains()
    // WHEN: Looking for element with partial text match    
    // WHY contains(): Enables substring matching in XPath
    const partialTextLocator: Locator = page.locator('//a[contains(text(),"Log")]');
    // await: Waits for assertion to resolve; ensures element visibility is verified before moving to next assertion
    await expect(partialTextLocator).toBeVisible();

    // Example 3: Locate element by attribute using XPath
    // WHEN: Need to find element with specific attribute value
    // WHY XPath: Directly targets attributes
    const attributeLocator: Locator = page.locator('//input[@id="small-searchterms"]');
    await expect(attributeLocator).toBeVisible();

    // Example 4: Locate element using XPath axes (following-sibling)
    // WHEN: Need to find element relative to another
    // WHY XPath axes: Navigate DOM relationships
    const siblingLocator: Locator = page.locator('//label[text()="Search"]/following-sibling::input');
    await expect(siblingLocator).toBeVisible();

    // Example 5: Locate element by combining conditions in XPath
    // WHEN: Need to find element matching multiple criteria
    // WHY XPath: Combines conditions for precise targeting
    const combinedLocator: Locator = page.locator('//a[contains(text(),"Books") and @href]');
    await expect(combinedLocator).toBeVisible();

    // Example 6: Locate element by position using XPath
    // WHEN: Need to find element based on its position in a list
    // WHY XPath position(): Targets elements by their order
    const positionLocator: Locator = page.locator('(//div[@class="product-item"])[1]');
    await expect(positionLocator).toBeVisible();

    // Example 7: Locate element using XPath with logical operators (OR)
    // WHEN: Need to find element that meets one of several conditions
    // WHY XPath logical operators: Allows flexible matching
    const logicalLocator: Locator = page.locator('//a[@href="/computers" or @href="/electronics"]');
    await expect(logicalLocator).toBeVisible();

    // Example 8: Locate element by text normalization using XPath normalize-space()
    // WHEN: Need to find element ignoring extra whitespace
    // WHY normalize-space(): Cleans up text for matching
    const normalizeLocator: Locator = page.locator('//a[normalize-space(text())="Contact us"]');
    await expect(normalizeLocator).toBeVisible();

    // Example 9: Locate element by using XPath starts-with()
    // WHEN: Need to find element where text starts with specific string
    // WHY starts-with(): Targets text prefixes
    const startsWithLocator: Locator = page.locator('//a[starts-with(text(),"About")]');
    await expect(startsWithLocator).toBeVisible();

    // Example 10: Locate element by using XPath with multiple attributes
    // WHEN: Need to find element matching several attributes
    // WHY XPath: Combines attribute conditions for precision
    const multiAttrLocator: Locator = page.locator('//input[@type="text" and @name="q"]');
    await expect(multiAttrLocator).toBeVisible();

    // Example 11: Locate element by using XPath with parent-child relationship (descendant)
    // WHEN: Need to find child element under specific parent
    // WHY XPath //: Navigates DOM hierarchy at any depth
    const parentChildLocator: Locator = page.locator('//div[@class="header-links"]//a[text()="Log in"]');
    await expect(parentChildLocator).toBeVisible();

    // Example 12: Locate element by using XPath with union operator
    // WHEN: Need to find elements matching one of several paths
    // WHY XPath union (|): Combines multiple XPath expressions
    const unionLocator: Locator = page.locator('//a[@href="/books"] | //a[@href="/computers"]');
    await expect(unionLocator.first()).toBeVisible();

    // Example 13: Locate element by using XPath with case-insensitive match using translate()
    // WHEN: Need to find element with text ignoring case
    // WHY translate(): Enables case-insensitive matching
    const caseInsensitiveLocator: Locator = page.locator('//a[translate(text(),"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz")="register"]');
    await expect(caseInsensitiveLocator).toBeVisible();

    // Example 14: Locate element by using XPath with dynamic attributes
    // WHEN: Need to find element with changing attribute values (e.g., IDs with prefixes)
    // WHY starts-with(@attr): Handles dynamic attributes effectively
    const dynamicAttrLocator: Locator = page.locator('//input[starts-with(@id,"search-")]');
    await expect(dynamicAttrLocator).toBeVisible();

    // Example 15: Locate element by using XPath with preceding-sibling axis
    // WHEN: Need to find element before a known element
    // WHY preceding-sibling: Navigates to previous siblings in DOM
    const precedingSiblingLocator: Locator = page.locator('//input[@id="small-searchterms"]/preceding-sibling::label');
    await expect(precedingSiblingLocator).toBeVisible();

    // Example 16: Locate element by using XPath with ancestor axis
    // WHEN: Need to find an ancestor element of a specific element
    // WHY ancestor: Navigates up the DOM tree
    const ancestorLocator: Locator = page.locator('//input[@id="small-searchterms"]/ancestor::div[1]');
    await expect(ancestorLocator).toBeVisible();

    // Example 17: Locate element by using XPath with not() function
    // WHEN: Need to find element that does NOT have a specific attribute or text
    // WHY not(): Negates conditions for flexible targeting
    const notLocator: Locator = page.locator('//a[not(@disabled)]');
    await expect(notLocator.first()).toBeVisible();

    // Example 18: Locate element by using XPath with substring() function
    // WHEN: Need to extract and match a specific substring
    // WHY substring(): Enables precise substring matching
    const substringLocator: Locator = page.locator('//a[substring(text(), 1, 3)="Reg"]');
    await expect(substringLocator).toBeVisible();

    // Example 19: Locate element by using XPath with last() function
    // WHEN: Need to find the last element in a list
    // WHY last(): Targets the final element without knowing count
    const lastLocator: Locator = page.locator('(//a[@href])[last()]');
    await expect(lastLocator).toBeVisible();

    // Example 20: Locate element by using XPath with count() function
    // WHEN: Need to find elements based on count of children
    // WHY count(): Enables matching based on number of elements
    const countLocator: Locator = page.locator('//div[count(.//a) > 0]');
    await expect(countLocator.first()).toBeVisible();

    // Example 21: Locate element by using XPath with string-length() function
    // WHEN: Need to find element based on text length
    // WHY string-length(): Enables length-based matching
    const lengthLocator: Locator = page.locator('//a[string-length(text()) > 5]');
    await expect(lengthLocator.first()).toBeVisible();

    // Example 22: Locate element by using XPath with following-sibling axis
    // WHEN: Need to find element after a known element
    // WHY following-sibling: Navigates to next siblings in DOM
    const followingSiblingLocator: Locator = page.locator('//label[text()="Search"]/following-sibling::input[1]');
    await expect(followingSiblingLocator).toBeVisible();

    // Example 23: Locate element by using XPath with self axis
    // WHEN: Need to filter element on itself based on conditions
    // WHY self:: : Tests element conditions directly
    const selfLocator: Locator = page.locator('//a[self::a[@href]]');
    await expect(selfLocator.first()).toBeVisible();

    // Example 24: Locate element by using XPath with contains() on attributes
    // WHEN: Need to find element with attribute containing specific text
    // WHY contains(@attr): Matches partial attribute values
    const attrContainsLocator: Locator = page.locator('//a[contains(@href,"shop")]');
    await expect(attrContainsLocator.first()).toBeVisible();

});

/*
================================================================================
TEXT() vs NORMALIZE-SPACE() - DETAILED COMPARISON
================================================================================

CORE DIFFERENCE:
text() function           - Matches text EXACTLY as it appears (preserves all whitespace)
normalize-space() function - Matches text AFTER removing extra whitespace

WHAT THEY DO:
text() 
  - Gets text content exactly as it is in HTML
  - Whitespace is PRESERVED: spaces, tabs, newlines all count
  - Returns the raw string with no modifications
  - Example: "  Hello  World  " stays "  Hello  World  "

normalize-space()
  - Removes leading and trailing whitespace
  - Collapses internal multiple spaces into single space
  - Removes tabs and newlines
  - Returns cleaned-up string
  - Example: "  Hello  World  " becomes "Hello World"

COMPARISON TABLE:
┌─────────────────────┬──────────────────────┬──────────────────────────────┐
│ HTML Content        │ text() matches       │ normalize-space() matches    │
├─────────────────────┼──────────────────────┼──────────────────────────────┤
│ <a>Register</a>     │ "Register"           │ "Register"                   │
│ <a> Register </a>   │ " Register "         │ "Register"                   │
│ <a>  Reg  ister </a>│ "  Reg  ister "      │ "Reg ister"                  │
│ HTML with breaks:   │                      │                              │
│ <a>                 │ "\n    Register\n"   │ "Register"                   │
│   Register          │ (includes newlines)  │ (cleaned)                    │
│ </a>                │                      │                              │
└─────────────────────┴──────────────────────┴──────────────────────────────┘

WHEN EACH FAILS:
text() FAILS when:
  ✗ HTML has extra spaces from indentation
  ✗ Text spans multiple lines with line breaks
  ✗ Formatting whitespace is added by HTML preprocessors
  ✗ Real-world websites with messy HTML structure

normalize-space() RARELY FAILS (always better for automation)
  ✓ Handles all whitespace variations
  ✓ Works with formatted, indented HTML
  ✓ Tolerates line breaks and tabs
  ✓ More resilient to HTML changes

PERFORMANCE:
text()            - Slightly faster (no processing)
normalize-space() - Tiny bit slower (processes whitespace)
Difference: Negligible in real testing (milliseconds)

BEST PRACTICE:
DEFAULT: Use normalize-space() in production automation
ONLY use text() when you're SURE HTML is clean (unit tests, controlled environments)
*/

test('text() vs normalize-space() - Whitespace handling in XPath', async ({page}) => {
    await page.goto('https://demowebshop.tricentis.com/');
    
    // Example 1: Using text() - Requires exact text including whitespace
    // WHEN: HTML is clean with no extra formatting whitespace
    // WHY: Slightly faster but fragile
    const linkText = page.locator('//a[text()="Register"]');
    await expect(linkText).toBeVisible();
    console.log('✓ Found with text() - HTML has clean formatting');
    
    // Example 2: Using normalize-space() - Handles whitespace issues
    // WHEN: HTML might have extra spaces, indentation, or line breaks
    // WHY: More robust; handles real-world HTML
    const linkNorm = page.locator('//a[normalize-space()="Register"]');
    await expect(linkNorm).toBeVisible();
    console.log('✓ Found with normalize-space() - tolerates whitespace variations');
    
    // Example 3: Combining with contains() - partial matching
    // contains(text()) - substring match with whitespace sensitivity
    const subText = page.locator('//a[contains(text(), "egiste")]');
    console.log(`✓ Found ${await subText.count()} elements with contains(text())`);
    
    // contains(normalize-space()) - substring match, whitespace tolerant
    const subNorm = page.locator('//a[contains(normalize-space(), "egiste")]');
    console.log(`✓ Found ${await subNorm.count()} elements with contains(normalize-space())`);
    
    // Example 4: Real-world scenario - menu items with varying whitespace
    // Some menu items may have extra spaces from HTML indentation
    const menuWithText = page.locator('//ul[@class="top-menu"]/li[text()]');
    const menuWithNorm = page.locator('//ul[@class="top-menu"]/li[normalize-space()]');
    
    const countText = await menuWithText.count();
    const countNorm = await menuWithNorm.count();
    
    console.log(`Menu items with text(): ${countText}`);
    console.log(`Menu items with normalize-space(): ${countNorm}`);
    // normalize-space() often finds more or same elements
    expect(countNorm).toBeGreaterThanOrEqual(countText);
    
    // Example 5: Using with starts-with()
    // starts-with(text()) - whitespace-sensitive prefix match
    const prefixText = page.locator('//a[starts-with(text(), "Reg")]');
    const prefixTextCount = await prefixText.count();
    
    // starts-with(normalize-space()) - whitespace-tolerant prefix match
    const prefixNorm = page.locator('//a[starts-with(normalize-space(), "Reg")]');
    const prefixNormCount = await prefixNorm.count();
    
    console.log(`Elements starting with "Reg" using text(): ${prefixTextCount}`);
    console.log(`Elements starting with "Reg" using normalize-space(): ${prefixNormCount}`);
    expect(prefixNormCount).toBeGreaterThanOrEqual(prefixTextCount);
    
    // Example 6: Demonstration of whitespace sensitivity
    // When HTML has formatting like:
    // <a>
    //   Contact us
    // </a>
    // text() would search for "\n  Contact us\n  " (doesn't match)
    // normalize-space() searches for "Contact us" (matches!)
    
    const contactText = page.locator('//a[text()="Contact us"]');
    const contactNorm = page.locator('//a[normalize-space()="Contact us"]');
    
    // In real websites, normalize-space() is more likely to succeed
    const contactNormCount = await contactNorm.count();
    if (contactNormCount > 0) {
        console.log('✓ normalize-space() found contact link (handles HTML formatting)');
    }
    
    // RECOMMENDATION SUMMARY:
    console.log(`
    BEST PRACTICE FOR XPATH LOCATORS:
    1. Always prefer normalize-space() over text() for production testing
    2. Use text() only for controlled unit test scenarios
    3. normalize-space() is more resilient to:
       - HTML indentation and formatting
       - Line breaks and whitespace changes
       - Minified vs formatted HTML
       - Different HTML editors and preprocessors
    4. Performance impact is negligible (both are fast enough)
    5. In 95% of real-world testing, normalize-space() is the safer choice
    `);
});
/*
================================================================================
XPATH SIBLING AXES - COMPREHENSIVE GUIDE
================================================================================

WHAT ARE SIBLING AXES?
Sibling axes navigate between elements that share the SAME PARENT element.
They help locate related elements without knowing their absolute position.

following-sibling:: AXIS
=======================
- Selects all siblings AFTER the current element
- Moves FORWARD through the DOM
- Use when: Element appears AFTER reference element
- Syntax: reference_element/following-sibling::target[condition]
- Returns: All matching elements after the reference
- Filter: [1] for first, [last()] for last, [2] for second, etc.

preceding-sibling:: AXIS
========================
- Selects all siblings BEFORE the current element
- Moves BACKWARD through the DOM
- Use when: Element appears BEFORE reference element
- Syntax: reference_element/preceding-sibling::target[condition]
- Returns: All matching elements before the reference
- Filter: [1] for first/closest, [last()] for last, [2] for second, etc.

VISUAL EXAMPLE:
DOM Structure:
<form>
  <label for="user">Username</label>              ← No preceding-sibling
  <input id="user" type="text"/>                ← preceding-sibling = label
  <label for="pass">Password</label>             ← preceding-sibling = input
  <input id="pass" type="password"/>            ← preceding-sibling = label
  <button type="submit">Login</button>           ← following-sibling exists after first input
  <button type="reset">Clear</button>            ← following-sibling of login button
</form>

XPATH EXAMPLES:
//input/preceding-sibling::label[1]           - Get label before input
//button[@type="submit"]/following-sibling::button[1] - Get button after submit
//h2[text()="Title"]/following-sibling::p[1]  - Get first paragraph after heading
//error-div/preceding-sibling::input[1]       - Get input before error
//active-tab/following-sibling::tab[contains(text(), "Settings")] - Complex condition

COMPARISON TABLE:
┌──────────────┬─────────────────────┬──────────────────────┐
│ Aspect       │ following-sibling   │ preceding-sibling    │
├──────────────┼─────────────────────┼──────────────────────┤
│ Direction    │ Forward (→)         │ Backward (←)         │
│ Position     │ After current       │ Before current       │
│ [1] is       │ First after         │ Closest before       │
│ [last()] is  │ Final after         │ Furthest before      │
│ Common use   │ Next button/link    │ Form label           │
│ Frequency    │ 40% of sibling use  │ 60% of sibling use   │
└──────────────┴─────────────────────┴──────────────────────┘

WHY USE SIBLING AXES?
1. MAINTAINS RELATIONSHIPS: Reflects actual DOM relationships
2. RESILIENT: Survives structural HTML changes
3. READABLE: Clear intent (find element related to known element)
4. LESS FRAGILE: Doesn't depend on absolute positions
5. SEMANTIC: Mirrors how users perceive related elements

REAL-WORLD PATTERNS:
✓ Form labels: input/preceding-sibling::label
✓ Button groups: button[@class="save"]/following-sibling::button
✓ List items: li[@class="active"]/following-sibling::li[1]
✓ Error messages: input/following-sibling::span[@class="error"]
✓ Navigation: li[contains(text(),"Home")]/following-sibling::li
*/

test('XPath sibling axes detailed - following-sibling and preceding-sibling', async ({page}) => {
    await page.goto('https://demowebshop.tricentis.com/');
    
    // ====================================================================
    // FOLLOWING-SIBLING:: EXAMPLES
    // ====================================================================
    
    // Example 1: Basic following-sibling - next element after reference
    // XPath: //a[text()="Log in"]/following-sibling::a[text()="Register"]
    // Translation: Find <a> with "Log in", then find its following sibling <a> with "Register"
    // WHEN: You know one element and need the next element
    // WHY: Avoids hard-coding element indices
    const followingSiblingExact = page.locator('//a[text()="Log in"]/following-sibling::a[text()="Register"]');
    await expect(followingSiblingExact).toBeVisible();
    console.log('✓ Found "Register" as following-sibling of "Log in"');
    
    // Example 2: Get first following sibling regardless of text
    // XPath: //a[text()="Log in"]/following-sibling::a[1]
    // [1] = First following sibling (immediately next)
    // WHEN: You don't know exact text of next element
    // WHY: More flexible than exact text matching
    const firstFollowing = page.locator('//a[text()="Log in"]/following-sibling::a[1]');
    const firstFollowingText = await firstFollowing.textContent();
    console.log(`First element after "Log in": "${firstFollowingText?.trim()}"`);
    
    // Example 3: Get count of all following siblings
    // XPath: //a[text()="Log in"]/following-sibling::*
    // * = Any tag type (not just <a>)
    // WHEN: You need to know how many siblings exist after reference
    // WHY: Validate page structure/completeness
    const allFollowing = page.locator('//a[text()="Log in"]/following-sibling::*');
    const followingCount = await allFollowing.count();
    console.log(`Total siblings after "Log in": ${followingCount}`);
    
    // Example 4: Get all text from following siblings
    // XPath: //a[text()="Log in"]/following-sibling::a
    // WHEN: You need to collect all following link texts
    // WHY: Verify all expected links are present
    const followingLinks = page.locator('//a[text()="Log in"]/following-sibling::a');
    const followingTexts = await followingLinks.allTextContents();
    console.log(`All links after "Log in": ${followingTexts.map(t => t.trim()).join(', ')}`);
    
    // Example 5: Get last following sibling
    // XPath: //a[text()="Log in"]/following-sibling::a[last()]
    // [last()] = Last element in the sequence
    // WHEN: You need the final element after reference
    // WHY: End of list without knowing exact count
    const lastFollowing = page.locator('//a[text()="Log in"]/following-sibling::a[last()]');
    const lastFollowingText = await lastFollowing.textContent();
    console.log(`Last link after "Log in": "${lastFollowingText?.trim()}"`);
    
    // Example 6: Using following-sibling with contains()
    // XPath: //a[text()="Log in"]/following-sibling::a[contains(text(), "Contact")]
    // WHEN: You know partial text of following element
    // WHY: More flexible than exact text for dynamic content
    const followingContains = page.locator('//a[text()="Log in"]/following-sibling::a[contains(text(), "Contact")]');
    const followingContainsExists = await followingContains.count();
    console.log(`Following link containing "Contact": ${followingContainsExists > 0}`);
    
    // ====================================================================
    // PRECEDING-SIBLING:: EXAMPLES
    // ====================================================================
    
    // Example 7: Basic preceding-sibling - previous element before reference
    // XPath: //a[text()="Register"]/preceding-sibling::a[text()="Log in"]
    // Translation: Find <a> with "Register", then find its preceding sibling <a> with "Log in"
    // WHEN: You know later element and need to find earlier element
    // WHY: Navigate backward in sequences
    const precedingSiblingExact = page.locator('//a[text()="Register"]/preceding-sibling::a[text()="Log in"]');
    await expect(precedingSiblingExact).toBeVisible();
    console.log('✓ Found "Log in" as preceding-sibling of "Register"');
    
    // Example 8: Get first (closest) preceding sibling
    // XPath: //a[text()="Register"]/preceding-sibling::a[1]
    // [1] = First/closest preceding sibling (immediately previous)
    // WHEN: You need the element immediately before reference
    // WHY: Find closest related element without knowing all positions
    const firstPreceding = page.locator('//a[text()="Register"]/preceding-sibling::a[1]');
    const firstPrecedingText = await firstPreceding.textContent();
    console.log(`Element before "Register": "${firstPrecedingText?.trim()}"`);
    
    // Example 9: Get count of all preceding siblings
    // XPath: //a[text()="Register"]/preceding-sibling::*
    // WHEN: You need to know how many siblings come before reference
    // WHY: Validate element position in sequence
    const allPreceding = page.locator('//a[text()="Register"]/preceding-sibling::*');
    const precedingCount = await allPreceding.count();
    console.log(`Total siblings before "Register": ${precedingCount}`);
    
    // Example 10: Real-world use case - Find label for input field
    // XPath: //input[@id="small-searchterms"]/preceding-sibling::label[1]
    // WHEN: Input field has preceding label
    // WHY: Verify form structure and accessibility
    const searchInput = page.locator('//input[@id="small-searchterms"]');
    const searchLabel = page.locator('//input[@id="small-searchterms"]/preceding-sibling::label[1]');
    const labelText = await searchLabel.textContent();
    console.log(`Label for search input: "${labelText?.trim()}"`);
    
    // Example 11: Practical scenario - Multiple preceding siblings
    // XPath: //element/preceding-sibling::element[2]
    // [2] = Skip first, get second preceding sibling
    // WHEN: You need a specific non-immediate preceding element
    // WHY: Skip one, access grandparent's sibling
    const secondPreceding = page.locator('//a[text()="Register"]/preceding-sibling::a[2]');
    const secondPrecedingExists = await secondPreceding.count();
    console.log(`Second preceding link exists: ${secondPrecedingExists > 0}`);
    
    // Example 12: Complex condition with preceding-sibling
    // XPath: //input/preceding-sibling::label[@for][1]
    // WHEN: Multiple preceding labels, need one with @for attribute
    // WHY: Precise matching using attribute conditions
    const labelWithFor = page.locator('//input/preceding-sibling::label[@for][1]');
    const labelWithForExists = await labelWithFor.count();
    console.log(`Preceding label with @for attribute: ${labelWithForExists > 0}`);
    
    // ====================================================================
    // COMBINING BOTH AXES
    // ====================================================================
    
    // Example 13: Element between two known elements
    // XPath: //a[preceding-sibling::a[text()="Log in"] and following-sibling::a[text()="Contact"]]
    // WHEN: Element is surrounded by known siblings
    // WHY: Precise targeting using surrounding context
    const between = page.locator('//a[preceding-sibling::a[text()="Log in"] and following-sibling::a[text()="Contact"]]');
    const betweenCount = await between.count();
    console.log(`Elements between "Log in" and "Contact": ${betweenCount}`);
    
    // Example 14: Performance comparison and best practices
    console.log(`
    SIBLING AXES BEST PRACTICES:
    ============================
    WHEN TO USE following-sibling::
    ✓ Next button in form
    ✓ Related content after section
    ✓ Menu items after active item
    ✓ Elements logically after reference
    
    WHEN TO USE preceding-sibling::
    ✓ Label before input field
    ✓ Title before content
    ✓ Previous item in sequence
    ✓ Elements logically before reference
    
    FILTERING OPTIONS:
    [1]      - First (most common, performant)
    [2]      - Second element
    [last()] - Final element (less performant)
    [position()=1] - Alternative syntax
    
    ADVANTAGES:
    ✓ Relationship-based (more resilient)
    ✓ No dependency on absolute positions
    ✓ Readable and maintainable
    ✓ Works with dynamic content
    ✓ Fast operation (limited scope)
    
    LIMITATIONS:
    ✗ Both elements must share same parent
    ✗ Order matters (direction is important)
    ✗ Doesn't work across different parents
    ✗ Can be verbose with multiple conditions
    `);
});

/*
================================================================================
XPATH VERTICAL AXES - ancestor::, descendant::, self:: (DETAILED)
================================================================================

OVERVIEW:
These axes navigate UP/DOWN the DOM hierarchy (parent-child relationships).
Unlike sibling axes which are HORIZONTAL, these are VERTICAL navigation.

ancestor:: AXIS - NAVIGATE UPWARD (↑)
=====================================
Definition: Selects all ancestor elements (parents, grandparents, etc.)
Direction: UP toward root element (<html>)
Scope: From immediate parent all way to document root
Returns: Multiple ancestors in document order
Syntax: element/ancestor::type[condition]

KEY FACTS:
- [1] = immediate parent (closest ancestor)
- [2] = grandparent
- [last()] = furthest ancestor (usually <html> or <body>)
- ancestor::* = any type of ancestor
- Searches UP from current position

descendant:: AXIS - NAVIGATE DOWNWARD (↓)
==========================================
Definition: Selects all descendant elements at any depth level
Direction: DOWN toward leaf elements
Scope: All children, grandchildren, etc. nested inside
Returns: Multiple descendants in document order
Syntax: element/descendant::type[condition]

KEY FACTS:
- Similar to // (double slash)
- Different from / (slash) which only gets direct children
- [1] = first matching descendant
- [last()] = last matching descendant
- descendant::* = any type of descendant

self:: AXIS - VALIDATE CURRENT (=)
==================================
Definition: Selects the current element itself
Direction: NONE (stays on current node)
Scope: Only the element itself
Returns: 0 or 1 (returns element if matches condition, else nothing)
Syntax: element/self::type[condition]

KEY FACTS:
- Returns element if type matches, else nothing
- Rarely practical (initial selector already specifies type)
- Mostly used for validation or complex filtering
- self::* = any type (always returns self if it exists)

VISUAL DOM STRUCTURE EXAMPLE:
===========================
<html>                                      ← ancestor::* (all)
  <body>                                    ← ancestor::body
    <div id="main" class="container">       ← ancestor::div
      <form method="post">                  ← ancestor::form
        <fieldset>                          ← ancestor::fieldset
          <label for="user">Username</label>
          <input id="user" type="text"/>    ← [CURRENT POSITION]
        </fieldset>                         ← ancestor::fieldset[1]
      </form>                               ← ancestor::form[1]
    </div>                                  ← ancestor::div[1]
  </body>
</html>

ELEMENT RELATIONSHIPS:
- input's ancestor::form = <form> (2 levels up)
- input's ancestor::div = <div id="main"> (3 levels up)
- input's ancestor::input = NOTHING (input is not its own ancestor)
- form's descendant::input = <input> (nested anywhere inside)
- div's descendant::input = <input> (nested at any depth)

COMPARISON - / vs /descendant:: vs /ancestor::
===============================================
/ (child axis)                 = Direct children only
//descendant::                 = Any descendant at any depth
/ancestor::                    = Any ancestor upward
//                             = descendant-or-self (includes current)

PRACTICAL DIFFERENCES:
//form/input                   = Only direct child <input> (FAILS if nested)
//form/descendant::input       = Any <input> in form (WORKS always)
//form//input                  = Any <input> in form (WORKS always - same as above)
//form/ancestor::div           = Find <div> ancestor of form
//input/ancestor::form         = Find <form> ancestor of input

AXES COMPLEXITY TABLE:
┌──────────────────┬─────────────┬──────────────┬──────────────┬──────────┐
│ Aspect           │ ancestor::  │ descendant:: │ child /      │ self::   │
├──────────────────┼─────────────┼──────────────┼──────────────┼──────────┤
│ Direction        │ UP (↑)      │ DOWN (↓)     │ DOWN 1 level │ NONE (=) │
│ Scope            │ To parents  │ To children  │ Direct only  │ Current  │
│ Returns count    │ Multiple    │ Multiple     │ Multiple     │ 0 or 1   │
│ [1] meaning      │ Parent      │ 1st child    │ 1st child    │ N/A      │
│ [last()]         │ Root        │ Last child   │ Last child   │ N/A      │
│ Common use       │ 30%         │ 60%          │ 50%          │ 10%      │
└──────────────────┴─────────────┴──────────────┴──────────────┴──────────┘
*/

test('XPath vertical axes - ancestor, descendant, self (comprehensive)', async ({page}) => {
    await page.goto('https://demowebshop.tricentis.com/');
    
    // ====================================================================
    // ANCESTOR:: DETAILED EXAMPLES
    // ====================================================================
    
    // Example 1: Find immediate parent <a> of logo image
    // XPath: //img[@alt="Tricentis Demo Web Shop"]/ancestor::a
    // Analysis:
    //   - Start: Find <img> with alt text
    //   - Navigate: Go UP to find <a> ancestor
    //   - Return: The <a> element (immediate parent)
    // DOM: <a><img alt="Tricentis..."/></a>
    // Result: Returns the <a> wrapper
    console.log('--- ANCESTOR:: EXAMPLES ---');
    const ancestorLink = page.locator('//img[@alt="Tricentis Demo Web Shop"]/ancestor::a');
    const ancestorExists = await ancestorLink.count();
    console.log(`1. Logo image has <a> ancestor: ${ancestorExists > 0}`);
    const ancestorHref = await ancestorLink.getAttribute('href');
    console.log(`   Ancestor <a> href: ${ancestorHref}`);
    
    // Example 2: Find div ancestor (go up further)
    // XPath: //img[@alt="Tricentis Demo Web Shop"]/ancestor::div[1]
    // [1] = closest div ancestor
    // Navigates UP until finding first <div>
    const ancestorDiv = page.locator('//img[@alt="Tricentis Demo Web Shop"]/ancestor::div[1]');
    const ancestorDivClass = await ancestorDiv.getAttribute('class');
    console.log(`2. Logo image's closest <div> ancestor: class="${ancestorDivClass}"`);
    
    // Example 3: Get ALL ancestors (any type)
    // XPath: //img[@alt="Tricentis Demo Web Shop"]/ancestor::*
    // ancestor::* = ANY element type in ancestors
    // Returns: All parents, grandparents, great-grandparents up to <html>
    const allAncestors = page.locator('//img[@alt="Tricentis Demo Web Shop"]/ancestor::*');
    const ancestorCount = await allAncestors.count();
    console.log(`3. Total ancestors of logo image: ${ancestorCount} (from parent to <html>)`);
    
    // Example 4: Get specific ancestor type
    // XPath: //input[@id="small-searchterms"]/ancestor::form
    // Finds form that contains this input (at any depth up)
    // Useful: When you need to interact with the whole form
    const inputForm = page.locator('//input[@id="small-searchterms"]/ancestor::form');
    const formExists = await inputForm.count();
    console.log(`4. Search input in form: ${formExists > 0}`);
    
    // Example 5: Ancestor with condition
    // XPath: //a[@class="ico-register"]/ancestor::div[@class*="header"]
    // Find ancestor <div> that has "header" in class name
    const headerDiv = page.locator('//a[@class="ico-register"]/ancestor::div[contains(@class, "header")]');
    const headerExists = await headerDiv.count();
    console.log(`5. Register link has header ancestor: ${headerExists > 0}`);
    
    // Example 6: Multiple ancestors filtered
    // ancestor::element[position]
    // [1] = closest match
    // [2] = next match further up
    const parent = page.locator('//img[@alt="Tricentis Demo Web Shop"]/ancestor::*[1]');
    const parentTag = await page.evaluate(() => {
        const elem = document.querySelector('img[alt="Tricentis Demo Web Shop"]')?.parentElement;
        return elem?.tagName;
    });
    console.log(`6. Immediate parent tag: <${parentTag}>`);
    
    // ====================================================================
    // DESCENDANT:: DETAILED EXAMPLES
    // ====================================================================
    
    console.log('\n--- DESCENDANT:: EXAMPLES ---');
    
    // Example 1: Find image in container
    // XPath: //div[@class="header-logo"]/descendant::img
    // Analysis:
    //   - Start: Find <div class="header-logo">
    //   - Navigate: Look INSIDE for <img> at any depth
    //   - Return: The <img> element (even through nested <a>)
    // DOM: <div><a><img/></a></div>
    // Result: Returns the <img> (works through <a> nesting)
    const descendantImg = page.locator('//div[@class="header-logo"]/descendant::img');
    const imgExists = await descendantImg.count();
    console.log(`1. Header logo div has descendant <img>: ${imgExists > 0}`);
    const imgSrc = await descendantImg.getAttribute('src');
    console.log(`   Image src: ${imgSrc}`);
    
    // Example 2: Get ALL descendants (any type)
    // XPath: //div[@class="header-logo"]/descendant::*
    // descendant::* = ANY element inside
    // Returns: All nested elements regardless of type
    const allDescendants = page.locator('//div[@class="header-logo"]/descendant::*');
    const descendantCount = await allDescendants.count();
    console.log(`2. Total descendants in header-logo: ${descendantCount}`);
    
    // Example 3: Get specific descendant type
    // XPath: //ul[@class="top-menu"]/descendant::a
    // Find all <a> elements nested in menu list
    // Works for menu items at any nesting level
    const menuLinks = page.locator('//ul[@class="top-menu"]/descendant::a');
    const linkCount = await menuLinks.count();
    console.log(`3. Links in top menu: ${linkCount}`);
    
    // Example 4: Get texts from all descendants
    // XPath: //ul[@class="top-menu"]/descendant::a
    // allTextContents() gets text from all matched descendants
    const menuTexts = await menuLinks.allTextContents();
    console.log(`4. Menu link texts: ${menuTexts.map(t => t.trim()).join(', ')}`);
    
    // Example 5: Descendant with condition
    // XPath: //div[@id="main"]/descendant::input[@type="text"]
    // Find all text inputs nested anywhere in main div
    const textInputs = page.locator('//div/descendant::input[@type="text"]');
    const textInputCount = await textInputs.count();
    console.log(`5. Text inputs on page: ${textInputCount}`);
    
    // Example 6: KEY DIFFERENCE - / (child) vs /descendant::
    // These WORK DIFFERENTLY:
    // //ul[@class="top-menu"]/li          = Only direct child <li> (direct nesting)
    // //ul[@class="top-menu"]/descendant::li = Any <li> at any depth (safer)
    const directLi = page.locator('//ul[@class="top-menu"] > li');
    const anyLi = page.locator('//ul[@class="top-menu"]/descendant::li');
    const directCount = await directLi.count();
    const anyCount = await anyLi.count();
    console.log(`6. Direct child <li>: ${directCount}, Any descendant <li>: ${anyCount}`);
    
    // ====================================================================
    // SELF:: DETAILED EXAMPLES
    // ====================================================================
    
    console.log('\n--- SELF:: EXAMPLES ---');
    
    // Example 1: Basic self (usually redundant)
    // XPath: //a[@class="ico-register"]/self::a
    // Analysis:
    //   - Start: Find <a class="ico-register">
    //   - Confirm: It IS an <a> element (/self::a)
    //   - Return: The same <a> (if condition matches)
    // Note: This is redundant because //a already ensures it's an <a>
    const selfLink = page.locator('//a[@class="ico-register"]/self::a');
    const selfCount = await selfLink.count();
    console.log(`1. //a[@class="ico-register"]/self::a returns: ${selfCount} (same as //a)`);
    
    // Example 2: self with type mismatch (returns nothing)
    // XPath: //a[@class="ico-register"]/self::div
    // Checking if <a> is also a <div> = FALSE
    // Returns: Nothing (0 elements) because <a> is not <div>
    const selfAsDiv = page.locator('//a[@class="ico-register"]/self::div');
    const divCount = await selfAsDiv.count();
    console.log(`2. //a/self::div returns: ${divCount} (impossible - <a> is not <div>)`);
    
    // Example 3: More practical - self with attribute condition
    // XPath: //a[@class="ico-register"]/self::a[@href]
    // Confirm: Element IS <a> AND has @href attribute
    // Slightly more useful than bare self::a
    const selfWithHref = page.locator('//a[@class="ico-register"]/self::a[@href]');
    const hrefCount = await selfWithHref.count();
    console.log(`3. //a/self::a[@href] validates <a> has href: ${hrefCount > 0}`);
    
    // Example 4: self with complex condition
    // XPath: //a/self::a[starts-with(@href, "/")]
    // More practical: Validate <a> is of correct type AND href starts with "/"
    const selfCondition = page.locator('//a/self::a[starts-with(@href, "/")]');
    const conditionCount = await selfCondition.count();
    console.log(`4. Links starting with /: ${conditionCount}`);
    
    // Example 5: Practical use - validate before action
    // Ensure element IS the type you expect before interacting
    const registerLink = page.locator('//a[@class="ico-register"]/self::a');
    if (await registerLink.count() > 0) {
        console.log(`5. Confirmed element is <a>, safe to click`);
        // await registerLink.click(); // Would be safe
    }
    
    // ====================================================================
    // SUMMARY TABLE
    // ====================================================================
    console.log(`
    XPATH VERTICAL AXES REFERENCE:
    ==============================
    
    ancestor:: (UP ↑)
    ✓ Purpose: Find parent/container of element
    ✓ Syntax: //child/ancestor::parent
    ✓ Returns: All ancestors from parent to <html>
    ✓ [1] = Immediate parent
    ✓ [last()] = Root ancestor (<html>)
    ✓ Examples:
      - //img/ancestor::a           - Link containing image
      - //input/ancestor::form      - Form containing input
      - //button/ancestor::div[@id] - Div container with id
    
    descendant:: (DOWN ↓)
    ✓ Purpose: Find nested elements inside container
    ✓ Syntax: //parent/descendant::child
    ✓ Returns: All descendants at any depth
    ✓ [1] = First descendant
    ✓ [last()] = Last descendant
    ✓ Examples:
      - //form/descendant::input      - All inputs in form
      - //div[@id="main"]/descendant::button - All buttons in main
      - //ul/descendant::a            - All links in list
    
    self:: (CURRENT =)
    ✓ Purpose: Validate element type (rarely needed)
    ✓ Syntax: //element/self::type[condition]
    ✓ Returns: Element if matches, else nothing
    ✓ Rarely practical (//a already means <a>)
    ✓ Use: Complex multi-condition filters
    ✓ Examples:
      - //a/self::a[@href]       - Confirm <a> has href
      - //button/self::button    - Validate is button (redundant)
    
    DECISION TREE:
    "I know parent, need nested child?"        → Use descendant::
    "I know child, need parent/container?"     → Use ancestor::
    "I need to validate element type?"         → Use self:: (rarely)
    "I need siblings (same level)?"            → Use preceding/following-sibling::
    `)
});

test('Test parent and child axes - Explicit direct relationships', async ({ page }) => {
    await page.goto('https://demowebshop.tricentis.com/');
    
    console.log('=== parent:: AXIS - Direct Parent Only ===\n');
    
    // AXIS DEFINITION: parent:: selects the direct parent element only
    // RETURNS: Single element (the immediate parent) or nothing
    // KEY: parent:: [1] and parent:: [2] don't exist (max 1 parent!)
    // SIMILAR TO: ancestor::*[1] but more explicit about intent
    
    // Example 1: Basic parent selection
    // XPath: //img[@alt="Tricentis Demo Web Shop"]/parent::*
    // Returns: The direct parent of the image (should be <a>)
    const logo = page.locator('//img[@alt="Tricentis Demo Web Shop"]').first();
    const logoParent = page.locator('//img[@alt="Tricentis Demo Web Shop"]/parent::*');
    const parentTag = await logoParent.evaluate((el) => el.tagName);
    console.log(`1. Logo parent tag: <${parentTag}>`);
    
    // Example 2: parent:: with type filter
    // XPath: //img[@alt="Tricentis Demo Web Shop"]/parent::a
    // Returns: Parent ONLY if it's an <a> (else nothing)
    const logoParentA = page.locator('//img[@alt="Tricentis Demo Web Shop"]/parent::a');
    const isLink = await logoParentA.count() > 0;
    console.log(`2. Logo's parent is <a>: ${isLink}`);
    
    // Example 3: parent:: vs ancestor:: count difference
    // parent:: returns only 1 (immediate parent)
    // ancestor:: returns all (every parent up to root)
    const parentCount = await page.locator('//img[@alt="Tricentis Demo Web Shop"]/parent::*').count();
    const ancestorCount = await page.locator('//img[@alt="Tricentis Demo Web Shop"]/ancestor::*').count();
    console.log(`\n3. parent::* count: ${parentCount} (only immediate)`);
    console.log(`   ancestor::* count: ${ancestorCount} (all levels up)`);
    
    // Example 4: parent:: with attribute condition
    // XPath: //input[@id="small-searchterms"]/parent::*[@class]
    // Returns: Parent only if it has class attribute
    const searchInput = page.locator('//input[@id="small-searchterms"]');
    const parentWithClass = page.locator('//input[@id="small-searchterms"]/parent::*[@class]');
    const hasClass = await parentWithClass.count() > 0;
    console.log(`4. Search input parent has class: ${hasClass}`);
    
    // Example 5: Practical - Get form containing input
    // XPath: //input[@name="q"]/parent::form
    // Often you have input/button, need to access its containing form
    const formParent = page.locator('//input[contains(@id, "search")]/parent::form').first();
    const formAction = await formParent.getAttribute('action');
    console.log(`5. Form parent action: ${formAction || 'form not found'}`);
    
    // Example 6: Multiple parent:: calls (navigating up)
    // XPath: //img[@alt="Tricentis Demo Web Shop"]/parent::*/parent::*
    // Goes UP: img → parent → grandparent
    const grandparent = page.locator('//img[@alt="Tricentis Demo Web Shop"]/parent::*/parent::*');
    const gpTag = await grandparent.evaluate((el) => el.tagName);
    console.log(`6. Logo's grandparent tag: <${gpTag}>`);
    
    // Example 7: parent:: returns nothing if type doesn't match
    // XPath: //a/parent::table
    // If <a> parent is NOT <table>, returns nothing
    const linkParentTable = page.locator('//a[text()="Register"]/parent::table');
    const tableParent = await linkParentTable.count();
    console.log(`7. Link parent is <table>: ${tableParent > 0} (likely false)`);
    
    // Example 8: parent with complex condition
    // XPath: //a/parent::div[@class and @id]
    // Parent must be <div> with BOTH class and id attributes
    const complexParent = page.locator('//a/parent::div[@class][@id]').first();
    const complexExists = await complexParent.count() > 0;
    console.log(`8. Link parent is div with class AND id: ${complexExists}`);
    
    console.log('\n=== child:: AXIS - Direct Children Only ===\n');
    
    // AXIS DEFINITION: child:: selects only direct children (not nested)
    // RETURNS: All direct children (multiple elements)
    // SAME AS: Using > selector in CSS
    // KEY: child:: and / (slash) are equivalent in most contexts
    
    // Example 9: Basic child selection
    // XPath: //ul[@class="top-menu"]/child::li
    // Returns: All <li> that are DIRECT children of <ul>
    const topMenu = page.locator('//ul[@class="top-menu"]').first();
    const directLIs = page.locator('//ul[@class="top-menu"]/child::li');
    const liCount = await directLIs.count();
    console.log(`9. Direct <li> children of top-menu: ${liCount}`);
    
    // Example 10: child:: vs descendant:: difference
    // child:: = only 1 level deep
    // descendant:: = any depth
    // If list has nested lists, child:: won't find deeply nested items
    const childAll = page.locator('//ul/child::*');
    const descendantAll = page.locator('//ul/descendant::*');
    const childAllCount = await childAll.count();
    const descendantAllCount = await descendantAll.count();
    console.log(`10. ul > child::* count: ${childAllCount} (only 1 level)`);
    console.log(`    ul descendant::* count: ${descendantAllCount} (any depth)`);
    
    // Example 11: child:: with type filter
    // XPath: //form/child::input
    // Returns: Only <input> elements that are direct form children
    // Won't match inputs wrapped in <fieldset> or <div>
    const formChildren = page.locator('form').first();
    const directInputs = page.locator('form/child::input');
    const inputCount = await directInputs.count();
    console.log(`11. Direct <input> children of form: ${inputCount}`);
    
    // Example 12: Multiple child:: calls (navigating down)
    // XPath: //body/child::*/child::*/child::*
    // Goes DOWN: body → children → grandchildren → great-grandchildren
    const nested = page.locator('body/child::*/child::*/child::*');
    const nestedCount = await nested.count();
    console.log(`12. Three levels down from body: ${nestedCount} elements`);
    
    console.log(`
    === PARENT:: vs ANCESTOR:: vs CHILD:: vs DESCENDANT:: ===
    
    PARENT:: (Single direct parent)
    ✓ Returns: 0 or 1 element (only immediate parent)
    ✓ Syntax: //child/parent::type
    ✓ Use: When you NEED only the direct parent
    ✓ Example: //img/parent::a - Get image wrapper
    ✓ Performance: Slightly faster (limited scope)
    ✓ Similar to: ancestor::*[1]
    
    ANCESTOR:: (All parents up)
    ✓ Returns: Multiple elements (all parents)
    ✓ Syntax: //child/ancestor::type
    ✓ Use: When parent could be at any level
    ✓ Example: //img/ancestor::div - Get any div ancestor
    ✓ Flexibility: Find parent at unknown depth
    ✓ More common: More flexible for varying markup
    
    CHILD:: (Direct children only)
    ✓ Returns: Multiple elements (immediate children)
    ✓ Syntax: //parent/child::type
    ✓ Use: When you NEED only direct children
    ✓ Example: //ul/child::li - Get ul's direct items
    ✓ Same as: /parent/type or > selector in CSS
    ✓ Guaranteed: Structure is predictable
    
    DESCENDANT:: (All nested children)
    ✓ Returns: Multiple elements (any nesting depth)
    ✓ Syntax: //parent/descendant::type
    ✓ Use: When children might be nested
    ✓ Example: //form/descendant::input - Get inputs at any depth
    ✓ More reliable: Handles varying nesting levels
    ✓ More common: More flexible for varying markup
    
    PERFORMANCE NOTES:
    parent:: < ancestor:: (limited scope, faster)
    child:: < descendant:: (limited scope, faster)
    
    CHOICE GUIDE:
    Direct parent only? → parent::
    Any parent level? → ancestor::
    Direct children only? → child::
    Any nested children? → descendant::
    `);
});

test('Test following and preceding axes - Document order navigation', async ({ page }) => {
    await page.goto('https://demowebshop.tricentis.com/');
    
    console.log('=== following:: AXIS - All Elements After ===\n');
    
    // AXIS DEFINITION: following:: selects ALL elements that appear AFTER current
    // SCOPE: Not limited to siblings - includes ANY element appearing later
    // KEY: Different from following-sibling:: (siblings only)
    // DIRECTION: Forward through document in source order
    
    // Example 1: Basic following navigation
    // XPath: //a[text()="Log in"]/following::*
    // Returns: ALL elements appearing after "Log in" link
    const loginLink = page.locator('//a[text()="Log in"]');
    const afterLogin = page.locator('//a[text()="Log in"]/following::*');
    const afterCount = await afterLogin.count();
    console.log(`1. Total elements after "Log in": ${afterCount}`);
    
    // Example 2: following:: vs following-sibling:: difference
    // following-sibling:: = same parent only (limited)
    // following:: = any element (broad)
    const followingSib = page.locator('//a[text()="Log in"]/following-sibling::*');
    const following = page.locator('//a[text()="Log in"]/following::*');
    const sibCount = await followingSib.count();
    const allCount = await following.count();
    console.log(`2. following-sibling::* count: ${sibCount} (same parent)`);
    console.log(`   following::* count: ${allCount} (any element)`);
    
    // Example 3: Get specific type after reference
    // XPath: //a[text()="Log in"]/following::input
    // Returns: All <input> elements appearing after "Log in"
    const inputsAfter = page.locator('//a[text()="Log in"]/following::input');
    const inputCount = await inputsAfter.count();
    console.log(`3. <input> elements after "Log in": ${inputCount}`);
    
    // Example 4: Get first following element
    // XPath: //a[text()="Log in"]/following::*[1]
    // Returns: First element in document order after "Log in"
    const firstAfter = page.locator('//a[text()="Log in"]/following::*[1]');
    const firstTag = await firstAfter.evaluate((el) => el.tagName);
    console.log(`4. First element after "Log in": <${firstTag}>`);
    
    // Example 5: Get last following element
    // XPath: //a[text()="Log in"]/following::*[last()]
    // Returns: Last element after "Log in" (usually before </html>)
    const lastAfter = page.locator('//a[text()="Log in"]/following::*[last()]');
    const lastTag = await lastAfter.evaluate((el) => el.tagName);
    console.log(`5. Last element after "Log in": <${lastTag}>`);
    
    // Example 6: Practical - Get content after heading
    // Often: Find heading, then get all content/paragraphs after it
    const h1 = page.locator('//h1').first();
    const contentAfter = page.locator('//h1/following::p');
    const pCount = await contentAfter.count();
    console.log(`6. Paragraphs after first <h1>: ${pCount}`);
    
    // Example 7: following with condition
    // XPath: //a[@class="ico-cart"]/following::a[contains(text(), "Wish")]
    // Returns: Following <a> with "Wish" in text
    const wishAfterCart = page.locator('//a[@class="ico-cart"]/following::a[contains(text(), "Wish")]');
    const wishCount = await wishAfterCart.count();
    console.log(`7. Wishlist link after cart link: ${wishCount}`);
    
    // Example 8: Following elements count
    // Get count of elements after reference for comparison
    const refElement = page.locator('.search-box').first();
    const allAfterSearch = page.locator('.search-box/following::*');
    const afterSearchCount = await allAfterSearch.count();
    console.log(`8. Total elements after search box: ${afterSearchCount}`);
    
    console.log('\n=== preceding:: AXIS - All Elements Before ===\n');
    
    // AXIS DEFINITION: preceding:: selects ALL elements that appear BEFORE current
    // SCOPE: Not limited to siblings - includes ANY element appearing earlier
    // KEY: Different from preceding-sibling:: (siblings only)
    // DIRECTION: Backward through document in source order
    
    // Example 9: Basic preceding navigation
    // XPath: //footer/preceding::*
    // Returns: ALL elements appearing before <footer>
    const footer = page.locator('footer').first();
    const beforeFooter = page.locator('footer/preceding::*');
    const beforeCount = await beforeFooter.count();
    console.log(`9. Total elements before <footer>: ${beforeCount}`);
    
    // Example 10: preceding:: vs preceding-sibling:: difference
    // preceding-sibling:: = same parent only (limited)
    // preceding:: = any element (broad)
    const precedingSib = page.locator('footer/preceding-sibling::*');
    const preceding = page.locator('footer/preceding::*');
    const precSibCount = await precedingSib.count();
    const precAllCount = await preceding.count();
    console.log(`10. preceding-sibling::* count: ${precSibCount} (same parent)`);
    console.log(`    preceding::* count: ${precAllCount} (any element)`);
    
    // Example 11: Get specific type before reference
    // XPath: //footer/preceding::div
    // Returns: All <div> elements appearing before <footer>
    const divsBeforeFooter = page.locator('footer/preceding::div');
    const divCount = await divsBeforeFooter.count();
    console.log(`11. <div> elements before <footer>: ${divCount}`);
    
    // Example 12: Get last preceding element (closest before)
    // XPath: //footer/preceding::*[1]
    // Note: [1] in preceding:: means LAST in document (positions reversed!)
    const lastBefore = page.locator('footer/preceding::*[1]');
    const lastBeforeTag = await lastBefore.evaluate((el) => el.tagName);
    console.log(`12. Last element before <footer>: <${lastBeforeTag}>`);
    
    // Example 13: Get first preceding element (furthest before)
    // XPath: //footer/preceding::*[last()]
    // [last()] in preceding:: means FIRST in document
    const firstBefore = page.locator('footer/preceding::*[last()]');
    const firstBeforeTag = await firstBefore.evaluate((el) => el.tagName);
    console.log(`13. First element before <footer>: <${firstBeforeTag}>`);
    
    // Example 14: Practical - Find label before input
    // Often: Have input, need to find its label (which appears before)
    const inputWithLabel = page.locator('//input[@id="small-searchterms"]');
    const labelBefore = page.locator('//input[@id="small-searchterms"]/preceding::label').first();
    const labelText = await labelBefore.textContent();
    console.log(`14. Label before search input: ${labelText?.trim() || 'not found'}`);
    
    // Example 15: Practical - Find related form element
    // Often: Have button, need to find form element before it
    const buttonElement = page.locator('button:has-text("Search")').first();
    const formsBefore = page.locator('button:has-text("Search")/preceding::form');
    const formsCount = await formsBefore.count();
    console.log(`15. Forms before search button: ${formsCount}`);
    
    console.log(`
    === COMPREHENSIVE AXES REFERENCE TABLE ===
    
    ┌──────────────────┬───────────┬──────────────┬──────────────┐
    │ Axis             │ Direction │ Scope        │ Key Feature  │
    ├──────────────────┼───────────┼──────────────┼──────────────┤
    │ parent::         │ UP        │ Direct only  │ Single elem  │
    │ ancestor::       │ UP        │ All levels   │ Multiple     │
    │ child::          │ DOWN      │ Direct only  │ Direct level │
    │ descendant::     │ DOWN      │ All levels   │ Any depth    │
    │ following-sibling│ FORWARD   │ Siblings     │ Same parent  │
    │ following::      │ FORWARD   │ Any element  │ Document ord │
    │ preceding-sibling│ BACKWARD  │ Siblings     │ Same parent  │
    │ preceding::      │ BACKWARD  │ Any element  │ Document ord │
    │ self::           │ NONE      │ Current only │ Validation   │
    └──────────────────┴───────────┴──────────────┴──────────────┘
    
    DECISION MATRIX:
    
    "Need parent?"
    └─ "Only immediate parent?" → parent::
    └─ "Any parent level?" → ancestor::
    
    "Need children?"
    └─ "Only direct children?" → child::
    └─ "Any nesting level?" → descendant::
    
    "Need elements after?"
    └─ "At same parent level?" → following-sibling::
    └─ "Anywhere in document?" → following::
    
    "Need elements before?"
    └─ "At same parent level?" → preceding-sibling::
    └─ "Anywhere in document?" → preceding::
    
    "Validating element type?" → self::
    
    PERFORMANCE TIPS:
    ✓ Specific types faster than ::* (filters early)
    ✓ Sibling axes faster than document order axes
    ✓ Higher specificity = better performance
    ✓ Direct (parent/child) faster than distant (ancestor/descendant)
    `);
});
