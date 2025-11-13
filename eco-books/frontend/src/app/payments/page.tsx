"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CardForm from "./Cardform";
import CardPreview from "./CardPreview";
import "./payments.css";

type Brand = "visa" | "mastercard" | "desconocida";

export default function PaymentsPage() {
  const router = useRouter();
  const [preview, setPreview] = useState<{ number: string; name: string; exp: string; brand: Brand }>({
    number: "",
    name: "",
    exp: "",
    brand: "desconocida",
  });

  const goBackOrCart = () => {
    try {
      const ref = document.referrer;
      if (ref && new URL(ref).origin === window.location.origin) router.back();
      else router.push("/cart");
    } catch {
      router.push("/cart");
    }
  };

  return (
    <>
      <div className="ty-bg" aria-hidden />
      <Header />
      <main className="pay">
        <section className="pay-wrap">
          <div className="pay-module">
            <header className="pay-module__head">
              <h1 className="pay-title">Checkout</h1>
            </header>

            <div className="pay-grid">
              <div className="pay-preview">
                <CardPreview
                  number={preview.number}
                  name={preview.name}
                  exp={preview.exp}
                  brand={preview.brand}
                />
              </div>

              <div className="pay-card">
                <CardForm
                  onPreviewChange={(p) => setPreview(p)}
                  onSubmitToken={async () => {}}
                  onSuccess={goBackOrCart}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
