// app/history/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import "./history.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

type MyOrderItem = {
  id: number | string;       // id de la orden
  articulo: string;          // título/nombre del ítem
  precio: number;            // numérico (Q)
  cantidad: number;          // entero
  fecha: string;             // "YYYY-MM-DD"
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function HistoryPage() {
  const router = useRouter();
  const [items, setItems] = useState<MyOrderItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        setLoading(true);
        setErr(null);

        const res = await fetch(`${API_URL}/order/my`, {
          method: "GET",
          credentials: "include",            // ENVÍA LA COOKIE httpOnly
          headers: { Accept: "application/json" },
        });

        if (res.status === 401) {
          // No loggeado envía al login
          router.replace("/login?next=/history");
          return;
        }

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.error || `Error ${res.status}`);
        }

        const data: MyOrderItem[] = await res.json();
        setItems(data);
      } catch (e: any) {
        setErr(e.message || "Error al cargar el historial");
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [router]);

  // Agrupa los ítems por id de orden para reutilizar tu UI
  const orders = useMemo(() => {
    if (!items) return [];
    const map = new Map<string | number, { id: string | number; fecha: string; items: MyOrderItem[] }>();
    for (const it of items) {
      if (!map.has(it.id)) map.set(it.id, { id: it.id, fecha: it.fecha, items: [] });
      map.get(it.id)!.items.push(it);
    }
    // ordena más reciente primero
    return Array.from(map.values()).sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
  }, [items]);

  return (
    <>
      <Header />
      <main className="hst">
        <section className="hst-head">
          <h1 className="hst-title">Historial de Compras</h1>
          <p className="hst-sub">
            Aquí puedes ver los libros que has comprado anteriormente con su precio, cantidad y fecha de compra.
          </p>
        </section>

        {loading && <p className="hst-sub" style={{ textAlign: "center" }}>Cargando historial…</p>}
        {err && !loading && (
          <p className="hst-sub" style={{ color: "crimson", textAlign: "center" }}>{err}</p>
        )}

        {!loading && !err && orders.length === 0 && (
          <p className="hst-sub" style={{ textAlign: "center" }}>
            Aún no tienes compras registradas.
          </p>
        )}

        {!loading && !err && orders.length > 0 && (
          <section className="hst-grid">
            {orders.map((o) => {
              const total = o.items.reduce((s, x) => s + (Number(x.precio) || 0) * (Number(x.cantidad) || 0), 0);
              return (
                <div key={o.id} className="hst-card">
                  <div className="hst-header">
                    <h2 className="hst-order">Orden #{o.id}</h2>
                    <span className="hst-status completed">Completado</span>
                  </div>

                  <div className="hst-info">
                    <p>{new Date(o.fecha).toLocaleDateString()}</p>
                    {/* Si quisieras, aquí podrías imprimir hora si la tuvieras */}
                  </div>

                  <ul className="hst-items">
                    {o.items.map((it, j) => (
                      <li key={j} className="hst-item">
                        <span>{it.cantidad}x</span>
                        <span className="hst-name">{it.articulo}</span>
                        <span className="hst-price">
                          Q{Number(it.precio).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="hst-actions">
                    <button className="hst-btn hst-btn--primary">
                      Total: Q{total.toFixed(2)}
                    </button>
                    <button className="hst-btn" onClick={() => router.push("/")}>
                      Seguir comprando
                    </button>
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
