import { createFileRoute } from "@tanstack/react-router";
import { SizeChart } from "@/components/size-chart";
import { WHATSAPP_URL } from "@/lib/products";

export const Route = createFileRoute("/size-guide")({
  head: () => ({
    meta: [
      { title: "Size Guide — Velours" },
      { name: "description", content: "Find your perfect bra, brief and night wear size in three easy steps." },
      { property: "og:title", content: "Size Guide — Velours" },
      { property: "og:description", content: "Simple measuring help and size charts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <section className="mx-auto max-w-3xl px-5 py-14">
      <p className="eyebrow text-center">Fit, made simple</p>
      <h1 className="mt-3 text-center text-5xl text-primary">Size guide</h1>
      <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
        Take a soft measuring tape, measure over a light top, and keep it snug but not tight. Between sizes? Choose the larger one for comfort.
      </p>
      <div className="mt-10"><SizeChart /></div>
      <p className="mt-10 text-center text-sm text-muted-foreground">
        Still unsure? <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="text-primary underline">Message us privately on WhatsApp</a> — we're happy to help.
      </p>
    </section>
  ),
});
