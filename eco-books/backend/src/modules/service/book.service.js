import Book from '../model/book.model.js';
import Author from '../model/author.model.js';

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

  // Get books by category
  async getBookByCategory(categoryId) {
    return Book.findAll({
      where: { category_id: categoryId },
      include: [{
        model: Author,
        as: 'author',
        attributes: ['name']
      }]
    }); // Search for books by category and include the author's name
  },
};

export default BookService;