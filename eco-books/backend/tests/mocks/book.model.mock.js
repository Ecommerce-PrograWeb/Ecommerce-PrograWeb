import { vi } from 'vitest';

export const BookModelMock = {
  findAll: vi.fn(),
  findByPk: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  destroy: vi.fn(),
};

vi.mock('../../src/modules/model/book.model.js', () => ({
  default: BookModelMock,
}));
