import '../mocks/database.mock.js'; 
import { describe, it, expect, beforeEach } from 'vitest';
import { sequelize } from '../../src/config/database.js';
import { findRoleIdByType } from '../../src/modules/service/user.service.js';

describe('user.service/findRoleIdByType', () => {
  beforeEach(() => sequelize.query.mockReset());

  it('returns null early when type is falsy', async () => {
    expect(await findRoleIdByType(null)).toBeNull();
    expect(await findRoleIdByType(undefined)).toBeNull();
    expect(await findRoleIdByType('')).toBeNull();
    expect(sequelize.query).not.toHaveBeenCalled();
  });

  it('returns role_id when found', async () => {
    sequelize.query.mockResolvedValueOnce([[{ role_id: 5 }]]);
    const r = await findRoleIdByType('ADMIN');
    expect(r).toBe(5);
    expect(sequelize.query).toHaveBeenCalledTimes(1);
  });

  it('returns null when no rows', async () => {
    sequelize.query.mockResolvedValueOnce([[]]);
    const r = await findRoleIdByType('NOPE');
    expect(r).toBeNull();
  });

  it('returns null when first row exists but has no role_id', async () => {
    sequelize.query.mockResolvedValueOnce([[{}]]);
    const r = await findRoleIdByType('ANY');
    expect(r).toBeNull();
    expect(sequelize.query).toHaveBeenCalledTimes(1);
  });
});
