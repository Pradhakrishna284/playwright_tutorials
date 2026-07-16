# Playwright with TypeScript — Complete Notes Series
*Based on playwright.dev official docs + community YouTube tutorials (Playwright Test, end-to-end automation)*

---

## How to Use This Document
Each **Part** = one topic. Every Part has: Notes → Example Code → Flow Diagram (where useful) → Sample Sites to Practice → Interview Q&A. Part 0 covers the big-picture architecture first so everything after makes sense.

---

# PART 0 — How Playwright Works (Core Architecture)

### Notes
Playwright is a Node.js library (also available in Python/Java/.NET) for browser automation and end-to-end testing. Unlike Selenium, which talks to browsers through the WebDriver protocol (HTTP, request/response, one command at a time), Playwright talks to browsers through their own **native automation protocols** (CDP for Chromium, custom patched protocols for WebKit and Firefox) over a **single persistent WebSocket connection**.

Key architectural facts:
- Playwright **does not use WebDriver**. It launches a browser process, patches it, and connects via the browser's debugging protocol.
- Communication is **bidirectional and async** — Playwright sends a command, browser sends events back; no need to poll.
- **Auto-waiting** is built into every action — Playwright waits for the element to be attached, visible, stable, enabled, and receiving events before acting (no manual `sleep()`).
- **Browser, BrowserContext, Page** is the object hierarchy:
  - `Browser` = one launched browser instance (Chromium/Firefox/WebKit)
  - `BrowserContext` = an isolated "incognito-like" session (cookies, storage, cache) — you can have many per Browser
  - `Page` = one tab inside a context
- Playwright ships its own bundled browser binaries (Chromium, Firefox, WebKit) so behavior is consistent across machines/CI — no driver version mismatch issues.

### Flow Diagram — Overall Architecture

![Playwright architecture: Test script to Browser to BrowserContext to Page to Auto-wait engine](diagrams/architecture.svg)

The test script talks to the Browser process over a WebSocket using the browser's native protocol (CDP for Chromium). The Browser spawns isolated BrowserContexts, each context spawns Pages, and every locator action on a Page passes through the auto-wait engine before touching the real DOM.

### Flow Diagram — A Single Test Run, Step by Step (example: login test)

![Step by step flow of a login test from config load to context teardown](diagrams/test-run-flow.svg)

### Sample Sites to Practice
- https://playwright.dev (docs)
- https://demo.playwright.dev/todomvc (official Playwright demo app)
- https://the-internet.herokuapp.com (classic automation practice site, many widgets)

### Interview Q&A
**Q1: How is Playwright different from Selenium architecturally?**
A: Selenium communicates with browsers via the WebDriver protocol — a synchronous, HTTP request/response model that requires a separate driver executable per browser. Playwright connects directly to the browser via its native debugging protocol (CDP for Chromium, equivalent patched protocols for Firefox/WebKit) over one persistent WebSocket, allowing asynchronous, event-driven communication, built-in auto-waiting, and no driver-version-mismatch problems.

**Q2: What is the relationship between Browser, BrowserContext, and Page?**
A: A `Browser` is one running browser process. A `BrowserContext` is an isolated session within that browser (like an incognito window) with its own cookies/storage — multiple contexts can run in parallel from one browser for test isolation. A `Page` is a single tab within a context; a context can hold multiple pages.

**Q3: Why doesn't Playwright need explicit waits like `sleep(5000)`?**
A: Every Playwright action automatically performs "actionability checks" (element attached to DOM, visible, stable — not animating, enabled, receives pointer/keyboard events) before performing the action, retrying internally until the timeout. This removes most flaky-wait code.

**Q4: Why does Playwright bundle its own browser binaries instead of using the system-installed browser?**
A: To guarantee consistent, reproducible behavior across developer machines and CI regardless of locally installed browser versions, and because Chromium/Firefox/WebKit are patched slightly to expose better automation hooks.

---

# PART 1 — Installation & Project Setup

### Notes
Install via the official scaffolding command, which sets up TypeScript by default, browsers, a config file, and example test.

```bash
npm init playwright@latest
```
Prompts: TypeScript or JavaScript (TS is default/recommended), test folder name (`tests` or `e2e`), GitHub Actions workflow, install browsers.

**What gets installed:**
```
playwright.config.ts     # central config: browsers, timeouts, retries, reporters
package.json
tests/
  example.spec.ts
```

Run tests:
```bash
npx playwright test                 # run all, headless, parallel across all configured browsers
npx playwright test --headed        # see the browser
npx playwright test --project=chromium
npx playwright test tests/example.spec.ts
npx playwright test --ui            # interactive UI Mode
npx playwright show-report          # open HTML report
```

Update:
```bash
npm install -D @playwright/test@latest
npx playwright install --with-deps
```

System requirements: Node.js 22.x/24.x/26.x; Windows 11+/macOS 14+/Ubuntu 22.04+.

### Example: minimal test
```ts
import { test, expect } from '@playwright/test';

test('homepage has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});
```

### Sample Sites to Practice
- https://playwright.dev
- https://demo.playwright.dev/todomvc

### Interview Q&A
**Q1: What does `npm init playwright@latest` actually configure?**
A: It creates `playwright.config.ts`, installs `@playwright/test` and browser binaries, scaffolds a `tests/` folder with a sample spec, and optionally a GitHub Actions CI workflow.

**Q2: How do you run only one browser/project instead of all three?**
A: `npx playwright test --project=chromium` (project names come from `playwright.config.ts`).

**Q3: How do you update Playwright and its browsers safely?**
A: `npm install -D @playwright/test@latest` then `npx playwright install --with-deps` to fetch matching browser binaries and OS dependencies.

---

# PART 2 — Writing Tests: Test/Expect, Locators, Web-First Assertions

### Notes
A Playwright test file uses `test()` from `@playwright/test`, with a `page` fixture injected automatically. Tests are isolated — each gets a fresh `BrowserContext`.

**Locators** are the recommended way to find elements. A locator describes *how* to find an element at the time an action is performed — it is lazily evaluated and auto-retries, unlike `ElementHandle` (legacy, eagerly resolved, not recommended).

Common locator strategies (in priority order recommended by Playwright):
```ts
page.getByRole('button', { name: 'Submit' });
page.getByText('Welcome');
page.getByLabel('Password');
page.getByPlaceholder('Search...');
page.getByAltText('logo');
page.getByTitle('Close');
page.getByTestId('submit-btn');     // data-testid attribute
page.locator('css=button.primary'); // CSS selector
page.locator('text=Login');         // text selector
page.locator('xpath=//button');     // XPath (fallback only)
```
`getByRole` is preferred because it matches how users/assistive tech perceive the page (accessibility tree) and is resilient to DOM/CSS changes.

**Web-first assertions** (`expect`) auto-retry until the condition is met or timeout expires — no manual polling needed.
```ts
await expect(page.getByText('Welcome')).toBeVisible();
await expect(page).toHaveURL(/dashboard/);
await expect(locator).toHaveText('Submit');
await expect(locator).toHaveCount(3);
```

### Example
```ts
import { test, expect } from '@playwright/test';

test('search flow', async ({ page }) => {
  await page.goto('https://duckduckgo.com');
  await page.getByRole('searchbox').fill('Playwright testing');
  await page.getByRole('searchbox').press('Enter');
  await expect(page).toHaveTitle(/Playwright testing/);
});
```

### Flow Diagram — Locator Resolution Lifecycle
```
locator = page.getByRole('button', {name:'Submit'})    [no DOM query yet]
        │
        ▼ (action called, e.g. .click())
Playwright re-queries DOM at action time
        │
        ▼
Element found? ── No ──► retry until timeout ──► throw TimeoutError
        │ Yes
        ▼
Run actionability checks (visible/stable/enabled)
        │
        ▼
Execute click via CDP
```

### Sample Sites to Practice
- https://demo.playwright.dev/todomvc
- https://the-internet.herokuapp.com/login
- https://www.saucedemo.com (login + e-commerce flows)

### Interview Q&A
**Q1: Why are Locators preferred over ElementHandle?**
A: `ElementHandle` resolves to a specific DOM node at creation time, which can go stale if the DOM re-renders. A `Locator` re-resolves the element fresh every time an action/assertion runs on it, making tests resilient to dynamic DOM changes and SPA re-renders.

**Q2: What is the difference between `getByRole` and `locator('css=...')`?**
A: `getByRole` queries the accessibility tree (role + accessible name), reflecting how users and screen readers perceive the element — recommended as the most robust and accessible-aware strategy. CSS/XPath selectors are implementation-detail-coupled and break more easily when markup changes.

**Q3: How do web-first assertions reduce flakiness compared to plain Node `assert`?**
A: They poll/retry internally (re-check the condition) until it becomes true or the timeout elapses, instead of failing on the very first check — eliminating most race-condition-based flaky failures from asynchronous UI updates.

**Q4: How would you select the 3rd item in a list?**
A: `page.getByRole('listitem').nth(2)` (zero-indexed), or `.first()` / `.last()` for edges.

---

# PART 3 — Generating Tests (Codegen)

### Notes
Playwright can record your browser interactions and auto-generate TypeScript test code.
```bash
npx playwright codegen https://example.com
```
Opens a browser + Playwright Inspector. Actions you perform (clicks, fills, navigation) are converted live into locator-based code you can copy into a spec file. Also useful to **pick best locator** for any element via the "Explore" / element-picker mode.

You can also launch codegen from VS Code extension, or record into an existing file with `--target=javascript|python|csharp` and `--output=file.ts`.

### Example
```bash
npx playwright codegen --output=tests/generated.spec.ts https://www.saucedemo.com
```

### Flow Diagram
```
npx playwright codegen <url>
   │
   ▼
Browser launches + Inspector panel opens
   │
   ▼
User performs actions (click/fill/navigate) in browser
   │
   ▼
Codegen listens to DOM events → picks best Locator for target element
   │
   ▼
Generates equivalent Playwright TS code live in Inspector panel
   │
   ▼
Copy/paste into spec file, refine assertions manually
```

### Sample Sites to Practice
- https://www.saucedemo.com
- https://demo.playwright.dev/todomvc
- https://opensource-demo.orangehrmlive.com (OrangeHRM demo, login + forms)

### Interview Q&A
**Q1: Should generated codegen scripts be used as-is in production test suites?**
A: No — codegen is a starting point. It captures literal actions but lacks assertions, good waits, reusable Page Object structure, and meaningful test data; engineers should refactor it (add assertions, parameterize, extract POM) before treating it as a real test.

**Q2: How does codegen choose which locator to use for an element?**
A: It applies the same priority Playwright recommends for users — role/label/text/test-id first, falling back to CSS only if no semantic locator is unique/stable.

---

# PART 4 — Running & Debugging Tests

### Notes
Run modes:
```bash
npx playwright test                  # headless, parallel
npx playwright test --headed         # visible browser
npx playwright test --debug          # opens Playwright Inspector, step through
npx playwright test -g "login"       # run tests matching title
npx playwright test --workers=4      # parallel worker count
```
Debugging tools:
- **Playwright Inspector** (`--debug` or `PWDEBUG=1`): step-by-step execution, locator picker, live console.
- **VS Code extension**: run/debug individual tests from the gutter, set breakpoints.
- `page.pause()` inside a test pauses execution and opens Inspector at that point.

### Example
```ts
test('debug example', async ({ page }) => {
  await page.goto('https://example.com');
  await page.pause();           // execution stops here, Inspector opens
  await page.getByRole('link').click();
});
```

### Flow Diagram — Debug Session
```
npx playwright test --debug
   │
   ▼
Test starts, browser launches (headed)
   │
   ▼
Execution pauses at first action / page.pause()
   │
   ▼
Inspector shows: Locator picker | Step Over | Resume | Console
   │
   ▼
Developer inspects DOM, tries locators live
   │
   ▼
Resume → next action runs → repeat until test ends
```

### Sample Sites to Practice
- https://the-internet.herokuapp.com (has flaky/dynamic elements great for debugging)
- https://demoqa.com (rich widget set: forms, alerts, frames)

### Interview Q&A
**Q1: What's the difference between `--headed` and `--debug`?**
A: `--headed` just shows the browser window while running at normal/fast speed. `--debug` additionally opens the Playwright Inspector and pauses before each action, letting you step through and try locators live.

**Q2: How do you pause a test mid-execution to inspect the page manually?**
A: Insert `await page.pause()` at the desired point in the test.

---

# PART 5 — Actions (User Interactions)

### Notes
Common actions, all auto-waited:
```ts
await page.getByRole('textbox').fill('text');     // clears + types instantly
await page.getByRole('textbox').type('text');     // key-by-key (legacy, rarely needed)
await page.getByRole('button').click();
await page.getByRole('button').dblclick();
await page.getByRole('checkbox').check();
await page.getByRole('checkbox').uncheck();
await page.getByLabel('Country').selectOption('India');
await page.getByRole('slider').dragTo(target);
await page.keyboard.press('Enter');
await page.mouse.move(100, 200);
await page.getByText('Item').hover();
await page.locator('input[type=file]').setInputFiles('path/to/file.pdf');
await page.getByRole('combobox').focus();
```
Force an action (bypass actionability checks — use cautiously): `.click({ force: true })`.

### Example
```ts
test('fill a form', async ({ page }) => {
  await page.goto('https://demoqa.com/automation-practice-form');
  await page.getByPlaceholder('First Name').fill('John');
  await page.getByPlaceholder('Last Name').fill('Doe');
  await page.getByLabel('Male').check();
  await page.getByRole('button', { name: 'Submit' }).click();
});
```

### Sample Sites to Practice
- https://demoqa.com/automation-practice-form
- https://the-internet.herokuapp.com/drag_and_drop
- https://the-internet.herokuapp.com/hovers

### Interview Q&A
**Q1: Difference between `.fill()` and `.type()`?**
A: `.fill()` sets the input value directly (fast, sufficient for most forms). `.type()` dispatches individual `keydown`/`keypress`/`keyup` events per character — needed when the page has JS listening to per-keystroke events (e.g., autocomplete-as-you-type).

**Q2: When would you use `{ force: true }` on a click, and what's the risk?**
A: When you intentionally need to click an element Playwright considers non-actionable (e.g., covered by an overlay in a known-safe way). Risk: it bypasses the real-world guarantee that a user could actually perform that click, potentially masking a genuine UI bug.

**Q3: How do you upload a file with Playwright?**
A: `await page.locator('input[type=file]').setInputFiles('/path/to/file')` — no OS file-dialog automation needed.

---

# PART 6 — Auto-Waiting / Actionability

### Notes
Before most actions, Playwright waits for these actionability checks (in order):
1. **Attached** — element is in the DOM
2. **Visible** — has non-empty bounding box, no `visibility:hidden`
3. **Stable** — not in the middle of an animation/transition
4. **Receives Events** — not obscured by another element on top
5. **Enabled** — not `disabled`
6. (For typing) **Editable**

If checks aren't satisfied within the timeout (default 30s for actions, configurable), Playwright throws a `TimeoutError` with a clear log of which check failed.

You can inspect actionability logs with `DEBUG=pw:api` env var or via trace viewer.

### Flow Diagram

![Auto-wait actionability checks: attached, visible, stable, receives events, enabled, then click runs](diagrams/autowait.svg)

### Sample Sites to Practice
- https://the-internet.herokuapp.com/dynamic_loading
- https://demoqa.com/dynamic-properties (buttons that enable after delay)

### Interview Q&A
**Q1: What happens if an element is visible but covered by a transparent overlay?**
A: The "receives events" actionability check fails (since the real click target would actually hit the overlay), so Playwright keeps retrying/waiting until the overlay is gone or the timeout expires, then throws a `TimeoutError`.

**Q2: Can you disable auto-waiting?**
A: Not directly disable, but you can bypass specific checks with `{ force: true }`, or use lower-level APIs — generally discouraged since it reintroduces flakiness.

---

# PART 7 — Page Object Model (POM)

### Notes
POM organizes locators and page-specific actions into reusable classes, separating test logic from UI structure — reduces duplication and centralizes maintenance when the UI changes.

```ts
// pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly username: Locator;
  readonly password: Locator;
  readonly loginBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.username = page.getByPlaceholder('Username');
    this.password = page.getByPlaceholder('Password');
    this.loginBtn = page.getByRole('button', { name: 'Login' });
  }

  async goto() {
    await this.page.goto('https://www.saucedemo.com');
  }

  async login(user: string, pass: string) {
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.loginBtn.click();
  }
}
```
```ts
// tests/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('valid login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
  await expect(page).toHaveURL(/inventory/);
});
```

### Flow Diagram

![Test calls a fixture which uses LoginPage POM methods to log in, then the test asserts the outcome](diagrams/pom-fixture.svg)

### Sample Sites to Practice
- https://www.saucedemo.com
- https://opensource-demo.orangehrmlive.com

### Interview Q&A
**Q1: Why use Page Object Model instead of writing locators directly in every test?**
A: It centralizes element locators and page-level actions in one class; when the UI changes, you update one file instead of every test that touches that page, reducing maintenance cost and duplication.

**Q2: Should assertions live inside Page Object methods?**
A: Generally no — POM methods should perform actions/return data; assertions belong in the test file so test intent is clear and one POM method isn't tied to one specific expected outcome.

---

# PART 8 — Fixtures

### Notes
Fixtures are Playwright Test's dependency-injection mechanism. Built-in fixtures: `page`, `context`, `browser`, `browserName`, `request`. You can define **custom fixtures** to set up/tear down reusable state (e.g., logged-in page, test data, API client).

```ts
// fixtures.ts
import { test as base } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

type MyFixtures = { loggedInPage: import('@playwright/test').Page };

export const test = base.extend<MyFixtures>({
  loggedInPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await use(page);          // hand control to the test
    // teardown code (if any) runs here after test
  },
});
```
```ts
import { test } from '../fixtures';
import { expect } from '@playwright/test';

test('see inventory', async ({ loggedInPage }) => {
  await expect(loggedInPage.getByText('Products')).toBeVisible();
});
```
Fixtures can be scoped `test` (per test) or `worker` (shared per worker process, e.g., a single DB connection).

### Flow Diagram

![Test requests a fixture, fixture setup runs and hands control via use(page), test body executes, teardown runs after](diagrams/pom-fixture.svg)

### Sample Sites to Practice
- https://www.saucedemo.com (good for "logged-in fixture" pattern)

### Interview Q&A
**Q1: What problem do fixtures solve that `beforeEach` hooks don't as cleanly?**
A: Fixtures are composable and dependency-injected — a test only "pulls in" the fixtures it actually needs, fixtures can depend on other fixtures, and Playwright automatically figures out setup/teardown order; `beforeEach` runs unconditionally for every test in a file regardless of need, and can't be selectively composed.

**Q2: What's the difference between `test`-scoped and `worker`-scoped fixtures?**
A: A `test`-scoped fixture is created fresh for every individual test. A `worker`-scoped fixture is created once per worker process and reused across all tests that run in that worker — useful for expensive setup like a single browser instance or DB connection.

---

# PART 9 — Hooks & Annotations

### Notes
```ts
test.beforeAll(async () => { /* once before all tests in file */ });
test.afterAll(async () => { /* once after all tests in file */ });
test.beforeEach(async ({ page }) => { /* before every test */ });
test.afterEach(async ({ page }) => { /* after every test */ });

test.describe('Login suite', () => {
  test('case 1', async ({ page }) => { ... });
});

test.skip('not ready yet', async () => {});
test.fixme('broken, needs fix', async () => {});
test.only('run just this one', async () => {});   // remove before commit!
test('flaky one', async () => { ... });
test.slow();          // triples timeout for this test
```
Annotations like `test.skip(condition, reason)` can be conditional (e.g., skip on a specific browser).

### Example
```ts
test.describe('Cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
  });

  test('add item to cart', async ({ page }) => {
    await page.getByText('Sauce Labs Backpack').click();
  });

  test.skip(({ browserName }) => browserName === 'webkit', 'Not supported on WebKit yet');
  test('webkit-incompatible feature', async ({ page }) => { ... });
});
```

### Sample Sites to Practice
- https://www.saucedemo.com

### Interview Q&A
**Q1: What's the execution order of hooks for a single test?**
A: `beforeAll` (once) → `beforeEach` → the test itself → `afterEach` → `afterAll` (once), with nested `describe` blocks running outer hooks before inner ones.

**Q2: How do you mark a test as a known failing bug without deleting it?**
A: `test.fixme()` — Playwright skips it but flags it clearly as "needs fixing," distinct from `test.skip()` which implies intentional exclusion.

---

# PART 10 — Test Configuration (`playwright.config.ts`)

### Notes
Central place for global settings:
```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 2,
  workers: 4,
  reporter: [['html'], ['list']],
  use: {
    baseURL: 'https://www.saucedemo.com',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 7'] } },
  ],
});
```
With `baseURL` set, tests can call `await page.goto('/login')` instead of full URLs.

### Sample Sites to Practice
- https://www.saucedemo.com
- https://demoqa.com

### Interview Q&A
**Q1: What does the `projects` array let you do?**
A: Define multiple named configurations (different browsers, devices, viewport sizes, or even different `testDir`/auth states) that all run from one `npx playwright test` invocation, each producing isolated results.

**Q2: What's the benefit of setting `trace: 'on-first-retry'` instead of `'on'`?**
A: It only captures the (heavier) trace when a test fails and is retried, saving CPU/storage on tests that pass on the first attempt while still giving full debugging detail for failures.

---

# PART 11 — Browser Contexts & Isolation

### Notes
Each Playwright Test automatically gets a brand-new `BrowserContext` — equivalent to a fresh incognito profile: no shared cookies, localStorage, or cache between tests. This is what guarantees tests can run in parallel safely without interfering with each other.

You can also manually create multiple contexts in one test (e.g., to simulate two different logged-in users at once):
```ts
test('two users chat', async ({ browser }) => {
  const userA = await browser.newContext();
  const userB = await browser.newContext();
  const pageA = await userA.newPage();
  const pageB = await userB.newPage();
  // simulate independent sessions
  await userA.close();
  await userB.close();
});
```

### Flow Diagram
```
Browser (one process)
   ├── BrowserContext #1 (User A session) ── Page(s)
   ├── BrowserContext #2 (User B session) ── Page(s)
   └── BrowserContext #3 (anonymous)      ── Page(s)

Each context: separate cookies, localStorage, cache, permissions.
Closing a context does NOT close the Browser; closing Browser closes all contexts.
```

### Sample Sites to Practice
- https://www.saucedemo.com (great for simulating 2 different logged-in users)

### Interview Q&A
**Q1: How does Playwright achieve test isolation without restarting the browser for every test?**
A: By creating a new lightweight `BrowserContext` per test instead of relaunching the whole `Browser` process — contexts are cheap to create/destroy and have zero shared state, unlike full browser restarts which are slow.

**Q2: How would you test a multi-user real-time feature like chat?**
A: Open two separate `BrowserContext`s (and `Page`s) within the same test, each representing an independent user session, and assert that actions in one page reflect in the other.

---

# PART 12 — Network: Interception, Mocking, Waiting on Requests

### Notes
```ts
// Wait for a specific response
const respPromise = page.waitForResponse(resp => resp.url().includes('/api/users') && resp.status() === 200);
await page.getByRole('button', { name: 'Load' }).click();
const response = await respPromise;

// Mock an API response entirely
await page.route('**/api/users', route => {
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([{ id: 1, name: 'Mock User' }]),
  });
});

// Modify a request before it's sent
await page.route('**/api/data', route => {
  const headers = route.request().headers();
  headers['x-test'] = 'true';
  route.continue({ headers });
});

// Block resources (images) for speed
await page.route('**/*.{png,jpg,jpeg}', route => route.abort());
```

### Flow Diagram

![Request is intercepted, then routed to fulfill with a mock, continue with modification, or abort entirely](diagrams/network-route.svg)

### Sample Sites to Practice
- https://demoqa.com (real API calls under the hood for forms/buttons)
- https://jsonplaceholder.typicode.com (use as a mock target/reference API)
- https://www.saucedemo.com

### Interview Q&A
**Q1: What's the difference between `route.fulfill()` and `route.continue()`?**
A: `fulfill()` short-circuits the request entirely and returns a custom response without it ever reaching the real server — used for full mocking. `continue()` lets the request actually go to the network but allows you to first modify its headers/method/postData — used for partial interception.

**Q2: How would you test how the UI handles a slow or failing API without controlling the backend?**
A: Use `page.route()` to intercept the relevant endpoint and either delay fulfillment (`await new Promise(r => setTimeout(r, 3000))` before `route.fulfill()`) or return an error status (`route.fulfill({status:500})`) / `route.abort()` to simulate network failure.

**Q3: How do you wait for a network call without intercepting/mocking it?**
A: `await page.waitForResponse(urlOrPredicate)` (or `waitForRequest`) alongside triggering the action — captures the real response for assertions on payload/status.

---

# PART 13 — API Testing (without a browser UI)

### Notes
Playwright includes a standalone HTTP client (`request` fixture / `APIRequestContext`) for pure backend API testing, sharing the same assertion library.
```ts
import { test, expect } from '@playwright/test';

test('GET users API', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/users/1');
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.name).toBeTruthy();
});

test('POST create post', async ({ request }) => {
  const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
    data: { title: 'foo', body: 'bar', userId: 1 },
  });
  expect(response.status()).toBe(201);
});
```
Useful pattern: use API requests to **set up test data/state** (faster than UI) before driving the actual UI test.

### Sample Sites to Practice
- https://jsonplaceholder.typicode.com
- https://reqres.in
- https://www.saucedemo.com (combine API setup + UI verification, conceptually)

### Interview Q&A
**Q1: Why combine API calls with UI tests instead of doing everything through the UI?**
A: API calls are far faster and more stable than navigating the UI; using them to set up preconditions (e.g., creating a user, seeding data) shortens test run time and isolates the UI test from unrelated setup steps that aren't the actual feature under test.

**Q2: Does the `request` fixture share cookies/auth with the `page` fixture?**
A: When both come from the same `BrowserContext` (i.e., you call `context.request` rather than the standalone top-level fixture), yes — they share cookie storage, which is useful for hybrid UI+API auth flows.

---

# PART 14 — Authentication (Reusing Login State)

### Notes
Logging in via UI for every single test is slow. Playwright lets you authenticate once and reuse storage state.
```ts
// auth.setup.ts
import { test as setup } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.context().storageState({ path: 'playwright/.auth/user.json' });
});
```
```ts
// playwright.config.ts (relevant section)
projects: [
  { name: 'setup', testMatch: /auth\.setup\.ts/ },
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
    dependencies: ['setup'],
  },
],
```
Now every test in the `chromium` project starts already logged in — no repeated UI login.

### Flow Diagram

![Setup project logs in once, saves storage state to user.json, dependent project loads it so tests start already authenticated](diagrams/auth-reuse.svg)

### Sample Sites to Practice
- https://www.saucedemo.com
- https://opensource-demo.orangehrmlive.com

### Interview Q&A
**Q1: What is `storageState` and what does it persist?**
A: A JSON snapshot of cookies and localStorage/sessionStorage for a browser context, which can be saved to disk and reloaded into new contexts so they start in an already-authenticated state.

**Q2: Why use a `setup` project/dependency rather than logging in inside `beforeEach`?**
A: Logging in once via a dedicated setup project and reusing the saved state across all dependent tests avoids repeating the (slow, UI-based) login flow before every single test, dramatically reducing total run time.

---

# PART 15 — Handles & Evaluating JavaScript

### Notes
```ts
// Run JS in page context, return serializable value
const title = await page.evaluate(() => document.title);

// Pass arguments into evaluate
const sum = await page.evaluate(([a, b]) => a + b, [2, 3]);

// ElementHandle (legacy — generally prefer Locator.evaluate)
const handle = await page.$('h1');
const text = await handle?.evaluate(el => el.textContent);

// Locator.evaluate — recommended, auto-waits for element first
const text2 = await page.getByRole('heading').evaluate(el => el.textContent);
```

### Sample Sites to Practice
- https://playwright.dev
- https://demoqa.com

### Interview Q&A
**Q1: When would you reach for `page.evaluate()` instead of a built-in Playwright API?**
A: When you need browser-side computation Playwright doesn't expose directly — e.g., reading a non-standard DOM property, calling a page's own JS function, or checking computed CSS values not covered by assertions.

**Q2: Why is `Locator.evaluate()` safer than `ElementHandle.evaluate()`?**
A: `Locator.evaluate()` re-resolves and waits for the element right before evaluating, while a stored `ElementHandle` can become stale if the DOM re-renders between when it was captured and when it's used.

---

# PART 16 — Frames, Popups, New Tabs, Dialogs

### Notes
**Frames (iframes):**
```ts
const frame = page.frameLocator('iframe[name="myframe"]');
await frame.getByRole('button', { name: 'Submit' }).click();
```
**New tab/popup:**
```ts
const [newPage] = await Promise.all([
  context.waitForEvent('page'),
  page.getByRole('link', { name: 'Open in new tab' }).click(),
]);
await newPage.waitForLoadState();
```
**Native dialogs (alert/confirm/prompt):**
```ts
page.on('dialog', dialog => dialog.accept());      // or dialog.dismiss()
await page.getByRole('button', { name: 'Trigger Alert' }).click();
```

### Flow Diagram — Handling a Popup Window
```
Test clicks link with target="_blank"
   │
   ▼
context.waitForEvent('page') registered BEFORE the click (important!)
   │
   ▼
Browser opens new tab → event fires → newPage handle captured
   │
   ▼
await newPage.waitForLoadState() ensures it's ready
   │
   ▼
Interact with newPage like any other Page object
```

### Sample Sites to Practice
- https://the-internet.herokuapp.com/iframe
- https://the-internet.herokuapp.com/javascript_alerts
- https://the-internet.herokuapp.com/windows

### Interview Q&A
**Q1: Why must `waitForEvent('page')` be set up before clicking the link that opens a new tab, rather than after?**
A: Event listeners must be registered before the event fires; if you click first and then try to wait for the event, the `page` event has likely already fired and been missed, causing the promise to hang/timeout.

**Q2: How do you handle a native JavaScript `confirm()` dialog automatically?**
A: Register `page.on('dialog', dialog => dialog.accept())` (or `.dismiss()`) before triggering the action that opens the dialog — Playwright auto-dismisses dialogs by default if no handler is registered, so an explicit handler is needed to control accept/dismiss/inputs.

**Q3: How do you interact with elements inside an iframe?**
A: Use `page.frameLocator(selector)` to scope into the frame, then chain normal locator methods on it — Playwright auto-waits for the frame to be present too.

---

# PART 17 — Screenshots, Videos, and Tracing

### Notes
```ts
// Screenshot
await page.screenshot({ path: 'screenshot.png', fullPage: true });
await page.getByRole('button').screenshot({ path: 'button.png' }); // element only

// Video & trace are usually configured globally (see Part 10), but can be forced:
```
```ts
use: {
  video: 'on',              // 'off' | 'on' | 'retain-on-failure' | 'on-first-retry'
  trace: 'on',               // captures DOM snapshots, network, console per action
}
```
**Trace Viewer:**
```bash
npx playwright show-trace trace.zip
```
Opens an interactive timeline: every action, DOM snapshot before/after, console logs, network requests, and screenshots — extremely powerful for debugging CI failures without reproducing locally.

### Flow Diagram — Trace Capture & Review
```
Test runs with trace:'on' (or 'on-first-retry')
   │
   ▼
Every action recorded: DOM snapshot, console, network, screenshots
   │
   ▼
Saved as trace.zip in test-results/
   │
   ▼
npx playwright show-trace trace.zip
   │
   ▼
Interactive UI: timeline scrubber + DOM snapshot viewer + network + console panels
   │
   ▼
Pinpoint exact failing action without re-running test
```

### Sample Sites to Practice
- https://www.saucedemo.com (run a failing test on purpose and inspect its trace)

### Interview Q&A
**Q1: What's the practical benefit of Trace Viewer over just reading console logs/screenshots?**
A: It gives a full step-by-step timeline with DOM snapshots before/after each action, network activity, and console output all correlated together, letting you fully reconstruct and debug a CI failure without needing to reproduce it locally.

**Q2: What's the tradeoff of setting `trace: 'on'` for every run vs `'on-first-retry'`?**
A: `'on'` gives maximum debuggability but adds overhead/storage cost for every single run, even passing ones. `'on-first-retry'` only pays that cost when a test actually fails and is retried, which is the common recommended default for CI.

---

# PART 18 — Visual Comparisons (Screenshot Testing)

### Notes
```ts
await expect(page).toHaveScreenshot('homepage.png');
await expect(page.getByRole('img')).toHaveScreenshot('logo.png');
```
First run generates the baseline image; subsequent runs pixel-diff against it. Update baselines intentionally with:
```bash
npx playwright test --update-snapshots
```
Config options: `maxDiffPixels`, `threshold` (allowed perceptual diff), per-OS baselines (since rendering differs slightly across OS/browser).

### Sample Sites to Practice
- https://playwright.dev
- https://www.saucedemo.com

### Interview Q&A
**Q1: Why might visual regression tests be flaky across different machines, and how do you mitigate it?**
A: Font rendering, anti-aliasing, and GPU rendering differ subtly by OS/browser version, causing pixel-level diffs even with no real UI change. Mitigate via a `threshold`/`maxDiffPixels` tolerance, running visual tests only in a consistent environment (e.g., Linux Docker container in CI), and masking dynamic regions (timestamps, ads) with the `mask` option.

**Q2: How do you intentionally accept a new UI design as the new baseline?**
A: Run `npx playwright test --update-snapshots` after reviewing the diff, which overwrites the stored baseline images.

---

# PART 19 — Mocking Browser APIs & Clock

### Notes
```ts
// Mock geolocation
await context.grantPermissions(['geolocation']);
await context.setGeolocation({ latitude: 51.5, longitude: -0.13 });

// Control the clock (for time-dependent UI, e.g. "expires in 5 min")
await page.clock.install({ time: new Date('2024-01-01T00:00:00') });
await page.clock.fastForward('01:00:00');

// Mock browser permissions
await context.grantPermissions(['notifications']);
```

### Sample Sites to Practice
- https://demoqa.com
- https://the-internet.herokuapp.com/geolocation

### Interview Q&A
**Q1: Why is mocking the system clock useful in E2E tests?**
A: It lets you deterministically test time-dependent behavior (session expiry, countdown timers, "today's date" rendering) without actually waiting real wall-clock time or producing flaky date-based assertions.

**Q2: How would you test a feature that requires geolocation without a real GPS?**
A: Grant the `geolocation` permission on the context and set a fake coordinate via `context.setGeolocation()`, then verify the app behaves as if the user were at that location.

---

# PART 20 — Downloads

### Notes
```ts
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.getByRole('link', { name: 'Download file' }).click(),
]);
const path = await download.path();
console.log(await download.suggestedFilename());
await download.saveAs('/tmp/myfile.pdf');
```

### Sample Sites to Practice
- https://the-internet.herokuapp.com/download

### Interview Q&A
**Q1: How does Playwright handle file downloads, since browsers normally show a native save dialog?**
A: Playwright auto-accepts downloads (no native OS dialog appears in automation) and exposes a `Download` object via the `'download'` event, giving programmatic access to the file path, suggested filename, and a `saveAs()` method.

---

# PART 21 — Accessibility Testing

### Notes
Playwright integrates with `axe-core` (via `@axe-core/playwright`) for automated a11y checks, and supports **ARIA snapshots** for asserting accessible structure.
```bash
npm install -D @axe-core/playwright
```
```ts
import AxeBuilder from '@axe-core/playwright';

test('a11y scan', async ({ page }) => {
  await page.goto('https://example.com');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```
ARIA snapshot:
```ts
await expect(page.locator('nav')).toMatchAriaSnapshot(`
  - navigation:
    - link "Home"
    - link "About"
`);
```

### Sample Sites to Practice
- https://www.w3.org/WAI/demos/bad/
- https://demoqa.com

### Interview Q&A
**Q1: Can Playwright alone certify a page as fully accessible?**
A: No — automated tools like axe-core (integrated via `@axe-core/playwright`) catch a meaningful subset of programmatically detectable issues (missing alt text, contrast, ARIA misuse) but cannot evaluate subjective/contextual usability; manual review and assistive-tech testing are still required for full accessibility compliance.

---

# PART 22 — Component Testing (Experimental)

### Notes
Playwright can test UI components (React/Vue/Svelte) in isolation, mounting them in a real browser without a full app/server.
```ts
import { test, expect } from '@playwright/experimental-ct-react';
import Button from './Button';

test('button click', async ({ mount }) => {
  const component = await mount(<Button title="Submit" />);
  await component.click();
  await expect(component).toHaveText('Submit');
});
```

### Interview Q&A
**Q1: How does component testing differ from full E2E testing?**
A: Component testing mounts a single UI component in isolation inside a real browser (faster, focused on that component's behavior/props), whereas E2E testing drives the full running application end-to-end through real pages and backend integration.

---

# PART 23 — Test Parallelism, Sharding & Retries

### Notes
```ts
// playwright.config.ts
export default defineConfig({
  fullyParallel: true,
  workers: process.env.CI ? 2 : undefined,   // undefined = auto (CPU cores/2)
  retries: process.env.CI ? 2 : 0,
});
```
Sharding splits the suite across multiple CI machines:
```bash
npx playwright test --shard=1/3
npx playwright test --shard=2/3
npx playwright test --shard=3/3
```
Within a file, tests run in parallel by default if `fullyParallel: true`; otherwise tests in the same file run serially but different files run in parallel workers.

### Flow Diagram
```
Full Suite (e.g. 300 tests)
        │
   ┌────┴────┬────────────┐
 shard 1/3  shard 2/3   shard 3/3      ← 3 separate CI machines
   (100)      (100)        (100)
   │            │             │
 workers=2   workers=2     workers=2    ← parallel processes per machine
```

### Interview Q&A
**Q1: What's the difference between `workers` and `--shard`?**
A: `workers` controls parallel processes *within a single machine/CI job*. `--shard` splits the entire test suite across *multiple separate machines/CI jobs*, each running its own subset with its own `workers`. They compose together for large-scale parallelism.

**Q2: Why set retries only in CI and not locally?**
A: Locally, a failing test should be investigated immediately, so retries would mask real bugs during development. In CI, infrastructure-level flakiness (network blips, resource contention) is more common, so a couple of retries reduce false-negative pipeline failures while still surfacing genuinely broken tests after retries exhaust.

---

# PART 24 — Reporters

### Notes
Built-in reporters: `list`, `dot`, `line`, `html`, `json`, `junit`. Configure multiple at once:
```ts
reporter: [
  ['html', { open: 'never' }],
  ['junit', { outputFile: 'results.xml' }],
],
```
`html` reporter gives a browsable dashboard (`npx playwright show-report`); `junit` is for CI dashboards like Jenkins; `json` for custom processing.

### Interview Q&A
**Q1: Why would a CI pipeline use the `junit` reporter alongside `html`?**
A: Many CI platforms (Jenkins, Azure DevOps, GitLab) natively parse JUnit XML to display pass/fail trends and integrate with their own test dashboards, while the `html` report remains the rich, human-browsable artifact for deep debugging.

---

# PART 25 — CI Integration

### Notes
Typical GitHub Actions workflow (auto-generated by `npm init playwright@latest`):
```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22' }
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with: { name: playwright-report, path: playwright-report/ }
```
Key practices: cache `node_modules` & browser binaries, upload the HTML report/traces as build artifacts on failure, run with `--shard` for large suites across multiple jobs.

### Interview Q&A
**Q1: Why is `npx playwright install --with-deps` required in CI even though `npm ci` already installed `@playwright/test`?**
A: `npm ci` only installs the npm package; the actual browser binaries (and Linux OS-level dependencies) must be downloaded separately via `playwright install`, since they aren't part of the npm package itself.

**Q2: Why upload the HTML report/trace as a CI artifact "if: always()"?**
A: So that even when the job fails, the report (including traces/screenshots/videos of failures) is preserved and downloadable for debugging — without `if: always()`, artifact upload steps are skipped on failure by default in most CI systems.

---

# PART 26 — Mobile & Device Emulation

### Notes
```ts
import { devices } from '@playwright/test';

projects: [
  { name: 'Mobile Chrome', use: { ...devices['Pixel 7'] } },
  { name: 'Mobile Safari', use: { ...devices['iPhone 14'] } },
],
```
Or manually per-context:
```ts
const context = await browser.newContext({
  ...devices['iPhone 14'],
  geolocation: { latitude: 41.89, longitude: 12.49 },
  permissions: ['geolocation'],
});
```
Emulates viewport, user agent, touch events, device scale factor — not a real device, but close UI/responsive approximation. For Android/iOS *real* device/browser automation, Playwright also has experimental native mobile support.

### Interview Q&A
**Q1: Is Playwright's mobile emulation the same as testing on a real device?**
A: No — it emulates viewport size, user agent string, touch capability and device scale factor within the same desktop browser engine; it's good for responsive-layout and touch-interaction testing but won't catch real device-specific OS/browser engine bugs (e.g., actual mobile Safari quirks) the way physical-device or cloud device-farm testing would.

---

# PART 27 — Best Practices Summary

### Notes
- Prefer user-facing locators (`getByRole`, `getByLabel`, `getByText`) over CSS/XPath.
- Avoid manual `waitForTimeout()`; rely on auto-waiting + web-first assertions.
- Keep tests independent/isolated — don't depend on execution order.
- Use `test.step()` to organize long tests into named, reportable steps.
- Reuse authentication state instead of logging in every test.
- Use Page Object Model for medium/large suites.
- Run tests against a stable, seeded test environment when possible; mock unstable third-party dependencies.
- Keep CI fast: parallelize, shard, cache browsers.
- Use Trace Viewer for any CI-only failure before trying to "guess" the cause.

### Interview Q&A
**Q1: Name three concrete anti-patterns to avoid in Playwright test suites.**
A: (1) Hardcoded `waitForTimeout()` sleeps instead of trusting auto-wait/assertions; (2) chaining tests so test B depends on state left by test A (breaks parallelism/isolation); (3) using brittle CSS/XPath selectors tied to implementation details instead of accessible, role-based locators.

**Q2: What is `test.step()` used for?**
A: Wrapping a logical group of actions inside a named step (`await test.step('Login', async () => {...})`) so the HTML report/trace shows a clear, collapsible breakdown of what the test did, improving readability of long tests and failure reports.

---

# Additional Notes from Community TypeScript Video Tutorials
(Cross-referenced against well-known Playwright+TypeScript YouTube series, including the provided playlist and other widely recommended channels such as freeCodeCamp's full Playwright course, LambdaTest, and ExecuteAutomation.)

- Many tutorial series start with **VS Code + Playwright extension** setup, showing the green "run/debug" arrows next to each `test()` block — faster iteration than the CLI for individual tests.
- A common teaching pattern: build a small **framework from scratch** across a video series — config → first test → locators → POM → fixtures → CI — mirroring the Part 0–25 structure above.
- Tutorials emphasize **`test.step()`** and **custom fixtures** as the dividing line between "scripts" and a "maintainable framework."
- Several series demonstrate combining **Playwright + Cucumber (BDD)** for Gherkin-style specs, and **Playwright + Allure Reporter** for richer dashboards than the built-in HTML reporter — worth exploring once the fundamentals above are solid.
- A recurring tip across tutorials: use `npx playwright test --last-failed` to re-run only previously failed tests while iterating on a fix.

---

# Master List — Practice/Demo Websites for Real-Time Practice

| Site | Best For |
|---|---|
| https://demo.playwright.dev/todomvc | Locators, basic actions, official demo |
| https://www.saucedemo.com | Login, POM, fixtures, auth/storageState, e-commerce flow |
| https://the-internet.herokuapp.com | Alerts, frames, drag-drop, dynamic loading, file upload/download, hovers |
| https://demoqa.com | Forms, widgets, dynamic properties, alerts, frames, date pickers |
| https://opensource-demo.orangehrmlive.com | Realistic enterprise app login/forms/navigation |
| https://jsonplaceholder.typicode.com | API testing / mocking reference backend |
| https://reqres.in | API testing practice |
| https://www.w3.org/WAI/demos/bad/ | Accessibility testing (intentionally bad examples) |
| https://playwright.dev | Reference docs + simple smoke test target |

---

# End-to-End Mini Project Idea (ties everything together)
Build a small framework against **saucedemo.com**:
1. `playwright.config.ts` with 3 browser projects + baseURL.
2. `auth.setup.ts` saving `storageState`.
3. `pages/LoginPage.ts`, `pages/InventoryPage.ts`, `pages/CartPage.ts` (POM).
4. `fixtures.ts` exposing a `loggedInPage` fixture.
5. Tests: login (positive/negative), add-to-cart, checkout flow, API-seeded data via `request` fixture.
6. Mock one API call with `page.route()` to simulate an error state.
7. Add `trace:'on-first-retry'`, HTML + JUnit reporters.
8. Wire into a GitHub Actions workflow with sharding across 2 jobs.

This single project naturally exercises Parts 1–25 above.
