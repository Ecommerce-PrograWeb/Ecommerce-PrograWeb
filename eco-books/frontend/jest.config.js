module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
    testMatch: ['**/tests/**/*.test.(js|jsx|ts|tsx)'],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', 'app/**/*.{js,jsx,ts,tsx}'],
    coverageDirectory: 'coverage',

    moduleNameMapper: {
        '\\.module\\.css$': 'identity-obj-proxy',
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    },
};
