// app/cart/page.tsx (o donde tengas CartPage)
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "./cart.module.css";
import Image from "next/image";

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

  // Load cart from localStorage on mount
  useEffect(() => {
    console.log("🛒 CartPage: useEffect ejecutándose para cargar carrito");
    try {
      const raw = localStorage.getItem("cart");
      console.log("🛒 CartPage: localStorage.getItem('cart') =", raw);
      if (raw) {
        const parsed = JSON.parse(raw);
        console.log("🛒 CartPage: parsed =", parsed);
        console.log("🛒 CartPage: Array.isArray(parsed) =", Array.isArray(parsed));
        if (Array.isArray(parsed)) {
          console.log("🛒 CartPage: Seteando items con", parsed.length, "elementos");
          setItems(parsed);
        }
      } else {
        console.log("🛒 CartPage: No hay datos en localStorage");
      }
    } catch (e) {
      console.error("❌ CartPage: Error reading cart from localStorage", e);
      setItems([]);
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage only after initial load and when items change
  useEffect(() => {
    if (isLoaded) {
      console.log("💾 CartPage: Guardando items en localStorage:", items);
      try {
        localStorage.setItem("cart", JSON.stringify(items));
      } catch (e) {
        console.error("Error saving cart to localStorage", e);
      }
    }
  }, [items, isLoaded]);

  const changeQty = (book_id: number, delta: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.book_id === book_id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
      )
    );
  };

  const removeItem = (book_id: number) => {
    setItems((prev) => prev.filter((i) => i.book_id !== book_id));
  };

  const subtotal = items.reduce((s, it) => s + it.purchase_price * it.quantity, 0);

  const handleCheckout = () => {
    if (items.length === 0) return;
    // simple order number based on timestamp
    const orderNumber = Date.now().toString().slice(-6);
    // optional: clear cart, then navigate
    localStorage.setItem("cart", JSON.stringify([]));
    setItems([]);
    router.push(`/thankyou?order=${orderNumber}`);
  };

  return (
    <>
      <Header />
      <main className={styles.wrapper}>
        <h1 className={styles.title}>Tu Carrito</h1>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <p>No tienes productos en el carrito.</p>
          </div>
        ) : (
          <section className={styles.list}>
            <div className={styles.items}>
              {items.map((item) => (
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
                      <button onClick={() => changeQty(item.book_id, -1)} className={styles.qtyBtn}>
                        −
                      </button>
                      <span className={styles.qty}>{item.quantity}</span>
                      <button onClick={() => changeQty(item.book_id, 1)} className={styles.qtyBtn}>
                        +
                      </button>
                      <button onClick={() => removeItem(item.book_id)} className={styles.remove}>
                        Eliminar
                      </button>
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
              <button className={styles.checkout} onClick={handleCheckout}>
                Pedir Ahora
              </button>
            </aside>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
