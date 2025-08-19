import CartService from './cart.service.js';
export async function getCarts(req, res) {
    try {
        const carts = await CartService.getCarts();
        res.json(carts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function createCart(req, res) {
    try {
        const { total, user_id } = req.body;
        await CartService.createCart({ total, user_id });
        res.status(201).json({ message: 'Cart created' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}


const CartController = {
    getAll: async (req, res) => {
        try {
            const carts = await CartService.getCarts();
            res.json(carts);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getById: async (req, res) => {
        try {
            const cart = await CartService.getCartById(req.params.id);
            if (!cart) return res.status(404).json({ error: 'Cart not found' });
            res.json(cart);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    create: async (req, res) => {
        try {
            const { total, user_id } = req.body;
            await CartService.createCart({ total, user_id });
            res.status(201).json({ message: 'Cart created' });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
};

export default CartController;