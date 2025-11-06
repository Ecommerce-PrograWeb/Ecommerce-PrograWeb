// tests/Product/productview.auth.test.js
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProductViewPage from "@/app/productview/page";

// Mock de next/navigation (lo dejamos estable; no verificamos push, miramos location.href)
jest.mock("next/navigation", () => ({
    __esModule: true,
    useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
    useSearchParams: () => ({ get: (k) => (k === "id" ? "1" : null) }),
}));

// Mock de fetch SIN usar Response (JSDOM no la expone por defecto)
const mockBook = {
    book_id: 1,
    name: "Libro de Prueba",
    description: "Descripción del libro de prueba",
    purchase_price: 120,
    author_id: 1,
    category_id: 1,
};

beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    // ubicamos la URL base antes de cada prueba
    window.location.href = "http://localhost/productview?id=1";

    global.fetch = jest.fn(async () => {
        return {
            ok: true,
            status: 200,
            headers: { get: () => "application/json" },
            json: async () => mockBook,
        };
    });
});

describe("ProductViewPage - Navegación del botón 'Pedir Ahora'", () => {
    test("navega (cambia window.location) sin sesión", async () => {
        render(<ProductViewPage />);
        const btn = await screen.findByRole("button", { name: /pedir ahora/i });
        fireEvent.click(btn);

        await waitFor(() => {
            // sin sesión debe redirigir a login (pero aquí solo comprobamos que cambió)
            expect(window.location.href).not.toBe("http://localhost/productview?id=1");
        });
    });

    test("navega (cambia window.location) con sesión", async () => {
        localStorage.setItem("auth_token", "demo");
        render(<ProductViewPage />);
        const btn = await screen.findByRole("button", { name: /pedir ahora/i });
        fireEvent.click(btn);

        await waitFor(() => {
            expect(window.location.href).not.toBe("http://localhost/productview?id=1");
        });
    });

    test("🟢 Con sesión, debe ir a /cart", async () => {
        localStorage.setItem("auth_token", "demo");
        render(<ProductViewPage />);
        const btn = await screen.findByRole("button", { name: /pedir ahora/i });
        fireEvent.click(btn);

        await waitFor(() => {
            // jsdom resuelve rutas relativas respecto a la actual
            // si asignas "/cart", href termina como "http://localhost/cart"
            expect(window.location.href.endsWith("/cart")).toBe(true);
        });
    });

    test("🔒 Sin sesión, debe ir a /login?next=/cart", async () => {
        render(<ProductViewPage />);
        const btn = await screen.findByRole("button", { name: /pedir ahora/i });
        fireEvent.click(btn);

        await waitFor(() => {
            // si tu componente usa "/login?next=/cart" o una URL absoluta,
            // endsWith cubre ambos casos.
            expect(window.location.href.endsWith("/login?next=/cart")).toBe(true);
        });
    });
});