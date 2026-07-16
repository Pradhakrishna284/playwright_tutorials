// Reference YouTube tutorial for input handling in Playwright
// https://www.youtube.com/watch?v=u5LDd2JSXMs&list=PLUDwpEzHYYLtvMVjc-Va3RXLKtdB-ofc2&index=6
// Reference Playwright documentation for input actions
// https://playwright.dev/docs/input
// Import test, expect utilities and Locator type from Playwright test framework
import {test, expect, Locator} from '@playwright/test';
// Import get method from Node.js http module
import { get } from 'node:http';

// Target website: testautomationpractice.blogspot.com
// Test suite covers: Input Textbox, TextArea, Radio Button, Checkbox, Dropdown handling
// Test 1: Handling HTML Elements - Input Textbox with various assertions and interactions
test('Handling HTML Elements - Input Textbox', async ({page}) => {
    // Navigate to the base URL
    await page.goto('/')
    // Locate the input textbox element with id 'name'
    const name: Locator = page.locator('#name');
    // Verify that the input element is visible on the page
    await expect(name).toBeVisible();
    // Verify that the input element is enabled for user interaction
    await expect(name).toBeEnabled();
    // Retrieve the maxlength attribute value from the input element
    const getMaxLength: string | null = await name.getAttribute("maxlength");
    // Log the maxlength attribute value to the console
    console.log("Max Length of Input Textbox: " + getMaxLength);
    // Assert that the maxlength attribute equals 15
    expect(getMaxLength).toBe("15");
    // Fill the input field with the text "Radha Krishna"
    await name.fill("Radha Krishna");
    // Retrieve the actual value currently entered in the input field
    const getTextBoxValue: string | null = await name.inputValue();
    // Log the text value entered in the input field to the console
    console.log("Text entered in Input Textbox: " + getTextBoxValue);
    // Assert that the entered text matches the expected value "Radha Krishna"
    expect(getTextBoxValue).toBe("Radha Krishna");
    // Wait for 3000 milliseconds (3 seconds) before test completion
    await page.waitForTimeout(3000);
});

// Test 2: Handling HTML Elements - TextArea with fill and retrieval operations
test('Handling HTML Elements - TextArea', async ({page}) => {
    // Navigate to the base URL
    await page.goto('/');
    // Locate the textarea element with id 'textarea'
    const address: Locator = page.locator('#textarea');
    // Scroll the textarea element into view if it's not currently visible
    await address.scrollIntoViewIfNeeded();
    // Verify that the textarea element is visible on the page
    await expect(address).toBeVisible();
    // Verify that the textarea element is enabled for user interaction
    await expect(address).toBeEnabled();
    // Fill the textarea with a multi-line address string
    await address.fill("Plot No 123, Street No 45, City Name, State, Country - 500001");
    // Retrieve the actual value currently entered in the textarea element
    const getTextAreaValue: string | null = await address.inputValue();
    // Log the text value entered in the textarea to the console
    console.log("Text entered in TextArea: " + getTextAreaValue);
    // Assert that the entered text matches the expected complete address
    expect(getTextAreaValue).toBe("Plot No 123, Street No 45, City Name, State, Country - 500001");
    // Assert that the entered text contains the substring "City Name"
    expect(getTextAreaValue).toContain("City Name");
    // Wait for 3000 milliseconds (3 seconds) before test completion
    await page.waitForTimeout(3000);
 });

 // Test 3: Handling HTML Elements - Radio Button selection and assertion
 test('Handling HTML Elements - Radio Button', async ({page}) => {
    // Navigate to the base URL
    await page.goto('/');
    // Locate the male radio button element with id 'male'
    const maleRadioBtn: Locator = page.locator("#male");
    // Verify that the radio button is visible on the page
    await expect(maleRadioBtn).toBeVisible();
    // Verify that the radio button is enabled for user interaction
    await expect(maleRadioBtn).toBeEnabled();
    // Check that the radio button is not initially selected (returns false)
    expect(await maleRadioBtn.isChecked()).toBe(false);
    // Click the radio button to select it
    await maleRadioBtn.check(); // select radio button
    // Verify that the radio button is now selected (returns true)
    expect(await maleRadioBtn.isChecked()).toBe(true);
    // Assert that the radio button state is checked using Playwright's toBeChecked matcher
    await expect(maleRadioBtn).toBeChecked();
 });

 // Test 4: Handling HTML Elements - Checkbox interactions (single, multiple, toggle, random, conditional)
 test.only('Handling HTML Elements - Checkbox', async ({page}) => {
    // Navigate to the base URL
    await page.goto('/');
    // Locate the checkbox element with label 'Sunday' using getByLabel method
    const checkSingleCheckBox: Locator = page.getByLabel('Sunday');
    // Check the 'Sunday' checkbox to select it
    await checkSingleCheckBox.check();
    // Assert that the 'Sunday' checkbox is now checked
    await expect(checkSingleCheckBox).toBeChecked();

    // Locate all checkbox elements with type="checkbox" attribute
    const checkMultipleCheckBox: Locator = page.locator('input[type="checkbox"]');
    // Get the total count of checkbox elements on the page
    const allCheckBoxesCount: number = await checkMultipleCheckBox.count();
    // Log the total number of checkboxes found to the console
    console.log("Total number of checkboxes: " + allCheckBoxesCount);
    // Loop through each checkbox using index from 0 to total count minus 1
    for(let i=0; i<allCheckBoxesCount; i++){
        // Get the i-th checkbox element from the collection
        const checkBox: Locator = checkMultipleCheckBox.nth(i);
        // Log the checkbox locator object to the console for debugging
        console.log(checkBox);
        // Retrieve the 'value' attribute from the current checkbox
        const checkBoxValue: string | null = await checkBox.getAttribute("value");
        // Log the checkbox value to the console
        console.log("Checkbox value is: " + checkBoxValue);
        // Check (select) the current checkbox
        await checkBox.check();
        // Assert that the current checkbox is checked
        await expect(checkBox).toBeChecked();
    }

    // Create an array of day names for day-based checkbox selection
    const days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    // Map each day name to its corresponding checkbox locator using getByLabel
    const checkBoxByLabel: Locator[] = days.map(day => page.getByLabel(day));
    // Assert that the number of checkboxes found equals 7 (one for each day)
    expect(checkBoxByLabel.length).toBe(7);
    // Loop through each checkbox in the collection
    for(const checkbox of checkBoxByLabel){
        // Check (select) the current checkbox
        await checkbox.check();
        // Assert that the current checkbox is checked
        await expect(checkbox).toBeChecked();
    }

    // Get the last 3 checkboxes from the collection using slice(-3)
    // Loop through each of the last 3 checkboxes
    for(const checkbox of checkBoxByLabel.slice(-3)){
        // Uncheck (deselect) the current checkbox
        await checkbox.uncheck();
        // Log the checkbox locator object to the console
        console.log(checkbox);
        // Assert that the current checkbox is now unchecked
        await expect(checkbox).not.toBeChecked();
        // Log the checkbox label value to the console
        console.log("Unchecked checkbox with label: " + await checkbox.inputValue());
    }

    // Loop through all checkboxes to toggle their state (checked <-> unchecked)
    for(const checkbox of checkBoxByLabel){
        // Determine if the checkbox is currently checked
        const isChecked: boolean = await checkbox.isChecked();
        // If the checkbox is checked, uncheck it
        if(isChecked){
            // Uncheck the checkbox
            await checkbox.uncheck();
            // Log that the checkbox was toggled to unchecked
            console.log("Toggled to Unchecked checkbox with label: " + await checkbox.inputValue());
            // Assert that the checkbox is now unchecked
            await expect(checkbox).not.toBeChecked();
        }
        // If the checkbox is unchecked, check it   
        else{
            // Check the checkbox
            await checkbox.check();
            // Log that the checkbox was toggled to checked
            console.log("Toggled to Checked checkbox with label: " + await checkbox.inputValue());
            // Assert that the checkbox is now checked
            await expect(checkbox).toBeChecked();
        }         
    }

    // Create an array of specific checkbox indexes to be selected randomly
    const randomIndexes: number[] = [1,3,6]
    // Loop through each index in the randomIndexes array
    for(const index of randomIndexes){
        // Check the checkbox at the specified index
        await checkBoxByLabel[index].check();
        // Log that the checkbox at the specified index was checked
        console.log("Randomly checked checkbox with label: " + await checkBoxByLabel[index].inputValue());
        // Assert that the checkbox at the specified index is checked
        await expect(checkBoxByLabel[index]).toBeChecked();
    }

    // Define the week name to search for when selecting checkboxes by value
    const weekName: string = "Friday";
    // Loop through all checkboxes in the collection
    for(const checkbox of checkBoxByLabel){
        // Get the value/label of the current checkbox
        const label: string = await checkbox.inputValue();
        // Check if the checkbox label matches the target weekName (case-insensitive comparison)
        if(label.toLowerCase() === weekName.toLowerCase()){
            // Check the checkbox that matches the target week name
            await checkbox.check();
            // Log that the checkbox matching the target week name was checked
            console.log("Checked checkbox with label: " + label);
            // Assert that the checkbox is checked
            await expect(checkbox).toBeChecked();
        }   
    }
 });