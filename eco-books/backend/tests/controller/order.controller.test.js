import '../mocks/order.service.controller.mock.js';
import { orderServiceMock as OrderService } from '../mocks/order.service.controller.mock.js';
import { createResMock } from '../mocks/express.mock.js';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import {
  getOrders, getOrderById, createOrder, patchOrder, putOrder, deleteOrder,
} from '../../src/modules/controller/order.controller.js';

describe('order.controller', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getOrders -> 200 y parsea query {page,limit,status,sort}', async () => {
    const req = { query: { page: '2', limit: '10', status: 'PAID', sort: 'total' } };
    const res = createResMock();
    const data = [{ order_id: 1 }];
    OrderService.getOrders.mockResolvedValue(data);

    await getOrders(req, res);

    expect(OrderService.getOrders).toHaveBeenCalledWith({ page: 2, limit: 10, status: 'PAID', sort: 'total' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(data);
  });

  it('getOrders -> 500 en error', async () => {
    const req = { query: {} };
    const res = createResMock();
    OrderService.getOrders.mockRejectedValue(new Error('boom'));

    await getOrders(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('getOrderById -> 200 cuando existe', async () => {
    const req = { params: { id: '7' } };
    const res = createResMock();
    OrderService.getOrderById.mockResolvedValue({ order_id: 7 });

    await getOrderById(req, res);

    expect(res.json).toHaveBeenCalledWith({ order_id: 7 });
  });

  it('getOrderById -> 404 cuando no existe', async () => {
    const req = { params: { id: '9' } };
    const res = createResMock();
    OrderService.getOrderById.mockResolvedValue(null);

    await getOrderById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('getOrderById -> 500 en error', async () => {
    const req = { params: { id: '9' } };
    const res = createResMock();
    OrderService.getOrderById.mockRejectedValue(new Error('x'));

    await getOrderById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('createOrder -> 400 si faltan campos requeridos', async () => {
    const req = { body: { status: 'PAID' } }; // faltan varios
    const res = createResMock();

    await createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('createOrder -> 201 y Location', async () => {
    const req = { body: {
      date: '2024-01-01', status: 'PENDING', user_id: 1, order_detail_id: 2, address_id: 3, cart_id: 4,
    }};
    const res = createResMock();
    OrderService.createOrder.mockResolvedValue({ order_id: 77 });

    await createOrder(req, res);

    expect(res.setHeader).toHaveBeenCalledWith('Location', '/orders/77');
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Order created', id: 77 });
  });

  it('createOrder -> 409 en FK error', async () => {
    const req = { body: {
      date: '2024-01-01', status: 'PENDING', user_id: 1, order_detail_id: 2, address_id: 3, cart_id: 4,
    }};
    const res = createResMock();
    const err = Object.assign(new Error('fk'), { name: 'SequelizeForeignKeyConstraintError' });
    OrderService.createOrder.mockRejectedValue(err);

    await createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
  });

  it('createOrder -> 422 en DB/Validation error', async () => {
    const req = { body: {
      date: '2024-01-01', status: 'PENDING', user_id: 1, order_detail_id: 2, address_id: 3, cart_id: 4,
    }};
    const res = createResMock();

    for (const n of ['SequelizeDatabaseError','SequelizeValidationError']) {
      OrderService.createOrder.mockRejectedValueOnce(Object.assign(new Error('bad'), { name: n }));
      await createOrder(req, res);
      expect(res.status).toHaveBeenCalledWith(422);
    }
  });

  it('createOrder -> 500 en error inesperado', async () => {
    const req = { body: {
      date: '2024-01-01', status: 'PENDING', user_id: 1, order_detail_id: 2, address_id: 3, cart_id: 4,
    }};
    const res = createResMock();
    OrderService.createOrder.mockRejectedValue(new Error('unexpected'));

    await createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('patchOrder -> 400 si no hay campos', async () => {
    const req = { params: { id: '5' }, body: {} };
    const res = createResMock();

    await patchOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('patchOrder -> 200 y retorna actualizado', async () => {
    const req = { params: { id: '5' }, body: { status: 'PAID', order_id: 999 } };
    const res = createResMock();
    OrderService.updateOrder.mockResolvedValue(1);
    OrderService.getOrderById.mockResolvedValue({ order_id: 5, status: 'PAID' });

    await patchOrder(req, res);

    expect(OrderService.updateOrder).toHaveBeenCalledWith('5', { status: 'PAID' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ order_id: 5, status: 'PAID' });
  });

  it('patchOrder -> 404 cuando no existe', async () => {
    const req = { params: { id: '5' }, body: { status: 'PAID' } };
    const res = createResMock();
    OrderService.updateOrder.mockResolvedValue(0);

    await patchOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('patchOrder -> 409 / 422 / 500 en errores', async () => {
    const req = { params: { id: '5' }, body: { status: 'PAID' } };
    const res = createResMock();

    OrderService.updateOrder.mockRejectedValueOnce(Object.assign(new Error('fk'), { name: 'SequelizeForeignKeyConstraintError' }));
    await patchOrder(req, res);
    expect(res.status).toHaveBeenCalledWith(409);

    OrderService.updateOrder.mockRejectedValueOnce(Object.assign(new Error('db'), { name: 'SequelizeDatabaseError' }));
    await patchOrder(req, res);
    expect(res.status).toHaveBeenCalledWith(422);

    OrderService.updateOrder.mockRejectedValueOnce(Object.assign(new Error('val'), { name: 'SequelizeValidationError' }));
    await patchOrder(req, res);
    expect(res.status).toHaveBeenCalledWith(422);

    OrderService.updateOrder.mockRejectedValueOnce(new Error('boom'));
    await patchOrder(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('putOrder -> 400 si faltan campos requeridos', async () => {
    const req = { params: { id: '5' }, body: { status: 'PAID' } };
    const res = createResMock();

    await putOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('putOrder -> 200 con actualizado', async () => {
    const req = { params: { id: '5' }, body: {
      date: '2024-01-01', status: 'PAID', user_id: 1, order_detail_id: 2, address_id: 3, cart_id: 4,
    }};
    const res = createResMock();
    OrderService.updateOrder.mockResolvedValue(1);
    OrderService.getOrderById.mockResolvedValue({ order_id: 5, status: 'PAID' });

    await putOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ order_id: 5, status: 'PAID' });
  });

  it('putOrder -> 404 cuando no existe', async () => {
    const req = { params: { id: '5' }, body: {
      date: '2024-01-01', status: 'PAID', user_id: 1, order_detail_id: 2, address_id: 3, cart_id: 4,
    }};
    const res = createResMock();
    OrderService.updateOrder.mockResolvedValue(0);

    await putOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('putOrder -> 409 / 422 / 500 en errores', async () => {
    const payload = {
      date: '2024-01-01', status: 'PENDING', user_id: 1, order_detail_id: 2, address_id: 3, cart_id: 4,
    };
    const req = { params: { id: '5' }, body: payload };
    const res = createResMock();

    OrderService.updateOrder.mockRejectedValueOnce(Object.assign(new Error('fk'), { name: 'SequelizeForeignKeyConstraintError' }));
    await putOrder(req, res);
    expect(res.status).toHaveBeenCalledWith(409);

    OrderService.updateOrder.mockRejectedValueOnce(Object.assign(new Error('db'), { name: 'SequelizeDatabaseError' }));
    await putOrder(req, res);
    expect(res.status).toHaveBeenCalledWith(422);

    OrderService.updateOrder.mockRejectedValueOnce(Object.assign(new Error('val'), { name: 'SequelizeValidationError' }));
    await putOrder(req, res);
    expect(res.status).toHaveBeenCalledWith(422);

    OrderService.updateOrder.mockRejectedValueOnce(new Error('yikes'));
    await putOrder(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('deleteOrder -> 204 cuando elimina', async () => {
    const req = { params: { id: '10' } };
    const res = createResMock();
    OrderService.deleteOrder.mockResolvedValue(1);

    await deleteOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it('deleteOrder -> 404 cuando no existe', async () => {
    const req = { params: { id: '10' } };
    const res = createResMock();
    OrderService.deleteOrder.mockResolvedValue(0);

    await deleteOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('deleteOrder -> 500 en error', async () => {
    const req = { params: { id: '10' } };
    const res = createResMock();
    OrderService.deleteOrder.mockRejectedValue(new Error('oops'));

    await deleteOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
