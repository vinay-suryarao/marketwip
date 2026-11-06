"use client";

import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { useGrowthStocks } from "@/hooks/useGrowthStocks";
import type { GrowthStockRecord } from "@/types/growthStock";

/* ─── Sort configuration types ─── */
type SortColumn = "dateOfPost" | "company" | "sector" | "pe" | "growthFactor";
type SortDirection = "asc" | "desc";

interface SortState {
  column: SortColumn | null;
  direction: SortDirection;
}

/* ─── Filter icon SVG (small Excel-style funnel) ─── */
function FilterIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`ml-1.5 inline-block shrink-0 transition-colors ${active ? "text-[#2e7ac9]" : "text-[#9aabc8]"}`}
    >
      <path
        d="M1.5 2h9L7.25 6.25V9.5L4.75 10.5V6.25L1.5 2Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
        fill={active ? "currentColor" : "none"}
      />
    </svg>
  );
}

/* ─── Parse dd/mm/yyyy date string to comparable value ─── */
function parseDateOfPost(dateStr: string): number {
  // Handles dd/mm/yyyy format
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return new Date(`${year}-${month}-${day}`).getTime();
  }
  // Fallback: try direct parsing
  const ts = new Date(dateStr).getTime();
  return isNaN(ts) ? 0 : ts;
}

/* ─── Sort comparator ─── */
function compareStocks(
  a: GrowthStockRecord,
  b: GrowthStockRecord,
  column: SortColumn,
  direction: SortDirection,
): number {
  let result = 0;

  switch (column) {
    case "dateOfPost": {
      const dateA = parseDateOfPost(a.dateOfPost);
      const dateB = parseDateOfPost(b.dateOfPost);
      result = dateA - dateB;
      break;
    }
    case "company":
      result = a.company.localeCompare(b.company, "en", { sensitivity: "base" });
      break;
    case "sector":
      result = a.sector.localeCompare(b.sector, "en", { sensitivity: "base" });
      break;
    case "pe": {
      const peA = parseFloat(a.pe) || 0;
      const peB = parseFloat(b.pe) || 0;
      result = peA - peB;
      break;
    }
    case "growthFactor": {
      const factorA = a.growthFactors.join(", ");
      const factorB = b.growthFactors.join(", ");
      result = factorA.localeCompare(factorB, "en", { sensitivity: "base" });
      break;
    }
  }

  return direction === "asc" ? result : -result;
}

/* ─── Column filter dropdown ─── */
function ColumnFilter({
  column,
  options,
  sortState,
  onSort,
}: {
  column: SortColumn;
  options: { label: string; direction: SortDirection }[];
  sortState: SortState;
  onSort: (column: SortColumn, direction: SortDirection) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const isActive = sortState.column === column;

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;

    function handleOutsideClick(e: MouseEvent) {
      const target = e.target as Node;
      // Don't close if clicking inside the wrapper (button area) or the dropdown
      if (wrapperRef.current?.contains(target)) return;
      if (dropdownRef.current?.contains(target)) return;
      setOpen(false);
    }

    // Add listener on next tick so the opening click doesn't immediately trigger it
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleOutsideClick);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [open]);

  const handleToggle = useCallback(() => {
    setOpen((prev) => {
      if (!prev && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownPos({ top: rect.bottom + 4, left: rect.left });
      }
      return !prev;
    });
  }, []);

  const handleSelect = useCallback(
    (dir: SortDirection) => {
      onSort(column, dir);
      setOpen(false);
    },
    [column, onSort],
  );

  return (
    <div ref={wrapperRef} className="relative inline-block">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="cursor-pointer rounded p-1 transition-colors hover:bg-[#e0eaf8]"
        aria-label={`Sort ${column}`}
      >
        <FilterIcon active={isActive} />
      </button>

      {open && (
        <div
          ref={dropdownRef}
          className="fixed z-[9999] min-w-[170px] rounded-lg border border-[#d8e2f5] bg-white py-1 shadow-[0_8px_24px_rgba(24,58,120,0.15)]"
          style={{ top: dropdownPos.top, left: dropdownPos.left }}
        >
          {options.map((opt) => {
            const isSelected = isActive && sortState.direction === opt.direction;
            return (
              <button
                key={opt.direction}
                type="button"
                onClick={() => handleSelect(opt.direction)}
                className={`flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-[11px] font-semibold tracking-wide transition-colors ${
                  isSelected
                    ? "bg-[#eef4ff] text-[#2e7ac9]"
                    : "text-[#4a6083] hover:bg-[#f5f8fd]"
                }`}
              >
                {isSelected && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1.5 5.5L4 8L8.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}


/* ─── Column configs ─── */
const COLUMN_FILTERS: {
  column: SortColumn;
  label: string;
  options: { label: string; direction: SortDirection }[];
}[] = [
  {
    column: "dateOfPost",
    label: "Date of Post",
    options: [
      { label: "Newest to Oldest", direction: "desc" },
      { label: "Oldest to Newest", direction: "asc" },
    ],
  },
  {
    column: "company",
    label: "Company",
    options: [
      { label: "A to Z", direction: "asc" },
      { label: "Z to A", direction: "desc" },
    ],
  },
  {
    column: "sector",
    label: "Sector",
    options: [
      { label: "A to Z", direction: "asc" },
      { label: "Z to A", direction: "desc" },
    ],
  },
  {
    column: "pe",
    label: "PE",
    options: [
      { label: "Smaller to Larger", direction: "asc" },
      { label: "Larger to Smaller", direction: "desc" },
    ],
  },
  {
    column: "growthFactor",
    label: "Growth Factor",
    options: [
      { label: "A to Z", direction: "asc" },
      { label: "Z to A", direction: "desc" },
    ],
  },
];

/* ─── Main component ─── */
export default function GrowthStocksDisplay() {
  const { stocks, isLoading } = useGrowthStocks();
  const [sortState, setSortState] = useState<SortState>({ column: null, direction: "desc" });

  const handleSort = useCallback((column: SortColumn, direction: SortDirection) => {
    setSortState((prev) => {
      // Toggle off if same column+direction already selected
      if (prev.column === column && prev.direction === direction) {
        return { column: null, direction: "desc" };
      }
      return { column, direction };
    });
  }, []);

  const sortedStocks = useMemo(() => {
    if (!sortState.column) return stocks;
    return [...stocks].sort((a, b) => compareStocks(a, b, sortState.column!, sortState.direction));
  }, [stocks, sortState]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-[#d8e2f5] bg-white p-6 text-sm font-medium text-[#6074a0]">
        Loading growth stocks...
      </div>
    );
  }

  if (stocks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#d8e2f5] bg-white p-8 text-center text-sm font-medium text-[#6074a0]">
        Growth stocks will appear here once admin publishes data.
      </div>
    );
  }

  return (
    <section className="rounded-3xl border border-[#d8e2f5] bg-white shadow-[0_12px_28px_rgba(24,58,120,0.1)]">
      {/* Header */}
      <div className="px-6 pt-8 pb-6 sm:px-8 sm:pt-10">
        <div className="mx-auto flex w-fit items-center rounded-full border border-[#cddcf6] bg-[#f0f6ff] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#2e7ac9]">
          Growth Watch
        </div>
        <h2 className="mx-auto mt-4 max-w-2xl text-center text-3xl font-extrabold leading-tight text-[#132746] sm:text-4xl">
          Spot the <span className="bg-linear-to-r from-[#1a8a4a] to-[#2d86cc] bg-clip-text text-transparent">growth triggers</span> before the crowd
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm font-medium leading-relaxed text-[#6074a0]">
          Companies with a visible catalyst — capacity expansion, order book, new business, new products and more — organised by sector with PE at a glance.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm">
          <thead>
            <tr className="border-y border-[#d8e2f5] bg-[#f9fbff] text-[11px] uppercase tracking-[0.1em] text-[#6074a0]">
              {COLUMN_FILTERS.map((col) => (
                <th key={col.column} className="px-4 py-3 text-left font-bold">
                  <span className="inline-flex items-center">
                    {col.label}
                    <ColumnFilter
                      column={col.column}
                      options={col.options}
                      sortState={sortState}
                      onSort={handleSort}
                    />
                  </span>
                </th>
              ))}
              <th className="px-4 py-3 text-left font-bold">Description</th>
            </tr>
          </thead>
          <tbody>
            {sortedStocks.map((stock, index) => (
              <tr key={stock.id} className={`border-b border-[#e4ecfb] text-[#173462] ${index % 2 === 0 ? "bg-white" : "bg-[#fcfdff]"}`}>
                <td className="px-4 py-4 text-[#6074a0] text-[13px] font-medium whitespace-nowrap">
                  {stock.dateOfPost}
                </td>
                <td className="px-4 py-4 font-bold text-[#173462] whitespace-nowrap">
                  {stock.company}
                </td>
                <td className="px-4 py-4 text-[13px] text-[#6074a0] font-medium whitespace-nowrap">
                  {stock.sector}
                </td>
                <td className="px-4 py-4 font-bold text-[#173462] whitespace-nowrap">
                  {stock.pe}
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {stock.growthFactors.map((factor) => (
                      <span
                        key={factor}
                        className="inline-block rounded-full border border-[#c5d7f5] bg-[#eef4ff] px-2.5 py-1 text-[11px] font-semibold text-[#2e5fa3] whitespace-nowrap"
                      >
                        {factor}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4 text-[13px] text-[#6074a0] leading-relaxed max-w-[320px]">
                  {stock.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
