import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/site";
import { products, type Category } from "@/lib/products";

const cats: (Category | "All")[] = ["All", "Bras", "Panties", "Sets", "Night Wear"];

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): { category?: Category } => {
    const c = s["category"] as Category;
    return cats.includes(c) && c !== ("All" as Category) ? { category: c } : {};
  },
  head: () => ({
    meta: [
      { title: "Shop Lingerie & Night Wear — Velours" },
      { name: "description", content: "Browse soft bras, briefs, sets and night wear. Discreet delivery and easy returns." },
      { property: "og:title", content: "Shop — Velours" },
      { property: "og:description", content: "Soft, elegant lingerie and night wear." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { category } = Route.useSearch();
  const list = category ? products.filter((p) => p.category === category) : products;
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
      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3">
        {list.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}
