import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { RotateCcw, Minus, Plus, Check } from "lucide-react";
import { toast } from "sonner";
import { fetchProductByHandle, fetchProducts, formatMoney, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/lib/cart";
import { ProductCard, PrivacyNote } from "@/components/site";
import { SizeChart } from "@/components/size-chart";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const productQuery = (handle: string) =>
  queryOptions({ queryKey: ["shopify-product", handle], queryFn: () => fetchProductByHandle(handle) });

const allProductsQuery = queryOptions({
  queryKey: ["shopify-products", "all"],
  queryFn: () => fetchProducts(100),
});

export const Route = createFileRoute("/product/$id")({
  loader: async ({ params, context }) => {
    const product = await context.queryClient.ensureQueryData(productQuery(params.id));
    if (!product) throw notFound();
    await context.queryClient.ensureQueryData(allProductsQuery);
    return { product };
  },
  head: ({ loaderData }) => {
    const product: ShopifyProduct | undefined = loaderData?.product;
    const image = product?.images.edges[0]?.node?.url;
    return {
      meta: product
        ? [
            { title: `${product.title} — Velours` },
            { name: "description", content: product.description.slice(0, 160) },
            { property: "og:title", content: `${product.title} — Velours` },
            { property: "og:description", content: product.description.slice(0, 160) },
            { property: "og:type", content: "product" },
            { name: "twitter:card", content: "summary_large_image" },
            ...(image && image.startsWith("https://")
              ? [
                  { property: "og:image", content: image },
                  { name: "twitter:image", content: image },
                ]
              : []),
          ]
        : [{ title: "Product not found — Velours" }, { name: "robots", content: "noindex" }],
    };
  },
  notFoundComponent: () => (
    <div className="py-32 text-center"><h1 className="text-4xl">We couldn't find that piece</h1><Link to="/shop" className="btn-outline mt-6">Back to shop</Link></div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product: p } = Route.useLoaderData();
  const { data: all } = useSuspenseQuery(allProductsQuery);
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  const options = p.options.filter(
    (o) => !(o.name === "Title" && o.values.length === 1 && o.values[0] === "Default Title"),
  );
  const firstVariant = p.variants.edges[0]?.node;
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(firstVariant?.selectedOptions.map((o) => [o.name, o.value]) ?? []),
  );
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);

  const variant = p.variants.edges.find((v) => v.node.selectedOptions.every((o) => selected[o.name] === o.value))?.node;
  const price = variant?.price ?? p.priceRange.minVariantPrice;
  const soldOut = !variant || !variant.availableForSale;
  const images = p.images.edges.map((e) => e.node);
  const related = all.filter((x) => x.id !== p.id).slice(0, 4);

  const addToBag = async () => {
    if (!variant) return;
    if (soldOut) { toast("This piece is currently sold out"); return; }
    await addItem({
      product: p,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: qty,
      selectedOptions: variant.selectedOptions,
    });
    toast.success(`${p.title} added to your bag`);
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-2xl bg-muted">
            {images[img] && (
              <img key={img} src={images[img].url} alt={images[img].altText ?? p.title} width={800} height={1008}
                className="aspect-[4/5] w-full object-cover animate-in fade-in duration-500" />
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {images.map((node, i) => (
                <button key={node.url + i} onClick={() => setImg(i)} aria-label={`Photo ${i + 1}`}
                  className={`overflow-hidden rounded-lg border-2 transition ${i === img ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"}`}>
                  <img src={node.url} alt="" loading="lazy" className="aspect-square w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {p.productType && <p className="eyebrow">{p.productType}</p>}
          <h1 className="mt-2 text-4xl text-primary sm:text-5xl">{p.title}</h1>
          <p className="mt-5 text-2xl">{formatMoney(price)}</p>
          <p className="mt-4 text-muted-foreground">{p.description}</p>

          {options.map((opt) => (
            <div key={opt.name} className="mt-6">
              <p className="text-sm">{opt.name}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {opt.values.map((v) => (
                  <button key={v} onClick={() => setSelected((s) => ({ ...s, [opt.name]: v }))}
                    className={`min-w-14 rounded-full border px-4 py-2 text-sm transition ${selected[opt.name] === v ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}>{v}</button>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-8 flex gap-3">
            <div className="flex items-center rounded-full border border-border">
              <button className="p-3" aria-label="Less" onClick={() => setQty(Math.max(1, qty - 1))}><Minus className="h-4 w-4" /></button>
              <span className="w-6 text-center">{qty}</span>
              <button className="p-3" aria-label="More" onClick={() => setQty(qty + 1)}><Plus className="h-4 w-4" /></button>
            </div>
            <button onClick={addToBag} disabled={soldOut || isLoading} className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-60">
              {soldOut ? "Sold out" : "Add to Bag"}
            </button>
          </div>

          <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground"><RotateCcw className="h-4 w-4 text-rose" /> Easy 14-day returns & free size exchange.</p>
          <div className="mt-4"><PrivacyNote /></div>

          <Accordion type="single" collapsible className="mt-6">
            <AccordionItem value="size"><AccordionTrigger>Size chart</AccordionTrigger><AccordionContent><SizeChart /></AccordionContent></AccordionItem>
            <AccordionItem value="returns"><AccordionTrigger>Returns & exchange</AccordionTrigger>
              <AccordionContent>Return or exchange unworn items within 14 days. Just message us on WhatsApp and we'll arrange a free pickup in plain packaging.</AccordionContent></AccordionItem>
          </Accordion>
          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"><Check className="h-4 w-4 text-rose" /> Secure checkout — payments are handled by Shopify.</p>
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
