# concurrent-api-tests example

The concurrent-api-tests example shows how to apply the [Concurrent API Tests](https://medium.com/@stphaneleblanc/d84f7a29f0dc?source=friends_link&sk=843339381eaf77195f8522449c907550) approach with [Vitest](https://vitest.dev/).

Concurrent API tests are as easy to read as standard Vitest tests. Here are some test cases for the [blog posts](https://github.com/VilledeMontreal/concurrent-api-tests/blob/master/example/src/blogPosts/blogPost.apiTest.ts) and [users](https://github.com/VilledeMontreal/concurrent-api-tests/blob/master/example/src/users/user.apiTest.ts).

These test cases are grouped in a test suite. Running the test suite produces this test report.

```
----------------------------------------------------------
Test suite name:
sample test suite
----------------------------------------------------------
Estimated execution time:
3 seconds
----------------------------------------------------------
Environment:
local
----------------------------------------------------------
Max test concurrency:
30
----------------------------------------------------------
Max retries:
2
----------------------------------------------------------
Retry timeout in miliseconds:
5000
----------------------------------------------------------
Test run id:
zApiTest-7e013e8b-2b70-4b5d-af48-6f55402d123f
----------------------------------------------------------


  sample test suite
    ✓ users - create (1003ms)
    ✓ blogPosts - create (2005ms)
    ✓ blogPosts - title is required (2003ms)
    ✓ blogPosts - search by author (3005ms)
    ✓ Anti-pattern: Asserting on default values (3004ms)
  No flaky tests!


  5 passing (3s)
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
- When a test fails due to an unexpected error, the full error in JSON format is available in the test report. Thanks to [mocha-error-reporters](https://github.com/VilledeMontreal/mocha-error-reporters).
- When a test does not does not succeed on the first time (flaky), the full error in JSON format is available in the test report.
- Incremental compilation
  - `npm run watch`
- Debug launcher for Visual Studio Code
  - Launch `Test current (Launch npm run watch before)`
  - Launch `Test latest stable (Launch npm run watch before)`
- Default [linter](<https://en.wikipedia.org/wiki/Lint_(software)>)
  - `npm run lint`
  - `npm run lint-fix`

## File extension convention

- **.apiTests.ts**: Define a list of cohesive test cases related to the same feature. More than one .apiTests.ts file per feature may be required.

- **.apiTestSuite.ts**: Run many api tests concurrently. In general, having a single api test suite is recommanded. If your api tests run fast, why not always run them all? If needed, many api test suites can be created.

- **.fixture.ts**: Define functions that can be used as building blocks for [arranging](https://automationpanda.com/2020/07/07/arrange-act-assert-a-pattern-for-writing-good-tests/) the test cases.

- **.template.ts**: Define functions that provide a default payload template and that allow to specify only the parts of the payload that are meaningful for the test case.

## Test report exemple: when a test fails or does not succeed on the first time (flaky)

```
----------------------------------------------------------
Test suite name:
sample test suite
----------------------------------------------------------
Estimated execution time:
3 seconds
----------------------------------------------------------
Environment:
local
----------------------------------------------------------
Max test concurrency:
30
----------------------------------------------------------
Max retries:
2
----------------------------------------------------------
Retry timeout in miliseconds:
5000
----------------------------------------------------------
Test run id:
zApiTest-0bf3a34b-7511-42a2-b5cf-34efae864f0c
----------------------------------------------------------


  sample test suite
    ✓ Test pass
    1) Test with error
    ✓ Flaky once
    ✓ Flaky twice

Flaky tests:
- Flaky once failed 1 times before succeding.

Failure 1:
{
  "additionnalAttribute": "The key to understand this bug.",
  "name": "Error",
  "message": "Pow!Flaky:1",
  "stack": "Error: Pow!Flaky:1\n    at ContextProxy.<anonymous> (/Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/src/flakyTests.apiTestSuite.ts:24:27)\n    at /Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/mocha.parallel/lib/parallel.js:358:20\n    at tryCatcher (/Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/bluebird/js/main/util.js:26:23)\n    at Promise._resolveFromResolver (/Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/bluebird/js/main/promise.js:483:31)\n    at new Promise (/Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/bluebird/js/main/promise.js:71:37)\n    at /Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/mocha.parallel/lib/parallel.js:345:12\n    at Object.getPromise (/Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/mocha.parallel/lib/parallel.js:272:43)\n    at executeSpecWithRetries (/Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/mocha.parallel/lib/parallel.js:486:16)\n    at executeSpecWithRetriesIfSpecified (/Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/mocha.parallel/lib/parallel.js:469:16)\n    at /Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/mocha.parallel/lib/parallel.js:100:20\n    at bound (node:domain:421:15)\n    at runBound (node:domain:432:12)\n    at tryCatcher (/Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/bluebird/js/main/util.js:26:23)\n    at Promise._settlePromiseFromHandler (/Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/bluebird/js/main/promise.js:510:31)\n    at Promise._settlePromiseAt (/Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/bluebird/js/main/promise.js:584:18)\n    at Promise._settlePromises (/Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/bluebird/js/main/promise.js:700:14)\n    at Async._drainQueue (/Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/bluebird/js/main/async.js:123:16)\n    at Async._drainQueues (/Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/bluebird/js/main/async.js:133:10)\n    at Immediate.Async.drainQueues [as _onImmediate] (/Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/bluebird/js/main/async.js:15:14)\n    at processImmediate (node:internal/timers:466:21)\n    at process.topLevelDomainCallback (node:domain:152:15)\n    at process.callbackTrampoline (node:internal/async_hooks:128:24)"
}

- Flaky twice failed 2 times before succeding.

Failure 1:
{
  "additionnalAttribute": "The key to understand this bug. Flaky:1",
  "name": "Error",
  "message": "Pow!Flaky:1",
  "stack": "Error: Pow!Flaky:1\n    at ContextProxy.<anonymous> (/Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/src/flakyTests.apiTestSuite.ts:33:27)\n    at /Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/mocha.parallel/lib/parallel.js:358:20\n    at tryCatcher (/Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/bluebird/js/main/util.js:26:23)\n    at Promise._resolveFromResolver (/Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/bluebird/js/main/promise.js:483:31)\n    at new Promise (/Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/bluebird/js/main/promise.js:71:37)\n    at /Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/mocha.parallel/lib/parallel.js:345:12\n    at Object.getPromise (/Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/mocha.parallel/lib/parallel.js:272:43)\n    at executeSpecWithRetries (/Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/mocha.parallel/lib/parallel.js:486:16)\n    at executeSpecWithRetriesIfSpecified (/Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/mocha.parallel/lib/parallel.js:469:16)\n    at /Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/mocha.parallel/lib/parallel.js:100:20\n    at bound (node:domain:421:15)\n    at runBound (node:domain:432:12)\n    at tryCatcher (/Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/bluebird/js/main/util.js:26:23)\n    at Promise._settlePromiseFromHandler (/Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/bluebird/js/main/promise.js:510:31)\n    at Promise._settlePromiseAt (/Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/bluebird/js/main/promise.js:584:18)\n    at Promise._settlePromises (/Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/bluebird/js/main/promise.js:700:14)\n    at Async._drainQueue (/Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/bluebird/js/main/async.js:123:16)\n    at Async._drainQueues (/Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/bluebird/js/main/async.js:133:10)\n    at Immediate.Async.drainQueues [as _onImmediate] (/Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/bluebird/js/main/async.js:15:14)\n    at processImmediate (node:internal/timers:466:21)\n    at process.topLevelDomainCallback (node:domain:152:15)\n    at process.callbackTrampoline (node:internal/async_hooks:128:24)"
}

Failure 2:
{
  "additionnalAttribute": "The key to understand this bug. Flaky:2",
  "name": "Error",
  "message": "Pow!Flaky:2",
  "stack": "Error: Pow!Flaky:2\n    at ContextProxy.<anonymous> (/Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/src/flakyTests.apiTestSuite.ts:33:27)\n    at /Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/mocha.parallel/lib/parallel.js:358:20\n    at tryCatcher (/Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/bluebird/js/main/util.js:26:23)\n    at Promise._resolveFromResolver (/Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/bluebird/js/main/promise.js:483:31)\n    at new Promise (/Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/bluebird/js/main/promise.js:71:37)\n    at /Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/mocha.parallel/lib/parallel.js:345:12\n    at Object.getPromise (/Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/mocha.parallel/lib/parallel.js:272:43)\n    at executeSpecWithRetries (/Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/mocha.parallel/lib/parallel.js:486:16)\n    at executeSpecWithRetriesIfSpecified (/Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/mocha.parallel/lib/parallel.js:469:10)"
}



  3 passing (31ms)
  1 failing

  1) sample test suite
       Test with error:
     Error: Pow!
      at ContextProxy.<anonymous> (src/flakyTests.apiTestSuite.ts:16:23)
      at /Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/mocha.parallel/lib/parallel.js:358:20
      at tryCatcher (node_modules/bluebird/js/main/util.js:26:23)
      at Promise._resolveFromResolver (node_modules/bluebird/js/main/promise.js:483:31)
      at new Promise (node_modules/bluebird/js/main/promise.js:71:37)
      at /Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/mocha.parallel/lib/parallel.js:345:12
      at Object.getPromise (node_modules/mocha.parallel/lib/parallel.js:272:43)
      at executeSpecWithRetries (node_modules/mocha.parallel/lib/parallel.js:486:16)
      at processTicksAndRejections (node:internal/process/task_queues:96:5)
      at executeSpecWithRetriesIfSpecified (node_modules/mocha.parallel/lib/parallel.js:469:10)

  Full Error:
  {
    "additionnalAttribute": "The key to understand this bug.",
    "name": "Error",
    "message": "Pow!",
    "stack": "Error: Pow!\n    at ContextProxy.<anonymous> (src/flakyTests.apiTestSuite.ts:16:23)\n    at /Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/mocha.parallel/lib/parallel.js:358:20\n    at tryCatcher (node_modules/bluebird/js/main/util.js:26:23)\n    at Promise._resolveFromResolver (node_modules/bluebird/js/main/promise.js:483:31)\n    at new Promise (node_modules/bluebird/js/main/promise.js:71:37)\n    at /Users/ULEBL5H/git/github/mocha-concurrent-api-tests/example/node_modules/mocha.parallel/lib/parallel.js:345:12\n    at Object.getPromise (node_modules/mocha.parallel/lib/parallel.js:272:43)\n    at executeSpecWithRetries (node_modules/mocha.parallel/lib/parallel.js:486:16)\n    at processTicksAndRejections (node:internal/process/task_queues:96:5)\n    at executeSpecWithRetriesIfSpecified (node_modules/mocha.parallel/lib/parallel.js:469:10)"
  }
```

## Required extensions for real-time linting with VSCode

- Prettier - code formatter for enforcing a consistent style
- TSLint - checks code for readability, maintainability
