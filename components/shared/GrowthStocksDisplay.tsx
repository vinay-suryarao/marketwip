"use client";

import { useGrowthStocks } from "@/hooks/useGrowthStocks";

export default function GrowthStocksDisplay() {
  const { stocks, isLoading } = useGrowthStocks();

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-[#d8e2f5] bg-white p-6 text-sm font-medium text-[#6074a0]">
        Loading growth stocks...
      </div>
    );
  }

  if (stocks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#d8e2f5] bg-white p-8 text-center text-sm font-medium text-[#6074a0]">
        Growth stocks will appear here once admin publishes data.
      </div>
    );
  }

  return (
    <section className="rounded-3xl border border-[#d8e2f5] bg-white shadow-[0_12px_28px_rgba(24,58,120,0.1)]">
      {/* Header */}
      <div className="px-6 pt-8 pb-6 sm:px-8 sm:pt-10">
        <div className="mx-auto flex w-fit items-center rounded-full border border-[#cddcf6] bg-[#f0f6ff] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#2e7ac9]">
          Growth Watch
        </div>
        <h2 className="mx-auto mt-4 max-w-2xl text-center text-3xl font-extrabold leading-tight text-[#132746] sm:text-4xl">
          Spot the <span className="bg-linear-to-r from-[#1a8a4a] to-[#2d86cc] bg-clip-text text-transparent">growth triggers</span> before the crowd
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm font-medium leading-relaxed text-[#6074a0]">
          Companies with a visible catalyst — capacity expansion, order book, new business, new products and more — organised by sector with PE at a glance.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm">
          <thead>
            <tr className="border-y border-[#d8e2f5] bg-[#f9fbff] text-[11px] uppercase tracking-[0.1em] text-[#6074a0]">
              <th className="px-4 py-3 text-left font-bold">Date of Post</th>
              <th className="px-4 py-3 text-left font-bold">Company</th>
              <th className="px-4 py-3 text-left font-bold">Sector</th>
              <th className="px-4 py-3 text-left font-bold">PE</th>
              <th className="px-4 py-3 text-left font-bold">Growth Factor</th>
              <th className="px-4 py-3 text-left font-bold">Description</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock, index) => (
              <tr key={stock.id} className={`border-b border-[#e4ecfb] text-[#173462] ${index % 2 === 0 ? "bg-white" : "bg-[#fcfdff]"}`}>
                <td className="px-4 py-4 text-[#6074a0] text-[13px] font-medium whitespace-nowrap">
                  {stock.dateOfPost}
                </td>
                <td className="px-4 py-4 font-bold text-[#173462] whitespace-nowrap">
                  {stock.company}
                </td>
                <td className="px-4 py-4 text-[13px] text-[#6074a0] font-medium whitespace-nowrap">
                  {stock.sector}
                </td>
                <td className="px-4 py-4 font-bold text-[#173462] whitespace-nowrap">
                  {stock.pe}
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {stock.growthFactors.map((factor) => (
                      <span
                        key={factor}
                        className="inline-block rounded-full border border-[#c5d7f5] bg-[#eef4ff] px-2.5 py-1 text-[11px] font-semibold text-[#2e5fa3] whitespace-nowrap"
                      >
                        {factor}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4 text-[13px] text-[#6074a0] leading-relaxed max-w-[320px]">
                  {stock.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
