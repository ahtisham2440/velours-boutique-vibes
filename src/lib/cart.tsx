import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getProduct } from "./products";

export type CartItem = { id: string; color: string; size: string; qty: number };

type Ctx = {
  items: CartItem[];
  add: (i: Omit<CartItem, "qty">, qty?: number) => void;
  update: (index: number, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const CartContext = createContext<Ctx | null>(null);
const KEY = "velours-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem(KEY) || "[]")); } catch { /* ignore */ }
  }, []);
  const save = (next: CartItem[]) => { setItems(next); localStorage.setItem(KEY, JSON.stringify(next)); };

  const add: Ctx["add"] = (i, qty = 1) => {
    const idx = items.findIndex((x) => x.id === i.id && x.color === i.color && x.size === i.size);
    if (idx >= 0) save(items.map((x, n) => (n === idx ? { ...x, qty: x.qty + qty } : x)));
    else save([...items, { ...i, qty }]);
  };
  const update = (index: number, qty: number) =>
    save(qty <= 0 ? items.filter((_, n) => n !== index) : items.map((x, n) => (n === index ? { ...x, qty } : x)));

  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + (getProduct(i.id)?.price ?? 0) * i.qty, 0);

  return <CartContext.Provider value={{ items, add, update, clear: () => save([]), count, subtotal }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
}

export const FREE_SHIPPING_MIN = 4000;
export const SHIPPING_FEE = 250;
export const shippingFor = (subtotal: number) => (subtotal === 0 || subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE);
