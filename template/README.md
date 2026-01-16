# concurrent-api-tests example

The concurrent-api-tests example shows how to apply the [Concurrent API Tests](https://medium.com/@stphaneleblanc/d84f7a29f0dc?source=friends_link&sk=843339381eaf77195f8522449c907550) approach with [Vitest](https://vitest.dev/).

Concurrent API tests are as easy to read as standard Vitest tests. Here are some example test cases for [blog posts](https://github.com/VilledeMontreal/concurrent-api-tests/blob/master/example/src/blogPosts/blogPost.apiTest.ts) and [users](https://github.com/VilledeMontreal/concurrent-api-tests/blob/master/example/src/users/user.apiTest.ts).

These test cases are grouped in a test suite. Running the test suite produces this test report.

```
 RUN  v4.0.3 /home/runner/work/concurrent-api-tests/concurrent-api-tests/example

 ✓ src/allTests.apiTestSuite.ts > Users > Create 1003ms
 ✓ src/allTests.apiTestSuite.ts > BlogPosts > Create 2004ms
 ✓ src/allTests.apiTestSuite.ts > BlogPosts > Title is required 2005ms
 ✓ src/allTests.apiTestSuite.ts > BlogPosts > Anti-pattern: Asserting on default values 3006ms
 ✓ src/allTests.apiTestSuite.ts > BlogPosts > Search by author 3007ms
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
 Flaky Tests 0
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 Test Files  1 passed (1)
      Tests  5 passed (5)
   Start at  20:56:56
   Duration  3.40s (transform 74ms, setup 0ms, collect 263ms, tests 3.01s, environment 0ms, prepare 9ms)
```

The folder ./example can be use as a template for starting new test projects.

## To execute

Under /example, run these npm commands:

- `npm install`
- `npm start`

## Features

- Usage examples of [concurrent-api-tests functions](https://github.com/VilledeMontreal/concurrent-api-tests/blob/master/lib/README.md#functions)
- File extension convention
- Ability to test against the current and the latest stable version version of the system under test.
  - `npm run test-current`
  - `npm run test-latest-stable`
- When a test fails due to an unexpected error, the full error in JSON format is available in the test report.
- When a test does not succeed on the first time (flaky), the full error in JSON format is available in the test report.
- Incremental compilation without emit (for type safety feedback, vitest doesn't need tsc for transpilation)
  - `npm run watch-no-emit`
- Debug
  - Use a JavaScript Debug Terminal to launch npm script (ex: `npm run test-current`)
- Lint
  - `npm run lint-fix`

## File extension convention

- **.apiTests.ts**: Define a list of cohesive test cases related to the same feature. More than one .apiTests.ts file per feature may be required.

- **.apiTestSuite.ts**: Run many api tests concurrently. In general, having a single api test suite is recommended. If your api tests run fast in a single-threaded execution, why not always run them all? If needed, many api test suites can be created.

- **.fixture.ts**: Define functions that can be used as building blocks for [arranging](https://automationpanda.com/2020/07/07/arrange-act-assert-a-pattern-for-writing-good-tests/) the test cases.

- **.template.ts**: Define functions that provide a default payload template and that allow to specify only the parts of the payload that are meaningful for the test case.

## Test report example: when a test fails or does not succeed on the first time (flaky)

```
 RUN  v4.0.3 /home/runner/work/concurrent-api-tests/concurrent-api-tests/example

 ✓ src/flakyTests.apiTestSuite.ts > Flaky > Test pass 4ms
 ✓ src/flakyTests.apiTestSuite.ts > Flaky > Flaky once 5ms (retry x1)
 × src/flakyTests.apiTestSuite.ts > Flaky > Test with error 5ms (retry x2)
   → Pow!
   → Pow!
   → Pow!
 ✓ src/flakyTests.apiTestSuite.ts > Flaky > Flaky twice 5ms (retry x2)
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
 Flaky Tests 2
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
 FLAKY  Flaky > Flaky once: failed 1 time and then passed.
Error: Pow!Flaky:1
 ❯ src/flakyTests.apiTestSuite.ts:16:21
     14|     iFlakyOnce++;
     15|     if (iFlakyOnce <= 1) {
     16|       const error = new Error("Pow!Flaky:" + iFlakyOnce) as any;
       |                     ^
     17|       error.additionnalAttribute = "The key to understand this bug.";
     18|       throw error;

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { additionnalAttribute: 'The key to understand this bug.' }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
 FLAKY  Flaky > Flaky twice: failed 2 times and then passed.
Error: Pow!Flaky:1
 ❯ src/flakyTests.apiTestSuite.ts:25:21
     23|     iFlakyTwice++;
     24|     if (iFlakyTwice <= 2) {
     25|       const error = new Error("Pow!Flaky:" + iFlakyTwice) as any;
       |                     ^
     26|       error.additionnalAttribute =
     27|         "The key to understand this bug. Flaky:" + iFlakyTwice;

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { additionnalAttribute: 'The key to understand this bug. Flaky:1' }
Error: Pow!Flaky:2
 ❯ src/flakyTests.apiTestSuite.ts:25:21
     23|     iFlakyTwice++;
     24|     if (iFlakyTwice <= 2) {
     25|       const error = new Error("Pow!Flaky:" + iFlakyTwice) as any;
       |                     ^
     26|       error.additionnalAttribute =
     27|         "The key to understand this bug. Flaky:" + iFlakyTwice;

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { additionnalAttribute: 'The key to understand this bug. Flaky:2' }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/flakyTests.apiTestSuite.ts > Flaky > Test with error
 FAIL  src/flakyTests.apiTestSuite.ts > Flaky > Test with error
 FAIL  src/flakyTests.apiTestSuite.ts > Flaky > Test with error
Error: Pow!
 ❯ src/flakyTests.apiTestSuite.ts:8:19
      6|   });
      7|   it("Test with error", () => {
      8|     const error = new Error("Pow!") as any;
       |                   ^
      9|     error.additionnalAttribute = "The key to understand this bug.";
     10|     throw error;

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { additionnalAttribute: 'The key to understand this bug.' }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/3]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 3 passed (4)
   Start at  20:53:45
   Duration  174ms (transform 24ms, setup 0ms, collect 31ms, tests 6ms, environment 0ms, prepare 9ms)
```
