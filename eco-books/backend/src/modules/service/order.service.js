import Order from '../model/order.model.js';
import CartService from './cart.service.js'; //  el cart service para traer items

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

  // Returns user orders with their items (via CartService)
  async getOrdersByUser(userId) {
    // 1) Bring the user's orders
    const orders = await Order.findAll({
      where: { user_id: userId },
      order: [['date', 'DESC']],
    });

    // 2) For each order, bring the items from the associated cart
    const withItems = await Promise.all(
      orders.map(async (o) => {
        const cartId = o.cart_id;
        // Debes implementar getItemsByCartId en cart.service.js si no existe
        const items = await CartService.getItemsByCartId(cartId);

        // [{ title, unit_price, quantity }]
        const normItems = (items ?? []).map(it => ({
          title: it.title ?? it.book?.name ?? it.name,
          unit_price: it.unit_price ?? it.price ?? it.purchase_price ?? 0,
          quantity: it.quantity ?? it.qty ?? 1,
        }));

        return {
          id: o.order_id ?? o.id,
          date: o.date ?? o.createdAt,
          items: normItems,
        };
      })
    );

    return withItems;
  },
};

export default OrderService;
