import { Router } from 'express';
import {
  getOrders,
  getOrderById,
  getOrdersByUserId,
  createOrder,
  patchOrder,
  putOrder, 
  deleteOrder,
  getMyOrders,  
} from '../controller/order.controller.js';
import { authRequired } from '../../core/middleware/auth.js'; 

const router = Router();

router.get('/', getOrders);
router.get('/user/:userId', getOrdersByUserId);
router.get('/my', authRequired, getMyOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.patch('/:id', patchOrder);   
router.put('/:id', putOrder);  
router.delete('/:id', deleteOrder); 

export default router;
