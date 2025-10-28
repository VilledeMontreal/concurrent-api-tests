# concurrent-api-tests

Concurrent-api-tests provides the core functions required to implement [Concurrent API Tests](https://medium.com/@stphaneleblanc/d84f7a29f0dc?source=friends_link&sk=843339381eaf77195f8522449c907550) with [Vitest](https://vitest.dev/).

## To Install

In your project, run this npm command:

`npm install @villedemontreal/concurrent-api-tests`

## Functions

### apiTestSuite(testSuiteName, estimatedTestingTime, environment, maxTestConcurrency, maxRetries, retryTimeoutInMiliseconds, apiTests, skippedTests)

Execute a vitest concurrent api test suite. Vitest [describe function](https://vitest.dev/api/#describe) and nested describe functions are not supported by concurrent-api-tests. Instead, a concurrent api test suite executes many Vitest [it function](https://vitest.dev/api/#test) concurrently in the same thread.

**Arguments**

- testSuiteName: The name of the test suite.
- estimatedTestingTime: The estimated time required to execute the test suite (Ex: "45 seconds").
- environment: The environment against which the test suite is executed (Ex: "dev").
- maxTestConcurrency: The maximum number of tests that can be executed concurrently (Ex: 30).
- maxRetries: If a test fails, it will be retried until it succeeds or maxRetries is reached. Useful if some tests have dependencies (ex: network) that fail from time to time.
- retryTimeoutInMiliseconds: If a test hangs and maxRetries > 0, the test will be retried after retryTimeoutInMiliseconds.
  retryTimeoutInMiliseconds does not alter the default timeout of Vitest.
  Ex:
  if a test hangs forever and maxRetries=10, retryTimeoutInMiliseconds=1000 and
  vitest timeout is 5 seconds, then the test will be retried 5 times because
  retryTimeoutInMiliseconds but will stop as soon as Vitest timeout is reached.
- apiTests: A function that invokes many [it function](https://vitest.dev/api/#test). Vitest [describe function](https://vitest.dev/api/#describe) can be emulated by grouping [it functions](https://vitest.dev/api/#test) into standard functions. See [concurrent-api-tests example](https://github.com/VilledeMontreal/concurrent-api-tests/blob/master/example/src/allTests.apiTestSuite.ts#L11-L14).
- skippedTests: [optional] A function that invokes many skipped [it function](https://vitest.dev/api/#test). Allows to skip a group of [it functions](https://vitest.dev/api/#test). See [concurrent-api-tests example](https://github.com/VilledeMontreal/concurrent-api-tests/blob/master/example/src/allTests.apiTestSuite.ts#L15-L18).

**Returns**

void

**Example**

See [concurrent-api-tests example](https://github.com/VilledeMontreal/concurrent-api-tests/blob/master/example/src/allTests.apiTestSuite.ts#L6-L19).

---

### defineCopyTemplate(template)

Define a function that provide a default payload template and that allow to specify only the parts of the payload that are meaningful for the test case. This way, test cases are easier to read since only the parts that matter are specified. Moreover, if a change in a payload is required, only the default payload template and the related tests need to be changed.

**Arguments**

- template: A default payload template.

**Returns**

A function that provide a default payload template and allow to specify only the parts of the payload that are meaningful for the test case.

**Example**

See [concurrent-api-tests example](https://github.com/VilledeMontreal/concurrent-api-tests/blob/master/example/src/blogPosts/blogPost.template.ts#L4-L17).

---

### defineCopyTemplateVariation(originalCopyTemplate, variation)

Define a copy template variation to avoid duplication when the same template is used in many test cases.

**Arguments**

- originalCopyTemplate: The original copy template function. See [defineCopyTemplate](#definecopytemplatetemplate).
- variation: A function that specifies only the parts of the payload that are meaningful for the variation.

**Returns**

A function that provide a default payload template and allow to specify only the parts of the payload that are meaningful for the test case.

**Example**

See [concurrent-api-tests example](https://github.com/VilledeMontreal/concurrent-api-tests/blob/master/example/src/blogPosts/blogPost.template.ts#L19-L23).

---

### shouldThrow(act, customAssert)

Assert against an API request that is expected to throw an error.

**Arguments**

- act: A function that send the API request.
- customAssert: A function that assert against the error.
  **Returns**

void

**Example**

See [concurrent-api-tests example](https://github.com/VilledeMontreal/concurrent-api-tests/blob/master/example/src/blogPosts/blogPost.apiTest.ts#L29-L36).

---

### aFewSeconds(delayInSeconds)

Some test cases must rely on the timing between API requests. These test cases are likely to be [flaky](https://hackernoon.com/flaky-tests-a-war-that-never-ends-9aa32fdef359) if the timing is not managed with care.

If the precision of the timing has to be less than a second, then concurrent-api-tests is not the right tool for this test case. For more guidance, see [Concurrent API Tests](https://medium.com/@stphaneleblanc/d84f7a29f0dc?source=friends_link&sk=843339381eaf77195f8522449c907550).

**Arguments**

- delayInSeconds: The number of seconds to wait for. (Ex: 5).

**Returns**

void

**Example**

`await aFewSeconds(5);`

---

### defineGetSharedFixture(createSharedFixture)

Define a function that perform lazy initialization of a fixture. This allow to share the same fixture between many tests cases and to initialize it only once.

A fixture may be shared between the test cases of the same test run if

1. the attribute of the user are not meaningful for the test
2. the fixture is immutable

Although shared fixture can speed up test runs and reduce the amount of data created
on the server, they must be used with care since they can produce flaky test cases
if the two points above are not respected.

In doubt, create a new fixture for each test case.

Fast tests are important, but reliable tests are even more important.

**Arguments**

- createSharedFixture: A function that initialize the shared fixture.

**Returns**

A function that perform lazy initialization of the shared fixture.

**Example**

See [concurrent-api-tests example](https://github.com/VilledeMontreal/concurrent-api-tests/blob/master/example/src/users/user.fixture.ts#L14).

---

### defineGetSharedFixtureByKey(createSharedFixtureByKey)

Same as defineGetSharedFixture, but allow to pass a key as argument. Useful when there are many similar shared fixture to be defined.

**Arguments**

- createSharedFixtureByKey: A function that initialize the shared fixture for a specific key.

**Returns**

A function that perform lazy initialization of the shared fixture for a specific key.

**Example**

See [concurrent-api-tests example](https://github.com/VilledeMontreal/concurrent-api-tests/blob/master/example/src/users/user.fixture.ts#L16).

## Testing concurrent-api-tests itself

Run all unit tests, run this npm command:

`npm start`

Debug all unit tests, run this npm command:

`npm run watch` (to activate incremental transpilation) and use the Visual Studio Code launcher **Debug**.
