---
title: "ADR-0001: Replace Mocha Parallel with Vitest for Concurrent API Testing"
status: "Accepted"
date: "2025-10-28"
authors: "Stéphane Leblanc (Maintainer)"
tags: ["architecture", "decision", "testing", "concurrency"]
supersedes: ""
superseded_by: ""
---

# ADR-0001: Replace Mocha Parallel with Vitest for Concurrent API Testing

## Status

Accepted

## Context

Legacy approach: Mocha + mocha.parallel for in-process spec-level concurrency. Issue: mocha.parallel is unmaintained (security & compatibility risk) and requires custom retry + logging hacks. We need an actively maintained runner with: native retries & full error stacks, strong TS DX, fast feedback (watch), easy reporter extension, minimal migration friction, and preservation of single-threaded concurrency & immutable shared setup.

## Decision

Select Vitest, wrapped by `@villedemontreal/concurrent-api-tests` to isolate runner specifics (concurrency helpers, deterministic shared state, flaky reporting). Vitest provides active maintenance, built‑in retries, rich reporters, TypeScript/ESM first design, and high performance via the Vite pipeline. Vitest yields strongest overall improvement with lowest long‑term risk.

### Comparative Evaluation

| Criteria                                                      | Status quo     | Ava | Vitest | Mocha with throat |
| ------------------------------------------------------------- | -------------- | --- | ------ | ----------------- |
| Minimize maintenance effort                                   | not maintained | -   | +      | -                 |
| Minimize effort to replace Mocha Parallel                     | +              | +   | +      | -                 |
| Retries flaky tests                                           | +              | -   | +      | +                 |
| Full error log (also for flaky tests)                         | +              | +/- | +/-    | +                 |
| Easy migration path for existing projets                      | +              | +/- | +/-    | +                 |
| Each test (as opposed to each test file) can run concurrently | +              | +   | +      | +                 |
| Can init imutable shared state                                | +              | +   | +      | +                 |
