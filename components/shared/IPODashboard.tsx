"use client";

import { useMemo } from "react";
import { useIPODashboard } from "@/hooks/useIPODashboard";

function formatDisplayDate(value?: string) {
  if (!value) {
    return "--";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function IPODashboard() {
  const { latest, isLoading } = useIPODashboard();

  const updatedOn = useMemo(() => formatDisplayDate(latest?.updatedAt), [latest?.updatedAt]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-[#d8e2f5] bg-white p-6 text-sm font-medium text-[#6074a0]">
        Loading IPO dashboard...
      </div>
    );
  }

  if (!latest || (latest.activeUpcoming.length === 0 && latest.recentIpos.length === 0)) {
    return (
      <div className="rounded-2xl border border-dashed border-[#d8e2f5] bg-white p-8 text-center text-sm font-medium text-[#6074a0]">
        IPO dashboard will appear here once admin publishes data.
      </div>
    );
  }

  return (
    <section className="rounded-3xl border border-[#d8e2f5] bg-white p-4 shadow-[0_12px_28px_rgba(24,58,120,0.1)] sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#d8e2f5] pb-3">
        <h2 className="text-2xl font-extrabold text-[#173462] sm:text-3xl">IPO Dashboard</h2>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6074a0]">Updated: {updatedOn}</p>
      </div>

      <div className="space-y-6">
        <div className="overflow-x-auto rounded-2xl border border-[#d8e2f5]">
          <table className="min-w-[1280px] w-full bg-white text-sm">
            <thead>
              <tr className="bg-[#f6f9ff] text-[#173462]">
                <th className="px-3 py-3 text-left font-bold" colSpan={19}>Active/Upcoming IPO</th>
              </tr>
              <tr className="border-y border-[#d8e2f5] bg-[#f9fbff] text-[12px] text-[#6074a0]">
                <th className="px-3 py-2 text-left font-bold">IPO Name</th>
                <th className="px-3 py-2 text-left font-bold">Price Band</th>
                <th className="px-3 py-2 text-left font-bold">Dates</th>
                <th className="px-3 py-2 text-left font-bold">Min Invest</th>
                <th className="px-3 py-2 text-left font-bold">GMP</th>
                <th className="px-3 py-2 text-left font-bold">Type</th>
                <th className="px-3 py-2 text-left font-bold">P/E</th>
                <th className="px-3 py-2 text-left font-bold">Sales FY 23-24</th>
                <th className="px-3 py-2 text-left font-bold">Sales FY 24-25</th>
                <th className="px-3 py-2 text-left font-bold">Sales FY 25-26</th>
                <th className="px-3 py-2 text-left font-bold">Net Profit FY 23-24</th>
                <th className="px-3 py-2 text-left font-bold">Net Profit FY 24-25</th>
                <th className="px-3 py-2 text-left font-bold">Net Profit FY 25-26</th>
                <th className="px-3 py-2 text-left font-bold">QIB Sub</th>
                <th className="px-3 py-2 text-left font-bold">Retail Sub</th>
                <th className="px-3 py-2 text-left font-bold">HNI Sub</th>
                <th className="px-3 py-2 text-left font-bold">Total Sub</th>
                <th className="px-3 py-2 text-left font-bold">Allot Date</th>
                <th className="px-3 py-2 text-left font-bold">Refund Date</th>
              </tr>
            </thead>
            <tbody>
              {latest.activeUpcoming.length > 0 ? (
                latest.activeUpcoming.map((row, index) => (
                  <tr key={`${row.ipoName}-${index}`} className="border-b border-[#e4ecfb] text-[#173462] odd:bg-white even:bg-[#fcfdff]">
                    <td className="px-3 py-2 font-semibold">{row.ipoName}</td>
                    <td className="px-3 py-2">{row.priceBand}</td>
                    <td className="px-3 py-2">{row.dates}</td>
                    <td className="px-3 py-2">{row.minInvest}</td>
                    <td className="px-3 py-2">{row.gmp}</td>
                    <td className="px-3 py-2">{row.type}</td>
                    <td className="px-3 py-2">{row.pe}</td>
                    <td className="px-3 py-2">{row.salesFy2324}</td>
                    <td className="px-3 py-2">{row.salesFy2425}</td>
                    <td className="px-3 py-2">{row.salesFy2526}</td>
                    <td className="px-3 py-2">{row.netProfitFy2324}</td>
                    <td className="px-3 py-2">{row.netProfitFy2425}</td>
                    <td className="px-3 py-2">{row.netProfitFy2526}</td>
                    <td className="px-3 py-2">{row.qibSub}</td>
                    <td className="px-3 py-2">{row.retailSub}</td>
                    <td className="px-3 py-2">{row.hniSub}</td>
                    <td className="px-3 py-2">{row.totalSub}</td>
                    <td className="px-3 py-2">{row.allotDate}</td>
                    <td className="px-3 py-2">{row.refundDate}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-3 py-5 text-center text-[#6074a0]" colSpan={19}>No active/upcoming IPO entries</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#d8e2f5]">
          <table className="min-w-[920px] w-full bg-white text-sm">
            <thead>
              <tr className="bg-[#f6f9ff] text-[#173462]">
                <th className="px-3 py-3 text-left font-bold" colSpan={7}>Recent IPOs</th>
              </tr>
              <tr className="border-y border-[#d8e2f5] bg-[#f9fbff] text-[12px] text-[#6074a0]">
                <th className="px-3 py-2 text-left font-bold">IPO Name</th>
                <th className="px-3 py-2 text-left font-bold">Price Band</th>
                <th className="px-3 py-2 text-left font-bold">Listing Price</th>
                <th className="px-3 py-2 text-left font-bold">Listing Gain</th>
                <th className="px-3 py-2 text-left font-bold">Anchor Lock-in 50%</th>
                <th className="px-3 py-2 text-left font-bold">Anchor Lock-in 100%</th>
                <th className="px-3 py-2 text-left font-bold">Pre-IPO Lock-in</th>
              </tr>
            </thead>
            <tbody>
              {latest.recentIpos.length > 0 ? (
                latest.recentIpos.map((row, index) => (
                  <tr key={`${row.ipoName}-${index}`} className="border-b border-[#e4ecfb] text-[#173462] odd:bg-white even:bg-[#fcfdff]">
                    <td className="px-3 py-2 font-semibold">{row.ipoName}</td>
                    <td className="px-3 py-2">{row.priceBand}</td>
                    <td className="px-3 py-2">{row.listingPrice}</td>
                    <td className="px-3 py-2">{row.listingGain}</td>
                    <td className="px-3 py-2">{row.anchorLockIn50}</td>
                    <td className="px-3 py-2">{row.anchorLockIn100}</td>
                    <td className="px-3 py-2">{row.preIpoLockIn}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-3 py-5 text-center text-[#6074a0]" colSpan={7}>No recent IPO entries</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
