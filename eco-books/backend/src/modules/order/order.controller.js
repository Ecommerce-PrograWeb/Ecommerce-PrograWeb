import OrderService from './order.service.js';

export async function getOrders(req, res) {
  try {
    const orders = await OrderService.getOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createOrder(req, res) {
  try {
    const { date, status, user_id, order_detail_id, address_id, cart_id } = req.body;
    await OrderService.createOrder({ date, status, user_id, order_detail_id, address_id, cart_id });
    res.status(201).json({ message: 'Order created' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

const OrderController = {
  getAll: async (req, res) => {
    try {
      const orders = await OrderService.getOrders();
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getById: async (req, res) => {
    try {
      const order = await OrderService.getOrderById(req.params.id);
      if (!order) return res.status(404).json({ error: 'Order not found' });
      res.json(order);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  create: async (req, res) => {
    try {
      const { date, status, user_id, order_detail_id, address_id, cart_id } = req.body;
      await OrderService.createOrder({ date, status, user_id, order_detail_id, address_id, cart_id });
      res.status(201).json({ message: 'Order created' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
};

export default OrderController;