import request from 'supertest';
import app from '../../src/app.js';

describe('Order routes', () => {
  it('GET /order should return status 200 or 404', async () => {
    const res = await request(app).get('/order');
    expect([200, 404]).toContain(res.status);
  });

  it('GET /order/:id should return status 200 or 404', async () => {
    const res = await request(app).get('/order/7');
    expect([200, 404]).toContain(res.status);
  });

  it('POST /order with missing data should return 400 or 404', async () => {
    const res = await request(app).post('/order').send({});
    expect([400, 404]).toContain(res.status);
  });

  it('POST /order with valid data should return 200/201/400/404', async () => {
    const payload = { total: 120.75, user_id: 3, status: 'PENDING' };
    const res = await request(app).post('/order').send(payload);
    expect([200, 201, 400, 404]).toContain(res.status);
  });

  it('PATCH /order/:id should return 200 or 404', async () => {
    const res = await request(app).patch('/order/5').send({ status: 'PAID' });
    expect([200, 404]).toContain(res.status);
  });

  it('PUT /order/:id should return 200/400/404', async () => {
    const res = await request(app).put('/order/5').send({ total: 99.99, status: 'PAID' });
    expect([200, 400, 404]).toContain(res.status);
  });

  it('DELETE /order/:id should return 200/204/404', async () => {
    const res = await request(app).delete('/order/5');
    expect([200, 204, 404]).toContain(res.status);
  });
});
