import { defineConfig } from "vitest/config";
import { FlakyTestReporter } from "@villedemontreal/concurrent-api-tests";

export default defineConfig({
  test: {
    include: ["**/*.apiTestSuite.ts"],
    setupFiles: ["./test/shared/apiUnderTest/tooling/setupGlobalFetch.ts"],
    reporters: [new FlakyTestReporter()],
    testTimeout: 2 * 60 * 1000, // 2 min
    slowTestThreshold: 1 * 60 * 1000, // 1 min
    retry: 2,
    sequence: {
      concurrent: true,
    },
    maxConcurrency: 30,
    // single-threaded
    pool: "threads",
    maxWorkers: 1,
    // Avoid importing vitest in each test file
    globals: true,
  },
});
