"use client";

import "./history.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getApiBase } from "../lib/api";

type HistoryItem = {
  articulo: string;
  precio: number | string;
  cantidad: number;
  fecha: string; // ISO date o 'YYYY-MM-DD'
};

type UiOrder = {
  id: string;          
  date: string;        
  time: string;        
  status: "Completado" | "Cancelado";
  items: Array<{ name: string; price: string; quantity: number }>;
};

function gtCurrency(v: number | string) {
  const num = typeof v === "string" ? Number(v) : v;
  return new Intl.NumberFormat("es-GT", { style: "currency", currency: "GTQ" }).format(num || 0);
}

function gtLongDate(input: string) {
  const d = new Date(input);
  return d.toLocaleDateString("es-GT", { year: "numeric", month: "long", day: "numeric" });
}

export default function HistoryPage() {
  const router = useRouter();
  const [items, setItems] = useState<HistoryItem[] | null>(null); 
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const API = getApiBase();
        const res = await fetch(`${API}/order/history`, {
          credentials: "include", 
        });

        if (res.status === 401) {
          router.push("/login");
          return;
        }

        if (!res.ok) {
          setError(`Error ${res.status}`);
          setItems([]);
          return;
        }

        const data = await res.json();
        setItems(Array.isArray(data.items) ? data.items : []);
      } catch (e: any) {
        setError(e?.message || "Error de red");
        setItems([]);
      }
    })();
  }, [router]);

  const orders: UiOrder[] = useMemo(() => {
    if (!items) return [];
    const byDate = new Map<string, UiOrder>();

    for (const it of items) {
      
      const dayKey = new Date(it.fecha).toISOString().slice(0, 10);

      if (!byDate.has(dayKey)) {
        byDate.set(dayKey, {
          id: `#HIST-${dayKey}`,
          date: gtLongDate(dayKey),
          time: "—",
          status: "Completado",
          items: [],
        });
      }
      const group = byDate.get(dayKey)!;
      group.items.push({
        name: it.articulo,
        price: gtCurrency(it.precio),
        quantity: it.cantidad ?? 1,
      });
    }

    return Array.from(byDate.entries())
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([, v]) => v);
  }, [items]);

  return (
    <>
      <Header />
      <main className="hst">
        <section className="hst-head">
          <h1 className="hst-title">Historial de Compras</h1>
          <p className="hst-sub">
            Aquí puedes ver los libros que has comprado anteriormente, con su precio, cantidad y fecha de compra.
          </p>
        </section>

        {items === null && (
          <p style={{ padding: 16 }}>Cargando historial…</p>
        )}

        {items !== null && items.length === 0 && !error && (
          <p style={{ padding: 16 }}>No tienes compras aún.</p>
        )}

        {error && (
          <p style={{ padding: 16, color: "crimson" }}>
            Ocurrió un problema al cargar el historial: {error}
          </p>
        )}

        {orders.length > 0 && (
          <section className="hst-grid">
            {orders.map((o, i) => (
              <div key={i} className="hst-card">
                <div className="hst-header">
                  <h2 className="hst-order">Orden {o.id}</h2>
                  <span
                    className={`hst-status ${
                      o.status === "Completado" ? "completed" : "canceled"
                    }`}
                  >
                    {o.status}
                  </span>
                </div>

                <div className="hst-info">
                  <p>{o.date}</p>
                  <p>{o.time}</p>
                </div>

                <ul className="hst-items">
                  {o.items.map((it, j) => (
                    <li key={j} className="hst-item">
                      <span>{it.quantity}x</span>
                      <span className="hst-name">{it.name}</span>
                      <span className="hst-price">{it.price}</span>
                    </li>
                  ))}
                </ul>

                <div className="hst-actions">
                  <button className="hst-btn hst-btn--primary">Detalles</button>
                  <button className="hst-btn">Obtener ayuda</button>
                </div>
              </div>
            ))}
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
