# Playwright Hooks - Complete Guide

## Table of Contents
1. [What Are Hooks?](#what-are-hooks)
2. [Types of Hooks](#types-of-hooks)
3. [Hook Execution Order](#hook-execution-order)
4. [Detailed Examples](#detailed-examples)
5. [Common Use Cases](#common-use-cases)
6. [Best Practices](#best-practices)
7. [Advanced Hook Scenarios](#advanced-hook-scenarios)

---

## What Are Hooks?

**Hooks** are special functions that run at specific points in the test lifecycle. They allow you to set up preconditions and clean up after tests.

### Why Use Hooks?

✅ Reduce code duplication  
✅ Set up common test data  
✅ Clean up resources after tests  
✅ Initialize/tear down test environments  
✅ Improve test maintainability  

---

## Types of Hooks

### 1. **beforeAll** - Runs Once Before All Tests
```typescript
beforeAll(async () => {
  console.log('This runs ONCE before all tests in the file');
  // Initialize expensive resources
  // Load test data from database
  // Set up test environment
});
```

### 2. **afterAll** - Runs Once After All Tests
```typescript
afterAll(async () => {
  console.log('This runs ONCE after all tests in the file');
  // Clean up resources
  // Close database connections
  // Tear down test environment
});
```

### 3. **beforeEach** - Runs Before Every Test
```typescript
beforeEach(async () => {
  console.log('This runs BEFORE each individual test');
  // Navigate to home page
  // Log in user
  // Reset database state
});
```

### 4. **afterEach** - Runs After Every Test
```typescript
afterEach(async () => {
  console.log('This runs AFTER each individual test');
  // Take screenshots on failure
  // Clear cookies/cache
  // Log test metrics
});
```

---

## Hook Execution Order

For a test file with 2 tests:

```
beforeAll()
  ↓
beforeEach()  ← Test 1 starts
test('Test 1', ...)
afterEach()   ← Test 1 ends
  ↓
beforeEach()  ← Test 2 starts
test('Test 2', ...)
afterEach()   ← Test 2 ends
  ↓
afterAll()
```

### Console Output Order:
```
beforeAll hook running
beforeEach hook running (Test 1)
Test 1 running
afterEach hook running (Test 1)
beforeEach hook running (Test 2)
Test 2 running
afterEach hook running (Test 2)
afterAll hook running
```

---

## Detailed Examples

### Example 1: Basic Hook Setup

```typescript
import { test, expect, beforeEach, afterEach } from '@playwright/test';

test.describe('User Login Tests', () => {
  let username: string;
  let password: string;

  beforeEach(async ({ page }) => {
    console.log('Setting up test data...');
    username = 'testuser@example.com';
    password = 'Test@1234';
    
    // Navigate to login page
    await page.goto('https://example.com/login');
    console.log('Navigated to login page');
  });

  afterEach(async ({ page }) => {
    console.log('Cleaning up...');
    // Log out (if logged in)
    await page.goto('https://example.com/logout');
    // Clear cookies
    await page.context().clearCookies();
  });

  test('Valid login should succeed', async ({ page }) => {
    await page.fill('input[name="email"]', username);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/dashboard/);
  });

  test('Invalid password should fail', async ({ page }) => {
    await page.fill('input[name="email"]', username);
    await page.fill('input[name="password"]', 'WrongPassword');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('.error-message')).toContainText('Invalid credentials');
  });
});
```

---

### Example 2: Database Setup & Teardown

```typescript
import { test, expect, beforeAll, afterAll, beforeEach } from '@playwright/test';

test.describe('Product Management', () => {
  let testProductId: string;
  let dbConnection: any;

  beforeAll(async () => {
    console.log('Connecting to test database...');
    // dbConnection = await connectTestDB();
    // Create test tables if needed
  });

  afterAll(async () => {
    console.log('Closing database connection...');
    // await dbConnection.close();
  });

  beforeEach(async ({ page }) => {
    // Create fresh test data for each test
    testProductId = 'PROD-' + Date.now();
    console.log(`Created test product: ${testProductId}`);
    
    await page.goto('https://example.com/products');
  });

  test('Add product to cart', async ({ page }) => {
    await page.click(`[data-product-id="${testProductId}"]`);
    await expect(page.locator('[data-cart-count]')).toHaveText('1');
  });

  test('View product details', async ({ page }) => {
    await page.click(`[data-product-id="${testProductId}"]`);
    await expect(page.locator('.product-title')).toBeVisible();
  });
});
```

---

### Example 3: Multiple beforeEach & afterEach Hooks

```typescript
import { test, expect, beforeEach, afterEach } from '@playwright/test';

test.describe('Shopping Cart Tests', () => {
  // Multiple beforeEach hooks run in order
  beforeEach(async ({ page }) => {
    console.log('Hook 1: Navigate to home');
    await page.goto('https://example.com');
  });

  beforeEach(async ({ page }) => {
    console.log('Hook 2: Login user');
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
  });

  beforeEach(async ({ page }) => {
    console.log('Hook 3: Navigate to products');
    await page.goto('https://example.com/products');
  });

  // Multiple afterEach hooks run in reverse order
  afterEach(async ({ page }) => {
    console.log('Hook 3: Take screenshot on failure');
    // Screenshot on failure is handled by Playwright config
  });

  afterEach(async ({ page }) => {
    console.log('Hook 2: Clear cart');
    await page.click('[data-clear-cart]');
  });

  afterEach(async ({ page }) => {
    console.log('Hook 1: Log out');
    await page.click('[data-logout]');
  });

  test('Add product to cart', async ({ page }) => {
    console.log('TEST: Add product to cart');
    await page.click('[data-product-id="1"]');
    await expect(page.locator('[data-cart-count]')).toHaveText('1');
  });
});

/* Execution Order:
beforeEach Hook 1
beforeEach Hook 2
beforeEach Hook 3
TEST: Add product to cart
afterEach Hook 3
afterEach Hook 2
afterEach Hook 1
*/
```

---

### Example 4: beforeAll & afterAll Example

```typescript
import { test, expect, beforeAll, afterAll } from '@playwright/test';

test.describe('API Integration Tests', () => {
  let authToken: string;
  let testUserId: string;

  beforeAll(async () => {
    console.log('Creating test user once for all tests...');
    // Create a test user in database
    // testUserId = await createTestUser();
    // Get auth token
    // authToken = await getAuthToken(testUserId);
    console.log(`Test setup complete. User ID: ${testUserId}`);
  });

  afterAll(async () => {
    console.log('Cleaning up test resources...');
    // Delete test user from database
    // deleteTestUser(testUserId);
    console.log('Test cleanup complete');
  });

  test('Fetch user profile', async ({ page }) => {
    await page.goto('https://example.com/profile');
    await expect(page.locator('[data-user-id]')).toContainText(testUserId);
  });

  test('Update user profile', async ({ page }) => {
    await page.goto('https://example.com/profile/edit');
    await page.fill('input[name="name"]', 'Updated Name');
    await page.click('button[type="submit"]');
    await expect(page.locator('.success-message')).toBeVisible();
  });
});

/* Execution Order:
beforeAll (once)
  ↓
beforeEach (Test 1)
Test 1
afterEach (Test 1)
  ↓
beforeEach (Test 2)
Test 2
afterEach (Test 2)
  ↓
afterAll (once)
*/
```

---

## Common Use Cases

### 1. Page Object Setup
```typescript
beforeEach(async ({ page }) => {
  // Initialize page objects
  loginPage = new LoginPage(page);
  dashboardPage = new DashboardPage(page);
  
  // Navigate to starting page
  await loginPage.goto();
});
```

### 2. User Authentication
```typescript
beforeEach(async ({ page }) => {
  // Log in automatically before each test
  await page.goto('https://example.com/login');
  await page.fill('[name="email"]', 'testuser@example.com');
  await page.fill('[name="password"]', 'TestPassword123');
  await page.click('button[type="submit"]');
  await page.waitForNavigation();
});
```

### 3. Reset Application State
```typescript
afterEach(async ({ page, context }) => {
  // Clear all cookies
  await context.clearCookies();
  
  // Clear local storage
  await page.evaluate(() => localStorage.clear());
  
  // Clear session storage
  await page.evaluate(() => sessionStorage.clear());
});
```

### 4. API Token Setup
```typescript
beforeAll(async () => {
  // Get API token once for all tests
  const response = await fetch('https://api.example.com/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'testuser',
      password: 'testpass'
    })
  });
  
  const data = await response.json();
  apiToken = data.token;
});
```

### 5. Database Seed Data
```typescript
beforeAll(async () => {
  // Insert test data into database
  await db.users.insert({
    id: 1,
    email: 'test@example.com',
    name: 'Test User'
  });
});

afterAll(async () => {
  // Clean up test data
  await db.users.deleteAll();
  await db.close();
});
```

---

## Best Practices

### ✅ DO

```typescript
// 1. Keep hooks focused and simple
beforeEach(async ({ page }) => {
  await page.goto('https://example.com');
});

// 2. Use descriptive console logs
beforeEach(async () => {
  console.log('Setting up test database...');
});

// 3. Handle errors gracefully
afterEach(async ({ page }) => {
  try {
    await page.close();
  } catch (error) {
    console.error('Failed to close page:', error);
  }
});

// 4. Use beforeAll for expensive operations
beforeAll(async () => {
  // Expensive operations (DB connection, API auth)
});

// 5. Use beforeEach for test isolation
beforeEach(async ({ page }) => {
  // Fresh state for each test
});
```

### ❌ DON'T

```typescript
// 1. Don't make hooks too complex
beforeEach(async ({ page }) => {
  // DON'T: Multiple complex operations
  // Instead, break into separate hooks or fixtures
});

// 2. Don't forget error handling
afterEach(async ({ page }) => {
  // DON'T: Unhandled promise rejection
  // DO: Wrap in try-catch
});

// 3. Don't use beforeAll for test data
beforeAll(async () => {
  // DON'T: Create data that tests depend on
  // DO: Use beforeEach for test isolation
});

// 4. Don't skip cleanup
afterEach(async () => {
  // DON'T: Leave resources open
});
```

---

## Advanced Hook Scenarios

### Scenario 1: Conditional Hooks

```typescript
test.describe('Admin Tests', () => {
  beforeEach(async ({ page, browserName }) => {
    // Only log in on Chrome
    if (browserName === 'chromium') {
      await page.goto('https://example.com/login');
      await page.fill('[name="email"]', 'admin@example.com');
      await page.fill('[name="password"]', 'AdminPass123');
      await page.click('button[type="submit"]');
    }
  });

  test('Admin dashboard loads', async ({ page }) => {
    await page.goto('https://example.com/admin');
    await expect(page.locator('[data-admin-panel]')).toBeVisible();
  });
});
```

### Scenario 2: Hooks with Fixtures

```typescript
test.describe.configure({ mode: 'serial' }); // Run tests in order

test.describe('Payment Flow', () => {
  let paymentId: string;

  beforeEach(async ({ page }) => {
    console.log(`Using payment ID: ${paymentId}`);
    await page.goto('https://example.com/payments');
  });

  test('Step 1: Create payment', async ({ page }) => {
    await page.fill('[name="amount"]', '100');
    await page.click('button[type="submit"]');
    
    paymentId = await page.getAttribute('[data-payment-id]', 'data-payment-id');
    console.log(`Created payment: ${paymentId}`);
  });

  test('Step 2: Verify payment', async ({ page }) => {
    await page.goto(`https://example.com/payments/${paymentId}`);
    await expect(page.locator('[data-status]')).toContainText('Pending');
  });
});
```

### Scenario 3: Nested Describe Blocks with Different Hooks

```typescript
test.describe('E-Commerce Tests', () => {
  let sessionId: string;

  beforeAll(async () => {
    console.log('E-Commerce: Setting up session');
    sessionId = 'SESSION-' + Date.now();
  });

  test.describe('Product Catalog', () => {
    beforeEach(async ({ page }) => {
      console.log('Product Catalog: Navigating...');
      await page.goto('https://example.com/products');
    });

    test('Search for product', async ({ page }) => {
      await page.fill('[name="search"]', 'laptop');
      await page.press('[name="search"]', 'Enter');
      await expect(page.locator('[data-product-item]')).toBeTruthy();
    });
  });

  test.describe('Shopping Cart', () => {
    beforeEach(async ({ page }) => {
      console.log('Shopping Cart: Initializing cart');
      await page.goto('https://example.com/cart');
    });

    test('Empty cart shows message', async ({ page }) => {
      await expect(page.locator('[data-empty-message]')).toBeVisible();
    });
  });

  afterAll(async () => {
    console.log('E-Commerce: Cleaning up session');
  });
});
```

---

## Summary Table

| Hook | Runs | Use For |
|------|------|---------|
| `beforeAll` | Once at start | Expensive setup (DB, Auth) |
| `afterAll` | Once at end | Resource cleanup |
| `beforeEach` | Before each test | Test isolation, navigation |
| `afterEach` | After each test | Cleanup per test, screenshots |

---

## Key Takeaways

🔑 **Hooks** = Setup and teardown code for tests  
🔑 **beforeEach/afterEach** = For test isolation  
🔑 **beforeAll/afterAll** = For expensive operations  
🔑 **Multiple hooks** = Run in order (beforeEach) or reverse (afterEach)  
🔑 **Always cleanup** = Prevent test interference  
🔑 **Keep it simple** = Don't put complex logic in hooks  
