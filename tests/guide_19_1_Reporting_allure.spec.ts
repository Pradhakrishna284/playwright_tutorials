//https://www.youtube.com/watch?v=P21khcU59qA&list=PLUDwpEzHYYLtvMVjc-Va3RXLKtdB-ofc2&index=19
//40:48

import { test, expect } from '@playwright/test';

test('test1', async ({ page }) => {
    //page.goto('https://demowebshop.tricentis.com/')
    console.log("This is test 1");
})

test('test2', async ({ page }) => {
    //page.goto('https://demowebshop.tricentis.com/')
    const isTest2: boolean = true;
    console.log("This is test 2");
    expect(isTest2).toBe(false);

})

test('test3', async ({ page }) => {
    //page.goto('https://demowebshop.tricentis.com/')
    console.log("This is test 3");
})

test('test4', async ({ page }) => {
    //page.goto('https://demowebshop.tricentis.com/')
    console.log("This is test 4");
})