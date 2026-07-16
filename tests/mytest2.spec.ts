// Import Playwright test utilities
// 'test' - Function to define a test case
// 'expect' - Function for making assertions/validations in tests
import {test, expect} from '@playwright/test'


test('verify page url', async ({page}) => {
    await page.goto('http://www.automationpractice.pl/index.php')
    expect(page).toHaveURL('http://www.automationpractice.pl/index.php')
    //expect(page).toHaveURL(/automationpractice/)
    let getPageURL = page.url()
    console.log("Page URL is: " + getPageURL)    
})