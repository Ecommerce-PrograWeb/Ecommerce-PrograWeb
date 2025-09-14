import '../mocks/models.mock.js';
import { Book } from '../mocks/models.mock.js';
import { describe, it, expect, beforeEach } from 'vitest';
import bookService from '../../src/modules/service/book.service.js';

describe('book.service', () => {
  beforeEach(() => {
    Book.findAll.mockReset();
    Book.findByPk.mockReset();
    Book.create.mockReset();
    Book.update.mockReset();
    Book.destroy.mockReset();
  });

  it('getBooks() returns array from Book.findAll with default options', async () => {
    Book.findAll.mockResolvedValue([{ id: 1, title: 'Clean Code' }]);

    const result = await bookService.getBooks({});

    expect(result).toEqual([{ id: 1, title: 'Clean Code' }]);
    expect(Book.findAll).toHaveBeenCalledTimes(1);

    const [options] = Book.findAll.mock.calls[0];
    expect(options).toEqual(
      expect.objectContaining({
        order: [['publication_date', 'DESC']],
      })
    );
  });

  it('getBooks() adds limit/offset when page & limit are provided', async () => {
    Book.findAll.mockResolvedValue([]);
    await bookService.getBooks({ page: 2, limit: 10, sort: '-publication_date' });
    const [options] = Book.findAll.mock.calls[0];
    expect(options).toEqual(
      expect.objectContaining({
        limit: 10,
        offset: 10, // (page-1)*limit
      })
    );
  });

  it('getBookById() returns entity when found', async () => {
    Book.findByPk.mockResolvedValue({ id: 7, title: 'DDD' });

    const result = await bookService.getBookById(7);

    expect(result).toEqual({ id: 7, title: 'DDD' });
    expect(Book.findByPk).toHaveBeenCalledWith(7, expect.any(Object));
  });

  it('getBookById() returns null when not found', async () => {
    Book.findByPk.mockResolvedValue(null);

    const result = await bookService.getBookById(999);
    expect(result).toBeNull();
  });

  it('createBook() delegates to Book.create', async () => {
    const payload = { title: 'Refactoring' };
    Book.create.mockResolvedValue({ id: 10, ...payload });

    const result = await bookService.createBook(payload);

    expect(Book.create).toHaveBeenCalledWith(payload);
    expect(result).toEqual({ id: 10, title: 'Refactoring' });
  });

  it('updateBook() returns affected rows count', async () => {
    Book.update.mockResolvedValue([1]);
    const affected = await bookService.updateBook(5, { title: 'New Title' });
    expect(affected).toBe(1);
    expect(Book.update).toHaveBeenCalledWith(
      { title: 'New Title' },
      { where: { book_id: 5 } }
    );
  });

  it('deleteBook() calls destroy with where by book_id and returns number deleted', async () => {
    Book.destroy.mockResolvedValue(1);
    const deleted = await bookService.deleteBook(9);
    expect(deleted).toBe(1);
    expect(Book.destroy).toHaveBeenCalledWith({ where: { book_id: 9 } });
  });

  it('getBooks() uses ASC when sort has no dash', async () => {
    Book.findAll.mockResolvedValue([]);
    await bookService.getBooks({ sort: 'title' });
    const [options] = Book.findAll.mock.calls[0];
    expect(options.order).toEqual([['title', 'ASC']]);
  });

  it('getBooks() falls back to default field when sort is "-"', async () => {
    Book.findAll.mockResolvedValue([]);
    await bookService.getBooks({ sort: '-' });
    const [options] = Book.findAll.mock.calls[0];
    expect(options.order).toEqual([['publication_date', 'DESC']]);
  });

  it('getBooks() no pagination when only page is provided', async () => {
    Book.findAll.mockResolvedValue([]);
    await bookService.getBooks({ page: 3 });
    const [options] = Book.findAll.mock.calls[0];
    expect(options.limit).toBeUndefined();
    expect(options.offset).toBeUndefined();
  });

  it('getBooks() no pagination when only limit is provided', async () => {
    Book.findAll.mockResolvedValue([]);
    await bookService.getBooks({ limit: 25 });
    const [options] = Book.findAll.mock.calls[0];
    expect(options.limit).toBeUndefined();
    expect(options.offset).toBeUndefined();
  });

  it('getBookByCategory -> filters and includes relations', async () => {
    Book.findAll.mockResolvedValue([{ book_id: 2 }]);
    const r = await bookService.getBookByCategory(3);
    expect(r).toEqual([{ book_id: 2 }]);
    const call = Book.findAll.mock.calls[0][0];
    expect(call.where).toEqual({ category_id: 3 });
    expect(call.include).toEqual(expect.any(Array));
  });
});
