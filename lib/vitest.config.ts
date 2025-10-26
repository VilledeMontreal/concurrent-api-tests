import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    reporters: ["verbose"],
    testTimeout: 30000, // 30 seconds
    slowTestThreshold: 5000, // 5 seconds
    environment: "node",
    // Avoid importing vitest in each test file
    globals: true,
  },
});
