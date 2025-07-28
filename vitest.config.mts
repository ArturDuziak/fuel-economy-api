import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/?(*.)test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    root: '.',
    projects: [
      {
        extends: true,
        test: {
          include: ['tests/integration/**/*.test.ts'],
          globalSetup: 'tests/integration/setup.ts',
          name: 'integration',
        },
      },
    ],
  },
});
