"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* ─── Types ─── */

type SectorAllocation = {
  sector?: string;
  percentage?: number;
};

type Holding = {
  companyName?: string;
  symbol?: string;
  holdingValue?: number;
};

type Transaction = {
  companyName?: string;
  symbol?: string;
  type?: string;
  value?: number;
};

type Superstar = {
  name: string;
  portfolioValue?: number;
  portfolioValueChange?: number;
  numberOfStocks?: number;
  sectorPreference?: SectorAllocation[];
  topHoldings?: Holding[];
  recentlyBought?: Transaction[];
  recentlySold?: Transaction[];
};

type SuperstarsData = {
  investors: Superstar[];
  lastUpdated?: string;
  error?: string;
};

/* ─── Helpers ─── */

function formatCr(value: number | null | undefined): string {
  if (value == null) return "—";
  if (Math.abs(value) >= 100000) {
    return `₹${(value / 100000).toLocaleString("en-IN", { maximumFractionDigits: 2 })} Lakh Cr`;
  }
  if (Math.abs(value) >= 1) {
    return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 2 })} Cr`;
  }
  return `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

/* ─── Sub-tabs ─── */

const TABS = [
  { id: "individual", label: "Individual Investors", icon: "👤" },
  { id: "institutional", label: "Institutional Investors", icon: "🏦" },
  { id: "fii", label: "FIIs", icon: "🌍" },
];

/* ─── Component ─── */

export default function SuperstarsPage() {
  const [data, setData] = useState<SuperstarsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("individual");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 50;

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/superstars");
        const json = await res.json();
        if (json.error) {
          setError(json.error);
        } else {
          setData(json);
        }
      } catch {
        setError("Failed to load superstars data. This feature requires a paid FinEdge plan.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const investors = data?.investors || [];
  const filtered = searchQuery.trim()
    ? investors.filter((inv) =>
        inv.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : investors;

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <main className="mx-auto flex w-full max-w-300 flex-1 flex-col gap-6 overflow-x-hidden px-4 py-8 sm:px-6 md:px-8 md:py-10">
      {/* Hero Section */}
      <section className="relative rounded-3xl border border-[#d8e2f5] bg-linear-to-b from-[#ffffff] to-[#f3f8ff] px-5 py-8 shadow-[0_16px_34px_rgba(24,58,120,0.12)] sm:px-9 sm:py-12">
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-[#9bc2ff]/25 blur-[90px]" />
          <div className="absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-[#9de2ff]/24 blur-[100px]" />
        </div>

        <div className="relative z-10 text-center">
          <div className="mx-auto mb-3 flex w-fit items-center gap-2 rounded-full border border-[#cddcf6] bg-[#ffffff]/85 px-4 py-2 text-xs font-bold tracking-[0.12em] text-[#305ea3] sm:text-sm">
            ⭐ SUPERSTAR PORTFOLIOS
          </div>
          <h1 className="mx-auto max-w-4xl font-display text-3xl font-extrabold leading-tight text-[#132746] sm:text-5xl sm:leading-[1.1]">
            Track India&apos;s Top Investors
          </h1>
          <p className="mx-auto mt-3 max-w-3xl text-sm font-medium text-[#6074a0] sm:text-base">
            Follow portfolio holdings, sector preferences, and recent transactions of India&apos;s most successful investors.
          </p>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto rounded-2xl border border-[#d8e2f5] bg-white p-2 shadow-[0_4px_12px_rgba(24,58,120,0.06)]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setCurrentPage(1); }}
            className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition ${
              activeTab === tab.id
                ? "bg-[#1f66ff] text-white shadow-[0_4px_12px_rgba(31,102,255,0.3)]"
                : "text-[#6074a0] hover:bg-[#f5f8ff] hover:text-[#173462]"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center rounded-3xl border border-[#d8e2f5] bg-white p-16">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#d8e2f5] border-t-[#2e7ac9]" />
            <p className="text-sm font-semibold text-[#6074a0]">Loading superstars data...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {!loading && (error || investors.length === 0) && (
        <div className="rounded-3xl border border-[#fce3e3] bg-[#fff8f8] p-8 text-center shadow-[0_12px_28px_rgba(24,58,120,0.1)]">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#fce3e3]">
            <span className="text-3xl">🔒</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#d92b4a]">Feature Not Available</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-[#6074a0]">
            {error || "Superstars portfolio data requires a paid FinEdge API plan. Upgrade your plan to unlock this feature."}
          </p>
          <Link
            href="/analyzer"
            className="mt-6 inline-block rounded-lg border border-[#cddcf6] bg-white px-5 py-2.5 text-sm font-bold text-[#2e7ac9] transition hover:bg-[#f1f7ff]"
          >
            ← Back to Market Analyzer
          </Link>
        </div>
      )}

      {/* Data Loaded */}
      {!loading && !error && investors.length > 0 && (
        <>
          {/* Search & Count */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <select
                className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm font-semibold text-[#173462]"
                value={perPage}
                disabled
              >
                <option value={50}>50</option>
              </select>
              <span className="text-sm font-semibold text-[#6074a0]">
                {filtered.length} investor{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="relative">
              <input
                type="search"
                placeholder="Search in table"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="h-10 w-full rounded-xl border border-[#d8e2f5] bg-white pl-10 pr-4 text-sm font-medium text-[#173462] outline-none transition placeholder:text-[#8da0c4] focus:border-[#2e7ac9] focus:ring-2 focus:ring-[#2e7ac9]/15 sm:w-64"
              />
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8da0c4]">🔍</span>
            </div>
          </div>

          {/* Superstars Table */}
          <div className="rounded-3xl border border-[#d8e2f5] bg-white shadow-[0_12px_28px_rgba(24,58,120,0.1)]">
            <div className="-mx-px overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#d8e2f5] bg-[#f8fbff]">
                    <th className="whitespace-nowrap px-5 py-4 text-xs font-bold uppercase tracking-[0.12em] text-[#6074a0]">Superstar</th>
                    <th className="whitespace-nowrap px-4 py-4 text-xs font-bold uppercase tracking-[0.12em] text-[#6074a0]">Portfolio Value<br /><span className="normal-case text-[10px] tracking-normal">(Change %)</span></th>
                    <th className="whitespace-nowrap px-4 py-4 text-center text-xs font-bold uppercase tracking-[0.12em] text-[#6074a0]"># of Stocks</th>
                    <th className="whitespace-nowrap px-4 py-4 text-xs font-bold uppercase tracking-[0.12em] text-[#6074a0]">Sector Preference</th>
                    <th className="whitespace-nowrap px-4 py-4 text-xs font-bold uppercase tracking-[0.12em] text-[#6074a0]">Top Holdings</th>
                    <th className="whitespace-nowrap px-4 py-4 text-xs font-bold uppercase tracking-[0.12em] text-[#6074a0]">Recently Bought</th>
                    <th className="whitespace-nowrap px-4 py-4 text-xs font-bold uppercase tracking-[0.12em] text-[#6074a0]">Recently Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((inv, idx) => {
                    const changeIsPositive =
                      typeof inv.portfolioValueChange === "number" && inv.portfolioValueChange >= 0;
                    return (
                      <tr
                        key={idx}
                        className="border-b border-[#eef3fb] transition hover:bg-[#f5f8ff]"
                      >
                        {/* Name */}
                        <td className="px-5 py-4">
                          <p className="font-bold text-[#2e7ac9]">{inv.name}</p>
                        </td>

                        {/* Portfolio Value */}
                        <td className="px-4 py-4">
                          <p className="font-extrabold text-[#173462]">
                            {formatCr(inv.portfolioValue)}
                          </p>
                          {inv.portfolioValueChange != null && (
                            <p
                              className={`text-xs font-bold ${
                                changeIsPositive ? "text-[#1c9a5f]" : "text-[#d92b4a]"
                              }`}
                            >
                              {changeIsPositive ? "↑" : "↓"}{" "}
                              {Math.abs(inv.portfolioValueChange).toFixed(2)}%
                            </p>
                          )}
                        </td>

                        {/* # Stocks */}
                        <td className="px-4 py-4 text-center font-bold text-[#173462]">
                          {inv.numberOfStocks ?? "—"}
                        </td>

                        {/* Sector Preference */}
                        <td className="px-4 py-4">
                          {inv.sectorPreference && inv.sectorPreference.length > 0 ? (
                            <div className="space-y-0.5">
                              {inv.sectorPreference.slice(0, 3).map((s, sIdx) => (
                                <p key={sIdx} className="text-xs text-[#3d5178]">
                                  {s.sector}{" "}
                                  {s.percentage != null && (
                                    <span className="font-bold text-[#1c9a5f]">
                                      ({s.percentage.toFixed(1)}%)
                                    </span>
                                  )}
                                  {" ↑"}
                                </p>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-[#8599c1]">—</span>
                          )}
                        </td>

                        {/* Top Holdings */}
                        <td className="px-4 py-4">
                          {inv.topHoldings && inv.topHoldings.length > 0 ? (
                            <div className="space-y-0.5">
                              {inv.topHoldings.slice(0, 3).map((h, hIdx) => (
                                <p key={hIdx} className="text-xs text-[#3d5178]">
                                  <Link
                                    href={`/analyzer/${h.symbol || encodeURIComponent(h.companyName || "")}`}
                                    className="font-bold text-[#2e7ac9] hover:underline"
                                  >
                                    {h.companyName || h.symbol}
                                  </Link>
                                  {h.holdingValue != null && (
                                    <span> ({formatCr(h.holdingValue)})</span>
                                  )}
                                </p>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-[#8599c1]">—</span>
                          )}
                        </td>

                        {/* Recently Bought */}
                        <td className="px-4 py-4">
                          {inv.recentlyBought && inv.recentlyBought.length > 0 ? (
                            <div className="space-y-0.5">
                              {inv.recentlyBought.slice(0, 2).map((t, tIdx) => (
                                <p key={tIdx} className="text-xs">
                                  <span className="font-bold text-[#1c9a5f]">
                                    {t.companyName || t.symbol}
                                  </span>
                                  {t.value != null && (
                                    <span className="text-[#3d5178]">
                                      {" "}↑ {formatCr(t.value)}
                                    </span>
                                  )}
                                </p>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-[#8599c1]">-</span>
                          )}
                        </td>

                        {/* Recently Sold */}
                        <td className="px-4 py-4">
                          {inv.recentlySold && inv.recentlySold.length > 0 ? (
                            <div className="space-y-0.5">
                              {inv.recentlySold.slice(0, 2).map((t, tIdx) => (
                                <p key={tIdx} className="text-xs">
                                  <span className="font-bold text-[#d92b4a]">
                                    {t.companyName || t.symbol}
                                  </span>
                                  {t.value != null && (
                                    <span className="text-[#3d5178]">
                                      {" "}↓ {formatCr(t.value)}
                                    </span>
                                  )}
                                </p>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-[#8599c1]">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-[#d8e2f5] px-5 py-3">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-[#d8e2f5] px-3 py-1.5 text-sm font-bold text-[#2e7ac9] transition hover:bg-[#f5f8ff] disabled:opacity-40"
                >
                  ← Previous
                </button>
                <span className="text-sm font-semibold text-[#6074a0]">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-[#d8e2f5] px-3 py-1.5 text-sm font-bold text-[#2e7ac9] transition hover:bg-[#f5f8ff] disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            )}
          </div>

          {/* Last Updated */}
          {data?.lastUpdated && (
            <p className="text-center text-xs font-semibold text-[#8599c1]">
              Last updated: {new Date(data.lastUpdated).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </>
      )}
    </main>
  );
}

