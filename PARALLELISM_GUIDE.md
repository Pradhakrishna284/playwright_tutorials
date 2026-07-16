# Parallelism & Parallel Testing in Playwright

## Table of Contents
1. [Overview](#overview)
2. [Why Parallel Testing](#why-parallel-testing)
3. [How Playwright Enables Parallelism](#how-playwright-enables-parallelism)
4. [Configuration](#configuration)
5. [Types of Parallelism](#types-of-parallelism)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)
8. [Performance Considerations](#performance-considerations)

---

## Overview

**Parallelism** in Playwright refers to the ability to run multiple tests simultaneously across different browser instances or processes. This is a powerful feature that significantly reduces total test execution time.

### Key Concepts:
- **Serial Execution**: Tests run one after another (sequential)
- **Parallel Execution**: Multiple tests run at the same time
- **Worker**: A separate process that executes tests in parallel
- **Concurrency**: Number of parallel workers executing tests simultaneously

---

## Why Parallel Testing?

### Time Savings
- **Serial**: 100 tests × 10 seconds = 1000 seconds (~17 minutes)
- **Parallel (4 workers)**: ~250 seconds (~4 minutes)
- **Reduction**: 75% faster execution

### CI/CD Benefits
- Faster feedback loops
- Reduced pipeline duration
- Better resource utilization
- Improved developer experience

### Scalability
- Can handle larger test suites
- More tests without proportional time increase

---

## How Playwright Enables Parallelism

Playwright uses a **worker-based model**:
1. Test runner (default: Playwright Test) manages workers
2. Each worker is an independent process
3. Workers execute tests concurrently
4. Test files are distributed across workers

### Isolation
- Each worker has its own browser context
- Isolated state and memory
- No test interference
- Failed tests don't affect others

---

## Configuration

### Basic Configuration in `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Number of parallel workers
  workers: 4,
  
  // Run in fully parallel mode (multiple browser instances)
  fullyParallel: true,
  
  // Fail on console errors
  use: {
    trace: 'on-first-retry',
  },
  
  // Project configurations
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
});
```

### Key Configuration Options

| Option | Default | Description |
|--------|---------|-------------|
| `workers` | # of CPU cores | Number of parallel workers |
| `fullyParallel` | false | Run all tests in parallel |
| `forbidOnly` | false | Block tests marked with `.only` |
| `retries` | 0 | Retry failed tests N times |
| `timeout` | 30s | Timeout per test |
| `expect.timeout` | 5s | Timeout for expect() calls |

---

## Types of Parallelism

### 1. **Test-Level Parallelism** (Default)
Tests run in parallel, but files execute sequentially within workers.

```typescript
// playwright.config.ts
workers: 4,
fullyParallel: false,  // Tests within a file run sequentially
```

**Use Case**: Standard test execution, good balance

### 2. **Full Parallelism**
All tests run in parallel, even within the same file.

```typescript
// playwright.config.ts
workers: 4,
fullyParallel: true,  // All tests run in parallel
```

**Use Case**: When tests are completely isolated
**Risk**: State/database conflicts if not properly isolated

### 3. **Browser-Based Parallelism**
Run tests across different browsers simultaneously.

```typescript
// playwright.config.ts
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit', use: { ...devices['Desktop Safari'] } },
]
```

**Use Case**: Cross-browser testing with reduced time

### 4. **Configuration-Based Parallelism**
Run same tests with different configurations in parallel.

```typescript
projects: [
  {
    name: 'desktop-chrome',
    use: { ...devices['Desktop Chrome'] },
  },
  {
    name: 'mobile-chrome',
    use: { ...devices['Pixel 5'] },
  },
  {
    name: 'tablet',
    use: { ...devices['iPad'] },
  },
]
```

**Use Case**: Testing different screen sizes/devices simultaneously

---

## Best Practices for Parallel Testing

### 1. **Ensure Test Isolation**
```typescript
test.beforeEach(async ({ page, context }) => {
  // Setup unique test data for each test
  const uniqueId = Math.random().toString(36).substring(7);
  
  // Use unique identifiers to avoid conflicts
  await page.goto(`https://example.com?testId=${uniqueId}`);
});
```

### 2. **Use Fixtures for Setup/Teardown**
```typescript
const test = base.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ page }, use) => {
    // Setup - run before each test
    await page.goto('https://example.com/login');
    await page.fill('input[name="username"]', 'user');
    await page.fill('input[name="password"]', 'pass');
    await page.click('button[type="submit"]');
    
    // Use the fixture
    await use(page);
    
    // Teardown - run after each test
    await page.context().clearCookies();
  },
});
```

### 3. **Avoid Global State**
```typescript
// ❌ BAD - Global state causes race conditions
let counter = 0;

test('increment counter', () => {
  counter++;
  expect(counter).toBe(1);
});

// ✅ GOOD - Use test-local variables
test('increment counter', async ({ page }) => {
  let counter = 0;
  counter++;
  expect(counter).toBe(1);
});
```

### 4. **Use Unique Data per Test**
```typescript
test('create user', async ({ page }) => {
  const uniqueEmail = `test-${Date.now()}@example.com`;
  
  await page.fill('input[name="email"]', uniqueEmail);
  await page.click('button[type="submit"]');
  
  // Verify creation
  expect(page.url()).toContain('success');
});
```

### 5. **Manage Database/API State**
```typescript
test.beforeEach(async ({ page, request }) => {
  // Clear any previous test data
  await request.delete(`https://api.example.com/test-data`);
});

test.afterEach(async ({ request }) => {
  // Cleanup after test
  await request.delete(`https://api.example.com/test-data`);
});
```

### 6. **Use Sequential Execution When Needed**
```typescript
// Tag tests that must run serially
test('database migration @serial', async ({ page }) => {
  // This test will not run in parallel with others marked @serial
});

// Run with: npx playwright test --grep @serial --workers=1
```

### 7. **Handle Timeout Issues**
```typescript
// playwright.config.ts
export default defineConfig({
  timeout: 30 * 1000,  // 30 seconds per test
  expect: {
    timeout: 5 * 1000,  // 5 seconds for assertions
  },
  use: {
    navigationTimeout: 30 * 1000,
    actionTimeout: 10 * 1000,
  },
});
```

---

## Parallel Testing Strategies

### Strategy 1: Full Parallel (Recommended for Isolated Tests)
```typescript
// playwright.config.ts
export default defineConfig({
  workers: 4,
  fullyParallel: true,
  
  // Good for tests that don't share state
});
```

### Strategy 2: File-Level Parallel (Default)
```typescript
// playwright.config.ts
export default defineConfig({
  workers: 4,
  fullyParallel: false,  // Tests in same file run sequentially
  
  // Good balance between parallelism and safety
});
```

### Strategy 3: Hybrid Approach
```typescript
// playwright.config.ts
export default defineConfig({
  workers: process.env.CI ? 4 : 2,  // More workers in CI
  
  projects: [
    {
      name: 'parallel-tests',
      testMatch: '**/*[^serial].spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'serial-tests',
      testMatch: '**/*serial.spec.ts',
      fullyParallel: false,
      workers: 1,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

---

## Command Line Options

### Run Tests in Parallel
```bash
# Use default workers (4 on most systems)
npx playwright test

# Use specific number of workers
npx playwright test --workers=8

# Use single worker (serial)
npx playwright test --workers=1

# Run in debug mode (single worker)
npx playwright test --debug

# Run tests matching pattern
npx playwright test --grep="login"

# Run specific file
npx playwright test tests/login.spec.ts

# Run tests in headed mode
npx playwright test --headed

# Run with specific project
npx playwright test --project=chromium
```

---

## Troubleshooting Parallel Testing Issues

### Issue 1: Tests Failing Intermittently
**Cause**: Race conditions or state sharing
**Solution**:
```typescript
// Ensure unique identifiers
test('add item', async ({ page }) => {
  const itemName = `item-${Date.now()}`;
  await page.fill('input[name="itemName"]', itemName);
  await page.click('button[type="submit"]');
});
```

### Issue 2: Port Conflicts
**Cause**: Multiple tests trying to use same port
**Solution**:
```typescript
// Use different ports per test
test('start server', async ({ page }) => {
  const port = 3000 + Math.floor(Math.random() * 1000);
  // Start server on unique port
});
```

### Issue 3: Database Locks
**Cause**: Multiple tests accessing same database
**Solution**:
```typescript
// Use separate databases per test worker
test.beforeEach(async ({ page }) => {
  const workerId = process.env.TEST_WORKER_INDEX;
  const dbName = `test_db_${workerId}`;
  
  await setupTestDatabase(dbName);
});
```

### Issue 4: File System Conflicts
**Cause**: Tests writing to same file locations
**Solution**:
```typescript
// Use worker-specific directories
test('write to file', async ({ page }) => {
  const workerId = process.env.TEST_WORKER_INDEX;
  const fileName = `test_${workerId}_${Date.now()}.txt`;
  
  // Write to unique file
});
```

### Issue 5: Slow Test Execution Despite Parallelism
**Cause**: Unbalanced worker distribution
**Solution**:
```typescript
// Organize tests by size
// tests/fast/
// tests/slow/

// Use separate projects
projects: [
  {
    name: 'fast-tests',
    testDir: 'tests/fast',
    workers: 8,  // More workers for fast tests
  },
  {
    name: 'slow-tests',
    testDir: 'tests/slow',
    workers: 2,  // Fewer workers for slow tests
  },
]
```

---

## Performance Considerations

### Optimal Worker Count
- **CPU-bound tests**: Number of CPU cores
- **I/O-bound tests**: 2-4x CPU cores
- **Network tests**: 4-8x CPU cores

```typescript
// Auto-detect optimal workers
import os from 'os';

const cpuCount = os.cpus().length;
const optimalWorkers = cpuCount * 2;  // For I/O-heavy tests

export default defineConfig({
  workers: optimalWorkers,
});
```

### Memory Usage
- Each worker uses ~50-100MB base memory
- Add browser memory (each browser ~50-150MB)
- Total: (workers × 100MB) + (workers × browser memory)

```typescript
// Limit workers based on available memory
const availableMemory = require('os').totalmem();
const recommendedWorkers = Math.floor(availableMemory / (200 * 1024 * 1024));

export default defineConfig({
  workers: Math.min(recommendedWorkers, 8),
});
```

### Monitoring Parallel Execution
```typescript
// Add logging to track parallelism
test('example', async ({ page }, testInfo) => {
  console.log(`Worker index: ${testInfo.workerIndex}`);
  console.log(`Test index: ${testInfo.testIndexInFile}`);
  console.log(`Repeat index: ${testInfo.repeatEachIndex}`);
});
```

### CI/CD Optimization
```typescript
// playwright.config.ts - Different config for CI
const isCI = !!process.env.CI;

export default defineConfig({
  workers: isCI ? 8 : 4,  // More workers in CI
  retries: isCI ? 2 : 0,  // Retry failed tests in CI
  timeout: isCI ? 60000 : 30000,  // Longer timeout in CI
  forbidOnly: isCI,  // Prevent .only in CI
});
```

---

## Summary

| Aspect | Details |
|--------|---------|
| **Default Behavior** | Tests run in parallel by file (sequential within file) |
| **Full Parallel** | All tests run simultaneously |
| **Workers** | Independent processes executing tests |
| **Isolation** | Each worker has separate browser context |
| **Best For** | Large test suites needing reduced execution time |
| **Key Requirement** | Test independence and unique data per test |
| **Performance Gain** | 75-90% reduction in total execution time |
| **Complexity** | Medium - requires careful state management |

---

## Key Takeaways

✅ **Enable parallelism** for faster test execution
✅ **Isolate tests** using fixtures and unique identifiers
✅ **Monitor performance** with different worker counts
✅ **Use hybrid approach** for mixed test types
✅ **Leverage CI/CD** settings for optimal performance
✅ **Test thoroughly** in parallel to catch race conditions
