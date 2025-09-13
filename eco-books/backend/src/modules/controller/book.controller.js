import BookService from '../service/book.service.js';

// GET /books
export async function getBooks(req, res) {
  try {
    const page  = req.query.page  ? Number(req.query.page)  : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const { sort } = req.query;

    const result = await BookService.getBooks({ page, limit, sort });
    return res.status(200).json(result);
  } catch (err) {
    console.error('GET /books error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// GET /books/:id
export async function getBookById(req, res) {
  try {
    const { id } = req.params;
    const book = await BookService.getBookById(id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    return res.status(200).json(book);
  } catch (err) {
    console.error('GET /books/:id error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// POST /books
export async function createBook(req, res) {
  try {
    const { name, description, publication_date, purchase_price, author_id, publisher_id, category_id } = req.body;

    if (!name || !description || !publication_date || !purchase_price) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    const created = await BookService.createBook({
      name, description, publication_date, purchase_price, author_id, publisher_id, category_id,
    });

    res.setHeader('Location', `/books/${created.book_id}`);
    return res.status(201).json({ message: 'Book created', id: created.book_id });
  } catch (err) {
    if (err.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(409).json({ error: 'Foreign key constraint failed: check author_id, publisher_id, category_id' });
    }
    if (err.name === 'SequelizeDatabaseError' || err.name === 'SequelizeValidationError') {
      return res.status(422).json({ error: err.message });
    }
    console.error('POST /books error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// PATCH /books/:id
export async function patchBook(req, res) {
  try {
    const { id } = req.params;
    const payload = { ...req.body };
    delete payload.book_id;

    if (!payload || Object.keys(payload).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const affected = await BookService.updateBook(id, payload);
    if (!affected) return res.status(404).json({ error: 'Book not found' });

    const updated = await BookService.getBookById(id);
    return res.status(200).json(updated);
  } catch (err) {
    if (err.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(409).json({ error: 'Foreign key constraint failed' });
    }
    if (err.name === 'SequelizeDatabaseError' || err.name === 'SequelizeValidationError') {
      return res.status(422).json({ error: err.message });
    }
    console.error('PATCH /books/:id error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// PUT /books/:id
export async function putBook(req, res) {
  try {
    const { id } = req.params;
    const { name, description, publication_date, purchase_price, author_id, publisher_id, category_id } = req.body;

    if (!name || !description || !publication_date || !purchase_price) {
      return res.status(400).json({ error: 'All fields are required for full update' });
    }

    const affected = await BookService.updateBook(id, {
      name, description, publication_date, purchase_price, author_id, publisher_id, category_id,
    });

    if (!affected) return res.status(404).json({ error: 'Book not found' });

    const updated = await BookService.getBookById(id);
    return res.status(200).json(updated);
  } catch (err) {
    if (err.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(409).json({ error: 'Foreign key constraint failed' });
    }
    if (err.name === 'SequelizeDatabaseError' || err.name === 'SequelizeValidationError') {
      return res.status(422).json({ error: err.message });
    }
    console.error('PUT /books/:id error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// DELETE /books/:id
export async function deleteBook(req, res) {
  try {
    const { id } = req.params;
    const deleted = await BookService.deleteBook(id);
    if (!deleted) return res.status(404).json({ error: 'Book not found' });
    return res.status(204).send();
  } catch (err) {
    console.error('DELETE /book/:id error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// GET /books/category/:category
export async function getBookByCategory(req, res) {
  try {
    const { categoryId } = req.params;
    console.log('Buscando libros para categoría:', categoryId); // Para debug
    
    const books = await BookService.getBookByCategory(categoryId);
    
    if (!books || books.length === 0) {
      return res.status(404).json({ message: 'No se encontraron libros para esta categoría' });
    }
    
    res.status(200).json(books);
  } catch (error) {
    console.error('Error al obtener libros por categoría:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}