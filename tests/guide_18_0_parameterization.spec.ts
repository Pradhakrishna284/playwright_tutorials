//https://www.youtube.com/watch?v=FEmknp2GjjQ&list=PLUDwpEzHYYLtvMVjc-Va3RXLKtdB-ofc2&index=18

import { test, expect } from '@playwright/test';

test.describe('Parameterization Demo', () => {

    const dataSetSearchItems: string[] = ['laptop', 'Gift Card', 'smartphone', 'monitor'];

    //Approach 1
    //for this dataset, we will run the same test multiple times
    //parameterization
    // for (const searchItem of dataSetSearchItems) {
    //     test(`Login Test for search items: ${searchItem}`, async ({ page }) => {
    //         await page.goto('https://demowebshop.tricentis.com/');
    //         await page.locator('#small-searchterms').fill(`${searchItem}`);
    //         await page.locator('input[value="Search"]').click();
    //         await expect.soft(page.locator('h2 a').nth(0)).toContainText(`${searchItem}`, { ignoreCase: true });

    //     })
    // }

    //Approach 2 - Using foreach
    // dataSetSearchItems.forEach(searchItem => {
    //     test(`Login Test for search items: ${searchItem}`, async ({ page }) => {
    //         await page.goto('https://demowebshop.tricentis.com/');
    //         await page.locator('#small-searchterms').fill(`${searchItem}`);
    //         await page.locator('input[value="Search"]').click();
    //         await expect.soft(page.locator('h2 a').nth(0)).toContainText(`${searchItem}`, { ignoreCase: true });
    //     });
    // });   
    
    //Approach 3 - Using describe block
    test.describe('Search Tests', async () => {
        dataSetSearchItems.forEach(searchItem => {
            test(`Login Test for search items: ${searchItem}`, async ({ page }) => {
                await page.goto('https://demowebshop.tricentis.com/');
                await page.locator('#small-searchterms').fill(`${searchItem}`);
                await page.locator('input[value="Search"]').click();
                await expect.soft(page.locator('h2 a').nth(0)).toContainText(`${searchItem}`, { ignoreCase: true });
            });
        });
    });
    
});