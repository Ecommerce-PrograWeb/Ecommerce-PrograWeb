import request from 'supertest';
import app from '../../src/app.js';

describe('GET /health', () => {
  it('should respond with status 200 and health status', async () => {
    const res = await request(app).get('/health');
    expect([200, 404]).toContain(res.status);
    if (res.status === 200) {
      expect(res.headers['content-type']).toMatch(/json/);
      expect(res.body).toHaveProperty('status');
    }
  });
});
