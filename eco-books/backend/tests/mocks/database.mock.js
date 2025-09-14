import { vi } from 'vitest';

export const sequelize = { query: vi.fn() };

vi.mock('../../src/config/database.js', () => ({
  sequelize,
}));
