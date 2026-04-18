"use client";

import { useEffect, useMemo, useState } from "react";
import PromptToast from "@/components/ui/PromptToast";
import { useIPODashboard } from "@/hooks/useIPODashboard";
import { useTimedPrompt } from "@/hooks/useTimedPrompt";
import { toFriendlyAppErrorMessage } from "@/lib/helpers/userFacingError";
import { upsertIPODashboardData } from "@/lib/services/ipoService";
import type { ActiveUpcomingIPORow, RecentIPORow } from "@/types/ipo";

function createEmptyActiveRow(): ActiveUpcomingIPORow {
  return {
    ipoName: "",
    priceBand: "",
    dates: "",
    minInvest: "",
    gmp: "",
    type: "",
    pe: "",
    salesFy2324: "",
    salesFy2425: "",
    salesFy2526: "",
    netProfitFy2324: "",
    netProfitFy2425: "",
    netProfitFy2526: "",
    qibSub: "",
    retailSub: "",
    hniSub: "",
    totalSub: "",
    allotDate: "",
    refundDate: "",
  };
}

function createEmptyRecentRow(): RecentIPORow {
  return {
    ipoName: "",
    priceBand: "",
    listingPrice: "",
    listingGain: "",
    anchorLockIn50: "",
    anchorLockIn100: "",
    preIpoLockIn: "",
  };
}

function formatDisplayDate(value?: string) {
  if (!value) {
    return "--";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function IPODashboardForm() {
  const { latest, history, isLoading } = useIPODashboard();
  const { prompt, showPrompt, clearPrompt } = useTimedPrompt(4500);

  const [activeRows, setActiveRows] = useState<ActiveUpcomingIPORow[]>([createEmptyActiveRow()]);
  const [recentRows, setRecentRows] = useState<RecentIPORow[]>([createEmptyRecentRow()]);
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized || isLoading) {
      return;
    }

    if (latest) {
      setActiveRows(latest.activeUpcoming.length > 0 ? latest.activeUpcoming : [createEmptyActiveRow()]);
      setRecentRows(latest.recentIpos.length > 0 ? latest.recentIpos : [createEmptyRecentRow()]);
    }

    setIsInitialized(true);
  }, [isInitialized, isLoading, latest]);

  const historySummary = useMemo(
    () => history.map((item) => formatDisplayDate(item.updatedAt)).join(" | "),
    [history],
  );

  const updateActiveRow = (index: number, key: keyof ActiveUpcomingIPORow, value: string) => {
    setActiveRows((prev) => prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  };

  const updateRecentRow = (index: number, key: keyof RecentIPORow, value: string) => {
    setRecentRows((prev) => prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  };

  const addActiveRow = () => setActiveRows((prev) => [...prev, createEmptyActiveRow()]);
  const addRecentRow = () => setRecentRows((prev) => [...prev, createEmptyRecentRow()]);

  const removeActiveRow = (index: number) => {
    setActiveRows((prev) => {
      if (prev.length === 1) {
        return [createEmptyActiveRow()];
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeRecentRow = (index: number) => {
    setRecentRows((prev) => {
      if (prev.length === 1) {
        return [createEmptyRecentRow()];
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    clearPrompt();

    try {
      const saved = await upsertIPODashboardData({
        activeUpcoming: activeRows,
        recentIpos: recentRows,
      });

      showPrompt(
        `IPO dashboard updated. Rows saved: ${saved.activeUpcoming.length + saved.recentIpos.length}. Latest update: ${formatDisplayDate(saved.updatedAt)}.`,
        "success",
      );
    } catch (error) {
      showPrompt(toFriendlyAppErrorMessage(error, "Failed to update IPO dashboard."), "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {prompt ? <PromptToast message={prompt.message} tone={prompt.tone} /> : null}

      <div className="rounded-xl border border-[#d8e2f5] bg-[#f6f9ff] px-4 py-3 text-xs font-medium text-[#6074a0]">
        <p>Latest update: {formatDisplayDate(latest?.updatedAt)}</p>
        <p className="mt-1">Auto-retention: only last 10 days are kept in Firebase.</p>
        <p className="mt-1 truncate">Recent snapshots: {historySummary || "--"}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl border border-[#d8e2f5] bg-white p-4 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-extrabold text-[#173462]">Active/Upcoming IPO</h3>
            <button
              type="button"
              onClick={addActiveRow}
              className="rounded-lg border border-[#d8e2f5] bg-[#f6f9ff] px-3 py-1.5 text-xs font-bold text-[#2e7ac9]"
            >
              + Add Row
            </button>
          </div>

          <div className="space-y-4">
            {activeRows.map((row, index) => (
              <div key={`active-${index}`} className="rounded-xl border border-[#e1e8f8] bg-[#fbfdff] p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6074a0]">Row {index + 1}</p>
                  <button
                    type="button"
                    onClick={() => removeActiveRow(index)}
                    className="rounded-md border border-[#ffd0d8] bg-[#fff5f7] px-2 py-1 text-xs font-bold text-[#c24d62]"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  <input value={row.ipoName} onChange={(e) => updateActiveRow(index, "ipoName", e.target.value)} placeholder="IPO Name" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                  <input value={row.priceBand} onChange={(e) => updateActiveRow(index, "priceBand", e.target.value)} placeholder="Price Band" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                  <input value={row.dates} onChange={(e) => updateActiveRow(index, "dates", e.target.value)} placeholder="Dates" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                  <input value={row.minInvest} onChange={(e) => updateActiveRow(index, "minInvest", e.target.value)} placeholder="Min Invest" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                  <input value={row.gmp} onChange={(e) => updateActiveRow(index, "gmp", e.target.value)} placeholder="GMP" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                  <input value={row.type} onChange={(e) => updateActiveRow(index, "type", e.target.value)} placeholder="Type" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                  <input value={row.pe} onChange={(e) => updateActiveRow(index, "pe", e.target.value)} placeholder="P/E" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                  <input value={row.salesFy2324} onChange={(e) => updateActiveRow(index, "salesFy2324", e.target.value)} placeholder="Sales FY 23-24" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                  <input value={row.salesFy2425} onChange={(e) => updateActiveRow(index, "salesFy2425", e.target.value)} placeholder="Sales FY 24-25" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                  <input value={row.salesFy2526} onChange={(e) => updateActiveRow(index, "salesFy2526", e.target.value)} placeholder="Sales FY 25-26" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                  <input value={row.netProfitFy2324} onChange={(e) => updateActiveRow(index, "netProfitFy2324", e.target.value)} placeholder="Net Profit FY 23-24" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                  <input value={row.netProfitFy2425} onChange={(e) => updateActiveRow(index, "netProfitFy2425", e.target.value)} placeholder="Net Profit FY 24-25" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                  <input value={row.netProfitFy2526} onChange={(e) => updateActiveRow(index, "netProfitFy2526", e.target.value)} placeholder="Net Profit FY 25-26" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                  <input value={row.qibSub} onChange={(e) => updateActiveRow(index, "qibSub", e.target.value)} placeholder="QIB Sub" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                  <input value={row.retailSub} onChange={(e) => updateActiveRow(index, "retailSub", e.target.value)} placeholder="Retail Sub" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                  <input value={row.hniSub} onChange={(e) => updateActiveRow(index, "hniSub", e.target.value)} placeholder="HNI Sub" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                  <input value={row.totalSub} onChange={(e) => updateActiveRow(index, "totalSub", e.target.value)} placeholder="Total Sub" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                  <input value={row.allotDate} onChange={(e) => updateActiveRow(index, "allotDate", e.target.value)} placeholder="Allot Date" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                  <input value={row.refundDate} onChange={(e) => updateActiveRow(index, "refundDate", e.target.value)} placeholder="Refund Date" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#d8e2f5] bg-white p-4 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-extrabold text-[#173462]">Recent IPOs</h3>
            <button
              type="button"
              onClick={addRecentRow}
              className="rounded-lg border border-[#d8e2f5] bg-[#f6f9ff] px-3 py-1.5 text-xs font-bold text-[#2e7ac9]"
            >
              + Add Row
            </button>
          </div>

          <div className="space-y-4">
            {recentRows.map((row, index) => (
              <div key={`recent-${index}`} className="rounded-xl border border-[#e1e8f8] bg-[#fbfdff] p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6074a0]">Row {index + 1}</p>
                  <button
                    type="button"
                    onClick={() => removeRecentRow(index)}
                    className="rounded-md border border-[#ffd0d8] bg-[#fff5f7] px-2 py-1 text-xs font-bold text-[#c24d62]"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  <input value={row.ipoName} onChange={(e) => updateRecentRow(index, "ipoName", e.target.value)} placeholder="IPO Name" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                  <input value={row.priceBand} onChange={(e) => updateRecentRow(index, "priceBand", e.target.value)} placeholder="Price Band" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                  <input value={row.listingPrice} onChange={(e) => updateRecentRow(index, "listingPrice", e.target.value)} placeholder="Listing Price" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                  <input value={row.listingGain} onChange={(e) => updateRecentRow(index, "listingGain", e.target.value)} placeholder="Listing Gain" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                  <input value={row.anchorLockIn50} onChange={(e) => updateRecentRow(index, "anchorLockIn50", e.target.value)} placeholder="Anchor Lock-in 50%" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                  <input value={row.anchorLockIn100} onChange={(e) => updateRecentRow(index, "anchorLockIn100", e.target.value)} placeholder="Anchor Lock-in 100%" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                  <input value={row.preIpoLockIn} onChange={(e) => updateRecentRow(index, "preIpoLockIn", e.target.value)} placeholder="Pre-IPO Lock-in" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462] sm:col-span-2 lg:col-span-1" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full rounded-xl bg-linear-to-r from-[#2e7ac9] to-[#3e8ed6] px-6 py-3 text-center font-bold text-white shadow-[0_0_20px_rgba(67,83,255,0.4)] transition hover:from-[#3e8ed6] hover:to-[#7A8DFF] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? "Saving IPO Dashboard..." : "Update IPO Dashboard"}
        </button>
      </form>
    </div>
  );
}
