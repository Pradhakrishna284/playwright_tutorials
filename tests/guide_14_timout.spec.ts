//https://playwright.dev/docs/actionability

import { test, expect } from '@playwright/test';

//Implicit Waits - Playwright by default waits for the elements to be ready before performing any actions

//Explicit Waits - We can use waitForSelector or other wait methods to wait for specific conditions
//What are the different wait methods available in Playwright?
//1. waitForSelector
//2. waitForTimeout
//3. waitForEvent
//4. waitForLoadState
//SetTimeout - We can set custom timeout for a specific test using test.setTimeout()
//The default timeout is set in playwright.config.ts file
//Here we are demonstrating all three types of waits

test.describe('Timeouts Demo', () => {
  test('Implicit Waits Demo', async ({ page }) => {
    //Navigating to the URL
    await page.goto('/');
    //Click on the Button to display the textbox after 5 seconds
    await page.click('input#show-textbox');
    //Now trying to enter the value in the textbox which is displayed after 5 seconds
    await page.fill('input#displayed-textbox', 'Hello World');
    //Verification
    const txtValue = await page.locator('input#displayed-textbox').inputValue();
    expect(txtValue).toBe('Hello World');
  });

  test('Explicit Waits Demo', async ({ page }) => { 
    //Navigating to the URL
    await page.goto('/');
    //Click on the Button to display the textbox after 5 seconds
    await page.click('input#show-textbox');
    //Now trying to enter the value in the textbox which is displayed after 5 seconds
    await page.waitForSelector('input#displayed-textbox', { state: 'visible', timeout: 10000 });
    await page.fill('input#displayed-textbox', 'Hello World');

    //Verification -  overrinding the default expect timeout
    await expect(page.locator('input#displayed-textbox')).toBeVisible({timeout: 20000});
    const txtValue = await page.locator('input#displayed-textbox').inputValue();
    expect(txtValue).toBe('Hello World');
  });   

  test('SettimeOut Demo', async ({ page }) => { 
    //Navigating to the URL
    await page.goto('/');
    //Overriding the default timeout for this test
    //Setting a timeout of 120 seconds for this test
    test.setTimeout(120 * 1000); //120 seconds

    await page.click('input#show-textbox');
    //Now trying to enter the value in the textbox which is displayed after 5 seconds
    await page.fill('input#displayed-textbox', 'Hello World');
    //Verification
    const txtValue = await page.locator('input#displayed-textbox').inputValue();
    expect(txtValue).toBe('Hello World');
  });

  test('slow page load demo', async ({ page }) => { 
    //Setting page load timeout for this test
    await page.setDefaultNavigationTimeout(120 * 1000); //120 seconds
    //Navigating to the URL
    await page.goto('https://www.wikipedia.org/');
    //Verification
    await expect(page).toHaveTitle(/Wikipedia/);
  });

  test('slow element handle demo', async ({ page }) => { 
    //Setting element handle timeout for this test
    await page.setDefaultTimeout(120 * 1000); //120 seconds
    //Navigating to the URL
    await page.goto('/');
    //Click on the Button to display the textbox after 5 seconds
    await page.click('input#show-textbox');
    //Now trying to enter the value in the textbox which is displayed after 5 seconds
    await page.fill('input#displayed-textbox', 'Hello World');
    //Verification
    const txtValue = await page.locator('input#displayed-textbox').inputValue();
    expect(txtValue).toBe('Hello World');
  });

  test('wait for load state demo', async ({ page }) => { 
    //Navigating to the URL
    await page.goto('https://www.wikipedia.org/');
    //Waiting for the load state to be 'load'
    await page.waitForLoadState('load', { timeout: 10000 });
    //Verification
    await expect(page).toHaveTitle(/Wikipedia/);
  });

  test('wait for timeout demo', async ({ page }) => { 
    //Navigating to the URL
    await page.goto('/');   
    //Click on the Button to display the textbox after 5 seconds
    await page.click('input#show-textbox');
    //Waiting for 6 seconds
    await page.waitForTimeout(6000);    
    //Now trying to enter the value in the textbox which is displayed after 5 seconds
    await page.fill('input#displayed-textbox', 'Hello World');
    //Verification
    const txtValue = await page.locator('input#displayed-textbox').inputValue();
    expect(txtValue).toBe('Hello World');
  });

 test('test slow demo using test.slow', async ({ page }) => {
    //Marking this test as slow
    //test.slow() is a Playwright feature that marks a test as slow and automatically multiplies all timeouts by 3x.
    test.slow(); //what happens is that the timeout for this test is trippled
    //Navigating to the URL
    await page.goto('https://www.wikipedia.org/');
    //Verification
    await expect(page).toHaveTitle(/Wikipedia/);
  });
});