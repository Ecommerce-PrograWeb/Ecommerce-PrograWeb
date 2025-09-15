import { vi } from 'vitest';

export const Book = {
  findAll: vi.fn(),
  findByPk: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  destroy: vi.fn(),
};

export const Author = {};
export const Category = {};


export const Cart = {
  findAll: vi.fn(),
  findByPk: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  destroy: vi.fn(),
};


export const Order = {
  findAll: vi.fn(),
  findByPk: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  destroy: vi.fn(),
};


vi.mock('../../src/modules/model/book.model.js', () => ({ default: Book }));
vi.mock('../../src/modules/model/author.model.js', () => ({ default: Author }));
vi.mock('../../src/modules/model/category.model.js', () => ({ default: Category }));
vi.mock('../../src/modules/model/cart.model.js', () => ({ default: Cart }));
vi.mock('../../src/modules/model/order.model.js', () => ({default: Order}));
