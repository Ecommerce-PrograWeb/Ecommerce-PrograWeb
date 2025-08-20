import { Router } from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  patchOrder,
  putOrder, 
  deleteOrder,
} from '../controller/order.controller.js';

const router = Router();

router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.patch('/:id', patchOrder);   
router.put('/:id', putOrder);  
router.delete('/:id', deleteOrder); 

export default router;
