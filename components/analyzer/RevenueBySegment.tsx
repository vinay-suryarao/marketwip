"use client";

import { useState } from "react";

type SegmentItem = {
  name: string;
  data?: {
    segmentRevenue?: number;
    segmentProfitLossBeforeTaxAndFinanceCosts?: number;
  };
};

type PeriodEntry = {
  header: string;
  data?: {
    segmentRevenue?: number;
    segmentProfitBeforeTax?: number;
    segmentFinanceCosts?: number;
    interSegmentRevenue?: number;
  };
  segments?: SegmentItem[];
};

type Props = {
  data?: {
    annual?: PeriodEntry[];
    quarterly?: PeriodEntry[];
  };
};

function formatCr(val: number | null | undefined): string {
  if (val == null) return "—";
  const cr = val / 10000000;
  return Math.round(cr).toLocaleString("en-IN");
}

export default function RevenueBySegment({ data }: Props) {
  const [periodType, setPeriodType] = useState<"annual" | "quarterly">("annual");

  const annualList = data?.annual || [];
  const quarterlyList = data?.quarterly || [];
  const currentList = periodType === "annual" ? annualList : quarterlyList;

  // Sort periods chronologically (oldest to newest)
  // FinEdge returns newest first, so we reverse it
  const periods = [...currentList].reverse().slice(-10);

  // Collect all unique segment names across periods
  const segmentNamesSet = new Set<string>();
  for (const p of periods) {
    if (p.segments) {
      for (const s of p.segments) {
        if (s.name) segmentNamesSet.add(s.name);
      }
    }
  }
  const segmentNames = Array.from(segmentNamesSet);

  const hasData = periods.length > 0 && segmentNames.length > 0;

  return (
    <section className="rounded-3xl border border-[#d8e2f5] bg-white p-6 shadow-[0_12px_28px_rgba(24,58,120,0.08)] sm:p-8">
      {/* Header matching Screenshot 1 */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#d8e2f5] pb-4">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-extrabold text-[#173462] sm:text-3xl">Revenue by segment</h2>
          <span className="rounded-md bg-[#f1f5f9] px-2 py-0.5 text-xs font-semibold text-[#64748b]">
            In beta
          </span>
          <button className="text-xs text-[#94a3b8] hover:text-[#64748b] transition flex items-center gap-1">
            <span>⚑</span> Flag error
          </button>
        </div>

        {/* Yearly / Quarterly Toggle */}
        <div className="inline-flex rounded-lg border border-[#d8e2f5] p-0.5 bg-[#f8fbff] self-start sm:self-auto">
          <button
            onClick={() => setPeriodType("annual")}
            className={`rounded-md px-3.5 py-1 text-xs font-bold transition ${
              periodType === "annual"
                ? "bg-white text-[#4f46e5] shadow-xs"
                : "text-[#6074a0] hover:text-[#173462]"
            }`}
          >
            Yearly
          </button>
          <button
            onClick={() => setPeriodType("quarterly")}
            className={`rounded-md px-3.5 py-1 text-xs font-bold transition ${
              periodType === "quarterly"
                ? "bg-white text-[#4f46e5] shadow-xs"
                : "text-[#6074a0] hover:text-[#173462]"
            }`}
          >
            Quarterly
          </button>
        </div>
      </div>

      {!hasData ? (
        <div className="relative overflow-hidden rounded-2xl border border-[#d8e2f5] bg-[#f8fbff] p-8 text-center">
          <div className="mx-auto max-w-md">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#eef3fb] text-xl">
              🔒
            </div>
            <h3 className="mt-3 text-base font-bold text-[#173462]">Unlock insights</h3>
            <p className="mt-1 text-xs text-[#6074a0]">
              Segment revenue data will automatically appear when available in your FinEdge plan.
            </p>
            <div className="mt-4">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#cddcf6] bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#4f46e5] shadow-xs">
                <span>🔒</span> UNLOCK
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="-mx-2 overflow-x-auto px-2">
          <table className="w-full min-w-[700px] text-right text-sm">
            <thead>
              <tr className="border-b-2 border-[#d8e2f5]">
                <th className="whitespace-nowrap px-3 py-3 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-[#6074a0]">
                  Segment
                </th>
                {periods.map((p, idx) => (
                  <th
                    key={idx}
                    className="whitespace-nowrap px-3 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#6074a0]"
                  >
                    {p.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* For each segment, show Revenue row and EBITDA/Profit row */}
              {segmentNames.map((segName, sIdx) => {
                return (
                  <tr
                    key={segName}
                    className="border-b border-[#eef3fb] transition hover:bg-[#f5f8ff]"
                  >
                    <td className="whitespace-nowrap px-3 py-3 text-left">
                      <p className="font-semibold text-[#173462]">{segName} Segment Revenue</p>
                      <p className="text-[10px] text-[#8599c1]">Rs. cr · Standalone data</p>
                    </td>
                    {periods.map((p, pIdx) => {
                      const seg = p.segments?.find((s) => s.name === segName);
                      const rev = seg?.data?.segmentRevenue;
                      return (
                        <td
                          key={pIdx}
                          className="whitespace-nowrap px-3 py-3 tabular-nums text-[#3d5178]"
                        >
                          {rev != null ? formatCr(rev) : "—"}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {/* Segment Profit Rows */}
              {segmentNames.map((segName) => {
                return (
                  <tr
                    key={`${segName}-profit`}
                    className="border-b border-[#eef3fb] transition hover:bg-[#f5f8ff]"
                  >
                    <td className="whitespace-nowrap px-3 py-3 text-left">
                      <p className="font-semibold text-[#173462]">{segName} Segment EBITDA</p>
                      <p className="text-[10px] text-[#8599c1]">Rs. cr · Standalone data</p>
                    </td>
                    {periods.map((p, pIdx) => {
                      const seg = p.segments?.find((s) => s.name === segName);
                      const prof = seg?.data?.segmentProfitLossBeforeTaxAndFinanceCosts;
                      return (
                        <td
                          key={pIdx}
                          className="whitespace-nowrap px-3 py-3 tabular-nums text-[#3d5178]"
                        >
                          {prof != null ? formatCr(prof) : "—"}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {/* Total Segment Revenue Row */}
              <tr className="border-b-2 border-[#d0d9ef] bg-[#f0f4fb] font-extrabold">
                <td className="whitespace-nowrap px-3 py-3 text-left">
                  <p className="font-extrabold text-[#173462]">Total Segment Revenue</p>
                  <p className="text-[10px] font-normal text-[#8599c1]">Rs. cr · Standalone data</p>
                </td>
                {periods.map((p, pIdx) => {
                  const total = p.data?.segmentRevenue;
                  return (
                    <td
                      key={pIdx}
                      className="whitespace-nowrap px-3 py-3 tabular-nums text-[#173462]"
                    >
                      {total != null ? formatCr(total) : "—"}
                    </td>
                  );
                })}
              </tr>

              {/* Segment Profit Before Tax */}
              <tr className="border-b border-[#d0d9ef] bg-[#f0f4fb] font-extrabold">
                <td className="whitespace-nowrap px-3 py-3 text-left">
                  <p className="font-extrabold text-[#173462]">Segment Profit Before Tax</p>
                  <p className="text-[10px] font-normal text-[#8599c1]">Rs. cr · Standalone data</p>
                </td>
                {periods.map((p, pIdx) => {
                  const pbt = p.data?.segmentProfitBeforeTax;
                  return (
                    <td
                      key={pIdx}
                      className="whitespace-nowrap px-3 py-3 tabular-nums text-[#173462]"
                    >
                      {pbt != null ? formatCr(pbt) : "—"}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>

          {/* Footer note matching screenshot */}
          
        </div>
      )}
    </section>
  );
}

