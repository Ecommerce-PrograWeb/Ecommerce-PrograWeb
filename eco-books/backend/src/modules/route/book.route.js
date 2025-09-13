import { Router } from 'express';
import {
  getBooks,
  getBookById,
  createBook,
  patchBook,
  putBook,
  deleteBook,
} from '../controller/book.controller.js';

const router = Router();

router.get('/', getBooks);
router.get('/:id', getBookById);
router.post('/', createBook);
router.patch('/:id', patchBook);
router.put('/:id', putBook);
router.delete('/:id', deleteBook);

export default router;