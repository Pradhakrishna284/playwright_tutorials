//https://www.youtube.com/watch?v=ewzubWfyyZc&list=PLUDwpEzHYYLtvMVjc-Va3RXLKtdB-ofc2&index=9

import {test, expect, Locator} from '@playwright/test';

test('Comparing text retrieval methods', async ({page}) => {
    //Navigate to demo webshop site
    await page.goto('https://demowebshop.tricentis.com/');
    //Get group of elements
    const productTitles: Locator = page.locator('.product-title');
    const countOfProducts: number = await productTitles.count();
    console.log('Total product titles found:', countOfProducts);

    //innerText() vs textContent()

    //Compare innerText() and textContent() for the first product title
    //Method 1: Using nth() to get text of the first product title

    // innerText() - Returns the visible text content of an element
    // - Only includes visible text (respects CSS display, visibility)
    // - Strips whitespace and normalizes text
    // - Better for user-visible content
    // - returns only string
    const firstProduct  = await productTitles.nth(0).innerText();
    console.log('First product title using innerText():', firstProduct);

    // textContent() - Returns all text content including hidden text
    // - Includes text from elements with display:none or visibility:hidden
    // - Preserves whitespace and line breaks
    // - Returns raw DOM text content, not just visible text
    // - returns string | null
    const firstProductTextContent = await productTitles.nth(0).textContent();
    console.log('First product title using textContent():', firstProductTextContent);

    //Print both results using traditional for loop
    for (let i=0; i<countOfProducts; i++) {
        const titleInnerText: string = await productTitles.nth(i).innerText();
        console.log(titleInnerText);
    }

    for(let i=0; i<countOfProducts; i++) {
        const titleTextContent: string | null = await productTitles.nth(i).textContent();
        console.log(titleTextContent);
    }

    console.log('After trimming the textContent results:');
    for(let i=0; i<countOfProducts; i++) {
        const titleTextContent: string | null = await productTitles.nth(i).textContent();
        console.log(titleTextContent ? titleTextContent.trim() : titleTextContent);
    }


    //Method 2: Using first() to get text of the first product title
    const firstTitleFirst = await productTitles.first().innerText();
    console.log('First product title using first():', firstTitleFirst);

    //Method 3: Using locator with index to get text of the first product title
    const firstTitleIndex = await page.locator('.product-title').locator('nth=0').innerText();
    console.log('First product title using locator with index:', firstTitleIndex);
    //Assertions to verify all methods return the same text
    // expect(firstTitleNth).toBe(firstTitleFirst);
    // expect(firstTitleNth).toBe(firstTitleIndex);

    //Method 4: Using allTextContents() to get texts of all product titles   

    //allinnerText() vs allTextContents()

    // allinnerText() - Returns an array of visible text contents of all matched elements
    // - Only includes visible text (respects CSS display, visibility)
    // - Strips whitespace and normalizes text
    // - Better for user-visible content
    const allInnerTextsProducts: string[] = await productTitles.allInnerTexts();    
    console.log('All product titles using allInnerTexts():', allInnerTextsProducts);

    const allTitles: string[] = await productTitles.allTextContents();
    console.log('All product titles using allTextContents():', allTitles);

    //all() methods return array of strings, so we can directly compare them
    const allProducts: Locator[] = await productTitles.all();
    //Prints the locators of all products
    console.log('All product titles using all():', allProducts);
    for (const product of allProducts) {
        const title = await product.innerText();
        console.log(title);
    }    
});