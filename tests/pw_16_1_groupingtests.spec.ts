import { test, expect } from '@playwright/test';

/**
 * TEST GROUPING - PRACTICAL EXAMPLES
 * ==================================
 * 
 * This file demonstrates:
 * 1. Basic test grouping with describe()
 * 2. Hooks: beforeEach, afterEach, beforeAll, afterAll
 * 3. Group configuration: retries, timeout, serial/parallel
 * 4. Nested groups
 * 5. Execution strategies
 * 6. Real-world patterns
 * 
 * Run with: npx playwright test pw_16_1_groupingtests.spec.ts
 */

// ============================================================================
// EXAMPLE 1: Basic Group - Simple Organization
// ============================================================================

test.describe('ex1: Basic Group - Login Features', () => {
  console.log('📁 Group: Login Features');
  
  test('valid credentials', async ({ page }) => {
    console.log('  ✓ Testing valid login');
    await page.goto('https://example.com/login');
    await expect(page).toHaveTitle(/Example/);
  });

  test('invalid email format', async ({ page }) => {
    console.log('  ✓ Testing invalid email');
    await page.goto('https://example.com/login');
    await expect(page).toHaveTitle(/Example/);
  });

  test('missing password', async ({ page }) => {
    console.log('  ✓ Testing missing password');
    await page.goto('https://example.com/login');
    await expect(page).toHaveTitle(/Example/);
  });
});

// ============================================================================
// EXAMPLE 2: Multiple Independent Groups
// ============================================================================

test.describe('ex2a: Shopping Cart Group', () => {
  console.log('📁 Group: Shopping Cart');
  
  test('add item', async ({ page }) => {
    console.log('  ✓ Add item to cart');
    await page.goto('https://example.com');
  });

  test('remove item', async ({ page }) => {
    console.log('  ✓ Remove item from cart');
    await page.goto('https://example.com');
  });
});

test.describe('ex2b: Checkout Group', () => {
  console.log('📁 Group: Checkout');
  
  test('shipping address', async ({ page }) => {
    console.log('  ✓ Enter shipping address');
    await page.goto('https://example.com');
  });

  test('payment method', async ({ page }) => {
    console.log('  ✓ Select payment method');
    await page.goto('https://example.com');
  });
});

// ============================================================================
// EXAMPLE 3: beforeEach - Setup Before Each Test
// ============================================================================

test.describe('ex3: beforeEach Hook - Fresh Setup Per Test', () => {
  console.log('📁 Group: With beforeEach');
  
  test.beforeEach(async ({ page }, testInfo) => {
    console.log(`  🔄 Setup before: ${testInfo.title}`);
    await page.goto('https://example.com');
    console.log('  ✓ Page loaded');
  });

  test('test 1', async ({ page }, testInfo) => {
    console.log(`  📝 Running: ${testInfo.title}`);
    // Page already loaded from beforeEach
    await expect(page).toHaveTitle(/Example/);
  });

  test('test 2', async ({ page }, testInfo) => {
    console.log(`  📝 Running: ${testInfo.title}`);
    // beforeEach runs again - fresh page
    await expect(page).toHaveTitle(/Example/);
  });
});

// ============================================================================
// EXAMPLE 4: afterEach - Cleanup After Each Test
// ============================================================================

test.describe('ex4: afterEach Hook - Cleanup Per Test', () => {
  console.log('📁 Group: With afterEach');
  
  test.beforeEach(async ({ page }) => {
    console.log('  🔄 Setup');
  });

  test.afterEach(async ({ page }, testInfo) => {
    console.log(`  🧹 Cleanup after: ${testInfo.title}`);
    // Clean up after each test
  });

  test('test 1', async ({ page }) => {
    console.log('  📝 Test 1 running');
  });

  test('test 2', async ({ page }) => {
    console.log('  📝 Test 2 running');
  });
});

// ============================================================================
// EXAMPLE 5: beforeAll / afterAll - Setup Once
// ============================================================================

test.describe('ex5: beforeAll/afterAll - Setup Once for All Tests', () => {
  console.log('📁 Group: With beforeAll/afterAll');
  
  let setupData: any;

  test.beforeAll(async () => {
    console.log('  🔵 beforeAll: Setup ONCE for all tests');
    setupData = { testId: 'test-user-123' };
    console.log('  ✓ Setup data created');
  });

  test.afterAll(async () => {
    console.log('  🔴 afterAll: Cleanup ONCE after all tests');
    console.log('  ✓ Setup data destroyed');
  });

  test('test 1 - uses setup data', async ({ page }) => {
    console.log(`  📝 Test 1, Data: ${setupData.testId}`);
    expect(setupData.testId).toBe('test-user-123');
  });

  test('test 2 - uses same setup data', async ({ page }) => {
    console.log(`  📝 Test 2, Data: ${setupData.testId}`);
    expect(setupData.testId).toBe('test-user-123');
  });
});

// ============================================================================
// EXAMPLE 6: Combined Hooks - All Together
// ============================================================================

test.describe('ex6: All Hooks Combined', () => {
  console.log('📁 Group: All Hooks');
  
  let globalData: string;

  test.beforeAll(async () => {
    console.log('  🔵 beforeAll: Expensive setup (database connection)');
    globalData = 'shared-resource';
  });

  test.beforeEach(async ({ page }, testInfo) => {
    console.log(`  🟡 beforeEach: Fresh state for ${testInfo.title}`);
    await page.goto('https://example.com');
  });

  test('test 1', async ({ page }) => {
    console.log(`  📝 Test 1, Global: ${globalData}`);
  });

  test('test 2', async ({ page }) => {
    console.log(`  📝 Test 2, Global: ${globalData}`);
  });

  test.afterEach(async ({ page }, testInfo) => {
    console.log(`  🟠 afterEach: Cleanup after ${testInfo.title}`);
  });

  test.afterAll(async () => {
    console.log('  🔴 afterAll: Cleanup expensive resources');
  });
});

// ============================================================================
// EXAMPLE 7: Configure - Retries
// ============================================================================

test.describe('ex7: Configure - Set Retries', () => {
  console.log('📁 Group: With Retries');
  
  // Configure this group: retry up to 2 times
  test.describe.configure({ retries: 2 });

  test('might be flaky', async ({ page }, testInfo) => {
    console.log(`  Attempt: ${testInfo.retry + 1}`);
    // This test will retry up to 2 times if it fails
  });

  test('another flaky test', async ({ page }, testInfo) => {
    console.log(`  Attempt: ${testInfo.retry + 1}`);
    // This also retries up to 2 times
  });
});

// ============================================================================
// EXAMPLE 8: Configure - Timeout
// ============================================================================

test.describe('ex8: Configure - Set Timeout', () => {
  console.log('📁 Group: With Custom Timeout');
  
  // Configure timeout for all tests in this group
  test.describe.configure({ timeout: 30000 });  // 30 seconds

  test('slow operation', async ({ page }) => {
    console.log('  Testing slow operation (30s timeout)');
    // This test has 30 second timeout
  });

  test('another slow test', async ({ page }) => {
    console.log('  Another slow test (30s timeout)');
    // This also has 30 second timeout
  });
});

// ============================================================================
// EXAMPLE 9: Configure - Serial Mode
// ============================================================================

test.describe.serial('ex9: Configure - Serial Execution', () => {
  console.log('📁 Group: Serial (Sequential)');
  
  test('step 1 - setup data', async ({ page }) => {
    console.log('  📍 Step 1 - Creates data');
  });

  test('step 2 - uses step 1 data', async ({ page }) => {
    console.log('  📍 Step 2 - Uses data from step 1');
  });

  test('step 3 - final verification', async ({ page }) => {
    console.log('  📍 Step 3 - Verifies all steps');
  });
});

// ============================================================================
// EXAMPLE 10: Nested Groups - Two Levels
// ============================================================================

test.describe('ex10: Nested Groups - E-Commerce', () => {
  console.log('📁 Group: E-Commerce');
  
  test.describe('Shopping Cart', () => {
    console.log('  📁 Subgroup: Shopping Cart');
    
    test('add item to cart', async ({ page }) => {
      console.log('    ✓ Add item');
    });

    test('remove item from cart', async ({ page }) => {
      console.log('    ✓ Remove item');
    });

    test('update quantity', async ({ page }) => {
      console.log('    ✓ Update quantity');
    });
  });

  test.describe('Checkout', () => {
    console.log('  📁 Subgroup: Checkout');
    
    test('enter shipping address', async ({ page }) => {
      console.log('    ✓ Enter address');
    });

    test('select payment method', async ({ page }) => {
      console.log('    ✓ Select payment');
    });

    test('review order', async ({ page }) => {
      console.log('    ✓ Review order');
    });
  });
});

// ============================================================================
// EXAMPLE 11: Nested Groups - Three Levels
// ============================================================================

test.describe('ex11: Deeply Nested Groups', () => {
  console.log('📁 Group: Application');
  
  test.describe('Admin Panel', () => {
    console.log('  📁 Subgroup: Admin Panel');
    
    test.describe('User Management', () => {
      console.log('    📁 Subgroup: User Management');
      
      test('list users', async ({ page }) => {
        console.log('      ✓ List users');
      });

      test('create user', async ({ page }) => {
        console.log('      ✓ Create user');
      });

      test('edit user', async ({ page }) => {
        console.log('      ✓ Edit user');
      });

      test('delete user', async ({ page }) => {
        console.log('      ✓ Delete user');
      });
    });

    test.describe('Permissions', () => {
      console.log('    📁 Subgroup: Permissions');
      
      test('assign role', async ({ page }) => {
        console.log('      ✓ Assign role');
      });

      test('set permissions', async ({ page }) => {
        console.log('      ✓ Set permissions');
      });
    });
  });
});

// ============================================================================
// EXAMPLE 12: Nested Hooks - Inheritance
// ============================================================================

test.describe('ex12: Nested Hooks - Setup Inheritance', () => {
  console.log('📁 Group: Parent');
  
  test.beforeEach(async ({ page }) => {
    console.log('  🟡 Parent beforeEach');
  });

  test('parent test', async ({ page }) => {
    console.log('    ✓ Parent test runs');
  });

  test.describe('Child Group', () => {
    console.log('  📁 Subgroup: Child');
    
    test.beforeEach(async ({ page }) => {
      console.log('    🟡 Child beforeEach');
    });

    test('child test 1', async ({ page }) => {
      console.log('      ✓ Child test 1 (parent + child beforeEach)');
    });

    test('child test 2', async ({ page }) => {
      console.log('      ✓ Child test 2 (parent + child beforeEach)');
    });
  });
});

// ============================================================================
// EXAMPLE 13: Only - Run Specific Group
// ============================================================================

test.describe('ex13a: Group A - Regular', () => {
  console.log('📁 Group A');
  
  test('test in group A', async ({ page }) => {
    console.log('  ✓ Group A test');
    // This will SKIP because of .only below
  });
});

test.describe.only('ex13b: Group B - Only', () => {
  console.log('📁 Group B (ONLY)');
  
  test('test in group B', async ({ page }) => {
    console.log('  ✓ Group B test (RUNS)');
    // Only this group runs
  });
});

test.describe('ex13c: Group C - Regular', () => {
  console.log('📁 Group C');
  
  test('test in group C', async ({ page }) => {
    console.log('  ✓ Group C test');
    // This will SKIP because of .only in Group B
  });
});

// ============================================================================
// EXAMPLE 14: Skip - Disable Group
// ============================================================================

test.describe.skip('ex14: Skipped Group', () => {
  console.log('📁 Skipped Group');
  
  test('skipped test 1', async ({ page }) => {
    console.log('  ✓ This is skipped');
  });

  test('skipped test 2', async ({ page }) => {
    console.log('  ✓ This is skipped');
  });
});

test.describe('ex14b: Normal Group', () => {
  console.log('📁 Normal Group');
  
  test('normal test', async ({ page }) => {
    console.log('  ✓ This runs');
  });
});

// ============================================================================
// EXAMPLE 15: Real-World - E-Commerce with Serial Dependencies
// ============================================================================

test.describe.serial('ex15: Real-World E-Commerce Workflow', () => {
  console.log('📁 Group: E-Commerce Workflow (Serial)');
  
  let productId: string;
  let cartId: string;
  let orderId: string;

  test.beforeAll(async () => {
    console.log('  🔵 beforeAll: Initialize test environment');
  });

  test.describe('Product Discovery', () => {
    test('search for product', async ({ page }) => {
      console.log('  1️⃣ Search for product');
      productId = 'prod-123';
    });
  });

  test.describe('Cart Operations', () => {
    test('add to cart', async ({ page }) => {
      console.log(`  2️⃣ Add product ${productId} to cart`);
      expect(productId).toBe('prod-123');
      cartId = 'cart-456';
    });

    test('verify item in cart', async ({ page }) => {
      console.log(`  2️⃣ Verify cart ${cartId} has items`);
      expect(cartId).toBe('cart-456');
    });
  });

  test.describe('Checkout', () => {
    test('proceed to checkout', async ({ page }) => {
      console.log(`  3️⃣ Checkout from cart ${cartId}`);
      expect(cartId).toBe('cart-456');
    });

    test('complete purchase', async ({ page }) => {
      console.log('  3️⃣ Complete purchase');
      orderId = 'order-789';
    });
  });

  test.describe('Order Verification', () => {
    test('verify order', async ({ page }) => {
      console.log(`  4️⃣ Verify order ${orderId}`);
      expect(orderId).toBe('order-789');
    });
  });

  test.afterAll(async () => {
    console.log('  🔴 afterAll: Clean up test data');
  });
});

// ============================================================================
// EXAMPLE 16: Mixed Serial and Parallel
// ============================================================================

test.describe('ex16: Mixed Serial and Parallel', () => {
  console.log('📁 Group: Mixed Execution');
  
  test.describe.serial('Sequential Setup', () => {
    console.log('  📁 Subgroup: Serial (Sequential)');
    
    test('setup 1', async () => {
      console.log('    ✓ Setup 1 (runs first)');
    });

    test('setup 2', async () => {
      console.log('    ✓ Setup 2 (runs second)');
    });
  });

  test.describe('Parallel Tests', () => {
    console.log('  📁 Subgroup: Parallel');
    
    test('test 1', async () => {
      console.log('    ✓ Test 1 (parallel)');
    });

    test('test 2', async () => {
      console.log('    ✓ Test 2 (parallel)');
    });

    test('test 3', async () => {
      console.log('    ✓ Test 3 (parallel)');
    });
  });
});

// ============================================================================
// EXAMPLE 17: Complex Real-World API Testing
// ============================================================================

test.describe('ex17: Complex API Testing with Shared Setup', () => {
  console.log('📁 Group: API Testing');
  
  let authToken: string;
  let userId: string;

  test.beforeAll(async () => {
    console.log('  🔵 beforeAll: Authenticate once');
    // Simulate auth
    authToken = 'token-abc123';
    console.log('  ✓ Authentication complete');
  });

  test.describe('User Endpoints', () => {
    test('get profile', async ({ page }) => {
      console.log(`  📝 GET /users/me (token: ${authToken.substring(0, 5)}...)`);
      userId = 'user-123';
      expect(authToken).toBeTruthy();
    });

    test('update profile', async ({ page }) => {
      console.log(`  📝 PUT /users/${userId}`);
      expect(userId).toBe('user-123');
    });
  });

  test.describe('Post Endpoints', () => {
    test('list posts', async ({ page }) => {
      console.log(`  📝 GET /users/${userId}/posts`);
      expect(userId).toBe('user-123');
    });

    test('create post', async ({ page }) => {
      console.log(`  📝 POST /posts (user: ${userId})`);
      expect(userId).toBe('user-123');
    });
  });

  test.describe('Comment Endpoints', () => {
    test('list comments', async ({ page }) => {
      console.log('  📝 GET /posts/{id}/comments');
    });

    test('create comment', async ({ page }) => {
      console.log('  📝 POST /comments');
    });
  });

  test.afterAll(async () => {
    console.log('  🔴 afterAll: Cleanup');
    console.log('  ✓ Tests completed');
  });
});

// ============================================================================
// EXAMPLE 18: Test Data Fixtures with Groups
// ============================================================================

test.describe('ex18: Test Data Management', () => {
  console.log('📁 Group: Test Data Management');
  
  interface TestData {
    userId: string;
    email: string;
    productId: string;
  }

  let testData: TestData;

  test.beforeAll(async () => {
    console.log('  🔵 beforeAll: Create test data');
    testData = {
      userId: 'user-12345',
      email: 'test@example.com',
      productId: 'prod-67890',
    };
  });

  test.describe('User Tests', () => {
    test('verify user data', async () => {
      console.log(`  ✓ User: ${testData.email}`);
      expect(testData.email).toBe('test@example.com');
    });

    test('verify user ID', async () => {
      console.log(`  ✓ User ID: ${testData.userId}`);
      expect(testData.userId).toBe('user-12345');
    });
  });

  test.describe('Product Tests', () => {
    test('verify product', async () => {
      console.log(`  ✓ Product: ${testData.productId}`);
      expect(testData.productId).toBe('prod-67890');
    });
  });

  test.afterAll(async () => {
    console.log('  🔴 afterAll: Cleanup test data');
  });
});

/**
 * RUNNING THESE EXAMPLES:
 * =======================
 * 
 * 1. Run all examples:
 *    npx playwright test pw_16_1_groupingtests.spec.ts
 * 
 * 2. Run specific group:
 *    npx playwright test -g "ex1: Basic"
 * 
 * 3. Run group pattern:
 *    npx playwright test -g "ex1.*"
 * 
 * 4. Run with list (shows structure):
 *    npx playwright test --list
 * 
 * 5. Run serial (one at a time):
 *    npx playwright test --workers=1
 * 
 * 6. Run parallel (multiple workers):
 *    npx playwright test --workers=4
 * 
 * 7. View HTML report:
 *    npx playwright show-report
 * 
 * OUTPUT STRUCTURE:
 * =================
 * 
 * ex1: Basic Group
 *   ✓ valid credentials
 *   ✓ invalid email format
 *   ✓ missing password
 * 
 * ex2a: Shopping Cart
 *   ✓ add item
 *   ✓ remove item
 * 
 * ex2b: Checkout
 *   ✓ shipping address
 *   ✓ payment method
 * 
 * ... etc
 * 
 * KEY PATTERNS:
 * =============
 * 
 * ✅ Use beforeEach for fresh setup each test
 * ✅ Use beforeAll for expensive one-time setup
 * ✅ Use serial for dependent tests
 * ✅ Use parallel for independent tests
 * ✅ Nest logically related groups
 * ✅ Configure retries/timeout per group if needed
 * 
 * ❌ Don't nest too deeply (hard to read)
 * ❌ Don't use serial when parallel works
 * ❌ Don't share state between tests
 * ❌ Don't forget afterEach cleanup
 */
