import '../mocks/book.service.mock.js';
import { bookServiceMock as bookService } from '../mocks/book.service.mock.js';
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

describe('Book routes', () => {
  beforeEach(() => {
    vi.clearAllMocks?.();
  });

  it('GET /book returns list', async () => {
    bookService.getBooks.mockResolvedValue([{ id: 1, title: 'DDD' }]);
    const res = await request(app).get('/book');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, title: 'DDD' }]);
    expect(bookService.getBooks).toHaveBeenCalledTimes(1);
  });

  it('GET /book/:id returns one', async () => {
    bookService.getBookById.mockResolvedValue({ id: 7, title: 'Clean Architecture' });
    const res = await request(app).get('/book/7');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 7, title: 'Clean Architecture' });
    expect(bookService.getBookById).toHaveBeenCalledWith('7');
  });

  it('GET /book/:id returns 404 when not found', async () => {
    bookService.getBookById.mockResolvedValue(null);
    const res = await request(app).get('/book/999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual(expect.objectContaining({ error: expect.any(String) }));
  });

  it('POST /book with missing fields returns 400', async () => {
    const res = await request(app).post('/book').send({ title: 'Refactoring' });
    expect(res.status).toBe(400);
  });

  it('DELETE /book/:id returns 200/204 on success', async () => {
    bookService.deleteBook.mockResolvedValue(1);
    const res = await request(app).delete('/book/10');
    expect([200, 204]).toContain(res.status);
  });
});
