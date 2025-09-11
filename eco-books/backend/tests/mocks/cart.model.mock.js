import { vi } from 'vitest';

export const CartModelMock = {
  findAll: vi.fn(),
  findByPk: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  destroy: vi.fn(),
};

vi.mock('../../src/modules/model/cart.model.js', () => ({
  default: CartModelMock,
}));
