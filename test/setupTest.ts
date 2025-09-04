import { beforeAll, vi } from 'vitest';

beforeAll(() => {
  vi.stubEnv('NODE_ENV', 'development');
  vi.stubEnv(
    'ALLOWED_ORIGINS',
    'http://localhost:3000,http://localhost:5173,http://localhost:5174',
  );
  vi.stubEnv('PORT', '2001');
  vi.stubEnv('DB_HOST', 'localhost');
  vi.stubEnv('DB_NAME', 'postgres');
  vi.stubEnv('DB_USER', 'postgres');
  vi.stubEnv('DB_PASSWORD', '13061813');
  vi.stubEnv('DB_PORT', '5432');
  vi.stubEnv(
    'JWT_SECRET',
    '4ec12c069cbc43a238df905837a13519d0f86ceae541b58b12452d347007372a',
  );
});
