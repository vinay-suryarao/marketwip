import type { PeerRow } from "@/types/analyzer";

type Props = { peers?: PeerRow[] };

export default function PeerComparison({ peers }: Props) {
  if (!peers || !Array.isArray(peers) || peers.length === 0) return null;
  const validPeers = peers.filter((p) => p != null && typeof p === "object");
  if (validPeers.length === 0) return null;

  return (
    <section className="rounded-3xl border border-[#d8e2f5] bg-[#ffffff] p-6 shadow-[0_12px_28px_rgba(24,58,120,0.1)] sm:p-8">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <h2 className="text-xl font-extrabold text-[#173462] sm:text-2xl">Peer comparison</h2>
      </div>
      <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-[#6074a0]">
        <span>Sector: Financials</span>
      </div>

      <div className="-mx-2 overflow-x-auto px-2">
        <table className="w-full min-w-[800px] text-right text-sm">
          <thead>
            <tr className="border-b border-[#d8e2f5]">
              <th className="whitespace-nowrap px-3 py-3 text-left font-semibold text-[#6074a0]">S.No.</th>
              <th className="whitespace-nowrap px-3 py-3 text-left font-semibold text-[#6074a0]">Name</th>
              <th className="whitespace-nowrap px-3 py-3 font-semibold text-[#6074a0]">CMP Rs.</th>
              <th className="whitespace-nowrap px-3 py-3 font-semibold text-[#6074a0]">P/E</th>
              <th className="whitespace-nowrap px-3 py-3 font-semibold text-[#6074a0]">Mar Cap Rs.Cr.</th>
              <th className="whitespace-nowrap px-3 py-3 font-semibold text-[#6074a0]">Div Yld %</th>
              <th className="whitespace-nowrap px-3 py-3 font-semibold text-[#6074a0]">ROE %</th>
            </tr>
          </thead>
          <tbody>
            {validPeers.map((row, idx) => (
              <tr key={idx} className="border-b border-[#eef3fb] transition hover:bg-[#f9fbff]">
                <td className="whitespace-nowrap px-3 py-3 text-left text-[#3d5178]">{idx + 1}.</td>
                <td className="whitespace-nowrap px-3 py-3 text-left font-semibold text-[#2e7ac9]">
                  {row.companyName || "—"}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-[#3d5178]">{row.price || "—"}</td>
                <td className="whitespace-nowrap px-3 py-3 text-[#3d5178]">{row.priceToEarningsValueRatio || "—"}</td>
                <td className="whitespace-nowrap px-3 py-3 text-[#3d5178]">{row.marketCap || "—"}</td>
                <td className="whitespace-nowrap px-3 py-3 text-[#3d5178]">{row.dividendYieldIndicatedAnnualDividend || "—"}</td>
                <td className="whitespace-nowrap px-3 py-3 text-[#3d5178]">{row.returnOnAverageEquityTrailing12Month || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
