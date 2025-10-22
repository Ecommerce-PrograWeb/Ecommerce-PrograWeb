import { vi } from 'vitest';

export const Book = {
  findAll: vi.fn(),
  findByPk: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  destroy: vi.fn(),
  belongsTo: vi.fn(),
  associations: {},
};

export const Author = {
  belongsTo: vi.fn(),
  associations: {},
};

export const Category = {
  belongsTo: vi.fn(),
  associations: {},
};

export const Cart = {
  findAll: vi.fn(),
  findByPk: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  destroy: vi.fn(),
  belongsTo: vi.fn(),
  associations: {},
};

export const Order = {
  findAll: vi.fn(),
  findByPk: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  destroy: vi.fn(),
  belongsTo: vi.fn(),
  associations: {},
};

export const OrderDetail = {
  findAll: vi.fn(),
  findByPk: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  destroy: vi.fn(),
  belongsTo: vi.fn(),
  associations: {},
};

export const Address = {
  findAll: vi.fn(),
  findByPk: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  destroy: vi.fn(),
  belongsTo: vi.fn(),
  associations: {},
};

export const User = {
  findAll: vi.fn(),
  findByPk: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  destroy: vi.fn(),
  belongsTo: vi.fn(),
  associations: {},
};

vi.mock('../../src/modules/model/book.model.js', () => ({ default: Book }));
vi.mock('../../src/modules/model/author.model.js', () => ({ default: Author }));
vi.mock('../../src/modules/model/category.model.js', () => ({ default: Category }));
vi.mock('../../src/modules/model/cart.model.js', () => ({ default: Cart }));
vi.mock('../../src/modules/model/order.model.js', () => ({ default: Order }));
vi.mock('../../src/modules/model/order-detail.model.js', () => ({ default: OrderDetail }));
vi.mock('../../src/modules/model/address.model.js', () => ({ default: Address }));
vi.mock('../../src/modules/model/user.model.js', () => ({ default: User }));
