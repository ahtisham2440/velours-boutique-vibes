import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/site";
import { fetchProducts } from "@/lib/shopify";

const productsQuery = queryOptions({
  queryKey: ["shopify-products", "all"],
  queryFn: () => fetchProducts(100),
});

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): { category?: string } =>
    s["category"] ? { category: String(s["category"]) } : {},
  head: () => ({
    meta: [
      { title: "Shop — Velours" },
      { name: "description", content: "Browse our full collection. Discreet delivery and easy returns." },
      { property: "og:title", content: "Shop — Velours" },
      { property: "og:description", content: "Soft, elegant pieces from our collection." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  component: Shop,
});

function Shop() {
  const { category } = Route.useSearch();
  const { data: products } = useSuspenseQuery(productsQuery);

  const cats = ["All", ...Array.from(new Set(products.map((p) => p.productType).filter(Boolean)))];
  const list = category ? products.filter((p) => p.productType === category) : products;

  return (
    <section className="mx-auto max-w-7xl px-5 py-14">
      <p className="eyebrow text-center">The collection</p>
      <h1 className="mt-3 text-center text-5xl text-primary">{category ?? "Shop all"}</h1>
      <div className="mt-8 flex gap-2 overflow-x-auto pb-2 sm:justify-center">
        {cats.map((c) => {
          const active = (c === "All" && !category) || c === category;
          return (
            <Link key={c} to="/shop" search={c === "All" ? {} : { category: c }}
              className={`shrink-0 rounded-full border px-5 py-2 text-sm transition ${active ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}>
              {c}
            </Link>
          );
        })}
      </div>
      {list.length === 0 ? (
        <p className="py-24 text-center text-muted-foreground">No products found</p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3">
          {list.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </section>
  );
}
