import { Router } from 'express';
import {
  getBooks,
  getBookById,
  getBookByCategory,
  createBook,
  patchBook,
  putBook,
  deleteBook,
} from '../controller/book.controller.js';

const router = Router();

router.get('/', getBooks);
router.get('/:id', getBookById);
router.get('/category/:categoryId', getBookByCategory);
router.post('/', createBook);
router.patch('/:id', patchBook);
router.put('/:id', putBook);
router.delete('/:id', deleteBook);

export default router;