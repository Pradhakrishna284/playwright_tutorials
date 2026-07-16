import { test, expect, Page } from '@playwright/test';

/**
 * Complete Guide: Working with iFrames in Playwright
 * 
 * This file demonstrates all aspects of iFrame handling in Playwright:
 * - Basic iFrame access
 * - Nested iFrames
 * - Waiting strategies
 * - Event handling in iFrames
 * - Best practices
 */

test.describe('iFrame Fundamentals', () => {
  
  test('access simple iframe using frameLocator', async ({ page }) => {
    // Navigate to page with iframe
    await page.goto('https://www.w3schools.com/html/html_iframe.asp');
    
    // Method 1: Using frameLocator with tag selector
    // This is the recommended approach - simpler syntax
    const iframeLocator = page.frameLocator('iframe');
    
    // Verify iframe is present
    const iframeCount = await page.locator('iframe').count();
    expect(iframeCount).toBeGreaterThan(0);
    
    // You can chain locators just like in parent page
    const buttons = await iframeLocator.locator('button').count();
    console.log(`Found ${buttons} buttons in iframe`);
  });

  test('access iframe by specific selector (ID)', async ({ page }) => {
    // Many real-world pages have specifically named iframes
    await page.goto('https://www.w3schools.com/html/html_iframe.asp');
    
    // Using ID selector (more specific)
    const iframeById = page.frameLocator('iframe#myFrame');
    
    // Or using attribute selector
    const iframeByAttr = page.frameLocator('iframe[id="myFrame"]');
    
    // Both approaches work - attribute selector is more flexible
    console.log('Both selectors reference the same iframe');
  });

  test('access iframe by name attribute', async ({ page }) => {
    // Many iframes have name attributes
    await page.goto('https://www.w3schools.com/html/html_iframe.asp');
    
    const iframeByName = page.frameLocator('iframe[name="myFrame"]');
    
    // This is useful when HTML uses name attribute for targeting
    // <iframe name="myFrame" src="..."></iframe>
  });

  test('access iframe by src attribute', async ({ page }) => {
    await page.goto('https://www.w3schools.com/html/html_iframe.asp');
    
    // Exact match
    const iframeExact = page.frameLocator('iframe[src="default.html"]');
    
    // Partial match (contains) - very useful!
    const iframeContains = page.frameLocator('iframe[src*="default"]');
    
    // Starts with
    const iframeStartsWith = page.frameLocator('iframe[src^="http"]');
    
    // Ends with
    const iframeEndsWith = page.frameLocator('iframe[src$=".html"]');
    
    // Partial match is most flexible for dynamic URLs
    console.log('Using contains selector is most reliable');
  });

  test('get iframe by class attribute', async ({ page }) => {
    await page.goto('https://www.w3schools.com/html/html_iframe.asp');
    
    // By single class
    const iframeByClass = page.frameLocator('iframe.embed-frame');
    
    // By multiple classes
    const iframeByMultiple = page.frameLocator('iframe.embed-frame.content');
    
    // Class is less reliable but can be useful for styling purposes
  });
});

test.describe('Accessing Elements Inside iFrames', () => {
  
  test('interact with element inside iframe', async ({ page }) => {
    // Setup: Create a test page with iframe
    await page.setContent(`
      <h1>Parent Page</h1>
      <iframe srcdoc="
        <h2>Content in iFrame</h2>
        <input id='textInput' type='text' placeholder='Enter text'>
        <button id='submitBtn'>Submit</button>
        <p id='result'>Result will appear here</p>
      " style="width: 100%; height: 300px;"></iframe>
    `);
    
    const iframe = page.frameLocator('iframe');
    
    // Interact with input inside iframe
    await iframe.locator('#textInput').fill('Hello iFrame!');
    
    // Verify input value
    const inputValue = await iframe.locator('#textInput').inputValue();
    expect(inputValue).toBe('Hello iFrame!');
    
    // Click button inside iframe
    await iframe.locator('#submitBtn').click();
  });

  test('get text content from iframe', async ({ page }) => {
    await page.setContent(`
      <iframe srcdoc="
        <h1>Title in iFrame</h1>
        <p class='message'>This is a message inside the iframe</p>
      " style="width: 100%; height: 200px;"></iframe>
    `);
    
    const iframe = page.frameLocator('iframe');
    
    // Get text from heading
    const heading = await iframe.locator('h1').textContent();
    expect(heading).toBe('Title in iFrame');
    
    // Get text from paragraph
    const message = await iframe.locator('p.message').textContent();
    expect(message).toContain('message inside the iframe');
    
    // Get inner HTML
    const html = await iframe.locator('p').innerHTML();
    console.log('Inner HTML:', html);
  });

  test('fill form fields in iframe', async ({ page }) => {
    await page.setContent(`
      <iframe srcdoc="
        <form>
          <input name='firstName' placeholder='First Name'>
          <input name='lastName' placeholder='Last Name'>
          <input name='email' type='email' placeholder='Email'>
          <textarea name='message' placeholder='Message'></textarea>
          <button type='submit'>Submit</button>
        </form>
      " style="width: 100%; height: 400px;"></iframe>
    `);
    
    const iframe = page.frameLocator('iframe');
    
    // Fill multiple fields
    await iframe.locator('input[name="firstName"]').fill('John');
    await iframe.locator('input[name="lastName"]').fill('Doe');
    await iframe.locator('input[name="email"]').fill('john@example.com');
    await iframe.locator('textarea[name="message"]').fill('This is a test message');
    
    // Verify all fields
    expect(await iframe.locator('input[name="firstName"]').inputValue()).toBe('John');
    expect(await iframe.locator('input[name="lastName"]').inputValue()).toBe('Doe');
    expect(await iframe.locator('input[name="email"]').inputValue()).toBe('john@example.com');
  });

  test('count elements inside iframe', async ({ page }) => {
    await page.setContent(`
      <iframe srcdoc="
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
          <li>Item 4</li>
        </ul>
      " style="width: 100%; height: 200px;"></iframe>
    `);
    
    const iframe = page.frameLocator('iframe');
    
    // Count elements
    const itemCount = await iframe.locator('li').count();
    expect(itemCount).toBe(4);
    
    // Get each item
    for (let i = 0; i < itemCount; i++) {
      const text = await iframe.locator('li').nth(i).textContent();
      console.log(`Item ${i + 1}: ${text}`);
    }
  });

  test('wait for element to be visible in iframe', async ({ page }) => {
    await page.setContent(`
      <iframe srcdoc="
        <style>
          #delayed { display: none; }
        </style>
        <button onclick=\"setTimeout(() => {
          document.getElementById('delayed').style.display = 'block';
        }, 1000)\">Click me</button>
        <p id='delayed'>This appears after click</p>
      " style="width: 100%; height: 200px;"></iframe>
    `);
    
    const iframe = page.frameLocator('iframe');
    
    // Click button
    await iframe.locator('button').click();
    
    // Wait for element to become visible
    await iframe.locator('#delayed').waitFor({ 
      state: 'visible',
      timeout: 5000 
    });
    
    // Verify it's visible
    const isVisible = await iframe.locator('#delayed').isVisible();
    expect(isVisible).toBe(true);
    
    const text = await iframe.locator('#delayed').textContent();
    expect(text).toBe('This appears after click');
  });
});

test.describe('Working with Multiple iFrames', () => {
  
  test('access multiple iframes on same page', async ({ page }) => {
    await page.setContent(`
      <h1>Page with Multiple iFrames</h1>
      
      <div>
        <h2>Frame 1</h2>
        <iframe id='frame1' srcdoc="
          <h3>iFrame 1 Content</h3>
          <button id='btn1'>Button 1</button>
        " style="width: 100%; height: 150px;"></iframe>
      </div>
      
      <div>
        <h2>Frame 2</h2>
        <iframe id='frame2' srcdoc="
          <h3>iFrame 2 Content</h3>
          <button id='btn2'>Button 2</button>
        " style="width: 100%; height: 150px;"></iframe>
      </div>
    `);
    
    // Access first iframe by ID
    const frame1 = page.frameLocator('iframe#frame1');
    expect(await frame1.locator('h3').textContent()).toBe('iFrame 1 Content');
    
    // Access second iframe by ID
    const frame2 = page.frameLocator('iframe#frame2');
    expect(await frame2.locator('h3').textContent()).toBe('iFrame 2 Content');
    
    // Verify button IDs are unique within each frame
    await frame1.locator('#btn1').click();
    await frame2.locator('#btn2').click();
  });

  test('use nth() selector for multiple identical iframes', async ({ page }) => {
    await page.setContent(`
      <iframe srcdoc="<p>Frame 0</p>" style="width: 100%; height: 100px;"></iframe>
      <iframe srcdoc="<p>Frame 1</p>" style="width: 100%; height: 100px;"></iframe>
      <iframe srcdoc="<p>Frame 2</p>" style="width: 100%; height: 100px;"></iframe>
    `);
    
    // Access by index using nth()
    const frame0 = page.frameLocator('iframe').nth(0);
    const frame1 = page.frameLocator('iframe').nth(1);
    const frame2 = page.frameLocator('iframe').nth(2);
    
    expect(await frame0.locator('p').textContent()).toBe('Frame 0');
    expect(await frame1.locator('p').textContent()).toBe('Frame 1');
    expect(await frame2.locator('p').textContent()).toBe('Frame 2');
  });

  test('iterate through all iframes on page', async ({ page }) => {
    await page.setContent(`
      <iframe srcdoc="<p>First</p>" style="width: 100%; height: 100px;"></iframe>
      <iframe srcdoc="<p>Second</p>" style="width: 100%; height: 100px;"></iframe>
      <iframe srcdoc="<p>Third</p>" style="width: 100%; height: 100px;"></iframe>
    `);
    
    // Get all iframe elements
    const iframeCount = await page.locator('iframe').count();
    console.log(`Total iframes: ${iframeCount}`);
    
    // Iterate through each iframe
    for (let i = 0; i < iframeCount; i++) {
      const iframe = page.frameLocator('iframe').nth(i);
      const text = await iframe.locator('p').textContent();
      console.log(`iFrame ${i}: ${text}`);
    }
  });
});

test.describe('Nested iFrames', () => {
  
  test('access nested iframes (iframe within iframe)', async ({ page }) => {
    await page.setContent(`
      <iframe srcdoc="
        <h2>Outer iFrame</h2>
        <iframe srcdoc='
          <h3>Inner iFrame</h3>
          <p>Nested content</p>
        ' style=\"width: 100%; height: 150px;\"></iframe>
      " style="width: 100%; height: 300px;"></iframe>
    `);
    
    // Access outer iframe first
    const outerFrame = page.frameLocator('iframe');
    expect(await outerFrame.locator('h2').textContent()).toBe('Outer iFrame');
    
    // Then access nested iframe within the outer frame
    const innerFrame = outerFrame.frameLocator('iframe');
    expect(await innerFrame.locator('h3').textContent()).toBe('Inner iFrame');
    
    // Finally access content in inner frame
    const content = await innerFrame.locator('p').textContent();
    expect(content).toBe('Nested content');
  });

  test('chain frameLocator calls for deep nesting', async ({ page }) => {
    await page.setContent(`
      <iframe srcdoc="
        <iframe srcdoc='
          <iframe srcdoc=\"<h4>Level 3</h4>\" style=\"width: 100%; height: 100px;\"></iframe>
        ' style=\"width: 100%; height: 200px;\"></iframe>
      " style="width: 100%; height: 300px;"></iframe>
    `);
    
    // Chain frameLocator for multiple levels
    const level3Content = await page
      .frameLocator('iframe')
      .frameLocator('iframe')
      .frameLocator('iframe')
      .locator('h4')
      .textContent();
    
    expect(level3Content).toBe('Level 3');
  });
});

test.describe('iFrame Visibility and Waiting', () => {
  
  test('wait for iframe to be attached to DOM', async ({ page }) => {
    await page.setContent(`
      <h1>Page Content</h1>
      <div id='container'></div>
    `);
    
    // Dynamically add iframe after delay
    await page.evaluate(() => {
      setTimeout(() => {
        const iframe = document.createElement('iframe');
        iframe.srcdoc = '<p>Dynamic iFrame</p>';
        document.getElementById('container').appendChild(iframe);
      }, 500);
    });
    
    // Wait for iframe to be attached
    await page.waitForSelector('iframe', { timeout: 5000 });
    
    // Now access it
    const iframe = page.frameLocator('iframe');
    const text = await iframe.locator('p').textContent();
    expect(text).toBe('Dynamic iFrame');
  });

  test('wait for content inside iframe to load', async ({ page }) => {
    await page.setContent(`
      <iframe srcdoc="
        <div id='loader' style='display: block;'>Loading...</div>
        <div id='content' style='display: none;'>
          <h2>Loaded Content</h2>
        </div>
      " style="width: 100%; height: 200px;"></iframe>
    `);
    
    const iframe = page.frameLocator('iframe');
    
    // Initially loader is visible
    const loaderVisible = await iframe.locator('#loader').isVisible();
    expect(loaderVisible).toBe(true);
    
    // Simulate loading by updating iframe
    await iframe.locator('html').evaluate(() => {
      const loader = document.getElementById('loader');
      const content = document.getElementById('content');
      if (loader) loader.style.display = 'none';
      if (content) content.style.display = 'block';
    });
    
    // Wait for loader to hide
    await iframe.locator('#loader').waitFor({ 
      state: 'hidden',
      timeout: 5000 
    });
    
    // Wait for content to be visible
    await iframe.locator('#content').waitFor({ 
      state: 'visible',
      timeout: 5000 
    });
    
    // Verify content is loaded
    const heading = await iframe.locator('h2').textContent();
    expect(heading).toBe('Loaded Content');
  });

  test('handle iframe that might not exist', async ({ page }) => {
    await page.setContent('<h1>Page without iframe</h1>');
    
    // Check if iframe exists before accessing
    const iframeCount = await page.locator('iframe').count();
    
    if (iframeCount > 0) {
      const iframe = page.frameLocator('iframe');
      // Access iframe content
    } else {
      console.log('No iframe found on page');
    }
    
    expect(iframeCount).toBe(0);
  });
});

test.describe('iFrame Events and Interactions', () => {
  
  test('handle click events inside iframe', async ({ page }) => {
    await page.setContent(`
      <iframe srcdoc="
        <button id='btn'>Click Counter</button>
        <p id='count'>Clicks: 0</p>
        <script>
          let count = 0;
          document.getElementById('btn').addEventListener('click', () => {
            count++;
            document.getElementById('count').textContent = 'Clicks: ' + count;
          });
        </script>
      " style="width: 100%; height: 200px;"></iframe>
    `);
    
    const iframe = page.frameLocator('iframe');
    
    // Initial count
    let countText = await iframe.locator('#count').textContent();
    expect(countText).toBe('Clicks: 0');
    
    // Click button multiple times
    await iframe.locator('#btn').click();
    countText = await iframe.locator('#count').textContent();
    expect(countText).toBe('Clicks: 1');
    
    await iframe.locator('#btn').click();
    countText = await iframe.locator('#count').textContent();
    expect(countText).toBe('Clicks: 2');
  });

  test('handle keyboard input in iframe', async ({ page }) => {
    await page.setContent(`
      <iframe srcdoc="
        <input id='textInput' type='text'>
        <p id='display'></p>
        <script>
          document.getElementById('textInput').addEventListener('input', (e) => {
            document.getElementById('display').textContent = e.target.value.toUpperCase();
          });
        </script>
      " style="width: 100%; height: 200px;"></iframe>
    `);
    
    const iframe = page.frameLocator('iframe');
    const input = iframe.locator('#textInput');
    
    // Type and verify display updates
    await input.type('hello');
    
    const displayText = await iframe.locator('#display').textContent();
    expect(displayText).toBe('HELLO');
  });

  test('select radio buttons and checkboxes in iframe', async ({ page }) => {
    await page.setContent(`
      <iframe srcdoc="
        <label>
          <input type='radio' name='option' value='opt1'> Option 1
        </label>
        <label>
          <input type='radio' name='option' value='opt2'> Option 2
        </label>
        <label>
          <input type='checkbox' id='agree'> I agree
        </label>
      " style="width: 100%; height: 200px;"></iframe>
    `);
    
    const iframe = page.frameLocator('iframe');
    
    // Select radio button
    await iframe.locator('input[value="opt1"]').check();
    const opt1Checked = await iframe.locator('input[value="opt1"]').isChecked();
    expect(opt1Checked).toBe(true);
    
    // Change to other radio button
    await iframe.locator('input[value="opt2"]').check();
    const opt2Checked = await iframe.locator('input[value="opt2"]').isChecked();
    expect(opt2Checked).toBe(true);
    
    // Check checkbox
    await iframe.locator('#agree').check();
    const agreeChecked = await iframe.locator('#agree').isChecked();
    expect(agreeChecked).toBe(true);
  });

  test('select dropdown options in iframe', async ({ page }) => {
    await page.setContent(`
      <iframe srcdoc="
        <select id='dropdown'>
          <option value=''>Select...</option>
          <option value='apple'>Apple</option>
          <option value='banana'>Banana</option>
          <option value='orange'>Orange</option>
        </select>
        <p id='selected'></p>
      " style="width: 100%; height: 200px;"></iframe>
    `);
    
    const iframe = page.frameLocator('iframe');
    
    // Select by value
    await iframe.locator('#dropdown').selectOption('apple');
    
    // Verify selection
    const selected = await iframe.locator('#dropdown').inputValue();
    expect(selected).toBe('apple');
    
    // Select by label
    await iframe.locator('#dropdown').selectOption({ label: 'Banana' });
    const selectedBanana = await iframe.locator('#dropdown').inputValue();
    expect(selectedBanana).toBe('banana');
  });
});

test.describe('iFrame Best Practices and Common Patterns', () => {
  
  test('specific selector pattern for iframe targeting', async ({ page }) => {
    await page.setContent(`
      <iframe id='main-content' srcdoc="<p>Main Content</p>" style="width: 100%; height: 150px;"></iframe>
      <iframe id='sidebar' srcdoc="<p>Sidebar</p>" style="width: 100%; height: 150px;"></iframe>
    `);
    
    // ✅ GOOD: Use specific ID selectors
    const mainFrame = page.frameLocator('iframe#main-content');
    expect(await mainFrame.locator('p').textContent()).toBe('Main Content');
    
    const sidebarFrame = page.frameLocator('iframe#sidebar');
    expect(await sidebarFrame.locator('p').textContent()).toBe('Sidebar');
    
    // ✅ GOOD: Use attribute selectors for dynamic content
    const dynamicFrame = page.frameLocator('iframe[data-type="dynamic"]');
  });

  test('error handling with iframe timeout', async ({ page }) => {
    await page.setContent('<h1>No iframe here</h1>');
    
    try {
      // This will timeout if iframe doesn't exist
      await page.frameLocator('iframe').locator('button').click({ timeout: 1000 });
    } catch (error) {
      console.log('iframe interaction failed:', error.message);
      expect(error.message).toContain('Timeout');
    }
  });

  test('take screenshot including iframe content', async ({ page }) => {
    await page.setContent(`
      <h1>Main Page</h1>
      <iframe srcdoc="<h2>iFrame Content</h2><p>Screenshot test</p>" style="width: 100%; height: 200px;"></iframe>
    `);
    
    // Screenshot captures both parent and iframe content
    // Note: In test environment, full rendering may vary by browser
    const iframeElement = page.locator('iframe').first();
    const box = await iframeElement.boundingBox();
    
    console.log('iFrame bounding box:', box);
    expect(box).toBeTruthy();
    expect(box?.width).toBeGreaterThan(0);
    expect(box?.height).toBeGreaterThan(0);
  });

  test('reuse iframe locator for multiple operations', async ({ page }) => {
    await page.setContent(`
      <iframe srcdoc="
        <input id='field1'>
        <input id='field2'>
        <input id='field3'>
        <button id='submit'>Submit</button>
      " style="width: 100%; height: 250px;"></iframe>
    `);
    
    // Store iframe locator in variable for reuse
    const iframe = page.frameLocator('iframe');
    
    // Use the same iframe locator for multiple operations
    await iframe.locator('#field1').fill('Value 1');
    await iframe.locator('#field2').fill('Value 2');
    await iframe.locator('#field3').fill('Value 3');
    
    // Verify all fields
    expect(await iframe.locator('#field1').inputValue()).toBe('Value 1');
    expect(await iframe.locator('#field2').inputValue()).toBe('Value 2');
    expect(await iframe.locator('#field3').inputValue()).toBe('Value 3');
    
    // Submit form
    await iframe.locator('#submit').click();
  });
});

test.describe('Advanced iFrame Scenarios', () => {
  
  test('iframe with dynamically changing src', async ({ page }) => {
    await page.setContent(`
      <button id='changeFrame'>Change Frame Source</button>
      <iframe id='dynamic' srcdoc="<p>Initial Content</p>" style="width: 100%; height: 200px;"></iframe>
      <script>
        document.getElementById('changeFrame').addEventListener('click', () => {
          const iframe = document.getElementById('dynamic');
          iframe.srcdoc = '<p>Updated Content</p>';
        });
      </script>
    `);
    
    const iframe = page.frameLocator('iframe#dynamic');
    
    // Check initial content
    let content = await iframe.locator('p').textContent();
    expect(content).toBe('Initial Content');
    
    // Click button to change iframe source
    await page.locator('#changeFrame').click();
    
    // Wait a bit for iframe to update
    await page.waitForTimeout(500);
    
    // Check updated content
    content = await iframe.locator('p').textContent();
    expect(content).toBe('Updated Content');
  });

  test('capture data from iframe back to parent', async ({ page }) => {
    await page.setContent(`
      <h1>Parent Page</h1>
      <button id='getData'>Get Data from iframe</button>
      <p id='result'></p>
      
      <iframe srcdoc="
        <input id='iframeInput' value='Data from iframe'>
        <button id='sendData'>Send Data</button>
        <script>
          document.getElementById('sendData').addEventListener('click', () => {
            const data = document.getElementById('iframeInput').value;
            window.parent.postMessage(data, '*');
          });
        </script>
      " style="width: 100%; height: 200px;"></iframe>
    `);
    
    // Set up message listener
    const messagePromise = page.waitForEvent('framenavigated');
    
    // Alternative: Get data directly from iframe
    const iframe = page.frameLocator('iframe');
    const iframeData = await iframe.locator('#iframeInput').inputValue();
    
    // Display in parent
    await page.locator('#result').textContent();
    expect(iframeData).toBe('Data from iframe');
  });

  test('verify iframe security attributes', async ({ page }) => {
    await page.setContent(`
      <iframe 
        id='secure' 
        src="about:blank"
        sandbox="allow-scripts allow-same-origin"
        allow="geolocation; microphone"
      ></iframe>
    `);
    
    const iframeElement = page.locator('iframe#secure');
    
    // Verify iframe attributes
    const sandbox = await iframeElement.getAttribute('sandbox');
    expect(sandbox).toContain('allow-scripts');
    expect(sandbox).toContain('allow-same-origin');
    
    const allow = await iframeElement.getAttribute('allow');
    expect(allow).toContain('geolocation');
    expect(allow).toContain('microphone');
  });
});

/**
 * Common Patterns Summary:
 * 
 * 1. ACCESS iFrame CONTENT:
 *    page.frameLocator('iframe#id').locator('selector')
 * 
 * 2. WAIT FOR iFrame:
 *    await page.waitForSelector('iframe')
 *    await page.frameLocator('iframe').locator('element').waitFor()
 * 
 * 3. NESTED iFrames:
 *    page.frameLocator('iframe').frameLocator('iframe')
 * 
 * 4. MULTIPLE iFrames:
 *    page.frameLocator('iframe').nth(0)
 *    page.frameLocator('iframe#specific')
 * 
 * 5. INTERACTION:
 *    Fill, click, select, type same as parent page
 *    await iframe.locator(sel).fill(val)
 *    await iframe.locator(sel).click()
 * 
 * 6. ASSERTIONS:
 *    expect(await iframe.locator(sel).textContent()).toMatch(pattern)
 *    expect(await iframe.locator(sel).isVisible()).toBe(true)
 */
