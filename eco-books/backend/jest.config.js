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
  collectCoverageFrom: [
    'src/modules/route/**/*.js',
    'src/app.js'
  ],
  coverageDirectory: 'coverage-routes',
  coverageReporters: ['text', 'lcov'],
  verbose: true
};
