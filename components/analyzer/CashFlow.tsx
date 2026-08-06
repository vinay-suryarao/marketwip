import type { FinancialRow } from "@/types/analyzer";

type Props = { rows?: FinancialRow[] };

export default function CashFlow({ rows }: Props) {
  if (!rows || !Array.isArray(rows) || rows.length === 0) return null;
  const validRows = rows.filter((r) => r != null && typeof r === "object");
  if (validRows.length === 0) return null;

  const columns = Object.keys(validRows[0]);

  return (
    <section className="rounded-3xl border border-[#d8e2f5] bg-linear-to-b from-[#ffffff] to-[#f8fbff] p-6 shadow-[0_12px_28px_rgba(24,58,120,0.1)] sm:p-8">
      <div className="mb-4 border-b border-[#d8e2f5] pb-4">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#5f77a5]">Cash Movement</p>
        <h2 className="mt-1 text-xl font-extrabold text-[#173462] sm:text-2xl">Cash Flow</h2>
      </div>

      <div className="-mx-2 overflow-x-auto px-2">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#d8e2f5]">
              {columns.map((col) => (
                <th
                  key={col}
                  className="whitespace-nowrap px-3 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#6074a0]"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {validRows.map((row, idx) => (
              <tr
                key={idx}
                className="border-b border-[#eef3fb] transition hover:bg-[#f5f8ff]"
              >
                {columns.map((col) => (
                  <td key={col} className="whitespace-nowrap px-3 py-3 font-semibold text-[#3d5178]">
                    {row[col] != null ? String(row[col]) : "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
