// mock del CSS module exacto que importa la page
vi.mock("@/app/productview/productview.module.css", () => ({
    default: new Proxy({}, { get: (_t, key) => String(key) }),
}));


import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProductViewPage from "@/app/productview/page";

// Mock Next/Image tipado (evita `any`)
vi.mock("next/image", () => {
    const Img: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) =>
        React.createElement("img", props);
    return { default: Img };
});

// Header/Footer mínimos
vi.mock("@/app/components/Header", () => ({ default: () => <div /> }));
vi.mock("@/app/components/Footer", () => ({ default: () => <div /> }));

// Mock useSearchParams (?id=1)
vi.mock("next/navigation", async (orig) => {
    const actual: any = await (orig as any)();
    return {
        ...actual,
        useSearchParams: () => ({ get: (k: string) => (k === "id" ? "1" : null) })
    };
});

const mockBook = {
    book_id: 1,
    name: "Libro de Prueba",
    description: "Descripción",
    purchase_price: 120,
    author_id: 1,
    category_id: 1
};

beforeEach(() => {
    vi.stubGlobal(
        "fetch",
        vi.fn(async () => ({ ok: true, json: async () => mockBook }) as Response)
    );
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
