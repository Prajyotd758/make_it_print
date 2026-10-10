import { FONTS } from "@/components/customize/fonts";

export const KEYCHAIN_PRICE = 99;
export const KEYCHAIN_FREE_SHIPPING_AT = 500; // i.e. above ₹499
export const KEYCHAIN_MAX_QTY = 99;
export const KEYCHAIN_MAX_NAME = 12;

export interface KeychainOrder {
  name: string;
  color: string;
  font: string;
  quantity: number;
}

export function parseKeychain(sp: {
  get(k: string): string | null;
}): KeychainOrder | null {
  if (sp.get("custom") !== "keychain") return null;
  const name = (sp.get("name") ?? "").trim().slice(0, KEYCHAIN_MAX_NAME);
  const color = sp.get("color") ?? "";
  const font = sp.get("font") ?? "";
  const quantity = Math.min(
    KEYCHAIN_MAX_QTY,
    Math.max(1, Math.floor(Number(sp.get("qty"))) || 1)
  );
  if (
    !name ||
    !/^#[0-9a-f]{6}$/i.test(color) ||
    !FONTS.some((f) => f.label === font)
  )
    return null;
  return { name, color, font, quantity };
}
