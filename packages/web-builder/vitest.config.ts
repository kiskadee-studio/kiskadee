import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // Enables the use of globals, such as "describe", "it", and "expect"
    environment: 'node', // Sets the test environment (ideal for unit testing)
    include: ['**/*.test.ts'], // Includes only files that end with .test.ts
    coverage: {
      provider: 'v8', // Uses the V8 engine for test coverage
      enabled: true,
      reportsDirectory: './coverage' // Sets the folder to save coverage reports
    }
  }
});
