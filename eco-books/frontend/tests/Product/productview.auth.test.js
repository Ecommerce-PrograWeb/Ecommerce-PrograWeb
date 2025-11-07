// tests/Product/productview.auth.test.js
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductViewPage from '../../src/app/productview/page';

// --------------------
// Mock next/navigation
// --------------------
const pushMock = jest.fn();

jest.mock('next/navigation', () => ({
    __esModule: true,
    useRouter: () => ({
        push: pushMock,
        replace: jest.fn(),
        back: jest.fn(),
    }),
    useSearchParams: () => ({
        get: (k) => (k === 'id' ? '1' : null),
    }),
}));

// --------------------
// Mock fetch básico
// --------------------
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

    // Fija la URL inicial SIN tocar window.location (evita redefinir)
    window.history.pushState({}, '', 'http://localhost/productview?id=1');

    global.fetch = jest.fn(async () => ({
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => mockBook,
    }));
});

// Helper: considera navegación con router.push O con window.location.href
async function expectNavigatedTo(targetPath) {
    await waitFor(() => {
        const href = window.location.href;
        const wentByHref = href.endsWith(targetPath) || href.includes(targetPath);
        const wentByRouter = pushMock.mock.calls.some(
            (call) => call && call[0] === targetPath
        );
        expect(wentByHref || wentByRouter).toBe(true);
    });
}

describe("ProductViewPage - Navegación del botón 'Pedir Ahora'", () => {
    test('navega (cambia ubicación) sin sesión', async () => {
        render(<ProductViewPage />);
        const user = userEvent.setup();

        const btn = await screen.findByRole('button', { name: /pedir ahora/i });
        await user.click(btn);

        await waitFor(() => {
            expect(window.location.href).not.toBe(
                'http://localhost/productview?id=1'
            );
        });
    });

    test('navega (cambia ubicación) con sesión', async () => {
        localStorage.setItem('auth_token', 'demo');
        render(<ProductViewPage />);
        const user = userEvent.setup();

        const btn = await screen.findByRole('button', { name: /pedir ahora/i });
        await user.click(btn);

        await waitFor(() => {
            expect(window.location.href).not.toBe(
                'http://localhost/productview?id=1'
            );
        });
    });

    test('🟢 Con sesión, debe ir a /cart', async () => {
        localStorage.setItem('auth_token', 'demo');
        render(<ProductViewPage />);
        const user = userEvent.setup();

        const btn = await screen.findByRole('button', { name: /pedir ahora/i });
        await user.click(btn);

        await expectNavigatedTo('/cart');
    });

    test('🔒 Sin sesión, debe ir a /login?next=/cart', async () => {
        render(<ProductViewPage />);
        const user = userEvent.setup();

        const btn = await screen.findByRole('button', { name: /pedir ahora/i });
        await user.click(btn);

        await expectNavigatedTo('/login?next=/cart');
    });
});
