//https://www.youtube.com/watch?v=HF3Og7o_xSA&list=PLUDwpEzHYYLtvMVjc-Va3RXLKtdB-ofc2&index=15

import {test, expect} from '@playwright/test';

//Retries done in playwright.config.ts file
//Retries can be set at test level also
// test.describe.configure({ retries: 2 });

// A flaky test that randomly fails - playwright config.ts has retries set to 3
// So this test will be retried up to 3 times if it fails
test.describe('Flaky Tests Guide', () => {  
    test('Flaky Test Example', async ({page}) => {
        await page.goto('https://example.com');
        const randomNumber = Math.random();
        console.log(`Random number generated: ${randomNumber}`);
        expect(randomNumber).toBeGreaterThan(1.3); // This will fail most of the time        
    });
});

//configure retries at test level
test.describe('Another Flaky Tests Guide', () => {  
    test.describe.configure({ retries: 2 }); // Set retries for this describe block
    test('Another Flaky Test Example', async ({page}) => {
        await page.goto('https://demowebshop.tricentis.com/');
        const randomNumber = Math.random();
        console.log(`Random number generated: ${randomNumber}`);
        expect(randomNumber).toBeGreaterThan(0.2); // This will fail most of the time        
    });

     test('Non-Flaky Test Example', async ({page}) => {
        await page.goto('https://demowebshop.tricentis.com/');
        const title = await page.title();
        console.log(`Page title is: ${title}`);
        expect(title).toBe('Demo Web Shop'); // This should always pass
    });
});
