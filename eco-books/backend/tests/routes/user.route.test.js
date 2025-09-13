import '../mocks/user.controller.route.mock.js';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

describe('User routes', () => {
  beforeEach(() => vi.clearAllMocks());

  it('GET /user returns list', async () => {
    const res = await request(app).get('/user');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ user_id: 1, name: 'A' }]);
  });

  it('GET /user/:id returns one or 404', async () => {
    const ok = await request(app).get('/user/7');
    expect(ok.status).toBe(200);
    expect(ok.body).toEqual({ user_id: 7, name: 'X' });

    const notFound = await request(app).get('/user/999');
    expect(notFound.status).toBe(404);
    expect(notFound.body).toEqual({ error: 'User not found' });
  });

  it('POST /user validates required fields', async () => {
    const bad = await request(app).post('/user').send({ name: 'X' });
    expect(bad.status).toBe(400);

    const good = await request(app).post('/user').send({
      name: 'A', email: 'a@b.com', password: 'pw',
    });
    expect([200, 201]).toContain(good.status);
    expect(good.body).toEqual(
      expect.objectContaining({ user_id: 10, email: 'a@b.com' })
    );
  });

  it('PUT /user/:id returns 200', async () => {
    const res = await request(app).put('/user/5').send({ name: 'New' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ updated: true });
  });

  it('DELETE /user/:id returns 204', async () => {
    const res = await request(app).delete('/user/5');
    expect([200, 204]).toContain(res.status);
  });

  it('POST /user/auth/login returns token/user or 401', async () => {
    const ok = await request(app).post('/user/auth/login')
      .send({ email: 'demo@demo.com', password: 'demo' });
    expect(ok.status).toBe(200);
    expect(ok.body).toEqual(
      expect.objectContaining({ email: 'demo@demo.com', role: 'ADMIN' })
    );

    const bad = await request(app).post('/user/auth/login')
      .send({ email: 'x@y.com', password: 'nope' });
    expect(bad.status).toBe(401);
  });
});
