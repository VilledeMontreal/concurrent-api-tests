## To Install

In your project, run this npm command:

`npm install @villedemontreal/concurrent-api-tests`

## Concurrent API Test Functions

### defineCopyTemplate(template)

Define a function that provide a default payload template and that allow to specify only the parts of the payload that are meaningful for the test case. This way, test cases are easier to read since only the parts that matter are specified. Moreover, if a change in a payload is required, only the default payload template and the related tests need to be changed.

**Arguments**

- template: A default payload template.

**Returns**

A function that provide a default payload template and allow to specify only the parts of the payload that are meaningful for the test case.

**Example**

```typescript
import { defineCopyTemplate } from "@villedemontreal/concurrent-api-tests";

interface BlogPost {
  title: string;
  content: string;
  keywords: string[];
  category: string;
}

export const copyBlogPostTemplate = defineCopyTemplate<BlogPost>({
  title: "titleDefault",
  content: "contentDefault",
  keywords: [],
  category: "categoryDefault",
});

// In test — only override what matters
const request = copyBlogPostTemplate((x) => {
  x.title = "My Custom Title";
});
```

---

### defineCopyTemplateVariation(originalCopyTemplate, variation)

Define a copy template variation to avoid duplication when the same template is used in many test cases.

**Arguments**

- originalCopyTemplate: The original copy template function. See [defineCopyTemplate](#definecopytemplatetemplate).
- variation: A function that specifies only the parts of the payload that are meaningful for the variation.

**Returns**

A function that provide a default payload template and allow to specify only the parts of the payload that are meaningful for the test case.

**Example**

```typescript
import { defineCopyTemplateVariation } from "@villedemontreal/concurrent-api-tests";

// Create a variation for blog posts with a specific category
export const copyTechBlogPostTemplate = defineCopyTemplateVariation(
  copyBlogPostTemplate,
  (x) => {
    x.category = "tech";
  }
);

// In test — the variation already has category set
const request = copyTechBlogPostTemplate((x) => {
  x.title = "Tech Article";
});
// request.category is already "tech"
```

---

### shouldThrow(act, customAssert)

Assert against an API request that is expected to throw an error.

**Arguments**

- act: A function that send the API request.
- customAssert: A function that assert against the error.

**Returns**

void

**Example**

```typescript
import { shouldThrow } from "@villedemontreal/concurrent-api-tests";
import { assert } from "chai";

it("Title is required", async () => {
  const request = copyBlogPostTemplate((x) => {
    x.title = null;
  });

  await shouldThrow(
    () => postBlogPost(request),
    (err) => {
      assert.strictEqual(err.status, 400);
      assert.include(err.message, "title");
    }
  );
});
```

---

### aFewSeconds(delayInSeconds)

Some test cases must rely on the timing between API requests. These test cases are likely to be [flaky](https://hackernoon.com/flaky-tests-a-war-that-never-ends-9aa32fdef359) if the timing is not managed with care.

If the precision of the timing has to be less than a second, then concurrent-api-tests is not the right tool for this test case.

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

```typescript
import { defineGetSharedFixture } from "@villedemontreal/concurrent-api-tests";

interface JwtToken {
  token: string;
  expiresAt: Date;
}

// Shared fixture — caches the JWT token for all tests
export const getAdminJwtToken = defineGetSharedFixture<JwtToken>(
  () => fetchJwtToken("admin") // Called only once, then cached
);

// In test
it("Admin can create blog post", async () => {
  const token = await getAdminJwtToken();
  // token is reused across all tests that call getAdminJwtToken()
});
```

---

### defineGetSharedFixtureByKey(createSharedFixtureByKey)

Same as defineGetSharedFixture, but allow to pass a key as argument. Useful when there are many similar shared fixture to be defined.

**Arguments**

- createSharedFixtureByKey: A function that initialize the shared fixture for a specific key.

**Returns**

A function that perform lazy initialization of the shared fixture for a specific key.

**Example**

```typescript
import { defineGetSharedFixtureByKey } from "@villedemontreal/concurrent-api-tests";

type UserRole = "admin" | "editor" | "reader";

interface JwtToken {
  token: string;
  expiresAt: Date;
}

// Shared by key — caches one JWT token per role
export const getJwtTokenFor = defineGetSharedFixtureByKey<UserRole, JwtToken>(
  (role) => fetchJwtToken(role) // Called once per unique role
);

// In tests
it("Editor can create blog post", async () => {
  const token = await getJwtTokenFor("editor");
  // First call authenticates; subsequent calls reuse cached token
});

it("Admin can delete blog post", async () => {
  const token = await getJwtTokenFor("admin");
  // Different key, so authenticates separately from "editor"
});
```

## Testing concurrent-api-tests itself

Run all unit tests, run this npm command:

`npm start`

Debug all unit tests, run this npm command:

`npm run watch-no-emit` (to activate incremental transpilation) and use a JavaScript Debug Terminal.

Lint, run this npm command:

`npm run lint-fix`
