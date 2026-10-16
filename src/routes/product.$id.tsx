import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Star, RotateCcw, Check, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { getProduct, products, formatPrice } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { ProductCard, PrivacyNote } from "@/components/site";
import { SizeChart } from "@/components/size-chart";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Velours` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: `${loaderData.product.name} — Velours` },
          { property: "og:description", content: loaderData.product.description },
          { property: "og:type", content: "product" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "Product not found — Velours" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="py-32 text-center"><h1 className="text-4xl">We couldn't find that piece</h1><Link to="/shop" className="btn-outline mt-6">Back to shop</Link></div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product: p } = Route.useLoaderData();
  const { add } = useCart();
  const [img, setImg] = useState(0);
  const [color, setColor] = useState(p.colors[0]?.name ?? "");
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const related = products.filter((x) => x.id !== p.id).slice(0, 4);

  const addToBag = () => {
    if (!size) { toast("Please choose your size first"); return; }
    add({ id: p.id, color, size }, qty);
    toast.success(`${p.name} added to your bag`);
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-2xl bg-muted">
            <img key={img} src={p.images[img]} alt={p.name} width={800} height={1008} className="aspect-[4/5] w-full object-cover animate-in fade-in duration-500" />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {p.images.map((src, i) => (
              <button key={i} onClick={() => setImg(i)} aria-label={`Photo ${i + 1}`}
                className={`overflow-hidden rounded-lg border-2 transition ${i === img ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"}`}>
                <img src={src} alt="" loading="lazy" className="aspect-square w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow">{p.category}</p>
          <h1 className="mt-2 text-4xl text-primary sm:text-5xl">{p.name}</h1>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-gold text-gold" /> {p.rating} · {p.reviews} reviews
          </div>
          <p className="mt-5 text-2xl">{formatPrice(p.price)}</p>
          <p className="mt-4 text-muted-foreground">{p.description}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {p.badges.map((b) => (
              <span key={b} className="inline-flex items-center gap-1 rounded-full bg-blush px-3 py-1 text-xs text-primary"><Check className="h-3 w-3" />{b}</span>
            ))}
          </div>

          <div className="mt-8">
            <p className="text-sm">Colour: <span className="text-muted-foreground">{color}</span></p>
            <div className="mt-3 flex gap-3">
              {p.colors.map((c) => (
                <button key={c.name} aria-label={c.name} onClick={() => setColor(c.name)}
                  className={`h-9 w-9 rounded-full border-2 ring-offset-2 ring-offset-background transition ${color === c.name ? "ring-2 ring-primary" : "border-border"}`}
                  style={{ background: c.swatch }} />
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm">Size</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.sizes.map((s) => (
                <button key={s} onClick={() => setSize(s)}
                  className={`min-w-14 rounded-full border px-4 py-2 text-sm transition ${size === s ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}>{s}</button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <div className="flex items-center rounded-full border border-border">
              <button className="p-3" aria-label="Less" onClick={() => setQty(Math.max(1, qty - 1))}><Minus className="h-4 w-4" /></button>
              <span className="w-6 text-center">{qty}</span>
              <button className="p-3" aria-label="More" onClick={() => setQty(qty + 1)}><Plus className="h-4 w-4" /></button>
            </div>
            <button onClick={addToBag} className="btn-primary flex-1">Add to Bag</button>
          </div>

          <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground"><RotateCcw className="h-4 w-4 text-rose" /> Easy 14-day returns & free size exchange.</p>
          <div className="mt-4"><PrivacyNote /></div>

          <Accordion type="single" collapsible className="mt-6">
            <AccordionItem value="fabric"><AccordionTrigger>Fabric details</AccordionTrigger><AccordionContent>{p.fabric}</AccordionContent></AccordionItem>
            <AccordionItem value="care"><AccordionTrigger>Care instructions</AccordionTrigger>
              <AccordionContent><ul className="list-disc space-y-1 pl-5">{p.care.map((c) => <li key={c}>{c}</li>)}</ul></AccordionContent></AccordionItem>
            <AccordionItem value="size"><AccordionTrigger>Size chart</AccordionTrigger><AccordionContent><SizeChart /></AccordionContent></AccordionItem>
            <AccordionItem value="returns"><AccordionTrigger>Returns & exchange</AccordionTrigger>
              <AccordionContent>Return or exchange unworn items within 14 days. Just message us on WhatsApp and we'll arrange a free pickup in plain packaging.</AccordionContent></AccordionItem>
          </Accordion>
        </div>
      </div>

      <section className="mt-24">
        <h2 className="text-center text-4xl text-primary">You may also like</h2>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {related.map((r) => <ProductCard key={r.id} product={r} />)}
        </div>
      </section>
    </div>
  );
}
