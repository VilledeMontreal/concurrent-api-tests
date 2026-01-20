# Concurrent API tests from Gherkin features

## Outline
Your goal is to create reliable and maintainable concurrent api tests to verify that the system behavior respect the Gherkin feature description provided as input.

Your first step is always to deeply analyse the Gherkin feature files, the OpenAPI specification, and the `data-partitions.yaml` file to understand the feature you need to generate the test for. 

The API MUST be tested at the API level. Tests arrange, act, assert solely via HTTP/API calls (black‑box). The tests CANNOT rely on preexisting mutable state; each constructs and owns a fresh data partition (unique ids) that ensure there will be no side-effects between tests. Concurrency is mandatory: every test MUST be runnable alongside others without side effects. Shared mutable state and inter-test ordering dependencies are PROHIBITED. Teardown during test execution is unnecessary (isolation guarantees); resource cleanup MAY occur out of band strictly for capacity reasons to control storage/quotas. Reliability ALWAYS supersedes marginal execution time improvements.

You MUST ALWAYS stop and ask questions to the user if:
- The Gherkin feature files cannot be found or are invalid.
- The OpenAPI specification cannot be found or are invalid (located at /test/shared/apiUnderTest/open-api.yaml by convention).
- The `data-partitions.yaml` file cannot be found or is invalid (located at /test/shared/apiUnderTest/data-partitions.yaml by convention).
- The test cases identified during the planing will not yield a strong confidence that the system under test is working properly and respect the expected system behaviour. 
- Data partitioning strategy is not documented in `data-partitions.yaml` for the endpoint under test
- Avoiding race conditions is impossible

### Understanding Data Partitioning (CRITICAL - Read Carefully)

Data partitioning is the mechanism that enables concurrent test execution without side effects. Each test creates and uses its own isolated partition of data.

**How to identify partition strategy:**

1. **Read the `data-partitions.yaml` file** located at `test/shared/apiUnderTest/data-partitions.yaml`. This file is the single source of truth for how each endpoint achieves test isolation.
2. For each endpoint, the file specifies:
   - `type`: Either `server-generated` (automatic isolation) or `client-controlled` (you must ensure uniqueness)
   - `field`: The name of the field used for partitioning
   - `location`: Where the field exists (`response.body`, `query`, `path`, or `request.body`)

**How to use it:**

1. **If `type: server-generated`** — No special action needed. The server returns a unique ID; use it for subsequent operations.
2. **If `type: client-controlled`** — Use `getTestRunId()` as a prefix for the partition field value with a meaningful suffix unique to your test.

**Critical rule:** Only set partition fields explicitly when they are client-controlled. For server-generated IDs, the server handles isolation automatically through unique IDs.

You MUST respect each point of the implementation compliance checklist.

### ⛔ CRITICAL REQUIREMENTS
Before returning your response, think hard and try to find item of the check list that are not respected. Fix them returning your response.

## API Test Implementation Compliance Checklist

### General
- [ ] MUST use `vitest` for test runner.
- [ ] MUST use `@villedemontreal/concurrent-api-tests` for test utility.
- [ ] MUST generate a `*.apiTest.ts` file for each Gherkin feature file (`*.feature`).
- [ ] Everything in the `test/` directory MUST be written in English: file names, folder names, variable names, function names, comments, etc. File and folder names MUST be in English even if the Gherkin feature is in another language. Translate the feature name to English for the folder/file name.
- [ ] Describe descriptions and test titles (the strings in `describe()` and `it()`) MUST match the language used in the Gherkin feature file.
- [ ] Every `Feature` in Gherkin MUST generate a `describe` in concurrent api tests.
- [ ] Every `Rule` in Gherkin MUST generate a `describe` in concurrent api tests.
- [ ] Every `Example` in Gherkin MUST generate a `it` in concurrent api tests.
- [ ] Every `Scenario Outline` in Gherkin MUST generate a `it.each` in concurrent api tests.
- [ ] MUST ensure all tests cases are concurrent. They execute via a root suite (e.g. `allTests.apiTestSuite.ts`). See section "6. Root Suite (allTests.apiTestSuite.ts)" in "Implementation Patterns Reference" below.
- [ ] MUST import all new `*.apiTest.ts` files into `allTests.apiTestSuite.ts`.
- [ ] MUST ensure there are no side effects between tests by using data parition to isolate each test cases from the other test cases.
- [ ] MUST preserve visible Arrange–Act–Assert separation by skipping a line between each section.
- [ ] MUST organise frequently used arrange, act and assert functions in *.fixture.ts files. See section "4. Fixture (*.fixture.ts)" in "Implementation Patterns Reference" below.
- [ ] Fixture functions MUST return the response body directly (not the full HTTP response) to improve test readability. For rare cases needing headers or status codes, create a separate fixture.
- [ ] MUST avoid code duplication between *.fixture.ts files. One *.fixture.ts files can be reuse accross multiple `*.apiTest.ts` files.
- [ ] MUST avoid using wait time to synchronise test case executions (ex: setTimeout). If unavoidable, you MUST ask for explicit user confirmation before using `aFewSeconds(delayInSeconds)` from `@villedemontreal/concurrent-api-tests` to address the race condition.
- [ ] MUST not teardown, they are complex and useless since concurrent api tests CANNOT rely on preexisting mutable state.

### API client generation (Minimalistic Principle)
- [ ] MUST run `npm run generate-api-client` to generate/regenerate the API client from the OpenAPI specification before writing tests. Check if generated files exist in `test/shared/apiUnderTest/generated/`; if missing or outdated, regenerate them.
- [ ] The code code under `test/shared/apiUnderTest/generated/` MUST NOT be edited manually.
- [ ] MUST use the generated API client functions directly from test/shared/apiUnderTest/generated/*. DO NOT create wrapper functions that duplicate fetch logic. The fixture files MUST call the generated functions directly (e.g., `postItem(request)`, `searchItems(params)`).

### Arrange (Minimalistic Principle)

> ⚠️ **STOP before writing each test and answer these questions:**
> 1. What specific behavior is this test verifying?
> 2. Which attributes directly prove this behavior works?
> 3. What is the data partition strategy for this endpoint (from `data-partitions.yaml`)?
> 4. Have I left ALL other attributes to template defaults?

- [ ] MUST only override attributes from the template that are **meaningful for the behavior being tested**. All other attributes MUST be left to template defaults. This is CRITICAL for test readability and maintainability.
- [ ] Data partition attributes (client-controlled value) are always meaningful for isolation and MUST be set (unless it's a server-generated values).
- [ ] MUST use the data partition strategy documented in `data-partitions.yaml` for the endpoint under test (ask user if the information is not available).
- [ ] MUST NOT add comment in tests to identify the data partition. It's already specified in `data-partitions.yaml`.
- [ ] MUST follow the data partitioning convention: `${getTestRunId()}-${short-readable-name-unique-in-all-test-cases}` where `getTestRunId()` is from `@villedemontreal/concurrent-api-tests`. Example: `${getTestRunId()}-blog-post-draft` or `${getTestRunId()}-user-john-doe`.
- [ ] MUST avoid reliance on preexisting state.
- [ ] MUST not use setup, they are prohibited in order favor isolation of concurrent tests.
- [ ] MUST arrange only through public HTTP endpoints. Never internal databases or components in order to preserve black‑box guarantees and enabling refactors.
- [ ] MUST organise template with defaults values in *.template.ts files. 
- [ ] MUST use `defineCopyTemplate(template)` from `@villedemontreal/concurrent-api-tests` to define template. See copyBlogPostTemplate example in section "3. Template (*.template.ts)" in "Implementation Patterns Reference" below.
- [ ] MUST keep template defaults clearly artificial yet valid.
- [ ] MUST use `defineCopyTemplateVariation(originalCopyTemplate, variation)` from `@villedemontreal/concurrent-api-tests` to avoid duplication when the same template is used in 5+ test cases. See copyBlogPostWithEmptyContentTemplate example in section "3. Template (*.template.ts)" in "Implementation Patterns Reference" below. Do not overuse, in doubt rely only on defineCopyTemplate + override in each test.
- [ ] MUST use shared immutable fixtures only when attributes are meaningless for the behavior under test. Shared immutable fixtures are immutable during test execution. Do not overuse.
- [ ] MUST use `defineGetSharedFixture(createSharedFixture)` when a shared immutable fixture is required. See getImmutableGuessUser example in subsection "Shared Immutable Fixture" of section "4. Fixture (*.fixture.ts)" in "Implementation Patterns Reference" below. Immutable data is the only kind of data that may be shared between concurrent tests while preserving isolation.
- [ ] MUST use `defineGetSharedFixtureByKey(createSharedFixtureByKey)` when a shared immutable fixture by key is required. One shared fixture per key. See getImmutableUser example in subsection "Shared Immutable Fixture" of section "4. Fixture (*.fixture.ts)" in "Implementation Patterns Reference" below.

### Act
- [ ] MUST assign the response of the act request to a variable named actual.

### Assert (Minimalistic Principle)

> ⚠️ **STOP before writing assertions:**
> 1. Am I asserting ONLY what proves this specific behavior works?
> 2. Am I using EXPLICIT values (not variables) for client-controlled data?
> 3. Have I avoided asserting irrelevant fields?

- [ ] MUST assert only attributes that are **meaningful for the behavior being tested**. Do NOT assert every field returned by the API.
- [ ] MUST ask yourself: "What is this test verifying?" Only assert attributes that prove the behavior works correctly. PROHIBITED: Asserting attributes that are irrelevant to the test's purpose (e.g., asserting the keywords when testing that the title must not be empty).
- [ ] MUST explicitly initialize every asserted field during arrange (only the meaningful ones).
- [ ] MUST assert on explicit expected values for client-controlled attributes. DO NOT use variables for client-controlled values. For server-generated values (IDs, timestamps, etc.), using arrange response variables is acceptable and often necessary. Example: `assert.strictEqual(actual.title, "My Title")` is correct for client-controlled title. `assert.strictEqual(actual.title, request.title)` is WRONG because it creates circular logic. However, `assert.sameMembers(actual.map(x => x.id), [created1.id, created2.id])` is correct for server-generated IDs.
- [ ] MUST NOT assert on template default values. Always override fields to meaningful values before asserting on them. Example: `assert.strictEqual(actual.title, "titleDefault")` is WRONG because it asserts on a default value. Instead, set an explicit value in arrange and assert on that explicit value.
- [ ] MUST NOT assert on status code if the response is a success (2xx)
- [ ] an exception MUST be thrown if the response is not a success (2xx)
- [ ] MUST use `shouldThrow(act, customAssert)` from `@villedemontreal/concurrent-api-tests` when an HTTP error is expected. See test case "Title is required" in section "2. Test File (*.apiTest.ts)" in "Implementation Patterns Reference" below.
- [ ] MUST assert at least both status code and error message when using `shouldThrow`. Additional assertions MAY be added if required to properly test the spec.
- [ ] MUST not assert on what is already guarantee by the OpenAPI specification. Example: attribute type, isDefined, etc.
- [ ] MUST use `assert` from `chai` for assertions.

---

## Implementation Patterns Reference

> **Complete patterns guide** - All implementation examples and conventions are documented here.

### 1. File Structure

```
test/
├── allTests.apiTestSuite.ts    # Root suite - imports all *.apiTest.ts
├── shared/
│   └── apiUnderTest/
│       ├── open-api.yaml           # OpenAPI specification (project-specific)
│       ├── data-partitions.yaml    # Data partition strategy for each endpoint (project-specific)
│       ├── generated/              # Auto-generated API client ⚠️ NEVER edit manually
│       └── tooling/                # Code generation scripts (adapt if needed)
└── {feature}/ # ⚠️ Folder and file name MUST be in English
    ├── {feature}.apiTest.ts    # Tests (describe/it)
    ├── {feature}.fixture.ts    # Arrange/Act helpers
    └── {feature}.template.ts   # Request templates
```

---

### 2. Test File (*.apiTest.ts)

> **Note:** The examples below include explanatory comments for learning purposes. Generated test code should NOT include data partition comments since that information is already in `data-partitions.yaml`.

```typescript
// ✅ File: blogPost.apiTest.ts (English name)
import { shouldThrow, getTestRunId } from "@villedemontreal/concurrent-api-tests";
import { assert } from "chai";
import { postBlogPost, getBlogPosts } from "./blogPost.fixture";  // ✅ English names
import { copyBlogPostTemplate } from "./blogPost.template";        // ✅ English names

// ✅ Function name in English
export function blogPostApiTests() {
  // ✅ describe() and it() strings match Gherkin language
  describe("BlogPosts", () => {
    
    // ✅ Basic test
    // data partitioned by blog post id (server-generated id)
    // no need to arrange data partition because blog post id is a server-generated ID
    it("Create", async () => {
      // arrange only what is meaningful for the test
      const request = copyBlogPostTemplate((x) => {
        x.title = "Incredible story!";
      });

      // Act
      const actual = await postBlogPost(request);

      // Assert - use explicit expected values for client-controlled attributes
      // Note: fixtures return body directly, so no .body needed
      assert.strictEqual(actual.title, "Incredible story!");
    });

    // ✅ Error case with shouldThrow
    // data partitioned by blog post id (server-generated id)
    it("Title is required", async () => {
      const request = copyBlogPostTemplate((x) => {
        x.title = null;
      });

      await shouldThrow(
        () => postBlogPost(request),
        (err) => {
          // Error structure is defined in OpenAPI specification
          assert.strictEqual(err.status, 400);
          assert.include(err.data.message, "title");
          assert.include(err.data.message, "required");
        },
      );
    });

    // ✅ Searching a list, using a filter for data partition
    // data partitioned by keyword (client-controlled field)
    // each blog post created in the setup phase must be associated with the same unique keyword
    it("Search by keyword", async () => {
      const keyword = `${getTestRunId()}-a-keyword`;
      // use promise.all when it makes the test faster without losing readability or reliability
      const [blogPost1, blogPost2] = await Promise.all([
        postBlogPost(copyBlogPostTemplate((x) => {
          x.title = "first";
          x.keywords = [keyword];
        })),
        postBlogPost(copyBlogPostTemplate((x) => {
          x.title = "second";
          x.keywords = [keyword];
        }))
      ]);

      const actual = await getBlogPosts(keyword);

      assert.strictEqual(actual.length, 2);
      // Server-generated IDs: response variables are acceptable
      assert.sameMembers(actual.map((x) => x.id), [blogPost1.id, blogPost2.id]);
      // Client-controlled titles: use explicit values
      assert.include(actual.map(x => x.title), "first");
      assert.include(actual.map(x => x.title), "second");
    });
  });
}
```

---

### 3. Template (*.template.ts)

```typescript
import { defineCopyTemplate, defineCopyTemplateVariation } from "@villedemontreal/concurrent-api-tests";
import { BlogPost } from "../shared/apiUnderTest/apiClient";

// Base template with artificial but valid defaults
export const copyBlogPostTemplate = defineCopyTemplate<BlogPost>({
  title: "titleDefault",           // Use recognizable suffix
  content: "contentDefault",
  keywords: [],
  likeCount: 0,
  commentCount: 0,
  id: null,                        // Server-generated
  authorId: null,                  // Don't assume pre-existing state
});

// Variation - only when reused in MANY test cases
export const copyBlogPostWithEmptyContentTemplate = defineCopyTemplateVariation<BlogPost>(
  copyBlogPostTemplate,
  (x) => (x.content = ""),
);
```

#### Nested Templates

When requests contain complex nested objects, define a separate template for each nested type:

```typescript
// Template for nested object
export const copyReferenceLinkTemplate = defineCopyTemplate<ReferenceLink>({
  title: "titleDefault",
  description: "descriptionDefault",
  href: "https://www.href-default.com",
});

// Usage in tests - compose nested templates
const request = copyBlogPostTemplate((x) => {
  x.title = "A post with reference links";
  x.referenceLinks = [
    copyReferenceLinkTemplate((y) => {
      y.href = "https://www.example.com";
    }),
    copyReferenceLinkTemplate((y) => {
      y.href = "https://www.another.com";
    }),
  ];
});
```

#### ❌ Template usage anti-pattern: Over-specified arrange (PROHIBITED)

```typescript
// Test: "Title is required"
// ❌ WRONG - title and difficulty are NOT meaningful for testing single-word behavior
const request = copyBlogPostTemplate((x) => {
  x.title = null;                    // ✅ Meaningful (required title is the behavior under test)
  x.content = "Lorem ipsum...";      // ❌ PROHIBITED - not meaningful for this test
  x.keywords = ["testing", "api"];   // ❌ PROHIBITED - not meaningful for this test
});
```

#### ✅ Correct: Minimalistic arrange

```typescript
// Test: "Title is required"
// ✅ CORRECT - only meaningful attributes are overridden
const request = copyBlogPostTemplate((x) => {
  x.title = null;                    // ✅ Meaningful (required title is the behavior under test)
});
```

---

### 4. Fixture (*.fixture.ts)

For arrange, act and assert functions with high potential for reuse.

**Best practice:** Fixtures should return only the response body, not the full HTTP response. This improves readability by avoiding `.body.*` throughout tests. For rare cases needing headers or status codes, create a separate fixture returning the full response.

```typescript
import { BlogPost, getBlogPosts as getBlogPostsApiClient, postBlogPost as postBlogPostApiClient } from "../shared/apiUnderTest/generated/api";

// ✅ CORRECT: Return body directly for cleaner test code
export async function postBlogPost(request: BlogPost): Promise<BlogPost> {
  const response = await postBlogPostApiClient(request);
  return response.body;
}

export async function getBlogPosts(keyword: string): Promise<BlogPost[]> {
  const response = await getBlogPostsApiClient({ keyword });
  return response.body;
}
```

#### Validation Error Assertion Helper

Extract common error assertion logic for type safety and reuse:

```typescript
// test/shared/validation.fixture.ts
import { assert } from "chai";
import { ApiErrorResponse } from "../apiUnderTest/generated/api";

export function assertValidationError(err: any): ApiErrorResponse {
  assert.strictEqual(err.status, 400);
  assert.exists(err.data);
  return err.data as ApiErrorResponse;  // Type-safe after assertion
}

// Usage in tests
await shouldThrow(
  () => postBlogPost(request),
  (err) => {
    const validationError = assertValidationError(err);
    assert.include(validationError.message, "title");
  }
);
```

#### Shared Immutable Fixture

For sharing immutable state between tests. Common use case: JWT tokens that are read-only during test execution.

```typescript
import { defineGetSharedFixture, defineGetSharedFixtureByKey } from "@villedemontreal/concurrent-api-tests";

// Single shared fixture - created once per test run
export const getImmutableGuestUser = defineGetSharedFixture<User>(() => createUser("guest"));

// Shared fixture by key - one per unique key (e.g., JWT token per role)
export const getJwtTokenFor = defineGetSharedFixtureByKey<UserRole, JwtToken>(
  (role) => fetchJwtToken(role)  // Authenticates once per role, caches result
);

// Usage in fixture - each feature sets its own default role
export async function postBlogPost(request: BlogPost, role: UserRole = "admin") {
  const jwtToken = await getJwtTokenFor(role);
  const response = await postBlogPostApiClient(request, { headers: { Authorization: `Bearer ${jwtToken}` } });
  return response.body;
}

// Usage in tests
it("Editor can create blog post", async () => {
  const request = copyBlogPostTemplate((x) => { x.title = "Editor Post"; });

  const actual = await postBlogPost(request, "editor");

  assert.strictEqual(actual.title, "Editor Post");
});
```

**Important:** Only share truly immutable data. JWT tokens are safe because tests read them, never modify them.

---

### 5. Scenario Outline → it.each

When a Gherkin `Scenario Outline` with `Examples` is used, map it to `it.each`. Each row in the Examples table becomes a parameterized test case.

> **Important:** Avoid conditionals inside parameterized tests. If different example rows require different logic (e.g., success vs error), split them into separate `Scenario Outline` blocks in Gherkin, which maps to separate `it.each` calls.

```typescript
// Gherkin:
// Scenario Outline: Apply discount to order total
//   Examples:
//     | subtotal | discountPercent | expectedTotal |
//     | 100      | 0               | 100           |
//     | 100      | 10              | 90            |
//     | 100      | 50              | 50            |

it.each([
  { subtotal: 100, discountPercent: 0, expectedTotal: 100 },
  { subtotal: 100, discountPercent: 10, expectedTotal: 90 },
  { subtotal: 100, discountPercent: 50, expectedTotal: 50 },
])("Order $subtotal with $discountPercent% discount → total=$expectedTotal", async ({ subtotal, discountPercent, expectedTotal }) => {
  const request = copyOrderTemplate((x) => {
    x.subtotal = subtotal;
    x.discountPercent = discountPercent;
  });

  const actual = await postOrder(request);

  assert.strictEqual(actual.total, expectedTotal);
});
```

---

### 6. Root Suite (allTests.apiTestSuite.ts)

```typescript
import { blogPostApiTests } from "./blogPosts/blogPost.apiTest";
import { userApiTests } from "./users/user.apiTest";

userApiTests();
blogPostApiTests();
```

---

### Key Patterns Summary

| Pattern | When to Use |
|---------|-------------|
| `defineCopyTemplate()` | Always for request templates |
| `defineCopyTemplateVariation()` | Only when variation reused in 5+ tests. Do not overuse. |
| `defineGetSharedFixture()` | Immutable data shared by 5+ tests. Do not overuse. |
| `defineGetSharedFixtureByKey()` | Immutable data by key (e.g., user by role) shared by 5+ tests. Do not overuse. |
| `shouldThrow()` | Any test expecting HTTP error |
| `getTestRunId()` | Data partition ID prefix for client-controlled partition fields |
| `aFewSeconds()` | AVOID - ask user first if unavoidable |

---

### Data Partition Convention

```typescript
const id = `${getTestRunId()}-{short-readable-unique-name}`;
// Examples:
// ${getTestRunId()}-blog-post-draft
// ${getTestRunId()}-user-john-doe
// ${getTestRunId()}-order-cancelled
```

---

### Gherkin → Test Mapping

| Gherkin | Test Code |
|---------|-----------|
| `Feature:` | `describe("Feature name", () => { ... })` |
| `Rule:` | `describe("Rule name", () => { ... })` |
| `Example:` / `Scenario:` | `it("Example name", async () => { ... })` |
| `Scenario Outline:` + `Examples:` | `it.each([...])("name", async (params) => { ... })` |
| `Background:` | Inline in each test's Arrange phase |
