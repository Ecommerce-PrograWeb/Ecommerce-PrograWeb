import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductViewPage from '../../src/app/productview/page';

// Mock next/navigation (no afirmamos sobre router.push porque page.tsx usa location.href)
jest.mock('next/navigation', () => ({
    __esModule: true,
    useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
    useSearchParams: () => ({ get: (k) => (k === 'id' ? '1' : null) }),
}));

const mockBook = {
    book_id: 1,
    name: 'Libro de Prueba',
    description: 'Descripción del libro de prueba',
    purchase_price: 120,
    author_id: 1,
    category_id: 1,
};

beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    window.history.pushState({}, '', 'http://localhost/productview?id=1');

    global.fetch = jest.fn(async () => ({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => mockBook,
    }));
});

// helper: lee el carrito
function readCart() {
    const raw = localStorage.getItem('cart');
    return raw ? JSON.parse(raw) : [];
}

describe("ProductViewPage - Navegación del botón 'Pedir Ahora' (sin tocar page.tsx ni window.location)", () => {
    test('sin sesión → intenta navegar (jsdom lo reporta) y agrega al carrito', async () => {
        const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        render(<ProductViewPage />);
        const user = userEvent.setup();
        const btn = await screen.findByRole('button', { name: /pedir ahora/i });
        await user.click(btn);

        // Se agrega al carrito
        await waitFor(() => {
            const cart = readCart();
            expect(cart.length).toBe(1);
            expect(cart[0].book_id).toBe(1);
            expect(cart[0].quantity).toBe(1);
        });

        // JSDOM reporta intento de navegación por cambiar location.href
        await waitFor(() => {
            const calls = errSpy.mock.calls.map((c) => String(c[0] ?? ''));
            expect(calls.some((m) => m.includes('Not implemented: navigation'))).toBe(true);
        });

        errSpy.mockRestore();
    });

    test('con sesión → intenta navegar (jsdom lo reporta) y agrega al carrito', async () => {
        const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        localStorage.setItem('auth_token', 'demo');

        render(<ProductViewPage />);
        const user = userEvent.setup();
        const btn = await screen.findByRole('button', { name: /pedir ahora/i });
        await user.click(btn);

        await waitFor(() => {
            const cart = readCart();
            expect(cart.length).toBe(1);
            expect(cart[0].book_id).toBe(1);
            expect(cart[0].quantity).toBe(1);
        });

        await waitFor(() => {
            const calls = errSpy.mock.calls.map((c) => String(c[0] ?? ''));
            expect(calls.some((m) => m.includes('Not implemented: navigation'))).toBe(true);
        });

        errSpy.mockRestore();
    });
});
