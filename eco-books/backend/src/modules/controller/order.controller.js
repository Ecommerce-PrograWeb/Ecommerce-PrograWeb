import OrderService from '../service/order.service.js';
import { sequelize } from "../../config/database.js";
import Order from "../model/order.model.js";
import OrderDetail from "../model/order-detail.model.js";

// GET /orders
export async function getOrders(req, res) {
  try {
    const page  = req.query.page  ? Number(req.query.page)  : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const { status, sort } = req.query;

    const result = await OrderService.getOrders({ page, limit, status, sort });
    return res.status(200).json(result);
  } catch (err) {
    console.error('GET /orders error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// GET /orders/user/:userId - Get orders by user ID (order history)
export async function getOrdersByUserId(req, res) {
  try {
    const { userId } = req.params;
    const page  = req.query.page  ? Number(req.query.page)  : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const { sort } = req.query;

    const orders = await OrderService.getOrdersByUserId(userId, { page, limit, sort });
    return res.status(200).json(orders);
  } catch (err) {
    console.error('GET /orders/user/:userId error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// GET /orders/:id
export async function getOrderById(req, res) {
  try {
    const { id } = req.params;
    const order = await OrderService.getOrderById(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    return res.status(200).json(order);
  } catch (err) {
    console.error('GET /orders/:id error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// POST /orders
export async function createOrder(req, res) {
  try {
    const { date, status, user_id, order_detail_id, address_id, cart_id } = req.body;

    // 400 if required fields are missing
    if (!date || !status || !user_id || !order_detail_id || !address_id || !cart_id) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    const created = await OrderService.createOrder({
      date, status, user_id, order_detail_id, address_id, cart_id,
    });

    // 201 with Location header of the created resource
    res.setHeader('Location', `/orders/${created.order_id}`);
    return res.status(201).json({ message: 'Order created', id: created.order_id });
  } catch (err) {
    // 409 if a foreign key constraint fails
    if (err.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(409).json({
        error: 'Foreign key constraint failed: check user_id, order_detail_id, address_id, cart_id',
      });
    }
    // 422 if invalid ENUM or other validation error
    if (err.name === 'SequelizeDatabaseError' || err.name === 'SequelizeValidationError') {
      return res.status(422).json({ error: err.message });
    }
    console.error('POST /orders error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// PATCH /orders/:id (partial update)
export async function patchOrder(req, res) {
  try {
    const { id } = req.params;
    const payload = { ...req.body };

    // do not allow changing the primary key
    delete payload.order_id;

    // 400 if no fields to update
    if (!payload || Object.keys(payload).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const affected = await OrderService.updateOrder(id, payload);
    if (!affected) return res.status(404).json({ error: 'Order not found' });

    const updated = await OrderService.getOrderById(id);
    return res.status(200).json(updated);
  } catch (err) {
    if (err.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(409).json({ error: 'Foreign key constraint failed' });
    }
    if (err.name === 'SequelizeDatabaseError' || err.name === 'SequelizeValidationError') {
      return res.status(422).json({ error: err.message });
    }
    console.error('PATCH /orders/:id error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// PUT /orders/:id (full update)
export async function putOrder(req, res) {
  try {
    const { id } = req.params;
    const { date, status, user_id, order_detail_id, address_id, cart_id } = req.body;

    // validate all required fields
    if (!date || !status || !user_id || !order_detail_id || !address_id || !cart_id) {
      return res.status(400).json({ error: 'All fields are required for full update' });
    }

    const affected = await OrderService.updateOrder(id, {
      date, status, user_id, order_detail_id, address_id, cart_id,
    });

    if (!affected) return res.status(404).json({ error: 'Order not found' });

    const updated = await OrderService.getOrderById(id);
    return res.status(200).json(updated);
  } catch (err) {
    if (err.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(409).json({ error: 'Foreign key constraint failed' });
    }
    if (err.name === 'SequelizeDatabaseError' || err.name === 'SequelizeValidationError') {
      return res.status(422).json({ error: err.message });
    }
    console.error('PUT /orders/:id error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// DELETE /orders/:id
export async function deleteOrder(req, res) {
  try {
    const { id } = req.params;
    const deleted = await OrderService.deleteOrder(id);
    if (!deleted) return res.status(404).json({ error: 'Order not found' });
    return res.status(204).send(); // No Content
  } catch (err) {
    console.error('DELETE /orders/:id error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// POST /orders/:id/restore
export async function restoreOrder(req, res) {
  try {
    const { id } = req.params;
    const restored = await OrderService.restoreOrder(id);
    if (!restored) return res.status(404).json({ error: 'Order not found' });
    return res.json({ message: 'Order successfully restored', order: restored });
  } catch (err) {
    console.error('POST /orders/:id/restore error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// GET /orders/history 
export async function historyForUser(req, res) {
  try {
    const userId = req.user.user_id;

    const items = await OrderService.getHistoryForUser(userId);

    return res.status(200).json({ items });
  } catch (err) {
    console.error("GET /orders/history error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function checkout(req, res) {
  const userId = req.user?.user_id;
  const { items, total, address_id = null, cart_id = null } = req.body || {};

  try {
    if (!userId) {
      return res.status(401).json({ error: "No autenticado" });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "items es requerido y debe tener elementos" });
    }

    const createdOrders = [];
    await sequelize.transaction(async (t) => {
      for (const it of items) {
        const { book_id, price, quantity = 1 } = it || {};
        if (!book_id || price == null) {
          throw new Error("Cada item debe incluir book_id y price");
        }

        const od = await OrderDetail.create(
          {
            sale_price: Number(price), 
            book_id,
          },
          { transaction: t }
        );

        const ord = await Order.create(
          {
            date: new Date(),            
            status: "Pending",           
            user_id: userId,             
            order_detail_id: od.order_detail_id,
            address_id: address_id,      
            cart_id: cart_id,            
          },
          { transaction: t }
        );

        createdOrders.push(ord.order_id);
      }
    });

    return res.status(201).json({
      message: "Checkout OK",
      orders_count: createdOrders.length,
      orders: createdOrders,
      total: Number(total ?? 0),
    });
  } catch (err) {

    if (err.name === "SequelizeForeignKeyConstraintError") {
      return res.status(409).json({ error: "FK inválida (book_id, user_id, address_id o cart_id)" });
    }
    if (err.name === "SequelizeDatabaseError" || err.name === "SequelizeValidationError") {
      return res.status(422).json({ error: err.message });
    }
    console.error("POST /order/checkout error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// ensure named export is present for ESM import sites that expect it
// (restoreOrder is exported above as a named function)
