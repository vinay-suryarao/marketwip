"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type StockItem = { id: string; name: string; "bse-code"?: string };

export default function AnalyzerSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* fetch stock list on mount */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/analyzer/stocks");
        if (!res.ok) throw new Error("Failed");
        const json = await res.json();
        if (!cancelled && Array.isArray(json.stocks)) {
          setStocks(json.stocks);
        }
      } catch {
        /* silently fail — direct search still works */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  /* close dropdown on outside click */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* filter results */
  const filtered = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (trimmed.length < 1) return [];
    return stocks
      .filter(
        (s) =>
          (s.name && s.name.toLowerCase().includes(trimmed)) ||
          (s.id && s.id.toLowerCase().includes(trimmed)),
      )
      .slice(0, 10);
  }, [query, stocks]);

  function navigateToStock(stock: StockItem) {
    const symbol = stock.name || stock.id;
    setQuery(stock.name);
    setIsOpen(false);
    router.push(`/analyzer/${encodeURIComponent(symbol)}`);
  }

  function handleDirectSearch() {
    const trimmed = query.trim();
    if (trimmed.length === 0) return;

    // If there are filtered results, navigate to the first match
    if (filtered.length > 0) {
      navigateToStock(filtered[0]);
    } else {
      // Direct search by query text
      setIsOpen(false);
      router.push(`/analyzer/${encodeURIComponent(trimmed)}`);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (isOpen && activeIndex >= 0 && filtered[activeIndex]) {
        navigateToStock(filtered[activeIndex]);
      } else {
        handleDirectSearch();
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
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <label htmlFor="analyzer-search" className="sr-only">
        Search NSE/BSE Listed Company
      </label>
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#8da0c4]">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-6 w-6 fill-none stroke-current"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20 L16.5 16.5" />
            </svg>
          </span>
          <input
            ref={inputRef}
            id="analyzer-search"
            type="search"
            autoComplete="off"
            placeholder="Search NSE/BSE Listed Company..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setActiveIndex(-1);
            }}
            onFocus={() => {
              if (query.trim().length >= 1) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            className="h-14 w-full rounded-2xl border border-[#cbdcf7] bg-white pl-14 pr-5 text-base font-medium text-[#173462] shadow-[0_10px_30px_rgba(24,58,120,0.1)] outline-none transition placeholder:text-[#8da0c4] focus:border-[#2e7ac9] focus:ring-4 focus:ring-[#2e7ac9]/15 sm:h-16 sm:text-lg"
          />
        </div>
        <button
          type="button"
          onClick={handleDirectSearch}
          disabled={query.trim().length === 0}
          className="flex h-14 shrink-0 items-center gap-2 rounded-2xl bg-linear-to-r from-[#2d71c4] to-[#3a9ae8] px-6 text-sm font-bold text-white shadow-[0_8px_20px_rgba(45,113,196,0.3)] transition hover:shadow-[0_12px_28px_rgba(45,113,196,0.4)] active:scale-[0.97] disabled:opacity-50 disabled:shadow-none sm:h-16 sm:px-8 sm:text-base"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5 fill-none stroke-current"
            strokeWidth="2.5"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20 L16.5 16.5" />
          </svg>
          Search
        </button>
      </div>

      {/* Loading indicator */}
      {loading && query.trim().length >= 1 ? (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-[#d8e2f5] bg-white p-5 text-center shadow-[0_16px_40px_rgba(24,58,120,0.16)]">
          <p className="text-sm font-semibold text-[#8599c1]">Loading companies...</p>
        </div>
      ) : null}

      {/* Autocomplete dropdown */}
      {!loading && isOpen && filtered.length > 0 ? (
        <ul
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-[#d8e2f5] bg-white py-2 shadow-[0_16px_40px_rgba(24,58,120,0.16)]"
        >
          {filtered.map((stock, idx) => (
            <li
              key={stock.id || stock.name}
              role="option"
              aria-selected={idx === activeIndex}
            >
              <button
                type="button"
                onClick={() => navigateToStock(stock)}
                className={`flex w-full items-center gap-3 px-5 py-3 text-left text-sm font-semibold transition ${
                  idx === activeIndex
                    ? "bg-[#eef4ff] text-[#1f66ff]"
                    : "text-[#173462] hover:bg-[#f5f8ff]"
                }`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eef3ff] text-xs font-bold text-[#2e7ac9]">
                  {stock.name.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate">{stock.name}</p>
                  {stock.id ? (
                    <p className="text-[11px] text-[#8599c1]">{stock.id}</p>
                  ) : null}
                </div>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {/* No results message */}
      {!loading && isOpen && query.trim().length >= 2 && filtered.length === 0 && stocks.length > 0 ? (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-[#d8e2f5] bg-white p-5 text-center shadow-[0_16px_40px_rgba(24,58,120,0.16)]">
          <p className="text-sm font-semibold text-[#8599c1]">
            No match found. Press <kbd className="rounded bg-[#eef3ff] px-1.5 py-0.5 text-[#2e7ac9]">Enter</kbd> to search directly.
          </p>
        </div>
      ) : null}
    </div>
  );
}
