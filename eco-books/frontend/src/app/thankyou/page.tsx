// app/thankyou/page.tsx
"use client";

import "./thankyou.css";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ThankYouPage() {
  const orderNumber = "123456";

  return (
    <>
      <Header />
      <div className="ty-bg" aria-hidden />
      <main className="ty">
        <section className="ty-card">
          <div className="ty-card__media">
            <img
              src="/Images/deliveryIMG/delivery1.png"
              alt="Persona en moto de reparto"
              className="ty-card__img"
              loading="eager"
            />
          </div>

          <div className="ty-card__body">
            <p className="ty-kicker">PEDIDO REALIZADO</p>
            <h1 className="ty-title">¡Gracias por tu compra!</h1>
            <p className="ty-order">
              Número de orden: <span className="ty-order__number">#{orderNumber}</span>
            </p>
            <p className="ty-help">Puedes rastrear tu pedido en la sección del carrito.</p>
            <div className="ty-actions">
              <Link href={`/orders/${orderNumber}`} className="ty-btn ty-btn--primary">
                Ver pedido
              </Link>
              <Link href="/" className="ty-btn ty-btn--ghost">
                Seguir comprando
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
