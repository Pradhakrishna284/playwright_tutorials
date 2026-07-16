import {test, expect} from "@playwright/test";

//By default, alerts are auto-handled by Playwright. ie. they are closed automatically.
//If you want to handle them manually, you can use the 'page.on("dialog")' event listener.
//We have write event listener before the action that triggers the dialog.
// We can use this to log the dialog message and accept or dismiss it as needed.

//In this example, we will click a button that triggers an alert dialog and handle it manually.
//We will also add a wait time of 10 seconds after clicking the button to observe the behavior.

test('Guide Dialog Test', async ({page}) => {
    // Navigate to the application page
    await page.goto('https://testautomationpractice.blogspot.com/')

    // Set up a listener for dialog events
    page.on('dialog', async dialog =>{
        console.log(`Dialog message: ${dialog.message()}`);
        console.log(`Type of dialog: ${dialog.type()}`);
        expect(dialog.type()).toBe('alert');
        // Adding wait time to observe the dialog before accepting
        await page.waitForTimeout(3000)
        await dialog.accept();
    })

    // Click Simple Alert
    await page.locator('#alertBtn').click();
    console.log("Alert Button Clicked");
})

test.only('Confirmation alert', async ({page}) => {
    // Navigate to the application page
    await page.goto('https://testautomationpractice.blogspot.com/')

    // Set up a listener for dialog events
    page.on('dialog', async dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        console.log(`Type of dialog: ${dialog.type()}`);

        // Assertions
        expect(dialog.type()).toBe('confirm');
        expect(dialog.message()).toContain('Press a button!');

        // Adding wait time to observe the dialog before accepting
        await page.waitForTimeout(3000)

        //Click OK
        await dialog.accept();
    })

    // Click Confirm Alert
    await page.locator('#confirmBtn').click();
    console.log("Confirmation dialog accepted");
})

test.only('Confirmation alert - Dismiss', async ({page}) => {
    // Navigate to the application page
    await page.goto('https://testautomationpractice.blogspot.com/')

    // Set up a listener for dialog events
    page.on('dialog', async dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        console.log(`Type of dialog: ${dialog.type()}`);

        // Assertions
        expect(dialog.type()).toBe('confirm');
        expect(dialog.message()).toContain('Press a button!');

        // Adding wait time to observe the dialog before accepting
        await page.waitForTimeout(3000)

        //Click Cancel
        await dialog.dismiss();
    })

    // Click Confirm Alert
    await page.locator('#confirmBtn').click();
    console.log("Confirmation dialog dismissed");
    // Assertions after dismissing
    await expect(page.locator('#demo')).toHaveText('You pressed Cancel!');
    const demoText: string | null = await page.locator('#demo').textContent();
    console.log(`Demo text after dismissing: ${demoText}`);
    expect(demoText).toBe('You pressed Cancel!');
})

test.only('Prompt alert', async ({page}) => {
    // Navigate to the application page
    await page.goto('https://testautomationpractice.blogspot.com/')

    // Set up a listener for dialog events
    page.on('dialog', async dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        console.log(`Type of dialog: ${dialog.type()}`);
        expect(dialog.type()).toBe('prompt');
        const defaultValue = dialog.defaultValue();
        console.log(`Default value in prompt: ${defaultValue}`);
        expect(defaultValue).toBe('Harry Potter');

        // Adding wait time to observe the dialog before accepting
        await page.waitForTimeout(3000)
        // Provide input text to the prompt
        const inputText = 'Playwright Test';
        await dialog.accept(inputText);
    })

    //Click Prompt Alert
    await page.locator('#promptBtn').click();
    console.log("Prompt dialog accepted");
    // Assertions after accepting
    await expect(page.locator('#demo')).toHaveText('Hello Playwright Test! How are you today?');
    const demoPromptTest: string | null = await page.locator('#demo').innerText();
    console.log(`Demo text after prompt: ${demoPromptTest}`);
    expect(demoPromptTest).toContain('Playwright Test');
    expect(demoPromptTest).toBe('Hello Playwright Test! How are you today?');
})