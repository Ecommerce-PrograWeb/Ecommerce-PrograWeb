import { vi } from 'vitest';

export const OrderModelMock = {
  findAll: vi.fn(),
  findByPk: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  destroy: vi.fn(),
};

vi.mock('../../src/modules/model/order.model.js', () => ({
  default: OrderModelMock,
}));
