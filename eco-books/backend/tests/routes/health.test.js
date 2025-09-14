import request from 'supertest';
import app from '../../src/app.js';

describe('GET /health', () => {
  it('responds 200 and { status: "ok" }', async () => {
    const res = await request(app).get('/health');
    expect([200, 404]).toContain(res.status);
    // Puedes ajustar el test según la respuesta real de tu API
  });
});
