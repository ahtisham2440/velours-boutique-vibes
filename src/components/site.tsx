import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, ShoppingBag, X, MessageCircle, Instagram, Facebook, Mail, Phone, Lock, Package } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/lib/cart";
import { formatMoney, WHATSAPP_URL, type ShopifyProduct } from "@/lib/shopify";

const nav = [
  { to: "/shop", label: "Shop" },
  { to: "/size-guide", label: "Size Guide" },
  { to: "/cart", label: "Cart" },
] as const;

export function Header() {
  const items = useCartStore((s) => s.items);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="bg-secondary py-2 text-center text-[0.7rem] tracking-[0.2em] uppercase text-secondary-foreground">
        Discreet packaging, always
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-4">
        <button className="md:hidden" aria-label="Menu" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <nav className="hidden gap-8 text-sm md:flex">
          {nav.slice(0, 2).map((n) => (
            <Link key={n.to} to={n.to} className="text-muted-foreground transition hover:text-foreground">{n.label}</Link>
          ))}
        </nav>
        <Link to="/" className="justify-self-center font-serif text-3xl tracking-wide text-primary">Velours</Link>
        <Link to="/cart" aria-label="Cart" className="relative justify-self-end">
          <ShoppingBag className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-primary text-[0.65rem] text-primary-foreground">{count}</span>
          )}
        </Link>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-border px-5 py-4 md:hidden">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-2 font-serif text-xl">{n.label}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const variant =
    product.variants.edges.find((v) => v.node.availableForSale)?.node ?? product.variants.edges[0]?.node ?? null;
  const image = product.images.edges[0]?.node;
  const soldOut = !variant || !variant.availableForSale;

  const handleAdd = async () => {
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions,
    });
    toast.success(`${product.title} added to your bag`);
  };

  return (
    <div className="group">
      <Link to="/product/$id" params={{ id: product.handle }} className="block overflow-hidden rounded-xl bg-muted">
        {image && (
          <img src={image.url} alt={image.altText ?? product.title} loading="lazy" width={800} height={1008}
            className="aspect-[4/5] w-full object-cover transition duration-[1200ms] ease-out group-hover:scale-105" />
        )}
      </Link>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link to="/product/$id" params={{ id: product.handle }} className="font-serif text-lg leading-tight hover:text-rose">{product.title}</Link>
          {product.productType && <p className="mt-1 text-xs text-muted-foreground">{product.productType}</p>}
        </div>
        <span className="shrink-0 text-sm">{formatMoney(product.priceRange.minVariantPrice)}</span>
      </div>
      <button
        onClick={handleAdd}
        disabled={soldOut || isLoading}
        className="mt-3 w-full rounded-full border border-primary/30 py-2.5 text-xs uppercase tracking-[0.18em] text-primary transition hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-primary">
        {soldOut ? "Sold out" : "Quick Add"}
      </button>
    </div>
  );
}

export function PrivacyNote() {
  return (
    <div className="grid gap-2 rounded-xl bg-secondary/60 p-4 text-sm text-secondary-foreground">
      <p className="flex items-center gap-2"><Package className="h-4 w-4 shrink-0" /> Discreet packaging — a plain box with no brand name outside.</p>
      <p className="flex items-center gap-2"><Lock className="h-4 w-4 shrink-0" /> Private billing — your statement shows a neutral name.</p>
    </div>
  );
}

export function WhatsAppButton() {
  return (
    <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-soft transition hover:scale-105">
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 bg-secondary text-secondary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-serif text-3xl text-primary">Velours</p>
          <p className="mt-3 text-sm text-muted-foreground">Soft, beautiful pieces made to feel as good as they look.</p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="eyebrow mb-3">Shop</p>
          <Link to="/shop" className="block hover:text-primary">All products</Link>
          <Link to="/size-guide" className="block hover:text-primary">Size guide</Link>
          <Link to="/cart" className="block hover:text-primary">Your bag</Link>
        </div>
        <div className="space-y-2 text-sm">
          <p className="eyebrow mb-3">Talk to us</p>
          <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> +92 300 0000000</p>
          <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@velours.pk</p>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-2 text-whatsapp-foreground">
            <MessageCircle className="h-4 w-4" /> WhatsApp us
          </a>
        </div>
        <div className="text-sm">
          <p className="eyebrow mb-3">Follow</p>
          <div className="flex gap-3">
            <a href="https://instagram.com" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full border border-primary/30 hover:bg-primary hover:text-primary-foreground"><Instagram className="h-4 w-4" /></a>
            <a href="https://facebook.com" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full border border-primary/30 hover:bg-primary hover:text-primary-foreground"><Facebook className="h-4 w-4" /></a>
          </div>
          <p className="eyebrow mb-3 mt-6">We accept</p>
          <div className="flex flex-wrap gap-2">
            {["VISA", "Mastercard", "COD"].map((p) => (
              <span key={p} className="rounded border border-border bg-card px-2 py-1 text-[0.65rem] font-semibold tracking-wide">{p}</span>
            ))}
          </div>
        </div>
      </div>
      <p className="border-t border-border py-5 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} Velours. Made with care.</p>
    </footer>
  );
}
