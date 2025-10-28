---
title: "ADR-0001: Replace Mocha Parallel with Vitest for Concurrent API Testing"
status: "Proposed"
date: "2025-10-28"
authors: "Stéphane Leblanc (Maintainer), QA Engineers, API Test Contributors"
tags: ["architecture", "decision", "testing", "concurrency"]
supersedes: ""
superseded_by: ""
---

# ADR-0001: Replace Mocha Parallel with Vitest for Concurrent API Testing

## Status

**Proposed** | Accepted | Rejected | Superseded | Deprecated

## Context

Mocha Parallel (via the mocha.parallel library) enabled single-threaded concurrent execution of API test cases, allowing each individual test to run concurrently (not only per-file). However, the mocha.parallel project is no longer actively maintained, creating risks around: security updates, Node.js version compatibility, ecosystem integration, and ongoing feature evolution (e.g., improved flaky test handling, richer reporters). The existing solution required bespoke retry logic and custom wrappers to surface full error logs for flaky tests while keeping tests readable.

Strategic goals driving reassessment:

- Reduce maintenance burden by adopting a well-supported test runner with an active community.
- Preserve or improve ability to run each spec concurrently while isolating immutable shared state initialization.
- Provide first-class retry capabilities and structured flaky test reporting.
- Facilitate easier onboarding and migration for new projects relying on concurrent API testing.
- Modernize developer experience (TypeScript-first support, watch mode speed, native ESM compatibility, built-in snapshot/debug tooling).

Observed repository evolution on the feature branch includes addition of Vitest configuration files (`vitest.config.ts`), updated `package.json` scripts invoking `vitest`, type configuration referencing `vitest/globals`, and a refactoring of naming/branding from mocha-concurrent-api-tests to concurrent-api-tests. A new internal library (`@villedemontreal/concurrent-api-tests`) encapsulates concurrency helpers integrating with Vitest reporters and node APIs, replacing previous Mocha-specific abstractions.

Environmental constraints:

- Need to support flaky test retries with complete error stack visibility for each attempt.
- Must avoid introducing multi-process complexity not required by single-threaded event loop concurrency semantics.
- Must remain implementable with minimal migration friction for existing Mocha-based test suites.

## Decision

Adopt Vitest as the foundational test runner for implementing Concurrent API Tests, encapsulated behind a lightweight internal library (`@villedemontreal/concurrent-api-tests`) that provides concurrency orchestration, deterministic setup of immutable shared state, and enhanced flaky test reporting. Vitest was selected due to its active maintenance, modern TypeScript integration, performance (leveraging Vite architecture), built-in parallelization primitives and reporter ecosystem, and flexibility to extend via node-level APIs without reviving an unmaintained dependency.

Key rationale:

- Active, responsive community reduces long-term maintenance risk versus the stagnant mocha.parallel project.
- Native retry and rich reporter capabilities (extensible) enable clearer flaky test diagnostics without bespoke patching.
- TypeScript-first approach simplifies configuration (no manual global imports) and improves DX for contributors.
- Alignment with future-facing tooling (ESM, fast watch mode) improves feedback cycles for iterative test development.

## Consequences

### Positive

- **POS-001**: Reduces maintenance risk by relying on a well-maintained, evolving test framework (Vitest) instead of an unmaintained extension library.
- **POS-002**: Improves developer experience: faster watch mode, integrated TypeScript types (`vitest/globals`), streamlined configuration, and richer reporter customization.
- **POS-003**: Enables standardized flaky test retry + reporting flows, enhancing observability and post-failure triage.
- **POS-004**: Facilitates easier onboarding: widely adopted tooling and clearer migration guidance via internal abstraction layer.
- **POS-005**: Aligns with architectural principles of minimizing bespoke infrastructure while maximizing use of supported open-source ecosystems.

### Negative

- **NEG-001**: Migration requires refactoring Mocha-specific constructs (hooks, reporter expectations) which introduces short-term effort and potential regression risk.
- **NEG-002**: Differences in concurrency semantics may necessitate validation to ensure parity with previous single-threaded event loop behavior (risk of subtle timing issues).
- **NEG-003**: Learning curve for contributors accustomed to Mocha (reporter differences, snapshot features, new CLI commands).
- **NEG-004**: Potential dependency on Vitest internal APIs (e.g., reporters) could require maintenance if upstream interfaces change.
- **NEG-005**: Retrying tests may mask intermittent environment instability if thresholds not carefully defined (risk of false confidence).

## Alternatives Considered

### Status Quo (Mocha Parallel)

- **ALT-001**: **Description**: Continue using Mocha + mocha.parallel library for single-threaded concurrent spec execution and custom flaky retry logic.
- **ALT-002**: **Rejection Reason**: Library unmaintained; increasing maintenance/security risk, limited evolution for flaky reporting, and rising migration cost if delayed.

### Ava

- **ALT-003**: **Description**: Use Ava's built-in concurrency model (isolation per test file, test-level async support) to mimic current approach.
- **ALT-004**: **Rejection Reason**: Less native retry/flaky tooling; migration complexity for Mocha-style BDD syntax; diminished ecosystem familiarity among existing contributors.

### Mocha with throat (manual concurrency control)

- **ALT-005**: **Description**: Replace mocha.parallel with manual throttling via libraries like `throat` to limit concurrent promises within Mocha's runner.
- **ALT-006**: **Rejection Reason**: Recreates a custom concurrency layer (higher maintenance), lacks integrated reporter & retry primitives, and perpetuates reliance on Mocha when strategic modernization is desired.

### Other Modern Runners (e.g., Jest)

- **ALT-007**: **Description**: Adopt Jest with custom concurrency harness for API tests and potential integration with worker pools.
- **ALT-008**: **Rejection Reason**: Heavier runtime abstraction, potential overlap / redundancy with existing tooling, slower startup than Vitest in certain workflows, and additional migration friction.

## Implementation Notes

- **IMP-001**: Introduce abstraction layer in `@villedemontreal/concurrent-api-tests` encapsulating concurrency orchestration, test data fixtures, and reporter augmentation (avoid leaking runner-specific details into test suites).
- **IMP-002**: Provide incremental migration guide: map Mocha hooks (`before`, `after`, etc.) to Vitest equivalents, verify retry semantics, and convert any custom reporters.
- **IMP-003**: Establish flaky test policy: retry count threshold, classification of persistent failures, and logging format for each attempt to preserve full stack traces.
- **IMP-004**: Validate concurrency parity via benchmark tests comparing timing/order behavior against legacy suite (focus on shared immutable state initialization and absence of race conditions).
- **IMP-005**: Add monitoring heuristics: track flaky rate, average retry resolution time, and failed-after-retries count to detect environment instability.
- **IMP-006**: Pin Vitest version initially; schedule periodic review for upstream API changes or performance improvements.

## References

- **REF-001**: Original mocha.parallel repository: https://github.com/danielstjules/mocha.parallel
- **REF-002**: Vitest documentation: https://vitest.dev
- **REF-003**: Concurrent API Tests approach (Medium article): https://medium.com/@stphaneleblanc/d84f7a29f0dc
- **REF-004**: Node.js single-threaded event loop model reference: https://medium.com/@sgd.daran/node-js-single-threaded-event-loop-model-dbeccf6a7c34
- **REF-005**: Repository evolution (feature branch introducing `vitest.config.ts` and `vitest/globals` typing).

## Appendix: Diff Summary (High-Level)

- Added Vitest configuration (`lib/vitest.config.ts`, `example/vitest.config.ts`).
- Updated `package.json` scripts to use `vitest run`, `vitest all --run`, and `vitest flaky --run` commands.
- Introduced TypeScript `types` entries referencing `vitest/globals` to eliminate per-file imports.
- Refactored library description & README content from Mocha-centric to Vitest-centric usage examples.
- Implemented new internal library surfaces leveraging `vitest/node` and reporter APIs for concurrency & verbose/flaky reporting.
- Removed dependency on mocha.parallel (implicit through replacement rather than direct deletion diff shown here due to branch context).

---
