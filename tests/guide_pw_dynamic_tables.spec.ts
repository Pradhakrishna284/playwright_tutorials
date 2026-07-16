//https://www.youtube.com/watch?v=JOhMqzTyBj8&list=PLUDwpEzHYYLtvMVjc-Va3RXLKtdB-ofc2&index=10
//https://practice.expandtesting.com/dynamic-table

import {test, expect, Locator} from '@playwright/test';

test('Web Tables - dynamic web table', async ({page}) => {
    //Navigate to the dynamic table demo page
    await page.goto('https://practice.expandtesting.com/dynamic-table');

    //Locate the dynamic web table
    const table: Locator = page.locator('.table-striped');
    await expect(table).toBeVisible();

    //Get first column header
    const firstColumnHeader: Locator =  table.locator('thead tr th').first();
    console.log('First column header:', await firstColumnHeader.innerText());

    //Get all column headers
    const allColumnHeaders: Locator = table.locator('thead tr th');
    const headerCount = await allColumnHeaders.count();
    console.log('All column headers count: ', headerCount);
    //Print all column headers
    for (let i=0; i<headerCount; i++) {
        const headerText = await allColumnHeaders.nth(i).innerText();
        console.log(`Header ${i}:`, headerText);
    } 
    
    //Get 'CPU' column index
    let cpuColumnIndex = -1;
    for (let i=0; i<headerCount; i++) {
        const headerText = await allColumnHeaders.nth(i).innerText();
        if (headerText === 'CPU') {
            cpuColumnIndex = i;
            break;
        }
    }
    console.log('CPU column index:', cpuColumnIndex);
    expect(cpuColumnIndex).toBeGreaterThan(-1);

    //Get all rows in the table body
    const tableBody: Locator = table.locator('tbody');
    const allRows: Locator = tableBody.locator('tr');
    const rowCount = await allRows.count();
    console.log('Total rows in dynamic table:', rowCount);

    //Print CPU values from each row
    console.log('CPU values from each row:');
    for (const row of await allRows.all()) {
        const cpuValue = await row.locator('td').nth(cpuColumnIndex).innerText();
        console.log('CPU Value using all():', cpuValue);
    }

    const chromeCPUValueLocator: Locator = page.locator('#chrome-cpu');
    const chromeCPUValue: string = await chromeCPUValueLocator.innerText();
    console.log('Expected CPU value for Chrome from outside table:', chromeCPUValue);
    
    //Print CPU value for 'Chrome' process
    console.log('Finding CPU value for Chrome process:');
    // Iterate through each row to find the one with 'Chrome' process name and extract its CPU value
    for (let i=0; i<rowCount; i++) {
        // Get the process name from the first column (index 0) of the current row
        const proccessName: string = await allRows.nth(i).locator('td').nth(0).innerText();
        // Check if the current row contains the Chrome process
        if (proccessName === 'Chrome') {
            // Extract the CPU value from the CPU column for the Chrome row
            const cpuValue: string = await allRows.nth(i).locator('td').nth(cpuColumnIndex).innerText();
            console.log(`CPU value for Chrome: ${cpuValue}`);
            // Assert that the extracted CPU value matches the expected value (extract number part after colon and trim whitespace)
            expect(cpuValue).toContain(chromeCPUValue.split(':')[1].trim());
            // Exit the loop once Chrome row is found
            break;
        }
    }

    //Using has-text or hasText
    console.log('Using has-text or hasText to find CPU value for Chrome process:');
    for (const row of await allRows.all()) {
        const proccessName: string = await row.locator('td').nth(0).innerText();
        if (proccessName.includes('Chrome')) {

            //Css selector with :has-text()
            const cpuLoad = await row.locator('td:has-text("%")').innerText();
            console.log('CPU Load for Chrome using has-text:', cpuLoad);
            expect(cpuLoad).toBe(chromeCPUValue.split(':')[1].trim());

            //Locator filter with hasText()
            const cpuLoadAlt = await row.locator('td').filter({hasText: '%'}).innerText();
            console.log('CPU Load for Chrome using hasText:', cpuLoadAlt);
            expect(cpuLoadAlt).toBe(chromeCPUValue.split(':')[1].trim());
        }
    }
})