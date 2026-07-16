//https://www.youtube.com/watch?v=FEmknp2GjjQ&list=PLUDwpEzHYYLtvMVjc-Va3RXLKtdB-ofc2&index=18

import { test, expect, Locator } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(__dirname, '../testdata/data.json');
const jsonData = fs.readFileSync(dataFilePath, 'utf-8');
const dataSetLogin: { email: string; password: string; validity: string }[] = JSON.parse(jsonData);

//Importing data from JSON file

test.describe('Data driven tests/Parameterization', () => {

    for (const { email, password, validity } of dataSetLogin) {

        test(`Login Test - ${email} - ${validity}`, async ({ page }) => {
            await page.goto('https://demowebshop.tricentis.com/login');
            //Fill login details
            await page.locator('#Email').fill(email);
            await page.locator('#Password').fill(password);
            await page.locator('input[value="Log in"]').click();

            if (validity === 'valid') {
                //Assert logout link is visible
                const logOut: Locator = page.locator('a[href="/logout"]');
                await expect(logOut).toBeVisible({ timeout: 5000 });
            } else {
                //Assert error message is visible
                const errorMessage: Locator = page.locator('div.validation-summary-errors');
                await expect(errorMessage).toBeVisible({ timeout: 5000 });

                //Assert user is not logged in 
                const logIn: Locator = page.locator('a[href="/login"]');
                await expect(logIn).toBeVisible();
            }

        });
    }

});

