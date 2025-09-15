// tests/controllers/book.controller.test.js
import '../mocks/book.service.controller.mock.js';
import { bookServiceMock as BookService } from '../mocks/book.service.controller.mock.js';
import { createResMock } from '../mocks/express.mock.js';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import {
  getBooks, getBookById, createBook, patchBook, putBook, deleteBook, getBookByCategory,
} from '../../src/modules/controller/book.controller.js';

describe('book.controller', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getBooks -> 200 y parsea query', async () => {
    const req = { query: { page: '2', limit: '10', sort: 'name' } };
    const res = createResMock();
    BookService.getBooks.mockResolvedValue([{ book_id: 1 }]);

    await getBooks(req, res);

    expect(BookService.getBooks).toHaveBeenCalledWith({ page: 2, limit: 10, sort: 'name' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ book_id: 1 }]);
  });

  it('getBooks -> 500 en error', async () => {
    const req = { query: {} };
    const res = createResMock();
    BookService.getBooks.mockRejectedValue(new Error('boom'));

    await getBooks(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });

  it('getBookById -> 200 cuando existe', async () => {
    const req = { params: { id: '7' } };
    const res = createResMock();
    BookService.getBookById.mockResolvedValue({ book_id: 7 });

    await getBookById(req, res);

    expect(BookService.getBookById).toHaveBeenCalledWith('7');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ book_id: 7 });
  });

  it('getBookById -> 404 cuando no existe', async () => {
    const req = { params: { id: '9' } };
    const res = createResMock();
    BookService.getBookById.mockResolvedValue(null);

    await getBookById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Book not found' });
  });

  it('getBookById -> 500 en error', async () => {
    const req = { params: { id: '9' } };
    const res = createResMock();
    BookService.getBookById.mockRejectedValue(new Error('x'));

    await getBookById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });

  it('createBook -> 400 si faltan campos requeridos', async () => {
    const req = { body: { name: 'N' } }; // faltan otros
    const res = createResMock();

    await createBook(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Required fields are missing' });
  });

  it('createBook -> 201 y setea Location', async () => {
    const req = { body: {
      name: 'N', description: 'D', publication_date: '2020-01-01', purchase_price: 10,
      author_id: 1, publisher_id: 2, category_id: 3,
    }};
    const res = createResMock();
    BookService.createBook.mockResolvedValue({ book_id: 55 });

    await createBook(req, res);

    expect(BookService.createBook).toHaveBeenCalledWith({
      name: 'N', description: 'D', publication_date: '2020-01-01', purchase_price: 10,
      author_id: 1, publisher_id: 2, category_id: 3,
    });
    expect(res.setHeader).toHaveBeenCalledWith('Location', '/books/55');
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Book created', id: 55 });
  });

  it('createBook -> 409 en FK constraint', async () => {
    const req = { body: {
      name: 'N', description: 'D', publication_date: '2020-01-01', purchase_price: 10
    }};
    const res = createResMock();
    const err = Object.assign(new Error('fk'), { name: 'SequelizeForeignKeyConstraintError' });
    BookService.createBook.mockRejectedValue(err);

    await createBook(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Foreign key constraint failed: check author_id, publisher_id, category_id'
    });
  });

  it('createBook -> 422 en DB/Validation error', async () => {
    const req = { body: {
      name: 'N', description: 'D', publication_date: '2020-01-01', purchase_price: 10
    }};
    const res = createResMock();

    for (const n of ['SequelizeDatabaseError','SequelizeValidationError']) {
      BookService.createBook.mockRejectedValueOnce(Object.assign(new Error('bad'), { name: n }));
      await createBook(req, res);
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({ error: 'bad' });
    }
  });

  it('createBook -> 500 en error inesperado', async () => {
    const req = { body: {
      name: 'N', description: 'D', publication_date: '2020-01-01', purchase_price: 10
    }};
    const res = createResMock();
    BookService.createBook.mockRejectedValue(new Error('unexpected'));

    await createBook(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });

  it('patchBook -> 400 cuando no hay campos', async () => {
    const req = { params: { id: '5' }, body: {} };
    const res = createResMock();

    await patchBook(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'No fields to update' });
  });

  it('patchBook -> remueve book_id y 200 en éxito', async () => {
    const req = { params: { id: '5' }, body: { book_id: 999, name: 'X' } };
    const res = createResMock();
    BookService.updateBook.mockResolvedValue(1);
    BookService.getBookById.mockResolvedValue({ book_id: 5, name: 'X' });

    await patchBook(req, res);

    expect(BookService.updateBook).toHaveBeenCalledWith('5', { name: 'X' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ book_id: 5, name: 'X' });
  });

  it('patchBook -> 404 cuando no existe', async () => {
    const req = { params: { id: '5' }, body: { name: 'X' } };
    const res = createResMock();
    BookService.updateBook.mockResolvedValue(0);

    await patchBook(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Book not found' });
  });

  it('patchBook -> 409 / 422 / 500 en errores', async () => {
    const req = { params: { id: '5' }, body: { name: 'X' } };
    const res = createResMock();

    BookService.updateBook.mockRejectedValueOnce(Object.assign(new Error('fk'), { name: 'SequelizeForeignKeyConstraintError' }));
    await patchBook(req, res);
    expect(res.status).toHaveBeenCalledWith(409);

    BookService.updateBook.mockRejectedValueOnce(Object.assign(new Error('db'), { name: 'SequelizeDatabaseError' }));
    await patchBook(req, res);
    expect(res.status).toHaveBeenCalledWith(422);

    BookService.updateBook.mockRejectedValueOnce(Object.assign(new Error('val'), { name: 'SequelizeValidationError' }));
    await patchBook(req, res);
    expect(res.status).toHaveBeenCalledWith(422);

    BookService.updateBook.mockRejectedValueOnce(new Error('boom'));
    await patchBook(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('putBook -> 400 si faltan campos requeridos', async () => {
    const req = { params: { id: '5' }, body: { name: 'N' } };
    const res = createResMock();

    await putBook(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'All fields are required for full update' });
  });

  it('putBook -> 200 con actualización completa', async () => {
    const req = { params: { id: '5' }, body: {
      name: 'N', description: 'D', publication_date: '2020-01-01', purchase_price: 10,
      author_id: 1, publisher_id: 2, category_id: 3,
    }};
    const res = createResMock();
    BookService.updateBook.mockResolvedValue(1);
    BookService.getBookById.mockResolvedValue({ book_id: 5, name: 'N' });

    await putBook(req, res);

    expect(BookService.updateBook).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ book_id: 5, name: 'N' });
  });

  it('putBook -> 404 cuando no existe', async () => {
    const req = { params: { id: '5' }, body: {
      name: 'N', description: 'D', publication_date: '2020-01-01', purchase_price: 10
    }};
    const res = createResMock();
    BookService.updateBook.mockResolvedValue(0);

    await putBook(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Book not found' });
  });

  it('putBook -> 409 / 422 / 500 en errores', async () => {
    const payload = {
      name: 'N', description: 'D', publication_date: '2020-01-01', purchase_price: 10
    };
    const req = { params: { id: '5' }, body: payload };
    const res = createResMock();

    BookService.updateBook.mockRejectedValueOnce(Object.assign(new Error('fk'), { name: 'SequelizeForeignKeyConstraintError' }));
    await putBook(req, res);
    expect(res.status).toHaveBeenCalledWith(409);

    BookService.updateBook.mockRejectedValueOnce(Object.assign(new Error('db'), { name: 'SequelizeDatabaseError' }));
    await putBook(req, res);
    expect(res.status).toHaveBeenCalledWith(422);

    BookService.updateBook.mockRejectedValueOnce(Object.assign(new Error('val'), { name: 'SequelizeValidationError' }));
    await putBook(req, res);
    expect(res.status).toHaveBeenCalledWith(422);

    BookService.updateBook.mockRejectedValueOnce(new Error('yikes'));
    await putBook(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('deleteBook -> 204 en éxito', async () => {
    const req = { params: { id: '10' } };
    const res = createResMock();
    BookService.deleteBook.mockResolvedValue(1);

    await deleteBook(req, res);

    expect(BookService.deleteBook).toHaveBeenCalledWith('10');
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it('deleteBook -> 404 cuando no existe', async () => {
    const req = { params: { id: '10' } };
    const res = createResMock();
    BookService.deleteBook.mockResolvedValue(0);

    await deleteBook(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Book not found' });
  });

  it('deleteBook -> 500 en error', async () => {
    const req = { params: { id: '10' } };
    const res = createResMock();
    BookService.deleteBook.mockRejectedValue(new Error('oops'));

    await deleteBook(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });

  it('getBookByCategory -> 200 con data', async () => {
    const req = { params: { categoryId: '3' } };
    const res = createResMock();
    BookService.getBookByCategory.mockResolvedValue([{ book_id: 1 }]);

    await getBookByCategory(req, res);

    expect(BookService.getBookByCategory).toHaveBeenCalledWith('3');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ book_id: 1 }]);
  });

  it('getBookByCategory -> 404 mensaje cuando vacío', async () => {
    const req = { params: { categoryId: '3' } };
    const res = createResMock();
    BookService.getBookByCategory.mockResolvedValue([]);

    await getBookByCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'No se encontraron libros para esta categoría' });
  });

  it('getBookByCategory -> 500 en error', async () => {
    const req = { params: { categoryId: '3' } };
    const res = createResMock();
    BookService.getBookByCategory.mockRejectedValue(new Error('db'));

    await getBookByCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
  });
});
