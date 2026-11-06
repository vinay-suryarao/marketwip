import type { QuarterlyRow } from "@/types/analyzer";

type Props = { rows?: QuarterlyRow[] };

const HIGHLIGHT_METRICS = [
  "operating profit",
  "profit before tax",
  "net profit",
];

function isHighlighted(metric: string): boolean {
  return HIGHLIGHT_METRICS.some((h) => metric.toLowerCase().includes(h));
}

export default function QuarterlyResults({ rows }: Props) {
  if (!rows || !Array.isArray(rows) || rows.length === 0) return null;
  const validRows = rows.filter((r) => r != null && typeof r === "object");
  if (validRows.length === 0) return null;

  const columns = Object.keys(validRows[0]);

  return (
    <section className="rounded-3xl border border-[#d8e2f5] bg-white p-6 shadow-[0_12px_28px_rgba(24,58,120,0.08)] sm:p-8">
      <div className="mb-5 border-b border-[#d8e2f5] pb-4">
        <h2 className="text-2xl font-extrabold text-[#173462] sm:text-3xl">Quarterly Results</h2>
        <p className="mt-1 text-xs font-medium text-[#8599c1]">
          Consolidated Figures in Rs. Crores / <span className="cursor-pointer text-[#4f46e5] hover:underline">View Standalone</span>
        </p>
      </div>

      <div className="-mx-2 overflow-x-auto px-2">
        <table className="w-full min-w-[640px] text-right text-sm">
          <thead>
            <tr className="border-b-2 border-[#d8e2f5]">
              {columns.map((col, idx) => (
                <th
                  key={col}
                  className={`whitespace-nowrap px-3 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#6074a0] ${idx === 0 ? "text-left" : ""}`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {validRows.map((row, idx) => {
              const metricName = String(row[columns[0]] ?? "");
              const highlight = isHighlighted(metricName);
              return (
                <tr
                  key={idx}
                  className={`border-b transition hover:bg-[#f5f8ff] ${
                    highlight
                      ? "border-[#d0d9ef] bg-[#f0f4fb] font-extrabold"
                      : "border-[#eef3fb]"
                  }`}
                >
                  {columns.map((col, cIdx) => (
                    <td
                      key={col}
                      className={`whitespace-nowrap px-3 py-2.5 ${
                        cIdx === 0
                          ? `text-left font-semibold ${highlight ? "text-[#173462]" : "text-[#3d5178]"}`
                          : `tabular-nums ${highlight ? "text-[#173462]" : "text-[#3d5178]"}`
                      }`}
                    >
                      {row[col] != null ? String(row[col]) : "—"}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
