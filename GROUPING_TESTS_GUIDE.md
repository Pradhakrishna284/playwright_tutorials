# Test Grouping in Playwright - Complete Guide

## Table of Contents
1. [What Is Test Grouping?](#what-is-test-grouping)
2. [Why Group Tests?](#why-group-tests)
3. [Basic Test Groups](#basic-test-groups)
4. [Test Hooks](#test-hooks)
5. [Group Configuration](#group-configuration)
6. [Nested Groups](#nested-groups)
7. [Execution Strategies](#execution-strategies)
8. [Best Practices](#best-practices)
9. [Real-World Examples](#real-world-examples)
10. [CLI Integration](#cli-integration)

---

## What Is Test Grouping?

**Test Grouping** (or test suites) organizes multiple tests into logical collections using `test.describe()`.

### Basic Structure

```typescript
test.describe('Group Name', () => {
  test('test 1', async () => {
    // Test code
  });

  test('test 2', async () => {
    // Test code
  });

  test('test 3', async () => {
    // Test code
  });
});
```

### Output

```
✓ Group Name
  ✓ test 1
  ✓ test 2
  ✓ test 3
```

---

## Why Group Tests?

### 1. **Organization**
- Group related tests together
- Clear test structure
- Easy to find tests

### 2. **Shared Setup/Teardown**
- Run setup once per group
- Avoid code duplication
- Cleaner test files

### 3. **Shared Configuration**
- Apply settings to entire group
- Retries per group
- Timeouts per group

### 4. **Filtering & Running**
- Run specific groups only
- Filter by group name
- Better CI/CD control

### 5. **Documentation**
- Self-documenting code
- Test structure visible
- Clear feature organization

---

## Basic Test Groups

### 1. **Simple Group**

```typescript
test.describe('Login Feature', () => {
  test('valid credentials', async ({ page }) => {
    // Test code
  });

  test('invalid email', async ({ page }) => {
    // Test code
  });

  test('missing password', async ({ page }) => {
    // Test code
  });
});
```

### 2. **Multiple Groups**

```typescript
test.describe('User Registration', () => {
  test('new user', async ({ page }) => {
    // Test code
  });
});

test.describe('User Login', () => {
  test('existing user', async ({ page }) => {
    // Test code
  });
});

test.describe('User Logout', () => {
  test('user session', async ({ page }) => {
    // Test code
  });
});
```

### 3. **Group Aliases**

```typescript
// All equivalent:
test.describe('My Tests', () => { });
describe('My Tests', () => { });  // Alias
test.describe.only('My Tests', () => { });  // Run only this group
test.describe.skip('My Tests', () => { });  // Skip this group
```

---

## Test Hooks

Hooks run before/after tests within a group.

### 1. **beforeEach / afterEach**

Runs before/after **each test** in the group.

```typescript
test.describe('User Management', () => {
  test.beforeEach(async ({ page }) => {
    // Run before EACH test
    await page.goto('https://example.com/login');
    console.log('Setup complete');
  });

  test.afterEach(async ({ page }) => {
    // Run after EACH test
    console.log('Cleanup complete');
  });

  test('test 1', async ({ page }) => {
    // Setup runs first, then this test
  });

  test('test 2', async ({ page }) => {
    // Setup runs again, then this test
  });
});

// Output:
// Setup complete
// ✓ test 1
// Cleanup complete
// Setup complete
// ✓ test 2
// Cleanup complete
```

### 2. **beforeAll / afterAll**

Runs **once** before/after all tests in the group.

```typescript
test.describe('Database Operations', () => {
  let dbConnection: any;

  test.beforeAll(async () => {
    // Run ONCE before all tests
    console.log('Connecting to database...');
    dbConnection = await connectDB();
  });

  test.afterAll(async () => {
    // Run ONCE after all tests
    console.log('Disconnecting from database...');
    await dbConnection.close();
  });

  test('query users', async () => {
    // DB connection already established
    const users = await dbConnection.query('SELECT * FROM users');
    console.log(users);
  });

  test('query posts', async () => {
    // Same DB connection
    const posts = await dbConnection.query('SELECT * FROM posts');
    console.log(posts);
  });
});

// Output:
// Connecting to database...
// ✓ query users
// ✓ query posts
// Disconnecting from database...
```

### 3. **Hook Execution Order**

```
beforeAll (once)
  ↓
beforeEach (test 1)
  ↓
test 1
  ↓
afterEach (test 1)
  ↓
beforeEach (test 2)
  ↓
test 2
  ↓
afterEach (test 2)
  ↓
afterAll (once)
```

### 4. **Access Test Info in Hooks**

```typescript
test.describe('Test Info', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    console.log(`Running: ${testInfo.title}`);
    console.log(`Retry: ${testInfo.retry}`);
  });

  test('example test', async ({ page }, testInfo) => {
    // Test code
  });
});
```

---

## Group Configuration

### 1. **Configure Retries**

```typescript
test.describe('Flaky Tests', () => {
  // Configure this group
  test.describe.configure({ retries: 3 });

  test('might fail', async ({ page }) => {
    // This test retries up to 3 times
  });

  test('might fail too', async ({ page }) => {
    // This test also retries up to 3 times
  });
});
```

### 2. **Configure Timeout**

```typescript
test.describe('Slow Tests', () => {
  // Set timeout for all tests in group
  test.describe.configure({ timeout: 60000 });  // 60 seconds

  test('takes long time', async ({ page }) => {
    // This test has 60 second timeout
    await page.waitForTimeout(45000);
  });
});
```

### 3. **Configure Mode (Parallel/Serial)**

```typescript
test.describe.serial('Sequential Tests', () => {
  // All tests run one after another (serial)
  test.describe.configure({ mode: 'serial' });

  test('test 1', async ({ page }) => {
    // Runs first
  });

  test('test 2', async ({ page }) => {
    // Runs after test 1
  });
});

test.describe('Parallel Tests', () => {
  // Tests run in parallel (default)
  
  test('test 1', async ({ page }) => {
    // Might run simultaneously
  });

  test('test 2', async ({ page }) => {
    // Might run simultaneously
  });
});
```

### 4. **Only & Skip**

```typescript
test.describe('Feature A', () => {
  test('test 1', async ({ page }) => {
    // Skipped when Feature B uses .only
  });
});

test.describe.only('Feature B', () => {
  // Only this group runs
  test('test 2', async ({ page }) => {
    // Runs
  });
});
```

---

## Nested Groups

### 1. **Two Levels**

```typescript
test.describe('E-Commerce', () => {
  test.describe('Shopping Cart', () => {
    test('add item', async ({ page }) => { });
    test('remove item', async ({ page }) => { });
    test('update quantity', async ({ page }) => { });
  });

  test.describe('Checkout', () => {
    test('billing address', async ({ page }) => { });
    test('payment method', async ({ page }) => { });
    test('order confirmation', async ({ page }) => { });
  });
});

// Output:
// E-Commerce
//   Shopping Cart
//     ✓ add item
//     ✓ remove item
//     ✓ update quantity
//   Checkout
//     ✓ billing address
//     ✓ payment method
//     ✓ order confirmation
```

### 2. **Three+ Levels**

```typescript
test.describe('Application', () => {
  test.describe('Admin Panel', () => {
    test.describe('User Management', () => {
      test.describe('Create User', () => {
        test('valid data', async ({ page }) => { });
        test('invalid email', async ({ page }) => { });
        test('duplicate user', async ({ page }) => { });
      });

      test.describe('Edit User', () => {
        test('change name', async ({ page }) => { });
        test('change role', async ({ page }) => { });
      });
    });

    test.describe('Permissions', () => {
      test('admin access', async ({ page }) => { });
      test('user access', async ({ page }) => { });
    });
  });
});
```

### 3. **Nested Hooks**

```typescript
test.describe('Parent Group', () => {
  test.beforeEach(async ({ page }) => {
    console.log('Parent beforeEach');
  });

  test('parent test', async ({ page }) => {
    // Parent beforeEach runs first
  });

  test.describe('Child Group', () => {
    test.beforeEach(async ({ page }) => {
      console.log('Child beforeEach');
    });

    test('child test', async ({ page }) => {
      // Both beforeEach run: parent first, then child
    });
  });
});

// Output:
// Parent beforeEach
// ✓ parent test
// Parent beforeEach
// Child beforeEach
// ✓ child test
```

---

## Execution Strategies

### 1. **Parallel Execution (Default)**

```typescript
test.describe('Parallel Group', () => {
  test('test A', async ({ page }) => {
    // Can run simultaneously with test B
  });

  test('test B', async ({ page }) => {
    // Can run simultaneously with test A
  });
});

// Execution:
// ├─ test A →  ✓ (2s)
// ├─ test B →  ✓ (2s)
// Total: ~2s (parallel)
```

### 2. **Serial Execution**

```typescript
test.describe.serial('Sequential Group', () => {
  test('test A', async ({ page }) => {
    // Runs first
  });

  test('test B', async ({ page }) => {
    // Runs after test A finishes
  });
});

// Execution:
// └─ test A  ✓ (2s)
// └─ test B  ✓ (2s)
// Total: ~4s (sequential)
```

### 3. **Mixed Execution**

```typescript
test.describe('Feature', () => {
  test.describe.serial('Setup Tests', () => {
    test('create database', async () => { });
    test('seed data', async () => { });
  });

  test.describe('Feature Tests', () => {
    test('test 1', async ({ page }) => { });
    test('test 2', async ({ page }) => { });
  });
});

// Setup runs serial, Feature runs parallel
```

---

## Best Practices

### ✅ DO:

1. **Group by feature/component**
   ```typescript
   test.describe('Login', () => { });
   test.describe('Checkout', () => { });
   test.describe('Profile', () => { });
   ```

2. **Use meaningful group names**
   ```typescript
   // ✅ GOOD
   test.describe('Shopping Cart - Add Items', () => { });
   
   // ❌ UNCLEAR
   test.describe('Tests', () => { });
   ```

3. **Use hooks for setup/cleanup**
   ```typescript
   test.describe('User Tests', () => {
     test.beforeEach(async ({ page }) => {
       await page.goto('/login');
     });
   });
   ```

4. **Organize hierarchically**
   ```typescript
   test.describe('E-Commerce', () => {
     test.describe('Cart', () => { });
     test.describe('Checkout', () => { });
   });
   ```

5. **Use serial for dependent tests**
   ```typescript
   test.describe.serial('Workflow', () => {
     test('step 1', async () => { });
     test('step 2', async () => { });  // Depends on step 1
   });
   ```

6. **Configure appropriately**
   ```typescript
   test.describe('Slow Feature', () => {
     test.describe.configure({ timeout: 60000, retries: 2 });
   });
   ```

### ❌ DON'T:

1. **Don't nest too deeply** (3+ levels gets confusing)
   ```typescript
   // ❌ Too deep
   test.describe('A', () => {
     test.describe('B', () => {
       test.describe('C', () => {
         test.describe('D', () => { });
       });
     });
   });
   ```

2. **Don't use serial for independent tests** (wastes time)
   ```typescript
   // ❌ Serial when parallel works fine
   test.describe.serial('Independent Tests', () => {
     test('search', async () => { });
     test('filter', async () => { });
   });
   ```

3. **Don't share state between tests**
   ```typescript
   // ❌ Shared state
   let userId = null;
   test('create', () => { userId = 123; });
   test('update', () => { expect(userId).toBe(123); });  // Dangerous!
   ```

4. **Don't forget afterEach cleanup**
   ```typescript
   // ❌ No cleanup
   test.beforeEach(async () => { /* setup */ });
   // Missing: test.afterEach(async () => { /* cleanup */ });
   ```

5. **Don't use .only in commits**
   ```typescript
   // ❌ This prevents other tests from running
   test.describe.only('Feature', () => { });
   ```

---

## Real-World Examples

### Example 1: Authentication Feature

```typescript
test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.com/login');
  });

  test.describe('Valid Login', () => {
    test('with email and password', async ({ page }) => {
      await page.fill('input[name="email"]', 'user@example.com');
      await page.fill('input[name="password"]', 'password123');
      await page.click('button:has-text("Login")');
      await expect(page).toHaveURL(/.*dashboard/);
    });

    test('with remember me', async ({ page }) => {
      await page.fill('input[name="email"]', 'user@example.com');
      await page.fill('input[name="password"]', 'password123');
      await page.check('input[name="remember"]');
      await page.click('button:has-text("Login")');
      await expect(page).toHaveURL(/.*dashboard/);
    });
  });

  test.describe('Invalid Login', () => {
    test('wrong password', async ({ page }) => {
      await page.fill('input[name="email"]', 'user@example.com');
      await page.fill('input[name="password"]', 'wrongpass');
      await page.click('button:has-text("Login")');
      await expect(page.locator('.error')).toContainText('Invalid credentials');
    });

    test('non-existent user', async ({ page }) => {
      await page.fill('input[name="email"]', 'nonexistent@example.com');
      await page.fill('input[name="password"]', 'password123');
      await page.click('button:has-text("Login")');
      await expect(page.locator('.error')).toContainText('User not found');
    });
  });

  test.describe('Validation', () => {
    test('empty email', async ({ page }) => {
      await page.fill('input[name="password"]', 'password123');
      await page.click('button:has-text("Login")');
      await expect(page.locator('.error')).toContainText('Email required');
    });

    test('empty password', async ({ page }) => {
      await page.fill('input[name="email"]', 'user@example.com');
      await page.click('button:has-text("Login")');
      await expect(page.locator('.error')).toContainText('Password required');
    });
  });
});
```

### Example 2: E-Commerce with Serial Dependencies

```typescript
test.describe.serial('E-Commerce Workflow', () => {
  let productId: string;
  let orderId: string;

  test.beforeEach(async ({ page }) => {
    await page.goto('https://shop.example.com');
  });

  test.describe('Product Discovery', () => {
    test('search for product', async ({ page }) => {
      await page.fill('input[placeholder="Search"]', 'laptop');
      await page.click('button:has-text("Search")');
      const products = page.locator('.product-item');
      expect(await products.count()).toBeGreaterThan(0);
      productId = await products.first().getAttribute('data-id');
    });
  });

  test.describe('Cart Management', () => {
    test('add to cart', async ({ page }) => {
      // Uses productId from previous test
      await page.goto(`/product/${productId}`);
      await page.click('button:has-text("Add to Cart")');
      await expect(page.locator('.cart-count')).toContainText('1');
    });

    test('view cart', async ({ page }) => {
      await page.click('[data-testid="cart-link"]');
      await expect(page).toHaveURL(/.*cart/);
      const item = page.locator('.cart-item').first();
      expect(await item.isVisible()).toBe(true);
    });
  });

  test.describe('Checkout', () => {
    test('proceed to checkout', async ({ page }) => {
      await page.goto('/cart');
      await page.click('button:has-text("Checkout")');
      await expect(page).toHaveURL(/.*checkout/);
    });

    test('complete purchase', async ({ page }) => {
      await page.goto('/checkout');
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="address"]', '123 Main St');
      await page.click('button:has-text("Complete Order")');
      
      const confirmation = page.locator('.order-confirmation');
      orderId = await confirmation.locator('[data-testid="order-id"]').textContent();
      expect(orderId).toBeTruthy();
    });
  });

  test.describe('Order Verification', () => {
    test('verify order in account', async ({ page }) => {
      // Uses orderId from previous test
      await page.goto('/account/orders');
      const orderLink = page.locator(`[data-order-id="${orderId}"]`);
      expect(await orderLink.isVisible()).toBe(true);
    });
  });
});
```

### Example 3: API Testing with Shared Setup

```typescript
test.describe('API Endpoints', () => {
  let authToken: string;
  let userId: string;

  test.beforeAll(async () => {
    // Setup: Authenticate once for all tests
    const response = await fetch('https://api.example.com/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', password: 'password' }),
    });
    const data = await response.json();
    authToken = data.token;
  });

  test.describe('User Endpoints', () => {
    test('get user profile', async () => {
      const response = await fetch('https://api.example.com/users/me', {
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
      const data = await response.json();
      expect(data.email).toBe('test@example.com');
      userId = data.id;
    });

    test('update user profile', async () => {
      const response = await fetch(`https://api.example.com/users/${userId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({ name: 'Updated Name' }),
      });
      expect(response.status).toBe(200);
    });
  });

  test.describe('Post Endpoints', () => {
    test('list user posts', async () => {
      const response = await fetch(`https://api.example.com/users/${userId}/posts`, {
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });

    test('create post', async () => {
      const response = await fetch('https://api.example.com/posts', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({ title: 'My Post', content: 'Content' }),
      });
      expect(response.status).toBe(201);
    });
  });

  test.afterAll(async () => {
    // Cleanup: Logout after all tests
    await fetch('https://api.example.com/auth/logout', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
  });
});
```

---

## CLI Integration

### Run Specific Group

```bash
# Run all tests in "Login" group
npx playwright test -g "Login"

# Run nested group
npx playwright test -g "E-Commerce.*Shopping Cart"
```

### Run All Groups Except One

```bash
# Run all tests except "Login"
npx playwright test -g "(?!Login)"

# Run all except "Slow Tests"
npx playwright test -g "(?!Slow)"
```

### List Groups

```bash
# Show test structure
npx playwright test --list
```

### Run with Config

```bash
# Run with specific reporter
npx playwright test --reporter=html

# Run with retries
npx playwright test --retries=2

# Run in serial
npx playwright test --workers=1
```

---

## File Organization

### Flat Structure

```
tests/
├── login.spec.ts
├── checkout.spec.ts
├── profile.spec.ts
└── admin.spec.ts
```

Each file uses `test.describe()` internally.

### Hierarchical Structure

```
tests/
├── auth/
│   ├── login.spec.ts
│   ├── logout.spec.ts
│   └── signup.spec.ts
├── shopping/
│   ├── cart.spec.ts
│   ├── checkout.spec.ts
│   └── wishlist.spec.ts
└── admin/
    ├── users.spec.ts
    ├── products.spec.ts
    └── reports.spec.ts
```

---

## Performance Considerations

### Parallel vs Serial

```typescript
// ⚡ FAST: Parallel (4 tests in 2 seconds)
test.describe('Parallel Group', () => {
  test('A', async () => { await page.waitForTimeout(2000); });
  test('B', async () => { await page.waitForTimeout(2000); });
});

// 🐢 SLOW: Serial (4 tests in 4 seconds)
test.describe.serial('Serial Group', () => {
  test('A', async () => { await page.waitForTimeout(2000); });
  test('B', async () => { await page.waitForTimeout(2000); });
});
```

### When to Use Serial

- ✅ Tests have dependencies
- ✅ Tests share expensive resources
- ✅ Order matters for accuracy

### When to Use Parallel

- ✅ Tests are independent
- ✅ Quick test suites
- ✅ No shared state

---

## Summary Table

| Concept | Purpose | Use Case |
|---------|---------|----------|
| `describe()` | Group tests | Organize related tests |
| `beforeEach` | Setup per test | Fresh state for each test |
| `afterEach` | Cleanup per test | Clean state after each test |
| `beforeAll` | Setup once | Expensive operations once |
| `afterAll` | Cleanup once | Teardown after all tests |
| `serial` | Run sequentially | Dependent tests |
| `parallel` | Run simultaneously | Independent tests |
| `.only` | Run this group | Debug specific group |
| `.skip` | Skip group | Disable tests temporarily |

Test grouping is essential for organizing complex test suites. Use it to create clear, maintainable, fast test execution!
