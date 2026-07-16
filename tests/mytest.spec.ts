// Import Playwright test utilities
// 'test' - Function to define a test case
// 'expect' - Function for making assertions/validations in tests
import {test, expect} from '@playwright/test'

/**
 * ========================================================================================
 * PLAYWRIGHT CONCEPTS EXPLAINED
 * ========================================================================================
 */

/**
 * FIXTURES:
 * Fixtures are pre-configured objects that Playwright automatically provides to your tests.
 * They handle setup and teardown automatically, ensuring test isolation.
 * 
 * Common fixtures:
 * - {page} - A fresh browser page/tab for each test
 * - {browser} - The browser instance (Chromium, Firefox, or WebKit)
 * - {context} - The browser context (isolated browsing session)
 * - {request} - API testing utilities
 * 
 * Benefits:
 * 1. Automatic lifecycle management (create before test, cleanup after test)
 * 2. Test isolation - each test gets fresh resources
 * 3. No manual setup/teardown code needed
 */

/**
 * DESTRUCTURING SYNTAX {page}:
 * The curly braces { } extract specific properties from an object.
 * 
 * Example:
 * async ({page}) => { }  // Extracts 'page' from fixtures object
 * async ({page, browser}) => { }  // Extracts multiple fixtures
 * 
 * This is equivalent to:
 * async (fixtures) => {
 *   const page = fixtures.page;
 * }
 */

/**
 * ARROW FUNCTION (=>):
 * Modern JavaScript syntax for defining functions.
 * 
 * Comparison:
 * // Traditional function
 * test('mytest', async function({page}) {
 *   // test code
 * });
 * 
 * // Arrow function (modern, concise)
 * test('mytest', async ({page}) => {
 *   // test code
 * });
 */

/**
 * ASYNC/AWAIT:
 * 'async' - Marks a function as asynchronous (returns a Promise)
 * 'await' - Pauses execution until a Promise resolves
 * 
 * Why use it?
 * - Playwright operations (page.goto, page.click, etc.) are asynchronous
 * - 'await' ensures operations complete before moving to the next step
 * - Without 'await', the test might finish before actions complete, causing failures
 * 
 * Example:
 * await page.goto('url')  // Waits for page to load
 * await page.click('button')  // Waits for click to complete
 */

/**
 * TEST vs TEST CASE:
 * The 'test' function defines a single test case (one specific scenario to validate).
 * 
 * Structure:
 * test('test case name', async ({page}) => {
 *   // test steps/actions
 * })
 * 
 * Terminology:
 * - Test Case = One specific scenario (e.g., 'verify page title')
 * - Test Suite = Collection of related test cases (usually one file)
 * - Test = Short for "test case"
 * 
 * Execution:
 * - 1 test case runs in 3 browsers = 3 test executions
 * - Each browser gets its own isolated test run
 * - Results are reported separately for each browser
 */

/**
 * ========================================================================================
 * TEST CASES
 * ========================================================================================
 */

/**
 * Test: Verify Page Title
 * 
 * Purpose: This test validates that the automation practice website loads correctly
 * and displays the expected page title.
 * 
 * Browser Execution:
 * This test will run in 3 browsers (configured in playwright.config.ts):
 * - Chromium (Desktop Chrome)
 * - Firefox (Desktop Firefox)
 * - WebKit (Desktop Safari)
 * 
 * Parallel Execution:
 * Tests run in parallel (all browsers at once) due to 'fullyParallel: true' in config.
 * This provides 3x faster execution compared to running browsers sequentially.
 * The 'workers' setting controls how many tests run simultaneously:
 * - Locally: Uses all available CPU cores (undefined = auto)
 * - On CI: Uses 1 worker to avoid resource conflicts
 * 
 * Test Flow:
 * 1. Navigate to the target URL
 * 2. Assert that the page title matches expected value
 * 3. Retrieve and log the actual page title
 */
test('verify page title', async ({page}) => {
    // Step 1: Navigate to the automation practice website
    // The 'await' keyword ensures the page fully loads before proceeding to next step
    await page.goto('http://www.automationpractice.pl/index.php')
    
    // Step 2: Assert that the page title is 'My Shop'
    // This is a soft assertion that validates the expected title
    // If it fails, the test will be marked as failed
    expect(page).toHaveTitle('My Shop')
    
    // Step 3: Retrieve the actual page title and store it in a variable
    // page.title() returns a Promise, so we use 'await' to get the actual string value
    // The type annotation :string ensures type safety in TypeScript
    let getPageTitle:string = await page.title()
    
    // Step 4: Log the page title to the console for debugging/verification purposes
    // This output appears in the test results and can help troubleshoot issues
    console.log("Page title is: " + getPageTitle)    
})