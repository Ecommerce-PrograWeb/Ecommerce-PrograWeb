"use client";

type Brand = "visa" | "mastercard" | "desconocida";

export default function CardPreview({
  number,
  name,
  exp,
  brand,
}: {
  number: string;
  name: string;
  exp: string;
  brand: Brand;
}) {
  const shown =
    (number || "").replace(/\d(?=(?:\s*\d){4})/g, "•").trim() ||
    "•••• •••• •••• ••••";
  const shownName = name || "CARDHOLDER NAME";
  const shownExp = exp || "MM/YY";
  const showBadge = brand !== "desconocida";
  const badgeText = brand === "visa" ? "VISA" : "MASTERCARD";

  return (
    <div className="cc">
      <div className="cc-chip" />
      {showBadge && <div className="cc-badge">{badgeText}</div>}
      <div className="cc-number">{shown}</div>
      <div className="cc-footer">
        <div className="cc-label">CARDHOLDER</div>
        <div className="cc-name">{shownName}</div>
        <div className="cc-label cc-exp-l">EXPIRES</div>
        <div className="cc-exp">{shownExp}</div>
      </div>
    </div>
  );
}
