# Playwright Reporters Guide: Built-in and Allure Reporters

## Table of Contents
1. [Overview](#overview)
2. [Built-in Reporters](#built-in-reporters)
3. [Allure Reporter](#allure-reporter)
4. [Configuration Examples](#configuration-examples)
5. [Running Tests with Reporters](#running-tests-with-reporters)

---

## Overview

Reporters in Playwright generate test execution reports in various formats. They help:
- Track test results
- Identify failures and errors
- Generate visual dashboards
- Integrate with CI/CD pipelines
- Create detailed test documentation

---

## Built-in Reporters

Playwright provides several built-in reporters:

### 1. **List Reporter**

The default reporter that outputs results line by line.

**Characteristics:**
- Shows each test result on a separate line
- Includes status (✓, ×, ⊙), test name, and duration
- Best for terminal/console viewing

**Example Output:**
```
✓ example.spec.ts:8:5 › My test (500ms)
✓ example.spec.ts:15:5 › Another test (300ms)
× example.spec.ts:22:5 › Failing test (100ms)
```

**Configuration:**
```typescript
// playwright.config.ts
export default defineConfig({
  reporter: 'list',
});
```

**Custom Configuration:**
```typescript
export default defineConfig({
  reporter: [['list', { printSteps: true }]],
});
```

---

### 2. **Dot Reporter**

Shows a compact single-character output per test.

**Characteristics:**
- `.` = passed test
- `F` = failed test
- `S` = skipped test
- Very compact output
- Good for large test suites

**Example Output:**
```
....F.S....
```

**Configuration:**
```typescript
export default defineConfig({
  reporter: 'dot',
});
```

---

### 3. **Line Reporter**

Shows one test per line with real-time updates.

**Characteristics:**
- Overwrites previous line with updated status
- Shows percentage progress
- Minimal space usage

**Example Output:**
```
[1/10] example.spec.ts:8:5 › My test
[2/10] example.spec.ts:15:5 › Another test (passed)
[3/10] example.spec.ts:22:5 › Failing test (failed)
```

**Configuration:**
```typescript
export default defineConfig({
  reporter: 'line',
});
```

---

### 4. **HTML Reporter**

Generates an interactive HTML report with detailed information.

**Characteristics:**
- Interactive web-based dashboard
- View test details, traces, screenshots, videos
- Full test execution timeline
- Filter by status (passed, failed, skipped)
- Built-in trace viewer
- Zero-config setup

**Configuration:**
```typescript
export default defineConfig({
  reporter: 'html',
});
```

**Custom Configuration:**
```typescript
export default defineConfig({
  reporter: [
    ['html', { open: 'always' }], // Options: 'always', 'on-failure', 'never'
  ],
});
```

**Viewing the Report:**
```bash
npx playwright show-report
```

**Output Location:**
```
playwright-report/index.html
```

**Features:**
- Filter by test status
- View full test details
- Watch video recordings
- Inspect traces
- See screenshots
- View test timings

---

### 5. **JSON Reporter**

Outputs test results in JSON format for programmatic access.

**Characteristics:**
- Machine-readable format
- Contains all test data
- Useful for CI/CD integration
- Can be processed by other tools

**Configuration:**
```typescript
export default defineConfig({
  reporter: [['json', { outputFile: 'test-results/results.json' }]],
});
```

**Example Output Structure:**
```json
{
  "config": {
    "webServer": null,
    "metadata": {}
  },
  "stats": {
    "expected": 50,
    "unexpected": 5,
    "flaky": 2,
    "skipped": 3,
    "duration": 12450
  },
  "suites": [
    {
      "title": "example.spec.ts",
      "file": "tests/example.spec.ts",
      "column": 0,
      "line": 0,
      "specs": [
        {
          "title": "My test",
          "ok": true,
          "tags": [],
          "tests": [
            {
              "timeout": 30000,
              "annotations": [],
              "expectedStatus": "passed",
              "duration": 500,
              "status": "passed",
              "steps": []
            }
          ],
          "id": "example.spec.ts-my-test",
          "file": "tests/example.spec.ts",
          "line": 8,
          "column": 5
        }
      ]
    }
  ]
}
```

---

### 6. **JUnit Reporter**

XML-based format compatible with CI/CD systems (Jenkins, GitHub Actions, etc.).

**Characteristics:**
- Standard JUnit/xUnit XML format
- Wide CI/CD support
- Good for test aggregation
- Contains failure details

**Configuration:**
```typescript
export default defineConfig({
  reporter: [['junit', { outputFile: 'test-results/junit.xml' }]],
});
```

**Example Output:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<testsuites name="pw-tests" tests="10" failures="1" skipped="1">
  <testsuite name="example.spec.ts" tests="10" failures="1" skipped="1" time="12.45">
    <testcase name="My test" time="0.5" classname="example.spec.ts" />
    <testcase name="Another test" time="0.3" classname="example.spec.ts" />
    <testcase name="Failing test" time="0.1" classname="example.spec.ts">
      <failure message="Assert Equal" type="Error">
        Error: expect(received).toBe(expected)
        Expected: true
        Received: false
      </failure>
    </testcase>
    <testcase name="Skipped test" time="0" classname="example.spec.ts">
      <skipped message="Skipped" type="skipped" />
    </testcase>
  </testsuite>
</testsuites>
```

---

### 7. **Markdown Reporter**

Generates a markdown summary of test results.

**Characteristics:**
- Human-readable format
- Easy to share in documentation
- Good for test reports in GitHub

**Configuration:**
```typescript
export default defineConfig({
  reporter: [['markdown', { outputFile: 'test-results/report.md' }]],
});
```

**Example Output:**
```markdown
# Test Report

## Summary

| Tests | Passed | Failed | Skipped | Duration |
|-------|--------|--------|---------|----------|
| 10    | 9      | 1      | 1       | 12.45s   |

## Results

### example.spec.ts
- ✓ My test (500ms)
- ✓ Another test (300ms)
- × Failing test (100ms)
  - Error: expect(received).toBe(expected)
- ⊙ Skipped test (skipped)
```

---

### 8. **GitHub Reporter**

Outputs test results in GitHub Actions format.

**Characteristics:**
- Integrated with GitHub Actions
- Shows annotations in PR
- Automatically groups test results
- Creates summary in workflow

**Configuration:**
```typescript
export default defineConfig({
  reporter: 'github',
});
```

---

### 9. **VSCode Extension Reporter**

Provides integration with VS Code Test Explorer.

**Characteristics:**
- Real-time test execution in VS Code
- Test tree visualization
- One-click test running
- Quick failure inspection

**Configuration:**
```typescript
export default defineConfig({
  reporter: [['list'], ['html']],
});
```

---

## Allure Reporter

Allure is a powerful open-source test reporting framework that generates beautiful interactive HTML reports.

### What is Allure?

Allure Framework is a flexible lightweight multi-language test report tool that not only shows what has been tested but allows everyone participating in the development process to extract the maximum of useful information from everyday execution of the test suite.

### Key Features

- **Beautiful HTML Reports**: Interactive dashboards with rich visualizations
- **Test History**: Track test execution trends over time
- **Test Categories**: Organize tests by features, stories, and severity
- **Attachments**: Include screenshots, videos, logs, and other artifacts
- **Retry Information**: Show original failures vs. retried attempts
- **Execution Timeline**: Visualize test execution flow
- **Flakiness Detection**: Identify flaky tests
- **Behavioral Mapping**: Link tests to BDD scenarios

### Installation

**Step 1: Install Allure CLI**

```bash
# Using npm (recommended)
npm install -D @playwright/test allure-playwright

# Or globally
npm install -g allure
```

**Step 2: Verify Installation**

```bash
allure --version
```

---

### Configuration in playwright.config.ts

**Basic Setup:**

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: [['html'], ['allure-playwright']],
  use: {
    baseURL: 'http://localhost:3000',
  },
});
```

**Advanced Setup with Custom Options:**

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: [
    ['list'],
    ['html', { open: 'always' }],
    [
      'allure-playwright',
      {
        outputFolder: 'allure-results',
        deletePreviousResults: true,
        detail: true,
        suiteTitle: false,
      },
    ],
  ],
  use: {
    baseURL: 'http://localhost:3000',
  },
});
```

---

### Using Allure Annotations in Tests

**Example 1: Basic Test with Allure Decorators**

```typescript
// tests/allure-example.spec.ts
import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

test.describe('User Authentication', () => {
  test('should login successfully', async ({ page }) => {
    await allure.label('feature', 'Authentication');
    await allure.label('story', 'User Login');
    await allure.label('severity', 'critical');
    await allure.tag('smoke');
    await allure.description('Test user login with valid credentials');

    await page.goto('https://example.com/login');
    await page.fill('#username', 'user@example.com');
    await page.fill('#password', 'password123');
    await page.click('button[type="submit"]');

    await allure.step('Verify user is logged in', async () => {
      await expect(page).toHaveURL('https://example.com/dashboard');
      const userName = await page.textContent('.user-name');
      expect(userName).toBe('John Doe');
    });
  });
});
```

**Example 2: Tests with Multiple Steps**

```typescript
// tests/checkout-flow.spec.ts
import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

test.describe('E-Commerce Checkout', () => {
  test('complete purchase flow', async ({ page }) => {
    await allure.label('feature', 'E-Commerce');
    await allure.label('story', 'Checkout Flow');
    await allure.label('severity', 'blocker');
    await allure.tag('smoke', 'regression');

    await allure.step('Navigate to store', async () => {
      await page.goto('https://example.com');
      await expect(page).toHaveTitle('Online Store');
    });

    await allure.step('Add product to cart', async () => {
      await page.click('[data-product-id="123"]');
      await page.click('button:has-text("Add to Cart")');
      const cartCount = await page.textContent('[data-cart-count]');
      expect(cartCount).toBe('1');
    });

    await allure.step('Proceed to checkout', async () => {
      await page.click('[data-testid="cart-button"]');
      await page.click('button:has-text("Proceed to Checkout")');
      await expect(page).toHaveURL(/\/checkout/);
    });

    await allure.step('Enter shipping information', async () => {
      await page.fill('#address', '123 Main St');
      await page.fill('#city', 'Springfield');
      await page.fill('#zip', '12345');
    });

    await allure.step('Enter payment information', async () => {
      await page.fill('#card-number', '4111111111111111');
      await page.fill('#expiry', '12/25');
      await page.fill('#cvv', '123');
    });

    await allure.step('Complete purchase', async () => {
      await page.click('button:has-text("Place Order")');
      await expect(page).toHaveURL(/\/order-confirmation/);
      const orderNo = await page.textContent('[data-order-number]');
      expect(orderNo).toBeTruthy();
    });
  });
});
```

**Example 3: Tests with Attachments**

```typescript
// tests/visual-testing.spec.ts
import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import fs from 'fs';

test.describe('Visual Regression Tests', () => {
  test('homepage layout matches baseline', async ({ page }) => {
    await allure.label('feature', 'UI');
    await allure.label('severity', 'normal');
    await allure.description('Verify homepage visual appearance');

    await page.goto('https://example.com');

    // Take screenshot
    const screenshot = await page.screenshot();
    await allure.attachment(
      'page-screenshot',
      Buffer.from(screenshot),
      'image/png'
    );

    // Attach console logs
    page.on('console', (msg) => {
      allure.attachment('console-log', msg.text(), 'text/plain');
    });

    await allure.step('Verify logo is visible', async () => {
      const logo = page.locator('img[alt="Logo"]');
      await expect(logo).toBeVisible();
    });

    // Attach PDF report if exists
    const reportPath = './reports/summary.pdf';
    if (fs.existsSync(reportPath)) {
      const pdfBuffer = fs.readFileSync(reportPath);
      await allure.attachment(
        'summary-report',
        pdfBuffer,
        'application/pdf'
      );
    }
  });

  test('button states comparison', async ({ page }) => {
    await allure.label('feature', 'UI Components');
    await allure.label('severity', 'minor');

    await page.goto('https://example.com/buttons');

    // Screenshot with description
    const buttons = page.locator('button');
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const screenshot = await button.screenshot();
      await allure.attachment(
        `button-${i}`,
        Buffer.from(screenshot),
        'image/png'
      );
    }
  });
});
```

**Example 4: Tests with Links and Issues**

```typescript
// tests/issue-tracking.spec.ts
import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

test.describe('Bug Fixes and Issues', () => {
  test('verify issue #123 is fixed', async ({ page }) => {
    await allure.label('feature', 'Bug Fixes');
    await allure.tag('issue-123');
    await allure.link(
      'https://github.com/myrepo/issues/123',
      'Issue #123'
    );
    await allure.link(
      'https://jira.company.com/browse/PROJ-456',
      'JIRA Ticket'
    );

    await page.goto('https://example.com');
    // Test logic here
  });

  test('verify feature request #456 is implemented', async ({ page }) => {
    await allure.label('feature', 'New Features');
    await allure.description(
      'User requested ability to filter results by date range'
    );
    await allure.link(
      'https://github.com/myrepo/issues/456',
      'Feature Request'
    );

    await page.goto('https://example.com/results');
    // Test logic here
  });
});
```

**Example 5: Parameterized Tests with Allure**

```typescript
// tests/parameterized.spec.ts
import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

const credentials = [
  { username: 'user1@example.com', password: 'password1' },
  { username: 'user2@example.com', password: 'password2' },
  { username: 'admin@example.com', password: 'adminpass' },
];

test.describe('Login with Multiple Users', () => {
  credentials.forEach(({ username, password }) => {
    test(`login as ${username}`, async ({ page }) => {
      await allure.label('feature', 'Authentication');
      await allure.parameter('username', username);
      await allure.parameter('environment', 'staging');

      await page.goto('https://example.com/login');
      await page.fill('#username', username);
      await page.fill('#password', password);
      await page.click('button[type="submit"]');

      await expect(page).toHaveURL('https://example.com/dashboard');
    });
  });
});
```

---

### Running Tests and Generating Allure Reports

**Run tests and generate Allure results:**

```bash
npx playwright test
```

**Generate and open Allure report:**

```bash
allure generate allure-results -o allure-report --clean
allure open allure-report
```

**Combined command:**

```bash
npx playwright test && allure generate allure-results --clean && allure open allure-report
```

**Clear previous results and run:**

```bash
rm -r allure-results
npx playwright test
allure serve allure-results
```

---

### Allure Commands Reference

| Command | Purpose |
|---------|---------|
| `allure generate <path>` | Generate HTML report from results |
| `allure open <path>` | Open generated report in browser |
| `allure serve <path>` | Start local server with live report updates |
| `allure --version` | Check installed version |
| `allure report-dir` | Show report directory |

---

### Advanced: Allure Configuration File

Create `allure.properties` in project root:

```properties
# allure.properties
allure.results.directory=allure-results
allure.report.directory=allure-report

# Parallel execution settings
allure.max.threads=4

# Server settings
allure.server.default.port=4040
```

---

## Configuration Examples

### Example 1: Multiple Reporters (Recommended Setup)

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['list'],
    ['html', { open: 'always' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['allure-playwright', { outputFolder: 'allure-results' }],
  ],

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Example 2: CI/CD Optimized Configuration

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  reporter: [
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['github'], // GitHub Actions format
    process.env.ALLURE === 'true'
      ? ['allure-playwright', { outputFolder: 'allure-results' }]
      : [],
  ].filter(Boolean),

  forbidOnly: true,
  retries: 2,
  workers: 4,

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
  },
});
```

### Example 3: Custom Reporter Script

```typescript
// reporters/custom-reporter.ts
import {
  Reporter,
  FullResult,
  Suite,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';
import fs from 'fs';

class CustomReporter implements Reporter {
  private results: any[] = [];

  onTestEnd(test: TestCase, result: TestResult) {
    this.results.push({
      title: test.title,
      status: result.status,
      duration: result.duration,
      error: result.error?.message,
    });
  }

  onEnd(result: FullResult) {
    const report = {
      total: this.results.length,
      passed: this.results.filter((r) => r.status === 'passed').length,
      failed: this.results.filter((r) => r.status === 'failed').length,
      tests: this.results,
    };

    fs.writeFileSync(
      'custom-report.json',
      JSON.stringify(report, null, 2)
    );
    console.log(`Custom report generated: custom-report.json`);
  }
}

export default CustomReporter;
```

**Use in config:**

```typescript
export default defineConfig({
  reporter: [
    ['./reporters/custom-reporter.ts'],
    ['list'],
  ],
});
```

---

## Running Tests with Reporters

### Basic Execution

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/allure-example.spec.ts

# Run tests matching pattern
npx playwright test tests/auth

# Run single test
npx playwright test -g "should login successfully"

# Run tests in headed mode
npx playwright test --headed

# Run tests in debug mode
npx playwright test --debug
```

### Viewing Reports

```bash
# View HTML report
npx playwright show-report

# Open Allure report
allure open allure-report

# Serve Allure with live updates
allure serve allure-results

# Generate and view in one command
allure generate allure-results --clean && allure open allure-report
```

---

## Best Practices

### 1. **Effective Labeling**
```typescript
await allure.label('feature', 'Authentication');
await allure.label('story', 'User Login');
await allure.label('severity', 'critical');
await allure.tag('smoke', 'regression');
```

**Severity Levels:**
- `blocker` - Critical functionality broken
- `critical` - Major functionality affected
- `normal` - Standard functionality issue
- `minor` - Minor feature issue
- `trivial` - Cosmetic issues

### 2. **Meaningful Steps**
```typescript
await allure.step('Descriptive action name', async () => {
  // Detailed test logic
});
```

### 3. **Include Attachments**
```typescript
const screenshot = await page.screenshot();
await allure.attachment('screenshot', Buffer.from(screenshot), 'image/png');
```

### 4. **Link to External Resources**
```typescript
await allure.link('https://github.com/repo/issues/123', 'GitHub Issue');
await allure.link('https://jira.com/browse/PROJ-456', 'JIRA Ticket');
```

### 5. **Use Parameters for Clarity**
```typescript
await allure.parameter('username', 'user@example.com');
await allure.parameter('environment', 'staging');
```

---

## Comparison Table

| Feature | List | HTML | JSON | JUnit | Allure |
|---------|------|------|------|-------|--------|
| Console Output | ✓ | - | - | - | - |
| Interactive Dashboard | - | ✓ | - | - | ✓ |
| Machine Readable | - | - | ✓ | ✓ | - |
| CI/CD Integration | - | - | ✓ | ✓ | ✓ |
| Screenshots/Videos | - | ✓ | - | - | ✓ |
| Test History | - | - | - | - | ✓ |
| Flakiness Detection | - | - | - | - | ✓ |
| Steps/Details | - | ✓ | - | - | ✓ |
| Custom Annotations | - | - | - | - | ✓ |

---

## Troubleshooting

### Allure Report Not Generating

**Problem:** `allure command not found`

**Solution:**
```bash
npm install -g allure
# or
npx allure --version
```

### Empty Allure Results

**Problem:** `allure-results` folder is empty

**Solution:**
```bash
# Ensure allure-playwright is installed
npm install -D allure-playwright

# Clear and regenerate
rm -r allure-results
npx playwright test
```

### Port Already in Use

**Problem:** `Port 4040 is already in use`

**Solution:**
```bash
# Use different port
allure serve allure-results -p 4041
```

### Report Missing Attachments

**Ensure:**
```typescript
import { allure } from 'allure-playwright';

// Use allure from the correct package
await allure.attachment('name', buffer, 'mime-type');
```

---

## Summary

- **Built-in Reporters**: List, Dot, Line, HTML, JSON, JUnit, Markdown, GitHub
- **Allure Reporter**: Premium reporting with rich visualizations and test management
- **Configuration**: Add reporters to `reporter` array in playwright.config.ts
- **Usage**: Use `allure` decorators and methods for detailed test documentation
- **Viewing**: HTML reports via `show-report`, Allure via `allure open` or `allure serve`

