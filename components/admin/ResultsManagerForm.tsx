"use client";

import { useMemo, useState } from "react";
import PromptToast from "@/components/ui/PromptToast";
import { useCompanyResults } from "@/hooks/useCompanyResults";
import { useTimedPrompt } from "@/hooks/useTimedPrompt";
import { toFriendlyAppErrorMessage } from "@/lib/helpers/userFacingError";
import {
  createCompanyResult,
  deleteCompanyResult,
  updateCompanyResult,
} from "@/lib/services/resultService";
import type { CompanyResultInput } from "@/types/result";

function createEmptyInput(): CompanyResultInput {
  return {
    companyName: "",
    marketCap: "",
    monthLabel1: "",
    monthLabel2: "",
    monthLabel3: "",
    sales: { yoy: "", qoq: "", month1: "", month2: "", month3: "" },
    netProfit: { yoy: "", qoq: "", month1: "", month2: "", month3: "" },
    eps: { yoy: "", qoq: "", month1: "", month2: "", month3: "" },
    auditPoints: [],
    crux: "",
  };
}

function parseAuditPoints(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function auditPointsToText(points: string[]) {
  return points.join("\n");
}

type RowKey = "sales" | "netProfit" | "eps";
type CellKey = "yoy" | "qoq" | "month1" | "month2" | "month3";

export default function ResultsManagerForm() {
  const { results, isLoading } = useCompanyResults();
  const { prompt, showPrompt, clearPrompt } = useTimedPrompt(4500);

  const toCompanyInput = (item: (typeof results)[number]): CompanyResultInput => ({
    companyName: item.companyName,
    marketCap: item.marketCap,
    monthLabel1: item.monthLabel1,
    monthLabel2: item.monthLabel2,
    monthLabel3: item.monthLabel3,
    sales: { ...item.sales },
    netProfit: { ...item.netProfit },
    eps: { ...item.eps },
    auditPoints: [...item.auditPoints],
    crux: item.crux,
  });

  const getExistingInputById = (id: string) => {
    const item = results.find((entry) => entry.id === id);
    return item ? toCompanyInput(item) : createEmptyInput();
  };

  const [newItem, setNewItem] = useState<CompanyResultInput>(createEmptyInput());
  const [newAuditText, setNewAuditText] = useState("");
  const [drafts, setDrafts] = useState<Record<string, CompanyResultInput>>({});
  const [draftAuditText, setDraftAuditText] = useState<Record<string, string>>({});
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const rows = useMemo(
    () =>
      results.map((item) => ({
        id: item.id,
        values: drafts[item.id] ?? toCompanyInput(item),
        auditText: draftAuditText[item.id] ?? auditPointsToText((drafts[item.id] ?? toCompanyInput(item)).auditPoints),
      })),
    [draftAuditText, drafts, results],
  );

  const setNewField = (key: keyof CompanyResultInput, value: string) => {
    if (key === "sales" || key === "netProfit" || key === "eps") {
      return;
    }

    setNewItem((prev) => ({ ...prev, [key]: value }));
  };

  const setNewMetricField = (row: RowKey, key: CellKey, value: string) => {
    setNewItem((prev) => ({
      ...prev,
      [row]: {
        ...prev[row],
        [key]: value,
      },
    }));
  };

  const setDraftField = (id: string, key: keyof CompanyResultInput, value: string) => {
    setDrafts((prev) => {
      const base = prev[id] ?? getExistingInputById(id);
      if (key === "auditPoints") {
        return {
          ...prev,
          [id]: {
            ...base,
            auditPoints: parseAuditPoints(value),
          },
        };
      }

      if (key === "sales" || key === "netProfit" || key === "eps") {
        return prev;
      }

      return {
        ...prev,
        [id]: {
          ...base,
          [key]: value,
        },
      };
    });
  };

  const setDraftMetricField = (id: string, row: RowKey, key: CellKey, value: string) => {
    setDrafts((prev) => {
      const base = prev[id] ?? getExistingInputById(id);
      return {
        ...prev,
        [id]: {
          ...base,
          [row]: {
            ...base[row],
            [key]: value,
          },
        },
      };
    });
  };

  const handleCreate = async () => {
    clearPrompt();
    setBusyKey("create");
    try {
      await createCompanyResult(newItem);
      setNewItem(createEmptyInput());
      setNewAuditText("");
      showPrompt("Company result added successfully.", "success");
    } catch (error) {
      showPrompt(toFriendlyAppErrorMessage(error, "Failed to add company result."), "error");
    } finally {
      setBusyKey(null);
    }
  };

  const handleNewAuditPointsChange = (value: string) => {
    setNewAuditText(value);
    setNewItem((prev) => ({ ...prev, auditPoints: parseAuditPoints(value) }));
  };

  const handleDraftAuditPointsChange = (id: string, value: string) => {
    setDraftAuditText((prev) => ({ ...prev, [id]: value }));
    setDrafts((prev) => {
      const base = prev[id] ?? getExistingInputById(id);
      return {
        ...prev,
        [id]: {
          ...base,
          auditPoints: parseAuditPoints(value),
        },
      };
    });
  };

  const handleUpdate = async (id: string, value: CompanyResultInput) => {
    clearPrompt();
    setBusyKey(`update-${id}`);
    try {
      await updateCompanyResult(id, value);
      showPrompt("Company result updated successfully.", "success");
    } catch (error) {
      showPrompt(toFriendlyAppErrorMessage(error, "Failed to update company result."), "error");
    } finally {
      setBusyKey(null);
    }
  };

  const handleDelete = async (id: string, companyName: string) => {
    if (!window.confirm(`Delete complete result table for ${companyName || "this company"}?`)) {
      return;
    }

    clearPrompt();
    setBusyKey(`delete-${id}`);
    try {
      await deleteCompanyResult(id);
      showPrompt("Company result deleted.", "success");
    } catch (error) {
      showPrompt(toFriendlyAppErrorMessage(error, "Failed to delete company result."), "error");
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <div className="space-y-6">
      {prompt ? <PromptToast message={prompt.message} tone={prompt.tone} /> : null}

      <section className="rounded-2xl border border-[#d8e2f5] bg-white p-4 shadow-sm sm:p-5">
        <h3 className="text-lg font-extrabold text-[#173462]">Add New Company Result</h3>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input value={newItem.companyName} onChange={(e) => setNewField("companyName", e.target.value)} placeholder="Company Name" className="rounded-lg border border-[#d8e2f5] px-3 py-2 text-sm text-[#173462]" />
          <input value={newItem.marketCap} onChange={(e) => setNewField("marketCap", e.target.value)} placeholder="M.Cap (e.g. 1200cr)" className="rounded-lg border border-[#d8e2f5] px-3 py-2 text-sm text-[#173462]" />
          <input value={newItem.monthLabel1} onChange={(e) => setNewField("monthLabel1", e.target.value)} placeholder="Month Label 1 (e.g. Mar-26)" className="rounded-lg border border-[#d8e2f5] px-3 py-2 text-sm text-[#173462]" />
          <input value={newItem.monthLabel2} onChange={(e) => setNewField("monthLabel2", e.target.value)} placeholder="Month Label 2 (e.g. Dec-25)" className="rounded-lg border border-[#d8e2f5] px-3 py-2 text-sm text-[#173462]" />
          <input value={newItem.monthLabel3} onChange={(e) => setNewField("monthLabel3", e.target.value)} placeholder="Month Label 3 (e.g. Mar-25)" className="rounded-lg border border-[#d8e2f5] px-3 py-2 text-sm text-[#173462]" />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {(["sales", "netProfit", "eps"] as RowKey[]).map((rowKey) => (
            <div key={`new-${rowKey}`} className="rounded-xl border border-[#d8e2f5] bg-[#fbfdff] p-3">
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.08em] text-[#6074a0]">{rowKey === "netProfit" ? "Net Profit" : rowKey}</p>
              <div className="space-y-2">
                <input value={newItem[rowKey].yoy} onChange={(e) => setNewMetricField(rowKey, "yoy", e.target.value)} placeholder="YOY" className="w-full rounded-lg border border-[#d8e2f5] px-3 py-2 text-sm" />
                <input value={newItem[rowKey].qoq} onChange={(e) => setNewMetricField(rowKey, "qoq", e.target.value)} placeholder="QOQ" className="w-full rounded-lg border border-[#d8e2f5] px-3 py-2 text-sm" />
                <input value={newItem[rowKey].month1} onChange={(e) => setNewMetricField(rowKey, "month1", e.target.value)} placeholder="Month 1 Value" className="w-full rounded-lg border border-[#d8e2f5] px-3 py-2 text-sm" />
                <input value={newItem[rowKey].month2} onChange={(e) => setNewMetricField(rowKey, "month2", e.target.value)} placeholder="Month 2 Value" className="w-full rounded-lg border border-[#d8e2f5] px-3 py-2 text-sm" />
                <input value={newItem[rowKey].month3} onChange={(e) => setNewMetricField(rowKey, "month3", e.target.value)} placeholder="Month 3 Value" className="w-full rounded-lg border border-[#d8e2f5] px-3 py-2 text-sm" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <textarea
            value={newAuditText}
            onChange={(e) => handleNewAuditPointsChange(e.target.value)}
            placeholder="Audit Points (one point per line)"
            rows={5}
            className="w-full rounded-lg border border-[#d8e2f5] px-3 py-2 text-sm text-[#173462]"
          />
          <textarea
            value={newItem.crux}
            onChange={(e) => setNewField("crux", e.target.value)}
            placeholder="Crux description"
            rows={5}
            className="w-full rounded-lg border border-[#d8e2f5] px-3 py-2 text-sm text-[#173462]"
          />
        </div>

        <button
          type="button"
          disabled={busyKey !== null}
          onClick={handleCreate}
          className="mt-4 rounded-xl bg-[#2e7ac9] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
        >
          Add Company Result
        </button>
      </section>

      <section className="rounded-2xl border border-[#d8e2f5] bg-white p-4 shadow-sm sm:p-5">
        <h3 className="text-lg font-extrabold text-[#173462]">Manage Existing Company Results</h3>
        {isLoading ? <p className="mt-3 text-sm text-[#6074a0]">Loading company results...</p> : null}

        <div className="mt-4 space-y-4">
          {rows.length === 0 && !isLoading ? (
            <p className="rounded-xl border border-dashed border-[#d8e2f5] bg-[#fbfdff] p-4 text-sm text-[#6074a0]">
              No company result tables added yet.
            </p>
          ) : null}

          {rows.map((row, index) => (
            <div key={row.id} className="rounded-xl border border-[#d8e2f5] bg-[#fbfdff] p-3">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-extrabold text-[#173462]">Company #{index + 1}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={busyKey !== null}
                    onClick={() => handleUpdate(row.id, row.values)}
                    className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-1.5 text-xs font-bold text-[#2e7ac9] disabled:opacity-50"
                  >
                    Update Company
                  </button>
                  <button
                    type="button"
                    disabled={busyKey !== null}
                    onClick={() => handleDelete(row.id, row.values.companyName)}
                    className="rounded-lg border border-[#ffd0d8] bg-[#fff5f7] px-3 py-1.5 text-xs font-bold text-[#c24d62] disabled:opacity-50"
                  >
                    Delete Company
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <input value={row.values.companyName} onChange={(e) => setDraftField(row.id, "companyName", e.target.value)} placeholder="Company Name" className="rounded-lg border border-[#d8e2f5] px-3 py-2 text-sm" />
                <input value={row.values.marketCap} onChange={(e) => setDraftField(row.id, "marketCap", e.target.value)} placeholder="M.Cap" className="rounded-lg border border-[#d8e2f5] px-3 py-2 text-sm" />
                <input value={row.values.monthLabel1} onChange={(e) => setDraftField(row.id, "monthLabel1", e.target.value)} placeholder="Month Label 1" className="rounded-lg border border-[#d8e2f5] px-3 py-2 text-sm" />
                <input value={row.values.monthLabel2} onChange={(e) => setDraftField(row.id, "monthLabel2", e.target.value)} placeholder="Month Label 2" className="rounded-lg border border-[#d8e2f5] px-3 py-2 text-sm" />
                <input value={row.values.monthLabel3} onChange={(e) => setDraftField(row.id, "monthLabel3", e.target.value)} placeholder="Month Label 3" className="rounded-lg border border-[#d8e2f5] px-3 py-2 text-sm" />
              </div>

              <div className="mt-3 grid gap-4 lg:grid-cols-3">
                {(["sales", "netProfit", "eps"] as RowKey[]).map((rowKey) => (
                  <div key={`${row.id}-${rowKey}`} className="rounded-xl border border-[#d8e2f5] bg-white p-3">
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-[#6074a0]">{rowKey === "netProfit" ? "Net Profit" : rowKey}</p>
                    <div className="space-y-2">
                      <input value={row.values[rowKey].yoy} onChange={(e) => setDraftMetricField(row.id, rowKey, "yoy", e.target.value)} placeholder="YOY" className="w-full rounded-lg border border-[#d8e2f5] px-3 py-2 text-sm" />
                      <input value={row.values[rowKey].qoq} onChange={(e) => setDraftMetricField(row.id, rowKey, "qoq", e.target.value)} placeholder="QOQ" className="w-full rounded-lg border border-[#d8e2f5] px-3 py-2 text-sm" />
                      <input value={row.values[rowKey].month1} onChange={(e) => setDraftMetricField(row.id, rowKey, "month1", e.target.value)} placeholder="Month 1 Value" className="w-full rounded-lg border border-[#d8e2f5] px-3 py-2 text-sm" />
                      <input value={row.values[rowKey].month2} onChange={(e) => setDraftMetricField(row.id, rowKey, "month2", e.target.value)} placeholder="Month 2 Value" className="w-full rounded-lg border border-[#d8e2f5] px-3 py-2 text-sm" />
                      <input value={row.values[rowKey].month3} onChange={(e) => setDraftMetricField(row.id, rowKey, "month3", e.target.value)} placeholder="Month 3 Value" className="w-full rounded-lg border border-[#d8e2f5] px-3 py-2 text-sm" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                <textarea
                  value={row.auditText}
                  onChange={(e) => handleDraftAuditPointsChange(row.id, e.target.value)}
                  placeholder="Audit Points (one per line)"
                  rows={4}
                  className="rounded-lg border border-[#d8e2f5] px-3 py-2 text-sm"
                />
                <textarea
                  value={row.values.crux}
                  onChange={(e) => setDraftField(row.id, "crux", e.target.value)}
                  placeholder="Crux description"
                  rows={4}
                  className="rounded-lg border border-[#d8e2f5] px-3 py-2 text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
