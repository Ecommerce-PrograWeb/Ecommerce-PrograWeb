import Book from '../model/book.model.js';

const BookService = {
  // List with optional filters and pagination
  async getBooks({ page, limit, sort = '-publication_date' }) {
    const orderBy = sort.startsWith('-') ? 'DESC' : 'ASC';
    const orderField = sort.replace('-', '') || 'publication_date';

    const options = {
      order: [[orderField, orderBy]],
    };

    if (page && limit) {
      const offset = (page - 1) * limit;
      options.limit = +limit;
      options.offset = offset;
    }

    return Book.findAll(options);
  },

  // Search by ID
  getBookById: (id) => Book.findByPk(id),

  // Create new book
  createBook: (data) => Book.create(data),

  // Update book (partial or total)
  async updateBook(id, payload) {
    const [affected] = await Book.update(payload, { where: { book_id: id } });
    return affected;
  },

  // Delete book
  deleteBook: (id) => Book.destroy({ where: { book_id: id } }),
};

export default BookService;