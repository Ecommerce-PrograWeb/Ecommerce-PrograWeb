import '../mocks/user.service.controller.mock.js';
import { userServiceMock as userService } from '../mocks/user.service.controller.mock.js';
import { createResMock } from '../mocks/express.mock.js';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  login,
} from '../../src/modules/controller/user.controller.js';

describe('user.controller', () => {
  const next = vi.fn();
  beforeEach(() => { vi.clearAllMocks(); });

  it('getUsers -> 200 with body', async () => {
    const req = {};
    const res = createResMock();
    userService.getAllUsers.mockResolvedValue([{ user_id: 1 }]);

    await getUsers(req, res, next);

    expect(res.json).toHaveBeenCalledWith([{ user_id: 1 }]);
    expect(next).not.toHaveBeenCalled();
  });

  it('getUsers -> calls next on error', async () => {
    const req = {};
    const res = createResMock();
    const err = new Error('boom');
    userService.getAllUsers.mockRejectedValue(err);

    await getUsers(req, res, next);

    expect(next).toHaveBeenCalledWith(err);
  });

  it('getUserById -> 200 when found', async () => {
    const req = { params: { id: '7' } };
    const res = createResMock();
    userService.getUserById.mockResolvedValue({ user_id: 7 });

    await getUserById(req, res, next);

    expect(res.json).toHaveBeenCalledWith({ user_id: 7 });
  });

  it('getUserById -> 404 when null', async () => {
    const req = { params: { id: '9' } };
    const res = createResMock();
    userService.getUserById.mockResolvedValue(null);

    await getUserById(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('getUserById -> calls next on error', async () => {
    const req = { params: { id: '9' } };
    const res = createResMock();
    const err = new Error('x');
    userService.getUserById.mockRejectedValue(err);

    await getUserById(req, res, next);

    expect(next).toHaveBeenCalledWith(err);
  });

  it('createUser -> 400 when missing required fields', async () => {
    const req = { body: { name: 'A' } };
    const res = createResMock();

    await createUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('createUser -> 201 on success', async () => {
    const req = { body: { name: 'N', email: 'a@b.com', password: 'x', role: 'ADMIN' } };
    const res = createResMock();
    userService.createUser.mockResolvedValue({ user_id: 55 });

    await createUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ user_id: 55 });
  });

  it('createUser -> passes role_id from body (covers destructuring with role, role_id)', async () => {
    const req = { body: { name: 'N', email: 'a@b.com', password: 'x', role_id: 3 } };
    const res = createResMock();
    userService.createUser.mockResolvedValue({ user_id: 77 });

    await createUser(req, res, next);

    expect(userService.createUser).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'N', email: 'a@b.com', password: 'x', role_id: 3 })
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ user_id: 77 });
  });

  it('createUser -> 400 when service throws', async () => {
    const req = { body: { name: 'N', email: 'a@b.com', password: 'x' } };
    const res = createResMock();
    userService.createUser.mockRejectedValue(new Error('dup'));

    await createUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('updateUser -> 200 when updated', async () => {
    const req = { params: { id: '1' }, body: { name: 'X' } };
    const res = createResMock();
    userService.updateUser.mockResolvedValue({ user_id: 1, name: 'X' });

    await updateUser(req, res, next);

    expect(res.json).toHaveBeenCalledWith({ user_id: 1, name: 'X' });
  });

  it('updateUser -> 404 when not found', async () => {
    const req = { params: { id: '1' }, body: { name: 'X' } };
    const res = createResMock();
    userService.updateUser.mockResolvedValue(null);

    await updateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('updateUser -> 400 when service throws', async () => {
    const req = { params: { id: '1' }, body: { name: 'X' } };
    const res = createResMock();
    userService.updateUser.mockRejectedValue(new Error('bad'));

    await updateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('updateUser -> passes empty object when body is missing (covers req.body || {})', async () => {
    const req = { params: { id: '5' } }; // no body property
    const res = createResMock();
    userService.updateUser.mockResolvedValue({ user_id: 5 });

    await updateUser(req, res, next);

    expect(userService.updateUser).toHaveBeenCalledWith('5', {});
    expect(res.json).toHaveBeenCalledWith({ user_id: 5 });
  });

  it('deleteUser -> 200 when deleted', async () => {
    const req = { params: { id: '9' } };
    const res = createResMock();
    userService.deleteUser.mockResolvedValue({ user_id: 9 });

    await deleteUser(req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      message: 'Usuario eliminado con éxito',
      user: { user_id: 9 },
    });
  });

  it('deleteUser -> 404 when not found', async () => {
    const req = { params: { id: '9' } };
    const res = createResMock();
    userService.deleteUser.mockResolvedValue(null);

    await deleteUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('deleteUser -> calls next on error', async () => {
    const req = { params: { id: '9' } };
    const res = createResMock();
    const err = new Error('oops');
    userService.deleteUser.mockRejectedValue(err);

    await deleteUser(req, res, next);

    expect(next).toHaveBeenCalledWith(err);
  });

  it('login -> 400 when missing fields', async () => {
    const req = { body: { email: 'a@b.com' } };
    const res = createResMock();

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('login -> 400 when body is missing (covers destructuring fallback)', async () => {
    const req = {};
    const res = createResMock();

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('createUser -> 400 when body is missing (covers destructuring fallback)', async () => {
    const req = {}; 
    const res = createResMock();

    await createUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(userService.createUser).not.toHaveBeenCalled();
  });

  it('login -> 401 when invalid', async () => {
    const req = { body: { email: 'a@b.com', password: 'x' } };
    const res = createResMock();
    userService.login.mockResolvedValue(null);

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('login -> 200 when valid', async () => {
    const req = { body: { email: 'a@b.com', password: 'x' } };
    const res = createResMock();
    userService.login.mockResolvedValue({ user_id: 1, role: 'ADMIN' });

    await login(req, res, next);

    expect(res.json).toHaveBeenCalledWith({ message: 'Login ok', user: { user_id: 1, role: 'ADMIN' } });
  });

  it('login -> calls next on service error (covers catch -> next)', async () => {
    const req = { body: { email: 'a@b.com', password: 'x' } };
    const res = createResMock();
    const err = new Error('db down');
    userService.login.mockRejectedValue(err);

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith(err);
  });
});

describe('user.controller default export', () => {
  it('maps the named functions', async () => {
    const mod = await import('../../src/modules/controller/user.controller.js');
    expect(mod.default).toMatchObject({
      getUsers: mod.getUsers,
      getUserById: mod.getUserById,
      createUser: mod.createUser,
      updateUser: mod.updateUser,
      deleteUser: mod.deleteUser,
      login: mod.login,
    });
  });
});
