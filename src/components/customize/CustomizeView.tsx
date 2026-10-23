"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Keychain from "@/components/customize/Keychain";
import { FONTS } from "@/components/customize/fonts";
import { inr } from "@/components/productPage/ui";
import { KEYCHAIN_PRICE, KEYCHAIN_FREE_SHIPPING_AT } from "@/lib/keychain";
import "./customize.css";

const MAX = 15;
const TEXT_SWATCHES: string[] = [
  "#1a1a1a",
  "#ffffff",
  "#fbc112",
  "#ff5a5f",
  "#ff8fb1",
  "#4cc9f0",
  "#2ecc71",
  "#9b5de5",
];
const BG_SWATCHES: string[] = [
  "#1a1a1a",
  "#ffffff",
  "#fbc112",
  "#ff5a5f",
  "#ff8fb1",
  "#4cc9f0",
  "#2ecc71",
  "#9b5de5",
];

interface SwatchesProps {
  value: string;
  options: string[];
  onChange: (c: string) => void;
}

function Swatches({ value, options, onChange }: SwatchesProps) {
  return (
    <div className="cz-swatches">
      {options.map((c) => (
        <button
          key={c}
          type="button"
          aria-label={c}
          className={`cz-swatch${value === c ? " active" : ""}`}
          style={{ background: c }}
          onClick={() => onChange(c)}
        />
      ))}
    </div>
  );
}

export default function CustomizeView({ admin = false }: { admin?: boolean }) {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [color, setColor] = useState<string>("#ffffff");
  const [bgColor, setBgColor] = useState<string>("#1a1a1a");
  const [fontFile, setFontFile] = useState<string>(FONTS[0].file);
  const [qty, setQty] = useState<number>(1);
  const exportRef = useRef<(() => void) | null>(null);

  const total = KEYCHAIN_PRICE * qty;

  const handleBuy = (): void => {
    const font =
      FONTS.find((f) => f.file === fontFile)?.label ?? FONTS[0].label;
    const p = new URLSearchParams({
      custom: "keychain",
      name: name.trim(),
      color,
      bg: bgColor,
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

        <div className="cz-colors">
          <div>
            <span className="cz-label">TEXT COLOUR</span>
            <Swatches
              value={color}
              options={TEXT_SWATCHES}
              onChange={setColor}
            />
          </div>
          <div>
            <span className="cz-label">BACKGROUND COLOUR</span>
            <Swatches
              value={bgColor}
              options={BG_SWATCHES}
              onChange={setBgColor}
            />
          </div>
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

        <p className="cz-price">
          <strong>{inr(total)}</strong> · {inr(KEYCHAIN_PRICE)} each
          <span>
            {total >= KEYCHAIN_FREE_SHIPPING_AT
              ? "Free delivery"
              : "Free delivery above ₹499"}
          </span>
        </p>

        <button
          type="button"
          className="cz-buy"
          disabled={!name.trim()}
          onClick={handleBuy}
        >
          Buy now
        </button>

        {admin && (
          <button
            type="button"
            className="cz-chip"
            disabled={!name.trim()}
            onClick={() => exportRef.current?.()}
          >
            Download STL
          </button>
        )}
      </section>

      <section className="cz-stage">
        <Keychain
          text={name}
          color={color}
          baseColor={bgColor}
          fontFile={fontFile}
          exportRef={admin ? exportRef : undefined}
        />
      </section>
    </main>
  );
}
