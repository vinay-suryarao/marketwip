"use client";

import { useState } from "react";
import PromptToast from "@/components/ui/PromptToast";
import { useGovPolicies } from "@/hooks/useGovPolicies";
import { useTimedPrompt } from "@/hooks/useTimedPrompt";
import { toFriendlyAppErrorMessage } from "@/lib/helpers/userFacingError";
import {
  createGovPolicy,
  deleteGovPolicy,
  updateGovPolicy,
} from "@/lib/services/govPolicyService";
import type { GovPolicyRow } from "@/types/govPolicy";

function createEmptyRow(): GovPolicyRow {
  return {
    dateOfPost: "",
    department: "",
    headline: "",
    description: "",
    sector: "",
    pibReference: "",
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

export default function GovPolicyForm() {
  const { policies, isLoading } = useGovPolicies();
  const { prompt, showPrompt, clearPrompt } = useTimedPrompt(4500);

  const [newRow, setNewRow] = useState<GovPolicyRow>(createEmptyRow());
  const [editDrafts, setEditDrafts] = useState<Record<string, GovPolicyRow>>({});
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const setField = (key: keyof GovPolicyRow, value: string) => {
    setNewRow((prev) => ({ ...prev, [key]: value }));
  };

  const getDraft = (id: string): GovPolicyRow => {
    if (editDrafts[id]) return editDrafts[id];
    const policy = policies.find((p) => p.id === id);
    if (!policy) return createEmptyRow();
    return {
      dateOfPost: policy.dateOfPost,
      department: policy.department,
      headline: policy.headline,
      description: policy.description,
      sector: policy.sector,
      pibReference: policy.pibReference,
    };
  };

  const setDraftField = (id: string, key: keyof GovPolicyRow, value: string) => {
    setEditDrafts((prev) => ({
      ...prev,
      [id]: { ...getDraft(id), [key]: value },
    }));
  };

  const handleCreate = async () => {
    setBusyKey("create");
    clearPrompt();
    try {
      await createGovPolicy(newRow);
      setNewRow(createEmptyRow());
      showPrompt("Government policy posted successfully.", "success");
    } catch (error) {
      showPrompt(toFriendlyAppErrorMessage(error, "Failed to post policy."), "error");
    } finally {
      setBusyKey(null);
    }
  };

  const handleUpdate = async (id: string) => {
    setBusyKey(`update-${id}`);
    clearPrompt();
    try {
      await updateGovPolicy(id, getDraft(id));
      showPrompt("Policy updated.", "success");
    } catch (error) {
      showPrompt(toFriendlyAppErrorMessage(error, "Failed to update policy."), "error");
    } finally {
      setBusyKey(null);
    }
  };

  const handleDelete = async (id: string) => {
    setBusyKey(`delete-${id}`);
    clearPrompt();
    try {
      await deleteGovPolicy(id);
      showPrompt("Policy deleted.", "success");
    } catch (error) {
      showPrompt(toFriendlyAppErrorMessage(error, "Failed to delete policy."), "error");
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <div className="space-y-5">
      {prompt ? <PromptToast message={prompt.message} tone={prompt.tone} /> : null}

      {/* Create new policy */}
      <section className="rounded-2xl border border-[#d8e2f5] bg-white p-4 shadow-sm">
        <h3 className="text-lg font-extrabold text-[#173462]">Post New Government Policy</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <input
            value={newRow.dateOfPost}
            onChange={(e) => setField("dateOfPost", e.target.value)}
            placeholder="Date (e.g. 19 Sept 2026)"
            className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]"
          />
          <input
            value={newRow.department}
            onChange={(e) => setField("department", e.target.value)}
            placeholder="Department (e.g. Ministry of Electronics & IT)"
            className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]"
          />
          <input
            value={newRow.headline}
            onChange={(e) => setField("headline", e.target.value)}
            placeholder="Headline"
            className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]"
          />
          <input
            value={newRow.sector}
            onChange={(e) => setField("sector", e.target.value)}
            placeholder="Sector (e.g. Semiconductors)"
            className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]"
          />
          <input
            value={newRow.pibReference}
            onChange={(e) => setField("pibReference", e.target.value)}
            placeholder="PIB Reference (e.g. PIB/2026/9/41207)"
            className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]"
          />
          <div className="sm:col-span-2 lg:col-span-3">
            <textarea
              value={newRow.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="Description"
              rows={2}
              className="w-full rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]"
            />
          </div>
        </div>
        <button
          type="button"
          disabled={busyKey !== null}
          onClick={handleCreate}
          className="mt-4 rounded-xl bg-[#2e7ac9] px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Post Policy
        </button>
      </section>

      {/* Manage existing policies */}
      <section className="rounded-2xl border border-[#d8e2f5] bg-white p-4 shadow-sm">
        <h3 className="text-lg font-extrabold text-[#173462]">Manage Policies</h3>
        {isLoading ? <p className="mt-3 text-sm text-[#6074a0]">Loading...</p> : null}
        <div className="mt-3 space-y-4">
          {policies.map((policy, index) => {
            const draft = getDraft(policy.id);
            return (
              <div key={policy.id} className="rounded-xl border border-[#e1e8f8] bg-[#fbfdff] p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6074a0]">
                    #{index + 1} | {policy.headline.slice(0, 40)}... | Updated: {formatDisplayDate(policy.updatedAt)}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={busyKey !== null}
                      onClick={() => handleUpdate(policy.id)}
                      className="rounded-md border border-[#d8e2f5] bg-white px-2 py-1 text-xs font-bold text-[#2e7ac9] disabled:opacity-50"
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      disabled={busyKey !== null}
                      onClick={() => handleDelete(policy.id)}
                      className="rounded-md border border-[#ffd0d8] bg-[#fff5f7] px-2 py-1 text-xs font-bold text-[#c24d62] disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  <input value={draft.dateOfPost} onChange={(e) => setDraftField(policy.id, "dateOfPost", e.target.value)} placeholder="Date" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                  <input value={draft.department} onChange={(e) => setDraftField(policy.id, "department", e.target.value)} placeholder="Department" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                  <input value={draft.headline} onChange={(e) => setDraftField(policy.id, "headline", e.target.value)} placeholder="Headline" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                  <input value={draft.sector} onChange={(e) => setDraftField(policy.id, "sector", e.target.value)} placeholder="Sector" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                  <input value={draft.pibReference} onChange={(e) => setDraftField(policy.id, "pibReference", e.target.value)} placeholder="PIB Reference" className="rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                  <textarea value={draft.description} onChange={(e) => setDraftField(policy.id, "description", e.target.value)} placeholder="Description" rows={2} className="sm:col-span-2 lg:col-span-3 rounded-lg border border-[#d8e2f5] bg-white px-3 py-2 text-sm text-[#173462]" />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
