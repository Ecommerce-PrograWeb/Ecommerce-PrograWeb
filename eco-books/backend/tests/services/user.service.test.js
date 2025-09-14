import '../mocks/database.mock.js'; 
import { describe, it, expect, beforeEach } from 'vitest';
import { sequelize } from '../../src/config/database.js';
import * as UserService from '../../src/modules/service/user.service.js';

const sql = sequelize.query;
const resetSQL = () => sql.mockReset();
const mockSQL = (...returns) => returns.forEach(r => sql.mockResolvedValueOnce(r));
const call = (n) => sql.mock.calls[n];

describe('user.service (raw SQL)', () => {
  beforeEach(resetSQL);

  it('getAllUsers returns rows', async () => {
    mockSQL([[{ user_id: 1, name: 'A' }]]);
    const rows = await UserService.getAllUsers();
    expect(rows).toEqual([{ user_id: 1, name: 'A' }]);
    expect(sql).toHaveBeenCalledTimes(1);
    expect(call(0)[0]).toMatch(/FROM `User`/);
  });

  it('getUserById returns first row', async () => {
    mockSQL([[{ user_id: 7, name: 'John' }]]);
    const row = await UserService.getUserById(7);
    expect(row).toEqual({ user_id: 7, name: 'John' });
    expect(call(0)[1]).toEqual({ replacements: { id: 7 } });
  });

  it('getUserById returns null when not found', async () => {
    mockSQL([[]]);
    expect(await UserService.getUserById(999)).toBeNull();
  });

  it('createUser throws if required fields are missing', async () => {
    await expect(UserService.createUser({})).rejects.toThrow(/obligatorios/);
  });

  it('createUser throws if email already exists', async () => {
    mockSQL([[{ '1': 1 }]]);
    await expect(
      UserService.createUser({ name: 'A', email: 'a@b.com', password: 'x' })
    ).rejects.toThrow(/ya está registrado/);
  });

  it('createUser resolves role by name and inserts', async () => {
    mockSQL(
      [[]],
      [[{ role_id: 3 }]],
      [{ insertId: 42 }],
      [[{ user_id: 42, name: 'A', email: 'a@b.com', role: 'ADMIN' }]]
    );

    const created = await UserService.createUser({
      name: 'A', email: 'a@b.com', password: 'x', role: 'ADMIN',
    });

    expect(created).toEqual({ user_id: 42, name: 'A', email: 'a@b.com', role: 'ADMIN' });
    expect(call(2)[0]).toMatch(/INSERT INTO `User`/);
    expect(call(2)[1]).toEqual({
      replacements: { name: 'A', email: 'a@b.com', password: 'x', role_id: 3 },
    });
  });

  it('createUser throws if role by name does not exist', async () => {
    mockSQL([[]], [[]]);
    await expect(
      UserService.createUser({ name: 'A', email: 'a@b.com', password: 'x', role: 'GHOST' })
    ).rejects.toThrow(/Role 'GHOST' no existe/);
  });

  it('createUser uses role_id when provided', async () => {
    mockSQL(
      [[]],
      [{ insertId: 7 }],
      [[{ user_id: 7, name: 'A', email: 'a@b.com', role: 'ADMIN' }]]
    );

    const created = await UserService.createUser({
      name: 'A', email: 'a@b.com', password: 'x', role_id: 3,
    });

    expect(call(1)[0]).toMatch(/INSERT INTO `User`/);
    expect(call(1)[1]).toEqual({
      replacements: { name: 'A', email: 'a@b.com', password: 'x', role_id: 3 },
    });
    expect(created.user_id).toBe(7);
  });

  it('updateUser resolves role by name and updates, then returns row', async () => {
    mockSQL(
      [[{ role_id: 3 }]],
      [{}],
      [[{ user_id: 5, name: 'New', role: 'ADMIN' }]]
    );

    const row = await UserService.updateUser(5, { name: 'New', role: 'ADMIN' });
    expect(call(1)[0]).toMatch(/UPDATE `User` SET/);
    expect(call(1)[1]).toEqual({
      replacements: expect.objectContaining({ id: 5, name: 'New', role_id: 3 }),
    });
    expect(row).toEqual({ user_id: 5, name: 'New', role: 'ADMIN' });
  });

  it('updateUser throws if email is already taken by another user', async () => {
    mockSQL([[{ '1': 1 }]]);
    await expect(UserService.updateUser(9, { email: 'taken@b.com' }))
      .rejects.toThrow(/ya está en uso/);
  });

  it('updateUser with no fields returns current user', async () => {
    mockSQL([[{ user_id: 8, name: 'Keep' }]]);
    const res = await UserService.updateUser(8, {});
    expect(res).toEqual({ user_id: 8, name: 'Keep' });
    expect(sql).toHaveBeenCalledTimes(1);
  });

  it('deleteUser returns null if user does not exist', async () => {
    mockSQL([[]]);
    expect(await UserService.deleteUser(77)).toBeNull();
    expect(sql).toHaveBeenCalledTimes(1);
  });

  it('deleteUser deletes and returns previous row', async () => {
    mockSQL(
      [[{ user_id: 2, name: 'Bye' }]],
      [{}]
    );
    const res = await UserService.deleteUser(2);
    expect(res).toEqual({ user_id: 2, name: 'Bye' });
    expect(call(1)[0]).toMatch(/DELETE FROM `User`/);
    expect(call(1)[1]).toEqual({ replacements: { id: 2 } });
  });

  it('login returns null when user is not found', async () => {
    mockSQL([[]]);
    expect(await UserService.login('x@y.com', 'pw')).toBeNull();
  });

  it('login returns null on wrong password', async () => {
    mockSQL([[{ email: 'x@y.com', password: 'other' }]]);
    expect(await UserService.login('x@y.com', 'pw')).toBeNull();
  });

  it('login returns safe user object when credentials are valid', async () => {
    mockSQL([[{
      user_id: 1, name: 'U', email: 'x@y.com', password: 'pw', role: 'ADMIN',
    }]]);
    const r = await UserService.login('x@y.com', 'pw');
    expect(r).toEqual({ user_id: 1, name: 'U', email: 'x@y.com', role: 'ADMIN' });
    expect('password' in r).toBe(false);
  });
});

describe('user.service (extra branches)', () => {
  beforeEach(resetSQL);

  it('createUser inserts with role_id = null when no role nor role_id (numeric insertId path)', async () => {
    mockSQL(
      [[]],
      [101],
      [[{ user_id: 101, name: 'A', email: 'a@b.com', role: null }]]
    );

    const created = await UserService.createUser({ name: 'A', email: 'a@b.com', password: 'x' });
    expect(created).toEqual({ user_id: 101, name: 'A', email: 'a@b.com', role: null });

    expect(call(1)[0]).toMatch(/INSERT INTO `User`/);
    expect(call(1)[1]).toEqual({
      replacements: { name: 'A', email: 'a@b.com', password: 'x', role_id: null },
    });
  });

  it('updateUser updates email when uniqueness check is empty (no conflict)', async () => {
    mockSQL(
      [[]],
      [{}],
      [[{ user_id: 5, name: 'U', email: 'new@b.com' }]]
    );

    const res = await UserService.updateUser(5, { email: 'new@b.com' });
    expect(res).toEqual({ user_id: 5, name: 'U', email: 'new@b.com' });

    expect(call(1)[1].replacements).toEqual(
      expect.objectContaining({ id: 5, email: 'new@b.com' })
    );
  });

  it('updateUser throws when role name does not exist', async () => {
    mockSQL([[]]);
    await expect(UserService.updateUser(1, { role: 'GHOST' }))
      .rejects.toThrow(/Role 'GHOST' no existe/);
  });
});
