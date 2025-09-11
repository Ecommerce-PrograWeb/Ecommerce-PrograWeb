import { vi } from 'vitest';

export const userControllerRouteMock = {
  getUsers: vi.fn((req, res) => res.status(200).json([{ user_id: 1, name: 'A' }])),
  getUserById: vi.fn((req, res) => {
    const { id } = req.params;
    if (id === '999') return res.status(404).json({ error: 'User not found' });
    return res.status(200).json({ user_id: Number(id), name: 'X' });
  }),
  createUser: vi.fn((req, res) => {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    return res.status(201).json({ user_id: 10, ...req.body });
  }),
  updateUser: vi.fn((req, res) => res.status(200).json({ updated: true })),
  deleteUser: vi.fn((req, res) => res.status(204).end()),
  login: vi.fn((req, res) => {
    const { email, password } = req.body || {};
    if (email === 'demo@demo.com' && password === 'demo') {
      return res.status(200).json({ user_id: 1, email, role: 'ADMIN' });
    }
    return res.status(401).json({ error: 'Invalid credentials' });
  }),
};

vi.mock('../../src/modules/controller/user.controller.js', () => userControllerRouteMock);
