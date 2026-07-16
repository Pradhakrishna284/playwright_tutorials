// Reference YouTube tutorial for dropdown actions in Playwright
// https://www.youtube.com/watch?v=Jd_2dVS9zdo&list=PLUDwpEzHYYLtvMVjc-Va3RXLKtdB-ofc2&index=7
// Import test, expect utilities and Locator type from Playwright test framework
import {test, expect, Locator} from '@playwright/test';

// Reference webpage demonstrating jQuery dropdown with search functionality
// https://www.lambdatest.com/selenium-playground/jquery-dropdown-search-demo
// Test: Dropdown actions test - single select demonstrating various dropdown interaction methods
test('Dropdown actions test - single select', async ({page}) => {
    // Navigate to the base URL
    await page.goto('/');
    // Locate the country dropdown element with id 'country'
    const dropdownlist: Locator =page.locator('#country');

    // Section 1: Select an option from the dropdown by visible text, label, value attribute, and index
    // Subsection: Select dropdown option by visible text 'India'
    await dropdownlist.selectOption('India');

    // Note: By default, selectOption method matches options by their value attribute
    // Retrieve the value attribute of the currently selected option
    const value = await dropdownlist.inputValue();
    // Log the value attribute of the selected option to the console
    console.log(`Value attribute: ${value}`);
    // Assert that the value attribute equals 'india' (lowercase)
    expect(value).toBe('india');
    
    // Retrieve the visible text of the currently selected option
    const visibleText = await dropdownlist.locator('option:checked').innerText();    
    // Log the visible text of the selected option to the console
    console.log(`Dropdown option selected by Visible text: ${visibleText}`);
    // Assert that the visible text (trimmed) equals 'India'
    expect(visibleText.trim()).toBe('India');

    // Subsection: Select dropdown option by label attribute 'Japan'
    await dropdownlist.selectOption({label: 'Japan'});
    // Retrieve the value attribute of the newly selected option
    // Assert that the value attribute equals 'japan' (lowercase)
    expect(await dropdownlist.inputValue()).toBe('japan');
    // Log the value attribute of the option selected by label to the console
    console.log(`Dropdown option selected by label (value attribute) ${await dropdownlist.inputValue()}`);
    
    // Retrieve the visible text of the option selected by label
    const visibleText1 = await dropdownlist.locator('option:checked').innerText();    
    // Log the visible text of the option selected by label to the console
    console.log(`Dropdown option selected by label (visible text) ${visibleText1}`);
    // Assert that the visible text (trimmed) equals 'Japan'
    expect(visibleText1.trim()).toBe('Japan');

    // Subsection: Select dropdown option by value attribute 'germany'
    await dropdownlist.selectOption({value: 'germany'});
    // Assert that the value attribute of the selected option equals 'germany'
    expect(await dropdownlist.inputValue()).toBe('germany');
    // Log the value attribute of the option selected by value to the console
    console.log(`Dropdown option selected by value attribute ${await dropdownlist.inputValue()}`);

    // Subsection: Select dropdown option by index position (5th option, 0-indexed)
    await dropdownlist.selectOption({index: 5});
    // Assert that the value attribute of the selected option equals 'australia'
    expect(await dropdownlist.inputValue()).toBe('australia');
    // Log the value attribute of the option selected by index to the console
    console.log(`Dropdown option selected by index ${await dropdownlist.inputValue()}`);

    // Section 2: Get all options from the dropdown and print them
    // Locate all option elements within the country dropdown
    const allOptions: Locator = page.locator('#country > option');
    // Get the total count of option elements in the dropdown
    const optionsCount: number = await allOptions.count();
    // Log the total number of options in the dropdown to the console
    console.log(`Total optionsin the dropdown: ${optionsCount}`);
    // Assert that the total number of options equals 10
    expect(optionsCount).toBe(10);

    // Log a header message for options display method 1
    console.log('Dropdown options using innerText():');
    // Loop through each option element by index from 0 to optionsCount-1
    for (let i=0; i<optionsCount; i++) {
        // Get the visible text content of the i-th option element
        const optionText = await allOptions.nth(i).innerText();
        // Log the trimmed visible text of the current option to the console
        console.log(optionText.trim());
    }    

    // Log a header message for options display method 2
    console.log('Dropdown options using allTextContents():');
    // Get all visible text contents from all option elements and trim each one
    const allOptionsText: string[] = (await allOptions.allTextContents()).map(text => text.trim()); 
    // Log all option texts as an array to the console
    console.log(allOptionsText);
    
    // Section 3: Check if a specific option is present in the dropdown
    // Subsection: Verify option presence using loop method (Option 1)
    // Define the specific option text to search for in the dropdown
    const specificOption = 'Canada';
    // Initialize a boolean flag to track if the specific option is found
    let optionFound = false;
    // Loop through each option element by index from 0 to optionsCount-1
    for (let i=0; i<optionsCount; i++) {
        // Get the visible text content of the i-th option element
        const optionText = await allOptions.nth(i).innerText(); 
        // Check if the trimmed option text matches the specificOption value
        if (optionText.trim() === specificOption) {
            // Set the optionFound flag to true if a match is found
            optionFound = true;
            // Exit the loop early since we found the option
            break;
        }
    }
    // Assert that the option was found in the dropdown
    expect(optionFound).toBeTruthy();
    // Log the result of the option search to the console
    console.log(`Option "${specificOption}" found in the dropdown: ${optionFound}`);

    // Subsection: Verify option presence using array method (Option 2)
    // Assert that the allOptionsText array contains the specificOption
    expect(allOptionsText).toContain(specificOption);
    // Log the result of the option search using array method to the console
    console.log(`Option "${specificOption}" found in the dropdown using allTextContents(): ${allOptionsText.includes(specificOption)}`);
   
});
