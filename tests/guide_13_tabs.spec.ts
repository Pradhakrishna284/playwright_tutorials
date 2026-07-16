//https://www.youtube.com/watch?v=dWdLjXEZdIw&list=PLUDwpEzHYYLtvMVjc-Va3RXLKtdB-ofc2&index=13
import {test, expect, chromium} from '@playwright/test'

test.describe('Guide - Tabs or Multiple Pages', () => {

  test('1. Detect new tab when clicking a link', async () => {
    const mybrowser = await chromium.launch({headless:false});
    const context = await mybrowser.newContext();
    //Create main page
    const mainPage = await context.newPage();

    mainPage.goto('https://testautomationpractice.blogspot.com/');

    //Approach 1 - Using waitForEvent
    //Listen for new page event before performing action that opens new tab
    //This is to ensure that we don't miss the event
    //The action is clicking the "New tab" button
    //The waitForEvent returns a promise that resolves to the new page object
    //We use Promise.all to run both the waitForEvent and the click action concurrently
    //This ensures that we are listening for the event before the action occurs
    //We destructure the array returned by Promise.all to get the new page object
    //Finally, we can interact with the new page as needed
    //Store the new page object in a variable
    const [childPage] = await Promise.all([
      context.waitForEvent('page'), //Wait for new tab to open
      mainPage.locator("button:has-text('New tab')").click() //Action that opens new tab
    ]);

    //Wait for the new page to load
    await childPage.waitForLoadState();
    console.log(`New tab URL: ${childPage.url()}`);

    const pages = context.pages();
    console.log(`Total number of open tabs: ${pages.length}`);

    for (const page of pages) {
        console.log(`Page URL: ${page.url()}`);
        //await expect(page).toHaveTitle(/Automation Testing Practice|Selenium WebDriver/);
    }

    //Verify the page title of the new tab
    //await expect(childPage).toHaveTitle(/Selenium WebDriver/);

    //Switch back to main page and verify its title
    await expect(mainPage).toHaveTitle(/Automation Testing Practice/);
    
    //Close browser
    await mybrowser.close();

  })
})