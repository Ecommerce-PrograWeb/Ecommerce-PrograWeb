// eco-books/frontend/jest.config.js
module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
    testMatch: ['**/tests/**/*.test.(js|jsx|ts|tsx)'],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
    coverageDirectory: 'coverage',
};
