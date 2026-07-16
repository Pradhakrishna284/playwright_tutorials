import { test } from '@playwright/test';

test.describe('Playwright Workers & Parallelization - Comprehensive Guide', () => {

test('Workers Configuration - Understanding Worker Allocation', async ({page}) => {
    await page.goto('https://demowebshop.tricentis.com/');
    
    console.log(`
    ════════════════════════════════════════════════════════════════════════════
    PLAYWRIGHT WORKERS & PARALLELIZATION - COMPLETE GUIDE
    ════════════════════════════════════════════════════════════════════════════
    
    WHAT ARE WORKERS?
    ─────────────────────────────────────────────────────────────────────────────
    Workers are independent Node.js processes that Playwright spawns to run tests
    in parallel. Each worker has its own:
    ✓ Browser instance (or shared if configured)
    ✓ Page/context instances
    ✓ Memory space
    ✓ Execution thread
    
    This allows multiple tests to run simultaneously instead of sequentially.
    
    
    WORKER ALLOCATION LOGIC
    ─────────────────────────────────────────────────────────────────────────────
    
    SCENARIO 1: Undefined Workers (Default Behavior)
    ┌──────────────────────────────────────────────────────────────┐
    │ Config: workers: undefined                                    │
    ├──────────────────────────────────────────────────────────────┤
    │ CPU Cores → Auto-Detected Workers                            │
    │ ─────────────────────────────────────────────────────────────│
    │ 2 cores    → 2 workers                                        │
    │ 4 cores    → 4 workers                                        │
    │ 6 cores    → 6 workers  (← YOUR SYSTEM)                      │
    │ 8 cores    → 8 workers                                        │
    │ 16 cores   → 8 workers (max default)                          │
    │ 32 cores   → 8 workers (capped for stability)                 │
    └──────────────────────────────────────────────────────────────┘
    
    SCENARIO 2: Specific Number
    ┌──────────────────────────────────────────────────────────────┐
    │ Config: workers: 12                                           │
    ├──────────────────────────────────────────────────────────────┤
    │ Playwright spawns EXACTLY 12 worker processes                 │
    │ ✓ Useful when you want parallelism > CPU cores               │
    │ ✗ Warning: Can cause resource contention                     │
    └──────────────────────────────────────────────────────────────┘
    
    SCENARIO 3: Single Worker (Sequential)
    ┌──────────────────────────────────────────────────────────────┐
    │ Config: workers: 1                                            │
    ├──────────────────────────────────────────────────────────────┤
    │ All tests run one after another (sequential)                  │
    │ ✓ Predictable test order                                      │
    │ ✓ Low memory usage                                            │
    │ ✗ Slower (tests don't benefit from parallelism)              │
    └──────────────────────────────────────────────────────────────┘
    
    SCENARIO 4: CI Environment
    ┌──────────────────────────────────────────────────────────────┐
    │ Config: workers: process.env.CI ? 1 : undefined              │
    ├──────────────────────────────────────────────────────────────┤
    │ Local:  workers: undefined (auto-detect, e.g., 6)            │
    │ CI:     workers: 1 (sequential, controlled)                   │
    │                                                               │
    │ WHY?                                                          │
    │ ✓ CI systems have unpredictable CPU availability             │
    │ ✓ Parallel tests = flaky in shared environments              │
    │ ✓ Sequential = reliable, consistent results                  │
    └──────────────────────────────────────────────────────────────┘
    
    
    TEST DISTRIBUTION ALGORITHM
    ─────────────────────────────────────────────────────────────────────────────
    
    When you run: npx playwright test
    
    STEP 1: Worker Pool Creation
    ┌─────────────────────────────────────────────────────────────┐
    │ Playwright boots up N workers (e.g., 6)                      │
    │                                                              │
    │ Worker 1 ⟵ Browser Instance 1                               │
    │ Worker 2 ⟵ Browser Instance 2                               │
    │ Worker 3 ⟵ Browser Instance 3                               │
    │ Worker 4 ⟵ Browser Instance 4                               │
    │ Worker 5 ⟵ Browser Instance 5                               │
    │ Worker 6 ⟵ Browser Instance 6                               │
    └─────────────────────────────────────────────────────────────┘
    
    STEP 2: Test Queue Creation
    ┌─────────────────────────────────────────────────────────────┐
    │ All tests loaded into queue                                  │
    │                                                              │
    │ Queue: [test1, test2, test3, ..., test17]                   │
    │        ↑ Next to run
    └─────────────────────────────────────────────────────────────┘
    
    STEP 3: Distribution (Round-Robin)
    ┌─────────────────────────────────────────────────────────────┐
    │ ROUND 1: Distribute first N tests (6 tests for 6 workers)    │
    │                                                              │
    │ Worker 1 → test1                                             │
    │ Worker 2 → test2                                             │
    │ Worker 3 → test3                                             │
    │ Worker 4 → test4                                             │
    │ Worker 5 → test5                                             │
    │ Worker 6 → test6                                             │
    │                                                              │
    │ [Execution happens in PARALLEL]                              │
    │ (tests run simultaneously, not sequentially)                 │
    └─────────────────────────────────────────────────────────────┘
    
    STEP 4: Queue Consumption
    ┌─────────────────────────────────────────────────────────────┐
    │ As workers finish, they grab next test from queue            │
    │                                                              │
    │ Timeline:                                                    │
    │ t=0s:  All 6 workers start (6 tests running)                 │
    │ t=2s:  Worker 1 finishes test1 → grabs test7                 │
    │ t=4s:  Worker 3 finishes test3 → grabs test8                 │
    │ t=6s:  Other workers finish → grab test9-test12             │
    │ ...    Process continues until queue is empty                │
    └─────────────────────────────────────────────────────────────┘
    
    
    EXAMPLE: 17 Tests on 6 Workers
    ─────────────────────────────────────────────────────────────────────────────
    
    Distribution Pattern:
    
    ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
    │ Worker 1 │ │ Worker 2 │ │ Worker 3 │ │ Worker 4 │ │ Worker 5 │ │ Worker 6 │
    ├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤
    │ test1    │ │ test2    │ │ test3    │ │ test4    │ │ test5    │ │ test6    │
    │   ↓      │ │   ↓      │ │   ↓      │ │   ↓      │ │   ↓      │ │   ↓      │
    │ test7    │ │ test8    │ │ test9    │ │ test10   │ │ test11   │ │ test12   │
    │   ↓      │ │   ↓      │ │   ↓      │ │   ↓      │ │   ↓      │ │   ↓      │
    │ test13   │ │ test14   │ │ test15   │ │ test16   │ │ test17   │ │ (done)   │
    │ (done)   │ │ (done)   │ │ (done)   │ │ (done)   │ │ (done)   │ │          │
    └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
    3 tests      3 tests      3 tests      3 tests      3 tests      2 tests
    
    KEY INSIGHTS:
    ✓ Tests are distributed EVENLY across workers
    ✓ Distribution is AUTOMATIC (you don't control it)
    ✓ Each worker is INDEPENDENT (no shared state)
    ✓ Queue consumption is DYNAMIC (based on completion time)
    
    
    EXECUTION TIMELINE
    ─────────────────────────────────────────────────────────────────────────────
    
    Assuming each test takes ~1.5 seconds:
    
    WITH 6 WORKERS (parallel):
    ┌─────────────────────────────────────────────────────────────┐
    │ Time: 0s     1.5s    3.0s    4.5s                            │
    │       │      │      │      │                                │
    │ W1-W6 |BATCH1|BATCH2|BATCH3|                                │
    │       │ 6ts │ 6ts │ 5ts │                                │
    │                                                              │
    │ Total: ~4.5 seconds for 17 tests                             │
    └─────────────────────────────────────────────────────────────┘
    
    WITH 1 WORKER (sequential):
    ┌──────────────────────────────────────────────────────┐
    │ Time: 0s  1.5s 3s  4.5s 6s  7.5s ... 24s 25.5s      │
    │       │   │   │   │   │   │        │   │           │
    │ W1    |T1 |T2 |T3 |T4 |T5 |... |T16|T17|           │
    │                                                      │
    │ Total: ~25.5 seconds for 17 tests (5.7x slower)     │
    └──────────────────────────────────────────────────────┘
    
    
    BROWSER INSTANCE BEHAVIOR
    ─────────────────────────────────────────────────────────────────────────────
    
    BY DEFAULT: Each worker launches its own browser
    
    ┌─────────────────────────────────────────────────────────────┐
    │ 6 Workers = 6 Browser Instances (by default)                │
    │                                                              │
    │ Worker 1 → Browser Instance 1 (separate process)            │
    │ Worker 2 → Browser Instance 2 (separate process)            │
    │ Worker 3 → Browser Instance 3 (separate process)            │
    │ Worker 4 → Browser Instance 4 (separate process)            │
    │ Worker 5 → Browser Instance 5 (separate process)            │
    │ Worker 6 → Browser Instance 6 (separate process)            │
    │                                                              │
    │ Total Memory: 6 × ~400MB = ~2.4GB                           │
    └─────────────────────────────────────────────────────────────┘
    
    OPTION: Shared Browser (Advanced)
    ┌─────────────────────────────────────────────────────────────┐
    │ Can configure shared browser context across workers          │
    │ ✗ Not recommended (tests can interfere with each other)     │
    │ ✓ Reduces memory usage                                       │
    └─────────────────────────────────────────────────────────────┘
    
    
    WORKER ISOLATION & BENEFITS
    ─────────────────────────────────────────────────────────────────────────────
    
    Each worker is COMPLETELY ISOLATED:
    
    ✓ Separate memory space
    ✓ Separate browser instance
    ✓ Separate page/context
    ✓ No shared global state (unless you explicitly share)
    ✓ Test failures don't affect other workers
    ✓ Tests run independently without interference
    
    EXAMPLE: Worker Isolation
    ┌─────────────────────────────────────────────────────────────┐
    │ Worker 1: test1                                              │
    │   - Sets up browser                                          │
    │   - Runs test logic                                          │
    │   - Test fails or passes                                     │
    │   - Cleans up browser                                        │
    │   - INDEPENDENT (doesn't affect Worker 2)                    │
    │                                                              │
    │ Worker 2: test2 (simultaneous)                               │
    │   - Has its OWN browser instance                             │
    │   - test1's failure doesn't affect test2                     │
    │   - Both tests run in parallel safely                        │
    └─────────────────────────────────────────────────────────────┘
    
    
    CONFIGURATION BEST PRACTICES
    ─────────────────────────────────────────────────────────────────────────────
    
    SCENARIO 1: Local Development (Recommended)
    ┌─────────────────────────────────────────────────────────────┐
    │ workers: undefined
    │                                                              │
    │ ✓ Auto-detects your CPU cores                                │
    │ ✓ Optimal for your machine                                   │
    │ ✓ Fast feedback loop                                         │
    │ ✓ No manual tuning needed                                    │
    └─────────────────────────────────────────────────────────────┘
    
    SCENARIO 2: CI/CD Pipeline (Recommended)
    ┌─────────────────────────────────────────────────────────────┐
    │ workers: process.env.CI ? 1 : undefined
    │                                                              │
    │ ✓ Sequential on CI (reliable, predictable)                  │
    │ ✓ Parallel locally (fast development)                        │
    │ ✓ Handles both environments                                  │
    │ ✓ Avoids flaky tests in shared CI systems                   │
    └─────────────────────────────────────────────────────────────┘
    
    SCENARIO 3: Force Specific Count
    ┌─────────────────────────────────────────────────────────────┐
    │ workers: 4
    │                                                              │
    │ ✓ Exact control over parallelism                             │
    │ ✗ Must manually adjust for different machines               │
    │ ✗ Suboptimal on 8+ core systems                             │
    │ ✗ Not recommended unless needed                              │
    └─────────────────────────────────────────────────────────────┘
    
    SCENARIO 4: Debugging
    ┌─────────────────────────────────────────────────────────────┐
    │ workers: 1
    │                                                              │
    │ ✓ Sequential execution (easier to debug)                    │
    │ ✓ Clear output logs (no interleaving)                       │
    │ ✗ Very slow for full suite                                   │
    │ TIP: Only use for specific test file or when debugging       │
    └─────────────────────────────────────────────────────────────┘
    
    
    COMMAND-LINE OVERRIDES
    ─────────────────────────────────────────────────────────────────────────────
    
    You can override workers via CLI without changing config:
    
    # Use 1 worker (sequential)
    npx playwright test --workers=1
    
    # Use 4 workers (override config)
    npx playwright test --workers=4
    
    # Use specific test file with default workers
    npx playwright test pw_xpath.spec.ts
    
    # Debug mode (1 worker, verbose output)
    npx playwright test --debug --workers=1
    
    # Single test file, 1 worker
    npx playwright test pw_xpath.spec.ts --workers=1
    `);

    // Get test info
    const testInfo = test.info();
    console.log(`
    ┌─────────────────────────────────────────────────────────────┐
    │ CURRENT EXECUTION CONTEXT                                    │
    ├─────────────────────────────────────────────────────────────┤
    │ Worker Index: ${testInfo.workerIndex}
    │ Worker Total: ${testInfo.parallelIndex}
    │ Test Title: ${testInfo.title}
    │ Project: ${testInfo.project.name}
    └─────────────────────────────────────────────────────────────┘
    `);
});

test('Performance Impact of Worker Count', async ({page}) => {
    await page.goto('https://demowebshop.tricentis.com/');
    
    console.log(`
    ════════════════════════════════════════════════════════════════════════════
    PERFORMANCE ANALYSIS - WORKERS vs EXECUTION TIME
    ════════════════════════════════════════════════════════════════════════════
    
    THROUGHPUT CALCULATION
    ─────────────────────────────────────────────────────────────────────────────
    
    Formula: Total Time = (Total Tests / Workers) × Average Test Duration
    
    Example: 100 tests, 1.5 seconds per test
    
    Workers  │ Batches      │ Time Calc        │ Total Time │ vs 1 Worker
    ─────────┼──────────────┼──────────────────┼────────────┼──────────────
    1        │ 100 batches  │ 100 × 1.5s       │ 150s       │ 1.0x
    2        │ 50 batches   │ 50 × 1.5s        │ 75s        │ 2.0x faster
    4        │ 25 batches   │ 25 × 1.5s        │ 37.5s      │ 4.0x faster
    6        │ 17 batches   │ 17 × 1.5s        │ 25.5s      │ 5.9x faster
    8        │ 13 batches   │ 13 × 1.5s        │ 19.5s      │ 7.7x faster
    
    
    DIMINISHING RETURNS
    ─────────────────────────────────────────────────────────────────────────────
    
    CPU Cores vs Performance Gain:
    
    ┌────────────────────────────────────────────────────────────┐
    │                                                             │
    │ 8x │                                                        │
    │    │ 7x                                                     │
    │ 6x │    ◆ (8 workers, 7.7x speedup)                        │
    │    │   /│                                                   │
    │ 4x │  / │ (4 workers, 4.0x speedup)                        │
    │    │ /  │                                                   │
    │ 2x │◆   │ (2 workers, 2.0x speedup)                        │
    │    │ \\  │                                                   │
    │ 1x │  \\│_______________                                    │
    │    └────────────────────────────────────────────────────    │
    │    1    2    4    6    8   10   12   16                     │
    │                Workers / CPU Cores                          │
    │                                                             │
    │ Observation: Returns diminish after workers = CPU cores    │
    └────────────────────────────────────────────────────────────┘
    
    
    RESOURCE CONSUMPTION BY WORKER COUNT
    ─────────────────────────────────────────────────────────────────────────────
    
    Typical Chromium Browser Instance: ~400 MB
    
    Workers  │ Browser Processes │ Approx Memory │ Network Load
    ─────────┼──────────────────┼───────────────┼──────────────
    1        │ 1                │ 400 MB        │ Low
    2        │ 2                │ 800 MB        │ 2x
    4        │ 4                │ 1.6 GB        │ 4x
    6        │ 6                │ 2.4 GB        │ 6x
    8        │ 8                │ 3.2 GB        │ 8x
    
    CAUTION:
    ✗ More workers = more memory usage
    ✗ More network requests to SUT (system under test)
    ✗ Can overload target application if too many workers
    ✓ Start with workers = CPU cores
    ✓ Increase gradually if needed
    
    
    WHEN TO USE DIFFERENT WORKER COUNTS
    ─────────────────────────────────────────────────────────────────────────────
    
    WORKERS: 1
    Use Cases:
    ├─ Debugging test failures
    ├─ Sequential test order required
    ├─ Limited system resources
    ├─ Sensitive application (can't handle parallel requests)
    └─ CI systems with shared runners
    
    Pros: ✓ Predictable, easy to debug, low resource
    Cons: ✗ Very slow, no parallelism benefit
    
    
    WORKERS: CPU_CORES / 2
    Use Cases:
    ├─ Conservative parallelism
    ├─ Resource-constrained systems
    ├─ Shared CI environment
    └─ Balance speed and stability
    
    Pros: ✓ Good speed, moderate resources, stable
    Cons: ✗ Not optimal for dedicated systems
    
    
    WORKERS: CPU_CORES (DEFAULT)
    Use Cases:
    ├─ Local development
    ├─ Dedicated machines
    ├─ Production CI with isolated runners
    └─ Maximum speed with optimal resources
    
    Pros: ✓ Optimal for hardware, fast feedback, stable
    Cons: ✗ High memory usage (acceptable for most)
    
    
    WORKERS: CPU_CORES * 2
    Use Cases:
    ├─ Advanced: over-subscription for I/O bound tests
    ├─ Fast network, slow processing
    ├─ Large test suites with varied durations
    └─ High-end systems with ample memory
    
    Pros: ✓ May improve throughput for some workloads
    Cons: ✗ Context switching overhead, memory overhead
    
    TIP: Usually not recommended unless benchmarked
    
    
    QUEUE SCHEDULING & FAIRNESS
    ─────────────────────────────────────────────────────────────────────────────
    
    Playwright uses FIFO (First-In-First-Out) scheduling:
    
    1. Tests are queued in discovery order
    2. Workers pull from queue as they finish
    3. No test skipping or reordering
    4. Load is naturally balanced
    
    Example with variable test durations:
    
    Queue: [2s, 1s, 3s, 1s, 5s, 2s, 1s, 4s]
    
    Distribution across 2 workers:
    
    Worker 1          │ Worker 2
    ──────────────────┼──────────────
    2s (test1)        │ 1s (test2)    ← Worker 2 finishes first
    3s (test3) → 5s   │ 1s (test4)    ← Worker 2 finishes again
    5s (test5) → 10s  │ 2s (test6)    ← Worker 2 finishes again
                      │ 1s (test7)
                      │ 4s (test8)    ← Both finish around 10s
    
    Result: Natural load balancing (no test is queued for slow worker)
    
    
    COMMON GOTCHAS & SOLUTIONS
    ─────────────────────────────────────────────────────────────────────────────
    
    GOTCHA 1: Tests Interfering with Each Other
    Problem: Worker 1's test affects Worker 2's test
    ├─ Shared database state
    ├─ Shared API data
    ├─ Global variables
    └─ Cookie/session contamination
    
    Solution:
    ├─ Each test cleans up after itself
    ├─ Use isolated test data per worker
    ├─ Use fixtures for setup/teardown
    ├─ Run with workers: 1 to isolate issue
    
    
    GOTCHA 2: Timeout Issues with Too Many Workers
    Problem: Application can't handle 8 simultaneous browsers
    Symptoms:
    ├─ Random timeout errors
    ├─ "Connection refused" errors
    ├─ Flaky tests that pass with workers: 1
    
    Solution:
    ├─ Reduce worker count
    ├─ Increase test timeout
    ├─ Check server logs
    ├─ Add rate limiting
    
    
    GOTCHA 3: Test Order Dependency
    Problem: test2 depends on test1 results
    ├─ Different workers run tests in parallel
    ├─ test2 may run before test1 completes
    └─ Causes random failures
    
    Solution:
    ├─ Don't depend on test order
    ├─ Each test is independent
    ├─ Use setUp/tearDown for shared data
    ├─ Use workers: 1 only as temp debugging
    
    
    GOTCHA 4: Resource Exhaustion
    Problem: N workers × M browser instances = memory overload
    
    Solution:
    ├─ Monitor memory usage
    ├─ Reduce workers if memory < 20% free
    ├─ Use headless mode (already default)
    ├─ Close unused browser tabs
    
    
    MONITORING WORKER PERFORMANCE
    ─────────────────────────────────────────────────────────────────────────────
    
    Enable Playwright's built-in performance features:
    
    1. Test Reporter Output
       ├─ npx playwright test (shows worker usage)
       └─ Displays which worker ran which test
    
    2. HTML Report
       ├─ npx playwright test
       ├─ Open playwright-report/index.html
       └─ See detailed timing per test and worker
    
    3. Trace Files
       ├─ Enable in config: trace: 'on-first-retry'
       └─ View execution timeline in Playwright Inspector
    
    4. System Monitoring
       ├─ Windows Task Manager: Monitor CPU and memory
       ├─ Mac Activity Monitor: See browser process count
       └─ Linux: ps aux | grep chrome (count processes)
    
    
    OPTIMIZATION TIPS
    ─────────────────────────────────────────────────────────────────────────────
    
    ✓ TIP 1: Use workers: undefined (auto-detect) in most cases
    
    ✓ TIP 2: Monitor first test run to see worker distribution
    
    ✓ TIP 3: If tests are flaky, try workers: 1 to verify isolation
    
    ✓ TIP 4: Large suites benefit more from parallelism
       (e.g., 100 tests with 4 workers > 50 tests)
    
    ✓ TIP 5: Set reasonable test timeout for slow systems
       timeout: 30000 (default is 30s per test)
    
    ✓ TIP 6: Use fullyParallel: true (in config) to maximize parallelism
    
    ✓ TIP 7: Avoid global state - design tests for isolation
    
    ✓ TIP 8: Run locally first with workers: undefined before CI
    
    
    FORMULAS & CALCULATIONS
    ─────────────────────────────────────────────────────────────────────────────
    
    Estimated Time Reduction:
    Formula: time_new = time_old / workers
    
    Example:
    - Old time: 120 seconds (1 worker)
    - New time: 120 / 6 = 20 seconds (6 workers)
    - Speedup: 6x faster
    
    
    Memory Usage Estimate:
    Formula: memory = workers × (browser_size + context_overhead)
    
    Typical:
    - Chromium: ~400 MB per browser
    - Context overhead: ~50 MB per worker
    - 6 workers: 6 × 450 MB = 2.7 GB
    
    
    Batch Processing Calculation:
    Formula: batches_needed = CEIL(total_tests / workers)
    
    Example:
    - Total tests: 17
    - Workers: 6
    - Batches: CEIL(17/6) = CEIL(2.83) = 3 batches
    - First batch: 6 tests
    - Second batch: 6 tests
    - Third batch: 5 tests
    `);

    const testInfo = test.info();
    console.log(`✓ This test is running on Worker ${testInfo.workerIndex}`);
});

test('Configuration Examples & Code Patterns', async ({page}) => {
    await page.goto('https://demowebshop.tricentis.com/');
    
    console.log(`
    ════════════════════════════════════════════════════════════════════════════
    CONFIGURATION CODE EXAMPLES
    ════════════════════════════════════════════════════════════════════════════
    
    EXAMPLE 1: Auto-Detect (Recommended for Local)
    ┌──────────────────────────────────────────────────────────────┐
    │ // playwright.config.ts                                       │
    │ export default defineConfig({                                 │
    │   workers: undefined,  // Auto-detect CPU cores              │
    │   fullyParallel: true, // Maximize parallelism               │
    │ });                                                            │
    │                                                               │
    │ Result on 6-core machine: 6 workers                          │
    │ Result on 4-core machine: 4 workers                          │
    │ Auto-adapts to your hardware ✓                               │
    └──────────────────────────────────────────────────────────────┘
    
    
    EXAMPLE 2: Environment-Based (Recommended for CI/CD)
    ┌──────────────────────────────────────────────────────────────┐
    │ // playwright.config.ts                                       │
    │ export default defineConfig({                                 │
    │   // Local: auto-detect, CI: sequential                      │
    │   workers: process.env.CI ? 1 : undefined,                   │
    │                                                               │
    │   fullyParallel: true,                                        │
    │ });                                                            │
    │                                                               │
    │ Command line:                                                 │
    │ npm test               // Uses undefined (auto-detect)        │
    │ CI=true npm test       // Uses 1 worker                       │
    └──────────────────────────────────────────────────────────────┘
    
    
    EXAMPLE 3: Specific Count
    ┌──────────────────────────────────────────────────────────────┐
    │ // playwright.config.ts                                       │
    │ export default defineConfig({                                 │
    │   workers: 4,  // Always use exactly 4 workers                │
    │   fullyParallel: true,                                        │
    │ });                                                            │
    │                                                               │
    │ Result: Always 4 workers, regardless of machine              │
    │ Downside: Not optimal on 8+ core machines                    │
    └──────────────────────────────────────────────────────────────┘
    
    
    EXAMPLE 4: With Other Config Options
    ┌──────────────────────────────────────────────────────────────┐
    │ // playwright.config.ts                                       │
    │ export default defineConfig({                                 │
    │   workers: undefined,                                         │
    │   fullyParallel: true,  // ← Run all tests in parallel        │
    │   timeout: 30000,       // ← 30s per test (handles slow tests)│
    │   expect: {                                                    │
    │     timeout: 5000,      // ← Assertions timeout               │
    │   },                                                           │
    │   retries: 2,           // ← Retry failed tests 2 times       │
    │   forbidOnly: true,     // ← Prevent test.only in CI          │
    │ });                                                            │
    │                                                               │
    │ Best practices combined ✓                                     │
    └──────────────────────────────────────────────────────────────┘
    
    
    EXAMPLE 5: Debug Configuration
    ┌──────────────────────────────────────────────────────────────┐
    │ // playwright.config.ts                                       │
    │ const isDebug = !!process.env.DEBUG;                          │
    │                                                               │
    │ export default defineConfig({                                 │
    │   workers: isDebug ? 1 : undefined,                           │
    │   fullyParallel: !isDebug,                                    │
    │   timeout: isDebug ? 0 : 30000,  // Disable timeout in debug │
    │   use: {                                                       │
    │     headless: !isDebug,  // Show browser in debug mode        │
    │     slowMo: isDebug ? 100 : 0,  // Slow down for debugging    │
    │   },                                                           │
    │ });                                                            │
    │                                                               │
    │ Usage:                                                         │
    │ DEBUG=true npx playwright test --debug                        │
    └──────────────────────────────────────────────────────────────┘
    
    
    CLI OVERRIDE EXAMPLES
    ─────────────────────────────────────────────────────────────────────────────
    
    Override config.ts workers setting via command line:
    
    # Use config.ts setting (6 workers auto-detected)
    npx playwright test
    
    # Override: Use 1 worker (sequential)
    npx playwright test --workers=1
    
    # Override: Use 4 workers
    npx playwright test --workers=4
    
    # Specific file with default workers
    npx playwright test pw_xpath.spec.ts
    
    # Specific file with 1 worker
    npx playwright test pw_xpath.spec.ts --workers=1
    
    # Debug mode (headless off, slowMo on)
    npx playwright test --debug
    
    # Debug with 1 worker
    npx playwright test --debug --workers=1
    
    # Headed mode (visible browser)
    npx playwright test --headed
    
    # Headed with specific worker count
    npx playwright test --headed --workers=2
    
    
    PROGRAMMATIC DETECTION
    ─────────────────────────────────────────────────────────────────────────────
    
    Auto-detect CPU cores in config:
    ┌──────────────────────────────────────────────────────────────┐
    │ const os = require('os');                                     │
    │                                                               │
    │ const cpuCount = os.cpus().length;                            │
    │                                                               │
    │ export default defineConfig({                                 │
    │   // Use half of CPU cores for balance                        │
    │   workers: Math.max(1, Math.floor(cpuCount / 2)),             │
    │ });                                                            │
    │                                                               │
    │ On 6-core machine: 6/2 = 3 workers                            │
    │ On 8-core machine: 8/2 = 4 workers                            │
    │ Conservative but stable ✓                                     │
    └──────────────────────────────────────────────────────────────┘
    `);

    console.log('✓ Configuration examples logged above');
});

test('Debugging & Troubleshooting Worker Issues', async ({page}) => {
    await page.goto('https://demowebshop.tricentis.com/');
    
    console.log(`
    ════════════════════════════════════════════════════════════════════════════
    DEBUGGING WORKER & PARALLELIZATION ISSUES
    ════════════════════════════════════════════════════════════════════════════
    
    ISSUE 1: Tests Pass with 1 Worker, Fail with Multiple Workers
    ─────────────────────────────────────────────────────────────────────────────
    
    Symptom:
    ✗ npx playwright test --workers=6  ← FAILS
    ✓ npx playwright test --workers=1  ← PASSES
    
    Diagnosis: Tests are interfering with each other
    
    Root Causes:
    ├─ Shared database state modified by parallel tests
    ├─ Global variables being modified
    ├─ Cookie/session contamination across workers
    ├─ Tests depend on execution order
    ├─ Race conditions when multiple tests hit same endpoint
    └─ Fixture setup/teardown not isolated per worker
    
    Solutions:
    
    1. Add Test Isolation
    ┌──────────────────────────────────────────────────────────────┐
    │ test('should do something', async ({page}) => {              │
    │   // SETUP: Start fresh (don't rely on previous tests)       │
    │   await page.goto('/reset');  // Clear state                 │
    │                                                              │
    │   // TEST: Run your test                                     │
    │   await page.click('#button');                               │
    │                                                              │
    │   // TEARDOWN: Clean up                                      │
    │   await page.goto('/cleanup');  // Remove test data          │
    │ });                                                           │
    └──────────────────────────────────────────────────────────────┘
    
    2. Use test.beforeEach() / test.afterEach()
    ┌──────────────────────────────────────────────────────────────┐
    │ test.beforeEach(async ({page}) => {                          │
    │   // Clean database before EACH test                         │
    │   await cleanDatabase();                                     │
    │ });                                                           │
    │                                                              │
    │ test.afterEach(async ({page}) => {                           │
    │   // Clean up after EACH test                                │
    │   await page.goto('/cleanup');                               │
    │ });                                                           │
    │                                                              │
    │ test('test 1', async ({page}) => { ... });                   │
    │ test('test 2', async ({page}) => { ... });                   │
    └──────────────────────────────────────────────────────────────┘
    
    3. Use test.describe() for grouped setup/teardown
    ┌──────────────────────────────────────────────────────────────┐
    │ test.describe('Feature A', () => {                           │
    │   test.beforeAll(async () => {                               │
    │     // One-time setup for all tests in group                 │
    │   });                                                         │
    │                                                              │
    │   test('test 1', async ({page}) => { ... });                 │
    │   test('test 2', async ({page}) => { ... });                 │
    │                                                              │
    │   test.afterAll(async () => {                                │
    │     // One-time cleanup                                      │
    │   });                                                         │
    │ });                                                           │
    └──────────────────────────────────────────────────────────────┘
    
    4. Avoid Global State
    ┌──────────────────────────────────────────────────────────────┐
    │ // ✗ BAD: Global variable (shared across workers)            │
    │ let userId = 1;  // Shared!                                  │
    │                                                              │
    │ test('test 1', async ({page}) => {                           │
    │   userId = 100;  // Modifies global state                    │
    │ });                                                           │
    │                                                              │
    │ ✓ GOOD: Local variable (isolated per test)                   │
    │ test('test 1', async ({page}) => {                           │
    │   const userId = 100;  // Local scope, isolated              │
    │ });                                                           │
    └──────────────────────────────────────────────────────────────┘
    
    
    ISSUE 2: Random Timeout Errors with Multiple Workers
    ─────────────────────────────────────────────────────────────────────────────
    
    Symptom:
    ✗ Error: Timeout waiting for locator
    ✗ Error: Connection refused
    ✗ Error: 503 Service Unavailable
    
    Diagnosis: Application can't handle concurrent load
    
    Root Causes:
    ├─ 6 browsers × 10 tests = 60+ requests to server
    ├─ Server has connection limit (e.g., max 10 connections)
    ├─ Network bandwidth exhausted
    ├─ Application rate limiting or throttling
    └─ Slow target application (slow to respond)
    
    Solutions:
    
    1. Reduce Worker Count (Immediate Fix)
    ┌──────────────────────────────────────────────────────────────┐
    │ npx playwright test --workers=2
    │                                                              │
    │ Reduces concurrent requests:                                 │
    │ 2 workers × tests = less network load                        │
    │                                                              │
    │ Trade-off: Slower execution but stable                       │
    └──────────────────────────────────────────────────────────────┘
    
    2. Increase Test Timeout (Allows Slower Responses)
    ┌──────────────────────────────────────────────────────────────┐
    │ // playwright.config.ts                                       │
    │ export default defineConfig({                                 │
    │   timeout: 60000,  // 60s instead of default 30s              │
    │ });                                                            │
    │                                                              │
    │ Per test:                                                     │
    │ test('slow test', async ({page}) => {                        │
    │   // ...                                                      │
    │ }, {timeout: 60000});                                         │
    └──────────────────────────────────────────────────────────────┘
    
    3. Add Delays Between Tests (Rate Limiting)
    ┌──────────────────────────────────────────────────────────────┐
    │ test('test 1', async ({page}) => {                           │
    │   // ... test code                                           │
    │   await page.waitForTimeout(500);  // Wait 500ms after test   │
    │ });                                                           │
    │                                                              │
    │ Spreads requests: Prevents thundering herd                  │
    └──────────────────────────────────────────────────────────────┘
    
    4. Check Server Logs
    ┌──────────────────────────────────────────────────────────────┐
    │ Look for:                                                     │
    │ ├─ "Too many connections"                                     │
    │ ├─ "Connection reset by peer"                                │
    │ ├─ "Rate limit exceeded"                                      │
    │ ├─ High CPU usage                                             │
    │ └─ Memory exhaustion                                          │
    │                                                              │
    │ Use appropriate fix based on root cause                       │
    └──────────────────────────────────────────────────────────────┘
    
    
    ISSUE 3: "Worker N has crashed"
    ─────────────────────────────────────────────────────────────────────────────
    
    Symptom:
    ✗ Error: Worker N has crashed
    ✗ Error: Port already in use
    
    Diagnosis: Worker process crashed or resource exhausted
    
    Root Causes:
    ├─ Out of memory (too many workers for available RAM)
    ├─ Port conflict (multiple browsers trying same port)
    ├─ System process limit reached
    ├─ Browser crash (bug in test)
    └─ Uncaught exception in worker
    
    Solutions:
    
    1. Check System Resources
    ┌──────────────────────────────────────────────────────────────┐
    │ Windows Task Manager:                                         │
    │ ├─ Memory usage → Should be < 80% of RAM                     │
    │ ├─ Chrome processes → Count should match workers              │
    │                                                              │
    │ Mac Activity Monitor:                                         │
    │ ├─ Memory tab → Check available memory                        │
    │ ├─ Process list → Look for chrome processes                   │
    │                                                              │
    │ Linux:                                                        │
    │ $ ps aux | grep chrome | wc -l                                │
    │ $ free -h  # Check available memory                           │
    └──────────────────────────────────────────────────────────────┘
    
    2. Reduce Workers
    ┌──────────────────────────────────────────────────────────────┐
    │ npx playwright test --workers=2
    │                                                              │
    │ Fewer workers = less memory usage                             │
    │ Monitor and gradually increase until stable                   │
    └──────────────────────────────────────────────────────────────┘
    
    3. Check Logs with Verbose Output
    ┌──────────────────────────────────────────────────────────────┐
    │ DEBUG=pw:api npx playwright test --workers=1 2>&1 | tail -50  │
    │                                                              │
    │ Shows detailed crash information                              │
    └──────────────────────────────────────────────────────────────┘
    
    
    ISSUE 4: Flaky Tests (Pass/Fail Inconsistently)
    ─────────────────────────────────────────────────────────────────────────────
    
    Symptom:
    ✓ Test passes when run alone (--workers=1)
    ✗ Test fails randomly when run with others (--workers=6)
    
    Diagnosis: Race conditions or timing issues
    
    Root Causes:
    ├─ Timing-dependent assertions
    ├─ Network timing variations
    ├─ Database sync issues
    ├─ Shared resource contention
    └─ Order-dependent test setup
    
    Solutions:
    
    1. Use Playwright's Wait Utilities
    ┌──────────────────────────────────────────────────────────────┐
    │ // ✗ BAD: Hard-coded wait (unreliable)                        │
    │ await page.waitForTimeout(2000);                              │
    │ await expect(page.locator('#msg')).toBeVisible();             │
    │                                                              │
    │ // ✓ GOOD: Wait for element (adaptive)                        │
    │ await expect(page.locator('#msg')).toBeVisible();             │
    │                                                              │
    │ // ✓ BETTER: Wait for specific condition                      │
    │ await page.waitForFunction(() =>                              │
    │   document.querySelector('#msg').textContent === 'Loaded'     │
    │ );                                                            │
    └──────────────────────────────────────────────────────────────┘
    
    2. Increase Wait Timeouts
    ┌──────────────────────────────────────────────────────────────┐
    │ await expect(locator).toBeVisible({timeout: 10000});          │
    │ await page.goto(url, {waitUntil: 'networkidle'});             │
    └──────────────────────────────────────────────────────────────┘
    
    3. Run with --workers=1 to Verify
    ┌──────────────────────────────────────────────────────────────┐
    │ npx playwright test problematic.spec.ts --workers=1           │
    │                                                              │
    │ If passes with 1 worker:                                      │
    │ → Issue is parallelization/isolation related                  │
    │                                                              │
    │ If still fails with 1 worker:                                 │
    │ → Issue is in test itself (not workers)                       │
    └──────────────────────────────────────────────────────────────┘
    
    
    PERFORMANCE MONITORING
    ─────────────────────────────────────────────────────────────────────────────
    
    Command: View detailed timing per worker
    ┌──────────────────────────────────────────────────────────────┐
    │ npx playwright test --reporter=list                           │
    │                                                              │
    │ Shows:                                                        │
    │ ✓ test1 (2.1s) [W1]  ← Which worker ran it, how long         │
    │ ✓ test2 (1.8s) [W2]                                           │
    │ ✓ test3 (2.2s) [W1]  ← W1 finished test1, started test3      │
    └──────────────────────────────────────────────────────────────┘
    
    HTML Report:
    ┌──────────────────────────────────────────────────────────────┐
    │ npx playwright test                                           │
    │ npx playwright show-report                                    │
    │                                                              │
    │ Shows interactive timeline with:                              │
    │ ├─ Each test's duration                                      │
    │ ├─ Which worker ran it                                       │
    │ ├─ Parallel execution visualization                          │
    │ └─ Performance metrics                                        │
    └──────────────────────────────────────────────────────────────┘
    `);

    console.log('✓ Debugging and troubleshooting guide logged above');
});

});
