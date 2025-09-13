import { vi } from 'vitest';

export const orderControllerRouteMock = {
  getOrders: vi.fn((req, res) => res.status(200).json([{ id: 1, total: 50 }])),
  getOrderById: vi.fn((req, res) => {
    const { id } = req.params;
    if (id === '999') return res.status(404).json({ error: 'Order not found' });
    return res.status(200).json({ id: Number(id), total: 50 });
  }),
  createOrder: vi.fn((req, res) => {
    const body = req.body || {};
    if (body.total == null) return res.status(400).json({ error: 'total is required' });
    return res.status(201).json({ id: 10, ...body });
  }),
  patchOrder: vi.fn((req, res) => res.status(200).json({ patched: true })),
  putOrder: vi.fn((req, res) => res.status(200).json({ replaced: true })),
  deleteOrder: vi.fn((req, res) => res.status(204).end()),
};

vi.mock('../../src/modules/controller/order.controller.js', () => orderControllerRouteMock);
