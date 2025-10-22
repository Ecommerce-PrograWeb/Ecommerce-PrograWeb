import '../mocks/models.mock.js';
import { Order } from '../mocks/models.mock.js';
import { describe, it, expect, beforeEach } from 'vitest';
import OrderService from '../../src/modules/service/order.service.js';

describe('order.service', () => {
  beforeEach(() => {
    Order.findAll.mockReset();
    Order.findByPk.mockReset();
    Order.create.mockReset();
    Order.update.mockReset();
    Order.destroy.mockReset();
  });

  it('getOrders(): default sort -date => DESC by date, sin filtros/paginación', async () => {
    Order.findAll.mockResolvedValue([]);
    const res = await OrderService.getOrders({});
    expect(res).toEqual([]);
    const [options] = Order.findAll.mock.calls[0];
    expect(options.order).toEqual([['date', 'DESC']]);
    expect(options.where).toEqual({});
    expect(options.limit).toBeUndefined();
    expect(options.offset).toBeUndefined();
  });

  it('getOrders(): ASC cuando sort no tiene "-"', async () => {
    Order.findAll.mockResolvedValue([]);
    await OrderService.getOrders({ sort: 'total' });
    const [options] = Order.findAll.mock.calls[0];
    expect(options.order).toEqual([['total', 'ASC']]);
  });

  it('getOrders(): fallback a "date" cuando sort es "-"', async () => {
    Order.findAll.mockResolvedValue([]);
    await OrderService.getOrders({ sort: '-' });
    const [options] = Order.findAll.mock.calls[0];
    expect(options.order).toEqual([['date', 'DESC']]);
  });

  it('getOrders(): aplica filtro por status', async () => {
    Order.findAll.mockResolvedValue([]);
    await OrderService.getOrders({ status: 'PAID' });
    const [options] = Order.findAll.mock.calls[0];
    expect(options.where).toEqual({ status: 'PAID' });
  });

  it('getOrders(): no pagina si solo viene page', async () => {
    Order.findAll.mockResolvedValue([]);
    await OrderService.getOrders({ page: 3 });
    const [options] = Order.findAll.mock.calls[0];
    expect(options.limit).toBeUndefined();
    expect(options.offset).toBeUndefined();
  });

  it('getOrders(): no pagina si solo viene limit', async () => {
    Order.findAll.mockResolvedValue([]);
    await OrderService.getOrders({ limit: 25 });
    const [options] = Order.findAll.mock.calls[0];
    expect(options.limit).toBeUndefined();
    expect(options.offset).toBeUndefined();
  });

  it('getOrders(): pagina si vienen page y limit', async () => {
    Order.findAll.mockResolvedValue([]);
    await OrderService.getOrders({ page: 2, limit: 10, sort: '-date' });
    const [options] = Order.findAll.mock.calls[0];
    expect(options.limit).toBe(10);
    expect(options.offset).toBe(10);
  });

  it('getOrderById(): retorna entidad cuando existe', async () => {
    Order.findByPk.mockResolvedValue({ id: 7, total: 100 });
    const r = await OrderService.getOrderById(7);
    expect(r).toEqual({ id: 7, total: 100 });
    expect(Order.findByPk).toHaveBeenCalled();
    expect(Order.findByPk.mock.calls[0][0]).toBe(7);
  });

  it('getOrderById(): retorna null cuando no existe', async () => {
    Order.findByPk.mockResolvedValue(null);
    const r = await OrderService.getOrderById(999);
    expect(r).toBeNull();
  });

  it('createOrder(): delega en Order.create', async () => {
    const payload = { user_id: 1, total: 50.5, status: 'PENDING' };
    Order.create.mockResolvedValue({ id: 10, ...payload });
    const r = await OrderService.createOrder(payload);
    expect(Order.create).toHaveBeenCalledWith(payload);
    expect(r).toEqual({ id: 10, ...payload });
  });

  it('updateOrder(): retorna afectados = 1', async () => {
    Order.update.mockResolvedValue([1]);
    const affected = await OrderService.updateOrder(5, { status: 'PAID' });
    expect(affected).toBe(1);
    expect(Order.update).toHaveBeenCalledWith(
      { status: 'PAID' },
      { where: { order_id: 5 } }
    );
  });

  it('updateOrder(): retorna afectados = 0', async () => {
    Order.update.mockResolvedValue([0]);
    const affected = await OrderService.updateOrder(999, { status: 'PAID' });
    expect(affected).toBe(0);
  });

  it('deleteOrder(): retorna número eliminado', async () => {
    Order.destroy.mockResolvedValue(1);
    const r = await OrderService.deleteOrder(9);
    expect(r).toBe(1);
    expect(Order.destroy).toHaveBeenCalledWith({ where: { order_id: 9 } });
  });

  it('deleteOrder(): retorna 0 cuando no elimina', async () => {
    Order.destroy.mockResolvedValue(0);
    const r = await OrderService.deleteOrder(999);
    expect(r).toBe(0);
  });
});
