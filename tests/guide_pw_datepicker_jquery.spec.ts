//https://www.youtube.com/watch?v=iJGQl4q1_6k&list=PLUDwpEzHYYLtvMVjc-Va3RXLKtdB-ofc2&index=11
//testautomationpractice.blogspot.com/2018/01/handling-date-picker-in-playwright.html

import {test, expect, Locator, Page} from '@playwright/test';

test('Data Pickers - jQuery date picker', async ({page}) => {
    //Navigate to the jQuery date picker demo page
    await page.goto('http://testautomationpractice.blogspot.com/');
    //Scenario: Handle jQuery date picker and select a specific date
    const dateInput: Locator = page.locator('#datepicker');
    await expect(dateInput).toBeVisible(); 
    //Approach1: Directly enter the date in the input field 
    const inputDate = '01/07/2026';
    await dateInput.fill(inputDate); //Clear any existing date and enter the data - mm/dd/yyyy
    await dateInput.press('Enter'); //Press Enter to set the date

    //Verify the selected date
    const selectedDate: string = await dateInput.inputValue();
    console.log('Selected date is:', selectedDate);
    expect(selectedDate).toBe(inputDate);
});

test('Data Pickers - jQuery date picker - select target date', async ({page}) => {
    //Navigate to the jQuery date picker demo page
    await page.goto('http://testautomationpractice.blogspot.com/');
    //Scenario: Handle jQuery date picker and select a specific date
    const dateInput: Locator = page.locator('#datepicker');
    await expect(dateInput).toBeVisible();  
    //Approach 2: Use the date picker UI to select the date
    //select target date
    const targetDate = { day: 15, month: 6, year: 2027 }; //dd, mm, yyyy
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = monthNames[targetDate.month - 1];

    //Open the date picker
    await dateInput.click();

    while (true) {
        //Get the displayed month and year from the date picker header
        const displayedMonthYear: string = await page.locator('.ui-datepicker-title').innerText();
        const parts = displayedMonthYear.trim().split(/\s+/);
        const displayedMonth = parts[0];
        const displayedYear = parts[1];
        console.log('Displayed month and year:', displayedMonth, displayedYear, '| Target:', monthName, targetDate.year);
        //Check if the displayed month and year match the target month and year
        if (displayedMonth === monthName && displayedYear === targetDate.year.toString()) {
            break; // Exit the loop if the target month and year are displayed
        }
        //Click the 'Next' button to navigate to the next month
        await page.locator('a.ui-datepicker-next').click();
        await new Promise(resolve => setTimeout(resolve, 1000)); //wait for the date picker to update        

        //Click on the 'Prev' button to navigate to the previous month
        //await page.locator('a.ui-datepicker-prev').click();
        //await new Promise(resolve => setTimeout(resolve, 1000)); //wait for the date picker to update

    }
    //Select the target day
    const targetDateLocator: Locator = page.locator(`a:has-text("${targetDate.day}")`);
    await targetDateLocator.click();

    //Verify the selected date
    const selectedDate: string = await dateInput.inputValue();
    const expectedDate = `${targetDate.month.toString().padStart(2, '0')}/${targetDate.day.toString().padStart(2, '0')}/${targetDate.year}`
    console.log('Selected date is:', selectedDate);
    expect(selectedDate).toBe(expectedDate);
    
});

test.only('Data Pickers - jQuery date picker - Navigate to "Prev" and "Next" buttons', async ({page}) => {
    //Navigate to the jQuery date picker demo page
    await page.goto('http://testautomationpractice.blogspot.com/');
    //Scenario: Handle jQuery date picker and select a specific date
    const dateInput: Locator = page.locator('#datepicker');
    await expect(dateInput).toBeVisible();  
    //Approach 2: Use the date picker UI to select the date
    //select target date
    const targetDate = { day: 15, month: 6, year: 2025 }; //dd, mm, yyyy
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = monthNames[targetDate.month - 1];

    //Open the date picker
    await dateInput.click();

    //Use helper function to navigate to the target month and year
    await selectDate(targetDate, page);
    
    //Select the target day - use XPath to target links within the calendar table
    const targetDateLocator: Locator = page.locator(`a:has-text("${targetDate.day}")`);
    console.log('Clicking on day:', targetDate.day);
    await targetDateLocator.click();
    await new Promise(resolve => setTimeout(resolve, 500)); //wait for the date to be set

    //Verify the selected date
    const selectedDate: string = await dateInput.inputValue();
    const expectedDate = `${targetDate.month.toString().padStart(2, '0')}/${targetDate.day.toString().padStart(2, '0')}/${targetDate.year}`
    console.log('Selected date is:', selectedDate);
    console.log('Expected date is:', expectedDate);
    expect(selectedDate).toBe(expectedDate);
    
});

async function selectDate(targetDate: {day: number, month: number, year: number}, page: Page) {

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const targetMonthName = monthNames[targetDate.month - 1];

    while (true) {
        //Get the displayed month and year from the date picker header
        const currentMonthYear: string = await page.locator('.ui-datepicker-title').innerText();
        const parts = currentMonthYear.trim().split(/\s+/);
        const currentMonth = parts[0];
        const currentYear = parseInt(parts[1]);
        console.log(`Current - ${currentMonth} ${currentYear}, Target - ${targetMonthName} ${targetDate.year}`);
        
        //Check if the displayed month and year match the target month and year
        if (currentMonth === targetMonthName && currentYear === targetDate.year) {
            console.log('Target month and year reached!');
            break; // Exit the loop if the target month and year are displayed
        }
        else if (currentYear > targetDate.year ||
                 (currentYear === targetDate.year && monthNames.indexOf(currentMonth) > monthNames.indexOf(targetMonthName))) {
            //If current date is after target date, click 'Prev' button
            console.log('Clicking Prev...');
            await page.locator('a.ui-datepicker-prev').click();
            await new Promise(resolve => setTimeout(resolve, 1000)); //wait for the date picker to update        
        } else {
            //Click the 'Next' button to navigate to the next month
            console.log('Clicking Next...');
            await page.locator('a.ui-datepicker-next').click();
            await new Promise(resolve => setTimeout(resolve, 1000)); //wait for the date picker to update        
        }
    }
}