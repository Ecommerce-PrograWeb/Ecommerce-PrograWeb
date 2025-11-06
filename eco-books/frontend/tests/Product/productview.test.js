// tests/Product/productview.test.js
import { render, screen } from "@testing-library/react";
import ProductViewPage from "@/app/productview/page";

// Mock limpio de next/navigation (no usamos push aquí)
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

    global.fetch = jest.fn(async () => {
        return {
            ok: true,
            status: 200,
            headers: { get: () => "application/json" },
            json: async () => mockBook,
        };
    });
});

describe("ProductViewPage - elementos básicos", () => {
    it("muestra el título del libro", async () => {
        render(<ProductViewPage />);
        const title = await screen.findByRole("heading", { name: /libro de prueba/i });
        expect(title).toBeInTheDocument();
    });

    it("muestra el botón 'Pedir Ahora'", async () => {
        render(<ProductViewPage />);
        const button = await screen.findByRole("button", { name: /pedir ahora/i });
        expect(button).toBeInTheDocument();
    });
});