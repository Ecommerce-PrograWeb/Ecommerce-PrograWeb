const BookService = require('../services/book.service');

const isValidISODate = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);

const BookController = {
  getAll: async (_req, res) => {
    const books = await BookService.getBooks();
    res.json(books);
  },

  getById: async (req, res) => {
    const book = await BookService.getBookById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  },

  create: async (req, res) => {
    try {
      const {
        name, description, publication_date, purchase_price,
        author_id, publisher_id, category_id,
      } = req.body || {};

      if (!name || !description || !publication_date || purchase_price === undefined) {
        return res.status(400).json({
          error: 'name, description, publication_date, and purchase_price are required',
        });
      }
      if (!isValidISODate(publication_date)) {
        return res.status(400).json({ error: 'publication_date must be in YYYY-MM-DD format' });
      }
      const price = Number(purchase_price);
      if (!Number.isFinite(price)) {
        return res.status(400).json({ error: 'purchase_price must be numeric' });
      }

      const payload = {
        name: String(name).trim(),
        description: String(description).trim(),
        publication_date,
        purchase_price: price,
        author_id: author_id !== undefined && author_id !== '' ? Number(author_id) : undefined,
        publisher_id: publisher_id !== undefined && publisher_id !== '' ? Number(publisher_id) : undefined,
        category_id: category_id !== undefined && category_id !== '' ? Number(category_id) : undefined,
      };

      const result = await BookService.createBook(payload);
      const bookId = result?.book_id ?? result?.insertId ?? result?.id;

      return res.status(201).json(
        bookId ? { message: 'Book created', book_id: bookId } : { message: 'Book created' }
      );
    } catch (err) {
      if (err?.code === 'ER_NO_REFERENCED_ROW_2' || err?.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(400).json({ error: 'author_id, publisher_id, or category_id does not exist' });
      }
      return res.status(400).json({ error: err.message || 'Bad Request' });
    }
  },
};

module.exports = BookController;