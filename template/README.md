# Project Name

Concurrent API tests using [Vitest](https://vitest.dev/) and [@villedemontreal/concurrent-api-tests](https://github.com/VilledeMontreal/concurrent-api-tests).

## Getting Started
This template includes a [dev container](https://containers.dev/) for a consistent development environment. To use it:

1. Open this folder in VS Code
2. When prompted, click "Reopen in Container" (or use the command palette: `Dev Containers: Reopen in Container`)
3. Wait for the container to build and start
4. Run `npm install` and `npm start`

The container includes Node.js and recommended VS Code extensions for API testing.

The example tests will fail until you connect them to a real API. See [Adapting to Your Project](#adapting-to-your-project) below.


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

| Extension          | Purpose                              |
| ------------------ | ------------------------------------ |
| `.apiTests.ts`     | Tests for a feature                  |
| `.apiTestSuite.ts` | Groups all tests to run concurrently |
| `.fixture.ts`      | Common functions for tests           |
| `.template.ts`     | Default payload templates            |

## Adapting to Your Project

This template is ready to use out of the box, but you'll need to customize it for your API:

### 1. Replace the OpenAPI specification

Update `test/shared/apiUnderTest/open-api.yaml` with your API's OpenAPI spec, then regenerate the client:

```bash
npm run generate-api-client
```

This uses [Orval](https://orval.dev/) to generate a typed API client. You can customize the generation in `orval.config.cjs`.

### 2. Configure environments

Edit the files in `config/` to point to your API environments:
- `default.yaml` — Base configuration
- `localhost.yaml` — Local development overrides
- `dev.yaml` — Dev/staging environment overrides

### 3. Configure authentication (if required)

Edit `test/shared/apiUnderTest/tooling/auth.sharedFixture.ts` to implement actual authentication against your API. The template includes a placeholder that returns fake tokens.

Update `config/default.yaml` with your test user credentials. For secrets, use environment-specific files (`config/local.yaml`) that are not committed to git.

### 4. Write your tests

Replace the example in `test/gettingStarted/` with your own features. Follow the [Concurrent API Testing Guide](https://github.com/VilledeMontreal/concurrent-api-tests/blob/master/doc/concurrent-api-testing-guide.md) for patterns and best practices.

## Writing Tests with AI Agents (Experimental)

This template includes Gherkin files in `gherkin/` for the [experimental AI-assisted workflow](https://github.com/VilledeMontreal/concurrent-api-tests/blob/master/doc/writing-concurrent-api-tests-with-ai-agents.md). Write natural language specifications in Gherkin format, then use AI agents to generate concurrent API tests.

## Learn More

- [Concurrent API Testing Guide](https://github.com/VilledeMontreal/concurrent-api-tests/blob/master/doc/concurrent-api-testing-guide.md) — Core methodology and patterns
- [Library API Reference](https://github.com/VilledeMontreal/concurrent-api-tests/blob/master/lib/README.md) — Function documentation
- [Writing Tests with AI Agents](https://github.com/VilledeMontreal/concurrent-api-tests/blob/master/doc/writing-concurrent-api-tests-with-ai-agents.md) — Experimental AI-assisted workflow
