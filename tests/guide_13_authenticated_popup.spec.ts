//https://www.youtube.com/watch?v=dWdLjXEZdIw&list=PLUDwpEzHYYLtvMVjc-Va3RXLKtdB-ofc2&index=13

import { test, expect } from '@playwright/test';

test.describe('Authenticated Popup Handling', () => {

    test('Handle authenticated popup', async ({ page, context }) => {
        //1. Navigate to the page that requires authentication
        // Note: Using httpCredentials via context is the recommended approach over embedding credentials in the URL
        await context.setHTTPCredentials({ username: 'admin', password: 'admin' });
        await page.goto('http://the-internet.herokuapp.com/basic_auth');
        await page.waitForLoadState(); //wait for page to load completely
        
        //2. Verify successful authentication by checking for specific content on the page
        const successMessage = page.locator('div.example p');
        await expect(successMessage).toContainText('Congratulations! You must have the proper credentials.');
    })
})