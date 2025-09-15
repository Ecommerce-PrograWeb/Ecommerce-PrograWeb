import '../mocks/cart.service.controller.mock.js';
import { cartServiceMock as CartService } from '../mocks/cart.service.controller.mock.js';
import { createResMock } from '../mocks/express.mock.js';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import {
  getCarts,
  createCart,
  default as CartController,
} from '../../src/modules/controller/cart.controller.js';

describe('cart.controller', () => {
  beforeEach(() => vi.clearAllMocks());

  // --- getCarts (named) ---
  it('getCarts -> 200 y retorna lista', async () => {
    const req = {};
    const res = createResMock();
    const data = [{ id: 1, total: 20 }];
    CartService.getCarts.mockResolvedValue(data);

    await getCarts(req, res);

    expect(CartService.getCarts).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(data); // 200 por defecto
  });

  it('getCarts -> 500 en error', async () => {
    const req = {};
    const res = createResMock();
    CartService.getCarts.mockRejectedValue(new Error('db'));

    await getCarts(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'db' });
  });

  // --- createCart (named) ---
  it('createCart -> 201 en éxito', async () => {
    const req = { body: { total: 33.3, user_id: 5 } };
    const res = createResMock();
    CartService.createCart.mockResolvedValue({ id: 10 });

    await createCart(req, res);

    expect(CartService.createCart).toHaveBeenCalledWith({ total: 33.3, user_id: 5 });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Cart created' });
  });

  it('createCart -> 400 cuando service lanza error (p.ej. falta total)', async () => {
    const req = { body: {} };
    const res = createResMock();
    CartService.createCart.mockImplementation(() => { throw new Error('Missing required cart field: total'); });

    await createCart(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing required cart field: total' });
  });

  // --- default.getAll (alias del named getCarts) ---
  it('CartController.getAll -> 200 y retorna lista', async () => {
    const req = {};
    const res = createResMock();
    const data = [{ id: 2, total: 15 }];
    CartService.getCarts.mockResolvedValue(data);

    await CartController.getAll(req, res);

    expect(CartService.getCarts).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(data);
  });

  it('CartController.getAll -> 500 en error', async () => {
    const req = {};
    const res = createResMock();
    CartService.getCarts.mockRejectedValue(new Error('boom'));

    await CartController.getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'boom' });
  });

  // --- default.getById ---
  it('CartController.getById -> 200 cuando existe', async () => {
    const req = { params: { id: '7' } };
    const res = createResMock();
    CartService.getCartById.mockResolvedValue({ id: 7, total: 50 });

    await CartController.getById(req, res);

    expect(CartService.getCartById).toHaveBeenCalledWith('7');
    expect(res.json).toHaveBeenCalledWith({ id: 7, total: 50 });
  });

  it('CartController.getById -> 404 cuando no existe', async () => {
    const req = { params: { id: '9' } };
    const res = createResMock();
    CartService.getCartById.mockResolvedValue(null);

    await CartController.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Cart not found' });
  });

  it('CartController.getById -> 500 en error', async () => {
    const req = { params: { id: '9' } };
    const res = createResMock();
    CartService.getCartById.mockRejectedValue(new Error('x'));

    await CartController.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'x' });
  });

  // --- default.create (alias del named createCart) ---
  it('CartController.create -> 201 en éxito', async () => {
    const req = { body: { total: 12.5 } };
    const res = createResMock();
    CartService.createCart.mockResolvedValue({ id: 99 });

    await CartController.create(req, res);

    expect(CartService.createCart).toHaveBeenCalledWith({ total: 12.5, user_id: undefined });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Cart created' });
  });

  it('CartController.create -> 400 en error de validación', async () => {
    const req = { body: {} };
    const res = createResMock();
    CartService.createCart.mockImplementation(() => { throw new Error('Missing required cart field: total'); });

    await CartController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing required cart field: total' });
  });
});
