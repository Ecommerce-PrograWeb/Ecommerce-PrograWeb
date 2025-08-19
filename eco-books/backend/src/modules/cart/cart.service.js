import Cart from './cart.model.js';

const CartService = {
  getCarts: () => Cart.findAll(),

  getCartById: (id) => Cart.findByPk(id),

  createCart: ({ total, user_id }) => {
    if (total === undefined || total === null) {
      throw new Error('Missing required cart field: total');
    }
    return Cart.create({ total, user_id: user_id ?? null });
  }
};

export default CartService;
