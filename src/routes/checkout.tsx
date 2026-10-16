import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { useCart, shippingFor } from "@/lib/cart";
import { PrivacyNote } from "@/components/site";
import { Summary } from "./cart";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Velours" },
      { name: "description", content: "Simple, private checkout with Cash on Delivery." },
      { property: "og:title", content: "Checkout — Velours" },
      { property: "og:description", content: "Simple, private checkout." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Checkout,
});

const input = "w-full rounded-lg border border-input bg-card px-4 py-3 text-sm outline-none focus:border-primary";

function Checkout() {
  const { items, subtotal, clear } = useCart();
  const [pay, setPay] = useState("cod");
  const [done, setDone] = useState(false);
  const ship = shippingFor(subtotal);

  const submit = (e: FormEvent) => { e.preventDefault(); clear(); setDone(true); window.scrollTo(0, 0); };

  if (done)
    return (
      <div className="px-5 py-32 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-rose" />
        <h1 className="mt-4 text-5xl text-primary">Thank you, lovely</h1>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">Your order is confirmed. It will arrive in a plain, unbranded box within 2–4 days.</p>
        <Link to="/shop" className="btn-outline mt-8">Keep browsing</Link>
      </div>
    );
  if (items.length === 0)
    return <div className="px-5 py-32 text-center"><h1 className="text-4xl">Your bag is empty</h1><Link to="/shop" className="btn-primary mt-6">Shop now</Link></div>;

  return (
    <form onSubmit={submit} className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-[1fr_380px]">
      <div className="space-y-8">
        <h1 className="text-5xl text-primary">Checkout</h1>
        <fieldset className="grid gap-3">
          <legend className="eyebrow mb-3">1 · Delivery details</legend>
          <input required className={input} placeholder="Full name" autoComplete="name" />
          <input required className={input} placeholder="Phone number" type="tel" autoComplete="tel" />
          <input required className={input} placeholder="Address" autoComplete="street-address" />
          <input required className={input} placeholder="City" autoComplete="address-level2" />
        </fieldset>
        <fieldset className="grid gap-3">
          <legend className="eyebrow mb-3">2 · Payment</legend>
          {[["cod", "Cash on Delivery", "Pay when your parcel arrives"], ["card", "Card / Wallet", "Secure payment, billed under a neutral name"]].map(([v, t, d]) => (
            <label key={v} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition ${pay === v ? "border-primary bg-blush/40" : "border-border"}`}>
              <input type="radio" name="pay" value={v} checked={pay === v} onChange={() => setPay(v ?? "cod")} className="mt-1 accent-[var(--primary)]" />
              <span><span className="block font-medium">{t}</span><span className="text-sm text-muted-foreground">{d}</span></span>
            </label>
          ))}
        </fieldset>
      </div>
      <aside className="h-fit rounded-2xl bg-cream p-6">
        <Summary subtotal={subtotal} ship={ship} />
        <button type="submit" className="btn-primary mt-6 w-full">Place order</button>
        <div className="mt-5"><PrivacyNote /></div>
      </aside>
    </form>
  );
}
