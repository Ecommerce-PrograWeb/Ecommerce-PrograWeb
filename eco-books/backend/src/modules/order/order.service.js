import Order from './order.model.js';

const OrderService = {
  getOrders: () => Order.findAll(),

  getOrderById: (id) => Order.findByPk(id),

  createOrder: ({ date, status, user_id, order_detail_id, address_id, cart_id }) => {
    if (!date || !status || !user_id || !order_detail_id || !address_id || !cart_id) {
      throw new Error('Missing required order fields');
    }

    return Order.create({ date, status, user_id, order_detail_id, address_id, cart_id });
  }
};

export default OrderService;