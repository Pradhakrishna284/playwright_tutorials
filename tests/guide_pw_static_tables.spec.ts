//https://www.youtube.com/watch?v=ewzubWfyyZc&list=PLUDwpEzHYYLtvMVjc-Va3RXLKtdB-ofc2&index=9
//48:19

import {test, expect, Locator} from '@playwright/test';

//static vs dynamic vs pagination web tables

test('Web Tables - static web table', async ({page}) => {
    await page.goto('https://testautomationpractice.blogspot.com/');
    //Locate the static web table
    const table: Locator = page.locator('table[name="BookTable"] tbody');
    await expect(table).toBeVisible();

    //Count number of rows in the table
    const rows = table.locator('tr');
    const rowCount = await rows.count();
    console.log('Number of rows in static web table:', rowCount); 
    expect(rowCount).toBe(7); //7 rows including header
    
    //Count number of columns in the table
    const columns = rows.first().locator('th');
    const columnCount = await columns.count();
    console.log('Number of columns/headers in static web table:', columnCount);
    expect(columnCount).toBe(4); //4 columns

    //Get 2nd row data
    const secondRowData: string[] = await rows.nth(1).locator('td').allInnerTexts();
    console.log('Data in 2nd row:', secondRowData);
    expect(secondRowData).toEqual(['Learn Selenium', 'Amit', 'Selenium', '300']);
    expect(secondRowData).toContain('Amit');

    //Get all data from the table from 2nd row onwards 
    for (let i=1; i<rowCount; i++) {
        const rowData: string[] = await rows.nth(i).locator('td').allInnerTexts();
        console.log(`Row ${i}: ${rowData.join(' | ')}`);
    }

    //Using all() method to get all row locators
    const allRowsData: Locator[] = await rows.all();
    console.log('All rows data using all():', allRowsData);
    for (const row of allRowsData.slice(1)) { //skip header row
        const rowText = await row.innerText();
        console.log(rowText);
    }

    //Print book names with author = 'Mukesh'
    console.log('Books by author Mukesh:');
    const mukeshAuthor = 'Mukesh';
    for (let i=1; i<rowCount; i++) {
        const authorName = await rows.nth(i).locator('td').nth(1).innerText();
        if (authorName === mukeshAuthor) {
            const bookName = await rows.nth(i).locator('td').first().innerText();
            console.log(bookName);
        }   
    }

    //Print book names with price > 300
    console.log('Books with price greater than 300:');
    for (let i=1; i<rowCount; i++) {
        const priceText: string = await rows.nth(i).locator('td').nth(3).innerText();
        const price: number = parseFloat(priceText);
        if (price > 300) {
            const bookName = await rows.nth(i).locator('td').nth(0).innerText();
            console.log(`BookName: ${bookName}, Price: ${price}`);
        }
    }

    //Calculate total price of all books
    let totalPrice  = 0;
    for (let i=1; i<rowCount; i++) {
        const priceText: string = await rows.nth(i).locator('td').nth(3).innerText();
        const price: number = parseFloat(priceText);
        totalPrice += price;
    }
    console.log('Total price of all books:', totalPrice);
    expect(totalPrice).toBeGreaterThan(6000);
});