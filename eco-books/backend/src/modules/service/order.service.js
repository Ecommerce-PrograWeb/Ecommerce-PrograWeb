import Order from '../model/order.model.js';
import OrderDetail from '../model/order-detail.model.js';
import Book from '../model/book.model.js';
import Cart from '../model/cart.model.js';
import Address from '../model/address.model.js';
import User from '../model/user.model.js';

// Setup associations if not already set
if (!Order.associations || !Order.associations.orderDetail) {
  Order.belongsTo(OrderDetail, { foreignKey: 'order_detail_id', as: 'orderDetail' });
  Order.belongsTo(Cart, { foreignKey: 'cart_id', as: 'cart' });
  Order.belongsTo(Address, { foreignKey: 'address_id', as: 'address' });
  Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  OrderDetail.belongsTo(Book, { foreignKey: 'book_id', as: 'book' });
}

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
      include: [
        { 
          model: OrderDetail, 
          as: 'orderDetail',
          include: [
            {
              model: Book,
              as: 'book',
              attributes: ['book_id', 'name', 'purchase_price']
            }
          ]
        },
        { model: Cart, as: 'cart', attributes: ['cart_id', 'total'] },
        { model: Address, as: 'address', attributes: ['address_id', 'city', 'zone', 'name'] },
        { model: User, as: 'user', attributes: ['user_id', 'name', 'email'] }
      ]
    };

    // Only apply pagination if page and limit are sent
    if (page && limit) {
      const offset = (page - 1) * limit;
      options.limit = +limit;
      options.offset = offset;
    }

    return Order.findAll(options);
  },

  // Get orders by user ID (for order history)
  async getOrdersByUserId(userId, { page, limit, sort = '-date' }) {
    const orderBy = sort.startsWith('-') ? 'DESC' : 'ASC';
    const orderField = sort.replace('-', '') || 'date';

    const options = {
      where: { user_id: userId },
      order: [[orderField, orderBy]],
      include: [
        { 
          model: OrderDetail, 
          as: 'orderDetail',
          include: [
            {
              model: Book,
              as: 'book',
              attributes: ['book_id', 'name', 'purchase_price']
            }
          ]
        },
        { model: Cart, as: 'cart', attributes: ['cart_id', 'total'] },
        { model: Address, as: 'address', attributes: ['address_id', 'city', 'zone', 'name'] }
      ]
    };

    if (page && limit) {
      const offset = (page - 1) * limit;
      options.limit = +limit;
      options.offset = offset;
    }

    return Order.findAll(options);
  },

  // Search by ID
  getOrderById: (id) => Order.findByPk(id, {
    include: [
      { 
        model: OrderDetail, 
        as: 'orderDetail',
        include: [
          {
            model: Book,
            as: 'book',
            attributes: ['book_id', 'name', 'purchase_price']
          }
        ]
      },
      { model: Cart, as: 'cart', attributes: ['cart_id', 'total'] },
      { model: Address, as: 'address', attributes: ['address_id', 'city', 'zone', 'name'] },
      { model: User, as: 'user', attributes: ['user_id', 'name', 'email'] }
    ]
  }),

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
