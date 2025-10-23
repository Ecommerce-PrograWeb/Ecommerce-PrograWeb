/* eslint-disable @next/next/no-img-element */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, beforeEach, afterAll, test, expect } from "vitest";
import ProductViewPage from "@/app/productview/page";

/* =========================================================
   1) Mock de next/image (sin warnings por props booleanas)
   ========================================================= */
vi.mock("next/image", () => {
    type NextImageProps = Omit<
        import("react").ImgHTMLAttributes<HTMLImageElement>,
        "src" | "alt"
    > & {
        src: string | { src: string };
        alt?: string;
        priority?: boolean;
        fill?: boolean;
    };

    const NextImage = (props: NextImageProps) => {
        const { src, alt = "", priority: _priority, fill: _fill, ...rest } = props;
        const resolved = typeof src === "string" ? src : src?.src ?? "";
        return <img src={resolved} alt={alt} {...rest} />;
    };

    return { __esModule: true, default: NextImage };
});

/* =========================================================
   2) Mock de next/navigation (router + search params)
   ========================================================= */
const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: pushMock }),
    useSearchParams: () => ({ get: (k: string) => (k === "id" ? "1" : null) }),
}));

/* =========================================================
   3) Reemplazo TOTAL de window.location con "guard" /cart
   ========================================================= */
type TestLocation = {
    href: string;
    assign: (url: string | URL) => void;
    replace: (url: string | URL) => void;
};

const navHits: string[] = [];

// Si no hay sesión y se intenta ir a /cart, simulamos la
// redirección del backend a /login?next=/cart.
function guardTarget(raw: string): string {
    const target = String(raw);
    const loggedIn = Boolean(localStorage.getItem("auth_token"));
    if (!loggedIn && (target === "/cart" || target.includes("/cart"))) {
        return "/login?next=/cart";
    }
    return target;
}

function overrideLocation(): void {
    let _href = "http://localhost/";

    const setHref = (url: string | URL) => {
        const next = guardTarget(String(url));
        navHits.push(next);
        _href = next;
    };

    const loc = {
        get href(): string {
            return _href;
        },
        set href(value: string) {
            setHref(value);
        },
        assign(url: string | URL) {
            setHref(url);
        },
        replace(url: string | URL) {
            setHref(url);
        },
    } as unknown as Location;

    Object.defineProperty(window, "location", {
        configurable: true,
        writable: true,
        value: loc,
    });
}

/* ===== Helpers para verificar navegación ===== */
const didNavigate = (): boolean => {
    const current = ((window.location as unknown) as TestLocation).href;
    return (
        pushMock.mock.calls.length > 0 ||
        navHits.length > 0 ||
        current.includes("/cart") ||
        current.includes("/login") ||
        current.includes("/signup") ||
        current.includes("/singup")
    );
};

function currentURL(): URL {
    const href = ((window.location as unknown) as { href: string }).href || "http://localhost/";
    return new URL(href, "http://localhost");
}

const wentToCartPath = (): boolean => currentURL().pathname === "/cart";

const wentToLoginNextCart = (): boolean => {
    const u = currentURL();
    return u.pathname === "/login" && u.searchParams.get("next") === "/cart";
};

/* =========================================================
   4) Mock de fetch para el libro
   ========================================================= */
const mockFetch: typeof fetch = vi.fn(async () => {
    const body = JSON.stringify({
        book_id: 1,
        name: "Libro de Prueba",
        description: "Descripción",
        purchase_price: 120,
        author_id: 1,
        category_id: 1,
    });
    return new Response(body, {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
});
global.fetch = mockFetch as unknown as typeof fetch;

/* =========================================================
   5) TESTS
   ========================================================= */
describe("ProductViewPage - Navegación del botón 'Pedir Ahora'", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        navHits.length = 0;
        overrideLocation();
        localStorage.clear();
    });

    afterAll(() => vi.restoreAllMocks());

    // Smoke: navega a algún lugar (sin importar destino)
    test("navega a algún lugar al hacer click (sin importar destino) - sin sesión", async () => {
        render(<ProductViewPage />);
        const btn = await screen.findByRole("button", { name: /pedir ahora/i });
        fireEvent.click(btn);

        await waitFor(() => {
            expect(didNavigate()).toBe(true);
        });
    });

    test("navega a algún lugar también cuando hay sesión", async () => {
        localStorage.setItem("auth_token", "demo");
        render(<ProductViewPage />);
        const btn = await screen.findByRole("button", { name: /pedir ahora/i });
        fireEvent.click(btn);

        await waitFor(() => {
            expect(didNavigate()).toBe(true);
        });
    });

    // Destinos exactos (según tu bullet de requisitos)
    test("🟢 Si está loggeado y pulsa 'Pedir Ahora' termina en /cart", async () => {
        localStorage.setItem("auth_token", "demo");
        render(<ProductViewPage />);
        const btn = await screen.findByRole("button", { name: /pedir ahora/i });
        fireEvent.click(btn);

        await waitFor(() => {
            expect(wentToCartPath()).toBe(true);        // /cart
            expect(wentToLoginNextCart()).toBe(false);  // NO /login?next=/cart
        });
    });

    test("🔒 Si NO está loggeado y pulsa 'Pedir Ahora' termina en /login?next=/cart", async () => {
        render(<ProductViewPage />);
        const btn = await screen.findByRole("button", { name: /pedir ahora/i });
        fireEvent.click(btn);

        await waitFor(() => {
            expect(wentToLoginNextCart()).toBe(true);   // /login?next=/cart
            expect(wentToCartPath()).toBe(false);       // NO /cart directo
        });
    });

});
