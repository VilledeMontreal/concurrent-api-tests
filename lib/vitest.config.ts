import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    reporters: ["verbose"],
    testTimeout: 30000, // 30 seconds
    slowTestThreshold: 5000, // 5 seconds
    retry: 1,
    // Compile TypeScript on the fly
    globals: true,
    environment: "node",
  },
});