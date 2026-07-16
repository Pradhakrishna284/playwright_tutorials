//https://www.youtube.com/watch?v=KDpR5hDtZUw&list=PLUDwpEzHYYLtvMVjc-Va3RXLKtdB-ofc2&index=16

/* 1. Open application
   2. Login
   3. Find Products
   4. Logout
   5. Login again
   6. add product to cart
   7. Logout
   8. Close application
*/

import { test, expect, Page } from '@playwright/test';

test.describe('E2E Test Suite with Hooks', () => { 

    let page: Page;

    test.beforeAll(async({ browser }) => {

        const context = await browser.newContext();
        page = await context.newPage();
        // Step 1: Open application
        await page.goto('https://demowebshop.tricentis.com/');
    })

    test.afterAll(async() => {
        // Step 8: Close application
        await page.close();
    })

    test.beforeEach(async() => {        
        // Step 2: Login
        await page.getByText('Log in', { exact: true }).click();
        await page.locator('#username').fill('pavanol');
        await page.locator('#password').fill('test@123');
        await page.locator("button[onclick='logIn()']").click();
        await page.waitForTimeout(3000);
    });

    test.afterEach(async() => {
        // Step 7: Logout
        await page.locator('#logout2').click();
        await page.waitForTimeout(3000);
    });

    test('find products', async() => {
        // Step 3: Find Products
        const products = page.locator('#tbodyid .hrefch');
        const count = await products.count();
        console.log("Total products: " + count);
        await expect(products).toHaveCount(9);

    })

    test('add product to cart', async() => {
        // Step 6: Add product to cart
        await page.click('.hrefch:has-text("Samsung galaxy s6")');
        await page.click('.btn-success:has-text("Add to cart")');
        await page.waitForTimeout(3000);

    })
})