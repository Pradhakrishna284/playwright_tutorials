//https://www.youtube.com/watch?v=G9Nx_vSvAmo&list=PLUDwpEzHYYLtvMVjc-Va3RXLKtdB-ofc2&index=8

//We don't have select tag, but we have custom dropdowns

//Static dropdowns vs Dynamic dropdowns
//1. Static dropdowns - options are in the HTML code
//2.Dynamic/Autosuggest dropdowns - options are loaded dynamically, usually with JS framework
//3. Hidden dropdowns - options are hidden until user interacts with the dropdown

//In this example, we will handle hidden dropdowns

//Different ways of debugging in UI to find locators
//Selectorshub - debug option, 
//In developer tools - Sources tab - pause script execution

import {test, expect, Locator} from '@playwright/test';
import { listenerCount } from 'node:cluster';

test('Hidden dropdown', async ({page}) => {
    //Naviage to orange hrm live demo site
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    
    //Login to the application
    await page.getByPlaceholder('Username').fill('Admin');
    await page.getByPlaceholder('Password').fill('admin123');
    await page.getByRole('button', {name: 'Login'}).click();

    //Wait for the dashboard page to load
    await page.waitForURL('**/web/index.php/dashboard/index');

    //Click on the 'PIM' module
    await page.getByText('PIM').click();

    //Wait for the employee list to load
    await page.waitForURL('**/web/index.php/pim/viewEmployeeList');
    
    //Click on the 'Job Title' dropdown to reveal hidden options
    const jobTitleDropdown: Locator = page.locator('//label[text()="Job Title"]/following::div[1]//i');
    await expect(jobTitleDropdown).toBeVisible();
    await jobTitleDropdown.click();
    //await page.waitForTimeout(3000); //Static wait for demo purposes only. Prefer using dynamic waits in real tests
    
    //Get all the options in the dropdown
    const options: Locator = page.locator('//label[text()="Job Title"]/following::div[@role="listbox"]/div[@role="option"]/span');
    await options.first().waitFor({state: 'visible'});
    const optionCount: number = await options.count();
    console.log(`Number of options in the dropdown: ${optionCount}`);

    //Iterate through the options and print their text
    /*
    console.log('Using textContent()');
    for (let i=0; i<optionCount; i++) {
        const optionText: string | null = await options.nth(i).textContent();        
        console.log(`Option ${i + 1}: ${optionText}`);
    }

    
    console.log('Using innerText()');
    for(let i=0; i<optionCount; i++) {
        const optionText: string | null = await options.nth(i).innerText();        
        console.log(`Option ${i + 1}: ${optionText}`);
    }   
    
    const optionText: string[] = await options.allTextContents();
    console.log('Using alltextContents()');
    for (let i=0; i<optionText.length; i++) {
        console.log(`Option ${i + 1}: ${optionText[i]}`);
    }
    */

    //Select a specific option, e.g., 'Software Engineer' and print confirmation
    const desiredOption: string = 'Software Engineer';
    for (let i=0; i<optionCount; i++) {
        const optionText: string | null = await options.nth(i).innerText();
        if (optionText === desiredOption) {
            await options.nth(i).click();
            console.log(`Selected option: ${optionText}`);
            break;  
        }
    }

    //Verify the selected option is displayed in the dropdown
    const selectedOptionDisplay: Locator = page.locator('//label[text()="Job Title"]/following::div[@class="oxd-select-text-input"][1]');
    await expect(selectedOptionDisplay).toHaveText(desiredOption);  
    console.log(`Verified that the selected option "${await selectedOptionDisplay.innerText()}" is displayed in the dropdown.`);

});
