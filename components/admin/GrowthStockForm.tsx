"use client";

import { useState } from "react";
import PromptToast from "@/components/ui/PromptToast";
import { useGrowthStocks } from "@/hooks/useGrowthStocks";
import { useTimedPrompt } from "@/hooks/useTimedPrompt";
import { toFriendlyAppErrorMessage } from "@/lib/helpers/userFacingError";
import {
  createGrowthStock,
  deleteGrowthStock,
  updateGrowthStock,
} from "@/lib/services/growthStockService";
import type { GrowthStockRow } from "@/types/growthStock";

function createEmptyRow(): GrowthStockRow {
  return {
    dateOfPost: "",
    company: "",
    sector: "",
    pe: "",
    growthFactors: [],
    description: "",
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

export default function GrowthStockForm() {
  const { stocks, isLoading } = useGrowthStocks();
  const { prompt, showPrompt, clearPrompt } = useTimedPrompt(4500);

  const [newRow, setNewRow] = useState<GrowthStockRow>(createEmptyRow());
  const [newFactorInput, setNewFactorInput] = useState("");
  const [editDrafts, setEditDrafts] = useState<Record<string, GrowthStockRow>>({});
  const [editFactorInputs, setEditFactorInputs] = useState<Record<string, string>>({});
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const setField = (key: keyof GrowthStockRow, value: string) => {
    setNewRow((prev) => ({ ...prev, [key]: value }));
  };

  const addFactor = () => {
    const factor = newFactorInput.trim();
    if (factor && !newRow.growthFactors.includes(factor)) {
      setNewRow((prev) => ({ ...prev, growthFactors: [...prev.growthFactors, factor] }));
      setNewFactorInput("");
    }
  };

  const removeFactor = (factor: string) => {
    setNewRow((prev) => ({ ...prev, growthFactors: prev.growthFactors.filter((f) => f !== factor) }));
  };

  const getDraft = (id: string): GrowthStockRow => {
    if (editDrafts[id]) return editDrafts[id];
    const stock = stocks.find((s) => s.id === id);
    if (!stock) return createEmptyRow();
    return {
      dateOfPost: stock.dateOfPost,
      company: stock.company,
      sector: stock.sector,
      pe: stock.pe,
      growthFactors: [...stock.growthFactors],
      description: stock.description,
    };
  };

  const setDraftField = (id: string, key: keyof GrowthStockRow, value: string) => {
    setEditDrafts((prev) => ({
      ...prev,
      [id]: { ...getDraft(id), [key]: value },
    }));
  };

  const addDraftFactor = (id: string) => {
    const input = (editFactorInputs[id] ?? "").trim();
    if (!input) return;
    const draft = getDraft(id);
    if (!draft.growthFactors.includes(input)) {
      setEditDrafts((prev) => ({
        ...prev,
        [id]: { ...draft, growthFactors: [...draft.growthFactors, input] },
      }));
    }
    setEditFactorInputs((prev) => ({ ...prev, [id]: "" }));
  };

  const removeDraftFactor = (id: string, factor: string) => {
    const draft = getDraft(id);
    setEditDrafts((prev) => ({
      ...prev,
      [id]: { ...draft, growthFactors: draft.growthFactors.filter((f) => f !== factor) },
    }));
  };

  const handleCreate = async () => {
    setBusyKey("create");
    clearPrompt();
    try {
      await createGrowthStock(newRow);
      setNewRow(createEmptyRow());
      setNewFactorInput("");
      showPrompt("Growth stock posted successfully.", "success");
    } catch (error) {
      showPrompt(toFriendlyAppErrorMessage(error, "Failed to post growth stock."), "error");
    } finally {
      setBusyKey(null);
    }
  };

  const handleUpdate = async (id: string) => {
    setBusyKey(`update-${id}`);
    clearPrompt();
    try {
      await updateGrowthStock(id, getDraft(id));
      showPrompt("Growth stock updated.", "success");
    } catch (error) {
      showPrompt(toFriendlyAppErrorMessage(error, "Failed to update growth stock."), "error");
    } finally {
      setBusyKey(null);
    }
  };

  const handleDelete = async (id: string) => {
    setBusyKey(`delete-${id}`);
    clearPrompt();
    try {
      await deleteGrowthStock(id);
      showPrompt("Growth stock deleted.", "success");
    } catch (error) {
      showPrompt(toFriendlyAppErrorMessage(error, "Failed to delete growth stock."), "error");
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <div className="space-y-5">
      {prompt ? <PromptToast message={prompt.message} tone={prompt.tone} /> : null}

      {/* Create new row */}
      <section className="rounded-2xl border border-[#d8e2f5] bg-white p-4 shadow-sm">
        <h3 className="text-lg font-extrabold text-[#173462]">Post New Growth Stock</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <input
            value={newRow.dateOfPost}
            onChange={(e) => setField("dateOfPost", e.target.value)}
            placeholder="Date of Post (e.g. 18 Sept 2026)"
            className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]"
          />
          <input
            value={newRow.company}
            onChange={(e) => setField("company", e.target.value)}
            placeholder="Company Name"
            className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]"
          />
          <input
            value={newRow.sector}
            onChange={(e) => setField("sector", e.target.value)}
            placeholder="Sector"
            className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]"
          />
          <input
            value={newRow.pe}
            onChange={(e) => setField("pe", e.target.value)}
            placeholder="PE Ratio"
            className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]"
          />
          <div className="sm:col-span-2 lg:col-span-2">
            <textarea
              value={newRow.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="Description"
              rows={2}
              className="w-full rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]"
            />
          </div>
        </div>

        <div className="mt-3">
          <p className="text-xs font-bold text-[#6074a0] mb-1.5">Growth Factors</p>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {newRow.growthFactors.map((factor) => (
              <span key={factor} className="inline-flex items-center gap-1 rounded-full border border-[#c5d7f5] bg-[#eef4ff] px-2.5 py-1 text-xs font-semibold text-[#2e5fa3]">
                {factor}
                <button type="button" onClick={() => removeFactor(factor)} className="ml-0.5 text-[#8da0c4] hover:text-[#c24d62]">×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newFactorInput}
              onChange={(e) => setNewFactorInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFactor(); } }}
              placeholder="e.g. Orderbook, Capacity Expansion"
              className="flex-1 rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]"
            />
            <button
              type="button"
              onClick={addFactor}
              className="rounded-lg border border-[#d8e2f5] bg-[#f6f9ff] px-3 py-2 text-xs font-bold text-[#2e7ac9]"
            >
              Add
            </button>
          </div>
        </div>

        <button
          type="button"
          disabled={busyKey !== null}
          onClick={handleCreate}
          className="mt-4 rounded-xl bg-[#2e7ac9] px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Post Growth Stock
        </button>
      </section>

      {/* Manage existing rows */}
      <section className="rounded-2xl border border-[#d8e2f5] bg-white p-4 shadow-sm">
        <h3 className="text-lg font-extrabold text-[#173462]">Manage Growth Stocks</h3>
        {isLoading ? <p className="mt-3 text-sm text-[#6074a0]">Loading...</p> : null}
        <div className="mt-3 space-y-4">
          {stocks.map((stock, index) => {
            const draft = getDraft(stock.id);
            return (
              <div key={stock.id} className="rounded-xl border border-[#e1e8f8] bg-[#fbfdff] p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6074a0]">
                    #{index + 1} | {stock.company} | Updated: {formatDisplayDate(stock.updatedAt)}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={busyKey !== null}
                      onClick={() => handleUpdate(stock.id)}
                      className="rounded-md border border-[#d8e2f5] bg-white px-2 py-1 text-xs font-bold text-[#2e7ac9] disabled:opacity-50"
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      disabled={busyKey !== null}
                      onClick={() => handleDelete(stock.id)}
                      className="rounded-md border border-[#ffd0d8] bg-[#fff5f7] px-2 py-1 text-xs font-bold text-[#c24d62] disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  <input value={draft.dateOfPost} onChange={(e) => setDraftField(stock.id, "dateOfPost", e.target.value)} placeholder="Date of Post" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                  <input value={draft.company} onChange={(e) => setDraftField(stock.id, "company", e.target.value)} placeholder="Company" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                  <input value={draft.sector} onChange={(e) => setDraftField(stock.id, "sector", e.target.value)} placeholder="Sector" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                  <input value={draft.pe} onChange={(e) => setDraftField(stock.id, "pe", e.target.value)} placeholder="PE" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                  <textarea value={draft.description} onChange={(e) => setDraftField(stock.id, "description", e.target.value)} placeholder="Description" rows={2} className="sm:col-span-2 rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                </div>
                <div className="mt-2">
                  <p className="text-xs font-bold text-[#6074a0] mb-1">Growth Factors</p>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {draft.growthFactors.map((factor) => (
                      <span key={factor} className="inline-flex items-center gap-1 rounded-full border border-[#c5d7f5] bg-[#eef4ff] px-2.5 py-1 text-xs font-semibold text-[#2e5fa3]">
                        {factor}
                        <button type="button" onClick={() => removeDraftFactor(stock.id, factor)} className="ml-0.5 text-[#8da0c4] hover:text-[#c24d62]">×</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={editFactorInputs[stock.id] ?? ""}
                      onChange={(e) => setEditFactorInputs((prev) => ({ ...prev, [stock.id]: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addDraftFactor(stock.id); } }}
                      placeholder="Add factor"
                      className="flex-1 rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]"
                    />
                    <button type="button" onClick={() => addDraftFactor(stock.id)} className="rounded-lg border border-[#d8e2f5] bg-[#f6f9ff] px-3 py-2 text-xs font-bold text-[#2e7ac9]">Add</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
