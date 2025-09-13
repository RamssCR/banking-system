import { beforeAll, vi } from 'vitest';

beforeAll(() => {
  vi.stubEnv('NODE_ENV', 'test');
  vi.stubEnv('ALLOWED_ORIGINS', 'http://mock-origin.com');
  vi.stubEnv('PORT', '9999');
  vi.stubEnv('DB_HOST', 'mock-host');
  vi.stubEnv('DB_NAME', 'mock-db');
  vi.stubEnv('DB_USER', 'mock-user');
  vi.stubEnv('DB_PASSWORD', 'mock-password');
  vi.stubEnv('DB_PORT', '9999');
  vi.stubEnv('JWT_SECRET', 'mock-jwt-secret-key');
});
