//https://www.youtube.com/watch?v=P21khcU59qA&list=PLUDwpEzHYYLtvMVjc-Va3RXLKtdB-ofc2&index=19

//Configure reporter in playwright.config.ts file
// reporter: [['html', {open: 'always'}]] 
// - Always open the HTML report after the test run, whether tests pass or fail.
// We can also set the output directory for the HTML report by adding the 'outputFolder' option like this:
// reporter: [['html', {open: 'always', outputFolder: 'my-custom-report-folder'}]] 
// This will save the HTML report in a folder named 'my-custom-report-folder'.

// To open the report, we can run the following command in the terminal:
// npx playwright show-report my-custom-report-folder

import { test } from '@playwright/test';

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