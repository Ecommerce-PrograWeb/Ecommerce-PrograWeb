import { vi } from 'vitest';

export const bookServiceMock = {
  getBooks: vi.fn(),
  getBookById: vi.fn(),
  createBook: vi.fn(),
  updateBook: vi.fn(),
  deleteBook: vi.fn(),
  getBookByCategory: vi.fn(),
};

vi.mock('../../src/modules/service/book.service.js', () => ({
  default: bookServiceMock,
}));
