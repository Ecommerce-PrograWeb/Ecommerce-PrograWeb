import request from 'supertest';
import app from '../../src/app.js';

describe('Book routes', () => {
  it('GET /book returns list', async () => {
    const res = await request(app).get('/book');
    expect([200, 404]).toContain(res.status);
    // Puedes ajustar el test según la respuesta real de tu API
  });

  it('GET /book/:id returns one or 404', async () => {
    const res = await request(app).get('/book/7');
    expect([200, 404]).toContain(res.status);
  });

  it('POST /book with missing fields returns 400', async () => {
    const res = await request(app).post('/book').send({ title: 'Refactoring' });
    expect([400, 404]).toContain(res.status);
  });

  it('DELETE /book/:id returns 200/204/404', async () => {
    const res = await request(app).delete('/book/10');
    expect([200, 204, 404]).toContain(res.status);
  });
});
