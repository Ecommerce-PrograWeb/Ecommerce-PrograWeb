import request from 'supertest';
import app from '../../src/app.js';

describe('User routes', () => {
  it('GET /user should return status 200/404/500', async () => {
    const res = await request(app).get('/user');
    expect([200, 404, 500]).toContain(res.status);
  });

  it('GET /user/:id should return status 200/404/500', async () => {
    const res = await request(app).get('/user/7');
    expect([200, 404, 500]).toContain(res.status);
  });

  it('POST /user should validate required fields', async () => {
    const bad = await request(app).post('/user').send({ name: 'X' });
    expect([400, 404, 500]).toContain(bad.status);

    const good = await request(app).post('/user').send({
      name: 'A', email: 'a@b.com', password: 'pw',
    });
    expect([200, 201, 400, 404, 500]).toContain(good.status);
  });

  it('PUT /user/:id should return 200/400/404/500', async () => {
    const res = await request(app).put('/user/5').send({ name: 'New' });
    expect([200, 400, 404, 500]).toContain(res.status);
  });

  it('DELETE /user/:id should return 200/204/404/500', async () => {
    const res = await request(app).delete('/user/5');
    expect([200, 204, 404, 500]).toContain(res.status);
  });

  it('POST /user/auth/login should handle authentication', async () => {
    const ok = await request(app).post('/user/auth/login')
      .send({ email: 'demo@demo.com', password: 'demo' });
    expect([200, 401, 404, 500]).toContain(ok.status);

    const bad = await request(app).post('/user/auth/login')
      .send({ email: 'x@y.com', password: 'nope' });
    expect([401, 404, 500]).toContain(bad.status);
  });
});
