
//https://www.youtube.com/watch?v=ZAZg5wzSCpM&list=PLUDwpEzHYYLtvMVjc-Va3RXLKtdB-ofc2&index=2
//Refer to list of ARIA roles at 1:03:40

import {test, expect, Locator} from '@playwright/test';

test('built-in locator - getByAltText()', async ({page}) => {
    await page.goto('https://demo.nopcommerce.com');
    
    // Example 1: Locate image by alt text
    // WHEN: Images have descriptive alt text
    // WHY getByAltText: Alt text is required for accessibility
    // WHY await: click() is an action that returns a Promise
    await page.getByAltText('nopCommerce demo store').click();
    
    // Example 2: Verify image is visible
    // WHEN: Checking if image is displayed on page
    // WHY getByAltText: Ensures image has proper alt text (accessibility)
    // WHY await: expect() assertion needs to resolve
    await expect(page.getByAltText('nopCommerce demo store')).toBeVisible();
    
    // Example 3: Creating locator without await
    // WHY NO await: Just defining how to find element (lazy evaluation)
    const logoImage: Locator = page.getByAltText('nopCommerce demo store');
    
    // WHY await NOW: Performing action on the locator
    await expect(logoImage).toBeVisible();
    
    // Example 4: Get image attributes
    // WHEN: Need to validate image properties
    // WHY await: getAttribute() is a getter that returns Promise
    const imgSrc = await logoImage.getAttribute('src');
    console.log('Logo image source:', imgSrc);
});

test('built-in locator - getByText()', async ({page}) => {
    await page.goto('https://demo.nopcommerce.com');
    
    // Example 1: Verify text presence (substring match - default)
    // WHEN: Checking if specific text appears on page
    // WHY getByText: Text is what users see
    // WHY await: expect() assertion returns Promise
    const welcomeMessage: Locator = page.getByText('Welcome to our store');
    await expect(welcomeMessage).toBeVisible();
    
    // Example 2: Substring match (explicit)
    // WHEN: Looking for partial text match
    // WHY { exact: false }: Allows substring matching
    // WHY await: Assertion needs to resolve
    const subString: Locator = page.getByText('our store', { exact: false });
    await expect(subString).toBeVisible();
    
    // Example 3: Exact match
    // WHEN: Need precise text matching (no substrings)
    // WHY { exact: true }: Only matches complete text
    await expect(page.getByText('Featured products', { exact: true })).toBeVisible();
    
    // // Example 4: Click link by text
    // // WHEN: Navigating by clicking text (though getByRole better for links)
    // // WHY await: click() is an action
    // // NOTE: For links, getByRole('link') is preferred
    // await page.getByText('Register').click();
    
    // Example 5: Case-insensitive regex match
    // WHEN: Text might vary in case
    // WHY regex with /i: Case-insensitive matching
    await expect(page.getByText('Register')).toBeVisible();
});

test('built-in locator - getByRole() - Most Recommended', async ({page}) => {
    await page.goto('https://demo.nopcommerce.com');
    
    // Example 1: Visibility of button by role and name
    // WHEN: Testing interactive button element
    // WHY getByRole: Tests accessibility - ensures button has proper role
    // WHY { name: 'Search' }: Filters by accessible name
    // WHY await: expect() assertion needs to resolve
    const button: Locator = page.getByRole('button', { name: 'Search' });
    await expect(button).toBeVisible();

    // Example 2: Verify heading
    // WHEN: Checking page structure
    // WHY getByRole('heading'): Tests semantic HTML structure
    // WHY await: expect() assertion needs to resolve
    await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();
        
    // Example 3: Locate link by role
    // WHEN: Finding navigation links
    // WHY getByRole('link'): Ensures proper link semantics
    // WHY await: click() is an action that returns a Promise
    await page.getByRole('link', { name: 'Register' }).click();
    
   
});

test.only('built-in locator - getByLabel() - Best for Forms', async ({page}) => {
    await page.goto('https://demo.nopcommerce.com/register');
    await page.getByRole('link', {name: 'Register'}).click();

    // Example 1: Verify label presence
    // WHEN: Checking if label is associated with input
    // WHY getByLabel: Ensures proper form accessibility
    // WHY await: expect() assertion needs to resolve
    const firstname: Locator = page.getByLabel('First name:');
    await expect(firstname).toBeVisible();
    // fill in the first name
    await firstname.fill('Radha');

    const lastname: Locator = page.getByLabel('Last name:');
    await expect(lastname).toBeVisible();
    // fill in the last name
    await lastname.fill('Krishna');

    // Example 2: Fill input by label
    // WHEN: Entering text into input field
    // WHY getByLabel: Directly associates label with input
    // WHY await: fill() is an action that returns a Promise
    await page.getByLabel('Email:').fill('radhakrishnapmurthy@gmail.com');


   // Example 3: Verify input value
   // WHEN: Checking if input has correct value
   // WHY getByLabel: Ensures label-input association
   // WHY await: expect() assertion needs to resolve
   //await expect(page.getByLabel('Email')).toHaveValue('test@example.com');
});

test.only('built-in locator - getByPlaceholder() - Alternative for Forms/Search Boxes', async ({page}) => {
   await page.goto('https://demo.nopcommerce.com/register');
   
    // Example 1: Verify placeholder presence
   // WHEN: Checking if placeholder is set for input
   // WHY getByPlaceholder: Ensures proper form accessibility
   // WHY await: expect() assertion needs to resolve
   const searchStore: Locator = page.getByPlaceholder('Search store');
   await expect(searchStore).toBeVisible();
   await searchStore.fill('Laptop');

   // Example 2: Verify input value
   // WHEN: Checking if input has correct value
   // WHY getByPlaceholder: Ensures placeholder-input association
   // WHY await: expect() assertion needs to resolve
   await expect(searchStore).toHaveValue('Laptop');

   // Example 3: Submit search by pressing Enter
    // WHEN: User submitting search without clicking button
    // WHY await: press() is a keyboard action that returns Promise
   await searchStore.press('Enter');

   // Example 4: Clear and re-fill
   // WHEN: User modifying search query
   await searchStore.clear();
   await searchStore.fill('Smartphone');
})

test.only('built-in locator - getByTitle() - Best for Tooltips', async ({page}) => {
   await page.goto('https://demo.nopcommerce.com');
   // Example 1: Locate element by title attribute
    // WHEN: Element has title attribute for tooltip
    // WHY getByTitle: Title provides additional information
    // WHY await: expect() assertion needs to resolve
    const titleElement: Locator = page.getByTitle('Show details for nopCommerce').first();
    await expect(titleElement).toBeVisible();
    await expect(titleElement).toHaveAttribute('title', 'Show details for nopCommerce');
    await expect(titleElement).toHaveText('nopCommerce');
    
    // Example 2: Hover to show tooltip
    // WHEN: Testing tooltip appears on hover
    // WHY getByTitle: Locating by tooltip text
    // WHY await: hover() is an action
    await titleElement.hover();
    
    // Example 3: Verify title text with regex
    // WHEN: Title text might vary slightly
    // WHY /regex/i: Case-insensitive matching
    await expect(page.getByTitle(/show details/i)).toHaveCount(1);
    
    // Example 4: Click element with title
    // WHEN: Icon-only button uses title for accessibility
    // WHY await: click() is an action
    // await page.getByTitle('Close').click();  // If such element exists
});

test.only('built-in locator - getByTestId', async ({page}) => {
   await page.goto('/');
   // Example 1: Typical usage with test IDs
    // WHEN: Element text/structure might change
    // WHY getByTestId: Most resilient to changes
    // WHY await: click() is an asynchronous action
    // await page.getByTestId('search-button').click();
    
    // Example 2: Verify error message
    // WHEN: Error text changes but test should remain stable
    // WHY getByTestId: Test ID won't change even if text does
    // await expect(page.getByTestId('error-message')).toBeVisible();
    
    // Example 3: Complex components
    // WHEN: Component structure is complex or dynamic
    // WHY getByTestId: Provides stable reference point
    // const productCard = page.getByTestId('product-123');
    // await productCard.getByTestId('add-to-cart').click();   
});
