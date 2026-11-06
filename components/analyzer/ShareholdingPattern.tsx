"use client";

import { useState, useMemo } from "react";

type Props = {
  shareholding?: any;
};

const STANDARD_CATEGORIES = [
  { key: "promoters", label: "Promoters" },
  { key: "fiis", label: "FIIs" },
  { key: "diis", label: "DIIs" },
  { key: "government", label: "Government" },
  { key: "public", label: "Public" },
  { key: "shareholders", label: "No. of Shareholders" },
];

export default function ShareholdingPattern({ shareholding }: Props) {
  const [viewMode, setViewMode] = useState<"Quarterly" | "Yearly">("Quarterly");

  // Parse any shareholding format (IndianAPI nested array or FinEdge flat/ratios array)
  const { periods, categoryRows } = useMemo(() => {
    if (!shareholding) {
      return { periods: [], categoryRows: [] };
    }

    // Handle object wrapper
    let rawList: any[] = [];
    if (Array.isArray(shareholding)) {
      rawList = shareholding;
    } else if (typeof shareholding === "object") {
      rawList = shareholding.data ?? shareholding.shareholdings ?? shareholding.summary ?? shareholding.pattern ?? shareholding.categories ?? [];
      if (!Array.isArray(rawList)) rawList = [];
    }

    if (rawList.length === 0) {
      return { periods: [], categoryRows: [] };
    }

    // Format 1: Category-grouped format (e.g. [{ categoryName: "Promoter", categories: [{ holdingDate, percentage }] }])
    const isCategoryGrouped = rawList.some(
      (item) => item && (item.categoryName || item.displayName || item.category) && Array.isArray(item.categories || item.values)
    );

    if (isCategoryGrouped) {
      const periodSet = new Set<string>();
      const rows: { label: string; values: Record<string, string | number> }[] = [];

      for (const cat of rawList) {
        const label = String(cat.categoryName || cat.displayName || cat.category || "Other");
        const entries = Array.isArray(cat.categories) ? cat.categories : (cat.values || []);
        const valMap: Record<string, string | number> = {};

        for (const entry of entries) {
          const p = entry.holdingDate || entry.date || entry.period || "";
          if (p) {
            periodSet.add(p);
            valMap[p] = entry.percentage != null ? `${Number(entry.percentage).toFixed(2)}%` : "—";
          }
        }
        rows.push({ label, values: valMap });
      }

      const allPeriods = Array.from(periodSet);
      return { periods: allPeriods, categoryRows: rows };
    }

    // Format 2: Period-based array (e.g. [{ period: "Sep 2026", promoters: 50.44, fiis: 16.67, diis: 21.62, ... }])
    const periodList: string[] = [];
    const rowsMap: Record<string, Record<string, string | number>> = {};

    STANDARD_CATEGORIES.forEach((c) => {
      rowsMap[c.label] = {};
    });

    for (const item of rawList) {
      const p = item.period || item.date || item.quarter || item.header || item.holdingDate || "";
      if (!p) continue;
      periodList.push(p);

      const promoterVal = item.promoters ?? item.promoter ?? item.promoterHolding;
      if (promoterVal != null) rowsMap["Promoters"][p] = `${Number(promoterVal).toFixed(2)}%`;

      const fiiVal = item.fiis ?? item.fii ?? item.fiiHolding ?? item.foreignInstitutions;
      if (fiiVal != null) rowsMap["FIIs"][p] = `${Number(fiiVal).toFixed(2)}%`;

      const diiVal = item.diis ?? item.dii ?? item.diiHolding ?? item.domesticInstitutions;
      if (diiVal != null) rowsMap["DIIs"][p] = `${Number(diiVal).toFixed(2)}%`;

      const govVal = item.government ?? item.govt ?? item.governmentHolding;
      if (govVal != null) rowsMap["Government"][p] = `${Number(govVal).toFixed(2)}%`;

      const pubVal = item.public ?? item.publicHolding ?? item.others;
      if (pubVal != null) rowsMap["Public"][p] = `${Number(pubVal).toFixed(2)}%`;

      const shCount = item.shareholders ?? item.numberOfShareholders ?? item.shareholdersCount ?? item.noOfShareholders;
      if (shCount != null) {
        rowsMap["No. of Shareholders"][p] = Number(shCount).toLocaleString("en-IN");
      }
    }

    const builtRows = STANDARD_CATEGORIES.map((c) => ({
      label: c.label,
      values: rowsMap[c.label] || {},
    })).filter((r) => Object.keys(r.values).length > 0);

    return { periods: periodList, categoryRows: builtRows.length > 0 ? builtRows : [] };
  }, [shareholding]);

  // Always show the section — show empty state if no data (free plan)
  const hasData = categoryRows.length > 0 && periods.length > 0;

  return (
    <section className="rounded-3xl border border-[#d8e2f5] bg-white p-6 shadow-[0_12px_28px_rgba(24,58,120,0.08)] sm:p-8">
      {/* Top Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#173462] sm:text-3xl">Shareholding Pattern</h2>
          <p className="mt-1 text-xs font-medium text-[#8599c1]">Numbers in percentages</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle pill: Quarterly / Yearly */}
          <div className="inline-flex rounded-lg border border-[#e2e8f0] bg-[#f8fbff] p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("Quarterly")}
              className={`rounded-md px-3 py-1.5 text-xs font-bold transition ${
                viewMode === "Quarterly"
                  ? "bg-white text-[#4f46e5] shadow-xs"
                  : "text-[#64748b] hover:text-[#1e293b]"
              }`}
            >
              Quarterly
            </button>
            <button
              type="button"
              onClick={() => setViewMode("Yearly")}
              className={`rounded-md px-3 py-1.5 text-xs font-bold transition ${
                viewMode === "Yearly"
                  ? "bg-white text-[#4f46e5] shadow-xs"
                  : "text-[#64748b] hover:text-[#1e293b]"
              }`}
            >
              Yearly
            </button>
          </div>

          {/* TRADES Button */}
          <div className="flex flex-col items-center">
            <span className="rounded-lg border border-[#6366f1] bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#4f46e5]">
              TRADES
            </span>
          </div>
        </div>
      </div>

      {hasData ? (
        <>
          {/* Table */}
          <div className="-mx-2 overflow-x-auto px-2">
            <table className="w-full min-w-[700px] text-right text-sm">
              <thead>
                <tr className="border-b border-[#eef3fb]">
                  <th className="py-3 text-left text-xs font-bold text-[#8599c1]"></th>
                  {periods.map((p) => (
                    <th
                      key={p}
                      className="whitespace-nowrap px-3 py-3 text-xs font-semibold text-[#8599c1]"
                    >
                      {p}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categoryRows.map((row, idx) => {
                  const isShareholders = row.label.toLowerCase().includes("shareholder");

                  return (
                    <tr
                      key={idx}
                      className="border-b border-[#f1f5f9] transition hover:bg-[#f8fafc]"
                    >
                      <td className="whitespace-nowrap py-3.5 text-left font-medium text-[#334155]">
                        <span className="inline-flex items-center gap-1.5">
                          <span>{row.label}</span>
                          {!isShareholders && (
                            <span className="text-xs text-[#818cf8] font-bold">+</span>
                          )}
                        </span>
                      </td>
                      {periods.map((p) => {
                        const val = row.values[p];
                        return (
                          <td
                            key={p}
                            className={`whitespace-nowrap px-3 py-3.5 tabular-nums ${
                              isShareholders ? "text-[#475569] font-medium" : "text-[#1e293b] font-semibold"
                            }`}
                          >
                            {val != null ? String(val) : "—"}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footnote */}
          <div className="mt-5 flex items-center gap-1.5 text-xs text-[#94a3b8]">
            <span>* The classifications might have changed from Sep&apos;2022 onwards.</span>
            <span
              title="Classification note"
              className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#94a3b8] text-[9px] font-bold text-[#94a3b8]"
            >
              i
            </span>
          </div>
        </>
      ) : (
        /* Empty state for free plan */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#d8e2f5] bg-[#f8fbff] py-12">
          <svg className="mb-3 h-10 w-10 text-[#b0c4e8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-sm font-bold text-[#6074a0]">Shareholding data not available</p>
          <p className="mt-1 text-xs text-[#8599c1]">
            This data will appear automatically when available in your FinEdge plan.
          </p>
        </div>
      )}
    </section>
  );
}
