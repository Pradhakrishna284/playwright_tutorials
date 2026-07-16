//https://www.youtube.com/watch?v=JOhMqzTyBj8&list=PLUDwpEzHYYLtvMVjc-Va3RXLKtdB-ofc2&index=10
//https://datatables.net/examples/basic_init/zero_configuration.html
//38:35

import {test, expect, Locator} from '@playwright/test';

test('Web Tables - Read data from multiple pages in a paginated web table', async ({page}) => {
    //Navigate to the dynamic table demo page
    await page.goto('https://datatables.net/examples/basic_init/zero_configuration.html');

    //Scenario 1:- Read data from multiple pages in a paginated web table
    let hasNextPage: boolean = true;
    
    while (hasNextPage) {
        //Locate the web table
        const rows: Locator[] = await page.locator('#example tbody tr').all();
        const rowCount: number = rows.length;
        console.log('Number of rows on current page:', rowCount);
        //Print all row data on the current page       
        for (let row of rows) {
            const rowText: string = await row.innerText();
            console.log('Row data:', rowText)
        }
        //check if 'Next' button is enabled
        const nextButton: Locator = page.locator('button[aria-label="Next"]');
        const isDisabled = await nextButton.evaluate((el) => el.classList.contains('disabled'));
        if (!isDisabled) {
            await nextButton.click();
            await page.waitForTimeout(1000); //wait for page to load
        } else {
            hasNextPage = false; // Exit loop when Next button is disabled
        }
    }

});

test('Web Tables - Filter the rows and check the results', async ({page}) => {
    //Navigate to the dynamic table demo page
    await page.goto('https://datatables.net/examples/basic_init/zero_configuration.html');
    //Scenario 2:- Filter the rows and check the results
    const dropdown: Locator = page.locator('#dt-length-0');
    await dropdown.selectOption('25'); //Select 25 entries per page
    await page.waitForTimeout(1000); //wait for table to refresh

    //Get all rows after filtering
    //Approach 1: Using all()
    const filteredRows: Locator[] = await page.locator('#example tbody tr').all();
    expect(filteredRows.length).toBe(25); //Assert that 25 rows are displayed
    console.log('Number of rows after filtering to 25 entries:', filteredRows.length);

    //Approach 2: Using toHaveCount()
    const filterRows = page.locator('#example tbody tr');
    await expect(filterRows).toHaveCount(25);
});

test.only('Web Tables - Search specific data in the rows', async ({page}) => {
    //Navigate to the dynamic table demo page
    await page.goto('https://datatables.net/examples/basic_init/zero_configuration.html');
    //Scenario 3:- Search specific data in the rows
    const searchBox: Locator = page.locator('#dt-search-0');
    const searchText: string = 'Yuri Berry';
    await searchBox.fill(searchText);
    await page.waitForTimeout(2000); //wait for table to refresh
    console.log(`Searched text from search box: ${await searchBox.inputValue()}`);

    //Get all rows after search
    const searchedRows: Locator[] = await page.locator('#example tbody tr').all();
    expect(searchedRows.length).toBeGreaterThanOrEqual(1); //Assert that only 1 row is displayed
    console.log('Number of rows after searching "Yuri Berry":', searchedRows.length);
    //Print the row data
    let matchFound: boolean = false;
    for (let row of searchedRows) {
        const rowText: string = await row.innerText();
        console.log('Row data after search:', rowText);
        if (rowText.includes(searchText)) {
            console.log(`Match found for ${searchText} in the row data.`);
            matchFound = true;
            break;
        }
    }
    expect(matchFound).toBe(true); // Assert that a match was found
});