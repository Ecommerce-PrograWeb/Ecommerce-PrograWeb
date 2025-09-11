import { vi } from 'vitest';

export const userServiceMock = {
  getAllUsers: vi.fn(),
  getUserById: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn(),
  login: vi.fn(),
};

vi.mock('../../src/modules/service/user.service.js', () => userServiceMock);
