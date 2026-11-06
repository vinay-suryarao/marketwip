import Link from "next/link";
import type { PeerRow } from "@/types/analyzer";

type Props = {
  peers?: PeerRow[];
  currentSymbol?: string;
  sector?: string;
};

export default function PeerComparison({ peers, currentSymbol, sector }: Props) {
  if (!peers || !Array.isArray(peers) || peers.length === 0) return null;
  const validPeers = peers.filter((p) => p != null && typeof p === "object");
  if (validPeers.length === 0) return null;

  return (
    <section className="rounded-3xl border border-[#d8e2f5] bg-white p-6 shadow-[0_12px_28px_rgba(24,58,120,0.08)] sm:p-8">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between border-b border-[#d8e2f5] pb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#173462] sm:text-3xl">Peer comparison</h2>
          {sector && (
            <p className="mt-1 text-xs font-semibold text-[#8599c1]">
              Sector: <span className="text-[#305ea3] font-bold">{sector}</span>
            </p>
          )}
        </div>
      </div>

      <div className="-mx-2 overflow-x-auto px-2">
        <table className="w-full min-w-[760px] text-right text-sm">
          <thead>
            <tr className="border-b-2 border-[#d8e2f5]">
              <th className="whitespace-nowrap px-3 py-3 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-[#6074a0]">
                S.No.
              </th>
              <th className="whitespace-nowrap px-3 py-3 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-[#6074a0]">
                Name
              </th>
              <th className="whitespace-nowrap px-3 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#6074a0]">
                CMP Rs.
              </th>
              <th className="whitespace-nowrap px-3 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#6074a0]">
                P/E
              </th>
              <th className="whitespace-nowrap px-3 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#6074a0]">
                Mar Cap Rs.Cr.
              </th>
              <th className="whitespace-nowrap px-3 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#6074a0]">
                Div Yld %
              </th>
              <th className="whitespace-nowrap px-3 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#6074a0]">
                ROE %
              </th>
              <th className="whitespace-nowrap px-3 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#6074a0]">
                ROCE %
              </th>
            </tr>
          </thead>
          <tbody>
            {validPeers.map((row, idx) => {
              const ticker = row.tickerId || row.companyName || "";
              const tickerStr = String(ticker);
              const isCurrent =
                (row as any).isCurrent ||
                (currentSymbol && tickerStr.toUpperCase() === currentSymbol.toUpperCase());

              return (
                <tr
                  key={idx}
                  className={`border-b transition ${
                    isCurrent
                      ? "border-[#d0d9ef] bg-[#f0f4fb] font-extrabold"
                      : "border-[#eef3fb] hover:bg-[#f5f8ff]"
                  }`}
                >
                  <td className="whitespace-nowrap px-3 py-3 text-left tabular-nums text-[#6074a0]">
                    {idx + 1}.
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-left">
                    <Link
                      href={`/analyzer/${encodeURIComponent(ticker)}`}
                      className={`transition ${
                        isCurrent
                          ? "font-extrabold text-[#173462]"
                          : "font-semibold text-[#2e7ac9] hover:underline"
                      }`}
                    >
                      {row.companyName || ticker || "—"}
                    </Link>
                    {isCurrent && (
                      <span className="ml-2 rounded bg-[#305ea3] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                        Current
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 tabular-nums text-[#3d5178]">
                    {row.price || "—"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 tabular-nums text-[#3d5178]">
                    {row.priceToEarningsValueRatio || "—"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 tabular-nums text-[#3d5178]">
                    {row.marketCap || "—"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 tabular-nums text-[#3d5178]">
                    {row.dividendYieldIndicatedAnnualDividend || "—"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 tabular-nums text-[#3d5178]">
                    {row.returnOnAverageEquityTrailing12Month || "—"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 tabular-nums text-[#3d5178]">
                    {(row as any).returnOnCapitalEmployed || "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
