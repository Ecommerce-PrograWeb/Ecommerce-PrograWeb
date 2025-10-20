"use client";

import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './cart.module.css';
import Image from 'next/image';

interface CartItem {
  book_id: number;
  name: string;
  cover?: string;
  purchase_price: number;
  quantity: number;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cart');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch (e) {
      console.error('Error reading cart from localStorage', e);
      setItems([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch (e) {
      console.error('Error saving cart to localStorage', e);
    }
  }, [items]);

  const changeQty = (book_id: number, delta: number) => {
    setItems((prev) => prev.map(i => i.book_id === book_id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
  };

  const removeItem = (book_id: number) => {
    setItems((prev) => prev.filter(i => i.book_id !== book_id));
  };

  const total = items.reduce((s, it) => s + it.purchase_price * it.quantity, 0);

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
              {items.map(item => (
                <article key={item.book_id} className={styles.card}>
                  <div className={styles.media}>
                    {item.cover ? (
                      <Image src={`/Images/BookCovers/${item.cover}`} alt={item.name} width={120} height={160} />
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
              <div className={styles.row}><span>Items:</span><span>{items.length}</span></div>
              <div className={styles.row}><strong>Total:</strong><strong>Q{total.toFixed(2)}</strong></div>
              <button className={styles.checkout}>Pedir Ahora</button>
            </aside>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
