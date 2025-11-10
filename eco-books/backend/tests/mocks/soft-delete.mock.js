import { vi } from 'vitest';

// Mock instance methods
const createMockInstance = (id, data) => ({
  ...data,
  id,
  destroy: vi.fn().mockResolvedValue(true),
  restore: vi.fn().mockResolvedValue(true),
});

// Mock all models for soft delete functionality
export const mockModels = {
  User: {
    findByPk: vi.fn().mockImplementation((id) => 
      createMockInstance(id, { user_id: id, name: 'Test User' })
    ),
    destroy: vi.fn().mockResolvedValue([1]),
    restore: vi.fn().mockResolvedValue([1]),
    update: vi.fn().mockResolvedValue([1]),
    belongsTo: () => {},
    hasMany: () => {},
    belongsToMany: () => {}
  },
  Book: {
    findByPk: vi.fn().mockImplementation((id) => 
      createMockInstance(id, { book_id: id, name: 'Test Book' })
    ),
    destroy: vi.fn().mockResolvedValue([1]),
    restore: vi.fn().mockResolvedValue([1]),
    update: vi.fn().mockResolvedValue([1]),
    belongsTo: () => {},
    hasMany: () => {},
    belongsToMany: () => {}
  },
  Order: {
    findByPk: vi.fn().mockImplementation((id) => 
      createMockInstance(id, { order_id: id, status: 'Pending' })
    ),
    destroy: vi.fn().mockResolvedValue([1]),
    restore: vi.fn().mockResolvedValue([1]),
    update: vi.fn().mockResolvedValue([1]),
    belongsTo: () => {},
    hasMany: () => {},
    belongsToMany: () => {}
  },
  Cart: {
    findByPk: vi.fn().mockImplementation((id) => 
      createMockInstance(id, { cart_id: id, total: 100 })
    ),
    destroy: vi.fn().mockResolvedValue([1]),
    restore: vi.fn().mockResolvedValue([1]),
    update: vi.fn().mockResolvedValue([1]),
    belongsTo: () => {},
    hasMany: () => {},
    belongsToMany: () => {}
  }
};

// Mock sequelize instance
export const mockSequelize = {
  models: mockModels,
  query: vi.fn().mockResolvedValue([[{ count: 1 }], undefined]),
  Model: {
    findByPk: vi.fn(),
    destroy: vi.fn().mockResolvedValue([1]),
    restore: vi.fn().mockResolvedValue([1]),
    update: vi.fn().mockResolvedValue([1])
  }
};

// minimal literal implementation used in some model defaults
mockSequelize.literal = (v) => ({ _literal: v });

// Provide a minimal `define` implementation so model files can call `sequelize.define`
mockSequelize.define = (name /*, attributes, options */) => {
  // If we already have a mock for this model, return it
  if (mockSequelize.models[name]) return mockSequelize.models[name];

  // Otherwise create a generic mock model with common methods used in tests
  const generic = {
    findByPk: vi.fn().mockImplementation((id) => ({ id })),
    findOne: vi.fn(),
    findAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn().mockResolvedValue([1]),
    destroy: vi.fn().mockResolvedValue(1),
    restore: vi.fn().mockResolvedValue([1])
  };
  // add no-op association helpers used in model definitions
  generic.belongsTo = () => {};
  generic.hasMany = () => {};
  generic.belongsToMany = () => {};
  mockSequelize.models[name] = generic;
  return generic;
};

// Setup mock for database.js
vi.mock('../../src/config/database.js', () => ({
  sequelize: mockSequelize
}));

export const resetMocks = () => {
  // Reset model mocks and restore default implementations
  const idFieldMap = {
    User: 'user_id',
    Book: 'book_id',
    Order: 'order_id',
    Cart: 'cart_id'
  };

  Object.entries(mockModels).forEach(([name, model]) => {
    // reset any previous mock state
    Object.values(model).forEach(fn => {
      if (typeof fn === 'function' && fn.mockReset) fn.mockReset();
    });

    const idField = idFieldMap[name] || 'id';
    // restore sensible defaults
    if (model.findByPk && model.findByPk.mockImplementation === undefined) {
      // create a default implementation
      model.findByPk = vi.fn().mockImplementation((id) =>
        createMockInstance(id, { [idField]: id, name: `Test ${name}` })
      );
    } else if (model.findByPk) {
      model.findByPk.mockImplementation((id) =>
        createMockInstance(id, { [idField]: id, name: `Test ${name}` })
      );
    }

    // default destroy/restore/update behaviors
    if (model.destroy && model.destroy.mockResolvedValue === undefined) {
      model.destroy = vi.fn().mockResolvedValue(1);
    } else if (model.destroy) {
      model.destroy.mockResolvedValue(1);
    }

    if (model.restore && model.restore.mockResolvedValue === undefined) {
      model.restore = vi.fn().mockResolvedValue([1]);
    } else if (model.restore) {
      model.restore.mockResolvedValue([1]);
    }

    if (model.update && model.update.mockResolvedValue === undefined) {
      model.update = vi.fn().mockResolvedValue([1]);
    } else if (model.update) {
      model.update.mockResolvedValue([1]);
    }
  });

  // Reset sequelize query mock
  mockSequelize.query.mockClear();

  // Reset Model mocks
  Object.values(mockSequelize.Model).forEach(fn => {
    if (typeof fn === 'function' && fn.mockReset) fn.mockReset();
  });
};