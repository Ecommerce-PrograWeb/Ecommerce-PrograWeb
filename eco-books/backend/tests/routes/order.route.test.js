import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

vi.mock('../../src/modules/controller/order.controller.js', () => {
  return {
    getOrders: vi.fn((req, res) => {
      return res.status(200).json([{ id: 1, total: 50 }]);
    }),
    getOrderById: vi.fn((req, res) => {
      const { id } = req.params;
      if (id === '999') return res.status(404).json({ error: 'Order not found' });
      return res.status(200).json({ id: Number(id), total: 50 });
    }),
    createOrder: vi.fn((req, res) => {
      const body = req.body || {};
      if (!body || body.total == null) return res.status(400).json({ error: 'total is required' });
      return res.status(201).json({ id: 10, ...body });
    }),
    patchOrder: vi.fn((req, res) => res.status(200).json({ patched: true })),
    putOrder: vi.fn((req, res) => res.status(200).json({ replaced: true })),
    deleteOrder: vi.fn((req, res) => res.status(204).end()),
  };
});

describe('Order routes', () => {
  beforeEach(() => vi.clearAllMocks());

  it('GET /order returns list', async () => {
    const res = await request(app).get('/order');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, total: 50 }]);
  });

  it('GET /order/:id returns one', async () => {
    const res = await request(app).get('/order/7');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 7, total: 50 });
  });

  it('GET /order/:id returns 404 when not found', async () => {
    const res = await request(app).get('/order/999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Order not found' });
  });

  it('POST /order returns 400 when total is missing', async () => {
    const res = await request(app).post('/order').send({});
    expect(res.status).toBe(400);
  });

  it('POST /order returns 201 on success', async () => {
    const payload = { total: 120.75, user_id: 3, status: 'PENDING' };
    const res = await request(app).post('/order').send(payload);
    expect([200, 201]).toContain(res.status);
    expect(res.body).toEqual(expect.objectContaining(payload));
  });

  it('PATCH /order/:id returns 200', async () => {
    const res = await request(app).patch('/order/5').send({ status: 'PAID' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ patched: true });
  });

  it('PUT /order/:id returns 200', async () => {
    const res = await request(app).put('/order/5').send({ total: 99.99, status: 'PAID' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ replaced: true });
  });

  it('DELETE /order/:id returns 204', async () => {
    const res = await request(app).delete('/order/5');
    expect([200, 204]).toContain(res.status);
  });
});
