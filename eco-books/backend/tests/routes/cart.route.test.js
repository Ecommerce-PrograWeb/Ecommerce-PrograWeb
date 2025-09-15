import request from 'supertest';
import app from '../../src/app.js';

describe('Cart routes', () => {
  it('GET /cart should return status 200 or 404', async () => {
    const res = await request(app).get('/cart');
    expect([200, 404]).toContain(res.status);
  });

  it('GET /cart/:id should return status 200 or 404', async () => {
    const res = await request(app).get('/cart/7');
    expect([200, 404]).toContain(res.status);
  });

  it('POST /cart with missing total should return 400 or 404', async () => {
    const res = await request(app).post('/cart').send({});
    expect([400, 404]).toContain(res.status);
  });

  it('POST /cart with valid data should return 200/201/404', async () => {
    const payload = { total: 33.3, user_id: 5 };
    const res = await request(app).post('/cart').send(payload);
    expect([200, 201, 404]).toContain(res.status);
  });
});
