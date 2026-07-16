//https://www.youtube.com/watch?v=KDpR5hDtZUw&list=PLUDwpEzHYYLtvMVjc-Va3RXLKtdB-ofc2&index=16

import { test, expect } from '@playwright/test';

// 1. Run all tests with tag @smoke
// npx playwright test tests/guide_16_4_tagging.spec.ts --grep "@smoke"
// 2. Run all tests with tag @regression
// npx playwright test tests/guide_16_4_tagging.spec.ts --grep "@regression"
// 3. Run all tests with tag @smoke or @regression
// npx playwright test tests/guide_16_4_tagging.spec.ts --grep "@smoke|@regression"
// 4. Run all tests with tag @smoke and @regression
// npx playwright test tests/guide_16_4_tagging.spec.ts --grep "(?=.*@smoke)(?=.*@regression)"
// 5. Run all tests without tag @smoke or other than tag @smoke
// npx playwright test tests/guide_16_4_tagging.spec.ts --grep-invert "@smoke"

test('test1', {tag: '@smoke'}, async ({ page }) => {
    //page.goto('https://demowebshop.tricentis.com/')
    console.log("This is test 1");
})

test('test3', {tag: '@regression'}, async ({ page }) => {
    //page.goto('https://demowebshop.tricentis.com/')
    console.log("This is test 3");
})

test('test4', {tag: ['@smoke', '@regression']}, async ({ page }) => {
    //page.goto('https://demowebshop.tricentis.com/')
    console.log("This is test 4");
})