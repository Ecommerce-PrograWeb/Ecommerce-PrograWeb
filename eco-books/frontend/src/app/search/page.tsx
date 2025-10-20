// app/search/page.tsx
"use client";

import "./search.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";

type Book = { id: number; title: string; cover: string; price: number };

type CartItem = {
  book_id: number;
  name: string;
  cover?: string;
  purchase_price: number;
  quantity: number;
};

export default function SearchPage() {
  const router = useRouter();

  const books: Book[] = [
    { id: 1, title: "Bajo la misma estrella", cover: "bajo-la-misma-estrella.jpg", price: 110 },
    { id: 2, title: "El Código Da Vinci", cover: "da-vinci-code.jpg", price: 130 },
    { id: 3, title: "Default Cover", cover: "default-cover.jpg", price: 99 },
    { id: 4, title: "El Alquimista", cover: "el-alquimista.jpg", price: 120 },
    { id: 5, title: "Game of Thrones", cover: "game-of-thrones.jpg", price: 180 },
    { id: 6, title: "Harry Potter 1", cover: "harry-potter-1.jpg", price: 150 },
    { id: 7, title: "Onyx Storm", cover: "Onyx Storm.jpg", price: 125 },
    { id: 8, title: "Sunrise on the Reaping", cover: "Sunrise on the Reaping.jpg", price: 115 },
    { id: 9, title: "The Let Them Theory", cover: "The Let Them Theory.jpg", price: 105 },
  ];

  const [selected, setSelected] = useState<Set<number>>(new Set());

  const toggle = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const clear = () => setSelected(new Set());

  const addToCart = () => {
    if (selected.size === 0) return;

    const selectedBooks = books.filter((b) => selected.has(b.id));

    let current: CartItem[] = [];
    try {
      const raw = localStorage.getItem("cart");
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) current = parsed;
      }
    } catch {}

    for (const b of selectedBooks) {
      const idx = current.findIndex((x: CartItem) => x.book_id === b.id);
      if (idx >= 0) {
        current[idx].quantity = Number(current[idx].quantity || 0) + 1;
      } else {
        current.push({
          book_id: b.id,
          name: b.title,
          cover: b.cover,
          purchase_price: b.price,
          quantity: 1,
        });
      }
    }

    localStorage.setItem("cart", JSON.stringify(current));
    setSelected(new Set());
    router.push("/cart");
  };

  return (
    <>
      <Header />
      <main className="srch">
        <section className="srch-head">
          <h1 className="srch-title">Nuestra Galería</h1>
          <p className="srch-sub">Explora algunos de nuestros libros seleccionados para ti.</p>
          <div className="srch-toolbar">
            <span className="srch-count">
              {selected.size} seleccionados
            </span>
            <button className="srch-action" onClick={clear} disabled={selected.size === 0}>
              Limpiar
            </button>
            <button
              className="srch-action srch-action--primary"
              onClick={addToCart}
              disabled={selected.size === 0}
            >
              Añadir al carrito
            </button>
          </div>
        </section>

        <section className="srch-grid" role="list">
          {books.map((b) => {
            const isSel = selected.has(b.id);
            const src = `/Images/BookCovers/${encodeURI(b.cover)}`;
              return (
              <button
                key={b.id}
                className={`srch-card ${isSel ? "is-selected" : ""}`}
                onClick={() => toggle(b.id)}
                aria-selected={isSel}
                role="listitem"
                title={b.title}
              >
                <img src={src} alt={b.title} className="srch-img" />
                <span className="srch-check" aria-hidden>✓</span>
              </button>
            );
          })}
        </section>
      </main>
      <Footer />
    </>
  );
}
