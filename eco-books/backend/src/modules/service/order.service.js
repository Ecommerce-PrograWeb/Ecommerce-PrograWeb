import Order from '../model/order.model.js';

const OrderService = {
  // List with filters/sort and optionally pagination
  async getOrders({ page, limit, status, sort = '-date' }) {
    const orderBy = sort.startsWith('-') ? 'DESC' : 'ASC';
    const orderField = sort.replace('-', '') || 'date';

    const where = {};
    if (status) where.status = status;

    const options = {
      where,
      order: [[orderField, orderBy]],
    };

    // Only apply pagination if page and limit are sent
    if (page && limit) {
      const offset = (page - 1) * limit;
      options.limit = +limit;
      options.offset = offset;
    }

    return Order.findAll(options);
  },

  // Search by ID
  getOrderById: (id) => Order.findByPk(id),

  // Create new order
  createOrder: (data) => Order.create(data),

  // Update order (partial or total)
  async updateOrder(id, payload) {
    const [affected] = await Order.update(payload, { where: { order_id: id } });
    return affected; 
  },

// Delete order
  deleteOrder: (id) => Order.destroy({ where: { order_id: id } }),
};

export default OrderService;
