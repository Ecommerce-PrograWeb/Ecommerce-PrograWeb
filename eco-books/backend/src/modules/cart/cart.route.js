import { Router } from 'express';
import * as cartController from './cart.controller.js';

const router = Router();

router.get('/', cartController.getCarts);
router.post('/', cartController.createCart);
router.get('/:id', cartController.default.getById);

export default router;