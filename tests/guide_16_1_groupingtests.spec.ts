//https://www.youtube.com/watch?v=KDpR5hDtZUw&list=PLUDwpEzHYYLtvMVjc-Va3RXLKtdB-ofc2&index=16

import { test, expect } from '@playwright/test';

//describe - grouping of tests - can have multiple its/tests inside describe
//it - actual test case
//test - actual test case
//Execute specific group of tests
//npx playwright test tests/guide_16_1_groupingtests.spec.ts --grep Group1 
//Execute specific test case inside group of tests
//npx playwright test tests/guide_16_1_groupingtests.spec.ts --grep test3 
//Execute specific test file
//npm run test tests/guide_16_1_groupingtests.spec.ts

//Execute all tests in sequence - done by Radha in playwright.config.ts - fullyParallel: false

test.describe('Group1', () => {
    
test('test1', async ({ page }) => {
    //page.goto('https://demowebshop.tricentis.com/')
    console.log("This is test 1");
})

test('test2', async ({ page }) => {
    //page.goto('https://demowebshop.tricentis.com/')
    console.log("This is test 2");
})

});

test.describe('Group2', () => {
test('test3', async ({ page }) => {
    //page.goto('https://demowebshop.tricentis.com/')
    console.log("This is test 3");
})

test('test4', async ({ page }) => {
    //page.goto('https://demowebshop.tricentis.com/')
    console.log("This is test 4");
})

});