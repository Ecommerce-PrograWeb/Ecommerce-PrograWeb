/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
    transform: {
        // usa babel-jest con configuración inline
        '^.+\\.(ts|tsx|js|jsx)$': ['babel-jest', {
            presets: [
                ['@babel/preset-env', { targets: { node: 'current' } }],
                ['@babel/preset-react', { runtime: 'automatic' }],
                '@babel/preset-typescript',
            ],
        }],
    },
    moduleNameMapper: {
        '\\.(css|scss|sass)$': '<rootDir>/tests/__mocks__/styleMock.js',
        '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/tests/__mocks__/fileMock.js',
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    testMatch: ['**/tests/**/*.(test|spec).(ts|tsx|js|jsx)'],
    collectCoverageFrom: ['src/**/*.(ts|tsx|js|jsx)'],
    coverageReporters: ['text', 'lcov'],
    verbose: true,
};
