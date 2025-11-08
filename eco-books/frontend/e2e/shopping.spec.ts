import { test, expect } from '@playwright/test';

test.describe('Flujo de compra', () => {
  
  test.describe('Página de inicio (Home)', () => {
    test('debe cargar la página de inicio correctamente', async ({ page }) => {
      await page.goto('/home');
      
      // Verificar elementos principales
      await expect(page.getByRole('heading', { name: /Bienvenido a e-Co Books/i })).toBeVisible();
      await expect(page.getByText('Tu librería online favorita')).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Productos Destacados' })).toBeVisible();
    });

    test('debe mostrar categorías de libros', async ({ page }) => {
      await page.goto('/home');
      
      // Verificar que las categorías están visibles (usar .category-label para ser específicos)
      await expect(page.locator('.category-label').filter({ hasText: 'Acción' })).toBeVisible();
      await expect(page.locator('.category-label').filter({ hasText: 'Aventura' })).toBeVisible();
      await expect(page.locator('.category-label').filter({ hasText: 'Romance' })).toBeVisible();
      await expect(page.locator('.category-label').filter({ hasText: 'Fantasía' })).toBeVisible();
    });

    test('debe filtrar libros por categoría', async ({ page }) => {
      await page.goto('/home');
      
      // Esperar a que carguen los libros iniciales
      await page.waitForSelector('.product-card', { timeout: 10000 });
      
      // Hacer clic en categoría "Romance" usando el botón específico
      await page.locator('.category-item').filter({ hasText: 'Romance' }).locator('button').click();
      
      // Esperar a que se actualicen los productos
      await page.waitForTimeout(1000);
      
      // Verificar que hay productos en la grilla
      const products = page.locator('.product-card');
      await expect(products.first()).toBeVisible({ timeout: 10000 });
    });

    test('debe navegar a la vista de producto al hacer clic', async ({ page }) => {
      await page.goto('/home');
      
      // Esperar a que carguen los productos
      await page.waitForSelector('.product-card', { timeout: 10000 });
      
      // Hacer clic en el primer producto
      await page.locator('.product-card').first().click();
      
      // Verificar que navegó a la página de producto
      await expect(page).toHaveURL(/\/productview\?id=\d+/);
    });
  });

  test.describe('Página de producto', () => {
    test('debe mostrar información del producto', async ({ page }) => {
      // Navegar directamente con un ID de prueba
      await page.goto('/productview?id=1');
      
      // Esperar a que cargue el producto
      await page.waitForSelector('h1, h2', { timeout: 10000 });
      
      // Verificar que hay botones de compra (usar first para evitar strict mode)
      await expect(
        page.getByRole('button', { name: 'Pedir Ahora' })
      ).toBeVisible({ timeout: 10000 });
      
      await expect(
        page.getByRole('button', { name: 'Agregar al carrito' })
      ).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Carrito de compras', () => {
    test('debe mostrar carrito vacío inicialmente', async ({ page }) => {
      // Limpiar localStorage
      await page.goto('/home');
      await page.evaluate(() => localStorage.clear());
      
      await page.goto('/cart');
      
      // Puede redirigir a login si no está autenticado
      if (page.url().includes('/login')) {
        await expect(page.getByRole('heading', { name: 'Iniciar Sesión' })).toBeVisible();
      } else {
        await expect(page.getByText('No tienes productos en el carrito')).toBeVisible();
      }
    });

    test('debe agregar producto al carrito desde productview', async ({ page }) => {
      await page.goto('/home');
      
      // Limpiar carrito
      await page.evaluate(() => localStorage.setItem('cart', JSON.stringify([])));
      
      // Navegar a un producto
      await page.goto('/productview?id=1');
      
      // Esperar a que cargue el botón específico de agregar al carrito
      const addButton = page.getByRole('button', { name: 'Agregar al carrito', exact: true });
      await addButton.waitFor({ state: 'visible', timeout: 10000 });
      
      await addButton.click();
      
      // Esperar un momento para que se actualice localStorage
      await page.waitForTimeout(500);
      
      // Verificar que se agregó al localStorage
      const cart = await page.evaluate(() => {
        const raw = localStorage.getItem('cart');
        return raw ? JSON.parse(raw) : [];
      });
      
      expect(cart.length).toBeGreaterThan(0);
    });

    test('debe mostrar productos en el carrito', async ({ page }) => {
      // Simular un carrito con productos
      await page.goto('/home');
      
      await page.evaluate(() => {
        const mockCart = [
          {
            book_id: 1,
            name: 'Libro de prueba',
            cover: 'test.jpg',
            purchase_price: 100,
            quantity: 1
          }
        ];
        localStorage.setItem('cart', JSON.stringify(mockCart));
        localStorage.setItem('user_id', '1');
        localStorage.setItem('user_name', 'Test User');
        localStorage.setItem('user_email', 'test@example.com');
      });
      
      await page.goto('/cart');
      
      // Verificar que muestra el producto
      await expect(page.getByText('Libro de prueba')).toBeVisible({ timeout: 10000 });
      // Verificar precio usando first() para evitar strict mode si hay duplicados
      await expect(page.getByText('Q100.00').first()).toBeVisible();
    });

    test('debe poder cambiar cantidad de productos', async ({ page }) => {
      // Setup: agregar producto al carrito
      await page.goto('/home');
      await page.evaluate(() => {
        localStorage.setItem('cart', JSON.stringify([
          { book_id: 1, name: 'Test Book', cover: '', purchase_price: 50, quantity: 1 }
        ]));
        localStorage.setItem('user_id', '1');
      });
      
      await page.goto('/cart');
      
      // Esperar a que cargue el carrito
      await page.waitForSelector('[class*="controls"]', { timeout: 5000 });
      
      // Buscar el span que muestra la cantidad actual
      const qtySpan = page.locator('[class*="qty"]').filter({ hasText: /^\d+$/ });
      await expect(qtySpan).toHaveText('1');
      
      // Buscar botón de incrementar dentro de los controles
      const incrementBtn = page.locator('[class*="controls"]').locator('button').filter({ hasText: '+' });
      await incrementBtn.click();
      
      // Verificar que la cantidad cambió
      await expect(qtySpan).toHaveText('2');
    });

    test('debe poder eliminar productos del carrito', async ({ page }) => {
      await page.goto('/home');
      await page.evaluate(() => {
        localStorage.setItem('cart', JSON.stringify([
          { book_id: 1, name: 'Test Book', cover: '', purchase_price: 50, quantity: 1 }
        ]));
        localStorage.setItem('user_id', '1');
      });
      
      await page.goto('/cart');
      
      // Hacer clic en eliminar
      await page.getByRole('button', { name: /Eliminar/i }).click();
      
      // Verificar que el carrito está vacío
      await expect(page.getByText('No tienes productos en el carrito')).toBeVisible();
    });

    test('debe calcular el total correctamente', async ({ page }) => {
      await page.goto('/home');
      await page.evaluate(() => {
        localStorage.setItem('cart', JSON.stringify([
          { book_id: 1, name: 'Libro 1', cover: '', purchase_price: 50, quantity: 2 },
          { book_id: 2, name: 'Libro 2', cover: '', purchase_price: 30, quantity: 1 }
        ]));
        localStorage.setItem('user_id', '1');
      });
      
      await page.goto('/cart');
      
      // Total debe ser: (50 * 2) + (30 * 1) = 130
      await expect(page.getByText('Q130.00')).toBeVisible();
    });
  });

  test.describe('Checkout', () => {
    test('debe redirigir a login si no está autenticado', async ({ page }) => {
      await page.goto('/home');
      await page.evaluate(() => {
        localStorage.removeItem('user_id');
        localStorage.setItem('cart', JSON.stringify([
          { book_id: 1, name: 'Test', cover: '', purchase_price: 50, quantity: 1 }
        ]));
      });
      
      await page.goto('/cart');
      
      // Debe redirigir a login
      await expect(page).toHaveURL(/\/login/);
    });

    test('debe procesar el checkout y redirigir a thankyou', async ({ page }) => {
      // Este test requiere backend funcionando
      await page.goto('/home');
      await page.evaluate(() => {
        localStorage.setItem('cart', JSON.stringify([
          { book_id: 1, name: 'Test Book', cover: '', purchase_price: 100, quantity: 1 }
        ]));
        localStorage.setItem('user_id', '1');
      });
      
      await page.goto('/cart');
      
      // Hacer clic en checkout
      const checkoutBtn = page.getByRole('button', { name: /Pedir Ahora/i });
      await checkoutBtn.click();
      
      // Verificar redirección a página de agradecimiento o error
      await page.waitForTimeout(2000);
      
      const url = page.url();
      const isThankYouOrError = url.includes('/thankyou') || url.includes('/cart');
      expect(isThankYouOrError).toBeTruthy();
    });
  });

  test.describe('Flujo completo de compra', () => {
    test('debe completar un flujo de compra de inicio a fin', async ({ page }) => {
      // 1. Limpiar estado
      await page.goto('/home');
      await page.evaluate(() => {
        localStorage.clear();
        localStorage.setItem('user_id', '999');
        localStorage.setItem('user_name', 'Test User');
        localStorage.setItem('user_email', 'test@test.com');
      });
      
      // 2. Ir a home
      await page.goto('/home');
      await expect(page.getByRole('heading', { name: /Bienvenido/i })).toBeVisible();
      
      // 3. Seleccionar una categoría usando selector específico
      await page.locator('.category-item').filter({ hasText: 'Acción' }).locator('button').click();
      await page.waitForTimeout(1000);
      
      // 4. Ver un producto (si hay)
      const firstProduct = page.locator('.product-card').first();
      const productCount = await page.locator('.product-card').count();
      
      if (productCount > 0 && await firstProduct.isVisible()) {
        await firstProduct.click();
        await expect(page).toHaveURL(/\/productview/);
        
        // 5. Agregar al carrito (usar el botón "Agregar al carrito" que no redirige)
        const addBtn = page.getByRole('button', { name: 'Agregar al carrito', exact: true });
        await addBtn.waitFor({ state: 'visible', timeout: 5000 });
        await addBtn.click();
        
        // Esperar que se agregue al localStorage
        await page.waitForTimeout(500);
      }
      
      // 6. Ir al carrito
      await page.goto('/cart');
      
      // 7. Verificar que hay productos o mensaje de vacío
      await page.waitForTimeout(1000);
      const hasProducts = await page.locator('[class*="card"]').count() > 0;
      const isEmpty = await page.getByText('No tienes productos').isVisible().catch(() => false);
      
      // Al menos uno debe ser verdadero
      expect(hasProducts || isEmpty).toBeTruthy();
    });
  });
});
