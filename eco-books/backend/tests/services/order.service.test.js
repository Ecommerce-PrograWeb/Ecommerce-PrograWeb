import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../../src/modules/model/order.model.js', () => ({
  default: {
    findAll: vi.fn(),
    findByPk: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    destroy: vi.fn(),
  },
}));

import OrderService from '../../src/modules/service/order.service.js';
import Order from '../../src/modules/model/order.model.js';

describe('order.service', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getOrders(): default sort -date => DESC by date, no filters, no pagination', async () => {
    Order.findAll.mockResolvedValue([]);
    const res = await OrderService.getOrders({});
    expect(res).toEqual([]);
    const [options] = Order.findAll.mock.calls[0];
    expect(options.order).toEqual([['date', 'DESC']]);
    expect(options.where).toEqual({});
    expect(options.limit).toBeUndefined();
    expect(options.offset).toBeUndefined();
  });

  it('getOrders(): ASC when sort has no dash', async () => {
    Order.findAll.mockResolvedValue([]);
    await OrderService.getOrders({ sort: 'total' });
    const [options] = Order.findAll.mock.calls[0];
    expect(options.order).toEqual([['total', 'ASC']]);
  });

  it('getOrders(): fallback field when sort is "-" (empty after replace) -> date', async () => {
    Order.findAll.mockResolvedValue([]);
    await OrderService.getOrders({ sort: '-' });
    const [options] = Order.findAll.mock.calls[0];
    expect(options.order).toEqual([['date', 'DESC']]); 
  });

  it('getOrders(): applies status filter when provided', async () => {
    Order.findAll.mockResolvedValue([]);
    await OrderService.getOrders({ status: 'PAID' });
    const [options] = Order.findAll.mock.calls[0];
    expect(options.where).toEqual({ status: 'PAID' });
  });

  it('getOrders(): no pagination when only page is provided', async () => {
    Order.findAll.mockResolvedValue([]);
    await OrderService.getOrders({ page: 3 });
    const [options] = Order.findAll.mock.calls[0];
    expect(options.limit).toBeUndefined();
    expect(options.offset).toBeUndefined();
  });

  it('getOrders(): no pagination when only limit is provided', async () => {
    Order.findAll.mockResolvedValue([]);
    await OrderService.getOrders({ limit: 25 });
    const [options] = Order.findAll.mock.calls[0];
    expect(options.limit).toBeUndefined();
    expect(options.offset).toBeUndefined();
  });

  it('getOrders(): paginates when page and limit are provided', async () => {
    Order.findAll.mockResolvedValue([]);
    await OrderService.getOrders({ page: 2, limit: 10, sort: '-date' });
    const [options] = Order.findAll.mock.calls[0];
    expect(options.limit).toBe(10);
    expect(options.offset).toBe(10);
  });

  it('getOrderById(): returns entity when found', async () => {
    Order.findByPk.mockResolvedValue({ id: 7, total: 100 });
    const r = await OrderService.getOrderById(7);
    expect(r).toEqual({ id: 7, total: 100 });
    expect(Order.findByPk).toHaveBeenCalledWith(7);
  });

  it('getOrderById(): returns null when not found', async () => {
    Order.findByPk.mockResolvedValue(null);
    const r = await OrderService.getOrderById(999);
    expect(r).toBeNull();
  });

  it('createOrder(): delegates to Order.create', async () => {
    const payload = { user_id: 1, total: 50.5, status: 'PENDING' };
    Order.create.mockResolvedValue({ id: 10, ...payload });
    const r = await OrderService.createOrder(payload);
    expect(Order.create).toHaveBeenCalledWith(payload);
    expect(r).toEqual({ id: 10, ...payload });
  });

  it('updateOrder(): returns affected count = 1', async () => {
    Order.update.mockResolvedValue([1]);
    const affected = await OrderService.updateOrder(5, { status: 'PAID' });
    expect(affected).toBe(1);
    expect(Order.update).toHaveBeenCalledWith(
      { status: 'PAID' },
      { where: { order_id: 5 } }
    );
  });

  it('updateOrder(): returns affected count = 0', async () => {
    Order.update.mockResolvedValue([0]);
    const affected = await OrderService.updateOrder(999, { status: 'PAID' });
    expect(affected).toBe(0);
  });

  it('deleteOrder(): returns number deleted (1)', async () => {
    Order.destroy.mockResolvedValue(1);
    const r = await OrderService.deleteOrder(9);
    expect(r).toBe(1);
    expect(Order.destroy).toHaveBeenCalledWith({ where: { order_id: 9 } });
  });

  it('deleteOrder(): returns number deleted (0)', async () => {
    Order.destroy.mockResolvedValue(0);
    const r = await OrderService.deleteOrder(999);
    expect(r).toBe(0);
  });
});
