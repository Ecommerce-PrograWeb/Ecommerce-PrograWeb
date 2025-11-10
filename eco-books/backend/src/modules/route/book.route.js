import { Router } from 'express';
import {
  getBooks,
  getBookById,
  getBookByCategory,
  searchBooks,
  createBook,
  patchBook,
  putBook,
   deleteBook,
   restoreBook,
} from '../controller/book.controller.js';

const router = Router();

router.get('/search', searchBooks);
router.get('/', getBooks);
router.get('/:id', getBookById);
router.get('/category/:categoryId', getBookByCategory);
router.post('/', createBook);
router.patch('/:id', patchBook);
router.put('/:id', putBook);
router.delete('/:id', deleteBook);
router.post('/:id/restore', restoreBook);

export default router;