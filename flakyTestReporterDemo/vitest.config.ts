import { defineConfig } from "vitest/config";
import { FlakyTestReporter } from "@villedemontreal/concurrent-api-tests";

export default defineConfig({
  test: {
    include: ["**/*.apiTestSuite.ts"],
    reporters: [new FlakyTestReporter()],
    retry: 2,
    globals: true,
  },
});
