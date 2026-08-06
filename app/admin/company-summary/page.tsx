"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import AdminGate from "@/components/auth/AdminGate";
import PromptToast from "@/components/ui/PromptToast";
import { useTimedPrompt } from "@/hooks/useTimedPrompt";
import { getCustomCompanySummary, saveCustomCompanySummary, deleteCustomCompanySummary } from "@/lib/services/companySummaryService";
import Link from "next/link";

type StockItem = { id: string; name: string; "bse-code"?: string };

export default function CompanySummaryAdminPage() {
  const [symbol, setSymbol] = useState("");
  const [summaryText, setSummaryText] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Autocomplete states
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { prompt, showPrompt, clearPrompt } = useTimedPrompt(4000);

  // Fetch stocks on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/analyzer/stocks");
        if (!res.ok) return;
        const json = await res.json();
        if (!cancelled && Array.isArray(json.stocks)) {
          setStocks(json.stocks);
        }
      } catch (err) {}
    })();
    return () => { cancelled = true; };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = useMemo(() => {
    const trimmed = symbol.trim().toLowerCase();
    if (trimmed.length < 1) return [];
    return stocks
      .filter((s) => (s.name && s.name.toLowerCase().includes(trimmed)) || (s.id && s.id.toLowerCase().includes(trimmed)))
      .slice(0, 10);
  }, [symbol, stocks]);

  const selectStock = (stock: StockItem) => {
    setSymbol(stock.name || stock.id);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (isOpen && activeIndex >= 0 && filtered[activeIndex]) {
        selectStock(filtered[activeIndex]);
      } else {
        setIsOpen(false);
        handleFetch();
      }
      return;
    }
    if (e.key === "Escape") {
      setIsOpen(false);
      return;
    }
    if (!isOpen || filtered.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    }
  };

  const handleFetch = async () => {
    if (!symbol.trim()) {
      showPrompt("Please enter a company symbol", "error");
      return;
    }
    
    setIsLoading(true);
    clearPrompt();
    
    try {
      const custom = await getCustomCompanySummary(symbol.trim());
      if (custom) {
        setSummaryText(custom);
        setIsCustom(true);
        showPrompt("Loaded custom summary from database.", "success");
      } else {
        const res = await fetch(`/api/analyzer/stock?name=${encodeURIComponent(symbol.trim())}`);
        if (res.ok) {
          const apiData = await res.json();
          // API doesn't have a default summary field, so we just start empty
          setSummaryText("");
          setIsCustom(false);
          showPrompt(`Company found: ${apiData.companyName}. You can now add a summary.`, "success");
        } else {
          showPrompt("Company not found in API. Please check the symbol.", "error");
          setSummaryText("");
          setIsCustom(false);
        }
      }
    } catch (err) {
      showPrompt("An unexpected error occurred", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!symbol.trim() || !summaryText.trim()) {
      showPrompt("Symbol and Summary Text are required", "error");
      return;
    }

    setIsLoading(true);
    clearPrompt();

    try {
      await saveCustomCompanySummary(symbol.trim(), summaryText.trim());
      showPrompt("Custom summary saved successfully!", "success");
      setIsCustom(true);
    } catch (err) {
      showPrompt(err instanceof Error ? err.message : "Failed to save custom summary", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete the summary for ${symbol}?`)) return;

    setIsLoading(true);
    clearPrompt();

    try {
      await deleteCustomCompanySummary(symbol.trim());
      showPrompt("Custom summary deleted successfully!", "success");
      setSummaryText("");
      setIsCustom(false);
    } catch (err) {
      showPrompt(err instanceof Error ? err.message : "Failed to delete custom summary", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminGate>
      <main className="mx-auto w-full max-w-300 flex-1 px-4 py-8 sm:px-6 md:px-8 md:py-10">
        {prompt ? <PromptToast message={prompt.message} tone={prompt.tone} /> : null}

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="bg-linear-to-r from-[#102550] to-[#2d86cc] bg-clip-text font-display text-3xl font-extrabold text-transparent sm:text-4xl">
              Manage Company Summary
            </h1>
            <p className="mt-2 text-sm font-medium text-[#6074a0]">
              Add or edit the custom summary for any company displayed in the analyzer.
            </p>
          </div>
          <Link href="/admin/dashboard">
            <button className="rounded-xl border border-[#d8e2f5] bg-[#f6f9ff] px-5 py-2.5 text-sm font-bold tracking-wide text-[#2e7ac9] transition hover:bg-[#d8e2f5] hover:text-[#173462]">
              Back to Dashboard
            </button>
          </Link>
        </div>

        <section className="relative overflow-hidden rounded-2xl border border-[#d8e2f5] bg-[#ffffff] shadow-2xl sm:rounded-4xl p-6 md:p-8">
          <div className="flex flex-col gap-6 max-w-3xl">
            
            {/* Search Section */}
            <div className="flex flex-col gap-2 relative" ref={wrapperRef}>
              <label className="text-sm font-bold text-[#173462] uppercase tracking-widest">
                Company Symbol (e.g. RELIANCE)
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={symbol}
                    onChange={(e) => {
                      setSymbol(e.target.value.toUpperCase());
                      setIsOpen(true);
                      setActiveIndex(-1);
                    }}
                    onFocus={() => { if (symbol.trim().length >= 1) setIsOpen(true); }}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter Symbol..."
                    className="w-full rounded-xl border border-[#cddcf6] bg-[#f9fbff] px-4 py-3 text-sm font-semibold text-[#173462] focus:border-[#2e7ac9] focus:outline-none focus:ring-1 focus:ring-[#2e7ac9]"
                  />
                  
                  {/* Autocomplete dropdown */}
                  {isOpen && filtered.length > 0 ? (
                    <ul className="absolute left-0 right-0 top-full z-50 mt-2 max-h-60 overflow-y-auto rounded-xl border border-[#d8e2f5] bg-white py-2 shadow-2xl">
                      {filtered.map((stock, idx) => (
                        <li key={stock.id || stock.name}>
                          <button
                            type="button"
                            onClick={() => selectStock(stock)}
                            className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm font-semibold transition ${
                              idx === activeIndex ? "bg-[#eef4ff] text-[#1f66ff]" : "text-[#173462] hover:bg-[#f5f8ff]"
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <p className="truncate">{stock.name}</p>
                              {stock.id && <p className="text-[10px] text-[#8599c1]">{stock.id}</p>}
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                
                <button
                  onClick={handleFetch}
                  disabled={isLoading}
                  className="rounded-xl bg-[#2e7ac9] px-6 py-3 text-sm font-bold text-white shadow-[0_0_15px_rgba(67,83,255,0.4)] transition hover:bg-[#3e8ed6] active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? "Loading..." : "Fetch Info"}
                </button>
              </div>
            </div>

            {/* Editor Section */}
            <div className="flex flex-col gap-2 mt-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-[#173462] uppercase tracking-widest">
                  Summary Text
                </label>
                {isCustom && (
                  <span className="rounded-full bg-[#e3f8ec] px-3 py-1 text-xs font-bold text-[#1c9a5f]">
                    Custom Summary Active
                  </span>
                )}
              </div>
              <textarea
                value={summaryText}
                onChange={(e) => setSummaryText(e.target.value)}
                placeholder="Fetch a symbol first or start typing the custom summary..."
                rows={12}
                className="w-full rounded-xl border border-[#cddcf6] bg-[#f9fbff] px-4 py-4 text-sm font-medium text-[#173462] focus:border-[#2e7ac9] focus:outline-none focus:ring-1 focus:ring-[#2e7ac9] leading-relaxed resize-y"
              />
            </div>

            <div className="mt-4 flex justify-end gap-3">
              {isCustom && (
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="rounded-xl bg-[#FF5B79]/10 border border-[#FF5B79]/50 px-8 py-3 text-sm font-bold text-[#FF5B79] transition hover:bg-[#FF5B79] hover:text-white active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? "Deleting..." : "Delete Summary"}
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={isLoading || !symbol || !summaryText}
                className="rounded-xl bg-[#1c9a5f] px-8 py-3 text-sm font-bold text-white shadow-[0_0_15px_rgba(28,154,95,0.4)] transition hover:bg-[#20b26c] active:scale-95 disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Save Summary"}
              </button>
            </div>

          </div>
        </section>
      </main>
    </AdminGate>
  );
}
