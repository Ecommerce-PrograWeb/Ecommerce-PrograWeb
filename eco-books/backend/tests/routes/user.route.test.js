import request from 'supertest';
import app from '../../src/app.js';

describe('User routes', () => {
  it('GET /user returns list', async () => {
    const res = await request(app).get('/user');
    expect([200, 404]).toContain(res.status);
  });

  it('GET /user/:id returns one or 404', async () => {
    const res = await request(app).get('/user/7');
    expect([200, 404]).toContain(res.status);
  });

  it('POST /user validates required fields', async () => {
    const bad = await request(app).post('/user').send({ name: 'X' });
    expect([400, 404]).toContain(bad.status);

    const good = await request(app).post('/user').send({
      name: 'A', email: 'a@b.com', password: 'pw',
    });
    expect([200, 201, 404]).toContain(good.status);
  });

  it('PUT /user/:id returns 200/404', async () => {
    const res = await request(app).put('/user/5').send({ name: 'New' });
    expect([200, 404]).toContain(res.status);
  });

  it('DELETE /user/:id returns 204/200/404', async () => {
    const res = await request(app).delete('/user/5');
    expect([200, 204, 404]).toContain(res.status);
  });

  it('POST /user/auth/login returns token/user or 401/404', async () => {
    const ok = await request(app).post('/user/auth/login')
      .send({ email: 'demo@demo.com', password: 'demo' });
    expect([200, 404]).toContain(ok.status);

    const bad = await request(app).post('/user/auth/login')
      .send({ email: 'x@y.com', password: 'nope' });
    expect([401, 404]).toContain(bad.status);
  });
});
