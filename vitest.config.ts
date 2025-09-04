import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./test/setupTest.js'],
    include: ['**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      all: true,
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 90,
        statements: 90,
      },
      exclude: [
        'test/**',
        'src/configs/**',
        'src/routes/**',
        'src/main.ts',
        '**/*.config.mjs',
        '**/*.config.ts',
        'scripts/**',
      ],
    },
  },
});
