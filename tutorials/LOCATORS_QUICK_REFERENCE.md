# PLAYWRIGHT LOCATORS - QUICK REFERENCE GUIDE

## 🎯 Priority Order (Use in This Order)

| Priority | Locator | Best For | User-Facing? |
|----------|---------|----------|--------------|
| **1st** ⭐ | `getByRole()` | Interactive elements, accessibility | ✅ Yes |
| **2nd** ⭐ | `getByLabel()` | Form fields | ✅ Yes |
| **3rd** | `getByPlaceholder()` | Search boxes, inputs without labels | ✅ Yes |
| **4th** | `getByText()` | Non-interactive content | ✅ Yes |
| **5th** | `getByAltText()` | Images | ✅ Yes |
| **6th** | `getByTitle()` | Tooltips, icon buttons | ✅ Yes |
| **7th** ⭐ | `getByTestId()` | Most resilient, translations | ❌ No |
| **8th** ⚠️ | `locator()` | Last resort only | ❌ No |

---

## 🔄 await Usage Rules

### ✅ USE await FOR:

#### Actions (return Promises):
```typescript
await page.getByRole('button').click()
await page.getByLabel('Email').fill('test@example.com')
await page.getByRole('checkbox').check()
await page.getByPlaceholder('Search').press('Enter')
await page.getByAltText('Logo').hover()
```

#### Assertions (return Promises):
```typescript
await expect(page.getByText('Success')).toBeVisible()
await expect(page.getByRole('heading')).toHaveText('Welcome')
await expect(page.getByLabel('Email')).toBeEnabled()
```

#### Getters (return Promises):
```typescript
const text = await page.getByText('Price').textContent()
const value = await page.getByLabel('Email').inputValue()
const count = await page.getByRole('listitem').count()
```

### ❌ DON'T USE await FOR:

#### Creating Locators (they're lazy):
```typescript
const button = page.getByRole('button')        // NO await
const email = page.getByLabel('Email')         // NO await
const logo = page.getByAltText('Logo')         // NO await
```

---

## 📋 All Locators At-A-Glance

### 1️⃣ getByRole() - MOST RECOMMENDED ⭐

**When:** Interactive elements (buttons, links, inputs, headings)  
**Why:** Tests accessibility, reflects user experience  
**await:** For actions and assertions only

```typescript
// Creating locator (NO await)
const button = page.getByRole('button', { name: 'Submit' })

// Using locator (YES await)
await button.click()
await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
```

**Common Roles:**
- `button`, `link`, `textbox`, `checkbox`, `radio`
- `heading`, `list`, `listitem`, `table`, `row`, `cell`
- `dialog`, `alert`, `navigation`, `main`

---

### 2️⃣ getByLabel() - BEST FOR FORMS ⭐

**When:** Form inputs with `<label>` elements  
**Why:** Mirrors how users find form fields  
**await:** For fill/check actions and assertions

```typescript
// Creating locator (NO await)
const emailInput = page.getByLabel('Email Address')

// Using locator (YES await)
await emailInput.fill('user@example.com')
await page.getByLabel('Newsletter').check()
```

---

### 3️⃣ getByPlaceholder()

**When:** Inputs without labels, search boxes  
**Why:** Placeholder is visible hint to users  
**await:** For fill/press actions

```typescript
const searchBox = page.getByPlaceholder('Search...')
await searchBox.fill('laptop')
await searchBox.press('Enter')
```

---

### 4️⃣ getByText()

**When:** Non-interactive text content (div, span, p)  
**Why:** Text is what users see  
**await:** For assertions, rarely for clicks

```typescript
await expect(page.getByText('Welcome')).toBeVisible()
await expect(page.getByText('Success', { exact: true })).toHaveText('Success')

// Regex matching
await expect(page.getByText(/welcome/i)).toBeVisible()
```

**⚠️ Avoid:** Don't use for buttons/links - use `getByRole` instead

---

### 5️⃣ getByAltText()

**When:** Images, areas with alt attributes  
**Why:** Alt text required for accessibility  
**await:** For click/visibility checks

```typescript
const logo = page.getByAltText('Company Logo')
await logo.click()
await expect(logo).toBeVisible()
```

---

### 6️⃣ getByTitle()

**When:** Elements with title attributes, tooltips  
**Why:** Title shows on hover  
**await:** For hover/click actions

```typescript
await page.getByTitle('Settings').click()
await page.getByTitle('Help').hover()
```

---

### 7️⃣ getByTestId() - MOST RESILIENT ⭐

**When:** Text/structure changes frequently, translations  
**Why:** Dedicated test attribute won't change  
**await:** For all actions and assertions

```typescript
// HTML: <button data-testid="submit-btn">Submit</button>
await page.getByTestId('submit-btn').click()
await expect(page.getByTestId('error-msg')).toBeVisible()
```

**Configuration:**
```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    testIdAttribute: 'data-testid'  // or 'data-pw', 'data-qa'
  }
});
```

**Best Practices:**
- ✅ Use kebab-case: `'submit-login-form'`
- ✅ Be descriptive: `'shopping-cart-icon'`
- ❌ Avoid: `'btn1'`, `'div2'`

---

### 8️⃣ locator() - LAST RESORT ⚠️

**When:** Only when all other methods fail  
**Why:** Fragile, tied to DOM structure  
**await:** For actions only

```typescript
// CSS
await page.locator('.submit-btn').click()
await page.locator('#email').fill('test@example.com')
await page.locator('input[name="q"]').fill('search')

// XPath (even more fragile)
await page.locator('//button[text()="Submit"]').click()
```

**Why Avoid:**
- ❌ Breaks when HTML changes
- ❌ Long selectors are unstable
- ❌ Not user-facing
- ❌ No accessibility testing

**BAD Examples:**
```typescript
// DON'T DO THIS - Too fragile!
await page.locator('#main > div:nth-child(2) > form > input[3]').click()
```

**Better Alternatives:**
```typescript
// ✅ INSTEAD USE:
await page.getByRole('textbox', { name: 'Search' })
await page.getByPlaceholder('Search store')
await page.getByLabel('Search')
```

---

## 🎓 Key Concepts

### Why Locators are Lazy:
- Element is **NOT** found when you create the locator
- Element is found **ONLY** when you perform an action
- Benefits:
  - Auto-waiting for element to appear
  - Auto-retry if element not ready
  - Fresh element every time (handles dynamic content)

### Auto-Waiting Checklist:
When you `await` an action, Playwright automatically waits for:
- ✅ Element attached to DOM
- ✅ Element visible
- ✅ Element stable (not animating)
- ✅ Element enabled
- ✅ Element receives events (not covered by others)

### Priority Strategy:

1. **Always try `getByRole()` first** - Tests accessibility
2. **Use `getByLabel()` for forms** - Semantic and stable
3. **Use `getByTestId()` for dynamic content** - Most resilient
4. **Use `locator()` only as last resort** - Most fragile

---

## 📊 Quick Decision Tree

```
Need to interact with element?
│
├─ Is it interactive (button, link, input)?
│  └─ ✅ Use getByRole()
│
├─ Is it a form field with label?
│  └─ ✅ Use getByLabel()
│
├─ Is it a search box with placeholder?
│  └─ ✅ Use getByPlaceholder()
│
├─ Is it an image?
│  └─ ✅ Use getByAltText()
│
├─ Does it have tooltip/title?
│  └─ ✅ Use getByTitle()
│
├─ Is it text content?
│  └─ ✅ Use getByText()
│
├─ Changes frequently (translation, A/B)?
│  └─ ✅ Use getByTestId()
│
└─ Nothing else works?
   └─ ⚠️ Use locator() (last resort)
```

---

## 💡 Best Practices

### ✅ DO:
- Prefer user-facing locators (role, label, text)
- Test accessibility with `getByRole()`
- Use `getByTestId()` sparingly (when text/structure unstable)
- Combine locators: `page.getByRole('navigation').getByRole('link', { name: 'Home' })`
- Write tests that reflect user behavior

### ❌ DON'T:
- Avoid CSS/XPath unless absolutely necessary
- Don't use `await` when creating locators
- Don't chain nth-child selectors
- Don't use ID/class selectors if role/text available
- Don't test implementation details

---

## 🔗 Related Files

- **pwlocators.spec.ts** - Comprehensive examples for all locators
- **07_Locators_Complete_Guide.txt** - Detailed explanations
- **08_Locators_Interview_Questions.txt** - Q&A format
- **09_Locators_Practical_Examples.txt** - Code examples

---

## 📚 Additional Resources

- [Official Playwright Locators Docs](https://playwright.dev/docs/locators)
- [ARIA Roles Reference](https://www.w3.org/TR/wai-aria-1.2/#role_definitions)
- [Accessibility Best Practices](https://playwright.dev/docs/accessibility-testing)

---

**Last Updated:** December 28, 2025  
**Version:** 1.0
