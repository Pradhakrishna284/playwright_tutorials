import {test, expect, FrameLocator} from '@playwright/test'

//Iframe definition:- An inline frame is used to embed another document within the current 
// HTML document. The <iframe> HTML element is used to create an inline frame.

test.describe('Guide - Iframe or Inline Frame', () => {

   // Navigate to the guide page before each test 
  test.beforeEach(async ({page}) => {
    await page.goto('https://ui.vision/demo/webtest/frames/');

    //Get the no. of frames on the page
    const framesCount: number = page.frames().length
    console.log(`Total number of frames on the page: ${framesCount}`);
    const frames = page.frames();
    //console.log(frames.map(f => f.url()));    
  })

  //Approach 1 - Interact with elements inside an iframe using frame object
  test('Interact with elements inside an iframe', async ({ page }) => {
    const frame1 = page.frame({url:"https://ui.vision/demo/webtest/frames/frame_1.html"});
    //await frame1?.fill("input[name='mytext1']", "Frame 1 Text");

    if (frame1) {
        await frame1.locator("input[name='mytext1']").fill("Frame 1 Text");   
        //await frame1.fill("input[name='mytext1']", "Frame 1 Text");     
        await frame1.waitForTimeout(3000);
    }
    else {
        console.log("Frame not found!");
    }
  })

    //Approach 2 - Interact with elements inside an iframe using frame locator
    test('Interact with elements inside an iframe - Approach 2', async ({ page }) => {
        const frameLocator1: FrameLocator = page.frameLocator("frame[src='frame_3.html']");
        await frameLocator1.locator("input[name='mytext3']").fill("Frame 3 Text - Approach 2");
        await page.waitForTimeout(10000);
    })

    //Inner frames - Interact with elements inside nested iframes
    test('Interact with elements inside nested iframes', async ({ page }) => {
        const outerFrameLocator: FrameLocator = page.frameLocator("frame[src='frame_3.html']");
        const innerFrameLocator: FrameLocator = outerFrameLocator.frameLocator("iframe[src='https://docs.google.com/forms/d/1yfUq-GO9BEssafd6TvHhf0D6QLDVG3q5InwNE2FFFFQ/viewform?embedded=true']");
        await innerFrameLocator.locator("input[jsname='YPqjbf']").fill("Inner Frame Text");
        await page.waitForTimeout(10000);
    })

    //Get child frames of a frame
    test('Get child frames of a frame', async ({ page }) => {
        const outerFrame = page.frame({url:"https://ui.vision/demo/webtest/frames/frame_3.html"});
        if (outerFrame) {
            const childFrames = outerFrame.childFrames();
            console.log(`Total number of child frames: ${childFrames.length}`);
            for (const [index, frame] of childFrames.entries()) {
                console.log(`Child Frame ${index + 1}, URL: ${frame.url()}`);
            }

            const radioButton = childFrames[0].getByLabel("I am a human");
            await radioButton.check();
            await page.waitForTimeout(5000);
        }
    })

})