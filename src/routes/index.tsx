import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock, RotateCcw, Package, Truck, Feather, Ruler, Heart, Star, ShieldCheck } from "lucide-react";
import { ProductCard } from "@/components/site";
import { products, categories, hero, detail } from "@/lib/products";
import bra from "@/assets/bra.jpg";
import set from "@/assets/set.jpg";
import night from "@/assets/night.jpg";
import panty from "@/assets/panty.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Velours — Soft Lingerie Made to Feel as Good as It Looks" },
      { name: "description", content: "Elegant, comfortable lingerie and night wear. Discreet packaging, easy returns and cash on delivery." },
      { property: "og:title", content: "Velours — Soft, Elegant Lingerie" },
      { property: "og:description", content: "Beautiful bras, briefs, sets and night wear with discreet delivery and easy returns." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const trust = [
  { icon: Lock, label: "Secure Payment" },
  { icon: RotateCcw, label: "Easy Returns" },
  { icon: Package, label: "Discreet Packaging" },
  { icon: Truck, label: "Fast Delivery" },
];

const reviews = [
  { name: "Ayesha K.", text: "The softest bra I've ever owned. I forgot I was wearing it.", product: "Rosalie Lace Bra" },
  { name: "Sana M.", text: "Arrived in a plain box, totally private. The fit was perfect thanks to the size guide.", product: "Amour Satin Set" },
  { name: "Hira R.", text: "These pyjamas feel like a hug. Already ordered a second pair.", product: "Camille Silk Pyjama" },
];

function Index() {
  return (
    <>
      {/* Hero */}
      <section className="relative">
        <img src={hero} alt="Blush satin robe resting on a velvet chair in soft morning light" width={1600} height={1008}
          className="h-[78vh] min-h-[520px] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
        <div className="absolute inset-0 mx-auto flex max-w-7xl items-center px-5">
          <div className="max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <p className="eyebrow">New season · Soft essentials</p>
            <h1 className="mt-4 text-5xl leading-[1.05] text-primary sm:text-7xl">Comfort you can feel. Confidence you can see.</h1>
            <p className="mt-5 text-muted-foreground">Gentle fabrics, a fit made for you, and pieces that make every day feel a little softer.</p>
            <Link to="/shop" className="btn-primary mt-8">Shop Now</Link>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-border bg-cream">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 py-8 md:grid-cols-4">
          {trust.map(({ icon: I, label }) => (
            <div key={label} className="flex items-center justify-center gap-3 text-sm">
              <I className="h-5 w-5 shrink-0 text-rose" /> {label}
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <SectionTitle eyebrow="Find your favourite" title="Shop by category" />
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((c) => (
            <Link key={c.name} to="/shop" search={{ category: c.name }} className="group relative overflow-hidden rounded-xl">
              <img src={c.image} alt={c.name} loading="lazy" width={800} height={1008}
                className="aspect-[4/5] w-full object-cover transition duration-[1200ms] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
              <span className="absolute bottom-4 left-4 font-serif text-2xl text-primary-foreground">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Best sellers */}
      <section className="bg-cream py-20">
        <div className="mx-auto max-w-7xl px-5">
          <SectionTitle eyebrow="Loved by thousands" title="Best sellers" />
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {products.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="mt-12 text-center"><Link to="/shop" className="btn-outline">View all</Link></div>
        </div>
      </section>

      {/* Why */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 md:grid-cols-2">
        <img src={detail} alt="Close-up of soft rose lace" loading="lazy" width={816} height={816} className="aspect-square w-full rounded-2xl object-cover" />
        <div>
          <p className="eyebrow">Why women love us</p>
          <h2 className="mt-3 text-4xl text-primary sm:text-5xl">Made to feel as good as it looks.</h2>
          <div className="mt-8 grid gap-6">
            {[
              { icon: Feather, t: "Soft fabric", d: "Cloud-soft cotton, smooth satin and gentle lace — chosen by touch." },
              { icon: Ruler, t: "Perfect fit", d: "Thoughtful sizing that holds you just right, without pinching." },
              { icon: Heart, t: "Skin-friendly", d: "Breathable, dermatologically gentle materials for all-day ease." },
            ].map(({ icon: I, t, d }) => (
              <div key={t} className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blush text-primary"><I className="h-5 w-5" /></span>
                <div><p className="font-serif text-xl">{t}</p><p className="text-sm text-muted-foreground">{d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Size guide */}
      <section className="bg-blush/50 py-20">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <p className="eyebrow">Never guess again</p>
          <h2 className="mt-3 text-4xl text-primary">Finding your size is easy</h2>
          <div className="mt-10 grid gap-6 text-left sm:grid-cols-3">
            {[
              ["1", "Measure under", "Wrap a soft tape just under your bust. That's your band."],
              ["2", "Measure around", "Measure the fullest part of your bust, keeping the tape level."],
              ["3", "Match & relax", "Find your numbers in our chart — or just ask us on WhatsApp."],
            ].map(([n, t, d]) => (
              <div key={n} className="rounded-xl bg-card p-6 shadow-soft">
                <span className="font-serif text-3xl text-gold">{n}</span>
                <p className="mt-2 font-serif text-xl">{t}</p>
                <p className="mt-1 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
          <Link to="/size-guide" className="btn-outline mt-10">See full size chart</Link>
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <SectionTitle eyebrow="4.8 out of 5 · 1,400+ reviews" title="Kind words from our customers" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <figure key={r.name} className="rounded-2xl border border-border bg-card p-7">
              <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-gold text-gold" />)}</div>
              <blockquote className="mt-4 font-serif text-xl leading-snug">“{r.text}”</blockquote>
              <figcaption className="mt-4 text-sm text-muted-foreground">{r.name} · <span className="text-rose">{r.product}</span> · Verified buyer</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Promise */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-5">
          <p className="eyebrow text-center text-gold">Our promise to you</p>
          <h2 className="mt-3 text-center text-4xl">Shop with complete peace of mind</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { icon: RotateCcw, t: "Easy return & exchange", d: "Changed your mind or need a new size? Return within 14 days, no questions asked." },
              { icon: ShieldCheck, t: "Privacy protected", d: "Your details stay private, and billing appears under a neutral name." },
              { icon: Package, t: "Plain packaging", d: "Every order arrives in a plain box with no brand name on the outside." },
            ].map(({ icon: I, t, d }) => (
              <div key={t} className="text-center">
                <I className="mx-auto h-7 w-7 text-gold" />
                <p className="mt-4 font-serif text-2xl">{t}</p>
                <p className="mt-2 text-sm opacity-80">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="mx-auto max-w-7xl px-5 pt-20">
        <SectionTitle eyebrow="@velours" title="Soft moments, shared" />
        <div className="mt-10 grid grid-cols-3 gap-2 md:grid-cols-6">
          {[bra, night, detail, set, panty, hero].map((src, i) => (
            <a key={i} href="https://instagram.com" target="_blank" rel="noreferrer" className="group overflow-hidden rounded-lg">
              <img src={src} alt="Velours on Instagram" loading="lazy" className="aspect-square w-full object-cover transition duration-700 group-hover:scale-110 group-hover:opacity-90" />
            </a>
          ))}
        </div>
      </section>
    </>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="text-center">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-4xl text-primary sm:text-5xl">{title}</h2>
    </div>
  );
}
