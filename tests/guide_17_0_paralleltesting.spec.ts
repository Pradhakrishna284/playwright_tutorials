//https://www.youtube.com/watch?v=hJdYOzkTvDU&list=PLUDwpEzHYYLtvMVjc-Va3RXLKtdB-ofc2&index=17

//fullParallel is true by default in Playwright Test
//So all tests will run in parallel unless specified otherwise
//You can also control parallelism at the test level using test.describe.parallel or test.describe.serial
//Here, all tests will run in parallel
//To run tests serially, you can use test.describe.serial
//For demonstration, we are keeping all tests simple with console logs
//When fullParallel is true, tests will run in parallel across multiple workers
//Each test will have its own isolated browser context
//This is useful for speeding up test execution
//When fullParallel is false, tests will run serially in a single worker
//This is useful for debugging or when tests have dependencies

import { test, expect } from '@playwright/test';

//test.describe.configure({ mode: 'serial' }); // Run all tests in this describe block serially
test.describe.configure({ mode: 'parallel' }); // Run all tests in this describe block serially

test.describe('group1', async () => {
    
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

test('test5', async ({ page }) => {
    //page.goto('https://demowebshop.tricentis.com/')
    console.log("This is test 5");
})
})
