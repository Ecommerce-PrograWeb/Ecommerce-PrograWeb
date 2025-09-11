export default {
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      all: true,
      cleanOnRerun: true,
      reports: ['text', 'lcov'],
      include: [
        'src/app.js',
        'src/index.js',
        'src/modules/route/**/*.js',
        'src/core/errors/**/*.js',
        'src/modules/service/**/*.js',
        'src/modules/controller/**'
      ],
      exclude: [
        'src/server.js',
        'src/config/**',
        'migrations/**',
        'src/modules/model/**',
        '**/sequelize-cli-config.js'
      ],
      thresholds: { lines: 95, functions: 95, branches: 95, statements: 95 }
    }
  }
};
