//https://www.youtube.com/watch?v=KDpR5hDtZUw&list=PLUDwpEzHYYLtvMVjc-Va3RXLKtdB-ofc2&index=16

import { test } from '@playwright/test';

//When we have multiple test groups, the hooks will be executed for each group
// beforeAll -> beforeEach -> test1 -> afterEach -> beforeEach -> test2 -> afterEach -> afterAll
// beforeAll -> beforeEach -> test3 -> afterEach -> beforeEach -> test4 -> afterEach -> afterAll
// So, beforeAll and afterAll will run two times each because we have two describe blocks


 test.beforeAll(async ({ page }) => {
    console.log("This is before all hook");
});

test.afterAll(async ({ page }) => {
    console.log("This is after all hook");
});

test.beforeEach(async ({ page }) => {
    console.log("This is before each hook");
});

test.afterEach(async ({ page }) => {
    console.log("This is after each hook");
});

test.describe('Group1', () => {   

test('test1', async ({ page }) => {
    //page.goto('https://demowebshop.tricentis.com/')
    console.log("This is test 1");
})

test('test2', async ({ page }) => {
    //page.goto('https://demowebshop.tricentis.com/')
    console.log("This is test 2");
})
})

test.describe('Group2', () => {   

test('test3', async ({ page }) => {
    //page.goto('https://demowebshop.tricentis.com/')
    console.log("This is test 3");
})

test('test4', async ({ page }) => {
    //page.goto('https://demowebshop.tricentis.com/')
    console.log("This is test 4");
})
})