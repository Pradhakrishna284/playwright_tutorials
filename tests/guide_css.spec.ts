//https://www.youtube.com/watch?v=FClj0-oGP-w&list=PLUDwpEzHYYLtvMVjc-Va3RXLKtdB-ofc2&index=5

import {test, expect, Locator} from '@playwright/test';

test('CSS locator - locate elements using CSS selectors', async ({page}) => {
    // Using async: Allows the test function to pause execution with 'await' for asynchronous operations
    // This enables sequential execution of browser automation steps that take time to complete
    
    // await page.goto(): Waits for page navigation to complete before proceeding
    // Without await, the next line would execute before the page loads, causing failures
    await page.goto('https://demowebshop.tricentis.com/');
    
    // Example 1: Locate element by ID using CSS
    // WHEN: Element has unique ID attribute
    // WHY CSS ID: Simple, direct, very fast
    // SELECTOR: #small-searchterms
    // EXPLANATION: The # symbol targets elements by their ID attribute.
    //              IDs are unique on a page, so this matches exactly ONE element.
    //              Performance: Fastest possible selector (browser optimized)
    // HTML EXAMPLE: <input id="small-searchterms" type="text" />
    // EXPECTED OUTPUT: ✓ Located element by ID: #small-searchterms
    //                  This element is visible and can be interacted with
    const idLocator: Locator = page.locator('#small-searchterms');
    await expect(idLocator).toBeVisible();
    console.log('✓ Located element by ID: #small-searchterms');

    // Example 2: Locate element by class name using CSS
    // WHEN: Element has class attribute
    // WHY CSS class: Targets styled elements, class names are often reused
    // SELECTOR: .top-menu
    // EXPLANATION: The . (dot) symbol targets elements by their class attribute.
    //              Multiple elements can have the same class.
    //              This selector matches the FIRST element with class="top-menu"
    // HTML EXAMPLE: <ul class="top-menu">
    //                 <li><a href="/">Home</a></li>
    //                 <li><a href="/about">About</a></li>
    //               </ul>
    // EXPECTED OUTPUT: ✓ Located element by class: .top-menu
    //                  Locates the <ul> with class="top-menu"
    const classLocator: Locator = page.locator('.top-menu');
    await expect(classLocator).toBeVisible();
    console.log('✓ Located element by class: .top-menu');

    // Example 3: Locate element by tag name
    // WHEN: Need to find specific HTML tag
    // WHY tag selector: Simple, broad targeting
    // SELECTOR: a
    // EXPLANATION: Targets ALL elements with tag name <a>
    //              No prefix needed (unlike # for ID or . for class)
    //              Returns all matching elements on the page
    // HTML EXAMPLE: <a href="/">Home</a>
    //               <a href="/about">About</a>
    //               <a href="/contact">Contact</a>
    // EXPECTED OUTPUT: ✓ Found X anchor tags on page
    //                  X = number of all <a> elements on page (likely 20-50+)
    //                  This includes navigation links, footer links, etc.
    const tagLocator: Locator = page.locator('a');
    const aCount = await tagLocator.count();
    console.log(`✓ Found ${aCount} anchor tags on page`);

    // Example 4: Locate element by attribute using CSS [attr="value"]
    // WHEN: Element has specific attribute value
    // WHY CSS attribute selector: Direct attribute matching without knowing element class/ID
    // SELECTOR: input[type="text"]
    // EXPLANATION: Targets <input> elements WHERE the type attribute EQUALS "text"
    //              Syntax: tag[attribute="exactValue"]
    //              The brackets [attr="value"] specify attribute conditions
    // HTML EXAMPLE: <input type="text" name="username" />  ✓ MATCHES
    //               <input type="password" name="pwd" />    ✗ NO MATCH
    //               <input type="text" placeholder="..." /> ✓ MATCHES
    // EXPECTED OUTPUT: ✓ Located input with type=text using attribute selector
    //                  First text input found and confirmed visible
    //                  Usually locates search box or form username field
    const attrLocator: Locator = page.locator('input[type="text"]');
    await expect(attrLocator.first()).toBeVisible();
    console.log('✓ Located input with type=text using attribute selector');

    // Example 5: Locate element by multiple classes using CSS
    // WHEN: Element has multiple classes
    // WHY: Both classes must be present (AND condition)
    // SELECTOR: div.header.wrapper
    // EXPLANATION: Targets <div> elements that have BOTH class="header" AND class="wrapper"
    //              Syntax: tag.class1.class2.class3 (no spaces between class selectors)
    //              All specified classes must exist on the element
    // HTML EXAMPLE: <div class="header wrapper">...</div>        ✓ MATCHES
    //               <div class="header">...</div>                ✗ NO MATCH (missing wrapper)
    //               <div class="header wrapper active">...</div>  ✓ MATCHES (extra classes OK)
    //               <span class="header wrapper">...</span>       ✗ NO MATCH (wrong tag)
    // EXPECTED OUTPUT: ✓ Found X elements with both .header and .wrapper classes
    //                  Usually finds 0-1 elements (very specific selector)
    //                  If found, it's typically a specific layout wrapper
    const multiClassLocator: Locator = page.locator('div.header.wrapper');
    const multiClassCount = await multiClassLocator.count();
    console.log(`✓ Found ${multiClassCount} elements with both .header and .wrapper classes`);

    // Example 6: Locate element by child selector using > (direct child)
    // WHEN: Need direct child of parent only
    // WHY: > matches only immediate children, not nested descendants
    // SELECTOR: div.header > a
    // EXPLANATION: Targets <a> elements that are DIRECT children of div.header
    //              The > combinator means "direct child" (immediate, not nested)
    //              Does NOT match <a> if it's inside another element inside the div
    // DOM STRUCTURE: 
    //   <div class="header">
    //     <a href="/">Home</a>                    ✓ DIRECT child - MATCHES
    //     <span>
    //       <a href="/about">About</a>            ✗ NESTED in span - NO MATCH
    //     </span>
    //   </div>
    // EXPECTED OUTPUT: ✓ Found X direct child links in header div
    //                  Only counts <a> tags directly under div.header
    //                  Usually fewer than total <a> count (because nested ones excluded)
    const childLocator: Locator = page.locator('div.header > a');
    const directChildCount = await childLocator.count();
    console.log(`✓ Found ${directChildCount} direct child links in header div`);

    // Example 7: Locate element by descendant selector using space (any depth)
    // WHEN: Element is nested at any depth under parent
    // WHY space selector: More flexible than >, finds nested elements
    // SELECTOR: div.header a
    // EXPLANATION: Targets ALL <a> elements that are DESCENDANTS of div.header
    //              The space combinator means "any descendant at any nesting level"
    //              Unlike >, this matches <a> even if deeply nested inside other elements
    // DOM STRUCTURE: 
    //   <div class="header">
    //     <a href="/">Home</a>                    ✓ Direct child - MATCHES
    //     <span>
    //       <a href="/about">About</a>            ✓ Nested in span - MATCHES
    //       <nav>
    //         <a href="/service">Services</a>     ✓ Deeply nested - MATCHES
    //       </nav>
    //     </span>
    //   </div>
    // EXPECTED OUTPUT: ✓ Found X links at any depth in header div
    //                  X is larger than Example 6 because nested links included
    //                  Includes all <a> elements anywhere inside header
    const descendantLocator: Locator = page.locator('div.header a');
    const descendantCount = await descendantLocator.count();
    console.log(`✓ Found ${descendantCount} links at any depth in header div`);

    // Example 8: Locate element by attribute substring match [attr*="value"]
    // WHEN: Attribute value partially matches (value can appear ANYWHERE in attribute)
    // WHY: Flexible for dynamic attributes, URLs with changing parameters
    // SELECTOR: a[href*="shop"]
    // EXPLANATION: Targets <a> elements where href CONTAINS "shop" anywhere
    //              Syntax: [attribute*="substring"]
    //              The *=  operator means "contains this substring"
    // HTML EXAMPLES:
    //   <a href="/shop">Shop</a>                    ✓ CONTAINS "shop"
    //   <a href="/products/shop/featured">...</a>   ✓ CONTAINS "shop"
    //   <a href="/shopping-cart">Cart</a>           ✓ CONTAINS "shop"
    //   <a href="/api/shop?id=123&filter=x">...</a> ✓ CONTAINS "shop"
    //   <a href="/about">About</a>                  ✗ NO "shop" in href
    // EXPECTED OUTPUT: ✓ Found X links with "shop" in href
    //                  X = number of links containing "shop" (typically 5-15)
    //                  Includes Shop page, product pages, cart, etc.
    const substringLocator: Locator = page.locator('a[href*="shop"]');
    const substringCount = await substringLocator.count();
    console.log(`✓ Found ${substringCount} links with "shop" in href`);

    // Example 9: Locate element by attribute starts-with [attr^="value"]
    // WHEN: Attribute value starts with specific text (BEGINNING match only)
    // WHY: Useful for URLs, data attributes with known prefixes
    // SELECTOR: a[href^="/"]
    // EXPLANATION: Targets <a> elements where href STARTS WITH "/"
    //              Syntax: [attribute^="prefix"]
    //              The ^= operator means "starts with this prefix"
    //              Very useful for finding internal vs external links
    // HTML EXAMPLES:
    //   <a href="/shop">Shop</a>                    ✓ STARTS with "/"
    //   <a href="/products/featured">Products</a>   ✓ STARTS with "/"
    //   <a href="/api/data?x=1">API</a>            ✓ STARTS with "/"
    //   <a href="https://external.com">External</a> ✗ STARTS with "https"
    //   <a href="about.html">About</a>             ✗ STARTS with "about"
    // EXPECTED OUTPUT: ✓ Found X links with href starting with /
    //                  X = number of internal links (typically 15-25)
    //                  All links to internal pages (relative URLs)
    const startsWithLocator: Locator = page.locator('a[href^="/"]');
    const startsWithCount = await startsWithLocator.count();
    console.log(`✓ Found ${startsWithCount} links with href starting with /`);

    // Example 10: Locate element by attribute ends-with [attr$="value"]
    // WHEN: Attribute value ends with specific text (END match only)
    // WHY: Match file extensions, domain endings, file types
    // SELECTOR: a[href$=".com"]
    // EXPLANATION: Targets <a> elements where href ENDS WITH ".com"
    //              Syntax: [attribute$="suffix"]
    //              The $= operator means "ends with this suffix"
    // HTML EXAMPLES:
    //   <a href="https://example.com">Example</a>   ✓ ENDS with ".com"
    //   <a href="external.com">Site</a>             ✓ ENDS with ".com"
    //   <a href="/download.pdf">PDF</a>             ✗ ENDS with ".pdf"
    //   <a href="/shop">Shop</a>                    ✗ ENDS with "hop"
    //   <a href="/file.jpg">Image</a>              ✗ ENDS with ".jpg"
    // EXPECTED OUTPUT: ✓ Found X links with href ending with .com
    //                  X = number of links to .com domains (typically 0-5)
    //                  Usually external links to company website or partners
    const endsWithLocator: Locator = page.locator('a[href$=".com"]');
    const endsWithCount = await endsWithLocator.count();
    console.log(`✓ Found ${endsWithCount} links with href ending with .com`);

    // Example 11: Locate element by combining attribute selectors
    // WHEN: Need multiple attribute conditions (AND logic)
    // WHY: Precise targeting with multiple constraints
    // SELECTOR: input[type="text"][name="q"]
    // EXPLANATION: Targets <input> elements where BOTH conditions are true:
    //              1. type attribute EQUALS "text"
    //              2. name attribute EQUALS "q"
    //              Syntax: selector[attr1="val1"][attr2="val2"]
    //              All conditions must be satisfied (AND logic)
    // HTML EXAMPLES:
    //   <input type="text" name="q" />                        ✓ BOTH match
    //   <input type="text" name="search" />                  ✗ type OK, name wrong
    //   <input type="password" name="q" />                   ✗ name OK, type wrong
    //   <input type="text" name="q" id="search-box" />       ✓ BOTH match (extra attrs OK)
    //   <textarea name="q"></textarea>                        ✗ Wrong tag
    // EXPECTED OUTPUT: ✓ Found X text inputs with name="q"
    //                  Usually finds 1-2 inputs (very specific selector)
    //                  Typically the main search box on the page
    const multiAttrLocator: Locator = page.locator('input[type="text"][name="q"]');
    const multiAttrCount = await multiAttrLocator.count();
    console.log(`✓ Found ${multiAttrCount} text inputs with name="q"`);

    // Example 12: Locate element by :not() pseudo-class
    // WHEN: Exclude elements with certain class or attribute (negative matching)
    // WHY: Flexible negative matching, find only usable elements
    // SELECTOR: a:not([disabled])
    // EXPLANATION: Targets <a> elements that do NOT have disabled attribute
    //              Syntax: selector:not(condition)
    //              The :not() pseudo-class inverts the condition
    //              Matches elements that DON'T match the inner selector
    // HTML EXAMPLES:
    //   <a href="/">Home</a>                      ✓ NO disabled attribute
    //   <a href="/about" disabled>About</a>       ✗ HAS disabled attribute
    //   <a href="/shop">Shop</a>                  ✓ NO disabled attribute
    //   <a disabled>Disabled Link</a>             ✗ HAS disabled attribute
    // EXPECTED OUTPUT: ✓ Found X non-disabled anchor tags
    //                  X = total <a> count minus disabled ones (typically 35-45)
    //                  Includes all clickable links on page
    const notLocator: Locator = page.locator('a:not([disabled])');
    const notCount = await notLocator.count();
    console.log(`✓ Found ${notCount} non-disabled anchor tags`);

    // Example 13: Locate element by :first-child pseudo-class
    // WHEN: Element is first child of parent
    // WHY: Position-based targeting
    // SELECTOR: ul.top-menu > li:first-child
    // EXPLANATION: Targets <li> that is the first child under <ul class="top-menu">
    //              :first-child matches element at position 1 (1-based indexing)
    //              Only selects direct children (due to > combinator)
    // DOM STRUCTURE:
    //   <ul class="top-menu">
    //     <li><a href="/">Home</a></li>          ✓ FIRST child
    //     <li><a href="/about">About</a></li>     (second child)
    //     <li><a href="/shop">Shop</a></li>       (third child)
    //   </ul>
    // EXPECTED OUTPUT: ✓ First menu item: Home
    //                  Gets text content of first menu item
    //                  Usually "Home" or similar first navigation item
    const firstChildLocator: Locator = page.locator('ul.top-menu > li:first-child');
    const firstChild = await firstChildLocator.textContent();
    console.log(`✓ First menu item: ${firstChild?.trim()}`);

    // Example 14: Locate element by :last-child pseudo-class
    // WHEN: Element is last child of parent
    // WHY: End position without knowing count
    // SELECTOR: ul.top-menu > li:last-child
    // EXPLANATION: Targets <li> that is the last child under <ul class="top-menu">
    //              :last-child matches element at the END (doesn't require knowing position number)
    //              Automatically selects final element regardless of count
    // DOM STRUCTURE:
    //   <ul class="top-menu">
    //     <li><a href="/">Home</a></li>
    //     <li><a href="/about">About</a></li>
    //     <li><a href="/contact">Contact us</a></li>  ✓ LAST child
    //   </ul>
    // EXPECTED OUTPUT: ✓ Last menu item: Contact us
    //                  Gets text content of last menu item
    //                  Usually the final navigation item
    const lastChildLocator: Locator = page.locator('ul.top-menu > li:last-child');
    const lastChild = await lastChildLocator.textContent();
    console.log(`✓ Last menu item: ${lastChild?.trim()}`);

    // Example 15: Locate element by :nth-child() pseudo-class
    // WHEN: Element is at specific position (1-based indexing)
    // WHY: Direct position targeting
    // SELECTOR: ul.top-menu > li:nth-child(2)
    // EXPLANATION: Targets <li> at position 2 (1-based, NOT 0-based)
    //              :nth-child(n) selects element at exact position n
    //              Position 1 = first, Position 2 = second, etc.
    // DOM STRUCTURE:
    //   <ul class="top-menu">
    //     <li><a href="/">Home</a></li>          Position 1
    //     <li><a href="/about">About</a></li>     ✓ Position 2
    //     <li><a href="/shop">Shop</a></li>       Position 3
    //   </ul>
    // EXPECTED OUTPUT: ✓ Second menu item: About
    //                  Gets text content of 2nd menu item
    //                  Usually "About" or second navigation item
    const nthChildLocator: Locator = page.locator('ul.top-menu > li:nth-child(2)');
    const nthChild = await nthChildLocator.textContent();
    console.log(`✓ Second menu item: ${nthChild?.trim()}`);

    // Example 16: Locate element by :nth-of-type() pseudo-class
    // WHEN: Element type occurs at specific position
    // WHY: Like nth-child but matches only same tag type (ignores other element types)
    // SELECTOR: a:nth-of-type(3)
    // EXPLANATION: Targets the 3rd <a> element (counts only <a> tags, ignores others)
    //              Different from :nth-child(3) which counts ALL child element types
    //              Useful when parent has mixed element types
    // DOM EXAMPLE (same parent with mixed types):
    //   <div>
    //     <span>Text 1</span>
    //     <a href="/">Link 1</a>           1st <a> element
    //     <p>Paragraph</p>
    //     <a href="/about">Link 2</a>      2nd <a> element
    //     <div>Another div</div>
    //     <a href="/shop">Link 3</a>       ✓ 3rd <a> element
    //   </div>
    // EXPECTED OUTPUT: ✓ Found :nth-of-type(3) selector (third link element)
    //                  Usually 1 element found (the 3rd link)
    //                  Text content would be the 3rd link's text
    const nthOfTypeLocator: Locator = page.locator('a:nth-of-type(3)');
    const nthOfTypeCount = await nthOfTypeLocator.count();
    console.log(`✓ Found :nth-of-type(3) selector (third link element)`);

    // Example 17: Locate element using adjacent sibling combinator +
    // WHEN: Element immediately follows known element
    // WHY: +: Targets element directly after another (must be IMMEDIATELY next)
    // SELECTOR: .product-item + div
    // EXPLANATION: Targets <div> that IMMEDIATELY follows .product-item
    //              The + combinator means "adjacent sibling" (directly next, no elements between)
    //              If there's any element between them, no match
    // DOM EXAMPLES:
    //   <div class="product-item">Product 1</div>
    //   <div>Details</div>                  ✓ IMMEDIATELY after product-item
    //   ──────────────────────────────
    //   <div class="product-item">Product 1</div>
    //   <span>Label</span>
    //   <div>Details</div>                  ✗ NOT immediately after (span is between)
    // EXPECTED OUTPUT: ✓ Found X elements adjacent after product-item
    //                  X = number of divs immediately after a product-item
    //                  Usually fewer than total divs (only immediate siblings)
    const adjacentLocator: Locator = page.locator('.product-item + div');
    const adjacentCount = await adjacentLocator.count();
    console.log(`✓ Found ${adjacentCount} elements adjacent after product-item`);

    // Example 18: Locate element using general sibling combinator ~
    // WHEN: Element comes after known element (NOT necessarily adjacent)
    // WHY: ~: Flexible sibling matching, allows intervening elements
    // SELECTOR: .product-item ~ div
    // EXPLANATION: Targets ALL <div> that come AFTER .product-item
    //              The ~ combinator means "general sibling" (after, but not necessarily immediate)
    //              Unlike +, doesn't require immediate adjacency
    // DOM EXAMPLES:
    //   <div class="product-item">Product 1</div>
    //   <div>Details</div>                  ✓ AFTER product-item
    //   ──────────────────────────────
    //   <div class="product-item">Product 1</div>
    //   <span>Label</span>
    //   <div>Details</div>                  ✓ AFTER product-item (intervening span OK)
    //   ──────────────────────────────
    //   <div>Details</div>                  ✓ AFTER product-item (with other elements between)
    // EXPECTED OUTPUT: ✓ Found X elements after product-item (any order)
    //                  X = all divs after ANY product-item (typically 10-20+)
    //                  Usually more than adjacent sibling count
    const siblingLocator: Locator = page.locator('.product-item ~ div');
    const siblingCount = await siblingLocator.count();
    console.log(`✓ Found ${siblingCount} elements after product-item (any order)`);

    // Example 19: Locate element using :empty pseudo-class
    // WHEN: Element has no content or children
    // WHY: Empty state validation, find placeholder elements
    // SELECTOR: div:empty
    // EXPLANATION: Targets <div> elements that are COMPLETELY EMPTY
    //              No text content, no child elements, nothing inside
    //              Even single whitespace makes element non-empty (in some cases)
    // HTML EXAMPLES:
    //   <div></div>                         ✓ EMPTY
    //   <div>  </div>                       ✓ EMPTY (whitespace only, in some browsers)
    //   <div><span></span></div>            ✗ NOT empty (contains child element)
    //   <div>Some text</div>                ✗ NOT empty (contains text)
    // EXPECTED OUTPUT: ✓ Found X empty div elements
    //                  X = number of completely empty divs (typically 0-10)
    //                  Often used to find placeholder containers
    const emptyLocator: Locator = page.locator('div:empty');
    const emptyCount = await emptyLocator.count();
    console.log(`✓ Found ${emptyCount} empty div elements`);

    // Example 20: Locate element using grouping selector (comma)
    // WHEN: Match multiple different selectors
    // WHY: Select multiple elements with different selectors in one call
    // SELECTOR: h1, h2, h3
    // EXPLANATION: Targets ANY element matching h1 OR h2 OR h3
    //              The comma (,) means "OR" - any selector in the list matches
    //              Returns all elements matching any of the conditions
    // HTML EXAMPLES:
    //   <h1>Main Title</h1>                 ✓ MATCHES h1
    //   <p>Text</p>                         ✗ NO MATCH
    //   <h2>Subtitle</h2>                   ✓ MATCHES h2
    //   <h3>Section</h3>                    ✓ MATCHES h3
    //   <h4>Subsection</h4>                 ✗ NO MATCH
    // EXPECTED OUTPUT: ✓ Found X heading elements (h1, h2, or h3)
    //                  X = total count of h1 + h2 + h3 on page (typically 5-15)
    const groupLocator: Locator = page.locator('h1, h2, h3');
    const headingCount = await groupLocator.count();
    console.log(`✓ Found ${headingCount} heading elements (h1, h2, or h3)`);

    // Example 21: Locate element by complex chain
    // WHEN: Multiple conditions across hierarchy
    // WHY: Combines multiple selectors for precision targeting
    // SELECTOR: div.container > ul > li:not([class]) > a
    // EXPLANATION: Complex selector combining multiple techniques:
    //              1. div.container - Start with div with class="container"
    //              2. > ul - Get direct child <ul>
    //              3. > li:not([class]) - Get <li> without any class attribute
    //              4. > a - Get direct child <a> inside those <li>
    // DOM STRUCTURE EXAMPLE:
    //   <div class="container">
    //     <ul>
    //       <li><a href="/">Home</a></li>         ✓ No class, matches
    //       <li class="active"><a>About</a></li>  ✗ Has class, excluded
    //       <li><a href="/">Link</a></li>         ✓ No class, matches
    //     </ul>
    //   </div>
    // EXPECTED OUTPUT: ✓ Found X links in complex selector chain
    //                  X = count of <a> in unclassed <li> in <ul> in container
    //                  Usually small count (very specific matching)
    const complexLocator: Locator = page.locator('div.container > ul > li:not([class]) > a');
    const complexCount = await complexLocator.count();
    console.log(`✓ Found ${complexCount} links in complex selector chain`);

    // Example 22: Locate element case-insensitive attribute match [attr="value" i]
    // WHEN: Attribute value should match ignoring case
    // WHY: Browser support varies, robust for email/domains
    // SELECTOR: input[type="TEXT" i]
    // EXPLANATION: Targets <input> where type="TEXT" (case-insensitive)
    //              The [i] flag makes the attribute match case-insensitive
    //              "TEXT", "text", "Text" all match same selector
    // HTML EXAMPLES:
    //   <input type="text" />                ✓ MATCHES (case-insensitive)
    //   <input type="TEXT" />                ✓ MATCHES (case-insensitive)
    //   <input type="Text" />                ✓ MATCHES (case-insensitive)
    //   <input type="password" />            ✗ NO MATCH
    // EXPECTED OUTPUT: ✓ Found X text inputs (case-insensitive)
    //                  X = all text inputs regardless of case (typically same as type="text")
    const caseInsensitiveLocator: Locator = page.locator('input[type="TEXT" i]');
    const caseInsensitiveCount = await caseInsensitiveLocator.count();
    console.log(`✓ Found ${caseInsensitiveCount} text inputs (case-insensitive)`);

    // Example 23: Locate element using :enabled pseudo-class
    // WHEN: Form elements that are enabled (not disabled)
    // WHY: Validate interactive elements, find usable inputs
    // SELECTOR: input:enabled
    // EXPLANATION: Targets <input> elements that are NOT disabled
    //              :enabled matches form elements you can interact with
    //              Opposite of :disabled
    // HTML EXAMPLES:
    //   <input type="text" />                ✓ ENABLED (default state)
    //   <input type="text" disabled />       ✗ DISABLED
    //   <input type="text" enabled />        ✓ ENABLED (explicit)
    // EXPECTED OUTPUT: ✓ Found X enabled input elements
    //                  X = all inputs that can be interacted with (typically 5-15)
    //                  Usually most inputs are enabled
    const enabledLocator: Locator = page.locator('input:enabled');
    const enabledCount = await enabledLocator.count();
    console.log(`✓ Found ${enabledCount} enabled input elements`);

    // Example 24: Locate element using :disabled pseudo-class
    // WHEN: Form elements that are disabled
    // WHY: Find inactive form controls, validate disabled state
    // SELECTOR: input:disabled
    // EXPLANATION: Targets <input> elements with disabled attribute
    //              :disabled matches form elements you cannot interact with
    //              Useful for form state validation
    // HTML EXAMPLES:
    //   <input type="text" />                ✗ NOT disabled
    //   <input type="text" disabled />       ✓ DISABLED
    //   <input type="text" disabled="true" /> ✓ DISABLED
    // EXPECTED OUTPUT: ✓ Found X disabled input elements
    //                  X = all inputs with disabled attribute (typically 0-3)
    //                  Usually few disabled inputs, often button-related
    const disabledLocator: Locator = page.locator('input:disabled');
    const disabledCount = await disabledLocator.count();
    console.log(`✓ Found ${disabledCount} disabled input elements`);

});

/*
================================================================================
CSS SELECTOR SYNTAX COMPLETE REFERENCE
================================================================================

SELECTOR TYPE          │ SYNTAX EXAMPLE           │ WHAT IT SELECTS
───────────────────────┼──────────────────────────┼─────────────────────────────────
Universal              │ *                        │ All elements
Tag                    │ a, div, input            │ Elements of specific tag
ID                     │ #container               │ Element with id="container"
Class                  │ .button                  │ Elements with class="button"
Attribute              │ [type="text"]            │ Elements with specific attribute
Attribute contains     │ [href*="api"]            │ Attribute value contains "api"
Attribute starts-with  │ [href^="https"]          │ Attribute starts with "https"
Attribute ends-with    │ [href$=".pdf"]           │ Attribute ends with ".pdf"
Attribute word match   │ [class~="active"]        │ Class list contains "active"
Attribute exact        │ [type="button"]          │ Exact attribute match
Multiple attributes    │ [type="text"][name="q"]  │ Both attributes required
Multiple classes       │ .header.wrapper          │ Element has all classes
Descendant             │ div a                    │ <a> anywhere in <div>
Child                  │ div > a                  │ <a> is direct child of <div>
Adjacent sibling       │ h1 + p                   │ <p> immediately after <h1>
General sibling        │ h1 ~ p                   │ <p> after <h1> (any order)
Grouping               │ h1, h2, h3               │ Any of: h1 or h2 or h3
───────────────────────┴──────────────────────────┴─────────────────────────────────

PSEUDO-CLASSES (::)    │ SYNTAX EXAMPLE           │ WHAT IT SELECTS
───────────────────────┼──────────────────────────┼─────────────────────────────────
:first-child           │ li:first-child           │ <li> that is first child
:last-child            │ li:last-child            │ <li> that is last child
:nth-child(n)          │ li:nth-child(3)          │ <li> at position 3
:nth-of-type(n)        │ a:nth-of-type(2)         │ Second <a> of same type
:only-child            │ p:only-child             │ <p> that is only child
:only-of-type          │ p:only-of-type           │ <p> that is only <p> under parent
:empty                 │ div:empty                │ Elements with no content
:not(selector)         │ a:not([disabled])        │ <a> without disabled attribute
:enabled               │ input:enabled            │ Enabled form elements
:disabled              │ input:disabled           │ Disabled form elements
:checked               │ input:checked            │ Selected radio/checkbox
:visited               │ a:visited                │ Visited links (limited access)
:link                  │ a:link                   │ Unvisited links
:hover                 │ button:hover             │ Elements on hover (not testable)
:focus                 │ input:focus              │ Element with focus
:target                │ div:target               │ Element matching URL fragment
───────────────────────┴──────────────────────────┴─────────────────────────────────

COMMON REAL-WORLD PATTERNS:
┌─────────────────────────────────────┬────────────────────────────────────────┐
│ USE CASE                            │ CSS SELECTOR                           │
├─────────────────────────────────────┼────────────────────────────────────────┤
│ Search input field                  │ input[type="text"][placeholder*="sea"] │
│ Submit button                       │ button[type="submit"]                  │
│ Active menu item                    │ ul.menu > li.active > a                │
│ All form controls                   │ input, textarea, select                │
│ Links in header                     │ header a, nav a                        │
│ Hidden elements                     │ [style*="display: none"]               │
│ Data attributes                     │ [data-test="login"]                    │
│ External links                      │ a[href^="http"]                        │
│ Disabled buttons                    │ button:disabled, button[disabled]      │
│ Required form fields                │ input[required], [aria-required]       │
└─────────────────────────────────────┴────────────────────────────────────────┘
*/

test('CSS attribute selectors - comprehensive guide', async ({page}) => {
    await page.goto('https://demowebshop.tricentis.com/');
    
    console.log(`
    ========================================================================
    CSS ATTRIBUTE SELECTORS - DETAILED BREAKDOWN
    ========================================================================
    
    FORMAT:    [attribute="value"]
    
    OPERATORS:
    ──────────
    =        Exact match           [type="text"] → type is exactly "text"
    *=       Contains              [href*="api"] → href contains "api"
    ^=       Starts with           [href^="https"] → href starts with "https"
    $=       Ends with             [src$=".jpg"] → src ends with ".jpg"
    ~=       Word match            [class~="btn"] → class list contains "btn"
    |=       Prefix or hyphen      [lang|="en"] → lang is "en" or "en-*"
    [no op]  Presence              [disabled] → has disabled attribute (any value)
    `);

    // Example 1: Attribute exact match [attr="value"]
    // SELECTOR: input[type="text"]
    // EXPLANATION: Matches <input> where type attribute EQUALS exactly "text"
    //              = operator requires exact match (case-sensitive)
    //              Fastest attribute matching
    // HTML EXAMPLES:
    //   <input type="text" />           ✓ EXACT match
    //   <input type="TEXT" />           ✗ Case different (exact match fails)
    //   <input type="text " />          ✗ Extra space (not exact)
    //   <input type="password" />       ✗ Different value
    // EXPECTED OUTPUT: ✓ Found X text input fields
    //                  X = number of <input type="text"> (typically 3-8)
    //                  Includes search box, form fields, etc.\n    const exactType = page.locator('input[type="text"]');\n    const exactCount = await exactType.count();\n    console.log(`Exact [type="text"]: Found ${exactCount} elements`);\n\n    // Example 2: Attribute contains [attr*=\"value\"] - SUBSTRING MATCH\n    // SELECTOR: a[href*=\"shop\"]\n    // EXPLANATION: Matches <a> where href contains \"shop\" ANYWHERE\n    //              *=  operator matches substring (flexible)\n    //              \"shop\" can be at start, middle, or end\n    // HTML EXAMPLES:\n    //   <a href=\"/shop\">Shop</a>                  ✓ Contains \"shop\"\n    //   <a href=\"/api/shop/products\">API</a>     ✓ Contains \"shop\"\n    //   <a href=\"shopping-cart\">Cart</a>         ✓ Contains \"shop\"\n    //   <a href=\"/products\">Products</a>         ✗ NO \"shop\" in href\n    // EXPECTED OUTPUT: ✓ Contains [href*=\"shop\"]: Found X elements\n    //                  X = links with \"shop\" in URL (typically 5-15)\n    //                  Includes shop, product pages, shopping cart\n    const containsHref = page.locator('a[href*=\"shop\"]');\n    const containsCount = await containsHref.count();\n    console.log(`Contains [href*=\"shop\"]: Found ${containsCount} elements`);\n\n    // Example 3: Attribute starts-with [attr^=\"value\"] - PREFIX MATCH\n    // SELECTOR: a[href^=\"/\"]\n    // EXPLANATION: Matches <a> where href STARTS WITH \"/\"\n    //              ^= operator matches prefix only\n    //              Great for internal vs external link detection\n    // HTML EXAMPLES:\n    //   <a href=\"/shop\">Shop</a>                  ✓ Starts with \"/\"\n    //   <a href=\"/about/team\">Team</a>           ✓ Starts with \"/\"\n    //   <a href=\"https://external.com\">Ext</a>   ✗ Starts with \"https\"\n    //   <a href=\"about.html\">About</a>           ✗ Starts with \"about\"\n    // EXPECTED OUTPUT: ✓ Starts [href^=\"/\"]: Found X elements\n    //                  X = internal links (relative URLs) (typically 15-30)\n    //                  All links pointing to internal pages\n    const startsUrl = page.locator('a[href^=\"/\"]');\n    const startsCount = await startsUrl.count();\n    console.log(`Starts [href^=\"/\"]: Found ${startsCount} elements`);\n\n    // Example 4: Attribute ends-with [attr$=\"value\"] - SUFFIX MATCH\n    // SELECTOR: a[href$=\".pdf\"]\n    // EXPLANATION: Matches <a> where href ENDS WITH \".pdf\"\n    //              $= operator matches suffix only\n    //              Useful for file type detection\n    // HTML EXAMPLES:\n    //   <a href=\"/download.pdf\">PDF</a>          ✓ Ends with \".pdf\"\n    //   <a href=\"/docs/guide.pdf\">Guide</a>      ✓ Ends with \".pdf\"\n    //   <a href=\"/download.pdf?v=1\">PDF</a>      ✗ Ends with \"?v=1\"\n    //   <a href=\"/document.doc\">Doc</a>          ✗ Ends with \".doc\"\n    // EXPECTED OUTPUT: ✓ Ends [href$=\".pdf\"]: Found X elements\n    //                  X = links to PDF files (typically 0-5)\n    //                  Usually few links, often download/resource links\n    const endsPdf = page.locator('a[href$=\".pdf\"]');\n    const endsCount = await endsPdf.count();\n    console.log(`Ends [href$=\".pdf\"]: Found ${endsCount} elements`);\n\n    // Example 5: Attribute word-match [attr~=\"value\"] - WORD IN LIST\n    // SELECTOR: [class~=\"header\"]\n    // EXPLANATION: Matches elements where class is space-separated list containing \"header\"\n    //              ~= operator matches word in space-separated list\n    //              Perfect for class matching\n    // HTML EXAMPLES:\n    //   <div class=\"header\">...</div>            ✓ Class list contains \"header\"\n    //   <div class=\"header wrapper\">...</div>    ✓ Class list contains \"header\"\n    //   <div class=\"navbar header-nav\">...</div>  ✗ \"header\" is part of word, not full word\n    //   <div class=\"wrapper\">...</div>           ✗ Class list doesn't contain \"header\"\n    // EXPECTED OUTPUT: ✓ Word match [class~=\"header\"]: Found X elements\n    //                  X = elements with \"header\" in class list (typically 2-5)\n    const wordMatch = page.locator('[class~=\"header\"]');\n    const wordCount = await wordMatch.count();\n    console.log(`Word match [class~=\"header\"]: Found ${wordCount} elements`);\n\n    // Example 6: Attribute presence [attr] - ATTRIBUTE EXISTS\n    // SELECTOR: input[disabled]\n    // EXPLANATION: Matches <input> elements that HAVE disabled attribute\n    //              Ignores attribute value (can be empty or any value)\n    //              No operator = just checks existence\n    // HTML EXAMPLES:\n    //   <input disabled />                       ✓ Has disabled attribute\n    //   <input disabled=\"true\" />                ✓ Has disabled attribute\n    //   <input disabled=\"false\" />               ✓ Has disabled attribute (value ignored)\n    //   <input />                                ✗ No disabled attribute\n    // EXPECTED OUTPUT: ✓ Presence [disabled]: Found X elements\n    //                  X = number of disabled inputs (typically 0-3)\n    const hasDisabled = page.locator('input[disabled]');\n    const disabledCount = await hasDisabled.count();\n    console.log(`Presence [disabled]: Found ${disabledCount} elements`);\n\n    // Example 7: Multiple attribute selectors (AND condition)\n    // SELECTOR: input[type=\"text\"][name=\"q\"]\n    // EXPLANATION: Matches <input> where BOTH conditions are true:\n    //              1. type=\"text\" (exact match)\n    //              2. name=\"q\" (exact match)\n    //              Chaining [attr1][attr2] = AND logic\n    // HTML EXAMPLES:\n    //   <input type=\"text\" name=\"q\" />          ✓ BOTH conditions met\n    //   <input type=\"text\" name=\"search\" />     ✗ type OK, name wrong\n    //   <input type=\"password\" name=\"q\" />      ✗ name OK, type wrong\n    //   <input type=\"text\" name=\"q\" id=\"x\" />  ✓ BOTH conditions met (extra attrs OK)\n    // EXPECTED OUTPUT: ✓ Multiple attrs [type=\"text\"][name=\"q\"]: Found X elements\n    //                  X = inputs matching BOTH criteria (typically 1-2)\n    //                  Very specific selector\n    const multiAttr = page.locator('input[type=\"text\"][name=\"q\"]');\n    const multiCount = await multiAttr.count();\n    console.log(`Multiple attrs [type=\"text\"][name=\"q\"]: Found ${multiCount} elements`);\n\n    // Example 8: Complex attribute matching (MULTIPLE CONDITIONS)\n    // SELECTOR: a[href^=\"https\"][href$=\".html\"]\n    // EXPLANATION: Matches <a> where href STARTS WITH \"https\" AND ENDS WITH \".html\"\n    //              Combines multiple attribute operators (^= and $=)\n    //              All conditions must be satisfied\n    // HTML EXAMPLES:\n    //   <a href=\"https://example.com/page.html\">Page</a>  ✓ Both conditions\n    //   <a href=\"https://example.com/page.pdf\">PDF</a>    ✗ Ends with .pdf\n    //   <a href=\"http://example.com/page.html\">Page</a>   ✗ Starts with http\n    // EXPECTED OUTPUT: ✓ Complex [href^=\"https\"][href$=\".html\"]: Found X elements\n    //                  X = links matching both conditions (typically 0-3)\n    const urlMatch = page.locator('a[href^=\"https\"][href$=\".html\"]');\n    const urlCount = await urlMatch.count();\n    console.log(`Complex [href^=\"https\"][href$=\".html\"]: Found ${urlCount} elements`);\n\n    // Example 9: Case-insensitive attribute matching [attr=\"value\" i]\n    // SELECTOR: input[type=\"text\" i]\n    // EXPLANATION: Matches <input> where type contains \"text\" (case-insensitive)\n    //              The [i] flag makes matching case-insensitive\n    //              \"text\", \"TEXT\", \"Text\", \"TeXt\" all match\n    // HTML EXAMPLES:\n    //   <input type=\"text\" />                    ✓ Matches (lowercase)\n    //   <input type=\"TEXT\" />                    ✓ Matches (uppercase)\n    //   <input type=\"Text\" />                    ✓ Matches (mixed case)\n    //   <input type=\"password\" />                ✗ Different value\n    // EXPECTED OUTPUT: ✓ Case-insensitive [type=\"text\" i]: Found X elements\n    //                  X = all text inputs regardless of case (typically same as exact match)\n    const caseInsens = page.locator('input[type=\"text\" i]');\n    const caseCount = await caseInsens.count();\n    console.log(`Case-insensitive [type=\"text\" i]: Found ${caseCount} elements`);\n\n    // Example 10: Negating attribute matching :not([attr])\n    // SELECTOR: a:not([href])\n    // EXPLANATION: Matches <a> elements that do NOT have href attribute\n    //              :not() negates the condition inside\n    //              Finds anchor tags without links (not clickable)\n    // HTML EXAMPLES:\n    //   <a>Text</a>                              ✓ NO href attribute\n    //   <a href=\"/\">Home</a>                     ✗ HAS href attribute\n    //   <a name=\"section1\">Section</a>          ✓ NO href attribute\n    // EXPECTED OUTPUT: ✓ Without attribute a:not([href]): Found X anchor tags without href\n    //                  X = anchors without href (typically 0-2)\n    //                  Usually very few, mostly just links with href\n    const noHref = page.locator('a:not([href])');\n    const noHrefCount = await noHref.count();\n    console.log(`Without attribute a:not([href]): Found ${noHrefCount} anchor tags without href`);

    console.log(`
    ATTRIBUTE SELECTOR BEST PRACTICES:
    ═══════════════════════════════════
    
    1. USE EXACT MATCH (=) when:
       ✓ Value is fixed and stable
       ✓ Looking for specific attribute value
       ✗ Value is dynamic or changes often
    
    2. USE CONTAINS (*=) when:
       ✓ Value has dynamic parts (IDs with random suffixes)
       ✓ Matching part of value is sufficient
       ✓ Avoiding fragile exact matching
    
    3. USE STARTS-WITH (^=) when:
       ✓ Prefix is stable (URL paths, ID prefixes)
       ✓ Suffix varies dynamically
       ✓ Security prefixes (https://)
    
    4. USE ENDS-WITH ($=) when:
       ✓ File extensions ([href$=".pdf"])
       ✓ Domain endings
       ✓ Known suffixes with dynamic prefixes
    
    5. USE WORD-MATCH (~=) when:
       ✓ Matching CSS classes
       ✓ Space-separated attribute values
       ✓ Multiple class names possible
    
    COMMON PATTERNS:
    ✓ input[type="email"]          - Email inputs
    ✓ a[href^="/"]                 - Internal links
    ✓ a[href^="http"]              - External links
    ✓ [data-test="value"]          - Test data attributes
    ✓ [aria-label*="close"]        - Accessibility labels
    ✓ button:not([disabled])       - Enabled buttons
    ✓ input[required]              - Required form fields
    `);
});

test('CSS pseudo-classes - comprehensive guide', async ({page}) => {
    await page.goto('https://demowebshop.tricentis.com/');
    
    console.log(`
    ========================================================================
    CSS PSEUDO-CLASSES - DETAILED BREAKDOWN
    ========================================================================
    
    PSEUDO-CLASSES: Special keywords starting with : that select elements
    based on STATE or STRUCTURAL POSITION in the DOM.
    
    CATEGORIES:
    1. CHILD POSITION pseudo-classes (location-based)
    2. FORM STATE pseudo-classes (input state)
    3. CONTENT pseudo-classes (element content)
    4. OTHER pseudo-classes
    `);

    // ====================================================================
    // STRUCTURAL/POSITION PSEUDO-CLASSES
    // ====================================================================
    
    console.log('\n--- POSITION-BASED PSEUDO-CLASSES ---');

    // Example 1: :first-child
    // SELECTOR: ul.top-menu > li:first-child
    // EXPLANATION: Matches <li> that is the FIRST child of <ul class="top-menu">
    //              :first-child selects element at position 1 (1-based indexing)
    //              Only with > combinator (direct children), not descendants
    // DOM EXAMPLE:
    //   <ul class="top-menu">
    //     <li><a>Home</a></li>        ✓ FIRST child - position 1
    //     <li><a>About</a></li>       (position 2)
    //     <li><a>Shop</a></li>        (position 3)
    //   </ul>
    // EXPECTED OUTPUT: ✓ :first-child - First menu item: "Home"
    //                  Gets text of first menu item
    //                  Usually "Home" or "Dashboard"
    const firstChild = page.locator('ul.top-menu > li:first-child');
    const firstChildText = await firstChild.textContent();
    console.log(`✓ :first-child - First menu item: "${firstChildText?.trim()}"`);

    // Example 2: :last-child
    // SELECTOR: ul.top-menu > li:last-child
    // EXPLANATION: Matches <li> that is the LAST child of <ul class="top-menu">
    //              :last-child selects final element without knowing count
    //              Automatically adapts if elements are added/removed
    // DOM EXAMPLE:
    //   <ul class="top-menu">
    //     <li><a>Home</a></li>
    //     <li><a>About</a></li>
    //     <li><a>Contact</a></li>    ✓ LAST child - final element
    //   </ul>
    // EXPECTED OUTPUT: ✓ :last-child - Last menu item: "Contact"
    //                  Gets text of final menu item
    //                  Usually "Contact" or "Logout"
    const lastChild = page.locator('ul.top-menu > li:last-child');
    const lastChildText = await lastChild.textContent();
    console.log(`✓ :last-child - Last menu item: "${lastChildText?.trim()}"`);

    // Example 3: :nth-child(n)
    // SELECTOR: ul.top-menu > li:nth-child(2)
    // EXPLANATION: Matches <li> at SPECIFIC position n (1-based, position 2 = second)
    //              Counts ALL children types regardless of tag
    //              Useful for row striping or specific position targeting
    // DOM EXAMPLE:
    //   <ul class="top-menu">
    //     <li><a>Home</a></li>        Position 1
    //     <li><a>About</a></li>       ✓ Position 2
    //     <li><a>Shop</a></li>        Position 3
    //   </ul>
    // EXPECTED OUTPUT: ✓ :nth-child(2) - Second menu item: "About"
    //                  Gets text of element at position 2
    //                  Second item in navigation
    const nthChild = page.locator('ul.top-menu > li:nth-child(2)');
    const nthChildText = await nthChild.textContent();
    console.log(`✓ :nth-child(2) - Second menu item: "${nthChildText?.trim()}"`);

    // Example 4: :nth-child(odd) and :nth-child(even)
    // SELECTOR: ul.top-menu > li:nth-child(odd)
    // EXPLANATION: Matches <li> at ODD positions (1, 3, 5, 7...)
    //              :nth-child(odd) = positions 1, 3, 5, etc.
    //              :nth-child(even) = positions 2, 4, 6, etc.
    //              Useful for alternating row colors (zebra striping)
    // DOM EXAMPLE:
    //   <ul class="top-menu">
    //     <li><a>Home</a></li>        ✓ Position 1 (odd)
    //     <li><a>About</a></li>         Position 2 (even)
    //     <li><a>Shop</a></li>        ✓ Position 3 (odd)
    //     <li><a>Blog</a></li>          Position 4 (even)
    //   </ul>
    // EXPECTED OUTPUT: ✓ :nth-child(odd) - Found X menu items at odd positions (1,3,5...)
    //                  X = count of odd-positioned items (typically 2-3)
    //                  Used for alternating styling in tables/lists
    const oddChildren = page.locator('ul.top-menu > li:nth-child(odd)');
    const oddCount = await oddChildren.count();
    console.log(`✓ :nth-child(odd) - Found ${oddCount} menu items at odd positions (1,3,5...)`);

    // Example 5: :nth-of-type(n)
    // SELECTOR: a:nth-of-type(3)
    // EXPLANATION: Matches the 3rd <a> element under parent (counts ONLY <a> tags)
    //              Different from :nth-child - ignores other element types
    //              Useful when parent has mixed element types
    // DOM EXAMPLE (mixed elements in parent):
    //   <div>
    //     <span>Label</span>           (not <a>)
    //     <a href="/">Link 1</a>      1st <a> element
    //     <p>Text</p>                  (not <a>)
    //     <a href="/about">Link 2</a>  2nd <a> element
    //     <img src=".jpg">             (not <a>)
    //     <a href="/shop">Link 3</a>   ✓ 3rd <a> element
    //   </div>
    // EXPECTED OUTPUT: ✓ :nth-of-type(3) - Third <a> tag: "Link 3"
    //                  Gets text of 3rd <a> element
    //                  Matches position within same element type
    const nthOfType = page.locator('a:nth-of-type(3)');
    const nthOfTypeText = await nthOfType.textContent();
    console.log(`✓ :nth-of-type(3) - Third <a> tag: "${nthOfTypeText?.trim()}"`);

    // Example 6: :first-of-type
    // SELECTOR: ul li:first-of-type
    // EXPLANATION: Matches the FIRST <li> element under <ul>
    //              Counts only <li> tags (ignores other element types)
    //              Equivalent to :nth-of-type(1)
    // DOM EXAMPLE:
    //   <ul>
    //     <li>Item 1</li>      ✓ FIRST of type <li>
    //     <li>Item 2</li>
    //     <li>Item 3</li>
    //   </ul>
    // EXPECTED OUTPUT: ✓ :first-of-type - First <li> under <ul>: "Item 1"
    //                  Gets text of first list item
    //                  Same as :nth-child(1) in this case
    const firstOfType = page.locator('ul li:first-of-type');
    const firstOfTypeText = await firstOfType.textContent();
    console.log(`✓ :first-of-type - First <li> under <ul>: "${firstOfTypeText?.trim()}"`);

    // Example 7: :last-of-type
    // SELECTOR: ul li:last-of-type
    // EXPLANATION: Matches the LAST <li> element under <ul>
    //              Counts only <li> tags (ignores other types)
    //              Equivalent to :nth-of-type(last)
    // DOM EXAMPLE:
    //   <ul>
    //     <li>Item 1</li>
    //     <li>Item 2</li>
    //     <li>Item 3</li>      ✓ LAST of type <li>
    //   </ul>
    // EXPECTED OUTPUT: ✓ :last-of-type - Last <li> under <ul>: "Item 3"
    //                  Gets text of final list item
    //                  Useful for last item styling
    const lastOfType = page.locator('ul li:last-of-type');
    const lastOfTypeText = await lastOfType.textContent();
    console.log(`✓ :last-of-type - Last <li> under <ul>: "${lastOfTypeText?.trim()}"`);

    // Example 8: :only-child
    // SELECTOR: div:only-child
    // EXPLANATION: Matches <div> that is the ONLY child of its parent
    //              Parent must have exactly one child element
    //              No siblings allowed
    // DOM EXAMPLES:
    //   <section>
    //     <div>Content</div>    ✓ ONLY child
    //   </section>
    //   ─────────────────────────
    //   <section>
    //     <div>Content 1</div>   ✗ Has sibling
    //     <div>Content 2</div>   ✗ Not only child
    //   </section>
    // EXPECTED OUTPUT: ✓ :only-child - Found X only-child elements
    //                  X = divs that are only child (typically 0-5)
    //                  Usually few, mostly nested components
    const onlyChild = page.locator('div:only-child');
    const onlyChildCount = await onlyChild.count();
    console.log(`✓ :only-child - Found ${onlyChildCount} only-child elements`);

    // Example 9: :only-of-type
    // SELECTOR: h1:only-of-type
    // EXPLANATION: Matches <h1> that is the ONLY <h1> under its parent
    //              Other element types can exist (not <h1>)
    //              Only <h1> elements are counted
    // DOM EXAMPLES:
    //   <article>
    //     <h1>Title</h1>        ✓ ONLY <h1> (other elements can exist)
    //     <p>Text</p>           (other types OK)
    //   </article>
    //   ─────────────────────────
    //   <article>
    //     <h1>Title 1</h1>       ✗ Not only <h1>
    //     <h1>Title 2</h1>       ✗ Multiple <h1>
    //   </article>
    // EXPECTED OUTPUT: ✓ :only-of-type - Found X only-of-type h1 elements
    //                  X = h1s that are only h1 (typically 1-3)
    //                  Usually main page headings
    const onlyOfType = page.locator('h1:only-of-type');
    const onlyOfTypeCount = await onlyOfType.count();
    console.log(`✓ :only-of-type - Found ${onlyOfTypeCount} only-of-type h1 elements`);

    // Example 10: :empty
    // SELECTOR: div:empty
    // EXPLANATION: Matches <div> with NO content and NO children
    //              Element must be completely empty
    //              No text, no elements inside
    // HTML EXAMPLES:
    //   <div></div>                  ✓ EMPTY
    //   <div>  </div>                ✓ EMPTY (whitespace, in some browsers)
    //   <div><span></span></div>     ✗ Has child element
    //   <div>Text</div>              ✗ Has text content
    // EXPECTED OUTPUT: ✓ :empty - Found X empty div elements
    //                  X = completely empty divs (typically 0-10)
    //                  Often container placeholders or spacers
    const empty = page.locator('div:empty');
    const emptyCount = await empty.count();
    console.log(`✓ :empty - Found ${emptyCount} empty div elements`);

    // ====================================================================
    // FORM STATE PSEUDO-CLASSES
    // ====================================================================
    
    console.log('\\n--- FORM STATE PSEUDO-CLASSES ---');

    // Example 11: :enabled
    // SELECTOR: input:enabled
    // EXPLANATION: Matches <input> elements that are ENABLED (can be interacted with)
    //              Opposite of :disabled
    //              Default state unless disabled attribute present
    // HTML EXAMPLES:
    //   <input type="text" />              ✓ ENABLED (default)
    //   <input type="text" disabled />     ✗ DISABLED
    //   <input type="text" enabled />      ✓ ENABLED (explicit)
    //   <textarea></textarea>              ✓ ENABLED (form element)
    // EXPECTED OUTPUT: ✓ :enabled - Found X enabled input elements
    //                  X = all usable form inputs (typically 5-15)
    //                  Most inputs are enabled by default
    const enabled = page.locator('input:enabled');
    const enabledCount = await enabled.count();
    console.log(`✓ :enabled - Found ${enabledCount} enabled input elements`);

    // Example 12: :disabled
    // SELECTOR: input:disabled
    // EXPLANATION: Matches <input> elements with disabled attribute
    //              Element cannot be interacted with
    //              Usually grayed out or non-clickable
    // HTML EXAMPLES:
    //   <input type="text" />              ✗ NOT disabled
    //   <input type="text" disabled />     ✓ DISABLED
    //   <input type="text" disabled="" />  ✓ DISABLED (empty value OK)
    //   <button disabled>Save</button>      ✓ DISABLED (works on any form element)
    // EXPECTED OUTPUT: ✓ :disabled - Found X disabled input elements
    //                  X = non-interactive inputs (typically 0-3)
    //                  Usually few, often action buttons
    const disabled = page.locator('input:disabled');
    const disabledCount = await disabled.count();
    console.log(`✓ :disabled - Found ${disabledCount} disabled input elements`);

    // Example 13: :checked
    // SELECTOR: input:checked
    // EXPLANATION: Matches <input> elements that are currently SELECTED/CHECKED
    //              Works for radio buttons and checkboxes
    //              Matches only elements in checked state
    // HTML EXAMPLES:
    //   <input type="checkbox" checked />     ✓ CHECKED
    //   <input type="checkbox" />             ✗ NOT checked
    //   <input type="radio" checked />        ✓ CHECKED
    //   <input type="radio" />                ✗ NOT checked
    // EXPECTED OUTPUT: ✓ :checked - Found X checked form elements
    //                  X = selected radio/checkbox inputs (typically 0-5)
    //                  Usually few, depends on form state
    const checked = page.locator('input:checked');
    const checkedCount = await checked.count();
    console.log(`✓ :checked - Found ${checkedCount} checked form elements`);

    // Example 14: :required
    // SELECTOR: input:required
    // EXPLANATION: Matches <input> elements with required attribute
    //              Form validation: these fields MUST be filled
    //              Often marked with asterisk (*) in UI
    // HTML EXAMPLES:
    //   <input type="text" required />       ✓ REQUIRED
    //   <input type="email" required />      ✓ REQUIRED
    //   <input type="text" />                ✗ NOT required
    //   <textarea required></textarea>       ✓ REQUIRED
    // EXPECTED OUTPUT: ✓ :required - Found X required input elements
    //                  X = inputs with required attribute (typically 2-5)
    //                  Usually name, email, password fields
    const required = page.locator('input:required');
    const requiredCount = await required.count();
    console.log(`✓ :required - Found ${requiredCount} required input elements`);

    // Example 15: :optional
    // SELECTOR: input:optional
    // EXPLANATION: Matches <input> elements WITHOUT required attribute
    //              Form validation: these fields are OPTIONAL to fill
    //              Opposite of :required
    // HTML EXAMPLES:
    //   <input type="text" />                ✓ OPTIONAL
    //   <input type="text" required />       ✗ REQUIRED (not optional)
    //   <textarea></textarea>                ✓ OPTIONAL
    //   <select></select>                    ✓ OPTIONAL
    // EXPECTED OUTPUT: ✓ :optional - Found X optional input elements
    //                  X = inputs without required attribute (typically 3-8)
    //                  Usually comment fields, preferences, extras
    const optional = page.locator('input:optional');
    const optionalCount = await optional.count();
    console.log(`✓ :optional - Found ${optionalCount} optional input elements`);

    // ====================================================================
    // NEGATION AND OTHER PSEUDO-CLASSES
    // ====================================================================
    
    console.log('\n--- NEGATION AND OTHER PSEUDO-CLASSES ---');

    // Example 16: :not(selector)
    // SELECTOR: a:not([disabled])
    // EXPLANATION: Matches <a> elements that do NOT match [disabled] condition
    //              :not() negates the inner selector
    //              Finds all <a> tags that are NOT disabled
    // HTML EXAMPLES:
    //   <a href="/">Home</a>                  ✓ NOT disabled
    //   <a href="/about">About</a>            ✓ NOT disabled
    //   <a disabled>Disabled</a>              ✗ IS disabled (excluded)
    // EXPECTED OUTPUT: ✓ :not([disabled]) - Found X non-disabled anchor tags
    //                  X = clickable links (typically 30-50)
    //                  Nearly all links are enabled by default
    const notDisabled = page.locator('a:not([disabled])');
    const notDisabledCount = await notDisabled.count();
    console.log(`✓ :not([disabled]) - Found ${notDisabledCount} non-disabled anchor tags`);

    // Example 17: Multiple :not() selectors
    // SELECTOR: a:not([disabled]):not([href="#"])
    // EXPLANATION: Matches <a> where BOTH conditions are true:
    //              1. NOT [disabled] attribute
    //              2. NOT href="#" (fragment URLs excluded)
    //              Chaining multiple :not() = AND logic
    // HTML EXAMPLES:
    //   <a href="/">Home</a>                  ✓ Not disabled, href != "#"
    //   <a href="#section">Jump</a>           ✗ href = "#"
    //   <a disabled>Disabled</a>              ✗ disabled
    //   <a href="/about">About</a>            ✓ Both conditions met
    // EXPECTED OUTPUT: ✓ :not([disabled]):not([href="#"]) - Found X valid links
    //                  X = truly usable external/page links (typically 25-40)
    //                  Excludes fragment jumps and disabled links
    const notMultiple = page.locator('a:not([disabled]):not([href="#"])');
    const notMultipleCount = await notMultiple.count();
    console.log(`✓ :not([disabled]):not([href="#"]) - Found ${notMultipleCount} valid links`);

    // Example 18: Combining multiple pseudo-classes
    // SELECTOR: ul.top-menu > li:nth-child(1) > a:first-of-type
    // EXPLANATION: Complex selector combining multiple techniques:
    //              1. ul.top-menu - Find unordered list with class top-menu
    //              2. > li:nth-child(1) - Direct child <li> at position 1
    //              3. > a:first-of-type - First <a> of type inside that li
    // DOM STRUCTURE:
    //   <ul class="top-menu">
    //     <li>                               (1st li)
    //       <span>Label</span>
    //       <a href="/">Home</a>            ✓ first <a> of type
    //       <a href="/sub">Sub</a>
    //     </li>
    //     <li>...</li>                      (2nd li)
    //   </ul>
    // EXPECTED OUTPUT: ✓ Combined: ul > li:nth-child(1) > a:first-of-type - Found X
    //                  X = first link in first menu item (typically 1)
    //                  Very specific targeting
    const combined = page.locator('ul.top-menu > li:nth-child(1) > a:first-of-type');
    const combinedCount = await combined.count();
    console.log(`✓ Combined: ul > li:nth-child(1) > a:first-of-type - Found ${combinedCount}`);

    console.log(`
    PSEUDO-CLASS BEST PRACTICES:
    ════════════════════════════════════════════════════════════════════
    
    USE :first-child / :last-child WHEN:
    ✓ Position in list is important
    ✓ First/last item has special styling or behavior
    ✗ Multiple element types are children (use :first-of-type instead)
    
    USE :nth-child(n) WHEN:
    ✓ Targeting specific position
    ✓ nth-child(odd), nth-child(even) for alternating rows
    ✗ Counting only specific element type (use :nth-of-type)
    
    USE :nth-of-type(n) WHEN:
    ✓ Only counting elements of same tag
    ✓ Mixed element types in parent (e.g., li and script)
    ✓ More reliable than :nth-child
    
    USE :enabled / :disabled WHEN:
    ✓ Form validation states
    ✓ Verifying interactive elements
    ✓ Accessibility testing
    
    USE :checked WHEN:
    ✓ Testing radio buttons and checkboxes
    ✓ Form state validation
    
    USE :not() WHEN:
    ✓ Excluding certain elements
    ✓ Finding "all except"
    ✓ Cleaner than negating with complex XPath
    
    PERFORMANCE NOTES:
    ✓ :first-child, :last-child - Very fast
    ✓ :nth-child(n), :nth-of-type(n) - Fast
    ✓ :not() - Fast in modern browsers
    ✓ :enabled, :disabled - Fast
    
    BROWSER COMPATIBILITY:
    ✓ Most pseudo-classes widely supported
    ✓ :not() has limited selector support in older browsers
    ✓ Test in target browsers for pseudo-class support
    `);
});

test('CSS combinators - relationship selectors', async ({page}) => {
    await page.goto('https://demowebshop.tricentis.com/');
    
    console.log(`
    ========================================================================
    CSS COMBINATORS - SELECTING RELATED ELEMENTS
    ========================================================================
    
    COMBINATOR         │ SYMBOL │ WHAT IT DOES
    ──────────────────┼────────┼────────────────────────────────────────────
    Descendant         │ space  │ Selects descendants at ANY depth
    Child              │ >      │ Selects DIRECT children only
    Adjacent sibling   │ +      │ Selects element IMMEDIATELY AFTER
    General sibling    │ ~      │ Selects elements AFTER (any position)
    ──────────────────┴────────┴────────────────────────────────────────────
    
    KEY INSIGHT:
    Combinators select the RIGHT element based on relationship to LEFT element.
    Example: "div > a"
             ├─ LEFT element: div
             ├─ Combinator: >  (direct child)
             └─ RIGHT element: a (the thing we want to select)
    `);

    // ====================================================================
    // DESCENDANT COMBINATOR (space)
    // ====================================================================
    
    console.log('\n--- DESCENDANT COMBINATOR (space) ---');
    
    // Example 1: Basic descendant selector
    // div a = any <a> anywhere inside <div> (at any depth)
    // WHEN: Element can be nested at any level
    // WHY: Flexible, finds deeply nested elements
    const descendant = page.locator('div.header a');
    const descendantCount = await descendant.count();
    console.log(`div.header a - Found ${descendantCount} anchor tags (any depth in header div)`);

    // Example 2: Multiple levels of descendants
    // div span a = <a> inside <span> inside <div>
    const multiLevel = page.locator('body main div a');
    const multiLevelCount = await multiLevel.count();
    console.log(`body main div a - Found ${multiLevelCount} multi-level descendants`);

    // ====================================================================
    // CHILD COMBINATOR (>)
    // ====================================================================
    
    console.log('\n--- CHILD COMBINATOR (>) - DIRECT CHILDREN ONLY ---');

    // Example 3: Basic child selector
    // div > a = only <a> that are DIRECT children of <div>
    // (excludes <a> tags nested inside other elements within the div)
    // WHEN: Only want direct children
    // WHY: More specific than descendant, excludes nested elements
    const child = page.locator('div.header > a');
    const childCount = await child.count();
    console.log(`div.header > a - Found ${childCount} direct child anchor tags`);

    // Example 4: Child vs Descendant comparison
    // Same parent, but > is more restrictive
    const descendantComp = page.locator('ul li a');
    const childComp = page.locator('ul > li > a');
    
    const descCount = await descendantComp.count();
    const childCnt = await childComp.count();
    console.log(`Descendant (ul li a): ${descCount} vs Child (ul > li > a): ${childCnt}`);
    console.log(`${descendantComp ? '✓' : '✗'} Child is more specific/restrictive`);

    // Example 5: Multiple levels with child combinator
    // Must specify each level with >
    const multiChild = page.locator('body > main > div > p');
    const multiChildCount = await multiChild.count();
    console.log(`body > main > div > p - Found ${multiChildCount} specific hierarchy`);

    // ====================================================================
    // ADJACENT SIBLING COMBINATOR (+)
    // ====================================================================
    
    console.log('\n--- ADJACENT SIBLING COMBINATOR (+) - IMMEDIATELY FOLLOWING ---');

    // Example 6: Basic adjacent sibling
    // h1 + p = <p> that IMMEDIATELY follows <h1> (same parent)
    // WHEN: Element comes right after known element
    // WHY: Find related content (e.g., first paragraph after heading)
    const adjacent = page.locator('h1 + p');
    const adjacentCount = await adjacent.count();
    console.log(`h1 + p - Found ${adjacentCount} paragraphs immediately after h1`);

    // Example 7: Adjacent with specific class
    // label + input = <input> immediately after <label>
    const labelInput = page.locator('label + input');
    const labelInputCount = await labelInput.count();
    console.log(`label + input - Found ${labelInputCount} inputs after labels`);

    // Example 8: Adjacent with multiple conditions
    // .error + p.message = paragraph with class "message" immediately after .error
    const adjacentClass = page.locator('.error + p.message');
    const adjacentClassCount = await adjacentClass.count();
    console.log(`✓ .error + p.message - Found ${adjacentClassCount} error messages`);

    // ====================================================================
    // GENERAL SIBLING COMBINATOR (~)
    // ====================================================================
    
    console.log('\n--- GENERAL SIBLING COMBINATOR (~) - ANY FOLLOWING SIBLING ---');

    // Example 9: General sibling combinator
    // h1 ~ p = ANY <p> that comes AFTER <h1> (doesn't have to be immediate)
    // WHEN: Element comes after known element but not necessarily immediately
    // WHY: More flexible than +, allows intervening elements
    const sibling = page.locator('h1 ~ p');
    const siblingCount = await sibling.count();
    console.log(`h1 ~ p - Found ${siblingCount} paragraphs after h1 (any position)`);

    // Example 10: Difference between + and ~
    // DOM: <h1>Title</h1><div>something</div><p>Content</p>
    // h1 + p = matches nothing (p is not immediately after h1)
    // h1 ~ p = matches <p> (p is after h1, even though div is between)
    const plusVsTilde = page.locator('h1 ~ p');
    const plusVsTildeCount = await plusVsTilde.count();
    console.log(`✓ h1 ~ p selects paragraphs with intervening elements`);

    // Example 11: General sibling with attributes
    // input[type="checkbox"] ~ label = label after any checkbox
    const checkboxLabel = page.locator('input[type="checkbox"] ~ label');
    const checkboxLabelCount = await checkboxLabel.count();
    console.log(`input[type="checkbox"] ~ label - Found ${checkboxLabelCount}`);

    // ====================================================================
    // GROUPING MULTIPLE SELECTORS
    // ====================================================================
    
    console.log('\n--- GROUPING SELECTORS (comma) ---');

    // Example 12: Grouping selectors with comma
    // h1, h2, h3 = matches ANY element that is h1 OR h2 OR h3
    // WHEN: Multiple different selectors should match
    // WHY: Select multiple elements in one call
    const grouped = page.locator('h1, h2, h3');
    const groupedCount = await grouped.count();
    console.log(`h1, h2, h3 - Found ${groupedCount} heading elements`);

    // Example 13: Complex grouped selectors
    // .btn, [role="button"] = elements with class btn OR role=button
    const groupedComplex = page.locator('.btn, [role="button"]');
    const groupedComplexCount = await groupedComplex.count();
    console.log(`Grouped complex - Found ${groupedComplexCount} button-like elements`);

    // ====================================================================
    // COMBINING COMBINATORS
    // ====================================================================
    
    console.log('\n--- COMBINING MULTIPLE COMBINATORS ---');

    // Example 14: Complex selector chain
    // div.container > ul > li:not(.disabled) > a
    // Breaking down: 
    // - div with class container
    // - direct child ul
    // - direct child li without .disabled class
    // - direct child a tag
    const complex = page.locator('div.container > ul > li:not(.disabled) > a');
    const complexCount = await complex.count();
    console.log(`Complex chain - Found ${complexCount} links in enabled list items`);

    // Example 15: Combining sibling and child
    // .active + li > a = anchor in li immediately after .active li
    const combinedCombs = page.locator('.active + li > a');
    const combinedCombsCount = await combinedCombs.count();
    console.log(`Sibling + Child - Found ${combinedCombsCount} links`);

    console.log(`
    COMBINATOR BEST PRACTICES:
    ════════════════════════════════════════════════════════════════════
    
    USE DESCENDANT (space) WHEN:
    ✓ Element can be nested at any depth
    ✓ Don't know exact nesting levels
    ✓ Want flexible matching
    ✗ When nesting level matters
    
    USE CHILD (>) WHEN:
    ✓ Only want direct children
    ✓ Structure is strict and known
    ✓ Exclude nested elements inside children
    ✗ Element is too deeply nested
    
    USE ADJACENT (+) WHEN:
    ✓ Element must immediately follow
    ✓ No intervening elements allowed
    ✓ Strong relationship between elements
    ✓ E.g., label + input
    
    USE GENERAL SIBLING (~) WHEN:
    ✓ Element comes after but not immediately
    ✓ Intervening elements are acceptable
    ✓ More flexible than adjacent
    ✓ E.g., h1 ~ p (paragraphs anywhere after heading)
    
    REAL-WORLD EXAMPLES:
    ✓ div.container > ul > li              - Specific structure
    ✓ label ~ input[type="text"]           - Input after label
    ✓ .error + p.message                   - Message after error
    ✓ button:not(.disabled)                - Enabled buttons
    ✓ header a, nav a                      - Links in header or nav
    ✓ li.active + li                       - Item after active item
    ✓ main > article > h2 ~ p              - Content organization
    
    PERFORMANCE:
    ✓ All combinators are equally fast in modern browsers
    ✓ Focus on accuracy and maintainability over micro-optimization
    `);
});

test('CSS locator best practices and common patterns', async ({page}) => {
    await page.goto('https://demowebshop.tricentis.com/');
    
    console.log(`
    ════════════════════════════════════════════════════════════════════════
    CSS LOCATOR BEST PRACTICES & COMMON PATTERNS
    ════════════════════════════════════════════════════════════════════════
    
    CSS ADVANTAGES vs XPath:
    ✓ NATIVE browser support (faster execution)
    ✓ SIMPLER syntax for most cases
    ✓ BETTER performance across browsers
    ✓ EASIER to read and maintain
    ✓ INDUSTRY STANDARD in modern automation
    
    When CSS struggles, XPath shines:
    ✗ Text-based matching (CSS has no text selector)
    ✗ Complex logical conditions
    ✗ Axis-based navigation (ancestor, preceding)
    ✗ Function-based matching (normalize-space, contains)
    `);

    console.log(`
    ════════════════════════════════════════════════════════════════════════
    COMMON PATTERN LIBRARY
    ════════════════════════════════════════════════════════════════════════
    
    PATTERN                          │ CSS SELECTOR                    │ USE CASE
    ─────────────────────────────────┼────────────────────────────────┼──────────────────
    ID targeting                     │ #element-id                    │ Unique element
    Class targeting                  │ .class-name                    │ Styled element
    Multiple classes (must have ALL) │ .class1.class2                 │ Specific elements
    Attribute exact match            │ [type="text"]                  │ Form inputs
    Attribute contains               │ [href*="shop"]                 │ Dynamic URLs
    Attribute starts with            │ [href^="/"]                    │ Internal links
    Attribute ends with              │ [href$=".pdf"]                 │ File types
    Child element                    │ div > a                        │ Direct children
    Descendant element               │ div a                          │ Nested any depth
    Adjacent sibling                 │ label + input                  │ Related elements
    General sibling                  │ h1 ~ p                         │ Following elements
    First child                      │ li:first-child                 │ Position-based
    Last child                       │ li:last-child                  │ Position-based
    Nth child (position)             │ li:nth-child(3)                │ Specific position
    Nth of type                      │ a:nth-of-type(2)               │ Same tag position
    Not matching                     │ a:not([disabled])              │ Exclusion
    Disabled form elements           │ input:disabled                 │ Form validation
    Enabled form elements            │ button:enabled                 │ Form validation
    Multiple conditions (AND)        │ input[type="text"][required]   │ Multiple criteria
    Multiple selectors (OR)          │ h1, h2, h3                     │ Any matching element
    ─────────────────────────────────┴────────────────────────────────┴──────────────────
    
    REAL-WORLD SELECTOR RECIPES:
    
    1. LOGIN FORM ELEMENTS
       ✓ Username input:     input[type="text"][name="username"]
       ✓ Password input:     input[type="password"][name="password"]
       ✓ Submit button:      button[type="submit"]
       ✓ Forget password:    a[href*="forgot"]
    
    2. NAVIGATION LINKS
       ✓ Active menu item:   ul.menu > li.active > a
       ✓ Dropdown trigger:   .nav-item > a[aria-haspopup="true"]
       ✓ Internal links:     a[href^="/"]
       ✓ External links:     a[href^="http"]
       ✓ Email links:        a[href^="mailto:"]
    
    3. TABLES AND LISTS
       ✓ First row:          tbody > tr:first-child
       ✓ Last row:           tbody > tr:last-child
       ✓ Alternating rows:   tbody > tr:nth-child(odd)
       ✓ Specific cell:      tr:nth-child(3) > td:nth-child(2)
       ✓ All table cells:    table td, table th
    
    4. MODAL DIALOGS
       ✓ Modal overlay:      [role="dialog"][aria-modal="true"]
       ✓ Close button:       [role="dialog"] .close-btn
       ✓ Modal title:        [role="dialog"] h2
       ✓ OK button:          [role="dialog"] button:last-child
    
    5. FORM VALIDATION
       ✓ Required fields:    input[required]
       ✓ Invalid inputs:     input:invalid
       ✓ Error messages:     .error-message
       ✓ Success messages:   .success-message
    
    6. DATA ATTRIBUTES (Test selectors)
       ✓ Test ID:           [data-test="login-btn"]
       ✓ Automation ID:      [data-qa="submit"]
       ✓ Test hook:          [data-testid="user-menu"]
    
    STRATEGY FOR CHOOSING SELECTORS:
    
    1. ID (if available)
       └─ Fastest, most stable
       └─ Use: #unique-id
    
    2. Class or Tag
       └─ Usually stable, widely supported
       └─ Use: .button, input[type="text"]
    
    3. Attribute matching
       └─ Great for dynamic elements
       └─ Use: [href*="api"], [data-test="*"]
    
    4. Pseudo-classes
       └─ Position or state-based
       └─ Use: :nth-child(2), :not([disabled])
    
    5. Combinators (combine above)
       └─ Multi-condition selectors
       └─ Use: div.form > input[required]
    
    6. XPath (last resort)
       └─ When CSS can't express the logic
       └─ Use: //button[text()="Save"] or axis-based
    
    AVOID THESE PRACTICES:
    ✗ Overly specific selectors (too brittle)
    ✗ Selecting by tag alone (too generic)
    ✗ Using :hover (not testable)
    ✗ Relying on element order (fragile)
    ✗ Complex nested selectors (hard to read)
    
    INSTEAD DO THIS:
    ✓ Use IDs when available
    ✓ Use data-test attributes
    ✓ Use stable class names
    ✓ Use semantic attributes
    ✓ Keep selectors simple and readable
    `);

    // Practical examples
    console.log('\n--- PRACTICAL EXAMPLES ---\n');

    // Example 1: Finding form by data attribute
    const loginForm = page.locator('[data-test="login-form"]');
    const loginFormExists = await loginForm.count();
    console.log(`Login form by test attribute: ${loginFormExists ? '✓ Found' : '✗ Not found'}`);

    // Example 2: Button by multiple attributes
    const submitBtn = page.locator('button[type="submit"]:not([disabled])');
    const submitCount = await submitBtn.count();
    console.log(`Submit buttons (enabled): ${submitCount > 0 ? '✓ Found' : '✗ Not found'}`);

    // Example 3: Links in header
    const headerLinks = page.locator('header a, header nav a');
    const headerLinksCount = await headerLinks.count();
    console.log(`Navigation links: Found ${headerLinksCount}`);

    // Example 4: List items with attributes
    const activeItem = page.locator('ul.menu > li.active > a:first-child');
    const activeExists = await activeItem.count();
    console.log(`Active menu item: ${activeExists ? '✓ Found' : '✗ Not found'}`);

    // Example 5: Form inputs by type
    const emailInputs = page.locator('input[type="email"]');
    const emailCount = await emailInputs.count();
    console.log(`Email inputs: ${emailCount > 0 ? '✓ Found' : '✗ Not found'}`);

    console.log(`
    ════════════════════════════════════════════════════════════════════════
    DEBUGGING FAILED SELECTORS
    ════════════════════════════════════════════════════════════════════════
    
    If selector doesn't find element:
    
    1. VERIFY ELEMENT EXISTS
       ✓ Open DevTools
       ✓ Use Elements/Inspector tab
       ✓ Check element ID, class, attributes
    
    2. TEST SELECTOR IN CONSOLE
       ✓ Open DevTools Console
       ✓ Try: document.querySelector('your-selector')
       ✓ If null, selector doesn't match
    
    3. START SIMPLE
       ✓ Start with tag name: div
       ✓ Add class: div.container
       ✓ Add ID: #main-content
       ✓ Gradually build up
    
    4. USE COMBINATORS CAREFULLY
       ✓ Remember: div > a (direct children only)
       ✓ div a (any level of nesting)
       ✓ Test in DevTools first
    
    5. ATTRIBUTE MATCHING
       ✓ Verify exact attribute value
       ✓ Use substring matching if dynamic
       ✓ Check for case sensitivity
    
    6. PSEUDO-CLASSES
       ✓ :nth-child is 1-based (not 0-based)
       ✓ :first-child might not be position 1
       ✓ Consider :nth-of-type for mixed elements
    `);
});