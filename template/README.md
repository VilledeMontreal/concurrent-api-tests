# Project Name

Concurrent API tests using [Vitest](https://vitest.dev/) and [@villedemontreal/concurrent-api-tests](https://github.com/VilledeMontreal/concurrent-api-tests).

## Getting Started

```bash
npm install
npm start
```

## Scripts

| Command                       | Description                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------ |
| `npm start`                   | Run tests against the current environment (alias for `test-current`)                       |
| `npm run test-current`        | Run tests with `NODE_ENV=localhost`                                                        |
| `npm run test-latest-stable`  | Run tests with `NODE_ENV=dev` for stable environment                                       |
| `npm run watch-no-emit`       | Type-check in watch mode without emitting .js files. Vitest directly works with .ts files. |
| `npm run lint-fix`            | Format code with Prettier and fix ESLint issues                                            |
| `npm run generate-api-client` | Generate typed API client from OpenAPI spec using Orval                                    |

## File Conventions

| Extension          | Purpose                          |
| ------------------ | -------------------------------- |
| `.apiTests.ts`     | Tests for a feature              |
| `.apiTestSuite.ts` | Groups tests to run concurrently |
| `.fixture.ts`      | Common functions for tests       |
| `.template.ts`     | Default payload templates        |

## Learn More

- [Concurrent API Testing Guide](https://github.com/VilledeMontreal/concurrent-api-tests/blob/master/doc/concurrent-api-testing-guide.md)
