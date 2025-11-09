"use client";

type Brand = "visa" | "mastercard" | "desconocida";

export default function CardBrandIcon({ brand }: { brand: Brand }) {
  if (brand === "visa") return <span className="brand-pill">VISA</span>;
  if (brand === "mastercard") return <span className="brand-pill">MASTERCARD</span>;
  return null;
}
