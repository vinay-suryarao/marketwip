"use client";

import { useState } from "react";
import type { CorporateActionRow } from "@/types/analyzer";

type Props = { actions?: CorporateActionRow[] };

const TABS = ["Equity History", "ESOPs", "Prefs", "Dividend", "Bonus", "Merger", "Right", "Buy Back"];

export default function CorporateActions({ actions }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Equity History");

  let actionsArray = actions;
  if (actions && !Array.isArray(actions) && typeof actions === "object" && "value" in actions) {
    actionsArray = (actions as any).value;
  }

  const validActions = Array.isArray(actionsArray)
    ? actionsArray.filter((a) => a != null && typeof a === "object")
    : [];

  const filteredActions = activeTab === "Equity History"
    ? validActions
    : validActions.filter((a) => {
        const purpose = String(a.purpose || a.type || a.action || "").toLowerCase();
        const tabLower = activeTab.toLowerCase();
        return purpose.includes(tabLower) || purpose.includes(tabLower.replace(" ", ""));
      });

  // Always show the button (even without data)
  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-lg border border-[#6366f1] bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#4f46e5] transition hover:bg-[#eef2ff]"
      >
        CORPORATE ACTIONS
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-xs"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#eef3fb] px-6 py-5">
              <h2 className="text-xl font-extrabold text-[#173462] sm:text-2xl">Corporate actions</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-[#8599c1] hover:text-[#173462] transition"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-[#eef3fb] px-6 pt-3 overflow-x-auto">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap border-b-2 px-3 pb-3 text-xs sm:text-sm font-semibold transition-colors ${
                    activeTab === tab
                      ? "border-[#4f46e5] text-[#4f46e5]"
                      : "border-transparent text-[#6074a0] hover:text-[#3d5178]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-6">
              {validActions.length > 0 ? (
                <>
                  {/* Column Headers */}
                  <div className="mb-2 flex border-b border-[#eef3fb] pb-2 text-xs font-semibold text-[#8599c1]">
                    <span className="w-24 shrink-0">Date</span>
                    <span className="flex-1">Details</span>
                  </div>

                  {filteredActions.length > 0 ? (
                    <div className="space-y-0">
                      {filteredActions.map((row: any, idx: number) => {
                        const dateStr = row.date || row.boardMeetDate || row.recordDate || "";
                        let year = "";
                        let monthDay = "";
                        if (dateStr) {
                          const d = new Date(dateStr);
                          if (!isNaN(d.getTime())) {
                            year = String(d.getFullYear());
                            monthDay = d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
                          }
                        }

                        return (
                          <div key={idx} className="flex border-b border-[#eef3fb] py-3.5 last:border-0">
                            <div className="w-24 shrink-0">
                              {year ? (
                                <>
                                  <p className="text-sm font-bold text-[#173462]">{year}</p>
                                  <p className="text-xs text-[#8599c1]">{monthDay}</p>
                                </>
                              ) : (
                                <p className="text-sm text-[#8599c1]">—</p>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-[#173462]">
                                {row.type || row.purpose || row.action || "—"}
                              </p>
                              {(row.details || row.remarks || row.description) && (
                                <p className="mt-0.5 text-xs sm:text-sm text-[#6074a0]">
                                  {row.details || row.remarks || row.description}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="py-8 text-center text-sm text-[#8599c1]">No actions found for &quot;{activeTab}&quot;.</p>
                  )}
                </>
              ) : (
                /* Empty state for free plan */
                <div className="flex flex-col items-center justify-center py-16">
                  <svg className="mb-3 h-12 w-12 text-[#b0c4e8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p className="text-sm font-bold text-[#6074a0]">Corporate actions data not available</p>
                  <p className="mt-1 text-xs text-[#8599c1]">
                    This data will appear automatically when available in your FinEdge plan.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
