"use client";

import { useMemo, useState } from "react";
import PromptToast from "@/components/ui/PromptToast";
import { useIPODashboard } from "@/hooks/useIPODashboard";
import { useTimedPrompt } from "@/hooks/useTimedPrompt";
import { toFriendlyAppErrorMessage } from "@/lib/helpers/userFacingError";
import {
  createActiveUpcomingRow,
  createRecentIpoRow,
  deleteIpoRow,
  updateActiveUpcomingRow,
  updateRecentIpoRow,
} from "@/lib/services/ipoService";
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

function formatDisplayDate(value?: string | null) {
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
  const { activeUpcoming, recentIpos, lastUpdatedAt, isLoading } = useIPODashboard();
  const { prompt, showPrompt, clearPrompt } = useTimedPrompt(4500);

  const [newActive, setNewActive] = useState<ActiveUpcomingIPORow>(createEmptyActiveRow());
  const [newRecent, setNewRecent] = useState<RecentIPORow>(createEmptyRecentRow());
  const [activeDrafts, setActiveDrafts] = useState<Record<string, ActiveUpcomingIPORow>>({});
  const [recentDrafts, setRecentDrafts] = useState<Record<string, RecentIPORow>>({});
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const activeRows = useMemo(
    () =>
      activeUpcoming.map((row) => ({
        id: row.id,
        updatedAt: row.updatedAt,
        values: activeDrafts[row.id] ?? {
          ipoName: row.ipoName,
          priceBand: row.priceBand,
          dates: row.dates,
          minInvest: row.minInvest,
          gmp: row.gmp,
          type: row.type,
          pe: row.pe,
          salesFy2324: row.salesFy2324,
          salesFy2425: row.salesFy2425,
          salesFy2526: row.salesFy2526,
          netProfitFy2324: row.netProfitFy2324,
          netProfitFy2425: row.netProfitFy2425,
          netProfitFy2526: row.netProfitFy2526,
          qibSub: row.qibSub,
          retailSub: row.retailSub,
          hniSub: row.hniSub,
          totalSub: row.totalSub,
          allotDate: row.allotDate,
          refundDate: row.refundDate,
        },
      })),
    [activeDrafts, activeUpcoming],
  );

  const recentRows = useMemo(
    () =>
      recentIpos.map((row) => ({
        id: row.id,
        updatedAt: row.updatedAt,
        values: recentDrafts[row.id] ?? {
          ipoName: row.ipoName,
          priceBand: row.priceBand,
          listingPrice: row.listingPrice,
          listingGain: row.listingGain,
          anchorLockIn50: row.anchorLockIn50,
          anchorLockIn100: row.anchorLockIn100,
          preIpoLockIn: row.preIpoLockIn,
        },
      })),
    [recentDrafts, recentIpos],
  );

  const setActiveField = (key: keyof ActiveUpcomingIPORow, value: string) => {
    setNewActive((prev) => ({ ...prev, [key]: value }));
  };

  const setRecentField = (key: keyof RecentIPORow, value: string) => {
    setNewRecent((prev) => ({ ...prev, [key]: value }));
  };

  const setActiveDraftField = (id: string, key: keyof ActiveUpcomingIPORow, value: string) => {
    setActiveDrafts((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] ?? createEmptyActiveRow()),
        [key]: value,
      },
    }));
  };

  const setRecentDraftField = (id: string, key: keyof RecentIPORow, value: string) => {
    setRecentDrafts((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] ?? createEmptyRecentRow()),
        [key]: value,
      },
    }));
  };

  const handleCreateActive = async () => {
    setBusyKey("create-active");
    clearPrompt();
    try {
      await createActiveUpcomingRow(newActive);
      setNewActive(createEmptyActiveRow());
      showPrompt("New Active/Upcoming IPO row posted.", "success");
    } catch (error) {
      showPrompt(toFriendlyAppErrorMessage(error, "Failed to post Active/Upcoming IPO row."), "error");
    } finally {
      setBusyKey(null);
    }
  };

  const handleCreateRecent = async () => {
    setBusyKey("create-recent");
    clearPrompt();
    try {
      await createRecentIpoRow(newRecent);
      setNewRecent(createEmptyRecentRow());
      showPrompt("New Recent IPO row posted.", "success");
    } catch (error) {
      showPrompt(toFriendlyAppErrorMessage(error, "Failed to post Recent IPO row."), "error");
    } finally {
      setBusyKey(null);
    }
  };

  const handleUpdateActive = async (id: string, values: ActiveUpcomingIPORow) => {
    setBusyKey(`update-${id}`);
    clearPrompt();
    try {
      await updateActiveUpcomingRow(id, values);
      showPrompt("Active/Upcoming IPO row updated.", "success");
    } catch (error) {
      showPrompt(toFriendlyAppErrorMessage(error, "Failed to update Active/Upcoming IPO row."), "error");
    } finally {
      setBusyKey(null);
    }
  };

  const handleUpdateRecent = async (id: string, values: RecentIPORow) => {
    setBusyKey(`update-${id}`);
    clearPrompt();
    try {
      await updateRecentIpoRow(id, values);
      showPrompt("Recent IPO row updated.", "success");
    } catch (error) {
      showPrompt(toFriendlyAppErrorMessage(error, "Failed to update Recent IPO row."), "error");
    } finally {
      setBusyKey(null);
    }
  };

  const handleDeleteRow = async (id: string) => {
    setBusyKey(`delete-${id}`);
    clearPrompt();
    try {
      await deleteIpoRow(id);
      showPrompt("IPO row deleted.", "success");
    } catch (error) {
      showPrompt(toFriendlyAppErrorMessage(error, "Failed to delete IPO row."), "error");
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <div className="space-y-5">
      {prompt ? <PromptToast message={prompt.message} tone={prompt.tone} /> : null}

      <div className="rounded-xl border border-[#d8e2f5] bg-[#f6f9ff] px-4 py-3 text-xs font-medium text-[#6074a0]">
        <p>Latest update: {formatDisplayDate(lastUpdatedAt)}</p>
        <p className="mt-1">Each table keeps only latest 10 rows. Oldest rows auto-delete.</p>
      </div>

      <section className="rounded-2xl border border-[#d8e2f5] bg-white p-4 shadow-sm">
        <h3 className="text-lg font-extrabold text-[#173462]">Post New Active/Upcoming IPO Row</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <input value={newActive.ipoName} onChange={(e) => setActiveField("ipoName", e.target.value)} placeholder="IPO Name" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
          <input value={newActive.priceBand} onChange={(e) => setActiveField("priceBand", e.target.value)} placeholder="Price Band" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
          <input value={newActive.dates} onChange={(e) => setActiveField("dates", e.target.value)} placeholder="Dates" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
          <input value={newActive.minInvest} onChange={(e) => setActiveField("minInvest", e.target.value)} placeholder="Min Invest" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
          <input value={newActive.gmp} onChange={(e) => setActiveField("gmp", e.target.value)} placeholder="GMP" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
          <input value={newActive.type} onChange={(e) => setActiveField("type", e.target.value)} placeholder="Type" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
          <input value={newActive.pe} onChange={(e) => setActiveField("pe", e.target.value)} placeholder="P/E" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
          <input value={newActive.salesFy2324} onChange={(e) => setActiveField("salesFy2324", e.target.value)} placeholder="Sales FY 23-24" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
          <input value={newActive.salesFy2425} onChange={(e) => setActiveField("salesFy2425", e.target.value)} placeholder="Sales FY 24-25" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
          <input value={newActive.salesFy2526} onChange={(e) => setActiveField("salesFy2526", e.target.value)} placeholder="Sales FY 25-26" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
          <input value={newActive.netProfitFy2324} onChange={(e) => setActiveField("netProfitFy2324", e.target.value)} placeholder="Net Profit FY 23-24" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
          <input value={newActive.netProfitFy2425} onChange={(e) => setActiveField("netProfitFy2425", e.target.value)} placeholder="Net Profit FY 24-25" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
          <input value={newActive.netProfitFy2526} onChange={(e) => setActiveField("netProfitFy2526", e.target.value)} placeholder="Net Profit FY 25-26" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
          <input value={newActive.qibSub} onChange={(e) => setActiveField("qibSub", e.target.value)} placeholder="QIB Sub" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
          <input value={newActive.retailSub} onChange={(e) => setActiveField("retailSub", e.target.value)} placeholder="Retail Sub" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
          <input value={newActive.hniSub} onChange={(e) => setActiveField("hniSub", e.target.value)} placeholder="HNI Sub" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
          <input value={newActive.totalSub} onChange={(e) => setActiveField("totalSub", e.target.value)} placeholder="Total Sub" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
          <input value={newActive.allotDate} onChange={(e) => setActiveField("allotDate", e.target.value)} placeholder="Allot Date" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
          <input value={newActive.refundDate} onChange={(e) => setActiveField("refundDate", e.target.value)} placeholder="Refund Date" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
        </div>
        <button
          type="button"
          disabled={busyKey !== null}
          onClick={handleCreateActive}
          className="mt-4 rounded-xl bg-[#2e7ac9] px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Post Active/Upcoming Row
        </button>
      </section>

      <section className="rounded-2xl border border-[#d8e2f5] bg-white p-4 shadow-sm">
        <h3 className="text-lg font-extrabold text-[#173462]">Post New Recent IPO Row</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <input value={newRecent.ipoName} onChange={(e) => setRecentField("ipoName", e.target.value)} placeholder="IPO Name" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
          <input value={newRecent.priceBand} onChange={(e) => setRecentField("priceBand", e.target.value)} placeholder="Price Band" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
          <input value={newRecent.listingPrice} onChange={(e) => setRecentField("listingPrice", e.target.value)} placeholder="Listing Price" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
          <input value={newRecent.listingGain} onChange={(e) => setRecentField("listingGain", e.target.value)} placeholder="Listing Gain" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
          <input value={newRecent.anchorLockIn50} onChange={(e) => setRecentField("anchorLockIn50", e.target.value)} placeholder="Anchor Lock-in 50%" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
          <input value={newRecent.anchorLockIn100} onChange={(e) => setRecentField("anchorLockIn100", e.target.value)} placeholder="Anchor Lock-in 100%" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
          <input value={newRecent.preIpoLockIn} onChange={(e) => setRecentField("preIpoLockIn", e.target.value)} placeholder="Pre-IPO Lock-in" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
        </div>
        <button
          type="button"
          disabled={busyKey !== null}
          onClick={handleCreateRecent}
          className="mt-4 rounded-xl bg-[#2e7ac9] px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Post Recent IPO Row
        </button>
      </section>

      <section className="rounded-2xl border border-[#d8e2f5] bg-white p-4 shadow-sm">
        <h3 className="text-lg font-extrabold text-[#173462]">Manage Active/Upcoming Rows (Latest 10)</h3>
        {isLoading ? <p className="mt-3 text-sm text-[#6074a0]">Loading rows...</p> : null}
        <div className="mt-3 space-y-4">
          {activeRows.map((row, index) => (
            <div key={row.id} className="rounded-xl border border-[#e1e8f8] bg-[#fbfdff] p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6074a0]">
                  Row {index + 1} | Updated: {formatDisplayDate(row.updatedAt)}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={busyKey !== null}
                    onClick={() => handleUpdateActive(row.id, row.values)}
                    className="rounded-md border border-[#d8e2f5] bg-white px-2 py-1 text-xs font-bold text-[#2e7ac9] disabled:opacity-50"
                  >
                    Update Row
                  </button>
                  <button
                    type="button"
                    disabled={busyKey !== null}
                    onClick={() => handleDeleteRow(row.id)}
                    className="rounded-md border border-[#ffd0d8] bg-[#fff5f7] px-2 py-1 text-xs font-bold text-[#c24d62] disabled:opacity-50"
                  >
                    Delete Row
                  </button>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <input value={row.values.ipoName} onChange={(e) => setActiveDraftField(row.id, "ipoName", e.target.value)} placeholder="IPO Name" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                <input value={row.values.priceBand} onChange={(e) => setActiveDraftField(row.id, "priceBand", e.target.value)} placeholder="Price Band" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                <input value={row.values.dates} onChange={(e) => setActiveDraftField(row.id, "dates", e.target.value)} placeholder="Dates" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                <input value={row.values.minInvest} onChange={(e) => setActiveDraftField(row.id, "minInvest", e.target.value)} placeholder="Min Invest" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                <input value={row.values.gmp} onChange={(e) => setActiveDraftField(row.id, "gmp", e.target.value)} placeholder="GMP" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                <input value={row.values.type} onChange={(e) => setActiveDraftField(row.id, "type", e.target.value)} placeholder="Type" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                <input value={row.values.pe} onChange={(e) => setActiveDraftField(row.id, "pe", e.target.value)} placeholder="P/E" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                <input value={row.values.salesFy2324} onChange={(e) => setActiveDraftField(row.id, "salesFy2324", e.target.value)} placeholder="Sales FY 23-24" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                <input value={row.values.salesFy2425} onChange={(e) => setActiveDraftField(row.id, "salesFy2425", e.target.value)} placeholder="Sales FY 24-25" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                <input value={row.values.salesFy2526} onChange={(e) => setActiveDraftField(row.id, "salesFy2526", e.target.value)} placeholder="Sales FY 25-26" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                <input value={row.values.netProfitFy2324} onChange={(e) => setActiveDraftField(row.id, "netProfitFy2324", e.target.value)} placeholder="Net Profit FY 23-24" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                <input value={row.values.netProfitFy2425} onChange={(e) => setActiveDraftField(row.id, "netProfitFy2425", e.target.value)} placeholder="Net Profit FY 24-25" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                <input value={row.values.netProfitFy2526} onChange={(e) => setActiveDraftField(row.id, "netProfitFy2526", e.target.value)} placeholder="Net Profit FY 25-26" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                <input value={row.values.qibSub} onChange={(e) => setActiveDraftField(row.id, "qibSub", e.target.value)} placeholder="QIB Sub" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                <input value={row.values.retailSub} onChange={(e) => setActiveDraftField(row.id, "retailSub", e.target.value)} placeholder="Retail Sub" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                <input value={row.values.hniSub} onChange={(e) => setActiveDraftField(row.id, "hniSub", e.target.value)} placeholder="HNI Sub" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                <input value={row.values.totalSub} onChange={(e) => setActiveDraftField(row.id, "totalSub", e.target.value)} placeholder="Total Sub" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                <input value={row.values.allotDate} onChange={(e) => setActiveDraftField(row.id, "allotDate", e.target.value)} placeholder="Allot Date" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                <input value={row.values.refundDate} onChange={(e) => setActiveDraftField(row.id, "refundDate", e.target.value)} placeholder="Refund Date" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[#d8e2f5] bg-white p-4 shadow-sm">
        <h3 className="text-lg font-extrabold text-[#173462]">Manage Recent IPO Rows (Latest 10)</h3>
        {isLoading ? <p className="mt-3 text-sm text-[#6074a0]">Loading rows...</p> : null}
        <div className="mt-3 space-y-4">
          {recentRows.map((row, index) => (
            <div key={row.id} className="rounded-xl border border-[#e1e8f8] bg-[#fbfdff] p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6074a0]">
                  Row {index + 1} | Updated: {formatDisplayDate(row.updatedAt)}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={busyKey !== null}
                    onClick={() => handleUpdateRecent(row.id, row.values)}
                    className="rounded-md border border-[#d8e2f5] bg-white px-2 py-1 text-xs font-bold text-[#2e7ac9] disabled:opacity-50"
                  >
                    Update Row
                  </button>
                  <button
                    type="button"
                    disabled={busyKey !== null}
                    onClick={() => handleDeleteRow(row.id)}
                    className="rounded-md border border-[#ffd0d8] bg-[#fff5f7] px-2 py-1 text-xs font-bold text-[#c24d62] disabled:opacity-50"
                  >
                    Delete Row
                  </button>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <input value={row.values.ipoName} onChange={(e) => setRecentDraftField(row.id, "ipoName", e.target.value)} placeholder="IPO Name" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                <input value={row.values.priceBand} onChange={(e) => setRecentDraftField(row.id, "priceBand", e.target.value)} placeholder="Price Band" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                <input value={row.values.listingPrice} onChange={(e) => setRecentDraftField(row.id, "listingPrice", e.target.value)} placeholder="Listing Price" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                <input value={row.values.listingGain} onChange={(e) => setRecentDraftField(row.id, "listingGain", e.target.value)} placeholder="Listing Gain" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                <input value={row.values.anchorLockIn50} onChange={(e) => setRecentDraftField(row.id, "anchorLockIn50", e.target.value)} placeholder="Anchor Lock-in 50%" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                <input value={row.values.anchorLockIn100} onChange={(e) => setRecentDraftField(row.id, "anchorLockIn100", e.target.value)} placeholder="Anchor Lock-in 100%" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                <input value={row.values.preIpoLockIn} onChange={(e) => setRecentDraftField(row.id, "preIpoLockIn", e.target.value)} placeholder="Pre-IPO Lock-in" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
