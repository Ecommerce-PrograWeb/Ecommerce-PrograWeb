export default {
  test: {
    globals: true,
    environment: 'node',
    include: [
      'tests/**/*.test.js' // Solo incluir nuestros tests específicos
    ],
    exclude: [
      'tests/routes/**', // Excluir tests de rutas
      'node_modules/**'  // Excluir node_modules
    ],
    transformMode: { web: [/.*/] },
    coverage: {
      provider: 'v8',
      all: true,
      cleanOnRerun: true,
      reports: ['text', 'lcov'],
      include: [
        'src/core/errors/**/*.js',
        'src/modules/service/**/*.js'
      ],
      exclude: [
        'src/app.js',
        'src/index.js',
        'src/server.js',
        'src/config/**',
        'migrations/**',
        'src/modules/model/**',
        'src/modules/controller/**',
        'src/modules/route/**',
        '**/sequelize-cli-config.js'
      ],
      thresholds: { lines: 95, functions: 95, branches: 95, statements: 95 }
    }
  }
};
