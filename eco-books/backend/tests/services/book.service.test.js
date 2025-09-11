import '../mocks/book.model.mock.js'; 
import Book from '../../src/modules/model/book.model.js'; 
import { describe, it, expect, beforeEach, vi } from 'vitest';
import bookService from '../../src/modules/service/book.service.js';

describe('book.service', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getBooks() returns array with default options', async () => {
    Book.findAll.mockResolvedValue([{ id: 1, title: 'Clean Code' }]);

    const result = await bookService.getBooks({});

    expect(result).toEqual([{ id: 1, title: 'Clean Code' }]);
    expect(Book.findAll).toHaveBeenCalledTimes(1);

    const [options] = Book.findAll.mock.calls[0];
    expect(options).toEqual(expect.objectContaining({
      order: [['publication_date', 'DESC']],
    }));
  });

  it('getBooks() adds limit/offset with page & limit', async () => {
    Book.findAll.mockResolvedValue([]);
    await bookService.getBooks({ page: 2, limit: 10, sort: '-publication_date' });
    const [options] = Book.findAll.mock.calls[0];
    expect(options).toEqual(expect.objectContaining({ limit: 10, offset: 10 }));
  });

  it('getBookById() returns entity', async () => {
    Book.findByPk.mockResolvedValue({ id: 7, title: 'DDD' });
    const result = await bookService.getBookById(7);
    expect(result).toEqual({ id: 7, title: 'DDD' });
    expect(Book.findByPk).toHaveBeenCalledWith(7);
  });

  it('getBookById() returns null', async () => {
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

  it('deleteBook() destroys by book_id', async () => {
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

  it('getBooks() falls back to default when sort is "-"', async () => {
    Book.findAll.mockResolvedValue([]);
    await bookService.getBooks({ sort: '-' });
    const [options] = Book.findAll.mock.calls[0];
    expect(options.order).toEqual([['publication_date', 'DESC']]);
  });

  it('getBooks() no pagination with only page', async () => {
    Book.findAll.mockResolvedValue([]);
    await bookService.getBooks({ page: 3 });
    const [options] = Book.findAll.mock.calls[0];
    expect(options.limit).toBeUndefined();
    expect(options.offset).toBeUndefined();
  });

  it('getBooks() no pagination with only limit', async () => {
    Book.findAll.mockResolvedValue([]);
    await bookService.getBooks({ limit: 25 });
    const [options] = Book.findAll.mock.calls[0];
    expect(options.limit).toBeUndefined();
    expect(options.offset).toBeUndefined();
  });
});
