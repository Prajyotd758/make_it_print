"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Keychain from "@/components/customize/Keychain";
import { FONTS } from "@/components/customize/fonts";
import { inr } from "@/components/productPage/ui";
import { KEYCHAIN_PRICE, KEYCHAIN_FREE_SHIPPING_AT } from "@/lib/keychain";
import "./customize.css";

const MAX = 12;
const SWATCHES = [
  "#ffffff",
  "#fbc112",
  "#ff5a5f",
  "#ff8fb1",
  "#4cc9f0",
  "#2ecc71",
  "#9b5de5",
];

export default function CustomizePage() {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [color, setColor] = useState<string>("#ffffff");
  const [fontFile, setFontFile] = useState<string>(FONTS[0].file);
  const [qty, setQty] = useState<number>(1);


  const total = KEYCHAIN_PRICE * qty;

  const handleBuy = (): void => {
    const font =
      FONTS.find((f) => f.file === fontFile)?.label ?? FONTS[0].label;
    const p = new URLSearchParams({
      custom: "keychain",
      name: name.trim(),
      color,
      font,
      qty: String(qty),
    });
    router.push(`/checkout?${p}`);
  };

  return (
    <main className="cz">
      <section className="cz-panel">
        <span className="cz-label">CUSTOMIZE / KEYCHAIN</span>
        <h1 className="cz-title">Your name, in 3D.</h1>
        <p className="cz-sub">Drag to rotate, scroll or pinch to zoom.</p>

        <label className="cz-label" htmlFor="cz-name">
          NAME ({name.length}/{MAX})
        </label>
        <input
          id="cz-name"
          className="cz-input"
          value={name}
          maxLength={MAX}
          placeholder="Enter a name"
          onChange={(e) => setName(e.target.value)}
        />

        <span className="cz-label">TEXT COLOUR</span>
        <div className="cz-swatches">
          {SWATCHES.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={c}
              className={`cz-swatch${color === c ? " active" : ""}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
            />
          ))}
          <input
            type="color"
            className="cz-picker"
            value={color}
            aria-label="Custom colour"
            onChange={(e) => setColor(e.target.value)}
          />
        </div>

        <span className="cz-label">FONT</span>
        <div className="cz-chips">
          {FONTS.map((f) => (
            <button
              key={f.file}
              type="button"
              className={`cz-chip${fontFile === f.file ? " active" : ""}`}
              onClick={() => setFontFile(f.file)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <span className="cz-label">QUANTITY</span>
        <div className="cz-qty">
          <button
            type="button"
            aria-label="Decrease"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
          >
            −
          </button>
          <span>{qty}</span>
          <button
            type="button"
            aria-label="Increase"
            onClick={() => setQty((q) => Math.min(99, q + 1))}
          >
            +
          </button>
        </div>

        <button
          type="button"
          className="cz-buy"
          disabled={!name.trim()}
          onClick={handleBuy}
        >
          Buy now
        </button>
      </section>

      <section className="cz-stage">
        <Keychain text={name} color={color} fontFile={fontFile} />
      </section>
    </main>
  );
}
