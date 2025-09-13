import { vi } from 'vitest';

export const orderServiceMock = {
  getOrders: vi.fn(),
  getOrderById: vi.fn(),
  createOrder: vi.fn(),
  updateOrder: vi.fn(),
  deleteOrder: vi.fn(),
};

vi.mock('../../src/modules/service/order.service.js', () => ({
  default: orderServiceMock,
}));
