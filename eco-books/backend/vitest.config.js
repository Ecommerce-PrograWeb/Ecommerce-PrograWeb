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
        'src/modules/service/**/*.js'
      ],
      exclude: [
        'src/server.js',
        'src/config/**',
        'migrations/**',
        'src/modules/model/**',
        'src/modules/controller/**',
        '**/sequelize-cli-config.js'
      ],
      thresholds: { lines: 80, functions: 80, branches: 70, statements: 80 }
    }
  }
};
