import { vi } from 'vitest';

export const cartServiceMock = {
  getCarts: vi.fn(),
  getCartById: vi.fn(),
  createCart: vi.fn(),
};

vi.mock('../../src/modules/service/cart.service.js', () => ({
  default: cartServiceMock,
}));
