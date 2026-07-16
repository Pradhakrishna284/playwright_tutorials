// Reference YouTube tutorial for dropdown actions in Playwright
// https://www.youtube.com/watch?v=Jd_2dVS9zdo&list=PLUDwpEzHYYLtvMVjc-Va3RXLKtdB-ofc2&index=7
// Import test, expect utilities and Locator type from Playwright test framework
import {test, expect, Locator} from '@playwright/test';

// Reference webpage demonstrating jQuery dropdown with search functionality
// https://www.lambdatest.com/selenium-playground/jquery-dropdown-search-demo
// Test: Dropdown actions test - single select demonstrating various dropdown interaction methods
test('Dropdown actions test - multi select', async ({page}) => {
    // Navigate to the base URL
    await page.goto('/');
    // Locate the multi-select dropdown element with id 'colors'
    const multiSelectDropdown: Locator = page.locator('#colors');

    //Select an option from the dropdown by visible text, label, value attribute, and index

    //a. Select multiple options from the dropdown by their value attributes
    //1. Select multiple options from the dropdown by their value attributes
    await multiSelectDropdown.selectOption([{value: 'red'}, {value: 'white'}, {value: 'green'}, {value: 'yellow'}]);
    //2. Retrieve all selected options by evaluating in the page context
    const selectedValues = await multiSelectDropdown.evaluate(() => {
    // Get all selected options
    const selected = document.querySelectorAll('option:checked');
    // Map selected options to their value attributes
    return Array.from(selected).map((option: any) => option.value);
});
    //3. Assert that the selected values match the expected array
    expect(selectedValues).toEqual(['red', 'white', 'green', 'yellow']);
    //4. Log the selected values to the console for verification
console.log(`Selected values: ${selectedValues.join(', ')}`);   

    //5. Deselect all options by selecting an empty array
    await multiSelectDropdown.selectOption([]); 

    //6. Retrieve selected options after deselection
    const deselectedValues = await multiSelectDropdown.evaluate(() => {
    const selected = document.querySelectorAll('option:checked');
    return Array.from(selected).map((option: any) => option.value);
    });

    //7. Assert that no options are selected after deselection
    expect(deselectedValues).toEqual([]);

    //8. Log the result to the console
    console.log('All options deselected successfully.');

    //b. Select multiple options from the dropdown by their label attributes
    //1. Select multiple options from the dropdown by their label attributes
    await multiSelectDropdown.selectOption([{label: 'Blue'}, {label: 'White'}, {label: 'Green'}]);
    //2. Retrieve all selected options by evaluating in the page context
    const selectedLabels = await multiSelectDropdown.evaluate(() => {
    const selected = document.querySelectorAll('option:checked');
    return Array.from(selected).map((option: any) => option.label);
    });

    //3. Assert that the selected labels match the expected array
    expect(selectedLabels).toEqual(['Blue', 'White', 'Green']);

    //4. Log the selected labels to the console for verification
    console.log(`Selected labels: ${selectedLabels.join(', ')}`);

    //5. Deselect all options by selecting an empty array
    await multiSelectDropdown.selectOption([]);

    //6. Retrieve selected options after deselection
    const deselectedLabels = await multiSelectDropdown.evaluate(() => {
    const selected = document.querySelectorAll('option:checked');
    return Array.from(selected).map((option: any) => option.label);
    });

    //7. Assert that no options are selected after deselection
    expect(deselectedLabels).toEqual([]);

    //8. Log the result to the console
    console.log('All options deselected successfully.');

    //c. Select multiple options from the dropdown by their index positions
    //1. Select multiple options from the dropdown by their index positions
    await multiSelectDropdown.selectOption([{index: 0}, {index: 2}, {index: 4}]);
    //2. Retrieve all selected options by evaluating in the page context
    const selectedByIndex = await multiSelectDropdown.evaluate(() => {
    const selected = document.querySelectorAll('option:checked');
    return Array.from(selected).map((option: any) => option.value);
    });

    //3. Assert that the selected values match the expected array
    expect(selectedByIndex).toEqual(['red', 'green', 'yellow']);

    //4. Log the selected values to the console for verification
    console.log(`Selected values by index: ${selectedByIndex.join(', ')}`);

    //5. Deselect all options by selecting an empty array
    await multiSelectDropdown.selectOption([]);

    //6. Retrieve selected options after deselection
    const deselectedByIndex = await multiSelectDropdown.evaluate(() => {
    const selected = document.querySelectorAll('option:checked');
    return Array.from(selected).map((option: any) => option.value);
    });

    //7. Assert that no options are selected after deselection
    expect(deselectedByIndex).toEqual([]);

    //8. Log the result to the console
    console.log('All options deselected successfully.');

    //d. Retrieve and print all available options in the multi-select dropdown
    //1. Locate all option elements within the multi-select dropdown
    const allOptions: Locator = page.locator('#colors > option');
    //2. Get the total count of option elements in the dropdown
    const optionsCount: number = await allOptions.count();
    //3. Log the total number of options in the dropdown to the console
    console.log(`Total options in the multi-select dropdown: ${optionsCount}`);
    //4. Assert that the total number of options equals 7
    expect(optionsCount).toBe(7);

    //5. Iterate through each option and log its label and value attributes
    for (let i = 0; i < optionsCount; i++) {
        const optionLabel = await allOptions.nth(i).innerText();
        const optionValue = await allOptions.nth(i).getAttribute('value');
        console.log(`Option ${i + 1}: Label = ${optionLabel}, Value = ${optionValue}`);
    }

    //6. Additionally, retrieve all option labels using allTextContents() and log them
    const allOptionsText: string[] = (await allOptions.allTextContents()).map(text => text.trim());
    console.log('All option labels:', allOptionsText);

    //e. Retrieve and print the count of selected options at various stages
    //1. Select multiple options to set an initial state
    await multiSelectDropdown.selectOption([{value: 'blue'}, {value: 'yellow'}]);
    //2. Retrieve and log the count of selected options
    let selectedCount = await multiSelectDropdown.evaluate(() => {
        return document.querySelectorAll('option:checked').length;
    });
    console.log(`Count of selected options after initial selection: ${selectedCount}`);
    expect(selectedCount).toBe(2);
    //3. Select additional options
    await multiSelectDropdown.selectOption([{value: 'red'}, {value: 'green'}]);
    //4. Retrieve and log the updated count of selected options
    selectedCount = await multiSelectDropdown.evaluate(() => {
        return document.querySelectorAll('option:checked').length;
    });
    console.log(`Count of selected options after adding more selections: ${selectedCount}`);
    expect(selectedCount).toBe(4);

    //5. Deselect all options
    await multiSelectDropdown.selectOption([]);
    //6. Retrieve and log the count of selected options after deselection
    selectedCount = await multiSelectDropdown.evaluate(() => {
        return document.querySelectorAll('option:checked').length;
    });
    console.log(`Count of selected options after deselection: ${selectedCount}`);
    expect(selectedCount).toBe(0);
    
    //7. Log completion message
    console.log('Multi-select dropdown actions test completed successfully.');

    //f. Visible Text Verification for Selected Options
    //1. Select multiple options
    await multiSelectDropdown.selectOption([{value: 'red'}, {value: 'green'}, {value: 'blue'}]);
    //2. Retrieve and log the visible text of all selected options
    const selectedVisibleTexts = await multiSelectDropdown.evaluate(() => {
        const selected = document.querySelectorAll('option:checked');
        return Array.from(selected).map((option: any) => option.textContent.trim());
    });
    console.log(`Visible texts of selected options: ${selectedVisibleTexts.join(', ')}`);
    //3. Assert that the visible texts match the expected array
    expect(selectedVisibleTexts).toEqual(['Red', 'Green', 'Blue']); 

    //4. Deselect all options to clean up
    await multiSelectDropdown.selectOption([]);

    //5. Log completion message
    console.log('Visible text verification for selected options completed successfully.');

    //  g. Check if specific options are present in the multi-select dropdown
    //1. Locate all option elements within the multi-select dropdown
    const allDropdownOptions: Locator = page.locator('#colors > option');
    //2. Get the total count of all option elements
    const totalOptionsCount: number = await allDropdownOptions.count();
    //3. Log the total number of options available
    console.log(`Total available options in dropdown: ${totalOptionsCount}`);

    //4. Method 1: Verify option presence by visible text using loop
    //a. Define the specific option text to search for
    const specificOptionText = 'Yellow';
    //b. Initialize a boolean flag to track if the specific option is found
    let optionTextFound = false;
    //c. Loop through each option element by index
    for (let i=0; i<totalOptionsCount; i++) {
        //i. Get the visible text content of the i-th option element
        const optionText = await allDropdownOptions.nth(i).innerText();
        //ii. Check if the trimmed option text matches the specific option text
        if (optionText.trim() === specificOptionText) {
            //iii. Set the flag to true if a match is found
            optionTextFound = true;
            //iv. Exit the loop early
            break;
        }
    }
    //d. Log the result of the option text search
    console.log(`Option "${specificOptionText}" found in dropdown (by visible text): ${optionTextFound}`);
    //e. Assert that the option was found
    expect(optionTextFound).toBeTruthy();

    //5. Method 2: Verify option presence by visible text using array method
    //a. Get all visible text from all options
    const allOptionsTextArray: string[] = (await allDropdownOptions.allTextContents()).map(text => text.trim());
    //b. Log all available option texts
    console.log(`All available option texts: ${allOptionsTextArray.join(', ')}`);
    //c. Check if the specific option text exists in the array
    const optionTextExists = allOptionsTextArray.includes(specificOptionText);
    //d. Log the result using array method
    console.log(`Option "${specificOptionText}" found using array method: ${optionTextExists}`);
    //e. Assert using toContain matcher
    expect(allOptionsTextArray).toContain(specificOptionText);

    //6. Method 3: Verify option presence by value attribute using evaluate()
    //a. Get all option values from the dropdown using evaluate()
    const allOptionValuesArray = await multiSelectDropdown.evaluate(() => {
        //i. Query all option elements
        const options = document.querySelectorAll('option');
        //ii. Map each option to its value attribute
        return Array.from(options).map((option: any) => option.value);
    });
    //b. Log all available option values
    console.log(`All available option values: ${allOptionValuesArray.join(', ')}`);
    //c. Define the specific option value to search for
    const specificOptionValue = 'yellow';
    //d. Check if the specific option value exists in the values array
    const optionValueExists = allOptionValuesArray.includes(specificOptionValue);
    //e. Log the result of the option value search
    console.log(`Option value "${specificOptionValue}" found in dropdown: ${optionValueExists}`);
    //f. Assert that the option value was found
    expect(optionValueExists).toBeTruthy();

    //7. Method 4: Verify non-existent option does not exist
    //a. Define an option that should not be present in the dropdown
    const nonExistentOption = 'Purple';
    //b. Check if the non-existent option exists in the options text array
    const nonExistentFound = allOptionsTextArray.includes(nonExistentOption);
    //c. Log the result of the non-existent option search
    console.log(`Non-existent option "${nonExistentOption}" found in dropdown: ${nonExistentFound}`);
    //d. Assert that the non-existent option was not found
    expect(nonExistentFound).toBeFalsy();

    //  h. Final Cleanup: Ensure no options are selected at the end of the test
    // Deselect all options by selecting an empty array
    await multiSelectDropdown.selectOption([]);
    // Retrieve all selected options to verify deselection
    const finalSelectedValues = await multiSelectDropdown.evaluate(() => {
        // Query all selected option elements
        const selected = document.querySelectorAll('option:checked');
        // Map each selected option to its value attribute
        return Array.from(selected).map((option: any) => option.value);
    });
    // Assert that no options are selected after final cleanup
    expect(finalSelectedValues).toEqual([]);
    // Log completion message for cleanup
    console.log('Final cleanup completed. No options are selected at the end of the test.');
    
});