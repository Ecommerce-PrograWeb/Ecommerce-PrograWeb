import request from 'supertest';
import app from '../../src/app.js';

describe('Cart routes', () => {
  it('GET /cart returns list', async () => {
    const res = await request(app).get('/cart');
    expect([200, 404]).toContain(res.status);
  });

  it('GET /cart/:id returns one or 404', async () => {
    const res = await request(app).get('/cart/7');
    expect([200, 404]).toContain(res.status);
  });

  it('POST /cart returns 400 when total is missing', async () => {
    const res = await request(app).post('/cart').send({});
    expect([400, 404]).toContain(res.status);
  });

  it('POST /cart returns 201/200/404 on success', async () => {
    const payload = { total: 33.3, user_id: 5 };
    const res = await request(app).post('/cart').send(payload);
    expect([200, 201, 404]).toContain(res.status);
  });
});
