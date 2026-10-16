import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Minus, Plus, ExternalLink, Loader2 } from "lucide-react";
import { useCartStore } from "@/lib/cart";
import { formatMoney } from "@/lib/shopify";
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
  const { items, isLoading, isSyncing, updateQuantity, removeItem, getCheckoutUrl, syncCart } = useCartStore();

  // Sync with Shopify on load — clears the bag after a completed checkout.
  useEffect(() => { syncCart(); }, [syncCart]);

  if (items.length === 0)
    return (
      <div className="px-5 py-32 text-center">
        <h1 className="text-5xl text-primary">Your bag is empty</h1>
        <p className="mt-3 text-muted-foreground">Take your time — something lovely is waiting for you.</p>
        <Link to="/shop" className="btn-primary mt-8">Start shopping</Link>
      </div>
    );

  const subtotal = items.reduce((s, i) => s + Number(i.price.amount) * i.quantity, 0);
  const currencyCode = items[0]?.price.currencyCode ?? "USD";
  const total = formatMoney({ amount: String(subtotal), currencyCode });

  const handleCheckout = () => {
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) window.open(checkoutUrl, "_blank");
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-[1fr_380px]">
      <div>
        <h1 className="text-5xl text-primary">Your bag</h1>
        <ul className="mt-8 divide-y divide-border">
          {items.map((it) => {
            const image = it.product.images.edges[0]?.node;
            return (
              <li key={it.variantId} className="grid grid-cols-[80px_minmax(0,1fr)_auto] gap-4 py-5">
                {image && (
                  <img src={image.url} alt={it.product.title} className="aspect-[4/5] w-20 rounded-lg object-cover" />
                )}
                <div className="min-w-0">
                  <Link to="/product/$id" params={{ id: it.product.handle }} className="font-serif text-lg">{it.product.title}</Link>
                  {it.selectedOptions.length > 0 && (
                    <p className="text-sm text-muted-foreground">{it.selectedOptions.map((o) => o.value).join(" · ")}</p>
                  )}
                  <div className="mt-3 inline-flex items-center rounded-full border border-border">
                    <button className="p-2" aria-label="Less" disabled={isLoading} onClick={() => updateQuantity(it.variantId, it.quantity - 1)}><Minus className="h-3 w-3" /></button>
                    <span className="w-6 text-center text-sm">{it.quantity}</span>
                    <button className="p-2" aria-label="More" disabled={isLoading} onClick={() => updateQuantity(it.variantId, it.quantity + 1)}><Plus className="h-3 w-3" /></button>
                  </div>
                </div>
                <div className="text-right">
                  <p>{formatMoney({ amount: String(Number(it.price.amount) * it.quantity), currencyCode })}</p>
                  <button onClick={() => removeItem(it.variantId)} className="mt-2 text-xs text-muted-foreground underline">Remove</button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <aside className="h-fit rounded-2xl bg-cream p-6">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{total}</span></div>
          <div className="flex justify-between"><span>Delivery</span><span className="text-muted-foreground">Calculated at checkout</span></div>
          <div className="flex justify-between border-t border-border pt-3 font-serif text-xl"><span>Total</span><span>{total}</span></div>
        </div>
        <button onClick={handleCheckout} disabled={isLoading || isSyncing}
          className="btn-primary mt-6 flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60">
          {isLoading || isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" />}
          Checkout securely
        </button>
        <p className="mt-3 text-xs text-muted-foreground">You'll finish your order on our secure Shopify checkout — it opens in a new tab.</p>
        <div className="mt-5"><PrivacyNote /></div>
      </aside>
    </div>
  );
}
