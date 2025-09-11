import '../mocks/cart.service.mock.js';
import { cartServiceMock as CartService } from '../mocks/cart.service.mock.js';
import { createResMock } from '../mocks/express.mock.js';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import {
  getCarts,
  createCart,
} from '../../src/modules/controller/cart.controller.js';
import CartController from '../../src/modules/controller/cart.controller.js';

describe('cart.controller', () => {
  beforeEach(() => vi.clearAllMocks());

  // ---------- GET /cart
  it('getCarts -> 200 on success', async () => {
    const req = {};
    const res = createResMock();
    CartService.getCarts.mockResolvedValue([{ id: 1, total: 10 }]);

    await getCarts(req, res);

    expect(res.status).not.toHaveBeenCalled(); // uses default 200
    expect(res.json).toHaveBeenCalledWith([{ id: 1, total: 10 }]);
  });

  it('getCarts -> 500 on error', async () => {
    const req = {};
    const res = createResMock();
    CartService.getCarts.mockRejectedValue(new Error('boom'));

    await getCarts(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'boom' });
  });

  // ---------- POST /cart
  it('createCart -> 201 on success', async () => {
    const req = { body: { total: 25.5, user_id: 7 } };
    const res = createResMock();
    CartService.createCart.mockResolvedValue({ id: 99, ...req.body });

    await createCart(req, res);

    expect(CartService.createCart).toHaveBeenCalledWith({ total: 25.5, user_id: 7 });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Cart created' });
  });

  it('createCart -> 400 when service throws (e.g., missing total)', async () => {
    const req = { body: {} }; // no total
    const res = createResMock();
    CartService.createCart.mockImplementation(() => { throw new Error('Missing required cart field: total'); });

    await createCart(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing required cart field: total' });
  });

  // GET /cart (alias: getAll)
  it('default.getAll -> 200 on success', async () => {
    const req = {};
    const res = createResMock();
    CartService.getCarts.mockResolvedValue([{ id: 3, total: 13 }]);

    await CartController.getAll(req, res);

    expect(res.status).not.toHaveBeenCalled(); // default 200
    expect(res.json).toHaveBeenCalledWith([{ id: 3, total: 13 }]);
  });

  it('default.getAll -> 500 on error', async () => {
    const req = {};
    const res = createResMock();
    CartService.getCarts.mockRejectedValue(new Error('x'));

    await CartController.getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'x' });
  });

  // GET /cart/:id
  it('default.getById -> 200 when found', async () => {
    const req = { params: { id: '42' } };
    const res = createResMock();
    CartService.getCartById.mockResolvedValue({ id: 42, total: 9.99 });

    await CartController.getById(req, res);

    expect(CartService.getCartById).toHaveBeenCalledWith('42');
    expect(res.status).not.toHaveBeenCalled(); // default 200
    expect(res.json).toHaveBeenCalledWith({ id: 42, total: 9.99 });
  });

  it('default.getById -> 404 when null', async () => {
    const req = { params: { id: '999' } };
    const res = createResMock();
    CartService.getCartById.mockResolvedValue(null);

    await CartController.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Cart not found' });
  });

  it('default.getById -> 500 on error', async () => {
    const req = { params: { id: '1' } };
    const res = createResMock();
    CartService.getCartById.mockRejectedValue(new Error('oops'));

    await CartController.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'oops' });
  });

  // POST /cart (alias: default.create)
  it('default.create -> 201 on success', async () => {
    const req = { body: { total: 12, user_id: null } };
    const res = createResMock();
    CartService.createCart.mockResolvedValue({ id: 10, total: 12, user_id: null });

    await CartController.create(req, res);

    expect(CartService.createCart).toHaveBeenCalledWith({ total: 12, user_id: null });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Cart created' });
  });

  it('default.create -> 400 on error', async () => {
    const req = { body: {} };
    const res = createResMock();
    CartService.createCart.mockImplementation(() => { throw new Error('Missing required cart field: total'); });

    await CartController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing required cart field: total' });
  });
});
