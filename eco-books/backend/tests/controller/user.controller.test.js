import '../mocks/user.service.controller.mock.js';
import { userServiceMock as UserService } from '../mocks/user.service.controller.mock.js';
import { createResMock } from '../mocks/express.mock.js';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import {
  getUsers, getUserById, createUser, updateUser, deleteUser, login,
} from '../../src/modules/controller/user.controller.js';

describe('user.controller', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getUsers -> 200 con lista', async () => {
    const req = {};
    const res = createResMock();
    const next = vi.fn();
    const data = [{ user_id: 1 }];
    UserService.getAllUsers.mockResolvedValue(data);

    await getUsers(req, res, next);

    expect(UserService.getAllUsers).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(data);
    expect(next).not.toHaveBeenCalled();
  });

  it('getUsers -> next(err) en error', async () => {
    const req = {};
    const res = createResMock();
    const next = vi.fn();
    UserService.getAllUsers.mockRejectedValue(new Error('boom'));

    await getUsers(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it('getUserById -> 200 cuando existe', async () => {
    const req = { params: { id: '7' } };
    const res = createResMock();
    const next = vi.fn();
    UserService.getUserById.mockResolvedValue({ user_id: 7 });

    await getUserById(req, res, next);

    expect(res.json).toHaveBeenCalledWith({ user_id: 7 });
    expect(next).not.toHaveBeenCalled();
  });

  it('getUserById -> 404 cuando no existe', async () => {
    const req = { params: { id: '9' } };
    const res = createResMock();
    const next = vi.fn();
    UserService.getUserById.mockResolvedValue(null);

    await getUserById(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuario no encontrado' });
  });

  it('getUserById -> next(err) en error', async () => {
    const req = { params: { id: '9' } };
    const res = createResMock();
    const next = vi.fn();
    UserService.getUserById.mockRejectedValue(new Error('x'));

    await getUserById(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it('createUser -> 400 si faltan name/email/password', async () => {
    const req = { body: { name: 'A' } };
    const res = createResMock();
    const next = vi.fn();

    await createUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('createUser -> 201 con user creado', async () => {
    const payload = { name: 'A', email: 'a@b.com', password: 'pw', role: 'ADMIN' };
    const req = { body: payload };
    const res = createResMock();
    const next = vi.fn();
    UserService.createUser.mockResolvedValue({ user_id: 10, name: 'A' });

    await createUser(req, res, next);

    expect(UserService.createUser).toHaveBeenCalledWith(payload);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ user_id: 10, name: 'A' });
  });

  it('createUser -> 400 si service lanza error', async () => {
    const req = { body: { name: 'A', email: 'a@b.com', password: 'pw' } };
    const res = createResMock();
    const next = vi.fn();
    UserService.createUser.mockRejectedValue(new Error('duplicado'));

    await createUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Error al crear usuario' })
    );
  });

  it('updateUser -> 200 cuando actualiza', async () => {
    const req = { params: { id: '5' }, body: { name: 'New' } };
    const res = createResMock();
    const next = vi.fn();
    UserService.updateUser.mockResolvedValue({ user_id: 5, name: 'New' });

    await updateUser(req, res, next);

    expect(UserService.updateUser).toHaveBeenCalledWith('5', { name: 'New' });
    expect(res.json).toHaveBeenCalledWith({ user_id: 5, name: 'New' });
  });

  it('updateUser -> 404 cuando no existe', async () => {
    const req = { params: { id: '5' }, body: { name: 'New' } };
    const res = createResMock();
    const next = vi.fn();
    UserService.updateUser.mockResolvedValue(null);

    await updateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuario no encontrado' });
  });

  it('updateUser -> 400 cuando service lanza error', async () => {
    const req = { params: { id: '5' }, body: { email: 'taken@b.com' } };
    const res = createResMock();
    const next = vi.fn();
    UserService.updateUser.mockRejectedValue(new Error('email en uso'));

    await updateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Error al actualizar usuario' })
    );
  });

  it('deleteUser -> 200 con mensaje y user', async () => {
    const req = { params: { id: '3' } };
    const res = createResMock();
    const next = vi.fn();
    UserService.deleteUser.mockResolvedValue({ user_id: 3 });

    await deleteUser(req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      message: 'Usuario eliminado con éxito',
      user: { user_id: 3 },
    });
  });

  it('deleteUser -> 404 cuando no existe', async () => {
    const req = { params: { id: '3' } };
    const res = createResMock();
    const next = vi.fn();
    UserService.deleteUser.mockResolvedValue(null);

    await deleteUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuario no encontrado' });
  });

  it('deleteUser -> next(err) en error', async () => {
    const req = { params: { id: '3' } };
    const res = createResMock();
    const next = vi.fn();
    UserService.deleteUser.mockRejectedValue(new Error('oops'));

    await deleteUser(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it('login -> 400 si faltan email/password', async () => {
    const req = { body: { email: 'x@y.com' } };
    const res = createResMock();
    const next = vi.fn();

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('login -> 401 si credenciales inválidas', async () => {
    const req = { body: { email: 'x@y.com', password: 'nope' } };
    const res = createResMock();
    const next = vi.fn();
    UserService.login.mockResolvedValue(null);

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Credenciales inválidas' });
  });

  it('login -> 200 con user', async () => {
    const req = { body: { email: 'x@y.com', password: 'pw' } };
    const res = createResMock();
    const next = vi.fn();
    UserService.login.mockResolvedValue({ user_id: 1, email: 'x@y.com' });

    await login(req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      message: 'Login ok',
      user: { user_id: 1, email: 'x@y.com' },
    });
  });

  it('login -> next(err) en error', async () => {
    const req = { body: { email: 'x@y.com', password: 'pw' } };
    const res = createResMock();
    const next = vi.fn();
    UserService.login.mockRejectedValue(new Error('db'));

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it('createUser -> 400 cuando req.body es undefined (ejecuta || {})', async () => {
  const req = {}; // <-- sin body
  const res = createResMock();
  const next = vi.fn();

  await createUser(req, res, next);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ message: 'name, email y password son requeridos' })
  );
  expect(UserService.createUser).not.toHaveBeenCalled();
  });

  it('updateUser -> 200 y pasa {} al service cuando req.body es undefined (ejecuta || {})', async () => {
  const req = { params: { id: '5' } }; // <-- sin body
  const res = createResMock();
  const next = vi.fn();
  UserService.updateUser.mockResolvedValue({ user_id: 5, name: 'Same' });

  await updateUser(req, res, next);

  expect(UserService.updateUser).toHaveBeenCalledWith('5', {}); // <-- aquí validamos el {}
  expect(res.json).toHaveBeenCalledWith({ user_id: 5, name: 'Same' });
  });

  it('login -> 400 cuando req.body es undefined (ejecuta || {})', async () => {
  const req = {}; // <-- sin body
  const res = createResMock();
  const next = vi.fn();

  await login(req, res, next);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ message: 'email y password son requeridos' })
  );
  expect(UserService.login).not.toHaveBeenCalled();
  });
});
