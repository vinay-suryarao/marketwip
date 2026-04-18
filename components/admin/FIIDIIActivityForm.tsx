"use client";

import React, { useState } from "react";
import { useTimedPrompt } from "@/hooks/useTimedPrompt";
import PromptToast from "@/components/ui/PromptToast";
import { toFriendlyAppErrorMessage } from "@/lib/helpers/userFacingError";
import { updateFIIDIIActivity } from "@/lib/services/fiiDiiService";

export default function FIIDIIActivityForm() {
  const [fiiBusy, setFiiBusy] = useState(false);
  const [fiiValue, setFiiValue] = useState("");
  const [diiValue, setDiiValue] = useState("");
  const { prompt, showPrompt, clearPrompt } = useTimedPrompt(4000);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fiiValue || !diiValue) {
      showPrompt("Please fill in all fields", "error");
      return;
    }

    const fiiNum = parseFloat(fiiValue);
    const diiNum = parseFloat(diiValue);

    if (isNaN(fiiNum) || isNaN(diiNum)) {
      showPrompt("Please enter valid numbers", "error");
      return;
    }

    setFiiBusy(true);
    clearPrompt();

    try {
      // Call Firestore directly from client side
      await updateFIIDIIActivity(fiiNum, diiNum);

      setFiiValue("");
      setDiiValue("");
      showPrompt("FII/DII data updated successfully! Old data removed.", "success");
    } catch (err) {
      console.error("Error:", err);

      // Check if it's a permission error
      if ((err as any)?.code === "permission-denied") {
        showPrompt("Error: Only admins can update FII/DII data", "error");
      } else {
        showPrompt(
          toFriendlyAppErrorMessage(err, "Failed to update FII/DII data"),
          "error"
        );
      }
    } finally {
      setFiiBusy(false);
    }
  };

  return (
    <div className="w-full">
      {prompt ? <PromptToast message={prompt.message} tone={prompt.tone} /> : null}

      <div className="rounded-2xl border border-[#d8e2f5] bg-[#ffffff] p-6 shadow-2xl sm:p-8">
        <div className="mb-6 border-b border-[#d8e2f5] pb-6">
          <h2 className="text-2xl font-extrabold font-display text-[#173462]">
            FII/DII Cash Market Activity
          </h2>
          <p className="mt-2 text-sm text-[#6074a0] font-medium">
            Update the latest FII and DII cash market values. Previous data will be automatically replaced.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* FII Input */}
          <div>
            <label className="mb-2 block text-sm font-bold text-[#173462]">
              FII Cash Market Value
            </label>
            <input
              type="number"
              step="0.01"
              value={fiiValue}
              onChange={(e) => setFiiValue(e.target.value)}
              placeholder="e.g., 672.09 or -150.50"
              className="w-full rounded-lg border border-[#d8e2f5] bg-[#f6f9ff] px-4 py-3 text-[#173462] placeholder-[#6074a0]/50 focus:border-[#2e7ac9] focus:outline-none focus:ring-1 focus:ring-[#2e7ac9] transition font-mono text-lg"
            />
            <p className="mt-1.5 text-xs text-[#6074a0]">
              Enter positive for inflow, negative for outflow
            </p>
          </div>

          {/* DII Input */}
          <div>
            <label className="mb-2 block text-sm font-bold text-[#173462]">
              DII Cash Market Value
            </label>
            <input
              type="number"
              step="0.01"
              value={diiValue}
              onChange={(e) => setDiiValue(e.target.value)}
              placeholder="e.g., 410.05 or -200.75"
              className="w-full rounded-lg border border-[#d8e2f5] bg-[#f6f9ff] px-4 py-3 text-[#173462] placeholder-[#6074a0]/50 focus:border-[#2e7ac9] focus:outline-none focus:ring-1 focus:ring-[#2e7ac9] transition font-mono text-lg"
            />
            <p className="mt-1.5 text-xs text-[#6074a0]">
              Enter positive for inflow, negative for outflow
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={fiiBusy}
              className="w-full rounded-xl bg-linear-to-r from-[#2e7ac9] to-[#3e8ed6] px-6 py-3 text-center font-bold text-white shadow-[0_0_20px_rgba(67,83,255,0.4)] transition hover:from-[#3e8ed6] hover:to-[#7A8DFF] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {fiiBusy ? "Updating..." : "Update FII/DII Data"}
            </button>
          </div>

          {/* Info Box */}
          <div className="rounded-lg border border-[#d8e2f5]/50 bg-[#f6f9ff]/50 p-4">
            <p className="text-xs font-medium text-[#6074a0] leading-relaxed">
              <span className="block font-bold text-[#2e7ac9] mb-1">ℹ️ How it works:</span>
              When you submit this form, the new FII/DII values will replace the previous data. This data will be displayed on the home page in real-time.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
