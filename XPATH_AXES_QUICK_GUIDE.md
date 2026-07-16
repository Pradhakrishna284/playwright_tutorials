# XPath Axes - Quick Decision Guide

## One-Page Reference

### Which Axis Do I Need?

```
┌─ "Do I know the PARENT/CONTAINER?"
│  │
│  ├─ YES, and I need to find CHILDREN
│  │  └─ "Are children nested at different levels?"
│  │     ├─ YES → Use descendant::   (Works at any depth)
│  │     └─ NO  → Use child::        (Direct level only)
│  │
│  └─ NO, I have CHILD/ELEMENT and need PARENT
│     └─ "How far up?"
│        ├─ Only immediate parent → Use parent::  (Returns 1 or 0)
│        └─ Any parent level      → Use ancestor:: (Returns multiple)
│
├─ "Do I know the REFERENCE ELEMENT?"
│  │
│  ├─ YES, need ELEMENTS AFTER
│  │  └─ "Same parent level?"
│  │     ├─ YES → Use following-sibling::  (Faster, limited)
│  │     └─ NO  → Use following::          (Flexible, any level)
│  │
│  └─ YES, need ELEMENTS BEFORE
│     └─ "Same parent level?"
│        ├─ YES → Use preceding-sibling::  (Faster, limited)
│        └─ NO  → Use preceding::          (Flexible, any level)
│
└─ "Validating element TYPE?"
   └─ Use self:: (Rarely needed - selector already specifies type)
```

---

## Cheat Sheet

| Need | Axis | Example | Returns |
|------|------|---------|---------|
| Direct parent | `parent::` | `//img/parent::a` | 1 or 0 |
| Any parent level | `ancestor::` | `//img/ancestor::div` | Many |
| Direct children | `child::` | `//ul/child::li` | Many |
| Nested children | `descendant::` | `//form/descendant::input` | Many |
| Siblings after | `following-sibling::` | `//li/following-sibling::li` | Many |
| Any after | `following::` | `//h2/following::p` | Many |
| Siblings before | `preceding-sibling::` | `//li/preceding-sibling::li` | Many |
| Any before | `preceding::` | `//input/preceding::label` | Many |
| Validation | `self::` | `//a/self::a[@href]` | 0 or 1 |

---

## Common Scenarios

### "I found an input, need its label"
```xpath
✅ //input/preceding::label      # Any label before it
✅ //input/preceding-sibling::label  # Label at same level (if guaranteed)
```

### "I found a heading, need content after it"
```xpath
✅ //h2/following::p    # All paragraphs after heading
✅ //h2/following::div  # All divs after heading
```

### "I found a button, need its containing form"
```xpath
✅ //button/ancestor::form      # Any form parent
✅ //button/parent::form        # Only direct parent form
```

### "I found a link, need all links in its list"
```xpath
✅ //a/ancestor::ul/descendant::a  # All links in containing ul
✅ //a/ancestor::li/following-sibling::li/descendant::a  # Following items
```

### "Get all form inputs (might be deeply nested)"
```xpath
✅ //form/descendant::input     # Any nesting level
❌ //form/child::input          # Only direct level (might miss some)
```

---

## Performance Ranking

### ⚡ Fastest (Use First)
1. `parent::` - Direct pointer
2. `child::` - Direct level, single direction

### ⚡⚡ Medium (Usually Fine)
3. `ancestor::` - Limited scope (up only)
4. `descendant::` - Limited scope (down only)
5. `following-sibling::` - Limited scope (siblings only)
6. `preceding-sibling::` - Limited scope (siblings only)

### ⚡⚡⚡ Slower (Use When Necessary)
7. `following::` - Full document scope
8. `preceding::` - Full document scope
9. `self::` - Validation (rarely needed)

---

## Optimization Tips

```xpath
✅ // Good - Specific type
//ancestor::form

❌ // Slower - Generic wildcard
//ancestor::*

✅ // Good - Filter in predicate
//ancestor::div[@id="main"]

❌ // Slower - Filter after
//ancestor::div/@id

✅ // Good - Use sibling when structure guaranteed
//button/following-sibling::span

❌ // Slower - Use general when not sure
//button/following::span
```

---

## Real-World Examples

### E-commerce Form
```xpath
// Get quantity input's label
//input[@name="quantity"]/preceding::label[1]

// Get all form inputs
//form[@id="cart"]/descendant::input

// Get submit button's parent form
//button[text()="Add to Cart"]/ancestor::form

// Get error message related inputs
//span[@class="error"]/preceding::input
```

### Navigation Menu
```xpath
// Get all menu items
//nav/descendant::li

// Get direct menu items (not submenus)
//nav/child::ul/child::li

// Get next menu item
//li[@class="active"]/following-sibling::li[1]

// Get previous menu item
//li[@class="active"]/preceding-sibling::li[1]
```

### Search Results
```xpath
// Get all results after a heading
//h2[text()="Results"]/following::div[@class="result"]

// Get result's title (inside result div)
//div[@class="result"]/descendant::a[@class="title"]

// Get labels before inputs
//input[@name="filter"]/preceding::label

// Get next page button
//a[@class="current"]/following-sibling::a[1]
```

---

## Common Mistakes

```xpath
❌ //div/parent::div         # Wrong! Parent not another div
✅ //div/ancestor::div       # Right! Find any div ancestor

❌ //ul/child::a             # Wrong! <a> is not direct child of <ul>
✅ //ul/descendant::a        # Right! <a> might be nested

❌ //li/following-sibling::p # Wrong! <p> is not sibling of <li>
✅ //li/following::p         # Right! Find any <p> after

❌ //a/self::a              # Redundant! Already know it's <a>
✅ //a/self::a[@href]       # OK! Validating it has href
```

---

## Test Command

```bash
# See these axes in action:
npx playwright test pw_xpath.spec.ts -g "Test 1[4-6]"

# Or run individual tests:
npx playwright test pw_xpath.spec.ts -g "Test 14"  # Ancestor/descendant/self
npx playwright test pw_xpath.spec.ts -g "Test 15"  # Parent/child
npx playwright test pw_xpath.spec.ts -g "Test 16"  # Following/preceding
```

---

## Remember

- **parent/ancestor** = Going UP (parent relationships)
- **child/descendant** = Going DOWN (nested children)
- **following-sibling/preceding-sibling** = Same level (horizontal)
- **following/preceding** = Document order (any level)
- **self** = Current element (validation only)

**Key Insight:** Sibling axes are faster but limited. Document-order axes are flexible but slower. Choose based on DOM structure predictability.
