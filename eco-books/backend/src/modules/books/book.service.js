// books/book.service.js
const BookModel = require('../models/bookModel');

const BookService = {
  getBooks: () => BookModel.findAll(),

  getBookById: (id) => BookModel.findById(id),

  createBook: ({
    name,
    description,
    publication_date,
    purchase_price,
    author_id,
    publisher_id,
    category_id,
  }) => {
    if (!name || !description || !publication_date || purchase_price === undefined) {
      throw new Error('name, description, publication_date y purchase_price are necessary');
    }
    return BookModel.create({
      name,
      description,
      publication_date,   // 'YYYY-MM-DD'
      purchase_price,     // number/decimal
      author_id,
      publisher_id,
      category_id,
    });
  },
};

module.exports = BookService;