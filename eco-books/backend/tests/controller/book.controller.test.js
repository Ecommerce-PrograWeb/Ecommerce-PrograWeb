import '../mocks/book.service.mock.js';
import { bookServiceMock as bookService } from '../mocks/book.service.mock.js';
import { createResMock } from '../Mocks/express.mock.js';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import {
  getBooks,
  getBookById,
  createBook,
  patchBook,
  putBook,
  deleteBook,
} from '../../src/modules/controller/book.controller.js';

describe('book.controller', () => {
  beforeEach(() => vi.clearAllMocks());

  // ---------- GET /book
  it('getBooks -> 200', async () => {
    const req = { query: {} };
    const res = createResMock();
    bookService.getBooks.mockResolvedValue([{ id: 1 }]);

    await getBooks(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
  });

  it('getBooks -> 200 with pagination (page/limit present) and sort', async () => {
    const req = { query: { page: '2', limit: '5', sort: 'title' } };
    const res = createResMock();

    bookService.getBooks.mockResolvedValue([{ id: 99 }]);

    await getBooks(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ id: 99 }]);

    expect(bookService.getBooks).toHaveBeenCalledWith({ page: 2, limit: 5, sort: 'title' });
  });


  it('getBooks -> 500 on error', async () => {
    const req = { query: {} };
    const res = createResMock();
    bookService.getBooks.mockRejectedValue(new Error('boom'));

    await getBooks(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });

  // ---------- GET /book/:id
  it('getBookById -> 200 when found', async () => {
    const req = { params: { id: '7' } };
    const res = createResMock();
    bookService.getBookById.mockResolvedValue({ id: 7 });

    await getBookById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: 7 });
  });

  it('getBookById -> 404 when null', async () => {
    const req = { params: { id: '9' } };
    const res = createResMock();
    bookService.getBookById.mockResolvedValue(null);

    await getBookById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('getBookById -> 500 on error', async () => {
    const req = { params: { id: '9' } };
    const res = createResMock();
    bookService.getBookById.mockRejectedValue(new Error('x'));

    await getBookById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });

  // ---------- POST /book
  it('createBook -> 400 when missing required', async () => {
    const req = { body: { name: 'A' } };
    const res = createResMock();

    await createBook(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('createBook -> 201 ok', async () => {
    const req = {
      body: {
        name: 'N', description: 'D', publication_date: '2020-01-01', purchase_price: 10,
      },
    };
    const res = createResMock();
    bookService.createBook.mockResolvedValue({ book_id: 55 });

    await createBook(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Book created', id: 55 });
    expect(res.setHeader).toHaveBeenCalledWith('Location', '/books/55');
  });

  it('createBook -> 409 FK error', async () => {
    const req = {
      body: { name: 'N', description: 'D', publication_date: '2020-01-01', purchase_price: 10, author_id: 999 },
    };
    const res = createResMock();
    bookService.createBook.mockRejectedValue({ name: 'SequelizeForeignKeyConstraintError' });

    await createBook(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
  });

  it('createBook -> 422 DB/Validation error', async () => {
    const req = {
      body: { name: 'N', description: 'D', publication_date: '2020-01-01', purchase_price: 10 },
    };
    const res = createResMock();
    bookService.createBook.mockRejectedValue({ name: 'SequelizeValidationError', message: 'bad' });

    await createBook(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
  });

  it('createBook -> 500 generic error', async () => {
    const req = {
      body: { name: 'N', description: 'D', publication_date: '2020-01-01', purchase_price: 10 },
    };
    const res = createResMock();
    bookService.createBook.mockRejectedValue(new Error('unexpected'));

    await createBook(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  // ---------- PATCH /book/:id
  it('patchBook -> 400 when empty body', async () => {
    const req = { params: { id: '1' }, body: {} };
    const res = createResMock();

    await patchBook(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('patchBook -> 404 when not found', async () => {
    const req = { params: { id: '1' }, body: { name: 'X' } };
    const res = createResMock();
    bookService.updateBook.mockResolvedValue(0);

    await patchBook(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('patchBook -> 200 when updated', async () => {
    const req = { params: { id: '1' }, body: { name: 'X' } };
    const res = createResMock();
    bookService.updateBook.mockResolvedValue(1);
    bookService.getBookById.mockResolvedValue({ id: 1, name: 'X' });

    await patchBook(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'X' });
  });

  it('patchBook -> 409 FK error', async () => {
    const req = { params: { id: '1' }, body: { name: 'X' } };
    const res = createResMock();
    bookService.updateBook.mockRejectedValue({ name: 'SequelizeForeignKeyConstraintError' });

    await patchBook(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
  });

  it('patchBook -> 422 DB/Validation error', async () => {
    const req = { params: { id: '1' }, body: { name: 'X' } };
    const res = createResMock();
    bookService.updateBook.mockRejectedValue({ name: 'SequelizeDatabaseError', message: 'x' });

    await patchBook(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
  });

  it('patchBook -> 500 generic error', async () => {
    const req = { params: { id: '1' }, body: { name: 'X' } };
    const res = createResMock();
    bookService.updateBook.mockRejectedValue(new Error('boom'));

    await patchBook(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  // ---------- PUT /book/:id
  it('putBook -> 400 when missing required', async () => {
    const req = { params: { id: '1' }, body: { name: 'X' } };
    const res = createResMock();

    await putBook(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('putBook -> 200 when updated', async () => {
    const req = {
      params: { id: '1' },
      body: { name: 'N', description: 'D', publication_date: '2020-01-01', purchase_price: 10 },
    };
    const res = createResMock();
    bookService.updateBook.mockResolvedValue(1);
    bookService.getBookById.mockResolvedValue({ id: 1, name: 'N' });

    await putBook(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'N' });
  });

  it('putBook -> 404 when not found', async () => {
    const req = {
      params: { id: '1' },
      body: { name: 'N', description: 'D', publication_date: '2020-01-01', purchase_price: 10 },
    };
    const res = createResMock();
    bookService.updateBook.mockResolvedValue(0);

    await putBook(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('putBook -> 409 FK error', async () => {
    const req = {
      params: { id: '1' },
      body: { name: 'N', description: 'D', publication_date: '2020-01-01', purchase_price: 10 },
    };
    const res = createResMock();
    bookService.updateBook.mockRejectedValue({ name: 'SequelizeForeignKeyConstraintError' });

    await putBook(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
  });

  it('putBook -> 422 DB/Validation error', async () => {
    const req = {
      params: { id: '1' },
      body: { name: 'N', description: 'D', publication_date: '2020-01-01', purchase_price: 10 },
    };
    const res = createResMock();
    bookService.updateBook.mockRejectedValue({ name: 'SequelizeValidationError', message: 'bad' });

    await putBook(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
  });

  it('putBook -> 500 generic error', async () => {
    const req = {
      params: { id: '1' },
      body: { name: 'N', description: 'D', publication_date: '2020-01-01', purchase_price: 10 },
    };
    const res = createResMock();
    bookService.updateBook.mockRejectedValue(new Error('yikes'));

    await putBook(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  // ---------- DELETE /book/:id
  it('deleteBook -> 204 when deleted', async () => {
    const req = { params: { id: '9' } };
    const res = createResMock();
    bookService.deleteBook.mockResolvedValue(1);

    await deleteBook(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it('deleteBook -> 404 when not found', async () => {
    const req = { params: { id: '9' } };
    const res = createResMock();
    bookService.deleteBook.mockResolvedValue(0);

    await deleteBook(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('deleteBook -> 500 on error', async () => {
    const req = { params: { id: '9' } };
    const res = createResMock();
    bookService.deleteBook.mockRejectedValue(new Error('oops'));

    await deleteBook(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});
