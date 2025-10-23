// tests/Product/productview.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProductViewPage from "@/app/productview/page";

// Mock del CSS module exacto que importa la page
vi.mock("@/app/productview/productview.module.css", () => ({
    default: new Proxy({}, { get: (_t, key) => String(key) }),
}));

// Mock Next/Image tipado (componente <img> plano)
vi.mock("next/image", () => ({
    default: (props: React.ImgHTMLAttributes<HTMLImageElement>) =>
        React.createElement("img", props),
}));


// Header/Footer mínimos
vi.mock("@/app/components/Header", () => ({ default: () => <div /> }));
vi.mock("@/app/components/Footer", () => ({ default: () => <div /> }));

// Mock next/navigation SIN "any"
vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
    useSearchParams: () => ({
        get: (k: string) => (k === "id" ? "1" : null),
    }),
}));

const mockBook = {
    book_id: 1,
    name: "Libro de Prueba",
    description: "Descripción",
    purchase_price: 120,
    author_id: 1,
    category_id: 1,
};


beforeEach(() => {
    const mockFetch: typeof fetch = vi.fn(async () => {
        return new Response(JSON.stringify(mockBook), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    });

    globalThis.fetch = mockFetch;
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
