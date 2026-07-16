# XPath Axes - Complete Guide

## Coverage Summary

✅ **ALL 9 PRIMARY XPATH AXES NOW COVERED**

### Axes by Category

#### Vertical Axes (Parent-Child Relationships)
| Axis | Direction | Scope | Returns | Status |
|------|-----------|-------|---------|--------|
| `parent::` | UP 1 level | Direct parent only | 0-1 element | ✅ Test 15 (pw_xpath.spec.ts) |
| `child::` | DOWN 1 level | Direct children | Multiple | ✅ Test 15 (pw_xpath.spec.ts) |
| `ancestor::` | UP all levels | All parents | Multiple | ✅ Test 14 (pw_xpath.spec.ts) |
| `descendant::` | DOWN all levels | All children | Multiple | ✅ Test 14 (pw_xpath.spec.ts) |

#### Sibling Axes (Same Parent Level)
| Axis | Direction | Scope | Returns | Status |
|------|-----------|-------|---------|--------|
| `following-sibling::` | FORWARD | Siblings after | Multiple | ✅ Test 13 (pw_xpath.spec.ts) |
| `preceding-sibling::` | BACKWARD | Siblings before | Multiple | ✅ Test 13 (pw_xpath.spec.ts) |

#### Document Order Axes (Anywhere in Document)
| Axis | Direction | Scope | Returns | Status |
|------|-----------|-------|---------|--------|
| `following::` | FORWARD | Any element after | Multiple | ✅ Test 16 (pw_xpath.spec.ts) |
| `preceding::` | BACKWARD | Any element before | Multiple | ✅ Test 16 (pw_xpath.spec.ts) |

#### Self Axis (Current Element)
| Axis | Direction | Scope | Returns | Status |
|------|-----------|-------|---------|--------|
| `self::` | NONE | Current element | 0-1 element | ✅ Test 14 (pw_xpath.spec.ts) |

---

## Test Files Organization

### 1. pw_xpath.spec.ts (Main Tutorial)
**14+ comprehensive tests covering all axes with detailed explanations**

- **Test 1-6**: Basic XPath techniques
- **Test 7-12**: Functions and attributes
- **Test 13**: Sibling axes (following-sibling::, preceding-sibling::) - 9 examples
- **Test 14**: Vertical axes (ancestor::, descendant::, self::) - 6+ examples per axis
- **Test 15**: Parent and child axes - Direct relationships
- **Test 16**: Following and preceding axes - Document order navigation
- **Test 17**: Attribute functions

### 2. pwlocators.spec.ts (Builtin Locators Comparison)
**Comprehensive guide comparing Playwright locators with XPath**

- Full tests for text() vs normalize-space()
- Full tests for textContent() vs allTextContents()
- Sibling axes test with 10 examples
- Vertical axes test with 10+ examples
- Parent and child axes test with 10 examples
- Following and preceding axes test with 10 examples

### 3. pwxpathlocators.spec.ts (Deep XPath Dive)
**Most detailed XPath axes documentation with extensive examples**

- Sibling axes test with 14 detailed examples
- Vertical axes test with 20+ examples
- Parent and child axes test with 8 examples
- Following and preceding axes test with 15 examples
- Comprehensive decision matrices and performance tips

---

## Quick Reference - Decision Matrix

### "Which axis do I need?"

```
Need parent?
├─ Only immediate parent? → parent::
└─ Any parent level? → ancestor::

Need children?
├─ Only direct children? → child::
└─ Any nesting level? → descendant::

Need elements after?
├─ At same parent level? → following-sibling::
└─ Anywhere in document? → following::

Need elements before?
├─ At same parent level? → preceding-sibling::
└─ Anywhere in document? → preceding::

Validating element type? → self::
```

---

## Key Differences

### Parent vs Ancestor
```
parent::         → Single element (immediate parent only)
ancestor::       → Multiple elements (all parents up to root)
ancestor::*[1]   → Same as parent:: (first ancestor)
```

### Child vs Descendant
```
child::          → Direct children only (1 level deep)
descendant::     → Any nesting level (any depth)
child::          → Same as / (single slash)
descendant::     → Same as // (double slash when starting)
```

### Following-sibling vs Following
```
following-sibling:: → Elements after at SAME parent level
following::         → ANY elements after (different parents OK)
following-sibling:: → Faster (limited scope)
following::         → More flexible
```

### Preceding-sibling vs Preceding
```
preceding-sibling:: → Elements before at SAME parent level
preceding::         → ANY elements before (different parents OK)
preceding-sibling:: → Faster (limited scope)
preceding::         → More flexible
```

---

## Example Patterns

### Finding Related Elements
```xpath
# Get image's containing link
//img/parent::a

# Get form containing input
//input[@name="password"]/parent::form

# Get all inputs in a form (any depth)
//form/descendant::input

# Get direct items in a list
//ul/child::li

# Get paragraphs after a heading
//h2/following::p

# Get label before input
//input/preceding::label[1]

# Get siblings after button
//button/following-sibling::*
```

### Navigation Chains
```xpath
# Go up then down
//button/ancestor::form/descendant::input

# Go up multiple levels
//img/parent::*/parent::*/parent::*

# Find across hierarchy
//h3/following::div/descendant::a

# Complex ancestor-descendant
//input/ancestor::div[@class="form-group"]/descendant::p
```

---

## Common Pitfalls & Solutions

### Pitfall 1: Confusing parent:: with ancestor::
```xpath
❌ //img/parent::div     → Returns only direct parent div (or nothing)
✅ //img/ancestor::div   → Returns any div parent (more flexible)
```

### Pitfall 2: Confusing child:: with descendant::
```xpath
❌ //form/child::input         → Only direct <input> children
✅ //form/descendant::input    → Any <input> at any depth
   (handles inputs wrapped in fieldset, div, etc)
```

### Pitfall 3: Confusing following-sibling:: with following::
```xpath
❌ //h2/following-sibling::p  → Paragraphs only if same parent
✅ //h2/following::p          → Any paragraph appearing after heading
   (works even if in different containers)
```

### Pitfall 4: Self-axis rarely needed
```xpath
❌ //a/self::a              → Redundant (already know it's <a>)
✅ //a/self::a[@href]       → Useful for complex conditions
```

---

## Performance Ranking

**Fastest → Slowest**

1. **parent::** - Single element, direct access
2. **child::** - Direct level, limited scope
3. **ancestor::** - Vertical only, no siblings
4. **descendant::** - Vertical only, no siblings
5. **following-sibling::** - Limited to same parent
6. **preceding-sibling::** - Limited to same parent
7. **following::** - Full document scope forward
8. **preceding::** - Full document scope backward
9. **self::** - Validation (rarely used)

**Optimization Tips:**
- ✓ Use specific types: `ancestor::div` faster than `ancestor::*`
- ✓ Add predicates early: `//form[@id]/descendant::input` better than `//form/descendant::input[@id]`
- ✓ Use sibling axes when structure guaranteed
- ✓ Use document order axes only when necessary

---

## Testing Files Location

- **Main tutorial**: [pw_xpath.spec.ts](pw_xpath.spec.ts) - Tests 13-17
- **Locator comparison**: [pwlocators.spec.ts](pwlocators.spec.ts) - Corresponding tests
- **Deep dive**: [pwxpathlocators.spec.ts](pwxpathlocators.spec.ts) - Comprehensive examples

---

## Run Tests Command

```bash
# Run all XPath tests
npx playwright test pw_xpath.spec.ts

# Run specific test
npx playwright test pw_xpath.spec.ts -g "Test 15"

# Run with reporter
npx playwright test pw_xpath.spec.ts --reporter=html
```

---

## Summary

**Status: 100% XPath Axes Coverage**

✅ All 9 primary axes documented  
✅ 50+ working examples  
✅ 3 comprehensive test files  
✅ Decision matrices and quick references  
✅ Performance and pitfall guidance  
✅ Real-world practical patterns  

The tutorial provides complete understanding of XPath axis navigation with practical examples in actual Playwright tests that can be run and verified.
