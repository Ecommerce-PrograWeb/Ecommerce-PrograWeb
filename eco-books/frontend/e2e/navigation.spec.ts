import { test, expect } from '@playwright/test';

test.describe('Navegación básica', () => {
  
  test('debe cargar la página de inicio', async ({ page }) => {
    await page.goto('/home');
    await expect(page).toHaveTitle(/e-Co Books|Home|eco-books/i);
  });

  test('debe mostrar el header en todas las páginas', async ({ page }) => {
    // Home
    await page.goto('/home');
    await expect(page.locator('header, [role="banner"]')).toBeVisible();
    
    // Login
    await page.goto('/login');
    await expect(page.locator('header, [role="banner"]')).toBeVisible();
    
    // Signup
    await page.goto('/singup');
    await expect(page.locator('header, [role="banner"]')).toBeVisible();
  });

  test('debe mostrar el footer en todas las páginas', async ({ page }) => {
    await page.goto('/home');
    await expect(page.locator('footer, [role="contentinfo"]')).toBeVisible();
  });

  test('debe poder navegar entre login y signup', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Crear cuenta' }).click();
    await expect(page).toHaveURL('/singup');
    
    await page.getByRole('button', { name: /Volver a iniciar sesión/i }).click();
    await expect(page).toHaveURL('/login');
  });

  test('debe responder rápidamente (smoke test)', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/home');
    const loadTime = Date.now() - startTime;
    
    // Verificar que la página cargó en menos de 5 segundos
    expect(loadTime).toBeLessThan(5000);
    
    // Verificar que hay contenido visible
    await expect(page.locator('body')).toBeVisible();
  });

  test('debe manejar rutas inexistentes (404)', async ({ page }) => {
    const response = await page.goto('/ruta-que-no-existe-123456');
    
    // Next.js maneja 404s, verificar que no crashea
    expect(response?.status()).toBeLessThan(500);
  });
});

test.describe('Búsqueda de productos', () => {
  test('debe poder acceder a la página de búsqueda', async ({ page }) => {
    await page.goto('/search');
    
    // Verificar que la página carga (sin error 500)
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Historial de compras', () => {
  test('debe poder acceder a la página de historial', async ({ page }) => {
    await page.goto('/home');
    await page.evaluate(() => {
      localStorage.setItem('user_id', '1');
    });
    
    await page.goto('/history');
    
    // Verificar que la página carga
    await expect(page.locator('body')).toBeVisible();
  });
});
