import { vi } from 'vitest';

export const cartControllerMock = {
  getCarts: vi.fn((req, res) => {
    return res.status(200).json([{ id: 1, total: 20 }]);
  }),
  createCart: vi.fn((req, res) => {
    const { total } = req.body || {};
    if (total == null) {
      return res.status(400).json({ error: 'total is required' });
    }
    return res.status(201).json({ id: 10, ...req.body });
  }),
};

export const cartControllerDefaultMock = {
  getById: vi.fn((req, res) => {
    const { id } = req.params;
    if (id === '999') {
      return res.status(404).json({ error: 'Cart not found' });
    }
    return res.status(200).json({ id: Number(id), total: 15 });
  }),
};

vi.mock('../../src/modules/controller/cart.controller.js', () => ({
  ...cartControllerMock,
  default: cartControllerDefaultMock,
}));
