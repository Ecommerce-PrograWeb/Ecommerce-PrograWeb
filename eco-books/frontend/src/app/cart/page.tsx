"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "./cart.module.css";
import Image from "next/image";
import { getApiBase, jsonFetch } from "../lib/api";

interface CartItem {
  book_id: number;
  name: string;
  cover?: string;
  purchase_price: number;
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const hasUser = !!localStorage.getItem("user_id");
    setIsLoggedIn(hasUser);
    if (!hasUser) router.push("/login?next=/cart");
  }, [router]);


  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      setItems([]);
    }
    setIsLoaded(true);
  }, []);


  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("cart", JSON.stringify(items));
      } catch {}
    }
  }, [items, isLoaded]);

  const changeQty = (book_id: number, delta: number) => {
    setItems(prev =>
      prev.map(i =>
        i.book_id === book_id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
      )
    );
  };

  const removeItem = (book_id: number) => {
    setItems(prev => prev.filter(i => i.book_id !== book_id));
  };

  const subtotal = items.reduce((s, it) => s + it.purchase_price * it.quantity, 0);

  const handleCheckout = async () => {
    setErr(null);
    if (items.length === 0) return;

    try {
      setBusy(true);
      const API = getApiBase();

      await jsonFetch<{ message: string }>(`${API}/cart`, {
        method: "POST",
        body: JSON.stringify({ total: subtotal }),
      });

      
      const itemsPayload = items.map(it => ({
        book_id: it.book_id,
        price: it.purchase_price,
        quantity: it.quantity,
      }));

      await jsonFetch(`${API}/order/checkout`, {
        method: "POST",
        body: JSON.stringify({
          items: itemsPayload,
          total: subtotal,
          
        }),
      });

      localStorage.setItem("cart", JSON.stringify([]));
      setItems([]);
      const orderNumber = Date.now().toString().slice(-6);
      router.push(`/thankyou?order=${orderNumber}`);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "No se pudo procesar tu pedido";
      setErr(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Header />
      <main className={styles.wrapper}>
        <h1 className={styles.title}>Tu Carrito</h1>

        {err && (
          <p style={{ color: "crimson", marginBottom: 12 }}>
            {err}
          </p>
        )}

        {items.length === 0 ? (
          <div className={styles.empty}>
            <p>No tienes productos en el carrito.</p>
          </div>
        ) : (
          <section className={styles.list}>
            <div className={styles.items}>
              {items.map(item => (
                <article key={item.book_id} className={styles.card}>
                  <div className={styles.media}>
                    {item.cover ? (
                      <Image
                        src={`/Images/BookCovers/${item.cover}`}
                        alt={item.name}
                        width={120}
                        height={160}
                      />
                    ) : (
                      <div className={styles.placeholder} />
                    )}
                  </div>

                  <div className={styles.info}>
                    <h2 className={styles.name}>{item.name}</h2>
                    <p className={styles.price}>Q{Number(item.purchase_price).toFixed(2)}</p>
                    <div className={styles.controls}>
                      <button onClick={() => changeQty(item.book_id, -1)} className={styles.qtyBtn}>−</button>
                      <span className={styles.qty}>{item.quantity}</span>
                      <button onClick={() => changeQty(item.book_id, 1)} className={styles.qtyBtn}>+</button>
                      <button onClick={() => removeItem(item.book_id)} className={styles.remove}>Eliminar</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className={styles.summary}>
              <h3>Resumen</h3>
              <div className={styles.row}>
                <span>Items:</span>
                <span>{items.length}</span>
              </div>
              <div className={styles.row}>
                <strong>Total libros:</strong>
                <strong>Q{subtotal.toFixed(2)}</strong>
              </div>
              <button
                disabled={busy || !isLoggedIn}
                className={styles.checkout}
                onClick={handleCheckout}
              >
                {busy ? "Procesando..." : "Pedir Ahora"}
              </button>
            </aside>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
