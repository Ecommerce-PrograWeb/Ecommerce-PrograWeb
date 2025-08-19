import OrderService from './order.service.js';

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
