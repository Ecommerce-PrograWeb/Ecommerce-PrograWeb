import '../mocks/order.service.mock.js';
import { orderServiceMock as orderService } from '../mocks/order.service.mock.js';
import { createResMock } from '../mocks/express.mock.js';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import {
  getOrders,
  getOrderById,
  createOrder,
  patchOrder,
  putOrder,
  deleteOrder,
} from '../../src/modules/controller/order.controller.js';

describe('order.controller', () => {
  beforeEach(() => vi.clearAllMocks());

  // ---------- GET /orders
  it('getOrders -> 200 with query conversion and sort', async () => {
    const req = { query: { page: '2', limit: '10', status: 'PAID', sort: 'total' } };
    const res = createResMock();
    orderService.getOrders.mockResolvedValue([{ order_id: 1 }]);

    await getOrders(req, res);

    expect(orderService.getOrders).toHaveBeenCalledWith({ page: 2, limit: 10, status: 'PAID', sort: 'total' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ order_id: 1 }]);
  });

  it('getOrders -> 500 on error', async () => {
    const req = { query: {} };
    const res = createResMock();
    orderService.getOrders.mockRejectedValue(new Error('boom'));

    await getOrders(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });

  // ---------- GET /orders/:id
  it('getOrderById -> 200 when found', async () => {
    const req = { params: { id: '7' } };
    const res = createResMock();
    orderService.getOrderById.mockResolvedValue({ order_id: 7 });

    await getOrderById(req, res);

    expect(orderService.getOrderById).toHaveBeenCalledWith('7');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ order_id: 7 });
  });

  it('getOrderById -> 404 when null', async () => {
    const req = { params: { id: '9' } };
    const res = createResMock();
    orderService.getOrderById.mockResolvedValue(null);

    await getOrderById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Order not found' });
  });

  it('getOrderById -> 500 on error', async () => {
    const req = { params: { id: '9' } };
    const res = createResMock();
    orderService.getOrderById.mockRejectedValue(new Error('x'));

    await getOrderById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });

  // ---------- POST /orders
  it('createOrder -> 400 when missing required fields', async () => {
    const req = { body: { status: 'PENDING' } }; // missing many required fields
    const res = createResMock();

    await createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Required fields are missing' });
  });

  it('createOrder -> 201 ok and Location header', async () => {
    const req = {
      body: {
        date: '2024-01-01',
        status: 'PENDING',
        user_id: 1,
        order_detail_id: 10,
        address_id: 5,
        cart_id: 3,
      },
    };
    const res = createResMock();
    orderService.createOrder.mockResolvedValue({ order_id: 77 });

    await createOrder(req, res);

    expect(orderService.createOrder).toHaveBeenCalledWith(req.body);
    expect(res.setHeader).toHaveBeenCalledWith('Location', '/orders/77');
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Order created', id: 77 });
  });

  it('createOrder -> 409 on FK error', async () => {
    const req = {
      body: {
        date: '2024-01-01', status: 'PENDING', user_id: 1, order_detail_id: 10, address_id: 5, cart_id: 3,
      },
    };
    const res = createResMock();
    orderService.createOrder.mockRejectedValue({ name: 'SequelizeForeignKeyConstraintError' });

    await createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
  });

  it('createOrder -> 422 on DB/Validation error', async () => {
    const req = {
      body: {
        date: '2024-01-01', status: 'XXX', user_id: 1, order_detail_id: 10, address_id: 5, cart_id: 3,
      },
    };
    const res = createResMock();
    orderService.createOrder.mockRejectedValue({ name: 'SequelizeDatabaseError', message: 'bad enum' });

    await createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({ error: 'bad enum' });
  });

  it('createOrder -> 500 generic error', async () => {
    const req = {
      body: {
        date: '2024-01-01', status: 'PENDING', user_id: 1, order_detail_id: 10, address_id: 5, cart_id: 3,
      },
    };
    const res = createResMock();
    orderService.createOrder.mockRejectedValue(new Error('unexpected'));

    await createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });

  // ---------- PATCH /orders/:id
  it('patchOrder -> 400 when empty body', async () => {
    const req = { params: { id: '1' }, body: {} };
    const res = createResMock();

    await patchOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'No fields to update' });
  });

  it('patchOrder -> strips order_id and updates -> 200 when affected', async () => {
    const req = { params: { id: '1' }, body: { order_id: 999, status: 'PAID' } };
    const res = createResMock();
    orderService.updateOrder.mockResolvedValue(1);
    orderService.getOrderById.mockResolvedValue({ order_id: 1, status: 'PAID' });

    await patchOrder(req, res);

    expect(orderService.updateOrder).toHaveBeenCalledWith('1', { status: 'PAID' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ order_id: 1, status: 'PAID' });
  });

  it('patchOrder -> 404 when not affected', async () => {
    const req = { params: { id: '1' }, body: { status: 'PAID' } };
    const res = createResMock();
    orderService.updateOrder.mockResolvedValue(0);

    await patchOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Order not found' });
  });

  it('patchOrder -> 409 on FK error', async () => {
    const req = { params: { id: '1' }, body: { user_id: 999 } };
    const res = createResMock();
    orderService.updateOrder.mockRejectedValue({ name: 'SequelizeForeignKeyConstraintError' });

    await patchOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
  });

  it('patchOrder -> 422 on DB/Validation error', async () => {
    const req = { params: { id: '1' }, body: { status: 'BAD' } };
    const res = createResMock();
    orderService.updateOrder.mockRejectedValue({ name: 'SequelizeValidationError', message: 'bad' });

    await patchOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({ error: 'bad' });
  });

  it('patchOrder -> 500 generic error', async () => {
    const req = { params: { id: '1' }, body: { status: 'PAID' } };
    const res = createResMock();
    orderService.updateOrder.mockRejectedValue(new Error('boom'));

    await patchOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });

  // ---------- PUT /orders/:id
  it('putOrder -> 400 when missing required', async () => {
    const req = { params: { id: '1' }, body: { status: 'PAID' } }; // missing others
    const res = createResMock();

    await putOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'All fields are required for full update' });
  });

  it('putOrder -> 200 when updated', async () => {
    const req = {
      params: { id: '1' },
      body: { date: '2024-01-01', status: 'PAID', user_id: 1, order_detail_id: 2, address_id: 3, cart_id: 4 },
    };
    const res = createResMock();
    orderService.updateOrder.mockResolvedValue(1);
    orderService.getOrderById.mockResolvedValue({ order_id: 1, ...req.body });

    await putOrder(req, res);

    expect(orderService.updateOrder).toHaveBeenCalledWith('1', req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ order_id: 1, ...req.body });
  });

  it('putOrder -> 404 when not found', async () => {
    const req = {
      params: { id: '1' },
      body: { date: '2024-01-01', status: 'PAID', user_id: 1, order_detail_id: 2, address_id: 3, cart_id: 4 },
    };
    const res = createResMock();
    orderService.updateOrder.mockResolvedValue(0);

    await putOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Order not found' });
  });

  it('putOrder -> 409 on FK error', async () => {
    const req = {
      params: { id: '1' },
      body: { date: '2024-01-01', status: 'PAID', user_id: 999, order_detail_id: 2, address_id: 3, cart_id: 4 },
    };
    const res = createResMock();
    orderService.updateOrder.mockRejectedValue({ name: 'SequelizeForeignKeyConstraintError' });

    await putOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
  });

  it('putOrder -> 422 on DB/Validation error', async () => {
    const req = {
      params: { id: '1' },
      body: { date: 'bad', status: 'PAID', user_id: 1, order_detail_id: 2, address_id: 3, cart_id: 4 },
    };
    const res = createResMock();
    orderService.updateOrder.mockRejectedValue({ name: 'SequelizeDatabaseError', message: 'bad date' });

    await putOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({ error: 'bad date' });
  });

  it('putOrder -> 500 generic error', async () => {
    const req = {
      params: { id: '1' },
      body: { date: '2024-01-01', status: 'PAID', user_id: 1, order_detail_id: 2, address_id: 3, cart_id: 4 },
    };
    const res = createResMock();
    orderService.updateOrder.mockRejectedValue(new Error('yikes'));

    await putOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });

  // ---------- DELETE /orders/:id
  it('deleteOrder -> 204 when deleted', async () => {
    const req = { params: { id: '9' } };
    const res = createResMock();
    orderService.deleteOrder.mockResolvedValue(1);

    await deleteOrder(req, res);

    expect(orderService.deleteOrder).toHaveBeenCalledWith('9');
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it('deleteOrder -> 404 when not found', async () => {
    const req = { params: { id: '9' } };
    const res = createResMock();
    orderService.deleteOrder.mockResolvedValue(0);

    await deleteOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Order not found' });
  });

  it('deleteOrder -> 500 on error', async () => {
    const req = { params: { id: '9' } };
    const res = createResMock();
    orderService.deleteOrder.mockRejectedValue(new Error('oops'));

    await deleteOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});
