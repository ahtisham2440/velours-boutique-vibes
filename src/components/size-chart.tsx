export const braChart = [
  ["32", "68–72 cm", "A: 82 · B: 84 · C: 86"],
  ["34", "73–77 cm", "A: 87 · B: 89 · C: 91"],
  ["36", "78–82 cm", "A: 92 · B: 94 · C: 96"],
  ["38", "83–87 cm", "A: 97 · B: 99 · C: 101"],
];
export const bodyChart = [
  ["XS", "60–64", "86–90"],
  ["S", "65–70", "91–95"],
  ["M", "71–76", "96–100"],
  ["L", "77–82", "101–106"],
  ["XL", "83–89", "107–112"],
];

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-secondary/60 text-left">
          <tr>{head.map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]} className="border-t border-border">{r.map((c, i) => <td key={i} className="px-4 py-3 text-muted-foreground">{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SizeChart() {
  return (
    <div className="grid gap-6">
      <div>
        <p className="mb-2 font-serif text-lg">Bras</p>
        <Table head={["Band", "Under bust", "Full bust (cm)"]} rows={braChart} />
      </div>
      <div>
        <p className="mb-2 font-serif text-lg">Briefs & Night Wear</p>
        <Table head={["Size", "Waist (cm)", "Hips (cm)"]} rows={bodyChart} />
      </div>
    </div>
  );
}
