//https://www.youtube.com/watch?v=G9Nx_vSvAmo&list=PLUDwpEzHYYLtvMVjc-Va3RXLKtdB-ofc2&index=8
//We don't have select tag, but we have custom dropdowns

//Static dropdowns vs Dynamic dropdowns
//1. Static dropdowns - options are in the HTML code
//2.Dynamic/Autosuggest dropdowns - options are loaded dynamically, usually with JS framework
//3. Hidden dropdowns - options are hidden until user interacts with the dropdown

//We have to handle both types of dropdowns in our tests
//In this example, we will handle a custom select dropdown

//Different ways of debugging in UI to find locators
//Selectorshub - debug option, 
//In developer tools - Sources tab - pause script execution

import {test, expect, Locator} from '@playwright/test';

test('Autosuggest dropdown', async ({page}) => {
    await page.goto('https://www.flipkart.com/');
    //Fill the search box with 'mobiles'
    await page.getByPlaceholder('Search for Products, Brands and More').fill('mobiles');
    
    //Wait for the autosuggest dropdown to appear
    const autosuggestDropdown: Locator = page.locator('//ul[@class="GZVzXz GFxnd4 zWhq_n"]');
    //Verify that the dropdown is visible
    await expect(autosuggestDropdown).toBeVisible();

    //Get all the options in the dropdown
    const dropdownItems: Locator = autosuggestDropdown.locator('//li');
    //Verify the number of options in the dropdown
    const itemCount: number = await dropdownItems.count();
    console.log(`Number of options in the dropdown: ${itemCount}`); 

    //Iterate through the options and print their text
    for (let i=0; i<itemCount; i++) {
        const itemText: string = await dropdownItems.nth(i).innerText();
        console.log(`Option ${i+1}: ${itemText}`);
    }

    //Select the desired option from the dropdown   
    const dropdownOptions: Locator = page.locator('//ul/li[@class="Sc1DCn"]//div[@class="URRkKz RzamwD" and text()="motorola mobile 5g"]');
    //Click on the desired option
    await dropdownOptions.click();

    //Verify that the search box now contains the selected option
    const searchBoxValue: string = await page.getByPlaceholder('Search for Products, Brands and More').inputValue();
    expect(searchBoxValue).toBe('motorola mobile 5g');
    //Get the search box value and print it
    console.log(`Search box value after selection: ${searchBoxValue}`);
    const getSearchBoxText: string | null = await page.getByPlaceholder('Search for Products, Brands and More').textContent();
    console.log(`Search box text content: ${getSearchBoxText}`);
});