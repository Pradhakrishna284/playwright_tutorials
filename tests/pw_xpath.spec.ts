//https://www.youtube.com/watch?v=ZQ3upj6H2gI&list=PLUDwpEzHYYLtvMVjc-Va3RXLKtdB-ofc2&index=3
//https://www.youtube.com/watch?v=-gselrc9Py8&list=PLUDwpEzHYYLtvMVjc-Va3RXLKtdB-ofc2&index=4

import {test, expect, Locator} from '@playwright/test';

test.skip('1. Absolute Xpath - Logo', async ({ page }) => {
    // Absolute XPath: Full path from root element to target
    // WHEN: You know the exact DOM structure from html root
    // WHY: Provides precise targeting but breaks easily with DOM changes
    await page.goto('https://demowebshop.tricentis.com/')
    const absoluteLogo: Locator = page.locator('/html[1]/body[1]/div[4]/div[1]/div[1]/div[1]/a[1]/img[1]')
    await expect(absoluteLogo).toBeVisible()
});

test('2. Relative Xpath - Logo', async ({ page }) => {
    // Relative XPath: Starts from any element matching the selector
    // WHEN: You know a unique attribute of the target element
    // WHY: More robust than absolute paths; resistant to DOM structure changes
    await page.goto('https://demowebshop.tricentis.com/')
    const relativeLogo: Locator = page.locator('//img[@src="/Themes/DefaultClean/Content/images/logo.png"]')
    await expect(relativeLogo).toBeVisible()
});

test('3. Locate element by exact text using XPath', async ({ page }) => {
    // Exact text matching: text() function finds elements with exact text
    // WHEN: You need to locate element by its exact text content
    // WHY: Precise matching when text is unique; useful for buttons, links, labels
    await page.goto('https://demowebshop.tricentis.com/')
    const exactTextLocator: Locator = page.locator('//a[text()="Register"]')
    await expect(exactTextLocator).toBeVisible()
});

test('4. Locate element by partial text using XPath contains()', async ({ page }) => {
    // Partial text matching: contains() function finds elements with matching substring
    // WHEN: You only know part of the text or text varies slightly
    // WHY: Flexible matching for dynamic content or long text strings
    await page.goto('https://demowebshop.tricentis.com/')
    const partialTextLocator: Locator = page.locator('//a[contains(text(), "Log")]');
    await expect(partialTextLocator).toBeVisible()
});

test('5. Locate element by attribute using XPath', async ({ page }) => {
    // Attribute matching: [@attribute="value"] targets elements by specific attributes
    // WHEN: Element has unique ID, name, class, or other identifying attributes
    // WHY: Most reliable for automation; doesn't depend on text content
    await page.goto('https://demowebshop.tricentis.com/')
    const attributeLocator: Locator = page.locator('//input[@id="small-searchterms"]')
    await expect(attributeLocator).toBeVisible()
});

test('6. Locate multiple elements and verify count', async ({ page }) => {
    // XPath with multiple elements: count() determines number of matching elements
    // WHEN: You need to verify a list has expected number of items
    // WHY: Validates structure and ensures all expected items are present
    await page.goto('https://demowebshop.tricentis.com/')
    const productsMenu: Locator = page.locator("//ul[@class='top-menu']/li")
    const productsCount = await productsMenu.count()   
    expect(productsCount).toBeGreaterThan(0) 
    expect(productsCount).toBe(7)

    // allTextContents(): Returns array of text content for ALL matching elements
    // WHEN: You need text from multiple elements
    // WHY: Efficiently retrieves text from all matches in one call
    const products: string[] = await productsMenu.allTextContents()
    console.log('All Products in the menu: ', products);

    for (let i=0; i<products.length; i++) {
        console.log(`Product at index ${i}: ${products[i]}`);
    }

    for(const product of products) {
        console.log('Product: ' + product);
    }
    
    // textContent(): Returns text content from FIRST matching element only
    // WHEN: You need text from a specific single element
    // WHY: Gets text from one element (first by default, or use .nth() for others)
    console.log('First Product (using first()): ' + await productsMenu.first().textContent())
    
    // textContent() with nth(): Gets text from a specific element at given index
    // WHEN: You need text from a specific position in the list
    // WHY: More targeted than allTextContents() when you only need one specific element
    console.log('Element at index 0 (using nth(0)): ' + await productsMenu.nth(0).textContent());
    console.log('Element at index 1 (using nth(1)): ' + await productsMenu.nth(1).textContent());
    
    // Difference Summary:
    // allTextContents() - Gets ALL elements' text at once - array return
    // textContent()     - Gets ONE element's text only - string return
    
});

test('7. Locate element using complex XPath with AND/OR conditions', async ({ page }) => {
    const complexLocator: Locator = page.locator('//a[contains(text(), "Computers") and @href]');
    const count: number = await complexLocator.count();
    await expect(complexLocator).toHaveCount(count);
    console.log('Number of elements matching complex XPath: ' + count);

    const alternativeLocator: Locator = page.locator('//a[@href="/computers" or @href="/electornics"]');
    const altCount: number = await alternativeLocator.count();
    await expect(alternativeLocator).toHaveCount(altCount);
    console.log('Number of elements matching alternative XPath: ' + altCount);  
});

/*
================================================================================
TEXT() vs NORMALIZE-SPACE() - DIFFERENCE AND USAGE
================================================================================

text() FUNCTION - Gets exact text content (with ALL whitespace)
- Returns: Text exactly as it appears in HTML (includes spaces, tabs, newlines)
- Use when: Text has NO extra whitespace or you need exact match
- Speed: Faster (no processing)
- Example: <a>Register</a> matches //a[text()="Register"]
- Problem: <a>  Register  </a> WON'T match //a[text()="Register"] (has extra spaces)

normalize-space() FUNCTION - Removes leading/trailing whitespace and collapses internal whitespace
- Returns: Cleaned text (all extra whitespace removed and internal whitespace becomes single space)
- Use when: Text might have extra whitespace, tabs, newlines, line breaks
- Speed: Slightly slower (whitespace processing)
- Example: <a>  Register  </a> matches //a[normalize-space()="Register"]
- Advantage: Handles poorly formatted HTML with extra spacing

WHITESPACE HANDLING:
text()            → " Hello  World " → " Hello  World " (unchanged)
normalize-space() → " Hello  World " → "Hello World" (cleaned)

KEY DIFFERENCES:
1. WHITESPACE: text() keeps all whitespace, normalize-space() removes/collapses it
2. MATCHING: text() requires exact whitespace match, normalize-space() is forgiving
3. USE CASE: text() for clean HTML, normalize-space() for real-world messy HTML
4. PERFORMANCE: text() slightly faster, normalize-space() has processing overhead

WHEN TO USE WHICH:
✓ text(): Web apps with clean, consistent HTML formatting
✓ normalize-space(): Real websites with inconsistent whitespace, indentation, line breaks
✗ text(): HTML with extra spaces/tabs (use normalize-space() instead)
✗ normalize-space(): When you need to preserve whitespace differences

PRACTICAL EXAMPLES:
✓ //button[text()="Click Me"]           - Clean HTML button
✓ //label[normalize-space()="Username"] - Label with extra spaces/lines
✓ //a[text()="Register"]                - Simple links
✓ //a[normalize-space()="Sign Up"]      - Links with messy formatting
*/

test('8. text() vs normalize-space() - Handling whitespace in text matching', async ({ page }) => {
    await page.goto('https://demowebshop.tricentis.com/')
    
    // Example 1: Using text() - Exact text matching (no extra whitespace)
    // WHEN: HTML is clean and consistently formatted
    // WHY: Faster and works with clean HTML
    const registerLink = page.locator('//a[text()="Register"]');
    await expect(registerLink).toBeVisible();
    console.log('Found element using text() with exact match');
    
    // Example 2: Using normalize-space() - Text matching that ignores whitespace issues
    // WHEN: HTML might have extra spaces, tabs, or line breaks
    // WHY: Handles real-world messy HTML that often has formatting whitespace
    const registerLinkNormalized = page.locator('//a[normalize-space()="Register"]');
    await expect(registerLinkNormalized).toBeVisible();
    console.log('Found element using normalize-space() - whitespace tolerant');
    
    // Example 3: Comparing contains() with text() vs normalize-space()
    // text() - exact substring with whitespace preservation
    const containsText = page.locator('//a[contains(text(), "egiste")]');
    const containsCount1 = await containsText.count();
    console.log(`Elements found with contains(text()): ${containsCount1}`);
    
    // normalize-space() - substring matching with whitespace tolerance
    const containsNormalized = page.locator('//a[contains(normalize-space(), "egiste")]');
    const containsCount2 = await containsNormalized.count();
    console.log(`Elements found with contains(normalize-space()): ${containsCount2}`);
    
    // Example 4: Real-world scenario - finding element with messy whitespace
    // Imagine HTML like: <button>  Click   Here  </button>
    // This would NOT match: //button[text()="Click Here"] ❌
    // This WOULD match: //button[normalize-space()="Click Here"] ✓
    const buttons = page.locator('//button[normalize-space()="Add to cart"]');
    const buttonCount = await buttons.count();
    console.log(`Buttons found with normalize-space(): ${buttonCount}`);
    
    // Example 5: Summary - when each is appropriate
    // For automated testing of modern web apps, normalize-space() is usually safer
    const menuItems = page.locator("//ul[@class='top-menu']/li");
    const menuTexts = await menuItems.allTextContents();
    
    // These would work because browser-rendered text is clean
    for (const text of menuTexts) {
        const exactMatch = page.locator(`//li[text()="${text.trim()}"]`);
        const normalMatch = page.locator(`//li[normalize-space()="${text.trim()}"]`);
        console.log(`Menu item: "${text}"`);
    }
});

test('8. Locate element by position using XPath', async ({ page }) => {
    // Position-based XPath: (//tag)[index] selects element by its order
    // WHEN: You need to target an element based on its position in a list      
    // WHY: Useful when elements lack unique attributes or text
    await page.goto('https://demowebshop.tricentis.com/')
    const positionLocator: Locator = page.locator('(//div[@class="product-item"])[1]')
    await expect(positionLocator).toBeVisible()
});

test('9. Locate element by text normalization using XPath normalize-space()', async ({ page }) => {
    // Text normalization: normalize-space() removes leading/trailing spaces
    // WHEN: You need to match text but want to ignore extra whitespace 
    // WHY: Ensures reliable matching despite formatting inconsistencies        
    await page.goto('https://demowebshop.tricentis.com/')
    const normalizeLocator: Locator = page.locator('//a[normalize-space(text())="About us"]')
    await expect(normalizeLocator).toBeVisible()
});

test('10. Locate element by using XPath starts-with()', async ({ page }) => {
    // starts-with() function: Matches elements where text starts with specified string
    // WHEN: You need to find elements based on text prefixes               
    // WHY: Useful for dynamic text that shares common beginnings        
    await page.goto('https://demowebshop.tricentis.com/')
    const startsWithLocator: Locator = page.locator('//h2/a[starts-with(@href, "/build")]')
    const count: number = await startsWithLocator.count();
    await expect(startsWithLocator).toHaveCount(count);
    console.log('Number of elements matching starts-with XPath: ' + count);
    expect(count).toBeGreaterThan(0)
});

test.skip('11. Locate element by using XPath ends-with()', async ({ page }) => {
    // ends-with() function: Matches elements where attribute ends with specified string
    // WHEN: You need to find elements based on attribute suffixes
    // WHY: Useful for dynamic attributes that share common endings 
    await page.goto('https://demowebshop.tricentis.com/')
    const endsWithLocator: Locator = page.locator('//img[ends-with(@src, "logo.png")]')
    const count: number = await endsWithLocator.count();
    await expect(endsWithLocator).toHaveCount(count);
    console.log('Number of elements matching ends-with XPath: ' + count);
    expect(count).toBeGreaterThan(0)
});

test('12. Locate element using XPath with parent-child relationship', async ({ page }) => {
    // Parent-child XPath: / selects direct child, // selects any descendant
    // WHEN: You need to navigate hierarchical relationships in the DOM
    // WHY: Precise targeting based on element hierarchy
    await page.goto('https://demowebshop.tricentis.com/')
    const parentChildLocator: Locator = page.locator('//div[@class="header-logo"]/a/img')
    await expect(parentChildLocator).toBeVisible()
});

test('13. Locate element using XPath with sibling relationship', async ({ page }) => {
    // SIBLING XPATH AXES EXPLANATION:
    // ================================
    // Sibling relationships help locate elements that are at the same DOM level
    // DOM Structure Example:
    // <div class="header-links">
    //   <a>Home</a>          ← sibling 1
    //   <a>Log in</a>        ← sibling 2
    //   <a>Register</a>      ← sibling 3 (following-sibling of "Log in")
    // </div>
    
    // FOLLOWING-SIBLING:: axis
    // ========================
    // Definition: Selects all siblings AFTER the current element
    // Syntax: element/following-sibling::type[condition]
    // Returns: Multiple elements (can be filtered with [position()])
    // Direction: Moves DOWN/FORWARD in the sibling list
    // Use cases:
    //   - Find next element after a known element
    //   - Navigate through sequential items
    //   - Locate related elements in lists
    
    // PRECEDING-SIBLING:: axis
    // ========================
    // Definition: Selects all siblings BEFORE the current element
    // Syntax: element/preceding-sibling::type[condition]
    // Returns: Multiple elements (can be filtered with [position()])
    // Direction: Moves UP/BACKWARD in the sibling list
    // Use cases:
    //   - Find previous element before a known element
    //   - Navigate backward through lists
    //   - Locate label/title before a form field
    
    // COMPARISON TABLE:
    // ┌─────────────────────┬────────────────────┬──────────────────────┐
    // │ Aspect              │ following-sibling  │ preceding-sibling    │
    // ├─────────────────────┼────────────────────┼──────────────────────┤
    // │ Direction           │ Forward (next)     │ Backward (previous)  │
    // │ Position            │ Elements AFTER     │ Elements BEFORE      │
    // │ HTML order          │ Appears later      │ Appears earlier      │
    // │ Returns             │ All following      │ All preceding        │
    // │ Filter by [1]       │ First following    │ First preceding      │
    // │ Real example        │ Next link/button   │ Previous label/field │
    // └─────────────────────┴────────────────────┴──────────────────────┘
    
    await page.goto('https://demowebshop.tricentis.com/');
    
    // Example 1: Using following-sibling:: to find next element
    // XPath: //a[text()="Log in"]/following-sibling::a[text()="Register"]
    // Translation: Find <a> with "Log in" text, then find its following sibling <a> with "Register"
    // Visual flow: "Log in" link → (next sibling) → "Register" link
    // WHEN: You know one element and need to find the next element
    // WHY: Avoids hard-coding positions; finds elements based on relationships
    const followingSiblingLocator: Locator = page.locator('//a[text()="Log in"]/following-sibling::a[text()="Register"]');
    await expect(followingSiblingLocator).toBeVisible();
    console.log('✓ Found "Register" link as following-sibling of "Log in"');
    
    // Example 2: Get first following sibling without specific text
    // Use [1] to get the first following sibling (doesn't require text match)
    const firstFollowing: Locator = page.locator('//a[text()="Log in"]/following-sibling::a[1]');
    const firstFollowingText = await firstFollowing.textContent();
    console.log(`First sibling after "Log in": ${firstFollowingText?.trim()}`);
    
    // Example 3: Get all following siblings with count
    // following-sibling::* gets ALL following siblings (any tag type)
    const allFollowing: Locator = page.locator('//a[text()="Log in"]/following-sibling::*');
    const followingCount = await allFollowing.count();
    console.log(`Total siblings after "Log in": ${followingCount}`);
    
    // Example 4: Using preceding-sibling:: to find previous element
    // XPath: //a[text()="Register"]/preceding-sibling::a[text()="Log in"]
    // Translation: Find <a> with "Register", then find its preceding sibling <a> with "Log in"
    // Visual flow: "Register" link → (previous sibling) → "Log in" link
    // WHEN: You know a later element and need to find earlier element
    // WHY: Navigates backward in lists/menus
    const precedingSiblingLocator: Locator = page.locator('//a[text()="Wishlist"]/preceding-sibling::a[text()="Log in"]');
    await expect(precedingSiblingLocator).toBeVisible();
    console.log('✓ Found "Log in" link as preceding-sibling of "Wishlist"');
    
    // Example 5: Get first preceding sibling
    // Use [1] to get the first preceding sibling (closest previous element)
    const firstPreceding: Locator = page.locator('//a[text()="Wishlist"]/preceding-sibling::a[1]');
    const firstPrecedingText = await firstPreceding.textContent();
    console.log(`First sibling before "Wishlist": ${firstPrecedingText?.trim()}`);
    
    // Example 6: Get all preceding siblings
    // preceding-sibling::* gets ALL preceding siblings
    const allPreceding: Locator = page.locator('//a[text()="Wishlist"]/preceding-sibling::*');
    const precedingCount = await allPreceding.count();
    console.log(`Total siblings before "Wishlist": ${precedingCount}`);
    
    // Example 7: Practical use case - Finding label associated with input
    // Many forms have: <label>Username</label><input .../>
    // Use preceding-sibling to find the label for an input
    const searchInput: Locator = page.locator('//input[@id="small-searchterms"]');
    const associatedLabel: Locator = page.locator('//input[@id="small-searchterms"]/preceding-sibling::label[1]');
    const labelText = await associatedLabel.textContent();
    console.log(`Label for search input: ${labelText?.trim()}`);
    
    // Example 8: Combining with other conditions
    // Find register link that comes after a login link with specific class
    const complexSibling: Locator = page.locator('//a[@class="login" and text()="Log in"]/following-sibling::a[@class="register"]');
    const complexExists = await complexSibling.count();
    console.log(`Complex sibling match found: ${complexExists > 0}`);
    
    // Example 9: Using [last()] to get last sibling
    // Get the LAST following sibling
    const lastFollowing: Locator = page.locator('//a[text()="Log in"]/following-sibling::a[last()]');
    const lastText = await lastFollowing.textContent();
    console.log(`Last sibling after "Log in": ${lastText?.trim()}`);
    
    // SUMMARY TABLE - When to use each:
    console.log(`
    SIBLING AXES USAGE GUIDE:
    ========================
    following-sibling::
    ✓ Next link/button in navigation
    ✓ Related elements below in list
    ✓ Sequential buttons (Cancel → Submit)
    ✓ Items that appear after another
    
    preceding-sibling::
    ✓ Label before input field
    ✓ Title before content block
    ✓ Previous items in list
    ✓ Elements that appear before another
    
    Position filtering:
    [1]      = Immediately next/previous element
    [2]      = Skip one, get second element
    [last()] = Last element in sibling group
    
    Real-world examples:
    ✓ //input/preceding-sibling::label    - Get label for input
    ✓ //button[@id="save"]/following-sibling::button - Get buttons after save
    ✓ //h2[text()="Contact"]/following-sibling::p[1] - Get first paragraph after heading
    ✓ //div[@class="error"]/preceding-sibling::input - Get input before error message
    `);
});

test('14. Locate element using XPath with axes: ancestor, descendant, self', async ({ page }) => {
    // XPath AXES FOR VERTICAL NAVIGATION (DOM hierarchy)
    // ===================================================
    // Unlike sibling axes (forward/backward), these navigate up/down the DOM tree
    
    // ANCESTOR:: AXIS
    // ===============
    // Definition: Selects all ancestor elements (parents, grandparents, great-grandparents, etc.)
    // Direction: Moves UP the DOM tree (toward root)
    // Returns: All matching ancestors in document order (closest first)
    // Syntax: element/ancestor::type[condition]
    // Scope: From immediate parent all the way to <html> root
    // 
    // DOM EXAMPLE:
    // <html>
    //   <body>
    //     <div class="container">              ← ancestor (grandparent)
    //       <div class="header">               ← ancestor (parent)
    //         <a href="/">                     ← ancestor (what we're looking for)
    //           <img alt="logo"/>              ← current element (starting point)
    //         </a>
    //       </div>
    //     </div>
    //   </body>
    // </html>
    //
    // XPath: //img[@alt="logo"]/ancestor::a
    // Translation: Find <img> with @alt="logo", then find ALL <a> ancestors
    // Output: Returns the <a> element (immediate ancestor)
    // WHY: When you know a child element but need to find the parent link/container
    // USE CASES:
    //   ✓ Find link that contains a button/image
    //   ✓ Find form that contains an input field
    //   ✓ Find container with specific class containing a nested element
    //   ✓ Navigate from deeply nested element to top-level wrapper
    
    // DESCENDANT:: AXIS
    // =================
    // Definition: Selects all descendant elements (children, grandchildren, great-grandchildren, etc.)
    // Direction: Moves DOWN the DOM tree (toward leaves)
    // Returns: All matching descendants at any depth level
    // Syntax: element/descendant::type[condition]
    // Scope: All children, grandchildren, and further nested elements
    // 
    // DOM EXAMPLE:
    // <div class="header-logo">              ← starting element
    //   <a href="/">                         ← child
    //     <img src="logo.png"/>              ← descendant (grandchild) - what we're looking for
    //   </a>
    // </div>
    //
    // XPath: //div[@class="header-logo"]/descendant::img
    // Translation: Find <div class="header-logo">, then find ALL <img> descendants
    // Output: Returns the <img> element (even though it's nested inside <a>)
    // WHY: When you know a container but need elements nested at any level inside
    // USE CASES:
    //   ✓ Find all images in a gallery container
    //   ✓ Find all inputs in a form (regardless of fieldset nesting)
    //   ✓ Find all buttons within a specific section
    //   ✓ Navigate from parent to any nested child
    
    // SELF:: AXIS
    // ===========
    // Definition: Selects the current element itself
    // Direction: None (stays on current node)
    // Returns: Only the element itself (if it matches the condition)
    // Syntax: element/self::type[condition]
    // Use: Rare; mainly used to filter/validate current element has certain type/condition
    //
    // DOM EXAMPLE:
    // <a class="ico-register" href="/register">Register</a>
    //
    // XPath: //a[@class="ico-register"]/self::a
    // Translation: Find <a> with @class="ico-register", then confirm it IS an <a>
    // Output: Returns the same <a> element (if it matches type)
    // WHY: Usually not needed (the initial filter already ensures it's an <a>)
    // USE CASES:
    //   ✓ Validate current element IS a specific type
    //   ✓ Use in complex conditions (element must be of type X)
    //   ✓ Filter based on element type and additional conditions
    //   ✓ Rarely practical - better to just specify in initial selector
    
    await page.goto('https://demowebshop.tricentis.com/');
    
    // ====================================================================
    // EXAMPLE 1: ANCESTOR:: AXIS - Finding parent link of an image
    // ====================================================================
    // STATEMENT: //img[@alt="Tricentis Demo Web Shop"]/ancestor::a
    // BREAKDOWN:
    //   1. //img[@alt="Tricentis Demo Web Shop"]  ← Find the logo image
    //   2. /ancestor::a                           ← Find <a> ancestor element
    //
    // DOM STRUCTURE (actual):
    // <div class="header-logo">
    //   <a href="/" class="logo">                ← This is the OUTPUT
    //     <img src="logo.png" alt="Tricentis Demo Web Shop"/>  ← Starting point
    //   </a>
    // </div>
    //
    // WHAT IT RETURNS:
    // The <a> element that wraps the logo image
    // Type: Single locator pointing to the <a> tag
    // Use case: Testing clickability of logo link
    const ancestorLocator: Locator = page.locator('//img[@alt="Tricentis Demo Web Shop"]/ancestor::a');
    await expect(ancestorLocator).toBeVisible();
    console.log('✓ ancestor::a found the <a> element wrapping the logo image');
    
    // Get the href attribute of the ancestor <a>
    const ancestorHref = await ancestorLocator.getAttribute('href');
    console.log(`Ancestor link href: ${ancestorHref}`);
    
    // Get HTML tag of ancestor
    const ancestorTag = await page.evaluate(() => {
        const elem = document.querySelector('img[alt="Tricentis Demo Web Shop"]')?.parentElement;
        return elem?.tagName;
    });
    console.log(`Ancestor element tag: ${ancestorTag}`);
    
    // Example 1B: Using ancestor::div instead (goes further up)
    // ancestor::* returns ALL ancestors (any type) - use [1] for closest
    const ancestorDiv = page.locator('//img[@alt="Tricentis Demo Web Shop"]/ancestor::div[1]');
    const ancestorDivClass = await ancestorDiv.getAttribute('class');
    console.log(`Closest ancestor div class: ${ancestorDivClass}`);
    
    // Example 1C: Get ALL ancestors (any type)
    const allAncestors = page.locator('//img[@alt="Tricentis Demo Web Shop"]/ancestor::*');
    const ancestorCount = await allAncestors.count();
    console.log(`Total ancestors of logo image: ${ancestorCount}`);
    
    // ====================================================================
    // EXAMPLE 2: DESCENDANT:: AXIS - Finding image in a container
    // ====================================================================
    // STATEMENT: //div[@class="header-logo"]/descendant::img
    // BREAKDOWN:
    //   1. //div[@class="header-logo"]  ← Find the header-logo container
    //   2. /descendant::img             ← Find any <img> inside it (any depth)
    //
    // DOM STRUCTURE (actual):
    // <div class="header-logo">                  ← Starting point
    //   <a href="/" class="logo">
    //     <img src="logo.png" alt="..."/>       ← This is the OUTPUT (grandchild)
    //   </a>
    // </div>
    //
    // WHAT IT RETURNS:
    // The <img> element nested inside the div (even though <a> is in between)
    // Type: Single locator pointing to the <img> tag
    // Use case: Testing logo image is loaded and visible
    const descendantLocator: Locator = page.locator('//div[@class="header-logo"]/descendant::img');
    await expect(descendantLocator).toBeVisible();
    console.log('✓ descendant::img found the <img> inside the header-logo div');
    
    // Get the src and alt of the descendant image
    const descendantSrc = await descendantLocator.getAttribute('src');
    const descendantAlt = await descendantLocator.getAttribute('alt');
    console.log(`Descendant image src: ${descendantSrc}`);
    console.log(`Descendant image alt: ${descendantAlt}`);
    
    // Example 2B: Difference between / (child) and // (descendant)
    // This would FAIL because <img> is not direct child of div:
    // const childImg = page.locator('//div[@class="header-logo"]/img'); // ❌ Would fail
    //
    // But this works because descendant includes any nesting:
    // const descendantImg = page.locator('//div[@class="header-logo"]/descendant::img'); // ✓ Works
    
    // Example 2C: Find ALL descendants of a type
    const allImages = page.locator('//div[@class="header-logo"]//img');
    const imageCount = await allImages.count();
    console.log(`Total images in header-logo: ${imageCount}`);
    
    // Example 2D: With condition - find descendant with attribute
    const descendantWithAlt = page.locator('//div[@class="header-logo"]/descendant::img[@alt]');
    const hasAlt = await descendantWithAlt.count();
    console.log(`Descendant images with @alt attribute: ${hasAlt}`);
    
    // ====================================================================
    // EXAMPLE 3: SELF:: AXIS - Validate element type
    // ====================================================================
    // STATEMENT: //a[@class="ico-register"]/self::a
    // BREAKDOWN:
    //   1. //a[@class="ico-register"]  ← Find <a> with class="ico-register"
    //   2. /self::a                    ← Confirm it IS an <a> element
    //
    // DOM STRUCTURE (actual):
    // <a class="ico-register" href="/register">Register</a>
    //
    // WHAT IT RETURNS:
    // The same <a> element (if it matches the type check)
    // Type: Single locator pointing to the <a> tag
    // Use case: Rarely used - the initial selector already confirms it's an <a>
    // (This is redundant: //a already means it's an <a>, so /self::a doesn't add value)
    const selfLocator: Locator = page.locator('//a[@class="ico-register"]/self::a');
    await expect(selfLocator).toBeVisible();
    console.log('✓ self::a confirmed element IS an <a> tag');
    
    // Get the href of the self element
    const selfHref = await selfLocator.getAttribute('href');
    console.log(`Self element href: ${selfHref}`);
    
    // Example 3B: Using self with different type (would return nothing)
    const selfDiv = page.locator('//a[@class="ico-register"]/self::div');
    const selfDivCount = await selfDiv.count();
    console.log(`//a/self::div found: ${selfDivCount} elements (0 because <a> is not a <div>)`);
    
    // Example 3C: More practical use - combining conditions
    // Find <a> elements that are register links AND have href
    const selfWithCondition = page.locator('//a[@class="ico-register"]/self::a[@href]');
    const selfWithHref = await selfWithCondition.count();
    console.log(`Register link has @href: ${selfWithHref > 0}`);
    
    // ====================================================================
    // AXIS COMPARISON SUMMARY
    // ====================================================================
    console.log(`
    XPATH AXES NAVIGATION GUIDE:
    ============================
    
    ancestor:: (UP the tree)
    ✓ Moves toward root element
    ✓ Use when: Know child, need parent/container
    ✓ Returns: All ancestors up to <html>
    ✓ Example: //img/ancestor::a - Find link containing image
    ✓ [1] = closest parent
    ✓ [last()] = furthest ancestor (html or body)
    
    descendant:: (DOWN the tree)
    ✓ Moves toward leaf elements
    ✓ Use when: Know parent, need nested children
    ✓ Returns: All descendants at any depth
    ✓ Example: //div[@id="form"]/descendant::input - Find all inputs in form
    ✓ Works through multiple nesting levels
    ✓ Similar to // (descendant-or-self)
    
    self:: (CURRENT element)
    ✓ Stays on current node
    ✓ Use when: Validate element type (rarely needed)
    ✓ Returns: Element itself if matches condition
    ✓ Example: //a/self::a - Confirm it's an <a> (redundant)
    ✓ More practical: //div/self::div[@class="error"]
    ✓ Mostly educational; rarely used in practice
    
    COMPARISON TABLE:
    ┌──────────────┬─────────────┬──────────────┬──────────────┐
    │ Aspect       │ ancestor::  │ descendant:: │ self::       │
    ├──────────────┼─────────────┼──────────────┼──────────────┤
    │ Direction    │ UP          │ DOWN         │ NONE (same)  │
    │ Movement     │ To parents  │ To children  │ Self only    │
    │ Common use   │ 30%         │ 60%          │ 10% (rare)   │
    │ Syntax       │ child/anc:: │ parent/desc::│ elem/self::  │
    │ Return count │ Multiple    │ Multiple     │ 0 or 1       │
    │ [1] means    │ Closest     │ First match  │ N/A          │
    └──────────────┴─────────────┴──────────────┴──────────────┘
    
    WHEN TO USE EACH:
    ✓ ancestor::   - Image/button in link, input in form, child in container
    ✓ descendant:: - Find element buried in nested structure
    ✓ self::       - Type validation (rarely practical in real tests)
    
    PRACTICAL EXAMPLES:
    ✓ //button/ancestor::form              - Find form containing button
    ✓ //form[@id="login"]/descendant::input - Find inputs in form
    ✓ //span[@class="error"]/ancestor::div[@class="field"] - Find field container
    ✓ //img/ancestor::a[1]                 - Get immediate link parent
    ✓ //body/descendant::*[@id="main"]     - Find element with id=main anywhere in page
    `);
});

/*
================================================================================
REMAINING XPATH AXES - parent::, child::, following::, preceding::
================================================================================

We've covered: ancestor::, descendant::, self::, following-sibling::, preceding-sibling::
Still need to cover: parent::, child::, following::, preceding::

parent:: AXIS
=============
Definition: Selects the immediate parent element only
Syntax: element/parent::type[condition]
Returns: Single parent element (or nothing if condition doesn't match)
Scope: ONLY the direct parent (not grandparent or further)
Direction: UP (but only one level)

KEY FACTS:
- Similar to ancestor::*[1] but more direct
- Returns 0 or 1 element
- More specific than ancestor:: (which goes all way up)
- Less flexible than ancestor:: when parent could be different types

WHEN TO USE parent::
✓ You ONLY want the immediate parent (not further up)
✓ Know child, need direct parent only
✗ Need multiple levels up → use ancestor::

EXAMPLE: //img/parent::a - Get direct <a> parent of image

child:: AXIS
============
Definition: Selects all direct children elements
Syntax: element/child::type[condition]
Returns: All direct children matching
Scope: ONLY direct children (not grandchildren)
Direction: DOWN (but only one level)

KEY FACTS:
- Same as / (single slash in most contexts)
- Returns direct children only (not nested)
- More explicit than / but same functionality
- Less flexible than descendant:: when nesting level varies

WHEN TO USE child::
✓ You ONLY want direct children (not nested)
✓ Know parent, need direct children only
✗ Need to search through nested levels → use descendant::

EXAMPLE: //ul/child::li - Get direct <li> children of <ul>

following:: AXIS
================
Definition: Selects all elements AFTER current element (any descendant, not just siblings)
Syntax: element/following::type[condition]
Returns: All elements that appear AFTER in document order
Scope: ANY element after current (not just siblings or within same parent)
Direction: FORWARD through entire document (not just siblings)

KEY FACTS:
- Similar to following-sibling:: BUT includes non-siblings
- following-sibling:: = siblings only
- following:: = any element after (siblings + elements after parent + etc.)
- Returns multiple elements in document order
- Broader scope than following-sibling::

WHEN TO USE following::
✓ Find ANY element appearing after reference (not just siblings)
✓ Elements outside same parent container
✓ More flexible search than following-sibling::
✗ Need only same-level elements → use following-sibling::

EXAMPLE: //h2[text()="Contact"]/following::p - Get paragraphs after heading (any location)

preceding:: AXIS
================
Definition: Selects all elements BEFORE current element (any ancestor descendant)
Syntax: element/preceding::type[condition]
Returns: All elements that appear BEFORE in document order
Scope: ANY element before current (any location in document before it)
Direction: BACKWARD through entire document (not just siblings)

KEY FACTS:
- Similar to preceding-sibling:: BUT includes non-siblings
- preceding-sibling:: = siblings only
- preceding:: = any element before (siblings + elements before parent + etc.)
- Returns multiple elements in document order
- Broader scope than preceding-sibling::

WHEN TO USE preceding::
✓ Find ANY element appearing before reference (not just siblings)
✓ Elements in different containers/hierarchy
✓ More flexible search than preceding-sibling::
✗ Need only same-level elements → use preceding-sibling::

EXAMPLE: //input[@name="password"]/preceding::input - Get inputs before password field

AXES SCOPE COMPARISON TABLE:
┌────────────────┬──────────────┬──────────────┬──────────────┬──────────┐
│ Axis           │ Direction    │ Scope        │ Returns      │ Returns  │
│                │              │              │ Siblings?    │ Others?  │
├────────────────┼──────────────┼──────────────┼──────────────┼──────────┤
│ parent::       │ UP 1 level   │ Direct parent│ No           │ No       │
│ ancestor::     │ UP all levels│ All parents  │ No           │ No       │
│ child::        │ DOWN 1 level │ Dir children │ N/A          │ No       │
│ descendant::   │ DOWN all     │ All children │ N/A          │ No       │
│ following-sib::│ FORWARD sibs │ Siblings     │ YES          │ No       │
│ following::    │ FORWARD all  │ All forward  │ YES          │ YES      │
│ preceding-sib::│ BACK sibs    │ Siblings     │ YES          │ No       │
│ preceding::    │ BACK all     │ All backward │ YES          │ YES      │
│ self::         │ NONE         │ Current      │ No           │ N/A      │
└────────────────┴──────────────┴──────────────┴──────────────┴──────────┘

VISUAL EXAMPLE - Scopes:
<div>                                    ← preceding:: (before)
  <label for="user">Username</label>
  <div>
    <input id="user"/>  ← [CURRENT]
    <p>Error</p>        ← following:: AND following-sibling:: (same)
  </div>
  <span>Done</span>     ← following:: only (not sibling)
</div>

KEY DIFFERENCES:
- parent:: vs ancestor:: - parent:: only direct, ancestor:: all levels up
- child:: vs descendant:: - child:: only direct, descendant:: any depth
- following-sibling:: vs following:: - sibling:: same parent only, following:: any location
- preceding-sibling:: vs preceding:: - sibling:: same parent only, preceding:: any location
*/

test('15. Locate element using XPath with parent and child axes', async ({ page }) => {
    await page.goto('https://demowebshop.tricentis.com/');
    
    console.log('--- parent:: AXIS EXAMPLES ---');
    
    // Example 1: Find direct parent of image
    // XPath: //img[@alt="Tricentis Demo Web Shop"]/parent::a
    // parent:: = immediate parent only (not ancestor::)
    // Returns: The direct <a> parent
    const parentLink = page.locator('//img[@alt="Tricentis Demo Web Shop"]/parent::a');
    const parentCount = await parentLink.count();
    console.log(`1. Image has direct <a> parent: ${parentCount > 0}`);
    const parentHref = await parentLink.getAttribute('href');
    console.log(`   Parent <a> href: ${parentHref}`);
    
    // Example 2: parent:: vs ancestor:: difference
    // parent:: only gets immediate parent
    // ancestor:: gets all parents up to root
    const parentDirect = page.locator('//img[@alt="Tricentis Demo Web Shop"]/parent::*');
    const ancestorAll = page.locator('//img[@alt="Tricentis Demo Web Shop"]/ancestor::*');
    const parentDirectCount = await parentDirect.count();
    const ancestorAllCount = await ancestorAll.count();
    console.log(`2. parent::* returns: ${parentDirectCount} (only immediate)`);
    console.log(`   ancestor::* returns: ${ancestorAllCount} (all the way up)`);
    
    // Example 3: Get parent with type check
    // parent::div returns parent only if it's a div
    const parentDiv = page.locator('//img[@alt="Tricentis Demo Web Shop"]/parent::div');
    const parentDivExists = await parentDiv.count();
    console.log(`3. Image's parent is <div>: ${parentDivExists > 0}`);
    
    console.log('\n--- child:: AXIS EXAMPLES ---');
    
    // Example 4: Find direct children
    // XPath: //ul[@class="top-menu"]/child::li
    // child:: = only direct children (not nested)
    // Returns: All <li> that are direct children of <ul>
    const directChildren = page.locator('//ul[@class="top-menu"]/child::li');
    const childCount = await directChildren.count();
    console.log(`4. Direct <li> children of top-menu: ${childCount}`);
    
    // Example 5: child:: vs descendant:: difference
    // child:: only direct level
    // descendant:: any depth
    const direct = page.locator('//ul[@class="top-menu"]/child::*');
    const anyDepth = page.locator('//ul[@class="top-menu"]/descendant::*');
    const directCount2 = await direct.count();
    const anyDepthCount = await anyDepth.count();
    console.log(`5. child::* returns: ${directCount2} (only direct)`);
    console.log(`   descendant::* returns: ${anyDepthCount} (any depth)`);
    
    // Example 6: Get all children of container
    const containerChildren = page.locator('//div[@class="header-logo"]/child::*');
    const childElements = await containerChildren.allTextContents();
    console.log(`6. All children of header-logo: ${childElements.length}`);
    
    console.log('\n--- SUMMARY: parent:: vs ancestor:: and child:: vs descendant:: ---');
    console.log(`
    parent:: (direct parent only)
    ✓ Returns: 0 or 1 element
    ✓ Use: When you ONLY want immediate parent
    ✓ Example: //img/parent::a - Get image's direct <a> wrapper
    
    ancestor:: (all parents up)
    ✓ Returns: Multiple elements
    ✓ Use: When you want any parent level
    ✓ Example: //img/ancestor::div - Get any <div> ancestor
    
    child:: (direct children only)
    ✓ Returns: Multiple elements
    ✓ Use: When you ONLY want direct children
    ✓ Example: //ul/child::li - Get direct <li> of list
    
    descendant:: (all nested children)
    ✓ Returns: Multiple elements
    ✓ Use: When you want any nesting level
    ✓ Example: //form/descendant::input - Get inputs at any depth
    `);
});

test('16. Locate element using XPath following and preceding axes', async ({ page }) => {
    await page.goto('https://demowebshop.tricentis.com/');
    
    console.log('--- following:: AXIS EXAMPLES ---');
    
    // Example 1: Find ANY elements appearing after reference
    // XPath: //a[text()="Log in"]/following::a
    // following:: = ALL <a> elements that appear after "Log in"
    // Different from following-sibling:: (which is only same-level siblings)
    const followingLinks = page.locator('//a[text()="Log in"]/following::a');
    const followingCount = await followingLinks.count();
    console.log(`1. <a> elements after "Log in": ${followingCount}`);
    
    // Example 2: following:: vs following-sibling:: difference
    // following-sibling:: = elements after at same parent level
    // following:: = ANY element after (different parents OK)
    const followingSib = page.locator('//a[text()="Log in"]/following-sibling::a');
    const following = page.locator('//a[text()="Log in"]/following::a');
    const sibCount = await followingSib.count();
    const allCount = await following.count();
    console.log(`2. following-sibling::a returns: ${sibCount} (siblings only)`);
    console.log(`   following::a returns: ${allCount} (any element after)`);
    
    // Example 3: Find first following element (any type)
    // following::*[1] = first element that appears after
    const firstFollowing = page.locator('//a[text()="Log in"]/following::*[1]');
    const firstFollowingText = await firstFollowing.textContent();
    console.log(`3. First element after "Log in": ${firstFollowingText?.trim()}`);
    
    // Example 4: Find ALL paragraphs after a heading
    // following::p = any <p> element after current position
    const headings = page.locator('//h1 | //h2 | //h3');
    const headingCount = await headings.count();
    if (headingCount > 0) {
        const afterHeading = page.locator('//h1/following::p | //h2/following::p | //h3/following::p');
        const pCount = await afterHeading.count();
        console.log(`4. Paragraphs after headings: ${pCount}`);
    }
    
    // Example 5: Get text from all following elements
    const followingAll = page.locator('//a[text()="Log in"]/following::*');
    const followingTexts = await followingAll.allTextContents();
    console.log(`5. All following elements count: ${followingTexts.length}`);
    
    console.log('\n--- preceding:: AXIS EXAMPLES ---');
    
    // Example 6: Find ANY elements appearing before reference
    // XPath: //a[text()="Register"]/preceding::a
    // preceding:: = ALL <a> elements that appear before "Register"
    const precedingLinks = page.locator('//a[text()="Register"]/preceding::a');
    const precedingCount = await precedingLinks.count();
    console.log(`6. <a> elements before "Register": ${precedingCount}`);
    
    // Example 7: preceding:: vs preceding-sibling:: difference
    // preceding-sibling:: = elements before at same parent level
    // preceding:: = ANY element before (different parents OK)
    const precedingSib = page.locator('//a[text()="Register"]/preceding-sibling::a');
    const preceding = page.locator('//a[text()="Register"]/preceding::a');
    const precSibCount = await precedingSib.count();
    const precAllCount = await preceding.count();
    console.log(`7. preceding-sibling::a returns: ${precSibCount} (siblings only)`);
    console.log(`   preceding::a returns: ${precAllCount} (any element before)`);
    
    // Example 8: Find last preceding element (closest before)
    // preceding::*[1] = last/closest element before (document order reversed)
    const lastPreceding = page.locator('//a[text()="Register"]/preceding::a[1]');
    const lastPrecedingText = await lastPreceding.textContent();
    console.log(`8. Last preceding <a> before "Register": ${lastPrecedingText?.trim()}`);
    
    // Example 9: Find inputs before password field
    const passwordInput = page.locator('//input[@type="password"]');
    const inputsBefore = page.locator('//input[@type="password"]/preceding::input');
    const inputsBeforeCount = await inputsBefore.count();
    console.log(`9. Input fields before password field: ${inputsBeforeCount}`);
    
    // Example 10: Get ALL preceding elements
    const precedingAll = page.locator('//a[text()="Register"]/preceding::*');
    const precedingTexts = await precedingAll.allTextContents();
    console.log(`10. Total preceding elements before "Register": ${precedingTexts.length}`);
    
    console.log('\n--- PRACTICAL COMPARISON TABLE ---');
    console.log(`
    SIBLING AXES vs GENERAL AXES:
    =============================
    
    following-sibling:: (forward at same level)
    ✓ Direction: Forward
    ✓ Scope: Same parent only
    ✓ Returns: All siblings after
    ✓ Example: //button/following-sibling::button - Next button
    
    following:: (forward anywhere)
    ✓ Direction: Forward
    ✓ Scope: Any location in document
    ✓ Returns: All elements after
    ✓ More flexible: Works across containers
    ✓ Example: //h2/following::p - Get paragraphs after heading
    
    preceding-sibling:: (backward at same level)
    ✓ Direction: Backward
    ✓ Scope: Same parent only
    ✓ Returns: All siblings before
    ✓ Example: //input/preceding-sibling::label - Get label before input
    
    preceding:: (backward anywhere)
    ✓ Direction: Backward
    ✓ Scope: Any location in document
    ✓ Returns: All elements before
    ✓ More flexible: Works across containers
    ✓ Example: //input/preceding::label - Get any label before input
    
    DECISION TREE:
    "Need elements at same level after?"      → following-sibling::
    "Need elements anywhere after?"           → following::
    "Need elements at same level before?"     → preceding-sibling::
    "Need elements anywhere before?"          → preceding::
    "Need direct parent?"                     → parent::
    "Need all parents?"                       → ancestor::
    "Need direct children?"                   → child::
    "Need all nested children?"               → descendant::
    `);
});

