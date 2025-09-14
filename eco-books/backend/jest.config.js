export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testMatch: [
    '**/tests/routes/**/*.test.js'
  ],
  testTimeout: 10000,
  moduleFileExtensions: ['js'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup/jest.setup.js'],
  collectCoverage: true,
  coverageProvider: 'v8',
  collectCoverageFrom: [
    'src/modules/route/**/*.js',
    'src/app.js'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/src/modules/controller/',
    '<rootDir>/src/modules/service/',
    '<rootDir>/src/modules/model/',
    '<rootDir>/src/core/',
    '<rootDir>/src/index.js',
    '<rootDir>/src/server.js',
  ],
  coverageDirectory: 'coverage-routes',
  coverageReporters: ['text', 'lcov'],
  verbose: true
};
