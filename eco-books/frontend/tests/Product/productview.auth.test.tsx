// frontend/tests/Product/productview.auth.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProductViewPage from "@/app/productview/page";

// ---------- Mocks comunes ----------

// CSS module
vi.mock("@/app/productview/productview.module.css", () => ({
    default: new Proxy({}, { get: (_t, k) => String(k) }),
}));

// next/image -> <img> (sin props booleanas)
vi.mock("next/image", () => ({
    default: (
        props: React.ImgHTMLAttributes<HTMLImageElement> & {
            fill?: boolean;
            priority?: boolean;
        }
    ) => {
        const { fill, priority, ...rest } = props;
        return React.createElement("img", rest);
    },
}));

// Header/Footer mínimos
vi.mock("@/app/components/Header", () => ({ default: () => <div /> }));
vi.mock("@/app/components/Footer", () => ({ default: () => <div /> }));

// Router + ?id=1
const push = vi.fn((path: string) => {});
vi.mock("next/navigation", () => ({
    useRouter: () => ({ push }),
    useSearchParams: () => ({ get: (k: string) => (k === "id" ? "1" : null) }),
}));

// fetch simulado del libro
const mockBook = {
    book_id: 1,
    name: "Libro de Prueba",
    description: "Descripción",
    purchase_price: 120,
    author_id: 1,
    category_id: 1,
};

// espías locales para window.location
let setHrefSpy = vi.fn((v: string) => {});
let assignSpy = vi.fn((v: string) => {});

beforeEach(() => {
    // mock fetch (sin @ts-expect-error y sin any)
    const mockFetch: typeof fetch = vi.fn(async () => {
        return new Response(JSON.stringify(mockBook), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    });
    Object.defineProperty(globalThis, "fetch", {
        value: mockFetch,
        writable: true,
    });

    // reset de mocks
    push.mockReset();
    setHrefSpy = vi.fn((v: string) => {});
    assignSpy = vi.fn((v: string) => {});
    localStorage.clear();

    // sobrescribimos window.location para espiar navegación
    Object.defineProperty(window, "location", {
        value: {
            ...window.location,
            assign: assignSpy,
            get href() {
                return "http://localhost/";
            },
            set href(v: string) {
                setHrefSpy(v);
            },
        },
        writable: true,
    });
});

// helper: ¿se navegó a `path`?
function didNavigateTo(path: string): boolean {
    const pushed = push.mock.calls.some((args: [unknown]) =>
        String(args[0]).includes(path)
    );
    const hrefed = setHrefSpy.mock.calls.some((args: [unknown]) =>
        String(args[0]).includes(path)
    );
    const assigned = assignSpy.mock.calls.some((args: [unknown]) =>
        String(args[0]).includes(path)
    );
    return pushed || hrefed || assigned;
}

// ---------- Tests ----------
describe("ProductViewPage - políticas de navegación del botón 'Pedir Ahora'", () => {
    it("NO navega a otra página si el usuario NO está loggeado", async () => {
        render(<ProductViewPage />);

        await screen.findByRole("heading", { name: /libro de prueba/i });
        const btn = await screen.findByRole("button", { name: /pedir ahora/i });

        fireEvent.click(btn);

        await waitFor(() => {
            expect(didNavigateTo("/cart")).toBe(false);
            expect(didNavigateTo("/login")).toBe(false);
            expect(didNavigateTo("/singup")).toBe(false);
        });
    });

    it("SI está loggeado, navega a /cart", async () => {
        // cambia la clave si tu app usa otra (p. ej. "token" / "user")
        localStorage.setItem("authUser", JSON.stringify({ id: 1, name: "Susi" }));

        render(<ProductViewPage />);

        await screen.findByRole("heading", { name: /libro de prueba/i });
        const btn = await screen.findByRole("button", { name: /pedir ahora/i });

        fireEvent.click(btn);

        await waitFor(() => {
            expect(didNavigateTo("/cart")).toBe(true);
        });
    });
});
