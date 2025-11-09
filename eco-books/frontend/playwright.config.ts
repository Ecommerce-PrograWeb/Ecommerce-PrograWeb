import { defineConfig, devices } from '@playwright/test';

/**
 * Configuración de Playwright para pruebas E2E
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  
  // Tiempo máximo por test
  timeout: 30 * 1000,
  
  // Configuración de expects
  expect: {
    timeout: 5000
  },

  // Ejecuta tests en paralelo
  fullyParallel: true,
  
  // Falla el build si dejaste test.only
  forbidOnly: !!process.env.CI,
  
  // Reintentos en CI
  retries: process.env.CI ? 2 : 0,
  
  // Workers (procesos paralelos)
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter
  reporter: 'html',

  // Configuración compartida
  use: {
    // URL base de tu aplicación
    // Si usas docker-compose, el frontend está en puerto 3001
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3001',
    
    // Captura screenshots en fallo
    screenshot: 'only-on-failure',
    
    // Captura video en fallo
    video: 'retain-on-failure',
    
    // Traza completa en fallo
    trace: 'on-first-retry',
  },

  // Proyectos (navegadores)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    // Descomenta para mobile testing
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
  ],

  // Servidor de desarrollo
  // Comentado porque usaremos docker-compose para levantar los servicios
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:3001',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120 * 1000,
  // },
});
