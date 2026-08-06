type ShareholdingEntry = { holdingDate?: string; percentage?: string | number };
type ShareholdingCategory = {
  categoryName?: string;
  displayName?: string;
  categories?: ShareholdingEntry[];
};

type Props = { shareholding?: ShareholdingCategory[] };

export default function ShareholdingPattern({ shareholding }: Props) {
  if (!shareholding || shareholding.length === 0) return null;

  return (
    <section className="rounded-3xl border border-[#d8e2f5] bg-linear-to-b from-[#ffffff] to-[#f8fbff] p-6 shadow-[0_12px_28px_rgba(24,58,120,0.1)] sm:p-8">
      <div className="mb-4 border-b border-[#d8e2f5] pb-4">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#5f77a5]">Ownership</p>
        <h2 className="mt-1 text-xl font-extrabold text-[#173462] sm:text-2xl">Shareholding Pattern</h2>
      </div>

      <div className="space-y-4">
        {shareholding.map((cat, idx) => {
          const label = String(cat.displayName || cat.categoryName || `Category ${idx + 1}`);
          const entries = Array.isArray(cat.categories) ? cat.categories : [];

          return (
            <div key={idx} className="rounded-xl border border-[#e3ecf8] bg-[#f9fbff] p-4">
              <p className="mb-3 text-sm font-bold text-[#173462]">{label}</p>
              {entries.length > 0 ? (
                <div className="-mx-1 overflow-x-auto px-1">
                  <table className="w-full min-w-[300px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-[#d8e2f5]">
                        {entries.map((entry, eIdx) => (
                          <th key={eIdx} className="whitespace-nowrap px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#6074a0]">
                            {entry.holdingDate || `Period ${eIdx + 1}`}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[#eef3fb]">
                        {entries.map((entry, eIdx) => (
                          <td key={eIdx} className="whitespace-nowrap px-3 py-2 font-semibold text-[#3d5178]">
                            {entry.percentage != null ? `${entry.percentage}%` : "—"}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-[#8599c1]">No data available</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
