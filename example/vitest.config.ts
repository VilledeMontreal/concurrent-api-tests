import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.apiTestSuite.ts"],
    reporters: ["verbose"],
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
