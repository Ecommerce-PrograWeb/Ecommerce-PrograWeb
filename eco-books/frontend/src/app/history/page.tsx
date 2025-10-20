// app/history/page.tsx
"use client";

import "./history.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function HistoryPage() {
  const orders = [
    {
      id: "#14256",
      date: "16 de septiembre de 2020",
      time: "11:54 PM",
      status: "Completado",
      items: [
        { name: "El Alquimista", price: "Q120.00", quantity: 1 },
        { name: "Harry Potter 1", price: "Q150.00", quantity: 1 },
      ],
    },
    {
      id: "#32561",
      date: "29 de agosto de 2020",
      time: "12:06 AM",
      status: "Cancelado",
      items: [
        { name: "Game of Thrones", price: "Q180.00", quantity: 1 },
        { name: "El Código Da Vinci", price: "Q130.00", quantity: 1 },
      ],
    },
    {
      id: "#47892",
      date: "4 de octubre de 2020",
      time: "3:42 PM",
      status: "Completado",
      items: [
        { name: "Bajo la misma estrella", price: "Q110.00", quantity: 1 },
        { name: "Onyx Storm", price: "Q125.00", quantity: 1 },
      ],
    },
  ];

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
      </main>
      <Footer />
    </>
  );
}
