import Cart from '../model/cart.model.js';

const CartService = {
    getCarts: () => Cart.findAll(),

    getCartById: (id) => Cart.findByPk(id),

    createCart: ({ total, user_id }) => {
        if (total === undefined || total === null) {
            throw new Error('Missing required cart field: total');
        }
        return Cart.create({ total, user_id: user_id ?? null });
    },

    // Delete cart (soft delete)
    deleteCart: async (id) => {
        // Prefer returning the instance when findByPk is available
        if (Cart.findByPk) {
            const cart = await Cart.findByPk(id);
            if (cart === null) throw new Error(`Cart with id ${id} not found`);
            if (cart) {
                await Cart.destroy({ where: { cart_id: id } });
                return cart;
            }
            // otherwise fallthrough to numeric fallback
        }

        // Fallback: numeric destroy result
        const r = await Cart.destroy({ where: { cart_id: id } });
        return r;
    },

    // Restore cart
    restoreCart: async (id) => {
        await Cart.restore({
            where: { cart_id: id }
        });
        return Cart.findByPk(id);
    }
};

export default CartService;