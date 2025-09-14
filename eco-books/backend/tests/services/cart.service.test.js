import '../mocks/models.mock.js';
import { Cart } from '../mocks/models.mock.js';
import { describe, it, expect, beforeEach } from 'vitest';
import CartService from '../../src/modules/service/cart.service.js';

describe('cart.service', () => {
  beforeEach(() => {
    Cart.findAll.mockReset();
    Cart.findByPk.mockReset();
    Cart.create.mockReset();
    Cart.update.mockReset();
    Cart.destroy.mockReset();
  });

  it('getCarts() returns list from Cart.findAll', async () => {
    Cart.findAll.mockResolvedValue([{ id: 1, total: 20 }]);

    const r = await CartService.getCarts();

    expect(r).toEqual([{ id: 1, total: 20 }]);
    expect(Cart.findAll).toHaveBeenCalledTimes(1);
  });

  it('getCartById() returns cart when found', async () => {
    Cart.findByPk.mockResolvedValue({ id: 7, total: 50 });

    const r = await CartService.getCartById(7);

    expect(r).toEqual({ id: 7, total: 50 });
    expect(Cart.findByPk).toHaveBeenCalledWith(7);
  });

  it('getCartById() returns null when not found', async () => {
    Cart.findByPk.mockResolvedValue(null);

    const r = await CartService.getCartById(999);

    expect(r).toBeNull();
  });

  it('createCart() throws when total is missing', async () => {
    expect(() => CartService.createCart({})).toThrow('Missing required cart field: total');
    expect(() => CartService.createCart({ total: null })).toThrow();
  });

  it('createCart() sets user_id to null when not provided', async () => {
    Cart.create.mockResolvedValue({ id: 10, total: 12.5, user_id: null });

    const r = await CartService.createCart({ total: 12.5 });

    expect(Cart.create).toHaveBeenCalledWith({ total: 12.5, user_id: null });
    expect(r).toEqual({ id: 10, total: 12.5, user_id: null });
  });

  it('createCart() passes provided user_id', async () => {
    Cart.create.mockResolvedValue({ id: 11, total: 30, user_id: 3 });

    const r = await CartService.createCart({ total: 30, user_id: 3 });

    expect(Cart.create).toHaveBeenCalledWith({ total: 30, user_id: 3 });
    expect(r).toEqual({ id: 11, total: 30, user_id: 3 });
  });
});
