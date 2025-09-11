import { describe, it, expect, beforeEach, vi } from 'vitest';
import '../mocks/cart.controller.mock.js'; 
import request from 'supertest';
import app from '../../src/app.js';

describe('Cart routes', () => {
  beforeEach(() => vi.clearAllMocks());

  it('GET /cart returns list', async () => {
    const res = await request(app).get('/cart');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, total: 20 }]);
  });

  it('GET /cart/:id returns one', async () => {
    const res = await request(app).get('/cart/7');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 7, total: 15 });
  });

  it('GET /cart/:id returns 404 when not found', async () => {
    const res = await request(app).get('/cart/999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Cart not found' });
  });

  it('POST /cart returns 400 when total is missing', async () => {
    const res = await request(app).post('/cart').send({});
    expect(res.status).toBe(400);
  });

  it('POST /cart returns 201 on success', async () => {
    const payload = { total: 33.3, user_id: 5 };
    const res = await request(app).post('/cart').send(payload);
    expect([200, 201]).toContain(res.status);
    expect(res.body).toEqual(expect.objectContaining(payload));
  });
});
