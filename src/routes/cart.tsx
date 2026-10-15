import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus } from "lucide-react";
import { useCart, shippingFor, FREE_SHIPPING_MIN } from "@/lib/cart";
import { getProduct, formatPrice } from "@/lib/products";
import { PrivacyNote } from "@/components/site";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Bag — Velours" },
      { name: "description", content: "Review your bag. Discreet packaging and private billing on every order." },
      { property: "og:title", content: "Your Bag — Velours" },
      { property: "og:description", content: "Review your selected pieces." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Cart,
});

function Cart() {
  const { items, update, subtotal } = useCart();
  const ship = shippingFor(subtotal);
  if (items.length === 0)
    return (
      <div className="px-5 py-32 text-center">
        <h1 className="text-5xl text-primary">Your bag is empty</h1>
        <p className="mt-3 text-muted-foreground">Take your time — something lovely is waiting for you.</p>
        <Link to="/shop" className="btn-primary mt-8">Start shopping</Link>
      </div>
    );
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-[1fr_380px]">
      <div>
        <h1 className="text-5xl text-primary">Your bag</h1>
        <ul className="mt-8 divide-y divide-border">
          {items.map((it, i) => {
            const p = getProduct(it.id);
            if (!p) return null;
            return (
              <li key={i} className="grid grid-cols-[80px_minmax(0,1fr)_auto] gap-4 py-5">
                <img src={p.images[0]} alt={p.name} className="aspect-[4/5] w-20 rounded-lg object-cover" />
                <div className="min-w-0">
                  <Link to="/product/$id" params={{ id: p.id }} className="font-serif text-lg">{p.name}</Link>
                  <p className="text-sm text-muted-foreground">{it.color} · {it.size}</p>
                  <div className="mt-3 inline-flex items-center rounded-full border border-border">
                    <button className="p-2" aria-label="Less" onClick={() => update(i, it.qty - 1)}><Minus className="h-3 w-3" /></button>
                    <span className="w-6 text-center text-sm">{it.qty}</span>
                    <button className="p-2" aria-label="More" onClick={() => update(i, it.qty + 1)}><Plus className="h-3 w-3" /></button>
                  </div>
                </div>
                <div className="text-right">
                  <p>{formatPrice(p.price * it.qty)}</p>
                  <button onClick={() => update(i, 0)} className="mt-2 text-xs text-muted-foreground underline">Remove</button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <aside className="h-fit rounded-2xl bg-cream p-6">
        <Summary subtotal={subtotal} ship={ship} />
        {ship > 0 && <p className="mt-3 text-xs text-muted-foreground">Add {formatPrice(FREE_SHIPPING_MIN - subtotal)} more for free delivery.</p>}
        <Link to="/checkout" className="btn-primary mt-6 w-full">Checkout</Link>
        <div className="mt-5"><PrivacyNote /></div>
      </aside>
    </div>
  );
}

export function Summary({ subtotal, ship }: { subtotal: number; ship: number }) {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
      <div className="flex justify-between"><span>Delivery</span><span>{ship === 0 ? "Free" : formatPrice(ship)}</span></div>
      <div className="flex justify-between border-t border-border pt-3 font-serif text-xl"><span>Total</span><span>{formatPrice(subtotal + ship)}</span></div>
    </div>
  );
}
