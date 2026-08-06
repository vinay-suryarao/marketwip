type MetricItem = { displayName: string; value: string | number | null };
type Props = { metrics?: Record<string, MetricItem[]> };

export default function KeyRatios({ metrics }: Props) {
  let actualMetrics = metrics;
  if (metrics && typeof metrics === "object" && !Array.isArray(metrics) && "value" in metrics) {
    actualMetrics = (metrics as any).value;
  }

  if (!actualMetrics || Object.keys(actualMetrics).length === 0) return null;

  return (
    <section className="rounded-3xl border border-[#d8e2f5] bg-linear-to-b from-[#ffffff] to-[#f8fbff] p-6 shadow-[0_12px_28px_rgba(24,58,120,0.1)] sm:p-8">
      <div className="mb-4 border-b border-[#d8e2f5] pb-4">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#5f77a5]">Fundamentals</p>
        <h2 className="mt-1 text-xl font-extrabold text-[#173462] sm:text-2xl">Key Ratios</h2>
      </div>

      <div className="flex flex-col gap-8">
        {Object.entries(actualMetrics).map(([category, items]) => {
          if (!Array.isArray(items) || items.length === 0) return null;
          
          const validItems = items.filter(
            (item) => item.value != null && item.value !== "" && item.value !== "—"
          );
          
          if (validItems.length === 0) return null;

          return (
            <div key={category}>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-[#3d5178]">
                {category.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {validItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-[#e3ecf8] bg-[#f9fbff] px-4 py-3 transition hover:border-[#c7d8f7]"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6074a0]">
                      {item.displayName}
                    </p>
                    <p className="mt-1 text-base font-extrabold text-[#173462]">{String(item.value)}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
