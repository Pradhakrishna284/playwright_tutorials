# Playwright Test Tagging Guide

## Overview
Tags are labels you add to tests to categorize, organize, and filter them. They allow you to run specific subsets of tests based on criteria like test type, priority, feature area, or environment.

## Table of Contents
1. [Basic Tag Syntax](#basic-tag-syntax)
2. [Common Tag Patterns](#common-tag-patterns)
3. [Running Tests with Tags](#running-tests-with-tags)
4. [Advanced Tagging Strategies](#advanced-tagging-strategies)
5. [Best Practices](#best-practices)
6. [Real-World Examples](#real-world-examples)

---

## Basic Tag Syntax

### Adding Tags to Tests
Tags are added as part of the test description using `@tagname` format:

```typescript
import { test } from '@playwright/test';

// Single tag
test('Login with email @smoke', async ({ page }) => {
  // Test code
});

// Multiple tags
test('Complete purchase @e2e @critical @payment', async ({ page }) => {
  // Test code
});

// Tags in test groups
test.describe('Authentication Suite @authentication', () => {
  test('Login @smoke @quick', async ({ page }) => {});
  test('Logout @smoke', async ({ page }) => {});
});
```

### Tag Naming Conventions
- Use lowercase: `@smoke`, not `@Smoke`
- Use hyphens for multi-word: `@api-integration`, not `@apiintegration`
- No spaces: `@e2e @critical`, not `@e2e critical`
- Keep them short and meaningful: `@slow`, not `@this_is_a_slow_test`

---

## Common Tag Patterns

### By Test Type
```typescript
// Unit tests - single component
test('Input validation @unit', async ({ page }) => {});

// Integration tests - multiple components
test('User registration flow @integration', async ({ page }) => {});

// End-to-end tests - full user journey
test('Complete checkout @e2e', async ({ page }) => {});

// API tests
test('Get user data @api', async ({ page }) => {});

// Visual regression tests
test('Button styling @visual', async ({ page }) => {});
```

### By Priority
```typescript
// Critical business functionality
test('Payment processing @critical', async ({ page }) => {});

// Important but not critical
test('Profile update @important', async ({ page }) => {});

// Nice to have features
test('Dark mode toggle @minor', async ({ page }) => {});
```

### By Execution Speed
```typescript
test('Quick validation @quick @smoke', async ({ page }) => {});
test('Download large file @slow', async ({ page }) => {});
test('Database migration @very-slow', async ({ page }) => {});
```

### By Feature Area
```typescript
test('Create new post @posts', async ({ page }) => {});
test('Add to cart @shopping', async ({ page }) => {});
test('Change password @account', async ({ page }) => {});
test('Process payment @billing', async ({ page }) => {});
```

### By Environment
```typescript
test('Production only check @prod', async ({ page }) => {});
test('Staging feature test @staging', async ({ page }) => {});
test('Development debug test @dev', async ({ page }) => {});
```

### By Smoke Testing
```typescript
// Smoke tests - quick sanity checks that core functionality works
test('Site loads @smoke', async ({ page }) => {});
test('Login works @smoke', async ({ page }) => {});
test('Search functions @smoke', async ({ page }) => {});
```

---

## Running Tests with Tags

### Filter by Single Tag
```bash
# Run only smoke tests
npx playwright test --grep @smoke

# Run only critical tests
npx playwright test --grep @critical

# Run only e2e tests
npx playwright test --grep @e2e
```

### Filter by Multiple Tags (OR logic)
```bash
# Run tests tagged @smoke OR @quick (either tag)
npx playwright test --grep "@smoke|@quick"
```

### Filter by Multiple Tags (AND logic)
```bash
# Run tests with BOTH @e2e AND @critical
npx playwright test --grep "(?=.*@e2e)(?=.*@critical)"
```

### Exclude Tags (negative matching)
```bash
# Run everything EXCEPT @slow tests
npx playwright test --grep-invert @slow

# Run everything EXCEPT @dev tests
npx playwright test --grep-invert @dev
```

### Combine with Other Filters
```bash
# Run @smoke tests on Chrome only
npx playwright test --grep @smoke --project chromium

# Run @critical tests on mobile
npx playwright test --grep @critical --project "Mobile Chrome"

# Run @quick tests in headed mode
npx playwright test --grep @quick --headed
```

### Run Specific File with Tags
```bash
# All tests in this file
npx playwright test tests/checkout.spec.ts

# Only @smoke tests in this file
npx playwright test tests/checkout.spec.ts --grep @smoke
```

---

## Advanced Tagging Strategies

### Combining Multiple Tag Categories

```typescript
test.describe('User Management Suite', () => {
  // Smoke test + quick + critical + unit
  test('Username validation @smoke @quick @critical @unit', async ({ page }) => {
    // Core functionality that needs constant validation
  });

  // Integration + important + slow
  test('User registration with database @integration @important @slow', async ({ page }) => {
    // Requires database, takes time, but important
  });

  // E2E + critical + payment feature
  test('User upgrade to premium @e2e @critical @billing', async ({ page }) => {
    // Full user journey affecting revenue
  });

  // API + dev-only
  test('Debug endpoint @api @dev', async ({ page }) => {
    // Only used during development
  });
});
```

### Conditional Tagging
```typescript
test('Payment processing', async ({ page, browserName }) => {
  // Tag changes based on conditions
  const tags = ['@payment'];
  
  if (browserName === 'webkit') {
    tags.push('@safari-only');
  }
  
  if (process.env.ENVIRONMENT === 'staging') {
    tags.push('@staging-only');
  }
  
  // Test description would include these tags
  // Example: 'Payment processing @payment @safari-only @staging-only'
});
```

### Tag Hierarchy
```typescript
// Feature group tags
test('Feature A: Create @feature-a @features', async ({ page }) => {});
test('Feature A: Read @feature-a @features', async ({ page }) => {});
test('Feature A: Update @feature-a @features', async ({ page }) => {});
test('Feature A: Delete @feature-a @features', async ({ page }) => {});

// Run all Feature A tests
// npx playwright test --grep @feature-a

// Run all tests in features group
// npx playwright test --grep @features
```

---

## Best Practices

### ✅ DO

1. **Use Consistent Naming**
   ```typescript
   // Good
   test('Login success @smoke @authentication @quick', async ({ page }) => {});
   test('Payment process @e2e @critical @billing', async ({ page }) => {});
   ```

2. **Combine Related Tags**
   ```typescript
   // Good - related tags grouped
   test('Create user @auth @registration @api @quick', async ({ page }) => {});
   ```

3. **Keep Tags Meaningful**
   ```typescript
   // Good
   test('Complex calculation @slow @math @critical', async ({ page }) => {});
   ```

4. **Use Tags for CI/CD Pipeline**
   ```typescript
   // Smoke tests run on every commit
   test('Login works @smoke', async ({ page }) => {});
   
   // Full test suite only on release
   test('Comprehensive test @nightly', async ({ page }) => {});
   ```

### ❌ DON'T

1. **Don't Use Vague Tags**
   ```typescript
   // Bad
   test('Something important @test @testing @important', async ({ page }) => {});
   
   // Good
   test('Payment processing @e2e @critical @payment', async ({ page }) => {});
   ```

2. **Don't Overuse Tags**
   ```typescript
   // Bad - too many tags
   test('Login @auth @quick @smoke @unit @critical @important @core', async ({ page }) => {});
   
   // Good - essential tags only
   test('Login @smoke @critical @auth', async ({ page }) => {});
   ```

3. **Don't Mix Case**
   ```typescript
   // Bad
   test('Something @Smoke @CRITICAL @Auth', async ({ page }) => {});
   
   // Good
   test('Something @smoke @critical @auth', async ({ page }) => {});
   ```

4. **Don't Create Too Many Tag Categories**
   ```typescript
   // Bad - 50+ different tags
   @user1 @user2 @browser1 @browser2 ...
   
   // Good - focus on actionable categories
   @smoke @critical @e2e @slow @auth
   ```

---

## Real-World Examples

### Typical CI/CD Pipeline Setup

```bash
# Fast feedback on every commit (2-5 minutes)
npm run test:smoke
# npx playwright test --grep "@smoke"

# Full test suite on PR (15-30 minutes)
npm run test:full
# npx playwright test

# Nightly comprehensive tests (1-2 hours)
npm run test:nightly
# npx playwright test --grep "@nightly"

# Load testing (30 minutes)
npm run test:load
# npx playwright test --grep "@load"
```

### Example Test Suite Organization

```typescript
// tests/authentication.spec.ts
test('Login with email @smoke @critical @auth', async ({ page }) => {});
test('Logout @smoke @auth', async ({ page }) => {});
test('Password reset @auth @slow', async ({ page }) => {});
test('OAuth integration @auth @e2e', async ({ page }) => {});

// tests/checkout.spec.ts
test('Add to cart @smoke @shopping', async ({ page }) => {});
test('Proceed to checkout @e2e @critical @payment', async ({ page }) => {});
test('Apply coupon @shopping @discount', async ({ page }) => {});
test('Payment processing @critical @payment @slow', async ({ page }) => {});

// tests/admin.spec.ts
test('Admin dashboard loads @admin @smoke', async ({ page }) => {});
test('User management @admin @critical', async ({ page }) => {});
test('Report generation @admin @slow @dev', async ({ page }) => {});
```

### Running Strategy by Phase

```bash
# LOCAL DEVELOPMENT
# Run smoke tests only (fast feedback)
npm run test:smoke

# PULL REQUEST
# Run all tests with tags (full validation)
npm run test:full

# NIGHTLY BUILDS
# Include slow, load, and comprehensive tests
npm run test:nightly

# PRODUCTION DEPLOYMENT
# Smoke + critical tests (quick confidence check)
npm run test:pre-deploy
```

### Tag Usage Statistics

```bash
# See which tags are used
grep -r "@" tests/*.spec.ts | grep -o "@[a-z-]*" | sort | uniq -c

# Run and report on test counts
npx playwright test --grep "@smoke" --reporter=list

# Dry run - show which tests would run
npx playwright test --grep "@critical" --dry-run
```

---

## Summary

| Tag Type | Examples | Use Case |
|----------|----------|----------|
| **Speed** | `@smoke`, `@quick`, `@slow` | Control test duration |
| **Priority** | `@critical`, `@important`, `@minor` | Business impact |
| **Type** | `@e2e`, `@unit`, `@integration`, `@api` | Test classification |
| **Feature** | `@auth`, `@payment`, `@shopping` | Product areas |
| **Environment** | `@dev`, `@staging`, `@prod` | Where to run |
| **Execution** | `@nightly`, `@smoke`, `@load` | When to run |

