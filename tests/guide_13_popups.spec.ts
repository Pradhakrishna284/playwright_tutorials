//https://www.youtube.com/watch?v=dWdLjXEZdIw&list=PLUDwpEzHYYLtvMVjc-Va3RXLKtdB-ofc2&index=13
import {test, expect} from '@playwright/test';

test.describe('Multiple window pop ups', () => {

    test('Handle multiple window pop ups', async ({ browser }) => {

        const context = await browser.newContext();
        const page = await context.newPage();

        //1. Navigate to the page that opens multiple pop ups
        await page.goto('https://testautomationpractice.blogspot.com/');

        //2. Click the button that opens multiple pop ups

        const windowPopups = await Promise.all([
            page.waitForEvent('popup'), //wait for the popup event to be fired
            page.locator('#PopUp').click() //click the button to open pop ups
        ]);
        
        console.log(`Total number of pop up windows opened: ${windowPopups.length}`);
        console.log(`No. of pages in the context: ${context.pages().length}`);

        //3. Iterate through the pop ups and perform actions (e.g., log URL, close them)
        for (const p of windowPopups) {
            if (p) {
                console.log(`Pop up URL: ${p.url()}`);
                //await p.close(); //close the pop up
            }
        }   
                
    })
})