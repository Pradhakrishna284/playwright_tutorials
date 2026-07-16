//https://www.youtube.com/watch?v=KDpR5hDtZUw&list=PLUDwpEzHYYLtvMVjc-Va3RXLKtdB-ofc2&index=16

//when fullyParallel is false, tests will run in sequence
//when fullyParallel is true, tests will run in parallel, 
// may be in different order, depends on system scheduling.
// when fullyParallel is true, beforeEach and afterEach hooks may not run accordingly with the tests
// when fullyParallel is false, beforeEach and afterEach hooks will run accordingly with the tests in sequence
import { test } from '@playwright/test';

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

test('test1', async ({ page }) => {
    //page.goto('https://demowebshop.tricentis.com/')
    console.log("This is test 1");
})

test('test2', async ({ page }) => {
    //page.goto('https://demowebshop.tricentis.com/')
    console.log("This is test 2");
})

test('test3', async ({ page }) => {
    //page.goto('https://demowebshop.tricentis.com/')
    console.log("This is test 3");
})

test('test4', async ({ page }) => {
    //page.goto('https://demowebshop.tricentis.com/')
    console.log("This is test 4");
})