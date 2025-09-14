// Mock completo de Sequelize para tests de integración
const mockSequelize = {
  define: jest.fn(() => ({
    findAll: jest.fn().mockResolvedValue([]),
    findByPk: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue([1]),
    destroy: jest.fn().mockResolvedValue(1),
    hasMany: jest.fn(),
    belongsTo: jest.fn(),
  })),
  authenticate: jest.fn().mockResolvedValue(true),
  sync: jest.fn().mockResolvedValue(true),
  close: jest.fn().mockResolvedValue(true),
};

// Mock de la configuración de la base de datos
jest.mock('../../src/config/database.js', () => ({
  sequelize: mockSequelize,
  DataTypes: {
    INTEGER: 'INTEGER',
    STRING: 'STRING',
    DECIMAL: 'DECIMAL',
    ENUM: 'ENUM',
    DATE: 'DATE',
  },
}));

// Configuración de variables de entorno para tests
process.env.NODE_ENV = 'test';
process.env.DB_HOST = 'localhost';
process.env.DB_NAME = 'test_db';
process.env.DB_USER = 'test_user';
process.env.DB_PASSWORD = 'test_password';