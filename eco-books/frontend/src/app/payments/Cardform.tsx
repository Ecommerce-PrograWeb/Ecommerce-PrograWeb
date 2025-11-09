"use client";
import { useMemo, useState } from "react";
import CardBrandIcon from "./CardBrandIcon";

type CardBrand = "visa" | "mastercard" | "desconocida";

const detectBrand = (num: string): CardBrand => {
  const n = num.replace(/\s+/g, "");
  if (/^4\d{6,}\d*$/.test(n)) return "visa";
  if (/^(5[1-5]\d{4,}|2(2[2-9]\d{3}|[3-6]\d{4}|7[01]\d{3}|720\d{2}))\d*$/.test(n)) return "mastercard";
  return "desconocida";
};

type Props = {
  onSubmitToken?: (data: {
    demoCardLast4: string;
    brand: CardBrand;
    expMonth: number;
    expYear: number;
    cardholder: string;
    billing: { country?: string; zip?: string };
  }) => Promise<void> | void;
  onPreviewChange?: (p: { number: string; name: string; exp: string; brand: CardBrand }) => void;
  onSuccess?: () => void;
};

export default function CardForm({ onSubmitToken, onPreviewChange, onSuccess }: Props) {
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("GT");
  const [loading, setLoading] = useState(false);
  const brand = useMemo(() => detectBrand(number), [number]);

  const formatNumber = (v: string) => v.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
  const emitPreview = (n?: string, nm?: string, e?: string) => {
    onPreviewChange?.({ number: n ?? number, name: nm ?? name, exp: e ?? exp, brand });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = number.replace(/\s+/g, "");
    const last4 = clean.slice(-4) || "0000";

    let mm = 1, yyFull = 2099;
    const m = exp.match(/^(\d{2})\/(\d{2})$/);
    if (m) {
      mm = Math.min(Math.max(parseInt(m[1], 10) || 1, 1), 12);
      yyFull = 2000 + (parseInt(m[2], 10) || 99);
    }

    setLoading(true);
    try {
      await onSubmitToken?.({
        demoCardLast4: last4,
        brand,
        expMonth: mm,
        expYear: yyFull,
        cardholder: name.trim(),
        billing: { country, zip },
      });
      onSuccess?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: "100%" }}>
      <div className="pay-card__head">
        <span>Card</span>
        <CardBrandIcon brand={brand} />
      </div>

      <input
        className="pay-input"
        inputMode="numeric"
        autoComplete="cc-number"
        placeholder="Card number"
        value={number}
        onChange={(e) => { const v = formatNumber(e.target.value); setNumber(v); emitPreview(v, undefined, undefined); }}
        required
        maxLength={19}
        style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd" }}
      />

      <input
        className="pay-input"
        autoComplete="cc-name"
        placeholder="Name on card"
        value={name}
        onChange={(e) => { setName(e.target.value); emitPreview(undefined, e.target.value, undefined); }}
        required
        style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd" }}
      />

      <div className="row-2">
        <input
          className="pay-input"
          inputMode="numeric"
          autoComplete="cc-exp"
          placeholder="MM/YY"
          value={exp}
          onChange={(e) => {
            let v = e.target.value.replace(/\D/g, "").slice(0, 4);
            if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
            setExp(v);
            emitPreview(undefined, undefined, v);
          }}
          required
          style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd" }}
        />
        <input
          className="pay-input"
          inputMode="numeric"
          autoComplete="cc-csc"
          placeholder="CVC"
          value={cvc}
          onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
          required
          style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd" }}
        />
      </div>

      <div className="row-2">
        <select
          className="pay-select"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd" }}
        >
          <option value="GT">Guatemala</option>
          <option value="US">United States</option>
          <option value="MX">Mexico</option>
          <option value="SV">El Salvador</option>
          <option value="HN">Honduras</option>
          <option value="CR">Costa Rica</option>
          <option value="PA">Panama</option>
        </select>
        <input
          className="pay-input"
          placeholder="ZIP / Postal code"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd" }}
        />
      </div>

      <button
        className="pay-btn"
        type="submit"
        disabled={loading}
        style={{ padding: "12px 14px", borderRadius: 10, border: "1px solid #111", background: loading ? "#ddd" : "#111", color: "#fff", fontWeight: 600 }}
      >
        {loading ? "Processing..." : "Pay (DEMO)"}
      </button>
    </form>
  );
}
