"use client";
import { useState } from "react";
import type { CorporateActionRow } from "@/types/analyzer";

type Props = { actions?: CorporateActionRow[] };

export default function CorporateActions({ actions }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("All");

  let actionsArray = actions;
  if (actions && !Array.isArray(actions) && typeof actions === "object" && "value" in actions) {
    actionsArray = (actions as any).value;
  }

  if (!actionsArray || !Array.isArray(actionsArray) || actionsArray.length === 0) return null;
  const validActions = actionsArray.filter((a) => a != null && typeof a === "object");
  if (validActions.length === 0) return null;

  const tabs = ["All", "Dividend", "Bonus", "Split", "Results"];
  
  const filteredActions = activeTab === "All" 
    ? validActions 
    : validActions.filter(a => String(a.purpose || "").toLowerCase().includes(activeTab.toLowerCase()));

  return (
    <div className="mt-4 flex justify-end">
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-[#d8e2f5] bg-white px-4 py-2 text-sm font-bold text-[#2e7ac9] transition hover:bg-[#f5f8ff]"
      >
        <span>⚡</span> Corporate Actions
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/40 px-4 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div 
            className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#eef3fb] p-6">
              <h2 className="text-xl font-extrabold text-[#173462]">Corporate actions</h2>
              <button onClick={() => setIsOpen(false)} className="text-[#8599c1] hover:text-[#173462]">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex gap-2 border-b border-[#eef3fb] px-6 pt-4 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`border-b-2 px-4 pb-3 text-sm font-bold transition-colors ${
                    activeTab === tab ? "border-[#2e7ac9] text-[#2e7ac9]" : "border-transparent text-[#6074a0] hover:text-[#3d5178]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="overflow-y-auto p-6">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#eef3fb]">
                    <th className="pb-3 pr-4 font-semibold text-[#8599c1]">Date</th>
                    <th className="pb-3 font-semibold text-[#8599c1]">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActions.length > 0 ? (
                    filteredActions.map((row: any, idx) => (
                      <tr key={idx} className="border-b border-[#eef3fb] last:border-0">
                        <td className="py-4 pr-4 align-top">
                          <div className="whitespace-nowrap font-bold text-[#173462]">
                            {row.boardMeetDate ? new Date(row.boardMeetDate).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' }) : "—"}
                          </div>
                        </td>
                        <td className="py-4 align-top">
                          <div className="font-bold text-[#173462]">{row.purpose || "—"}</div>
                          {row.remarks && <div className="mt-1 text-[#6074a0]">{row.remarks}</div>}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="py-8 text-center text-[#8599c1]">No actions found for this category.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
