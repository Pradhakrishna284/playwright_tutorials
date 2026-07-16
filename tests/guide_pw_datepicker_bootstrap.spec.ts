//https://www.youtube.com/watch?v=iJGQl4q1_6k&list=PLUDwpEzHYYLtvMVjc-Va3RXLKtdB-ofc2&index=11
//booking.com
//1:06:11

import {test, expect, Locator, Page} from '@playwright/test';

test('Data Pickers - Bootstrap date picker', async ({page}) => {
    //Navigate to the Bootstrap date picker demo page
    await page.goto('http://booking.com/');
    //Scenario: Handle Bootstrap date picker and select a specific date
    
    const dateSearchBox: Locator = page.locator(`[data-testid='searchbox-dates-container']`);
    await expect(dateSearchBox).toBeVisible();
    await dateSearchBox.click();
            
    //select check-in date selection
    const checkInDate = { day: 20, month: 11, year: 2026 }; //dd, mm, yyyy
    //Open the date picker - already opened after clicking the search box
    await selectDate(checkInDate, page); 
});

async function selectDate(checkInDate: { day: number; month: number; year: number; }, page: Page) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    //Wait for the datepicker calendar to be visible
    await page.getByTestId('searchbox-datepicker-calendar').waitFor({ state: 'visible', timeout: 5000 });
    console.log('Date picker calendar is visible');
    
    //Check In Month and Year - wait for h3 to be visible
    const monthYearLocator = page.locator("h3[aria-live='polite']").first();
    await monthYearLocator.waitFor({ state: 'visible', timeout: 5000 });
    
    const checkInMonthYear: string = await monthYearLocator.innerHTML();
    const checkInParts = checkInMonthYear.trim().split(/\s+/);
    const checkInMonth = checkInParts[0];
    const checkInYear = checkInParts[1];
    console.log('Check In month and year:', checkInMonth, checkInYear);
    
    //Navigate to target month/year
    while (true) {
        if (checkInMonth === monthNames[checkInDate.month - 1] && parseInt(checkInYear) === checkInDate.year) {
            console.log('Target month and year reached');
            break;
        }
        else {
            // Click next button to navigate months
        const nextButton = page.locator('button[aria-label="Next month"]');
        await nextButton.click();
        await new Promise(resolve => setTimeout(resolve, 500));
        }               
        
    }
    
    //Click the target day
    const dayLocator: Locator = page.locator('table[role="grid"] tbody').nth(0).locator('td[role="gridcell"]').filter({ hasText: checkInDate.day.toString() });
    console.log(`Selected date locator: ${await dayLocator.innerHTML()}`);
    await expect(dayLocator).toHaveText(checkInDate.day.toString());
    await dayLocator.click();
    console.log(`Selected date: ${checkInDate.day}/${checkInDate.month}/${checkInDate.year}`);
}