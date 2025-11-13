export default {
  test: {
    globals: true,
    environment: 'node',
    include: [
      'tests/**/*.test.js' // Only include our specific tests
    ],
    exclude: [
      'tests/routes/**', // Exclude route tests
      'node_modules/**'  // Exclude node_modules
    ],
    transformMode: { web: [/.*/] },
    coverage: {
      provider: 'v8',
      all: true,
      cleanOnRerun: true,
      reports: ['text', 'lcov'],
      include: [
        'src/core/errors/**/*.js',
        'src/modules/service/**/*.js',
        'src/modules/controller/**/*.js', 
      ],
      exclude: [
        'src/app.js',
        'src/index.js',
        'src/server.js',
        'src/config/**',
        'migrations/**',
        'src/modules/model/**',
        'src/modules/route/**',
        '**/sequelize-cli-config.*',
      ],
      thresholds: { lines: 95, functions: 95, branches: 95, statements: 95 }
    }
  }
};


